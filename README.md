# 妈妈的花花小院

一个给妈妈用的东方庭院风养花小网站。第一版固定面向河北石家庄，内置家里常见植物的照护卡片、今日天气提醒和花病急救建议。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

Vercel 部署时使用默认静态站配置即可：

- Build Command: `npm run build`
- Output Directory: `dist`

## 后续替换照片

当前主视觉在 `src/assets/courtyard-garden.png`。如果之后要换成妈妈自己的植物照片，可以先放进 `src/assets/`，再在植物数据或页面里替换引用。
