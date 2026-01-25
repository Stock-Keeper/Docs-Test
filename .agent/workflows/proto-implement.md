---
description: PRD 스펙 기반 프로토타입 화면 구현
---

# 프로토타입 화면 구현

## 사용법

```
/proto-implement {domain} [phase]
```

예시:

- `/proto-implement portfolio` - portfolio 도메인 전체
- `/proto-implement portfolio P1` - P1만

## 절차

1. **스펙 로드**
   - `specs/ui/{domain}/*.md` 읽기
   - phase 필터링 (지정 시)

2. **화면 생성** (도메인당)
   - `screens/{domain}/{screen}.html`
   - `css/screens/{domain}/{screen}.css`
   - `screen-controllers/{domain}/{screen}.js`

3. **등록**
   - `config/screens.json` 업데이트
   - README 체크리스트 갱신

## 규칙

- 한 번에 **최대 5개 화면**
- 도메인 단위 처리
- 완료 후 체크리스트 업데이트 필수

## PRD 스펙 요구사항

구현 전 `specs/ui/` 스펙에 아래 섹션이 있는지 확인:

- ✅ 레이아웃 (ASCII 다이어그램)
- ✅ 상태 (로딩/빈/에러)
- ✅ 상호작용 (액션 테이블)

누락 시 `/prd-validate {domain}` 먼저 실행

## 참고

- 스킬: `.agent/skills/prototype-architect/SKILL.md`
- 결정사항: `Docs/인사이트/prototype-v4-decisions.md`
