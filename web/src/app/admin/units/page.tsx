"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { STATUS_LABEL } from "@/lib/format";
import {
  DealType,
  ListingDetail,
  MoveInType,
  ParkingFeeType,
  PropertyType,
  Unit,
  UnitStatus,
} from "@/lib/types";

function defaultListingDetail(): ListingDetail {
  return {
    dealType: "",
    propertyType: "",
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

const PROPERTY_TYPES: PropertyType[] = ["상가", "점포", "사무실", "지식산업센터", "빌딩", "기타"];

function ListingDetailForm({
  value,
  onChange,
}: {
  value: ListingDetail;
  onChange: (patch: Partial<ListingDetail>) => void;
}) {
  const py = value.exclusiveAreaM2 != null ? value.exclusiveAreaM2 * 0.3025 : null;
  const rentPerPy =
    value.monthlyRent != null && py != null && py > 0 ? Math.round(value.monthlyRent / py) : null;

  const field = "mt-1 w-full border border-line bg-white px-2 py-1.5 text-sm";
  const label = "text-xs font-medium text-muted";

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <section>
        <h3 className="font-display text-base text-brand">1. 거래 기본 정보</h3>
        <div className="mt-2 space-y-2">
          <div>
            <label className={label}>거래 유형 (필수)</label>
            <select
              className={field}
              value={value.dealType}
              onChange={(e) => onChange({ dealType: e.target.value as DealType | "" })}
            >
              <option value="">선택</option>
              <option value="lease">임대</option>
              <option value="sale">매매</option>
              <option value="sublease">전대</option>
            </select>
          </div>
          <div>
            <label className={label}>물건 종류 (필수)</label>
            <select
              className={field}
              value={value.propertyType}
              onChange={(e) => onChange({ propertyType: e.target.value as PropertyType | "" })}
            >
              <option value="">선택</option>
              {PROPERTY_TYPES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>매물 주소 (필수)</label>
            <input
              className={field}
              value={value.listingAddress}
              onChange={(e) => onChange({ listingAddress: e.target.value })}
              placeholder="도로명 주소 + 상세 호수"
            />
          </div>
          <div>
            <label className={label}>매물 공개 범위 (필수)</label>
            <select
              className={field}
              value={value.visibility}
              onChange={(e) => onChange({ visibility: e.target.value as ListingDetail["visibility"] })}
            >
              <option value="">선택</option>
              <option value="public">전체 공개</option>
              <option value="broker_only">중개사만 공개</option>
              <option value="private">비공개(내부용)</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-display text-base text-brand">2. 위치·층수 정보</h3>
        <div className="mt-2 space-y-2">
          <div>
            <label className={label}>해당 매물의 층수 (필수)</label>
            <input
              className={field}
              value={value.floorInfo}
              onChange={(e) => onChange({ floorInfo: e.target.value })}
              placeholder="지상 ○층 / 지하 ○층"
            />
          </div>
          <div>
            <label className={label}>엘리베이터 유무 (필수)</label>
            <select
              className={field}
              value={value.hasElevator === null ? "" : value.hasElevator ? "y" : "n"}
              onChange={(e) =>
                onChange({ hasElevator: e.target.value === "" ? null : e.target.value === "y" })
              }
            >
              <option value="">선택</option>
              <option value="y">있음</option>
              <option value="n">없음</option>
            </select>
          </div>
          <div>
            <label className={label}>건물 전체 층수와 매물 위치 (선택)</label>
            <textarea
              className={field}
              rows={2}
              value={value.buildingFloorsNote}
              onChange={(e) => onChange({ buildingFloorsNote: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-display text-base text-brand">3. 면적 정보</h3>
        <div className="mt-2 space-y-2">
          <div>
            <label className={label}>
              전용면적 ㎡ (필수) {py != null ? `— 자동 환산 약 ${py.toFixed(1)}평` : null}
            </label>
            <input
              type="number"
              className={field}
              value={value.exclusiveAreaM2 ?? ""}
              onChange={(e) =>
                onChange({ exclusiveAreaM2: e.target.value === "" ? null : Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className={label}>공급면적(계약면적) ㎡ (필수)</label>
            <input
              type="number"
              className={field}
              value={value.supplyAreaM2 ?? ""}
              onChange={(e) =>
                onChange({ supplyAreaM2: e.target.value === "" ? null : Number(e.target.value) })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={label}>대지면적 ㎡ (선택)</label>
              <input
                type="number"
                className={field}
                value={value.siteAreaM2 ?? ""}
                onChange={(e) =>
                  onChange({ siteAreaM2: e.target.value === "" ? null : Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className={label}>연면적 ㎡ (선택)</label>
              <input
                type="number"
                className={field}
                value={value.totalFloorAreaM2 ?? ""}
                onChange={(e) =>
                  onChange({ totalFloorAreaM2: e.target.value === "" ? null : Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-display text-base text-brand">4. 가격 정보</h3>
        <div className="mt-2 space-y-2">
          <div>
            <label className={label}>보증금 원 (필수)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={field}
                value={value.deposit ?? ""}
                onChange={(e) =>
                  onChange({ deposit: e.target.value === "" ? null : Number(e.target.value) })
                }
              />
              <label className="mt-1 flex shrink-0 items-center gap-1 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={value.depositNegotiable}
                  onChange={(e) => onChange({ depositNegotiable: e.target.checked })}
                />
                협의가능
              </label>
            </div>
          </div>
          <div>
            <label className={label}>월세 원 (필수)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={field}
                value={value.monthlyRent ?? ""}
                onChange={(e) =>
                  onChange({ monthlyRent: e.target.value === "" ? null : Number(e.target.value) })
                }
              />
              <label className="mt-1 flex shrink-0 items-center gap-1 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={value.monthlyRentNegotiable}
                  onChange={(e) => onChange({ monthlyRentNegotiable: e.target.checked })}
                />
                협의가능
              </label>
            </div>
          </div>
          <div>
            <label className={label}>권리금 유무 (필수)</label>
            <select
              className={field}
              value={value.premiumExists === null ? "" : value.premiumExists ? "y" : "n"}
              onChange={(e) =>
                onChange({ premiumExists: e.target.value === "" ? null : e.target.value === "y" })
              }
            >
              <option value="">선택</option>
              <option value="y">있음</option>
              <option value="n">없음</option>
            </select>
          </div>
          {value.premiumExists ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={label}>권리금 금액</label>
                <input
                  type="number"
                  className={field}
                  value={value.premiumAmount ?? ""}
                  onChange={(e) =>
                    onChange({ premiumAmount: e.target.value === "" ? null : Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className={label}>업종 제한 여부</label>
                <input
                  className={field}
                  value={value.premiumBusinessRestriction}
                  onChange={(e) => onChange({ premiumBusinessRestriction: e.target.value })}
                />
              </div>
            </div>
          ) : null}
          <div>
            <label className={label}>관리비 원 (필수)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={field}
                value={value.maintenanceFee ?? ""}
                onChange={(e) =>
                  onChange({ maintenanceFee: e.target.value === "" ? null : Number(e.target.value) })
                }
              />
              <input
                className="mt-1 w-28 shrink-0 border border-line bg-white px-2 py-1.5 text-sm"
                placeholder="포함 여부"
                value={value.maintenanceFeeIncluded}
                onChange={(e) => onChange({ maintenanceFeeIncluded: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={label}>중개수수료 안내 문구 (선택)</label>
            <input
              className={field}
              value={value.brokerageFeeNote}
              onChange={(e) => onChange({ brokerageFeeNote: e.target.value })}
              placeholder="예: 임차인 부담 0.9% / 협의 가능"
            />
          </div>
          <p className="text-xs text-muted">
            평당 임대료 (참고용): {rentPerPy != null ? `${rentPerPy.toLocaleString("ko-KR")}원/평` : "—"}
          </p>
        </div>
      </section>

      <section>
        <h3 className="font-display text-base text-brand">5. 시설·조건 정보</h3>
        <div className="mt-2 space-y-2">
          <div>
            <label className={label}>주차 가능 대수 (필수)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={field}
                value={value.parkingSpaces ?? ""}
                onChange={(e) =>
                  onChange({ parkingSpaces: e.target.value === "" ? null : Number(e.target.value) })
                }
              />
              <select
                className="mt-1 w-24 shrink-0 border border-line bg-white px-2 py-1.5 text-sm"
                value={value.parkingFeeType}
                onChange={(e) => onChange({ parkingFeeType: e.target.value as ParkingFeeType | "" })}
              >
                <option value="">선택</option>
                <option value="paid">유료</option>
                <option value="free">무료</option>
              </select>
            </div>
          </div>
          <div>
            <label className={label}>가능 업종 (필수)</label>
            <input
              className={field}
              value={value.allowedBusiness}
              onChange={(e) => onChange({ allowedBusiness: e.target.value })}
            />
          </div>
          <div>
            <label className={label}>불가 업종 (필수)</label>
            <input
              className={field}
              value={value.restrictedBusiness}
              onChange={(e) => onChange({ restrictedBusiness: e.target.value })}
            />
          </div>
          <div>
            <label className={label}>인테리어 상태 (선택)</label>
            <input
              className={field}
              value={value.interiorState}
              onChange={(e) => onChange({ interiorState: e.target.value })}
              placeholder="풀옵션 / 부분옵션 / 나대지 상태 + 간단 설명"
            />
          </div>
          <div>
            <label className={label}>입주 가능일 (필수)</label>
            <div className="flex items-center gap-2">
              <select
                className="mt-1 w-28 shrink-0 border border-line bg-white px-2 py-1.5 text-sm"
                value={value.moveInType}
                onChange={(e) => onChange({ moveInType: e.target.value as MoveInType | "" })}
              >
                <option value="">선택</option>
                <option value="immediate">즉시 입주</option>
                <option value="negotiable">협의</option>
                <option value="date">특정 날짜</option>
              </select>
              {value.moveInType === "date" ? (
                <input
                  type="date"
                  className={field}
                  value={value.moveInDate}
                  onChange={(e) => onChange({ moveInDate: e.target.value })}
                />
              ) : null}
            </div>
          </div>
          <div>
            <label className={label}>최소 계약 기간 (선택)</label>
            <input
              className={field}
              value={value.minContractPeriod}
              onChange={(e) => onChange({ minContractPeriod: e.target.value })}
              placeholder="예: 2년 이상"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <input
                type="checkbox"
                checked={value.hasCurrentTenant}
                onChange={(e) =>
                  onChange({
                    hasCurrentTenant: e.target.checked,
                    expectedVacateDate: e.target.checked ? value.expectedVacateDate : "",
                  })
                }
              />
              현재 임차인 있음 — 체크 시 퇴거 예정일 입력
            </label>
            {value.hasCurrentTenant ? (
              <input
                type="date"
                className={field}
                value={value.expectedVacateDate}
                onChange={(e) => onChange({ expectedVacateDate: e.target.value })}
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [floor, setFloor] = useState("");
  const [building, setBuilding] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [msg, setMsg] = useState("");
  const [savingAll, setSavingAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  /** 삭제 직전 상태를 기억해 두었다가 복구 시 그대로 되돌린다(새로고침 시엔 분양가능으로 복구) */
  const statusBeforeDelete = useRef<Record<string, UnitStatus>>({});

  useEffect(() => {
    fetch("/api/admin/units")
      .then((r) => {
        if (r.status === 401) location.href = "/admin/login";
        return r.json();
      })
      .then(setUnits);
  }, []);

  const hiddenCount = useMemo(() => units.filter((u) => u.status === "hidden").length, [units]);

  const filtered = useMemo(
    () =>
      units.filter((u) => {
        if (floor && u.floor !== floor) return false;
        if (building && u.building !== building) return false;
        if (!showHidden && u.status === "hidden") return false;
        return true;
      }),
    [units, floor, building, showHidden],
  );

  async function saveUnit(unit: Unit) {
    setMsg("");
    const res = await fetch(`/api/admin/units/${unit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(unit),
    });
    if (res.ok) {
      setMsg(`${unit.id} 저장됨`);
      return;
    }
    const body = await res.json().catch(() => null);
    setMsg(`저장 실패${body?.error ? ` (${body.error})` : ""}`);
  }

  async function saveAll() {
    setMsg("");
    setSavingAll(true);
    try {
      const res = await fetch("/api/admin/units", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(units),
      });
      if (res.ok) {
        const body = await res.json();
        setMsg(`전체 저장됨 (${body.count}실)`);
        return;
      }
      const body = await res.json().catch(() => null);
      setMsg(`전체 저장 실패${body?.error ? ` (${body.error})` : ""}`);
    } finally {
      setSavingAll(false);
    }
  }

  function patch(id: string, partial: Partial<Unit>) {
    setUnits((list) => list.map((u) => (u.id === id ? { ...u, ...partial } : u)));
  }

  function toggleSelected(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAllFiltered(checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const u of filtered) {
        if (checked) next.add(u.id);
        else next.delete(u.id);
      }
      return next;
    });
  }

  /** 선택한 호실들의 분양가 공개 여부를 한 번에 바꾼다. 값은 유지한 채 노출만 전환된다 */
  function setPriceHiddenForSelected(hidden: boolean) {
    setUnits((list) =>
      list.map((u) => (selectedIds.has(u.id) ? { ...u, priceHidden: hidden } : u)),
    );
  }

  function updateListing(id: string, listingPatch: Partial<ListingDetail>) {
    setUnits((list) =>
      list.map((u) =>
        u.id === id
          ? { ...u, listing: { ...(u.listing ?? defaultListingDetail()), ...listingPatch } }
          : u,
      ),
    );
  }

  /** 삭제(비공개 처리)·복구는 상태를 바로 저장해 공개 사이트에 즉시 반영한다 */
  async function setStatusAndSave(unit: Unit, status: UnitStatus) {
    const next = { ...unit, status };
    patch(unit.id, { status });
    await saveUnit(next);
  }

  function deleteUnit(unit: Unit) {
    if (!window.confirm(`${unit.building}-${unit.floor}-${unit.unitNo} 호실을 삭제(비공개)할까요?\n공개 사이트에서 즉시 사라지며, 목록의 "비공개 호실 표시"에서 언제든 복구할 수 있습니다.`)) {
      return;
    }
    statusBeforeDelete.current[unit.id] = unit.status;
    setStatusAndSave(unit, "hidden");
  }

  function restoreUnit(unit: Unit) {
    setStatusAndSave(unit, statusBeforeDelete.current[unit.id] ?? "available");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand">호실 관리</h1>
      <p className="mt-2 text-sm text-muted">
        분양가·상태·계약면적·정면길이·권장업종을 수정하세요. 공개 사이트에 바로 반영됩니다.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <select value={floor} onChange={(e) => setFloor(e.target.value)} className="border px-2 py-1 text-sm">
          <option value="">전체 층</option>
          <option value="2F">2F</option>
          <option value="1F">1F</option>
          <option value="B1">B1</option>
        </select>
        <select value={building} onChange={(e) => setBuilding(e.target.value)} className="border px-2 py-1 text-sm">
          <option value="">전체 동</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        <label className="flex items-center gap-1.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
          />
          비공개 호실 표시 ({hiddenCount})
        </label>
        <button
          type="button"
          onClick={saveAll}
          disabled={savingAll || units.length === 0}
          className="bg-brand px-3 py-1 text-sm text-white hover:bg-brand-deep disabled:opacity-50"
        >
          {savingAll ? "전체 저장 중…" : `전체 저장 (${units.length}실)`}
        </button>
        {msg ? <span className="text-sm text-brand">{msg}</span> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border border-line bg-background px-3 py-2 text-sm">
        <span className="text-muted">선택 {selectedIds.size}실</span>
        <button
          type="button"
          disabled={selectedIds.size === 0}
          onClick={() => setPriceHiddenForSelected(true)}
          className="border border-brand px-2 py-1 text-brand hover:bg-brand hover:text-white disabled:opacity-40"
        >
          선택 호실 분양가 미노출
        </button>
        <button
          type="button"
          disabled={selectedIds.size === 0}
          onClick={() => setPriceHiddenForSelected(false)}
          className="border border-line px-2 py-1 text-muted hover:border-brand hover:text-brand disabled:opacity-40"
        >
          선택 호실 분양가 노출
        </button>
        <span className="text-xs text-muted">
          미노출로 바꾼 뒤 저장해야 공개 사이트에 반영됩니다. 값은 지워지지 않고 &quot;상담 문의&quot;로만 표시됩니다.
        </span>
      </div>

      <div className="mt-4 overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[1040px] text-left text-xs">
          <thead className="bg-background text-muted">
            <tr>
              <th className="px-2 py-2">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && filtered.every((u) => selectedIds.has(u.id))}
                  onChange={(e) => toggleSelectAllFiltered(e.target.checked)}
                />
              </th>
              <th className="px-2 py-2">호실</th>
              <th className="px-2 py-2">전용</th>
              <th className="px-2 py-2">정면(mm)</th>
              <th className="px-2 py-2">계약면적(평)</th>
              <th className="px-2 py-2">분양가(원)</th>
              <th className="px-2 py-2">상태</th>
              <th className="px-2 py-2">권장업종</th>
              <th className="px-2 py-2">옵션</th>
              <th className="px-2 py-2"></th>
              <th className="px-2 py-2"></th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <Fragment key={u.id}>
                <tr
                  className={`border-t border-line ${u.status === "hidden" ? "bg-background/70 opacity-60" : ""}`}
                >
                <td className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(u.id)}
                    onChange={(e) => toggleSelected(u.id, e.target.checked)}
                  />
                </td>
                <td className="px-2 py-2 font-medium">
                  <Link href={`/units/${u.id}`} className="text-brand underline">
                    {u.building}-{u.floor}-{u.unitNo}
                  </Link>
                </td>
                <td className="px-2 py-2">{u.exclusiveArea}</td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-20 border px-1 py-1"
                    value={u.frontLengthMm ?? ""}
                    onChange={(e) =>
                      patch(u.id, {
                        frontLengthMm: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-20 border px-1 py-1"
                    value={u.contractArea ?? ""}
                    onChange={(e) =>
                      patch(u.id, {
                        contractArea: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-28 border px-1 py-1"
                    value={u.price ?? ""}
                    onChange={(e) =>
                      patch(u.id, {
                        price: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                  <label className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                    <input
                      type="checkbox"
                      checked={Boolean(u.priceHidden)}
                      onChange={(e) => patch(u.id, { priceHidden: e.target.checked })}
                    />
                    미노출
                  </label>
                </td>
                <td className="px-2 py-2">
                  <select
                    className="border px-1 py-1"
                    value={u.status}
                    onChange={(e) => patch(u.id, { status: e.target.value as UnitStatus })}
                  >
                    {(Object.keys(STATUS_LABEL) as UnitStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <input
                    className="w-28 border px-1 py-1"
                    value={u.recommendedBusiness}
                    onChange={(e) => patch(u.id, { recommendedBusiness: e.target.value })}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    className="w-24 border px-1 py-1"
                    value={u.options}
                    onChange={(e) => patch(u.id, { options: e.target.value })}
                  />
                </td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    className="bg-brand px-2 py-1 text-white"
                    onClick={() => saveUnit(u)}
                  >
                    저장
                  </button>
                </td>
                <td className="px-2 py-2">
                  {u.status === "hidden" ? (
                    <button
                      type="button"
                      className="border border-brand px-2 py-1 text-brand hover:bg-brand hover:text-white"
                      onClick={() => restoreUnit(u)}
                    >
                      복구
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="border border-[#c0392b] px-2 py-1 text-[#c0392b] hover:bg-[#c0392b] hover:text-white"
                      onClick={() => deleteUnit(u)}
                    >
                      삭제
                    </button>
                  )}
                </td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    className="border border-line px-2 py-1 text-muted hover:border-brand hover:text-brand"
                    onClick={() => setExpandedId((cur) => (cur === u.id ? null : u.id))}
                  >
                    {expandedId === u.id ? "닫기" : "상세정보"}
                  </button>
                </td>
                </tr>
                {expandedId === u.id ? (
                  <tr className="border-t border-line bg-background/60">
                    <td colSpan={10} className="px-4 py-5">
                      <ListingDetailForm
                        value={u.listing ?? defaultListingDetail()}
                        onChange={(p) => updateListing(u.id, p)}
                      />
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          className="bg-brand px-3 py-1.5 text-sm text-white hover:bg-brand-deep"
                          onClick={() => saveUnit(u)}
                        >
                          상세정보 저장
                        </button>
                        {msg ? <span className="text-sm text-brand">{msg}</span> : null}
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
