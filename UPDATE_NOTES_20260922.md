# 2026-09-22 首頁與服務內頁更新

## 修改範圍
- 公司介紹：聚焦服務對象、合作窗口與設備經驗，移除工序重述。
- 代表案例：精簡為場域、挑戰、成果；保留照片瀏覽，新增對應方案連結。
- 方案入口：五張卡片以需求情境說明，明確標示「查看方案詳情」。
- 合作流程：保留五階段及交付文件；集中會勘、工期、維運問答。
- 五個服務內頁：新增評估條件、工程與驗收重點、相關案例及各方案 FAQ。
- 案例標題與當時可用的場域紀錄一致；後續已改為通用應用說明。
- 會勘 FAQ 移除固定天數承諾，改由專案窗口依場地與施工窗口確認。
- 首頁其他區域、照片瀏覽程式、聯絡表單及後端未修改；共用樣式新增規則限定於本次區域或服務頁。

## 更新前版本
- Git commit：7573d6f31a9fdd103e976361baa7ec9c6c4be53a
- Git tag：backup/before-content-refresh-20260922
- 完整 Git bundle：D:\gemini開發專案\website-gaushyang-backups\before-content-refresh-20260922.bundle
- 備份包含所有 Git refs 與完整歷史，已通過 git bundle verify。備份時工作目錄乾淨。

## 安全取回舊版
在另一個尚不存在的資料夾取回舊版，不覆蓋目前專案：

```powershell
git clone --branch backup/before-content-refresh-20260922 "D:\gemini開發專案\website-gaushyang-backups\before-content-refresh-20260922.bundle" "D:\gemini開發專案\website-gaushyang-before-refresh"
```

此命令會以 detached HEAD 開啟備份版本，適合比較與預覽。若日後需要正式回復，先確認沒有其他未提交修改，再針對本次更新提交執行 git revert，保留後續歷史。

## 本地驗證
- Edge headless：首頁與五個內頁，1440、768、390、320 px 共 24 組檢查通過。
- 內部連結及錨點存在；無重複 ID，無偵測到水平溢出或已載入圖片損壞。
- 方案卡片、返回方案區、兩組照片瀏覽器、FAQ 展開及聯絡視窗開啟通過。
- 未偵測到 JavaScript 執行錯誤；git diff --check 通過。
- 已檢視桌面及手機截圖，並縮短造成零碎換行的區塊標題。
- 檢查使用本地靜態伺服器並阻擋外部請求，未執行正式寄信、Turnstile 或部署驗證。
- QA 截圖與結果存放於專案外備份資料夾的 qa-20260922 子目錄。

## 發布狀態
此次為本地更新，尚未推送 GitHub 或部署正式站。
