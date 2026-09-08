# UK Tripboard 2026

一页式英国旅行看板，覆盖 2026 年 9 月 28 日至 10 月 8 日的伦敦、牛津、巴斯、约克和爱丁堡行程。

## 页面内容

- 出发、返程与旅行进度倒计时
- 可勾选并自动保存的出发前待办
- 每日路线、餐饮建议与预计花费
- 四段列车时间和倒计时，可按最终车票修改
- 英镑现金建议、刷卡预算与人民币换算

页面只在浏览器本地保存待办状态和列车时间，不会上传护照号、订单号或其他个人资料。

## 本地预览

```bash
npm install
npm run dev
```

## GitHub Pages

项目已按仓库名 `uk-trip-dashboard-2026` 配置。推送到 `main` 分支后，GitHub Actions 会构建并发布静态网页。

1. 在 GitHub 新建名为 `uk-trip-dashboard-2026` 的仓库。
2. 将本目录推送到仓库的 `main` 分支。
3. 在仓库 Settings → Pages 中，将 Source 设为 GitHub Actions。

若使用其他仓库名，请同步修改 `next.config.ts` 中的 `assetPrefix`。
