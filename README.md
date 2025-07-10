 QR Code Survey App
 Project Structure
 QR-SURVEY-APP/
├── db/
│   ├── Dockerfile
│   └── init.sql
├── kubernetes/
│   ├── db-deployment.yaml
│   ├── db-init-configmap.yaml
│   ├── db-service.yaml
│   ├── ingress.yaml
│   ├── namespace.yaml
│   ├── web-deployment.yaml
│   └── web-service.yaml
├── views/
│   ├── create.ejs
│   ├── results.ejs
│   ├── survey.ejs
│   └── vote.ejs
├── .env
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.haproxy
├── haproxy.cfg
├── index.js
├── package.json
└── README.md

Technologies Used
- Image Base: Amazon Linux 2 (custom Dockerfiles)
- Backend: Node.js with Express.js
- Database: MariaDB (custom container, initialized via `init.sql`)
- Load Balancer: HAProxy (Docker) or Ingress (Kubernetes)
- Frontend: Server-side HTML using EJS templates
- Deployment: Docker Compose and Kubernetes (Minikube)

Installation and Setup
Run the Project with Docker Compose
Step 1 – Clone the Project:
   ```bash
   git clone https://gitlab.hof-university.de/YOUR_USERNAME/cloud_computing_2025.git
   cd cloud_computing_2025
   ```
   Replace YOUR_USERNAME with your actual GitLab username.

Step 2 – Build and Start the Containers
Run the following command:
```bash
docker compose up --build
```

Step 3 – Access the Application
After the containers are running, open your browser and go to:
http://localhost:80/create

Application Pages Overview
/create – Create a survey and get a QR code
/vote/:id – Vote Yes or No using the link or QR code
/results/:id – View voting results in a bar chart

Run the Project with Kubernetes
Prerequisites
Make sure the following tools are installed:
- Minikube
- kubectl

Step 1 – Start Minikube
Start Minikube with Docker:
```bash
minikube start --driver=docker
```

Step 2 – Use Minikube’s Docker Environment:
```bash
eval $(minikube docker-env)
```

Step 3 – Build the Docker Images
Run these commands from the project root:
```bash
docker build -t mariadb-custom ./db
docker build -t web-custom ./web
```

Step 4 – Deploy to Kubernetes
Apply all manifests located in the kubernetes/ folder:
```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/db-init-configmap.yaml
kubectl apply -f kubernetes/db-deployment.yaml
kubectl apply -f kubernetes/db-service.yaml
kubectl apply -f kubernetes/web-deployment.yaml
kubectl apply -f kubernetes/web-service.yaml
kubectl apply -f kubernetes/ingress.yaml
```

Step 5: Enable Ingress and Access the App
minikube addons enable ingress
run this in powershell as administrator:
```bash
minikube tunnel
```

Edit your local /etc/hosts (Linux/macOS) or C:\Windows\System32\drivers\etc\hosts (Windows):
127.0.0.1 qr-survey-app.local

Step 5: Then open in your browser:
http://qr-survey-app.local/









