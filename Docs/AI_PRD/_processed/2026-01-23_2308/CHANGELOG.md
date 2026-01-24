# CHANGELOG - 2026-01-23_2308 Batch

> 생성일: 2026-01-24

## 📊 처리 요약

| 유형 | 개수 |
|------|------|
| NEW | 5 |
| UPDATE | 11 |
| DELETE | 0 |
| **Total** | **16** |

---

## 🆕 NEW (신규 생성)

### API
| 파일 | 설명 |
|------|------|
| `specs/api/stock/history.md` | 종목 차트 조회 API (OHLC) |

### UI
| 파일 | 설명 |
|------|------|
| `specs/ui/stock/detail.md` | 종목 상세 화면 (차트, 보유현황) |
| `specs/ui/auth/profile-edit.md` | 프로필 편집 화면 |
| `specs/ui/auth/splash.md` | 스플래시 화면 |
| `specs/ui/settings/main.md` | 설정 메인 화면 (별도 폴더) |

---

## ✏️ UPDATE (수정)

### DB
| 파일 | 변경 내용 |
|------|-----------|
| `specs/db/auth/settings.md` | `investment_type` 컬럼 추가 |
| `specs/db/log/audit-logs.md` | `LOGIN_FAILED` ENUM 값 추가 |

### API
| 파일 | 변경 내용 |
|------|-----------|
| `specs/api/auth/profile-update.md` | `investmentType` 필드 추가 |
| `specs/api/portfolio/detail.md` | 수익률 필드 추가 (totalBuyAmount, totalProfit, totalProfitRate) |
| `specs/api/rebalancing/calculate.md` | `summary` 객체 추가 (비용 요약) |

### UI
| 파일 | 변경 내용 |
|------|-----------|
| `specs/ui/auth/profile-input.md` | 투자 성향 선택 UI 추가 |
| `specs/ui/portfolio/detail.md` | 요약 카드에 수익 정보 추가, 종목 탭 동작 변경 |
| `specs/ui/rebalancing/check.md` | 비용 요약 카드 추가, 복사 기능 추가 |
| `specs/ui/stock/search.md` | 보유 배지, 등락률 색상 구분 추가 |
| `specs/ui/stock/add.md` | 전체 화면 → 모달로 변경 |

---

## 📁 원본 Staging 파일

- `[NEW] stock-detail.md`
- `[UPDATE] auth.md`
- `[UPDATE] log.md`
- `[UPDATE] portfolio-detail.md`
- `[UPDATE] rebalancing.md`
- `[UPDATE] stock-search.md`

---

## ✅ 적용된 사용자 결정

| 항목 | 선택 |
|------|------|
| 차트 데이터 | OHLC 캔들 (옵션 B) |
| 종목 단건 조회 | Frontend State (옵션 A) |
| 투자 성향 필수 | 필수 선택 (옵션 A) |
| 설정 화면 위치 | `ui/settings/` 별도 폴더 (옵션 B) |
| 로그인 실패 사유 | new_value JSON 활용 (옵션 A) |
| 수익률 계산 | 전체 자산 기준 (옵션 A) |
| 종목 탭 동작 | 조회 전용 (옵션 B) |
| 순수 필요 자금 표시 | 동적 라벨 (옵션 B) |
| 보유 종목 선택 | 선택 불가/Dimmed (옵션 A) |
