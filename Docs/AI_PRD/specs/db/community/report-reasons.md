---
type: db
phase: P2
table: report_reasons
related:
  api: []
  db:
    - specs/db/community/reports.md
---

# report_reasons

> 신고 사유 마스터 테이블

## 스키마

```sql
-- 신고 사유
CREATE TABLE report_reasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,               -- 코드 (예: 'SPAM', 'ABUSE')
  name VARCHAR(100) NOT NULL,                     -- 표시명
  is_active BOOLEAN DEFAULT TRUE,                 -- 활성화 여부

  UNIQUE INDEX idx_report_reasons_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 컬럼 상세

| 컬럼      | 타입         | 필수 | 설명                    | Phase |
| --------- | ------------ | ---- | ----------------------- | ----- |
| id        | INT          | Y    | PK, AUTO_INCREMENT      | P2    |
| code      | VARCHAR(50)  | Y    | 신고 사유 코드 (UNIQUE) | P2    |
| name      | VARCHAR(100) | Y    | 표시명                  | P2    |
| is_active | BOOLEAN      | Y    | 활성화 여부             | P2    |

## 초기 데이터 (권장)

```sql
INSERT INTO report_reasons (code, name) VALUES
('SPAM', '스팸/광고'),
('ABUSE', '욕설/비방'),
('SEXUAL', '음란물'),
('VIOLENCE', '폭력적 내용'),
('FRAUD', '사기/허위정보'),
('COPYRIGHT', '저작권 침해'),
('PERSONAL_INFO', '개인정보 노출'),
('OTHER', '기타');
```

## 비즈니스 규칙

- 관리자가 신고 사유 추가/수정/비활성화 가능
- `is_active = FALSE`인 사유는 신고 시 선택 불가
