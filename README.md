# Commercial Hub — 송도 하늘채 아이비원 상업시설

상가 분양 공개 사이트 + 관리자 CMS입니다. 앱 코드는 `web/` 에 있습니다.

```bash
cd web
npm install
npm run dev
```

- 사이트: http://localhost:3000  
- 관리자: http://localhost:3000/admin (비밀번호: `web/.env.local` 의 `ADMIN_PASSWORD`)

분양가·호실상태·일정·홍보관 연락처·FAQ·분양조건은 관리자에서 수정하면 `web/data/*.json`에 저장되고 공개 페이지에 반영됩니다.
