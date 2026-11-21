# MediCore AWS deployment (first working deployment)

This repository has a React frontend and an Express API backed by PostgreSQL. This guide deploys the API as a Docker container with Amazon ECS Express Mode and the database on Amazon RDS for PostgreSQL. It does not create AWS resources automatically; follow the steps in your AWS account and review the current prices before creating billable resources.

## 1. Prepare PostgreSQL

Create an RDS PostgreSQL database in the same AWS region as App Runner. For a temporary demonstration, choose a small burstable instance, enable storage encryption, set a strong generated master password, and keep **Public access = No**. Create a database named `healthcare` and note the endpoint, database username, and password. In the RDS security group, allow inbound TCP 5432 only from the App Runner VPC connector security group (created below), never from `0.0.0.0/0`.

Run the schema once from a temporary EC2 instance in the same VPC after network rules are configured. Do not make the database public just to run the migration.

The migration creates the tables and the `doctor_details` / `patient_details` views expected by current queries. It is designed for an empty database. It does not migrate existing records.

## 2. Build and publish the backend image

Create a private Amazon ECR repository (for example `medicore-api`). Build and push `Backend/Dockerfile` from your Mac using the AWS CLI and Docker. The image listens on port 3001 and has a `/health` endpoint.

## 3. Connect ECS Express Mode to the private database

The ECS Express Mode service and RDS instance must use a compatible VPC/network setup. Configure the ECS service with private subnets and a service security group. In the RDS security group, allow TCP 5432 only from that service security group. Keep the database private. Configure the service's load balancer to be internet-facing so Vercel can reach the API.

Create an ECS Express Mode service from the private ECR image. Set the container port to `3001` and health check path `/health`. Configure environment variables and secrets:

```text
PG_HOST=<RDS endpoint>
PG_PORT=5432
PG_DATABASE=healthcare
PG_USER=<database username>
PG_PASSWORD=<database password>
PG_SSL=true
KEY=<long random secret, at least 32 bytes>
CORS_ORIGINS=<your exact Vercel site URL>
```

Store the database password and `KEY` in AWS Secrets Manager and reference them as ECS container secrets. Do not commit actual secrets into GitHub or put them in the frontend environment. ECS Express Mode creates an HTTPS endpoint through its load balancer.

## 4. Point Vercel at the API

In the Vercel project settings or in `FrontEnd/.env.production`, set the build-time variable:

```text
REACT_APP_API_BASE_URL=https://me-6b34abc099ee4c95942b6196643b9290.ecs.ap-south-1.on.aws
```

Redeploy the frontend. Set `CORS_ORIGINS` in the ECS service to the exact deployed Vercel origin:
```text
CORS_ORIGINS=http://localhost:3000,https://health-care-six-ivory.vercel.app
```

## 5. Check it

Open `https://me-6b34abc099ee4c95942b6196643b9290.ecs.ap-south-1.on.aws/health`. A successful response is `{"status":"ok","database":"ok"}`. Then load `https://health-care-six-ivory.vercel.app` and check its browser network panel for API calls. Review the service's CloudWatch logs if any error occurs.

## Important current application limitations

- There is no file upload or S3 integration in this codebase today, so an S3 bucket is not required to run the current app.
- The existing app stores passwords as plain text and some endpoints expose user records. Do not use real patient or personal data until authentication, password hashing, authorization, and data exposure are fixed.
- Current login JWT payloads contain only a placeholder and authorization middleware does not yet establish a user identity. Treat this as a demo deployment, not a production healthcare system.
- The current route code has other functional defects that may surface during end-to-end use. Deployment only makes the service reachable; it does not certify the app's features or security.
- Terminate or scale down billable resources after the demo. RDS, Fargate, load balancer, and logging can incur charges; check AWS pricing for the selected region and configuration.
