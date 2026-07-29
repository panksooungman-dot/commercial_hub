import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { AreaContent, Faq, GalleryItem, Inquiry, Project, Unit } from "./types";
import { buildSeedUnits } from "./units-seed";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: () => T): Promise<T> {
  await ensureDir();
  const full = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    const data = fallback();
    await fs.writeFile(full, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
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
    subtitle: "송도 아이비원 주상복합 단지 내 상가",
    address: "인천 연수구 송도동 20-4~11 (총 8필지)",
    scaleFloors: "지하3층 / 지상10층",
    housingUnits: 336,
    commercialUnitsTotal: 161,
    commercialUnitsForSale: 107,
    zoningDistrict: "준주거지역",
    usageLabel: "공동주택(336세대) 및 근린생활시설(161호실)",
    siteAreaM2: 12293.3,
    siteAreaPy: 3718.72,
    totalFloorAreaM2: 62395.35,
    totalFloorAreaPy: 18874.59,
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
        mdConcept: "병원·학원이 모이는, 송도의 생활 밀착형 서비스층",
        recommendedBusinesses: "병원, 학원, 서비스",
      },
      {
        floor: "1F",
        shopCount: 50,
        exclusiveAreaPy: 691.1,
        contractAreaPy: 1409.1,
        exclusiveRatioPct: 49.05,
        mdConcept: "시선이 머무는 1층, 앵커와 리테일이 만드는 스트리트 상권",
        recommendedBusinesses: "앵커 테넌트, 리테일",
      },
      {
        floor: "B1",
        shopCount: 6,
        exclusiveAreaPy: 232.3,
        contractAreaPy: 473.7,
        exclusiveRatioPct: 49.05,
        mdConcept: "넓은 면적으로 여는 목적형 상권, 머무름이 매출이 되는 층",
        recommendedBusinesses: "헬스장 등",
      },
    ],
    salesSchedule: [],
    salesTerms: "",
    notices: "",
    prCenterName: "송도 하늘채 아이비원 홍보관",
    prCenterAddress: "",
    prCenterPhone: "",
    prCenterHours: "",
    prCenterMapUrl: "",
    heroEyebrow: "Ivy Square · Commercial",
    heroBrandLine: "아이비스퀘어 · 송도 하늘채 아이비원",
    heroHeadline: "투자 가치의 스케일이 다르다",
    heroSubcopy:
      "약 1만 5천여 세대와 7개 학교, 수도권 대표 학원가를 품은 자리. 약 140m 그랜드 스트리트몰의 주목성 위에 한 수 위 공간 설계를 더했습니다.",
    heroAccentLine: "송도학원가 랜드마크 상가 — 아이비스퀘어",
    heroCtaPrimary: "분양 정보 보기",
    heroCtaSecondary: "상담 신청하기",
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
        "전체 근린생활시설 161호실 중 107실이 분양 가능합니다.\n\n층별 잔여 호실 수\n· 2층(2F): 51실\n· 1층(1F): 50실\n· 지하1층(B1): 6실\n\n호실은 A동·B동으로 구분되며, 호실·도면에서 층·동·호수로 확인할 수 있습니다.\n(세부 호실 현황은 관리자에서 상태·분양가 업데이트 시 최신 기준으로 반영됩니다.)",
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
    positioningHeadline:
      "학원가·고소득 배후주거·센트럴파크가 겹치는 1공구, '송도의 대치동'이라 불리는 이유",
    points: [
      {
        title: "송도 최고 수준의 학원가",
        body: "채드윅 국제학교와 우수 공립학교가 가까이 자리해 학생과 학부모의 발걸음이 매일 이어집니다. 교육시설이 밀집한 만큼 소비 수요도 여러 방향으로 넓어지고 있습니다.",
      },
      {
        title: "고소득 배후수요가 만드는 소비력",
        body: "송도 1세대를 대표하는 랜드마크 아파트가 밀집해 있어 배후 세대의 소득 수준과 소비력이 높습니다. 이 구매력은 단지 안에 머물지 않고 주변 상권 전체로 이어집니다.",
      },
      {
        title: "센트럴파크가 이어주는 여가 상권",
        body: "상권 남쪽으로 송도를 대표하는 센트럴파크가 맞닿아 있어 공원을 찾는 발걸음이 자연스럽게 상권으로 이어집니다. 체류 시간이 길어질수록 여가·문화 업종의 다양성도 함께 넓어집니다.",
      },
    ],
    districts: [
      {
        name: "대상지 상권",
        traits: [
          "교육시설을 중심으로 형성된 안정적인 근린 상권입니다.",
          "인근 약 1.6만 세대의 거주 수요와 꾸준한 교육 수요가 상시 유동을 지탱합니다.",
          "학생과 학부모의 반복 방문이 만드는 생활 밀착형 상권입니다.",
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
          "외부 유입보다는 고정 수요를 겨냥한 근린생활시설이 주를 이룹니다.",
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
      usageLabel: data.usageLabel ?? base.usageLabel,
      siteAreaM2: data.siteAreaM2 ?? base.siteAreaM2,
      totalFloorAreaM2: data.totalFloorAreaM2 ?? base.totalFloorAreaM2,
      parkingTotal: data.parkingTotal ?? base.parkingTotal,
    } as Project;
  },
  saveProject: (data: Project) =>
    writeJson("project.json", { ...data, updatedAt: now() }),

  getUnits: () => readJson("units.json", buildSeedUnits),
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
};

export async function getPublicUnits() {
  const units = await store.getUnits();
  return units.filter((u) => u.status !== "hidden");
}
