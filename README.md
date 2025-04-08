# ☀️ Solar Plant Monitoring Dashboard

## 🔍 Overview
A React 19 application for monitoring and managing solar plant performance.

## ✨ Features
- 🏭 Solar plant management
- 📅 Interactive date range selection
- 📊 Data monitoring and reporting
- 📈 Dynamic charts

## 🛠️ Technologies
- ⚛️ React 19
- 📝 TypeScript
- ⚡ Vite
- 📆 React Date Range
- 📊 Recharts
- 🧭 React Router
- 🐳 Docker/Docker Compose
- 🧪 Jest

## ⚙️ Prerequisites
- 📦 Node.js 18+
- 📦 npm

## 🚀 Setup

### 📥 Installation
```bash
# Clone the repository
git clone https://github.com/ZoiPistioli/solar-plant-monitoring.git

# Navigate to project directory
cd solar-plant-monitoring

# Install dependencies
npm install
```

### 💻 Development
```bash
# Start development server
npm run dev
```
Application runs at `http://localhost:5173/` 🌐

### 🏗️ Build
```bash
# Build for production
npm run build
```

### 🧪 Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🐳 Docker Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ZoiPistioli/solar-plant-monitoring.git
cd solar-plant-monitoring
```

### 2. Option A: Run with Docker Compose ✅
```bash
# First time or after code changes
docker-compose up --build

# Subsequent runs if no code changes
docker-compose up
```

### 2. Option B: Build and Run Docker Image
```bash
# Build the Docker image
docker build -t solar-plant-monitoring .

# Run the container
docker run -p 3000:80 solar-plant-monitoring
```