# 天衢ERP（前端）

基于 Vue 3 + TypeScript + Vite + Element Plus 的企业资源计划管理系统前端。

## 技术栈

- Vue 3（`<script setup>` 组合式 API）
- TypeScript
- Vite 5
- Element Plus（unplugin 按需自动引入）
- Vue Router 4（路由守卫 + 免登录白名单）
- Pinia（用户状态管理）
- Axios（统一封装，拦截器 + 401 处理）
- Sass

## 快速开始

```bash
npm install   # 安装依赖
npm run dev   # 启动开发服务器（默认 http://localhost:5173）
npm run build # 生产构建
```

## 演示账号

- 账号：`admin`
- 密码：`123456`

> 当前登录接口为前端 Mock（`src/api/login.ts`），后端就绪后替换为真实接口即可。

## 目录结构

```
src/
├─ api/         # 接口模块（login.ts 当前为 Mock）
├─ layout/      # 主布局（侧边栏 / 顶栏）
├─ router/      # 路由与守卫
├─ stores/      # Pinia 状态（user）
├─ styles/      # 全局样式
├─ utils/       # axios 封装等工具
├─ views/       # 页面（login / dashboard）
├─ App.vue
└─ main.ts
```

## 后端对接说明

- 接口基地址通过 `.env.development` / `.env.production` 的 `VITE_API_BASE_URL` 配置
- 开发环境 `/api` 请求由 Vite 代理转发（见 `vite.config.ts`）
- 后端返回约定：`{ code, message, data }`，`code` 为 `0` 或 `200` 视为成功
