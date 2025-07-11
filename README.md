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
   git clone https://gitlab.hof-university.de/aiymt/cloud_computing_2025.git
   cd cloud_computing_2025
   ```

Step 2 – Build and Start the Containers
Run the following command:
```bash
npm install
```
then:
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


**Kubernetes via Port Forward**
1. Start Minikube

```bash
minikube start --driver=docker
```

2. Build and Load Docker Images
Web App
```bash
docker build -t web-custom .
minikube image load web-custom
```
Database
```bash
docker build -t mariadb-custom .
minikube image load mariadb-custom
```

3. Deploy Kubernetes Resources
```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/mariadb-pvc.yaml
kubectl apply -f kubernetes/db-init-configmap.yaml
kubectl apply -f kubernetes/db-deployment.yaml
kubectl apply -f kubernetes/db-service.yaml
kubectl apply -f kubernetes/web-deployment.yaml
kubectl apply -f kubernetes/web-service.yaml
```

4. Wait for Pods to Become Ready
```bash
kubectl get pods -n qr-survey -w
```
Wait until all pods show STATUS: Running.

5. Port Forwarding to Access the App
Web App (Browser Access)
```bash
kubectl port-forward svc/web-service 3000:3000 -n qr-survey
```

Then open: http://localhost:3000/create

**Database access:**
MariaDB
```bash
kubectl port-forward svc/db-service 3307:3306 -n qr-survey
```
Database access:
Host: 127.0.0.1
Port: 3307
User: root
Password: (empty)
DB name: survey_db





