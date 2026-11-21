# MediCore AWS deployment (first working deployment)

This repository has a React frontend and an Express API backed by PostgreSQL. This guide deploys the API as a Docker container on AWS App Runner and the database on Amazon RDS for PostgreSQL. It does not create AWS resources automatically; follow the steps in your AWS account and review the current prices before creating billable resources.

## 1. Prepare PostgreSQL

Create an RDS PostgreSQL database in the same AWS region as App Runner. For a temporary demonstration, choose a small burstable instance, enable storage encryption, set a strong generated master password, and keep **Public access = No**. Create a database named `healthcare` and note the endpoint, database username, and password. In the RDS security group, allow inbound TCP 5432 only from the App Runner VPC connector security group (created below), never from `0.0.0.0/0`.

Run the schema once from a trusted machine that can reach the database, or from a temporary EC2 instance in the same VPC:

```sh
cd Backend
npm ci
PG_HOST='<RDS endpoint>' PG_PORT=5432 PG_DATABASE=healthcare PG_USER='<db user>' PG_PASSWORD='<db password>' PG_SSL=true node scripts/migrate.js
```

The migration creates the tables and the `doctor_details` / `patient_details` views expected by current queries. It is designed for an empty database. It does not migrate existing records.

## 2. Build and publish the backend image

Create a private Amazon ECR repository (for example `medicore-api`). From the repository root, build and push `Backend/Dockerfile` using the AWS Console's ECR push commands. The image listens on port 3001 and has a `/health` endpoint for App Runner.

## 3. Connect App Runner to the private database

Create a VPC connector in the VPC/subnets containing the RDS instance. Give it a dedicated security group. In the RDS security group, allow TCP 5432 from that connector security group. The connector's subnets need outbound connectivity to the database; App Runner's ECR image retrieval is handled by App Runner.

Create an App Runner service from the ECR image, set port `3001`, and attach the VPC connector. Configure health check path `/health`. Set these runtime variables in App Runner:

```text
PORT=3001
PG_HOST=<RDS endpoint>
PG_PORT=5432
PG_DATABASE=healthcare
PG_USER=<database username>
PG_PASSWORD=<database password>
PG_SSL=true
KEY=<long random secret, at least 32 bytes>
CORS_ORIGINS=<your exact Vercel site URL>
```

Store the database password and `KEY` as App Runner secrets from AWS Secrets Manager or Parameter Store. Do not commit actual secrets into GitHub or place them in the frontend environment. App Runner public ingress is needed for Vercel to call the API; use HTTPS and keep the database private.

## 4. Point Vercel at the API

In the Vercel project settings, set the build-time variable:

```text
REACT_APP_API_BASE_URL=https://<App Runner service hostname>
```

Redeploy the frontend. Set `CORS_ORIGINS` in App Runner to the exact deployed Vercel origin, such as `https://your-project.vercel.app` (no trailing slash). If you use a custom domain, include its exact origin too, comma-separated.

## 5. Check it

Open `https://<App Runner service hostname>/health`. A successful response is `{"status":"ok","database":"ok"}`. Then load the Vercel site and check its browser network panel for API calls. Review App Runner logs if the health check returns 503.

## Important current application limitations

- There is no file upload or S3 integration in this codebase today, so an S3 bucket is not required to run the current app.
- The existing app stores passwords as plain text and some endpoints expose user records. Do not use real patient or personal data until authentication, password hashing, authorization, and data exposure are fixed.
- Current login JWT payloads contain only a placeholder and authorization middleware does not yet establish a user identity. Treat this as a demo deployment, not a production healthcare system.
- The current route code has other functional defects that may surface during end-to-end use. Deployment only makes the service reachable; it does not certify the app's features or security.
- Terminate or scale down billable resources after the demo. RDS and App Runner can incur charges while idle; check AWS pricing for the selected region and configuration.
