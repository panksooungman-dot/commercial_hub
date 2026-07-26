"use client";

import Link from "next/link";
import { useInterestUnits } from "@/hooks/use-interest-units";

export function InterestNavLink() {
  const { count, ready } = useInterestUnits();
  return (
    <Link href="/interest" className="relative hover:text-accent">
      내 선택
      {ready && count > 0 ? (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-brand-deep">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
