import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
import { AreaContent, Faq, GalleryItem, Inquiry, Project, Unit } from "./types";
import { buildSeedUnits } from "./units-seed";
import { mergePptPricing } from "./unit-pricing";
import { DEFAULT_OPERATING_PINS, type OperatingPin } from "./operating-pins";
import { mergeUnitPins, type UnitPinRecord } from "./unit-pins";
import {
  emptyDesignMarkerOverrides,
  sanitizeDesignMarkerOverrides,
  type DesignMarkerOverrides,
} from "./design-markers";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Vercel의 서버리스 프로덕션 환경은 배포된 코드 폴더가 읽기 전용이라
 * 로컬 fs.writeFile은 프로덕션에서 항상 실패한다. BLOB_READ_WRITE_TOKEN이
 * 설정돼 있으면(Vercel Blob 연결됨) 쓰기는 Blob으로, 없으면(로컬 개발)
 * 기존처럼 로컬 fs로 처리한다.
 */
function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/** 로컬 파일은 읽기 전용으로만 사용 — Vercel 프로덕션에서도 배포된 번들 읽기는 항상 가능하다 */
async function readLocalFile<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function readJson<T>(file: string, fallback: () => T): Promise<T> {
  if (blobEnabled()) {
    try {
      const result = await get(file, { access: "private", useCache: false });
      if (result) {
        const text = await new Response(result.stream).text();
        return JSON.parse(text) as T;
      }
    } catch {
      // Blob 조회 실패 — 아래에서 시드 데이터로 폴백
    }
    // Blob에 아직 없음(최초 1회) — 저장소에 커밋된 실제 데이터로 시드하고 Blob에 기록
    const seed = (await readLocalFile<T>(file)) ?? fallback();
    await writeJson(file, seed);
    return seed;
  }

  await ensureDir();
  const local = await readLocalFile<T>(file);
  if (local) return local;
  const data = fallback();
  await writeJson(file, data);
  return data;
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  if (blobEnabled()) {
    await put(file, JSON.stringify(data, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  await ensureDir();
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf8");
}

function now() {
  return new Date().toISOString();
}

function defaultProject(): Project {
  return {
    id: "songdo-hanulche-ivyone-retail",
    projectName: "송도 하늘채 아이비원",
    subtitle: "송도 아이비원 주상복합 단지 내 상가 · IVYSQUARE",
    address: "인천광역시 연수구 송도동 20-4일원",
    scaleFloors: "지하1층 지상(1층~2층)",
    housingUnits: 336,
    commercialUnitsTotal: 160,
    commercialUnitsForSale: 107,
    zoningDistrict: "준주거지역, 제1종지구단위계획구역(어민생활대책단지), 경제자유구역",
    usageLabel: "공동주택(336세대) 및 근린생활시설(160실)",
    siteAreaM2: 12293.3,
    siteAreaPy: 3719,
    totalFloorAreaM2: 62395.35,
    totalFloorAreaPy: 18858,
    parkingTotal: 517,
    parkingResidential: 380,
    parkingCommercial: 137,
    developers: ["코오롱글로벌(주)", "코오롱하우스비전"],
    brand: "하늘채(HANULCHE)",
    exclusiveRatioRemainingPct: 49.05,
    floorSummaries: [
      {
        floor: "2F",
        shopCount: 51,
        exclusiveAreaPy: 1116.1,
        contractAreaPy: 2275.6,
        exclusiveRatioPct: 49.05,
        mdConcept:
          "교육·케어 수요가 모이는 층. 학원·메디컬·여성뷰티·금융 서비스로 생활 밀착형 상권을 엽니다.",
        recommendedBusinesses: "학원, 메디컬, 여성뷰티, 금융 서비스",
      },
      {
        floor: "1F",
        shopCount: 50,
        exclusiveAreaPy: 691.1,
        contractAreaPy: 1409.1,
        exclusiveRatioPct: 49.05,
        mdConcept:
          "140m 스트리트몰과 맞닿은 노출층. 앵커 테넌트와 리테일·식음이 시선을 붙잡습니다.",
        recommendedBusinesses: "리테일·서비스, 식음, 카페·베이커리, 생활편의",
      },
      {
        floor: "B1",
        shopCount: 6,
        exclusiveAreaPy: 232.3,
        contractAreaPy: 473.7,
        exclusiveRatioPct: 49.05,
        mdConcept:
          "대형 공간으로 여는 엔터테인먼트·체류형 층. 머무는 시간이 곧 매출이 됩니다.",
        recommendedBusinesses: "교습소, 운동·체육 레저, 공방, 스튜디오",
      },
    ],
    salesSchedule: [],
    salesTerms: "",
    notices:
      "※ 임대 가능 호실은 2026년 7월 기준이며, 임대 진행 상황에 따라 변경될 수 있습니다.\n※ 본 홍보물의 MD 구성·이미지·도면은 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있으므로, 계약 전 반드시 확인하시기 바랍니다.\n※ 홍보물 CG·일러스트·지역도 및 개발계획은 관계기관 사정에 따라 변경·취소될 수 있습니다.",
    prCenterName: "송도 하늘채 아이비원 홍보관",
    prCenterAddress: "인천광역시 연수구 컨벤시아대로42번길 21, B동 1층 105호",
    prCenterPhone: "",
    prCenterHours: "",
    prCenterMapUrl: "",
    heroEyebrow: "SONGDO HANULCHE · IVYSQUARE",
    heroBrandLine: "아이비스퀘어 · 송도 하늘채 아이비원",
    heroHeadline: "송도가 기다려온 최상위권 복합상업시설",
    heroSubcopy:
      "‘송도의 대치동’ 아이비 학원가와 인근 약 1만 6천여 배후세대, 약 140m 스트리트몰이 한곳에서 만납니다.",
    heroAccentLine: "THE CENTER OF EDUCATION — 아이비스퀘어",
    heroCtaPrimary: "호실·도면 보기",
    heroCtaSecondary: "상담 신청하기",
    heroSlides: [
      {
        id: "slide-1",
        image: "/images/hero-banner-poster.jpg",
        video: "/videos/hero-banner.mp4",
        caption: "송도가 기다려온 최상위권 복합상업시설 (영상)",
      },
      {
        id: "slide-2",
        image: "/images/hero-exterior.jpg",
        caption: "밝은 외관 + 가운데 큰 문구 워시 디자인",
        overlay: {
          statLines: [
            "16,000여 배후세대의 스케일도",
            "140m 스트리트 상가의 퀄리티도",
            "280여개 학원가 교육의 클래스도",
          ],
          headlinePrefix: "송도가 기다려온",
          headlineBig: "최상위권",
          brandLine: "송도 하늘채 아이비원",
          badge: "단지 내 상가",
        },
      },
      {
        id: "slide-3",
        image: "/images/hero-main.jpg",
        caption: "노을 외관 + 좌측 정렬 문구 디자인",
        overlay: {
          style: "left",
          statLines: [],
          headlinePrefix: "송도가 기다려온",
          headlineBig: "최상위권 복합상업시설",
          brandLine: "송도 하늘채 아이비원",
          badge: "단지 내 상가",
        },
      },
      { id: "slide-4", image: "/images/marketing/ivysquare-twilight.jpg", caption: "송도의 새로운 랜드마크, 아이비스퀘어" },
    ],
    updatedAt: now(),
  };
}

function defaultFaqs(): Faq[] {
  const nowIso = now();
  return [
    {
      id: "faq-unit-1",
      category: "unit",
      question: "분양 가능 호실은 몇 실이며, 층·동별로 어떻게 나뉘나요?",
      answer:
        "전체 근린생활시설 160실 중 107실이 분양(임대) 가능합니다. (2026년 7월 기준)\n\n층별 잔여 호실 수\n· 2층(2F): 51실\n· 1층(1F): 50실\n· 지하1층(B1): 6실\n\n호실은 A동(301동)·B동(302동)으로 구분되며, 호실·도면에서 층·동·호수로 확인할 수 있습니다.\n(세부 호실 현황은 관리자에서 상태·분양가 업데이트 시 최신 기준으로 반영됩니다.)",
      sortOrder: 1,
      published: true,
      updatedAt: nowIso,
    },
    {
      id: "faq-contract-1",
      category: "contract",
      question: "계약금·중도금·잔금 비율과 계약 절차는 어떻게 되나요?",
      answer:
        "계약금·중도금·잔금 비율 및 계약 절차는 분양 안내문 기준으로 안내드립니다.\n자세한 내용은 상담 신청 또는 홍보관으로 문의해 주세요.\n\n※ 이 답변은 관리자 페이지(FAQ)에서 수정할 수 있습니다.",
      sortOrder: 2,
      published: true,
      updatedAt: nowIso,
    },
    {
      id: "faq-tax-1",
      category: "tax",
      question: "상가 분양 시 취득세·부가세 등 주요 세금 항목은 무엇인가요?",
      answer:
        "상가(근린생활시설) 취득 시에는 일반적으로 취득세, 부가가치세, 지방교육세 등 관련 세금이 발생할 수 있습니다.\n세율·과세 표준·납부 시기는 계약 조건과 관련 법령·관할 관청 기준에 따르며, 개별 상담으로 안내드립니다.\n\n※ 이 답변은 관리자 페이지(FAQ)에서 수정할 수 있습니다.",
      sortOrder: 3,
      published: true,
      updatedAt: nowIso,
    },
    {
      id: "faq-movein-1",
      category: "move_in",
      question: "입주(또는 인도) 예정 시점과 인테리어 착수 가능 시기는 언제인가요?",
      answer:
        "입주(인도) 예정일과 인테리어 착수 가능 시기는 분양 일정·공사 진행에 따라 달라질 수 있습니다.\n최신 일정은 분양안내 페이지 또는 상담을 통해 확인해 주세요.\n\n※ 일정 확정 시 관리자 페이지(프로젝트·FAQ)에서 본문을 업데이트해 주세요.",
      sortOrder: 4,
      published: true,
      updatedAt: nowIso,
    },
    {
      id: "faq-parking-1",
      category: "parking",
      question: "근린생활시설 주차(137대)는 호실별 배정인가요, 공용인가요?",
      answer:
        "단지 개요 기준 주차는 총 517대(공동주택 380대 / 근린생활시설 137대)입니다.\n호실별 전용 배정 여부·이용 규칙은 분양·관리 기준에 따르며, 상세는 상담으로 안내드립니다.\n\n※ 배정 방식이 확정되면 관리자 페이지(FAQ)에서 이 답변을 수정해 주세요.",
      sortOrder: 5,
      published: true,
      updatedAt: nowIso,
    },
    {
      id: "faq-rights-1",
      category: "rights",
      question:
        "전용면적·계약면적·전용률(49.05%) 산정 기준과 공용 부분은 어떻게 구분되나요?",
      answer:
        "잔여 호실(근생) 집계 기준 전용률은 49.05%입니다.\n\n층별 면적 요약(전용 / 계약, PY)\n· 2F: 1,116.1 / 2,275.6\n· 1F: 691.1 / 1,409.1\n· B1: 232.3 / 473.7\n· 합계: 2,039.6 / 4,158.4\n\n호실별 전용면적은 호실·도면에서 확인할 수 있으며, 계약면적·공용부분 상세 산정은 분양 계약서·관리규약 기준을 따릅니다.\n\n※ 상세 산정 설명이 확정되면 관리자 페이지(FAQ)에서 보완해 주세요.",
      sortOrder: 6,
      published: true,
      updatedAt: nowIso,
    },
  ];
}

function defaultArea(): AreaContent {
  return {
    positioningHeadline: "‘송도의 대치동’ — 1공구 중심 상권 · THE CENTER OF EDUCATION",
    points: [
      {
        title: "송도 최고수준 학원가",
        body: "교육 시설 밀집과 학생 중심 소비수요가 풍부한 아이비 학원가. 채드윅송도국제학교·포스코고 등 수도권 최고 스쿨존과 맞닿아 있습니다.",
      },
      {
        title: "고소득 배후수요 기반 소비 상권",
        body: "인근 고소득 대단지 거주민의 높은 소득·소비력이 상권을 지탱합니다. 주거밀집 배후와 학원상권이 한 자리에서 겹칩니다.",
      },
      {
        title: "센트럴파크 연계 여가·문화 상권",
        body: "센트럴파크·아트센터 등 외부 방문객 유입으로 체류·여가 수요까지 확보합니다. 상주 수요와 방문 수요가 함께 흐르는 입지입니다.",
      },
    ],
    districts: [
      {
        name: "대상지 상권",
        traits: [
          "교육시설을 중심으로 형성된 안정적인 근린 상권입니다.",
          "인근 약 1.6만 세대의 거주 수요와 꾸준한 교육 수요가 상시 유동을 지탱합니다.",
          "학생과 학부모의 반복 방문이 만드는 생활 밀착형 상권입니다.",
          "GTX-B(공사중) 등 미래 교통 호재가 상권 확장 기대를 더합니다.",
        ],
      },
      {
        name: "캠퍼스타운역 상권",
        traits: [
          "근린생활시설을 중심으로 소비 수요가 형성된 상권입니다.",
          "대학생과 1~2인 가구의 소비 패턴이 상권 구조에 그대로 반영됩니다.",
          "음식점·카페·PC방 등 저렴하고 접근성 좋은 업종이 밀집해 있습니다.",
        ],
      },
      {
        name: "테크노파크역 상권",
        traits: [
          "송도를 대표하는 상업과 문화 기능이 결합된 복합 상권입니다.",
          "대형 유통시설을 중심으로 외부 유입이 활발하게 이루어집니다.",
          "대형 아울렛과 멀티플렉스, 다양한 F&B 브랜드가 밀집해 있습니다.",
        ],
      },
      {
        name: "인천대입구역 상권",
        traits: [
          "다양한 개발 호재를 보유해 광역 비즈니스 상권으로의 성장이 기대됩니다.",
          "GTX-B 출발점(예정)과 인근 업무시설·주거 단지가 수요를 뒷받침합니다.",
          "평일에는 업무 수요가, 주말에는 행사·방문 수요가 함께 나타나는 구조입니다.",
        ],
      },
      {
        name: "센트럴파크 상권",
        traits: [
          "여가·휴식 수요와 소비 기능이 결합된 복합 문화 상권입니다.",
          "센트럴파크와 아트센터 이용객을 기반으로 체류 시간이 긴 이용 패턴이 나타납니다.",
          "가족 단위 방문객을 중심으로 여가와 소비 수요가 함께 이어집니다.",
        ],
      },
      {
        name: "달빛축제공원 상권",
        traits: [
          "대규모 주거 배후를 기반으로 소비가 이루어지는 생활 밀착형 상권입니다.",
          "배후 주거지의 고정 수요가 상권을 꾸준히 지탱하는 구조입니다.",
          "학원가·공원 길목과 이어지는 근린생활시설이 주를 이룹니다.",
        ],
      },
    ],
  };
}

export const store = {
  getProject: async () => {
    const data = await readJson("project.json", defaultProject);
    const base = defaultProject();
    // 구버전 JSON에 없는 배너 필드 보완
    return {
      ...base,
      ...data,
      heroEyebrow: data.heroEyebrow ?? base.heroEyebrow,
      heroBrandLine: data.heroBrandLine ?? base.heroBrandLine,
      heroHeadline: data.heroHeadline || base.heroHeadline,
      heroSubcopy: data.heroSubcopy || base.heroSubcopy,
      heroAccentLine: data.heroAccentLine ?? base.heroAccentLine,
      heroCtaPrimary: data.heroCtaPrimary ?? base.heroCtaPrimary,
      heroCtaSecondary: data.heroCtaSecondary ?? base.heroCtaSecondary,
      /** slide-4(아이비스퀘어 야경)는 관리자 요청으로 배너에서 제외 — 이후 관리자 페이지에서 새로 추가하는 슬라이드는 영향 없음 */
      heroSlides: (data.heroSlides && data.heroSlides.length > 0 ? data.heroSlides : base.heroSlides).filter(
        (s) => s.id !== "slide-4",
      ),
      usageLabel: data.usageLabel ?? base.usageLabel,
      siteAreaM2: data.siteAreaM2 ?? base.siteAreaM2,
      totalFloorAreaM2: data.totalFloorAreaM2 ?? base.totalFloorAreaM2,
      parkingTotal: data.parkingTotal ?? base.parkingTotal,
      /** 근생(상가) 판매 대상 층 기준으로 표기 — 관리자 요청으로 전체 동 층수 대신 고정 문구 사용 */
      scaleFloors: base.scaleFloors,
      /** 관리자 요청 문구로 고정 — 기존 Blob 저장 데이터의 예전 문구를 덮어씀 */
      zoningDistrict: base.zoningDistrict,
    } as Project;
  },
  saveProject: (data: Project) =>
    writeJson("project.json", { ...data, updatedAt: now() }),

  getUnits: async () => {
    const units = await readJson("units.json", buildSeedUnits);
    return units.map(mergePptPricing);
  },
  saveUnits: (data: Unit[]) => writeJson("units.json", data),

  getFaqs: () => readJson("faqs.json", defaultFaqs),
  saveFaqs: (data: Faq[]) => writeJson("faqs.json", data),

  getGallery: () =>
    readJson<GalleryItem[]>("gallery.json", () => [
      {
        id: "gal-1",
        category: "exterior",
        title: "외관 투시도",
        imageUrl: "",
        caption: "표지 렌더 — 이미지 URL을 관리자에서 등록하세요.",
        sortOrder: 1,
      },
      {
        id: "gal-2",
        category: "aerial",
        title: "단지 조감",
        imageUrl: "",
        caption: "사업개요 조감도",
        sortOrder: 2,
      },
    ]),
  saveGallery: (data: GalleryItem[]) => writeJson("gallery.json", data),

  getArea: () => readJson("area.json", defaultArea),
  saveArea: (data: AreaContent) => writeJson("area.json", data),

  getInquiries: () => readJson<Inquiry[]>("inquiries.json", () => []),
  saveInquiries: (data: Inquiry[]) => writeJson("inquiries.json", data),

  getOperatingPins: () => readJson<OperatingPin[]>("operating-pins.json", () => DEFAULT_OPERATING_PINS),
  saveOperatingPins: (data: OperatingPin[]) => writeJson("operating-pins.json", data),

  getUnitPins: async () => mergeUnitPins(await readJson<UnitPinRecord[]>("unit-pins.json", () => [])),
  saveUnitPins: (data: UnitPinRecord[]) => writeJson("unit-pins.json", data),

  getDesignMarkerOverrides: async () =>
    sanitizeDesignMarkerOverrides(
      await readJson<DesignMarkerOverrides>("design-marker-overrides.json", emptyDesignMarkerOverrides),
    ),
  saveDesignMarkerOverrides: (data: DesignMarkerOverrides) =>
    writeJson("design-marker-overrides.json", sanitizeDesignMarkerOverrides(data)),
};

export async function getPublicUnits() {
  const units = await store.getUnits();
  return units
    .filter((u) => u.status !== "hidden")
    .map((u) => (u.priceHidden ? { ...u, price: null } : u));
}
