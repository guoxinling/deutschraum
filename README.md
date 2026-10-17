# Deutschraum

手机优先的个人德语重启课程。当前包含第一周：6 节主课及 1 节复盘；后续三周仍在编写。

## 访问与发布

GitHub Pages 设置：Settings → Pages → Deploy from a branch → main → /docs → Save。

预期网址：https://guoxinling.github.io/deutschraum/ （需 Pages 部署成功后才能访问）

## 学习数据

免登录使用。答题、文本、录音和进度仅保存在当前浏览器，不自动同步。清除浏览器数据会删除记录。

## 开发与构建

```sh
npm ci
npm test
npm run build
```

GitHub Pages 专用构建：

```sh
DEPLOY_BASE=/deutschraum/ npm run build
node scripts/verify-pages-build.mjs
```

将构建后的 dist 内容发布到 docs，保留 docs/.nojekyll。默认构建仍支持根路径托管。公开仓库不包含个人学习记录、访问凭据或其他托管平台配置。
