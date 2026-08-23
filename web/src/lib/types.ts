export type Building = "A" | "B";
export type Floor = "2F" | "1F" | "B1";
export type UnitStatus = "available" | "for_lease" | "reserved" | "sold" | "move_in" | "hidden";

export type FloorSummary = {
  floor: Floor;
  shopCount: number;
  exclusiveAreaPy: number;
  contractAreaPy: number;
  exclusiveRatioPct: number;
  mdConcept: string;
  recommendedBusinesses: string;
};

export type ScheduleItem = {
  id: string;
  title: string;
  dateLabel: string;
  description: string;
  sortOrder: number;
};

/**
 * 슬라이드 전용 문구 오버레이 — 이 값이 있으면 해당 슬라이드는 공통 좌측 문구 대신
 * 사진 위에 문구를 직접 얹는 전용 디자인으로 표시된다.
 * style "centered": 가운데 정렬, headlineBig을 큰 글자로 분리 표시 (밝은 워시 처리)
 * style "left": 좌측 정렬, brandLine을 큰 포인트 컬러 글자로 표시
 */
export type HeroSlideOverlayStyle = "centered" | "left";

export type HeroSlideOverlay = {
  style?: HeroSlideOverlayStyle;
  statLines: string[];
  headlinePrefix: string;
  headlineBig: string;
  brandLine: string;
  badge: string;
};

/** 메인 배너 슬라이더 한 장 — 이미지/영상 경로는 /images(/videos)/... 또는 전체 URL. video가 있으면 해당 슬라이드는 영상으로 재생되고 image는 그 포스터(로딩 중 표시)로 쓰인다 */
export type HeroSlide = {
  id: string;
  image: string;
  video?: string;
  caption: string;
  overlay?: HeroSlideOverlay;
};

export type Project = {
  id: string;
  projectName: string;
  subtitle: string;
  address: string;
  scaleFloors: string;
  housingUnits: number;
  commercialUnitsTotal: number;
  commercialUnitsForSale: number;
  zoningDistrict: string;
  usageLabel: string;
  siteAreaM2: number;
  siteAreaPy: number;
  totalFloorAreaM2: number;
  totalFloorAreaPy: number;
  parkingTotal: number;
  parkingResidential: number;
  parkingCommercial: number;
  developers: string[];
  brand: string;
  exclusiveRatioRemainingPct: number;
  floorSummaries: FloorSummary[];
  /** 관리자에서 수정 — PDF에 없던 항목 */
  salesSchedule: ScheduleItem[];
  salesTerms: string;
  notices: string;
  prCenterName: string;
  prCenterAddress: string;
  prCenterPhone: string;
  prCenterHours: string;
  prCenterMapUrl: string;
  /** 메인 배너 문구 — 관리자에서 수정 */
  heroEyebrow: string;
  heroBrandLine: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroAccentLine: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroSlides: HeroSlide[];
  updatedAt: string;
};

export type DealType = "lease" | "sale" | "sublease";
export type PropertyType = "상가" | "점포" | "사무실" | "지식산업센터" | "빌딩" | "기타";
export type ListingVisibility = "public" | "broker_only" | "private";
export type MoveInType = "immediate" | "negotiable" | "date";
export type ParkingFeeType = "paid" | "free";

/** 중개사무소 매물 등록 정보 — 어드민 호실 관리 상세정보 입력 */
export type ListingDetail = {
  dealType: DealType | "";
  propertyType: PropertyType | "";
  listingAddress: string;
  visibility: ListingVisibility | "";

  floorInfo: string;
  hasElevator: boolean | null;
  buildingFloorsNote: string;

  exclusiveAreaM2: number | null;
  supplyAreaM2: number | null;
  siteAreaM2: number | null;
  totalFloorAreaM2: number | null;

  deposit: number | null;
  depositNegotiable: boolean;
  monthlyRent: number | null;
  monthlyRentNegotiable: boolean;
  premiumExists: boolean | null;
  premiumAmount: number | null;
  premiumBusinessRestriction: string;
  maintenanceFee: number | null;
  maintenanceFeeIncluded: string;
  brokerageFeeNote: string;

  parkingSpaces: number | null;
  parkingFeeType: ParkingFeeType | "";
  allowedBusiness: string;
  restrictedBusiness: string;
  interiorState: string;
  moveInType: MoveInType | "";
  moveInDate: string;
  minContractPeriod: string;
  hasCurrentTenant: boolean;
  expectedVacateDate: string;
};

export type Unit = {
  id: string;
  building: Building;
  floor: Floor;
  unitNo: string;
  exclusiveArea: number;
  exclusiveAreaUnit: "py" | "m2" | "unknown";
  /** 관리자 입력 */
  contractArea: number | null;
  /** 도면 정면(전면) 길이 — mm. 설계도면 X축 치수 기준 */
  frontLengthMm: number | null;
  price: number | null;
  /** true면 실제 price 값은 유지한 채 공개 페이지에는 "상담 문의"로 표시(분양가 미노출) */
  priceHidden?: boolean;
  status: UnitStatus;
  recommendedBusiness: string;
  options: string;
  memo: string;
  sortOrder: number;
  updatedAt: string;
  /** 중개사무소·등록자 정보 등 매물 상세 — 선택 입력 */
  listing?: ListingDetail;
};

export type FaqCategory =
  | "unit"
  | "contract"
  | "tax"
  | "move_in"
  | "parking"
  | "rights";

export type Faq = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  sortOrder: number;
  published: boolean;
  updatedAt: string;
};

export type GalleryItem = {
  id: string;
  category: "exterior" | "aerial" | "area_map" | "md_mood" | "pr_center";
  title: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
};

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  interestBuilding: Building | "";
  interestFloor: Floor | "";
  interestUnitNo: string;
  preferredBusiness: string;
  message: string;
  createdAt: string;
  status: "new" | "confirmed" | "in_progress" | "done";
  /** 담당자 메모 — 통화 내용·후속 조치 등 */
  note: string;
};

export type AreaContent = {
  positioningHeadline: string;
  points: { title: string; body: string }[];
  districts: { name: string; traits: string[] }[];
};
