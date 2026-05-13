# 코드 리뷰 체크리스트

## 기능 위험

- 실패 path가 테스트됐는가
- 기존 behavior를 깨는 default 변경이 있는가
- migration, cache, retry, concurrency 영향이 있는가

## tool/security surface 기준

- tool call 입력에 untrusted content가 섞이는가
- destructive command에 approval boundary가 있는가
- secret, private data, raw transcript가 저장되는가
- network/file write 범위가 최소인가

## 리뷰 출력

- severity가 명확한가
- file/line reference가 있는가
- reproduction 또는 reasoning이 충분한가
- 해결 방향이 과도한 rewrite가 아닌가
