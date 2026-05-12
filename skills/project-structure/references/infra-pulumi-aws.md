# Pulumi AWS Infrastructure Structure

Use this reference when the selected structure includes deployment, cloud, Docker, Pulumi, AWS, ECR, ECS, EC2, or CI/CD deployment folders.

Infrastructure is an optional add-on. Do not include it in a small frontend, backend, desktop, or monorepo tree unless the user asks for deployment, production readiness, cloud hosting, Docker images, or AWS runtime structure.

## Infrastructure Menu

Ask only when the answer changes the tree:

```text
Infrastructure: 1 Pulumi AWS default when infra is requested, 2 no infra, 3 existing infra tool
Container registry: 1 Docker image to AWS ECR default when deploying containers, 2 no registry, 3 external registry
Runtime target: 1 ECS Fargate default for new AWS container runtime, 2 EC2 Docker host, 3 no cloud runtime
Public entrypoint: 1 ALB default for public AWS services, 2 internal service, 3 existing DNS/CDN
```

## Default Infrastructure Tree

```text
apps/
  web/
    Dockerfile
    .dockerignore
  api/
    Dockerfile
    .dockerignore

docker/
  docker-compose.yml       # local-only service composition

infra/
  pulumi/
    Pulumi.yaml
    Pulumi.dev.yaml.example
    Pulumi.dev.yaml
    Pulumi.stage.yaml
    Pulumi.prod.yaml
    README.md
    package.json
    tsconfig.json
    src/
      index.ts
      config.ts
      network.ts
      security-groups.ts
      iam.ts
      ecr.ts
      runtime/
        ecs-fargate.ts      # selected default; replace with ec2-docker.ts when EC2 is selected
      load-balancer.ts
      dns.ts                # only when Route 53 is selected
      certificates.ts       # only when ACM/TLS is selected
      logs.ts
      outputs.ts
    scripts/
      build-image.ts
      push-ecr-image.ts
      deploy-stack.ts
      smoke-check.ts
```

## Ownership Rules

- App Dockerfiles live beside deployable apps: `<app>/Dockerfile` and `<app>/.dockerignore`.
- `docker/` or `docker-compose.yml` is for local-only service composition and smoke workflows. Do not model it as the production runtime.
- `infra/pulumi` owns AWS infrastructure code and Pulumi stack config.
- Pulumi owns network, IAM, ECR repositories, ECS services or EC2 hosts, load balancer, security groups, logs, and runtime wiring.
- Public services use an ALB by default. Add Route 53 and ACM only when the user selects a custom domain or TLS path.
- App env schemas own application variables. Pulumi stack config owns infrastructure values such as AWS region, account, image tag, domain, capacity, and runtime target.
- MongoDB Atlas is an external managed data platform by default. Pulumi AWS may document Atlas network access or consume Atlas connection/endpoint settings, but should not create Atlas resources unless the user explicitly selects Atlas IaC management.
- Supabase Postgres is an external managed PostgreSQL platform by default. Pulumi AWS should not own Supabase projects unless the user explicitly asks for that integration.
- Do not commit live secrets in Pulumi stack files. Use secret config providers or placeholders and document required secret names.
- CI/CD should build Docker images, push immutable tags to ECR, and run `pulumi up` with the selected image tag or deployment config.

## Setup Completeness

When generating project setup instructions, include these pieces:

- `infra/pulumi/README.md` with required AWS account, region, Pulumi stack names, runtime target, and deployment commands.
- `Pulumi.<stack>.yaml.example` or equivalent examples that show config keys without live secret values.
- A documented list of required secret names, where they are stored, and which app/provider consumes them.
- A selected health endpoint or smoke URL for post-deploy checks.
- A rollback note that says the immutable image tag and Pulumi stack update are the deployment unit.

## Runtime Choice

Prefer ECS Fargate when:

- The app is containerized and should run without host management.
- The user wants a normal web/API production runtime.
- Scaling, rolling deploys, and load balancer integration matter more than direct host control.

Prefer EC2 Docker host when:

- The user explicitly wants VM-level control.
- SSH workflows, host customization, special daemons, or persistent host processes matter.
- The project needs a simpler single-host deployment before moving to ECS.

Do not include both ECS Fargate and EC2 runtime folders as active production paths unless the user explicitly asks for a migration or comparison structure. If both examples appear in a reference tree, label one as the selected path and the other as optional.

## CI/CD Boundary

Recommended flow:

```text
typecheck/test/codegen/db check
-> docker build immutable image
-> push image to AWS ECR
-> pulumi up with image tag
-> run smoke/e2e checks against deployed endpoint
```

The project structure may include CI workflow folders, but do not invent a provider-specific workflow unless the user selected GitHub Actions, GitLab CI, another runner, or an existing repo already has one.
