# AizForge Web Local Startup Guide

This document is a step-by-step startup guide for the local frontend project on this Mac.

Repository path:

- `/Users/aizy/IdeaProjects/yudao-ui-admin-vue3`

Frontend port:

- `3001`

Backend dependency:

- `http://localhost:48080`

## 1. Load the local environment

Open a new terminal and run:

```zsh
source /Users/aizy/.local/share/java-mysql/env.zsh
```

Verify Node and pnpm:

```zsh
node -v
pnpm -v
```

If either command fails, stop and fix the environment first.

## 2. Confirm the local frontend config

The local mode file is:

- `/Users/aizy/IdeaProjects/yudao-ui-admin-vue3/.env.local`

Current key values:

- `VITE_PORT=3001`
- `VITE_BASE_URL='http://localhost:48080'`
- `VITE_API_URL=/admin-api`
- local captcha disabled

The shared `.env` also contains the current branding values:

- app title: `AizForge Console`

## 3. Confirm the backend is already running

This frontend depends on the backend from `aizforge-core`.

Quick check:

```zsh
curl -I http://127.0.0.1:48080
```

If the backend is not running, start it first using:

- `/Users/aizy/IdeaProjects/ruoyi-vue-pro/LOCAL_STARTUP.md`

## 4. Install dependencies

From the repository root:

```zsh
cd /Users/aizy/IdeaProjects/yudao-ui-admin-vue3
pnpm install
```

If dependencies are already installed, you can still run the command safely.

## 5. Start the frontend

Use the local mode command:

```zsh
cd /Users/aizy/IdeaProjects/yudao-ui-admin-vue3
pnpm dev --host 0.0.0.0
```

Important note:

- the package script `pnpm dev` already uses `env.local`
- `--host 0.0.0.0` makes local network access easier and is safe for your local dev use

## 6. Verify startup

Open the browser:

- `http://localhost:3001`

Expected behavior:

- the login page opens
- title shows `AizForge Console`
- login page resource links point to your AizForge repositories

If the backend is also healthy, you can log in with:

- tenant: `芋道源码`
- username: `admin`
- password: `admin123`

## 7. Recommended daily startup order

1. `source /Users/aizy/.local/share/java-mysql/env.zsh`
2. start MySQL and Redis if needed
3. start `aizforge-core`
4. start `aizforge-web`
5. open `http://localhost:3001`

## 8. Stop the frontend

If it is running in the current terminal:

- press `Ctrl + C`

If you need to kill it by port:

```zsh
lsof -tiTCP:3001 -sTCP:LISTEN | xargs kill
```

## 9. Common problems

### Problem: port `3001` is already in use

Check:

```zsh
lsof -iTCP:3001 -sTCP:LISTEN
```

Stop the old process, then restart the frontend.

### Problem: page opens but API requests fail

Check the backend first:

```zsh
curl -I http://127.0.0.1:48080
```

If this fails, the frontend cannot function correctly.

### Problem: dependencies are broken

Try:

```zsh
cd /Users/aizy/IdeaProjects/yudao-ui-admin-vue3
rm -rf node_modules
pnpm install
```

### Problem: the local config is not taking effect

The current startup command must be:

```zsh
pnpm dev
```

This repository maps `dev` to local mode.

### Problem: TypeScript checks are slow or appear to hang

You can still start the dev server first:

```zsh
pnpm dev --host 0.0.0.0
```

Then run checks separately later if needed:

```zsh
pnpm ts:check
```
