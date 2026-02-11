# BBABachmate Backend Setup

## Prerequisites
- Node.js installed
- MongoDB Atlas account

## Setup
1. Clone repository
2. Install dependencies:
   ```bash
   npm install




# Test connection
curl http://localhost:5000/test

# Add sample student
curl -X POST http://localhost:5000/api/data -H "Content-Type: application/json" -d '{"name":"Test","rollNumber":"TEST001","semester":4}'

# View all students
curl http://localhost:5000/api/data