# 응답 첫 줄 title 형식

이 reference는 Warp title fallback에서 assistant 응답 첫 줄이 tab title 후보로 선택되는 상황만 다룬다.

## 기본 형식

```text
사용자 질문 요약

실제 답변
```

## 작성 규칙

- 첫 줄은 사용자가 방금 입력한 프롬프트를 32자 이내로 정리한다.
- 첫 줄은 사람이 바로 읽을 수 있는 명사구나 짧은 문장으로 쓴다.
- 둘째 줄은 반드시 비운다.
- 셋째 줄부터 실제 답변을 쓴다.
- `Q:`, `Prompt:`, markdown heading, 따옴표, 번호 prefix를 붙이지 않는다.
- secret, token, private URL, full local path, 개인 식별 정보는 첫 줄에 쓰지 않는다.

## 예시

| 사용자 프롬프트 | 첫 줄 title |
| --- | --- |
| `한 번 테스트해보자. 잘 나오는지.` | `한 번 테스트해보자` |
| `warp-automation이 너무 복잡해. 응답 첫 줄만 쓰면 돼.` | `Warp 응답 첫 줄로 단순화` |
| `커밋 푸쉬해줘` | `커밋 푸시 요청` |
| token이나 private URL이 포함된 요청 | `민감정보 포함 요청` |

## 기본으로 하지 않는 일

- host 확인
- terminal session 탐색
- terminal title sequence 출력
- Accessibility 검증
- Warp 설정 파일이나 launch 설정 생성
- project-local hook 설치나 승인 안내
