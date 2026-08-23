import { ListingDetail } from "./types";

/** PPT 표기: 매매가·보증금·임대료 모두 천원 단위 */
export type UnitCheonPrice = {
  sale: number;
  deposit: number;
  rent: number;
};

/**
 * 송도 하늘채 아이비원 매매가 및 임대가격 PPT 기준.
 * 값은 천원. 화면/저장 시 ×1000 하여 원으로 환산.
 */
export const UNIT_CHEON_PRICES: Record<string, UnitCheonPrice> = {
  "A-B1-B-101": { sale: 260550, deposit: 16000, rent: 1220 },
  "A-B1-B-102": { sale: 283910, deposit: 17000, rent: 1330 },
  "A-B1-B-105": { sale: 145880, deposit: 9000, rent: 680 },
  "B-B1-B-105": { sale: 202210, deposit: 12000, rent: 950 },
  "B-B1-B-106": { sale: 196210, deposit: 12000, rent: 920 },
  "B-B1-B-107": { sale: 286340, deposit: 17000, rent: 1350 },

  "A-1F-102": { sale: 426040, deposit: 26000, rent: 1830 },
  "A-1F-105": { sale: 781990, deposit: 47000, rent: 3370 },
  "A-1F-106": { sale: 750930, deposit: 45000, rent: 3240 },
  "A-1F-107": { sale: 474560, deposit: 28000, rent: 2050 },
  "A-1F-108": { sale: 375450, deposit: 23000, rent: 1620 },
  "A-1F-109": { sale: 454840, deposit: 27000, rent: 1960 },
  "A-1F-110": { sale: 340830, deposit: 20000, rent: 1470 },
  "A-1F-111": { sale: 429290, deposit: 26000, rent: 1850 },
  "A-1F-112": { sale: 417640, deposit: 25000, rent: 1800 },
  "A-1F-113": { sale: 386730, deposit: 23000, rent: 1670 },
  "A-1F-114": { sale: 426010, deposit: 26000, rent: 1830 },
  "A-1F-115": { sale: 405450, deposit: 24000, rent: 1750 },
  "A-1F-116": { sale: 601910, deposit: 36000, rent: 2590 },
  "A-1F-120": { sale: 438240, deposit: 26000, rent: 1890 },
  "A-1F-122": { sale: 517540, deposit: 31000, rent: 2230 },
  "A-1F-130": { sale: 554620, deposit: 33000, rent: 2390 },
  "A-1F-134": { sale: 354730, deposit: 21000, rent: 1530 },
  "A-1F-135": { sale: 355390, deposit: 21000, rent: 1530 },
  "A-1F-137": { sale: 252780, deposit: 15000, rent: 1090 },
  "A-1F-138": { sale: 243700, deposit: 15000, rent: 1050 },
  "A-1F-139": { sale: 244870, deposit: 15000, rent: 1050 },
  "A-1F-140": { sale: 584510, deposit: 35000, rent: 2520 },
  "A-1F-141": { sale: 411420, deposit: 25000, rent: 1770 },
  "A-1F-142": { sale: 573550, deposit: 34000, rent: 2470 },
  "A-1F-143": { sale: 886400, deposit: 53000, rent: 3820 },

  "B-1F-101": { sale: 494630, deposit: 30000, rent: 2130 },
  "B-1F-103": { sale: 580960, deposit: 35000, rent: 2500 },
  "B-1F-105": { sale: 1050830, deposit: 63000, rent: 4530 },
  "B-1F-106": { sale: 386990, deposit: 23000, rent: 1670 },
  "B-1F-107": { sale: 287330, deposit: 17000, rent: 1240 },
  "B-1F-108": { sale: 338570, deposit: 20000, rent: 1460 },
  "B-1F-111": { sale: 317260, deposit: 19000, rent: 1370 },
  "B-1F-112": { sale: 334560, deposit: 20000, rent: 1440 },
  "B-1F-113": { sale: 346070, deposit: 21000, rent: 1490 },
  "B-1F-117": { sale: 462000, deposit: 28000, rent: 1990 },
  "B-1F-119": { sale: 405730, deposit: 24000, rent: 1750 },
  "B-1F-120": { sale: 689890, deposit: 41000, rent: 2970 },
  "B-1F-121": { sale: 334510, deposit: 20000, rent: 1440 },
  "B-1F-122": { sale: 438240, deposit: 26000, rent: 1890 },
  "B-1F-123": { sale: 354430, deposit: 21000, rent: 1530 },
  "B-1F-124": { sale: 460490, deposit: 28000, rent: 1980 },
  "B-1F-127": { sale: 537040, deposit: 32000, rent: 2310 },
  "B-1F-128": { sale: 339020, deposit: 20000, rent: 1460 },
  "B-1F-129": { sale: 339020, deposit: 20000, rent: 1460 },
  "B-1F-130": { sale: 371580, deposit: 22000, rent: 1600 },
  "B-1F-131": { sale: 630080, deposit: 38000, rent: 2710 },
  "B-1F-132": { sale: 443130, deposit: 27000, rent: 1910 },
  "B-1F-138": { sale: 718940, deposit: 43000, rent: 3100 },
  "B-1F-139": { sale: 411420, deposit: 25000, rent: 1770 },
  "B-1F-141": { sale: 846590, deposit: 51000, rent: 3650 },

  "A-2F-201": { sale: 288570, deposit: 17000, rent: 1360 },
  "A-2F-202": { sale: 314040, deposit: 19000, rent: 1480 },
  "A-2F-203": { sale: 337120, deposit: 20000, rent: 1590 },
  "A-2F-204": { sale: 341530, deposit: 20000, rent: 1610 },
  "A-2F-205": { sale: 495270, deposit: 30000, rent: 2330 },
  "A-2F-206": { sale: 476240, deposit: 29000, rent: 2240 },
  "A-2F-207": { sale: 512670, deposit: 31000, rent: 2410 },
  "A-2F-208": { sale: 539580, deposit: 32000, rent: 2540 },
  "A-2F-209": { sale: 513620, deposit: 31000, rent: 2410 },
  "A-2F-210": { sale: 535020, deposit: 32000, rent: 2520 },
  "A-2F-211": { sale: 492250, deposit: 30000, rent: 2310 },
  "A-2F-212": { sale: 346630, deposit: 21000, rent: 1630 },
  "A-2F-213": { sale: 788390, deposit: 47000, rent: 3710 },
  "A-2F-215": { sale: 273390, deposit: 16000, rent: 1290 },
  "A-2F-216": { sale: 804800, deposit: 48000, rent: 3780 },
  "A-2F-217": { sale: 220000, deposit: 13000, rent: 1040 },
  "A-2F-218": { sale: 284300, deposit: 17000, rent: 1340 },
  "A-2F-224": { sale: 272360, deposit: 16000, rent: 1280 },
  "A-2F-226": { sale: 223860, deposit: 13000, rent: 1050 },
  "A-2F-227": { sale: 232120, deposit: 14000, rent: 1090 },
  "A-2F-228": { sale: 224920, deposit: 13000, rent: 1060 },
  "A-2F-229": { sale: 766900, deposit: 46000, rent: 3600 },

  "B-2F-201": { sale: 288570, deposit: 17000, rent: 1360 },
  "B-2F-202": { sale: 314040, deposit: 19000, rent: 1480 },
  "B-2F-203": { sale: 337120, deposit: 20000, rent: 1590 },
  "B-2F-204": { sale: 241920, deposit: 15000, rent: 1130 },
  "B-2F-205": { sale: 345010, deposit: 21000, rent: 1620 },
  "B-2F-206": { sale: 331760, deposit: 20000, rent: 1560 },
  "B-2F-207": { sale: 270940, deposit: 16000, rent: 1270 },
  "B-2F-208": { sale: 309720, deposit: 19000, rent: 1450 },
  "B-2F-209": { sale: 286020, deposit: 17000, rent: 1350 },
  "B-2F-210": { sale: 300290, deposit: 18000, rent: 1410 },
  "B-2F-211": { sale: 342910, deposit: 21000, rent: 1610 },
  "B-2F-212": { sale: 261280, deposit: 16000, rent: 1230 },
  "B-2F-213": { sale: 789100, deposit: 47000, rent: 3710 },
  "B-2F-214": { sale: 177040, deposit: 11000, rent: 830 },
  "B-2F-215": { sale: 273390, deposit: 16000, rent: 1290 },
  "B-2F-216": { sale: 805550, deposit: 48000, rent: 3790 },
  "B-2F-218": { sale: 450650, deposit: 27000, rent: 2120 },
  "B-2F-219": { sale: 378630, deposit: 23000, rent: 1780 },
  "B-2F-220": { sale: 360100, deposit: 22000, rent: 1690 },
  "B-2F-221": { sale: 378100, deposit: 23000, rent: 1780 },
  "B-2F-222": { sale: 499370, deposit: 30000, rent: 2350 },
  "B-2F-223": { sale: 276430, deposit: 17000, rent: 1300 },
  "B-2F-224": { sale: 434230, deposit: 26000, rent: 2040 },
  "B-2F-225": { sale: 281820, deposit: 17000, rent: 1320 },
  "B-2F-226": { sale: 210910, deposit: 13000, rent: 990 },
  "B-2F-227": { sale: 314560, deposit: 19000, rent: 1480 },
  "B-2F-228": { sale: 224950, deposit: 13000, rent: 1060 },
  "B-2F-229": { sale: 766900, deposit: 46000, rent: 3600 },
  "B-2F-230": { sale: 132310, deposit: 8000, rent: 620 },
};

/**
 * 송도 하늘채 아이비원 공급(계약)면적 PPT 기준. 단위: 평(py).
 * 호실 정보 팝업의 "계약면적(평)" 표시에 사용.
 */
export const UNIT_SUPPLY_AREA_PY: Record<string, number> = {
  "A-1F-102": 24.5,
  "A-1F-105": 44.99,
  "A-1F-106": 41.94,
  "A-1F-107": 30.33,
  "A-1F-108": 24.0,
  "A-1F-109": 29.07,
  "A-1F-110": 21.79,
  "A-1F-111": 27.44,
  "A-1F-112": 26.7,
  "A-1F-113": 24.72,
  "A-1F-114": 27.23,
  "A-1F-115": 25.92,
  "A-1F-116": 33.62,
  "A-1F-120": 25.21,
  "A-1F-122": 28.91,
  "A-1F-130": 31.91,
  "A-1F-134": 20.41,
  "A-1F-135": 20.45,
  "A-1F-137": 14.54,
  "A-1F-138": 14.02,
  "A-1F-139": 14.09,
  "A-1F-140": 32.65,
  "A-1F-141": 23.67,
  "A-1F-142": 33.0,
  "A-1F-143": 56.66,
  "A-2F-201": 31.32,
  "A-2F-202": 34.09,
  "A-2F-203": 36.59,
  "A-2F-204": 37.07,
  "A-2F-205": 53.76,
  "A-2F-206": 51.69,
  "A-2F-207": 55.65,
  "A-2F-208": 58.57,
  "A-2F-209": 55.75,
  "A-2F-210": 58.07,
  "A-2F-211": 53.43,
  "A-2F-212": 37.63,
  "A-2F-213": 105.48,
  "A-2F-215": 36.58,
  "A-2F-216": 107.67,
  "A-2F-217": 23.88,
  "A-2F-218": 30.86,
  "A-2F-224": 29.56,
  "A-2F-226": 24.3,
  "A-2F-227": 25.2,
  "A-2F-228": 24.41,
  "A-2F-229": 102.6,
  "A-B1-B-101": 89.76,
  "A-B1-B-102": 97.8,
  "A-B1-B-105": 50.25,
  "B-1F-101": 28.46,
  "B-1F-103": 33.42,
  "B-1F-105": 60.45,
  "B-1F-106": 22.26,
  "B-1F-107": 16.53,
  "B-1F-108": 19.48,
  "B-1F-111": 18.25,
  "B-1F-112": 19.25,
  "B-1F-113": 19.91,
  "B-1F-117": 25.8,
  "B-1F-119": 23.34,
  "B-1F-120": 39.69,
  "B-1F-121": 19.24,
  "B-1F-122": 25.21,
  "B-1F-123": 20.39,
  "B-1F-124": 25.72,
  "B-1F-127": 36.35,
  "B-1F-128": 22.95,
  "B-1F-129": 22.95,
  "B-1F-130": 25.15,
  "B-1F-131": 40.28,
  "B-1F-132": 28.33,
  "B-1F-138": 40.16,
  "B-1F-139": 23.67,
  "B-1F-141": 54.12,
  "B-2F-201": 31.32,
  "B-2F-202": 34.09,
  "B-2F-203": 36.59,
  "B-2F-204": 26.26,
  "B-2F-205": 37.45,
  "B-2F-206": 36.01,
  "B-2F-207": 29.41,
  "B-2F-208": 33.62,
  "B-2F-209": 31.05,
  "B-2F-210": 32.6,
  "B-2F-211": 37.22,
  "B-2F-212": 28.36,
  "B-2F-213": 105.57,
  "B-2F-214": 23.69,
  "B-2F-215": 36.58,
  "B-2F-216": 107.77,
  "B-2F-218": 48.92,
  "B-2F-219": 41.1,
  "B-2F-220": 39.09,
  "B-2F-221": 41.04,
  "B-2F-222": 54.2,
  "B-2F-223": 30.01,
  "B-2F-224": 47.13,
  "B-2F-225": 30.59,
  "B-2F-226": 22.89,
  "B-2F-227": 34.15,
  "B-2F-228": 24.42,
  "B-2F-229": 102.6,
  "B-2F-230": 17.7,
  "B-B1-B-105": 69.66,
  "B-B1-B-106": 67.59,
  "B-B1-B-107": 98.64,
};

function emptyListing(): ListingDetail {
  return {
    dealType: "",
    propertyType: "상가",
    listingAddress: "",
    visibility: "",
    floorInfo: "",
    hasElevator: null,
    buildingFloorsNote: "",
    exclusiveAreaM2: null,
    supplyAreaM2: null,
    siteAreaM2: null,
    totalFloorAreaM2: null,
    deposit: null,
    depositNegotiable: false,
    monthlyRent: null,
    monthlyRentNegotiable: false,
    premiumExists: null,
    premiumAmount: null,
    premiumBusinessRestriction: "",
    maintenanceFee: null,
    maintenanceFeeIncluded: "",
    brokerageFeeNote: "",
    parkingSpaces: null,
    parkingFeeType: "",
    allowedBusiness: "",
    restrictedBusiness: "",
    interiorState: "",
    moveInType: "",
    moveInDate: "",
    minContractPeriod: "",
    hasCurrentTenant: false,
    expectedVacateDate: "",
  };
}

export function cheonToWon(cheon: number) {
  return cheon * 1000;
}

export function pricingForUnitId(id: string) {
  const row = UNIT_CHEON_PRICES[id];
  if (!row) return null;
  return {
    price: cheonToWon(row.sale),
    deposit: cheonToWon(row.deposit),
    monthlyRent: cheonToWon(row.rent),
  };
}

export function applyPptPricing<T extends { id: string; price: number | null; listing?: ListingDetail }>(
  unit: T,
): T {
  const priced = pricingForUnitId(unit.id);
  if (!priced) return unit;
  return {
    ...unit,
    price: priced.price,
    listing: {
      ...(unit.listing ?? emptyListing()),
      propertyType: unit.listing?.propertyType || "상가",
      deposit: priced.deposit,
      monthlyRent: priced.monthlyRent,
    },
  };
}

/** 저장된 값이 없으면 PPT 매매가·임대가·계약(공급)면적을 채운다. 관리자 입력은 유지. */
export function mergePptPricing<
  T extends {
    id: string;
    exclusiveAreaUnit?: string;
    contractArea?: number | null;
    price: number | null;
    listing?: ListingDetail;
  },
>(unit: T): T {
  const priced = pricingForUnitId(unit.id);
  const supplyAreaPy = UNIT_SUPPLY_AREA_PY[unit.id];
  if (!priced && supplyAreaPy == null) return unit;
  const listing = unit.listing ?? emptyListing();
  return {
    ...unit,
    exclusiveAreaUnit: unit.exclusiveAreaUnit === "unknown" ? "py" : unit.exclusiveAreaUnit,
    contractArea: unit.contractArea ?? supplyAreaPy ?? null,
    price: unit.price ?? priced?.price ?? null,
    listing: {
      ...listing,
      propertyType: listing.propertyType || "상가",
      deposit: listing.deposit ?? priced?.deposit ?? null,
      monthlyRent: listing.monthlyRent ?? priced?.monthlyRent ?? null,
    },
  };
}
