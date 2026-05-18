---
name: warp-automation
description: "Warp에서 tab title이 assistant 응답을 선택하도록, 답변 첫 줄에 사용자 프롬프트를 짧게 정리해야 할 때 사용한다."
---

# Warp 자동화

이 스킬의 기본 동작은 하나다. Warp가 최신 prompt/title fallback으로 assistant 응답을 읽는 상황에서, 답변 첫 줄에 사용자가 방금 물어본 프롬프트를 짧게 정리한다.

terminal이나 config를 조작하는 workflow는 기본 경로가 아니다. 사용자가 그것들을 별도로 명시하지 않으면 실행하거나 설명하지 않는다.

## 핵심 계약

- 첫 줄은 현재 사용자 프롬프트의 짧은 제목이다.
- 첫 줄에는 `Q:`, `Prompt:`, 따옴표, markdown heading을 붙이지 않는다.
- 첫 줄은 32자 이내로 쓴다.
- 둘째 줄은 비운다.
- 셋째 줄부터 실제 답변을 이어간다.
- secret, token, private URL, full local path, 개인 식별 정보는 제목에 쓰지 않고 `민감정보 포함 요청` 같은 중립 제목으로 바꾼다.
- 사용자가 “테스트”, “잘 나오는지”, “스킬 작동”처럼 확인을 요청하면 이 형식 자체를 테스트 결과로 쓴다.
- 사용자가 일반 답변을 원하거나 이 fallback을 끄라고 하면 첫 줄 제목 규칙을 중단한다.

## 응답 형식

```text
사용자 질문 요약

실제 답변은 여기서 시작한다.
```

## 예시

사용자:

```text
지금 WAV 오토메이션 스킬이 너무 복잡한 것 같은데?
그냥 세션 타겟 필요 없이, 너의 응답 값만 선택하면 돼.
```

응답:

```text
Warp 응답 첫 줄로 단순화

맞습니다. 이 스킬은...
```

## 하지 않는 일

- `TERM_PROGRAM` 확인을 기본 절차로 만들지 않는다.
- terminal session을 찾거나 관련 환경변수를 요구하지 않는다.
- terminal title sequence를 쓰지 않는다.
- readback 성공 조건을 요구하지 않는다.
- 질문 파일, Warp 설정 파일, launch 설정을 기본 경로로 안내하지 않는다.
- project-local hook 설치, global Warp 설정 변경을 이 스킬의 기본 작업으로 만들지 않는다.

## 참고

세부 작성 규칙은 `references/response-title-format.md`에 둔다. 이 reference도 응답 첫 줄 formatting만 다루며, hook이나 terminal 자동화 절차를 기본으로 삼지 않는다.
