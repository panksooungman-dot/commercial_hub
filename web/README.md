# 송도 하늘채 아이비원 상업시설 웹 + CMS

PDF 기반 공개 사이트와, 분양가·호실상태·일정·홍보관 연락처·FAQ를 **관리자 페이지에서 수정**할 수 있는 Next.js 앱입니다.

## 실행

```bash
cd web
npm install
npm run dev
```

- 공개 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin  
  - 기본 비밀번호: `.env.local`의 `ADMIN_PASSWORD` (초기값 `admin123`)

## 관리자에서 수정 가능한 항목

| 메뉴 | 내용 |
|------|------|
| 프로젝트 | 히어로 문구, 분양 일정, 분양 조건, 유의사항, 홍보관 주소/전화/운영시간/지도 |
| 호실 | 분양가, 상태(분양중/예약/완판/비공개), 계약면적, 권장업종, 옵션 |
| FAQ | 질문/답변/카테고리/공개 여부 |
| 입지 | 상권 포지셔닝 카피 |
| 상담 | 문의 접수 목록 |

데이터는 `web/data/*.json`에 저장됩니다. 최초 접속 시 PDF에서 추출한 107실·사업개요로 시드됩니다.

## 환경변수

```env
ADMIN_PASSWORD=admin123
ADMIN_SESSION_SECRET=change-me
```
