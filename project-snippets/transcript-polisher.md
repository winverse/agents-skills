## Project Skills

- 전사본, 강의 대본, 자막, 회의록, 긴 산문을 문맥 흐름에 맞게 직접 읽고 다듬어야 할 때는 `<skills-root>/skills/transcript-polisher/SKILL.md`의 공유 스킬을 사용한다.

## Project Skill Overrides

- `transcript-polisher`를 사용할 때 코드 치환표, regex, 일괄 문자열 치환을 편집 엔진으로 쓰지 않는다.
- 스크립트는 파일 목록, 줄 번호, 문단 수, 검증 결과를 확인하는 보조 용도로만 사용한다.
- 긴 텍스트는 문단, 구문, 강의 흐름 단위로 나누고 runtime이 허용하면 단위마다 subagent를 배정한다.
- 강의 예시, 모델이 일부러 만든 어색한 출력 예시, 원문의 의도적 비문은 자동으로 매끈하게 고치지 말고 보존 여부를 판단한다.
- 긴 검토는 Claude `/goal` 방식처럼 완료 조건, 증거, 미충족 항목, 재검토 루프를 명시한다.
