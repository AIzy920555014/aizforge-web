# AizForge Web 本机启动文档

这是一份基于你当前这台 Mac 的前端本机启动说明，按步骤操作即可。

项目目录：

- `/Users/aizy/IdeaProjects/yudao-ui-admin-vue3`

前端端口：

- `3001`

依赖的后端地址：

- `http://localhost:48080`

## 1. 先加载本机环境

新开一个终端，先执行：

```zsh
source /Users/aizy/.local/share/java-mysql/env.zsh
```

然后检查 Node 和 pnpm：

```zsh
node -v
pnpm -v
```

如果这两个命令有报错，先修环境，再继续。

## 2. 检查本地前端配置

本地开发使用的配置文件是：

- `/Users/aizy/IdeaProjects/yudao-ui-admin-vue3/.env.local`

当前关键配置如下：

- 本地端口：`3001`
- 后端地址：`http://localhost:48080`
- 接口前缀：`/admin-api`
- 验证码：本地已关闭

另外共享配置文件 `.env` 里已经改成了当前品牌信息：

- 系统名称：`AizForge Console`

## 3. 先确认后端已经启动

这个前端依赖 `aizforge-core` 后端。

检查命令：

```zsh
curl -I http://127.0.0.1:48080
```

如果后端没起来，请先按下面这份文档启动后端：

- `/Users/aizy/IdeaProjects/ruoyi-vue-pro/LOCAL_STARTUP.md`

## 4. 安装依赖

进入项目目录执行：

```zsh
cd /Users/aizy/IdeaProjects/yudao-ui-admin-vue3
pnpm install
```

如果你之前已经装过依赖，这条也可以重复执行，不影响使用。

## 5. 启动前端

执行：

```zsh
cd /Users/aizy/IdeaProjects/yudao-ui-admin-vue3
pnpm dev --host 0.0.0.0
```

说明：

- 这个仓库的 `pnpm dev` 已经对应本地模式
- `--host 0.0.0.0` 便于本机和局域网访问，本地开发没问题

## 6. 验证是否启动成功

浏览器打开：

- `http://localhost:3001`

正常情况下：

- 登录页可以打开
- 页面标题显示 `AizForge Console`
- 登录页底部资源链接已经是你的 AizForge 仓库

如果后端也正常，你可以直接登录：

- 租户：`芋道源码`
- 用户名：`admin`
- 密码：`admin123`

## 7. 日常启动顺序建议

以后本机开发建议按这个顺序来：

1. `source /Users/aizy/.local/share/java-mysql/env.zsh`
2. 启动 MySQL 和 Redis
3. 启动后端 `aizforge-core`
4. 启动前端 `aizforge-web`
5. 打开 `http://localhost:3001`

## 8. 如何停止前端

如果前端正在当前终端运行：

- 直接按 `Ctrl + C`

如果你想按端口停止：

```zsh
lsof -tiTCP:3001 -sTCP:LISTEN | xargs kill
```

## 9. 常见问题

### 问题 1：`3001` 端口被占用

执行：

```zsh
lsof -iTCP:3001 -sTCP:LISTEN
```

先停掉旧进程，再重新启动前端。

### 问题 2：页面能打开，但接口请求失败

先检查后端：

```zsh
curl -I http://127.0.0.1:48080
```

如果后端没起来，前端一定会报错。

### 问题 3：依赖坏了

可以重新安装：

```zsh
cd /Users/aizy/IdeaProjects/yudao-ui-admin-vue3
rm -rf node_modules
pnpm install
```

### 问题 4：本地配置没生效

确保你启动时用的是：

```zsh
pnpm dev
```

这个仓库里 `dev` 就是本地模式。

### 问题 5：类型检查很慢

可以先直接起开发服务：

```zsh
pnpm dev --host 0.0.0.0
```

后面有空再单独检查：

```zsh
pnpm ts:check
```
