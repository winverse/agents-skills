# Tauri desktop 구조

## 기본 tree

```text
apps/desktop/
  src/
  src-tauri/
    src/
    tauri.conf.json
  package.json
```

## boundary

- UI는 web app convention을 따른다.
- native capability는 `src-tauri`에 격리한다.
- file system, shell, network permission은 최소 권한으로 적는다.
- build artifact와 signing secret은 source tree와 분리한다.

이 파일은 desktop app 구조를 정할 때 agent가 어느 영역을 web code로 보고 어느 영역을 native 권한 경계로 볼지 판단하게 돕는다. 권한과 빌드 산출물은 반드시 별도 경계로 설명한다.
