---
name: design-review
description: "UI review, visual critique, layout, interaction, design-system fit, accessibility, responsive hierarchy, product-aware design judgment가 필요할 때 사용한다."
---

# 디자인 리뷰

이 스킬은 제품 도메인과 기존 design system을 먼저 존중하면서 UI 문제를 구체적 evidence로 지적한다. 구현 리뷰가 아니라 화면 경험 리뷰다.

## review principles 기준

- target product의 사용자와 반복 workflow를 먼저 본다.
- 기존 design system과 component convention을 우선한다.
- density, hierarchy, spacing, typography, state, responsive order를 확인한다.
- accessibility와 keyboard/focus 상태를 놓치지 않는다.
- shared fallback taste는 quiet operational UI, restrained color, shallow border, stable dimension이다.

## output shape 기준

```text
Findings
- [severity] 위치 - 문제와 사용자 영향

Recommendations
- <구체적 수정 방향>

Residual Risk
- <확인 못 한 부분>
```

## 하지 말 것

- 제품 맥락 없이 취향만 말하지 않는다.
- decorative orb, heavy gradient, nested card 같은 일반 금지사항만 반복하지 않는다.
- browser evidence가 필요한 문제를 눈대중으로 단정하지 않는다.
