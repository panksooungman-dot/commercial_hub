"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("비밀번호가 올바르지 않습니다.");
        return;
      }
      // 로그인 전 nav 프리페치로 캐시된 /admin 리다이렉트 응답을 그대로 재사용하는
      // 것을 피하기 위해 클라이언트 라우터 대신 실제 페이지 이동을 사용한다.
      window.location.assign("/admin");
    } catch {
      setError("네트워크 오류로 로그인 요청을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
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
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand py-2 text-sm text-white disabled:opacity-60"
        >
          {submitting ? "로그인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}
