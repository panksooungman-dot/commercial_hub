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

/** 저장된 값이 없으면 PPT 매매가·임대가를 채운다. 관리자 입력은 유지. */
export function mergePptPricing<T extends { id: string; exclusiveAreaUnit?: string; price: number | null; listing?: ListingDetail }>(
  unit: T,
): T {
  const priced = pricingForUnitId(unit.id);
  if (!priced) return unit;
  const listing = unit.listing ?? emptyListing();
  return {
    ...unit,
    exclusiveAreaUnit: unit.exclusiveAreaUnit === "unknown" ? "py" : unit.exclusiveAreaUnit,
    price: unit.price ?? priced.price,
    listing: {
      ...listing,
      propertyType: listing.propertyType || "상가",
      deposit: listing.deposit ?? priced.deposit,
      monthlyRent: listing.monthlyRent ?? priced.monthlyRent,
    },
  };
}
