# 스킬 업데이트 체크리스트

## package completeness 기준

- `SKILL.md`
- `references/*.md`
- `skill.html`
- `agents/openai.yaml`
- `project-snippets/<skill>.md`
- README, AGENTS, docs
- `history/skills.md`
- validator와 eval case

## coordination rules 기준

- behavior change와 visual guide를 분리하지 않는다.
- 한국어 Markdown 규칙을 지킨다.
- source of truth가 충돌하면 추측하지 말고 묻는다.
- skill inventory가 바뀌면 show-skills catalog를 갱신한다.

## history rules 기준

trigger, workflow, validator, eval, snippet, lifecycle state가 의미 있게 바뀔 때만 기록한다. typo나 단순 copy polish는 기록하지 않는다.

## failure modes 기준

- HTML은 갱신됐지만 SKILL.md가 stale
- validator가 영어 고정 문구만 검사
- snippet이 이전 trigger를 설명
- history가 lifecycle state와 불일치
