#!/bin/bash
npx tsx server/index.ts &
cd client && npx vite --host 0.0.0.0 --port 5173 &
wait
