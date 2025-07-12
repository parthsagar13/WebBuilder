#!/bin/bash
echo "Starting AI App Builder..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""

# Start both services concurrently
npx concurrently \
  --names "BACKEND,FRONTEND" \
  --prefix "{name}" \
  --prefix-colors "blue,green" \
  "npx tsx server/index.ts" \
  "cd client && npx vite --host 0.0.0.0 --port 5173"
