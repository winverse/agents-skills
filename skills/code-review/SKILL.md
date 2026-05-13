---
name: code-review
description: "code review, PR review, diff review, implementation audit, regression risk, missing test, maintainability, JS/TS style, agent/tool-call boundary를 findings-first로 검토할 때 사용한다."
---

# 코드 리뷰

리뷰는 칭찬보다 문제 발견이 목적이다. findings를 먼저 쓰고, severity 순서로 file/line reference와 함께 제시한다.

## review stance 기준

- bug, behavioral regression, missing test, security risk를 우선한다.
- 추측은 추측이라고 표시한다.
- 문제가 없으면 그렇게 말하고 residual risk나 test gap만 남긴다.
- 단순 취향 변경은 blocking finding으로 만들지 않는다.

## 확인할 것

- 입력 validation, error path, async race, state mismatch
- SRP/SOLID boundary와 over-coupling
- JS/TS에서 type soundness, nullable handling, collection logic
- agent/tool-call boundary, prompt injection, destructive side effect
- secret/private data scrubbing과 least privilege

## output shape 기준

```text
Findings
- [severity] path:line - 문제와 영향

Open Questions
- <있을 때만>

Summary
- <짧게>
```

## 하지 말 것

- findings 전에 긴 요약을 쓰지 않는다.
- file/line 없는 일반론만 말하지 않는다.
- unrelated refactor를 리뷰 요구로 둔갑시키지 않는다.
