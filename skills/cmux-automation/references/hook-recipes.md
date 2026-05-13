# cmux hook recipe 기준

## discovery command 기준

```bash
cmux --help
cmux docs hooks
cmux identify
env | rg '^CMUX_'
```

## prompt pinning recipe 기준

1. `CMUX_SURFACE_ID`가 있으면 current surface로 사용한다.
2. 없으면 `cmux identify`로 fallback한다.
3. `UserPromptSubmit` payload에서 원문 prompt를 가져온다.
4. `cmux rename-tab --surface <id> <prompt>` 또는 `cmux set-status`를 실행한다.
5. hook은 긴 validation이나 repo scan을 하지 않는다.

## payload discovery 기준

payload shape가 불명확하면 local scratch log에 scrubbed JSON을 남기고, secret이나 private prompt가 외부로 나가지 않게 한다.

## session board 기준

session board는 상태를 보여주는 보조 산출물이다. 자동으로 surface를 닫거나 history를 지우지 않는다.

## safety rules 기준

- global hook 설치는 사용자 명시 없이는 하지 않는다.
- visible browser fallback은 background-only 요청과 충돌하면 쓰지 않는다.
- latency가 느리면 bug로 보고 hook 일을 줄인다.
