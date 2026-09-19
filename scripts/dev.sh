#!/bin/bash
# Start FastAPI backend service on internal port 8081
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8081 &
BACKEND_PID=$!

# Clean up FastAPI backend on exit
cleanup() {
  kill -9 $BACKEND_PID 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Wait for FastAPI to be responsive before Vite proxy
for i in {1..20}; do
  if curl -s http://127.0.0.1:8081/health > /dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

# Launch Vite development server on port 3000
exec npx vite --port=3000 --host=0.0.0.0 "$@"
