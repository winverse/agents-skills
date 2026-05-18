# 터미널 세션 hook recipe 기준

## host discovery 기준

먼저 현재 terminal host를 좁힌다. 서로 다른 host의 기능을 섞어서 같은 API처럼 다루지 않는다.

### cmux

```bash
cmux --help
cmux docs hooks
cmux identify
env | rg '^CMUX_'
```

### Warp

```bash
env | rg '^(TERM_PROGRAM|WARP_)'
test "$TERM_PROGRAM" = "WarpTerminal" && printf '\033]0;%s\007' "sample title" > /dev/tty
oz --help
```

Warp에서는 shell title sequence, `.warp/workflows`, launch configuration, Oz/agent entrypoint를 별개 표면으로 본다. shell title은 tab title 표시이고 cmux status처럼 공유 상태를 저장하지 않는다.

### generic terminal 기준

```bash
printf '\033]0;%s\007' "sample title" > /dev/tty
```

host가 불명확하면 prompt path에서는 no-op로 성공하고, workflow note나 수동 command만 남긴다.

## prompt pinning recipe 기준

### cmux

1. `CMUX_SURFACE_ID`가 있으면 current surface로 사용한다.
2. 없으면 `cmux identify`로 fallback한다.
3. `UserPromptSubmit` payload에서 원문 prompt를 가져온다.
4. `cmux rename-tab --surface <id> <prompt>` 또는 `cmux set-status`를 실행한다.
5. hook은 긴 validation이나 repo scan을 하지 않는다.

### Warp와 일반 terminal

1. `TERM_PROGRAM=WarpTerminal`이면 Warp host로 본다.
2. `/dev/tty`가 쓸 수 있을 때만 OSC title sequence를 출력한다.
3. prompt에서 BEL, ESC 같은 terminal control 문자를 제거한다.
4. shell이나 Warp가 자동 제목을 다시 덮으면 사용자가 원할 때만 shell rc에 `WARP_DISABLE_AUTO_TITLE=true` 같은 host-specific 설정을 안내한다.
5. `/dev/tty`가 없거나 output이 실패하면 조용히 성공 종료한다.

## payload discovery 기준

payload shape가 불명확하면 local scratch log에 scrubbed JSON을 남기고, secret이나 private prompt가 외부로 나가지 않게 한다.

## session board 기준

session board는 상태를 보여주는 보조 산출물이다. 자동으로 surface를 닫거나 history를 지우지 않는다.

## safety rules 기준

- global hook 설치는 사용자 명시 없이는 하지 않는다.
- Warp, Oz, shell rc, terminal profile 같은 global 설정은 사용자 명시 없이는 바꾸지 않는다.
- visible browser fallback은 background-only 요청과 충돌하면 쓰지 않는다.
- latency가 느리면 bug로 보고 hook 일을 줄인다.
