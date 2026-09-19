# AURA Developer & Contribution Guide

This guide covers local development workflows, running tests, extending agents, and contributing to the AURA platform.

---

## 1. Prerequisites

- **Node.js**: v20+ with npm or bun
- **Docker**: Engine 24+ with Compose v2
- **Python**: 3.12+ (for testing backend AST engine)

---

## 2. Quick Start

```bash
# Clone the repository
git clone https://github.com/aura-corp/aura.git
cd aura

# Copy environment template
cp .env.example .env

# Install frontend dependencies
npm install

# Launch development server (binds to http://0.0.0.0:3000)
npm run dev

# Run TypeScript typechecks and linter
npm run lint

# Build production bundle
npm run build
```

---

## 3. Extending AURA Cognitive Agents

To add a new specialist agent:

1. **Define Agent Metadata** in `src/types.ts` under `AgentInfo`.
2. **Implement Agent Persona & Mandate** in `src/data/mockData.ts` or the backend agent coordinator.
3. **Register Structured Tools**: Define the tool signatures that the agent is permitted to invoke inside the Docker sandbox.
4. **Wire Message Exchange**: Ensure all inputs and outputs adhere to the `Structured Agent Message Schema` documented in `AGENTS.md`.

---

## 4. Running Verification Tests

```bash
# Run deterministic frontend build & typecheck
npm run lint && npm run build

# Run sandbox pytest container tests
docker run --rm -v $(pwd)/demo-repo:/app aura/sandbox:latest pytest tests/
```
