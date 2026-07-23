"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("비밀번호가 올바르지 않습니다.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <h1 className="font-display text-3xl text-brand">관리자 로그인</h1>
      <p className="mt-2 text-sm text-muted">기본 비밀번호는 .env.local의 ADMIN_PASSWORD 입니다.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3 border border-line bg-surface p-5">
        <label className="block text-sm">
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-line px-3 py-2"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="w-full bg-brand py-2 text-sm text-white">
          로그인
        </button>
      </form>
    </div>
  );
}
