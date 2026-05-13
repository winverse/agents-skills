---
name: browser-qa
description: "웹 페이지, web app, skill.html, responsive layout, console/network, accessibility snapshot, screenshot, broken link, text overflow를 Playwright 기반 browser evidence로 확인할 때 사용한다."
---

# 브라우저 QA

이 스킬은 실제 브라우저에서 관찰한 증거로 렌더링과 상호작용 문제를 확인한다. 주관적 디자인 평가는 `design-review`가 함께 요청된 경우에만 한다.

## workflow

1. 대상 URL 또는 local file을 연다.
2. desktop과 필요한 mobile viewport를 정한다.
3. accessibility snapshot으로 구조와 주요 text를 확인한다.
4. console error와 network failure를 본다.
5. screenshot으로 overflow, overlap, blank canvas, missing asset을 확인한다.
6. 사용자 요청과 직접 관련된 interaction만 수행한다.

## output shape 기준

```text
확인 범위
- <URL/file/viewports>

결과
- PASS/FAIL: <관찰 근거>

증거
- console: <요약>
- screenshot/snapshot: <파일 또는 관찰>
```

## safety rules 기준

- secret, payment data, destructive live action은 입력하지 않는다.
- 실제 서비스에서 상태를 바꾸는 버튼은 사용자 확인 없이 누르지 않는다.
- browser evidence 없이 단정하지 않는다.
