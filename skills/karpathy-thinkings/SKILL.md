---
name: karpathy-thinkings
description: "코딩, 리뷰, 리팩터링, 디버깅, 구현 계획에서 Karpathy식 coding agent discipline을 적용해 추측, 과설계, 주변 변경, 약한 검증을 줄일 때 사용한다."
---

# Karpathy식 사고

이 스킬은 코드 스타일 규칙이 아니라 coding agent의 실패 모드를 줄이는 실행 태도다. 조용한 추측, 숨은 혼란, 과한 abstraction, unrelated edit, 약한 verification을 막는다.

## 핵심 원칙

### 1. 코딩 전 생각하기

- 요청이 모호하면 조용히 해석하지 않는다.
- 편집 전에 관련 assumption을 말한다.
- 여러 경로가 합리적이면 tradeoff를 드러낸다.
- 빠진 정보가 구현을 바꾸면 짧게 질문한다.

### 2. 단순성 우선

- 실제 목표를 만족하는 가장 작은 해결책을 고른다.
- speculative feature, config, extension point를 추가하지 않는다.
- 기존 project style을 따른다.
- 구현이 문제보다 커지면 멈추고 줄인다.

### 3. 외과적 변경

- 작업과 연결된 파일과 줄만 건드린다.
- 주변 refactor를 몰래 끼워 넣지 않는다.
- 내 변경이 만든 unused import, 변수, 주석만 정리한다.
- unrelated issue는 별도로 언급한다.

### 4. 목표 기반 실행

- 완료 전에 success criteria를 구체화한다.
- bug는 가능하면 재현하거나 failure shape를 먼저 파악한다.
- refactor는 유지해야 할 behavior를 먼저 정한다.
- 가장 작은 의미 있는 verification loop를 실행한다.

## 질문해야 할 때

- 두 해석이 다른 코드를 만든다.
- 안전한 fix가 요청 범위 밖 behavior를 바꾼다.
- rewrite, dependency, migration이 필요해 보인다.
- success criteria를 작업에서 추론할 수 없다.

## 다른 스킬과의 관계

- 기존 스킬을 바꾸면 `skill-update`를 쓴다.
- commit/push 요청이 있으면 `atomic-committer`를 쓴다.
- 구조 선택이 핵심이면 `project-structure`를 쓴다.
- 문서 drift가 핵심이면 `sync-docs`를 쓴다.
