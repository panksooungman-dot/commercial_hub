import { frontFacadeForUnitId, resolveFrontLength } from "@/lib/front-lengths";
import type { Building, Floor, Unit, UnitStatus } from "@/lib/types";

export type UnitPopupInfo = {
  id?: string;
  building: Building;
  floor: Floor;
  unitNo: string;
  status: Exclude<UnitStatus, "hidden">;
  exclusiveArea?: number;
  exclusiveAreaUnit?: string;
  contractArea?: number | null;
  frontLengthMm?: number | null;
  frontFacade?: "north" | "south" | "east" | "west" | null;
  price?: number | null;
  deposit?: number | null;
  monthlyRent?: number | null;
  recommendedBusiness?: string;
  options?: string;
  /** PPT 노란 표시(영업 점포) 이름 */
  shopLabel?: string;
};

export function toUnitPopupInfo(u: Unit, shopLabel?: string): UnitPopupInfo {
  const resolved = resolveFrontLength(u.building, u.floor, u.id);
  return {
    id: u.id,
    building: u.building,
    floor: u.floor,
    unitNo: u.unitNo,
    status: (u.status === "hidden" ? "available" : u.status) as Exclude<UnitStatus, "hidden">,
    exclusiveArea: u.exclusiveArea,
    exclusiveAreaUnit: u.exclusiveAreaUnit,
    contractArea: u.contractArea,
    frontLengthMm: u.frontLengthMm ?? resolved?.mm ?? null,
    frontFacade: frontFacadeForUnitId(u.id) ?? resolved?.facade ?? null,
    price: u.price,
    deposit: u.listing?.deposit ?? null,
    monthlyRent: u.listing?.monthlyRent ?? null,
    recommendedBusiness: u.recommendedBusiness,
    options: u.options,
    shopLabel,
  };
}
