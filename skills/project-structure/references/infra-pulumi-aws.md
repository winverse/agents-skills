# Pulumi AWS infra 구조

## 기본 tree

```text
infra/pulumi/
  index.ts
  Pulumi.yaml
  stacks/
apps/api/Dockerfile
apps/web/Dockerfile
```

## ownership rules 기준

- Pulumi는 AWS resource ownership을 가진다.
- app Dockerfile은 각 app 폴더에 둔다.
- ECR image ownership과 immutable tag handoff를 명시한다.
- runtime은 ECS Fargate 또는 EC2 Docker host 중 하나만 선택해 적는다.

## setup completeness 기준

public entrypoint, required secret names, stack config example, deploy command, post-deploy smoke check를 포함한다. live secret value는 절대 적지 않는다.
