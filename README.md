# website-gaushyang｜高祥電信企業官方網站

高祥電信股份有限公司（Gaushyang Telecom）的企業官方網站，介紹 4G／5G 基地台建設、網路優化、C-RAN、室內涵蓋與低軌衛星通訊等工程服務。

- 正式網站：[https://website-gaushyang.pages.dev](https://website-gaushyang.pages.dev)
- GitHub：[Gaushyang/website-gaushyang](https://github.com/Gaushyang/website-gaushyang)
- 正式分支：`main`
- 託管平台：Cloudflare Pages

## 目前狀態

截至 2026-08-29：

- 專案、GitHub repository、本機資料夾及正式 Pages 網址皆已統一為 `website-gaushyang`
- Cloudflare Pages 已連接 GitHub，推送至 `main` 後自動部署
- 網站 canonical、Open Graph、sitemap 與 robots.txt 已改用正式網址
- 聯絡表單已啟用 Cloudflare Turnstile 伺服器端驗證
- 聯絡表單透過 Resend API 寄信，目前採臨時寄件地址方案
- 正式環境表單已完成實際寄送驗收，Resend 狀態為 `delivered`
- 網站影片來源已更新為 [YouTube](https://youtu.be/qGc955RNO0U)

舊 Cloudflare Pages 專案保留為 `website-gaushyang-legacy`，僅供必要時回復使用。

## 技術架構

- 前端：HTML5、CSS3、JavaScript（ES6+）
- 樣式：自建響應式企業網站樣式 `enterprise.css`
- 動態功能：Cloudflare Pages Functions
- 防濫用：Cloudflare Turnstile
- 電子郵件：Resend API
- 部署：GitHub `main` → Cloudflare Pages 自動部署
- 安全標頭：HSTS、X-Frame-Options、X-Content-Type-Options 等

## 專案結構

```text
functions/api/config.js   公開前端所需的 Turnstile Site Key
functions/api/contact.js  表單驗證與 Resend 寄信端點
services/                 工程服務詳細頁面
images/                   網站圖片與工程案例素材
index.html                首頁
enterprise.css            主要樣式
enterprise.js             前端互動與聯絡表單
privacy.html              隱私權與個資聲明
sitemap.xml               搜尋引擎網站地圖
robots.txt                搜尋引擎爬蟲設定
_headers                  Cloudflare Pages 回應標頭
```

## 本地開發

本專案不需要安裝 npm 依賴。可使用任一靜態 HTTP 伺服器預覽一般頁面：

```bash
python3 -m http.server 3000
```

開啟 `http://localhost:3000`。

聯絡表單依賴 Cloudflare Pages Functions 與正式環境變數；僅使用靜態伺服器時無法完成寄信驗收。

## Cloudflare Pages 環境變數

正式環境需要以下設定：

| 名稱 | 類型 | 用途 |
| --- | --- | --- |
| `TURNSTILE_SITE_KEY` | 文字 | 前端載入 Turnstile 小工具 |
| `TURNSTILE_SECRET_KEY` | 秘密 | 伺服器端驗證 Turnstile 權杖 |
| `RESEND_API_KEY` | 秘密 | 呼叫 Resend 寄信 API |
| `CONTACT_FROM_EMAIL` | 文字 | 表單寄件地址 |
| `CONTACT_TO_EMAIL` | 文字 | 正式收件地址 |
| `CONTACT_TEMP_TO_EMAIL` | 文字 | 臨時方案優先收件地址 |

禁止將任何 Secret 或 API Key 寫入 repository、README、commit 或前端程式碼。

## 部署與驗收

1. 將變更推送至 `main`。
2. 等待 Cloudflare Pages 完成 Production 部署。
3. 確認正式首頁可正常開啟，且 `/api/config` 回傳 Turnstile Site Key。
4. 從正式網站填寫聯絡表單並完成 Turnstile 驗證。
5. 確認表單顯示「需求已成功送出」。
6. 至 Resend Emails 確認郵件狀態為 `delivered`。

金鑰或環境變數變更後必須重新部署，新的設定才會套用至 Production。

## 首頁視覺與互動

- `fusion.css`、`color-bridges.css`、`typography-scale.css` 與 `hero-original.css`：首頁的章節配色、銜接、字級與主視覺。
- `company-motion.js`、`fusion-sections.js`：主視覺與章節捲動效果；系統設定「減少動態」時降低動畫。
- `partner-motion.css`、`partner-motion.js`：設備品牌實務經驗的互動展示。
- `icons-sprite.svg`、`site-icon-map.css`、`site-icon-map.js`：40 款工程圖示與首頁區塊配置。`icon-motion.html` 為完整圖示索引。
- `build-icon-sprite.py`：圖示來源變更後，可重新產生 `icons-sprite.svg`。
