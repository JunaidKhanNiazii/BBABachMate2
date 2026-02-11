npm run dev

# BBABachMate2


…or create a new repository on the command line
echo "# BBABachMate2" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/JunaidKhanNiazii/BBABachMate2.git
git push -u origin main


…or push an existing repository from the command line
git remote add origin https://github.com/JunaidKhanNiazii/BBABachMate2.git
git branch -M main
git push -u origin main

git add . 
git commit -m "Update code" 
git push


how clone 
git clone https://github.com/JunaidKhanNiazii/BBABachMate2.git


how create a branch
git switch -C HereWriteBranchName
git branch // check which branch is activate and how many branch


# How to Run Project

### 1. Run Backend
```bash
cd backend
npm run dev
```

### 2. Run Frontend
```bash
cd frontend
npm run dev
```

### 3. Run on Mobile (Ngrok)
### 3. Run on Mobile (Ngrok)
**Prerequisite:** Ensure Ngrok is installed and authenticated.

**Step 1: Start Tunnels**
Run this in a single terminal:
```bash
ngrok start --all --config=/home/junaid-ameer-khan/ngrok.yml
```
You will see two URLs in the output:
- One forwarding to `localhost:5000` (Backend)
- One forwarding to `localhost:5173` (Frontend)

**Step 2: Run App**
Open a new terminal:
```bash
cd frontend
VITE_API_URL=https://<BACKEND_URL_FROM_STEP_1>/api npm run dev
```
https://papayan-sightly-suellen.ngrok-free.dev/