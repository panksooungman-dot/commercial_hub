export type Building = "A" | "B";
export type Floor = "2F" | "1F" | "B1";
export type UnitStatus = "available" | "reserved" | "sold" | "move_in" | "hidden";

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
  updatedAt: string;
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
  status: UnitStatus;
  recommendedBusiness: string;
  options: string;
  memo: string;
  sortOrder: number;
  updatedAt: string;
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
  status: "new" | "done";
};

export type AreaContent = {
  positioningHeadline: string;
  points: { title: string; body: string }[];
  districts: { name: string; traits: string[] }[];
};
