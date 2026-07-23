"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  defaultBuilding?: string;
  defaultFloor?: string;
  defaultUnitNo?: string;
};

export function InquiryForm({
  defaultBuilding = "",
  defaultFloor = "",
  defaultUnitNo = "",
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        phone: fd.get("phone"),
        email: fd.get("email"),
        interestBuilding: fd.get("interestBuilding"),
        interestFloor: fd.get("interestFloor"),
        interestUnitNo: fd.get("interestUnitNo"),
        preferredBusiness: fd.get("preferredBusiness"),
        message: fd.get("message"),
        privacyAgreed: fd.get("privacyAgreed") === "on",
      }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "접수에 실패했습니다.");
      return;
    }
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="rounded-sm border border-line bg-surface p-6">
        <p className="font-display text-xl text-brand">상담 신청이 접수되었습니다.</p>
        <p className="mt-2 text-sm text-muted">담당자가 남겨주신 연락처로 안내드립니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-sm border border-line bg-surface p-6">
      <p className="text-sm text-muted">
        관심 호실(동·층·호수)을 알려주시면 담당자가 면적·위치·상담 가능 여부를 안내드립니다.
        분양가·일정·계약 조건은 상담 시 최신 기준으로 안내됩니다.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          이름 *
          <input name="name" required className="mt-1 w-full border border-line px-3 py-2" />
        </label>
        <label className="block text-sm">
          연락처 *
          <input name="phone" required className="mt-1 w-full border border-line px-3 py-2" />
        </label>
        <label className="block text-sm">
          이메일
          <input name="email" type="email" className="mt-1 w-full border border-line px-3 py-2" />
        </label>
        <label className="block text-sm">
          희망 업종
          <input name="preferredBusiness" className="mt-1 w-full border border-line px-3 py-2" />
        </label>
        <label className="block text-sm">
          동
          <select
            name="interestBuilding"
            defaultValue={defaultBuilding}
            className="mt-1 w-full border border-line px-3 py-2"
          >
            <option value="">선택</option>
            <option value="A">A동</option>
            <option value="B">B동</option>
          </select>
        </label>
        <label className="block text-sm">
          층
          <select
            name="interestFloor"
            defaultValue={defaultFloor}
            className="mt-1 w-full border border-line px-3 py-2"
          >
            <option value="">선택</option>
            <option value="2F">2F</option>
            <option value="1F">1F</option>
            <option value="B1">B1</option>
          </select>
        </label>
        <label className="block text-sm md:col-span-2">
          호실번호
          <input
            name="interestUnitNo"
            defaultValue={defaultUnitNo}
            className="mt-1 w-full border border-line px-3 py-2"
            placeholder="예: 201, B-101"
          />
        </label>
        <label className="block text-sm md:col-span-2">
          문의 내용
          <textarea name="message" rows={4} className="mt-1 w-full border border-line px-3 py-2" />
        </label>
      </div>
      <label className="flex items-start gap-2 text-sm text-muted">
        <input name="privacyAgreed" type="checkbox" required className="mt-1" />
        상담 처리를 위한 개인정보 수집·이용에 동의합니다.
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-deep disabled:opacity-60"
      >
        {pending ? "접수 중…" : "상담 신청하기"}
      </button>
    </form>
  );
}
