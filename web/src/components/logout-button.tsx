"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="text-muted hover:text-brand"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        location.href = "/admin/login";
      }}
    >
      로그아웃
    </button>
  );
}
