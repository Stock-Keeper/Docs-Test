# 처리 내역 - 2026-01-16_1807

## 원본 파일
- account.md

## 업데이트된 스펙 (3개)

| 파일 | 테이블 | 변경 내용 |
|------|--------|----------|
| specs/db/accounts.md | accounts | phase P2→P1 변경, P1/P2 모드 설명 추가 |
| specs/db/account-stock-entries.md | account_stock_entries | phase P2→P1 변경, 수동 입력 설명 추가 |
| specs/db/account-cash-entries.md | account_cash_entries | phase P2→P1 변경, 수동 입력 설명 추가 |

## 변경 요약

### P1/P2 분리 정책 적용
- **P1**: 증권사 연동 없이 사용자가 수동으로 종목/수량/현금 입력
- **P2**: 증권사 API 연동을 통한 자동 동기화

### 사용자 선택 사항
- [X] accounts 테이블 Phase: P1으로 변경
- [X] account-stock-entries 테이블 Phase: P1으로 변경
- [X] account-cash-entries 테이블 처리: P1으로 함께 변경
- [X] account_number 컬럼: P1 유지 (optional)

## INDEX.md 업데이트
- P1 테이블 목록에 account 관련 3개 테이블 추가
- spec_count: db 14→27, total 62→75

## 처리 시각
- 완료: 2026-01-16 18:07
