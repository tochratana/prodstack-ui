# prod-stack-ui

A **Next.js** frontend application built as a learning project for:

- 🚀 Deploying to **Kubernetes (K8s)**
- ⚙️ Setting up **CI/CD with GitHub Actions**
- 🔗 Communicating with a **backend API** (Blog Posts)

---

## 📌 Project Purpose

This project is a **test deployment environment** created specifically to practice and learn:

1. Containerizing a Next.js app with **Docker**
2. Deploying to Kubernetes using **Helm** + **ArgoCD** (GitOps)
3. Automating build & deploy with a **GitHub Actions CI/CD pipeline**
4. Frontend–backend communication via REST API using **Axios**

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Framework    | Next.js 16.1 / React 19              |
| Language     | TypeScript                           |
| Styling      | Tailwind CSS v4                      |
| State        | Zustand                              |
| HTTP Client  | Axios                                |
| UI Library   | Radix UI, Lucide React               |
| Container    | Docker (multi-stage build)           |
| Orchestration| Kubernetes + Helm                    |
| GitOps       | ArgoCD                               |
| CI/CD        | GitHub Actions                       |
| Registry     | Docker Hub                           |

---

## 🗂️ Project Structure

```
prod-stack-ui/
├── .github/
│   └── workflows/
│       └── ci-cd.yaml        # GitHub Actions CI/CD pipeline
├── src/
│   └── app/
│       └── page.tsx          # Main page — fetches & displays blog posts
├── wrapper/
│   ├── lib/                  # API client (Axios)
│   ├── store/                # Zustand state management
│   └── types/                # TypeScript types (e.g., BlogPost)
├── Dockerfile                # Multi-stage Docker build
├── next.config.ts
└── package.json
```

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

The pipeline is triggered on every push to `main` and runs two jobs:

### 1. `ci-jobs` — Build & Push Docker Image

- Checks out the source code
- Generates an image tag using the first 8 characters of the commit SHA (`GITHUB_SHA`)
- Logs into **Docker Hub** using repository secrets
- Builds the Docker image: `<USERNAME>/prod-ui:<TAG>`
- Pushes the image to Docker Hub

### 2. `cd-jobs` — Update Helm Chart (GitOps)

- Clones the GitOps repository (`tochratana/gitops-fullstack`)
- Uses `yq` to update the `frontend.image.tag` in `charts/full-stack-app/values.yaml`
- Commits and pushes the change — **ArgoCD** then picks up the new image tag and syncs the deployment automatically

```
Code Push → GitHub Actions (CI) → Docker Hub
                                       ↓
                          GitHub Actions (CD) → GitOps Repo (Helm values)
                                                       ↓
                                                    ArgoCD → Kubernetes
```

---

## 🐳 Docker

Multi-stage Dockerfile to keep the image lean:

```dockerfile
# Stage 1: Build
FROM node:latest AS builder
WORKDIR /prod-stack
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:latest
WORKDIR /prod-stack
COPY --from=builder /prod-stack ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 🔗 Backend Communication

The frontend fetches blog posts from a backend REST API using **Axios**. The API client is defined in `wrapper/lib/` and the `BlogPost` type is defined in `wrapper/types/`.

```ts
// Example usage in page.tsx
const data = await blogAPI.getAllPosts();
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Required GitHub Secrets

| Secret        | Description                                |
|---------------|--------------------------------------------|
| `USERNAME`    | Docker Hub username                        |
| `PASSWORD`    | Docker Hub password / access token        |
| `GIT_TOKEN`   | GitHub PAT with write access to GitOps repo|

---

## 📚 Learning Goals Checklist

- [x] Dockerize a Next.js application
- [x] Write a GitHub Actions CI/CD pipeline
- [x] Push images to Docker Hub with commit SHA tags
- [x] Update Helm chart values automatically via GitOps
- [x] Deploy to Kubernetes with ArgoCD
- [x] Connect frontend to backend REST API