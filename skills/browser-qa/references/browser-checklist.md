# 브라우저 QA 체크리스트

## 수집할 증거

- accessibility snapshot
- console error/warning
- failed network request
- desktop screenshot
- mobile screenshot
- 핵심 interaction 결과

## viewport 기본값

| 대상 | 크기 |
| --- | --- |
| desktop | 1440x900 |
| mobile | 390x844 |
| tablet 필요 시 | 768x1024 |

## static HTML 기준

`skill.html`은 file URL 또는 정적 서버에서 열고, 외부 CDN이나 missing local asset이 없는지 본다.

## frontend app 기준

dev server가 필요하면 기존 port를 확인하고, 사용 가능한 port로 실행한다. final report에는 사용자가 열 수 있는 URL을 남긴다.

## 정리 기준

- QA가 끝나면 Playwright/Chrome tab을 닫는다.
- QA 중 직접 시작한 local HTTP server나 dev server는 사용자가 계속 열어 두라고 요청한 경우가 아니면 중지한다.
- final report에는 browser/session과 server를 닫았는지, 유지했다면 그 이유를 남긴다.

## failure severity 기준

- blocking: blank page, runtime crash, unusable control, hidden primary content
- major: responsive overlap, broken asset, key flow failure
- minor: console warning, small visual overflow, non-critical copy issue
