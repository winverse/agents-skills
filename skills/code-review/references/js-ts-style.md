# JavaScript와 TypeScript 리뷰 기준

## functional collection style 기준

`map`, `filter`, `reduce`, `flatMap`, `some`, `every`가 의도를 더 잘 드러내면 선호한다. 단, 단순 loop가 더 명확하거나 early exit, mutation boundary, async sequencing을 보여야 하면 loop를 유지한다.

## TypeScript 기준

- `any`가 boundary 밖으로 새지 않는지 본다.
- nullable 값은 guard 후 사용한다.
- DTO, API response, DB row의 shape가 섞이지 않게 한다.
- generated type을 손으로 복제하지 않는다.

## 책임 경계

- IO와 pure transform을 분리한다.
- validation, authorization, persistence, presentation 책임을 한 함수에 몰지 않는다.
- abstraction은 실제 중복과 복잡도를 줄일 때만 요구한다.
