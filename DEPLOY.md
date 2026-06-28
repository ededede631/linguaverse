# LinguaVerse 多语种学习平台部署指南

## 项目概述
LinguaVerse 是一个全栈应用，包含：
- **前端**：React + TypeScript + Vite
- **后端**：Express + TypeScript
- **数据库**：内存 + JSON 文件持久化

---

## 部署方案

### 方案一：免费云端部署（推荐）

#### 第一步：部署后端到 Railway

1. **注册 Railway 账号**
   - 访问 https://railway.app
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project" → "Deploy from GitHub repo"
   - 选择你的 GitHub 仓库

3. **配置环境变量**
   - 在 Railway 控制台添加：
     ```
     PORT=3001
     JWT_SECRET=your-secret-key-here
     NODE_ENV=production
     ```

4. **等待部署完成**
   - Railway 会自动检测并部署
   - 部署完成后，你会获得一个 URL，如：`https://linguaverse-api.up.railway.app`

#### 第二步：部署前端到 Vercel

1. **注册 Vercel 账号**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New" → "Project"
   - 导入你的 GitHub 仓库

3. **配置环境变量**
   - 添加：
     ```
     VITE_API_URL=https://linguaverse-api.up.railway.app/api
     ```

4. **配置构建命令**
   - Build Command: `pnpm install && pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

5. **部署**
   - 点击 Deploy
   - 获得你的网站 URL，如：`https://linguaverse.vercel.app`

---

### 方案二：使用 Render 部署

Render 提供免费的 PostgreSQL 和 Web Services。

1. **注册 Render** - https://render.com
2. **创建 PostgreSQL 数据库**
3. **创建 Web Service** 部署后端
4. **配置环境变量**

---

### 方案三：使用 Zeabur 部署（支持中国访问）

Zeabur 对中国用户更友好：
1. 访问 https://zeabur.com
2. 使用 GitHub 登录
3. 一键部署前后端

---

## 演示账号

部署后可以使用以下账号登录：

| 用户名 | 密码 | 学习语言 |
|--------|------|----------|
| demo | password123 | 英语（中级） |
| sakura | password123 | 日语（初级） |
| minjun | password123 | 韩语（初级） |

---

## 注意事项

1. **数据库**：当前使用 JSON 文件存储，部署后重启会重置数据。如需持久化，请切换到 PostgreSQL/MySQL。

2. **CORS**：部署后需要确保后端允许前端域名访问。

3. **HTTPS**：所有托管服务都提供免费的 HTTPS。

---

## 本地运行

如果你想在本地运行：

```bash
# 安装依赖
pnpm install

# 启动后端（端口 3001）
pnpm run server:dev

# 启动前端（端口 5173）
pnpm run client:dev

# 同时启动
pnpm run dev
```

---

## 技术栈

- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS
- Zustand 状态管理
- Express 4
- JWT 身份认证
- pnpm 包管理器
