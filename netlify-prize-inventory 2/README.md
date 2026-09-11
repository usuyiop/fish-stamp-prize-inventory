# 魚章獎品櫃｜Netlify 部署版

## 一、先部署 Google Apps Script

1. 開啟獎品櫃 Google 試算表。
2. 選擇「擴充功能 → Apps Script」。
3. 貼上另外提供的 `Google試算表同步程式.gs` 全部內容並儲存。
4. 選擇「部署 → 新增部署作業 → 網路應用程式」。
5. 執行身分選「我」。若 Netlify 網站要直接讀寫，存取權需選擇能讓網站呼叫的範圍。
6. 複製以 `/exec` 結尾的網址。

## 二、部署到 Netlify

### 使用 GitHub（建議）

1. 把本資料夾全部上傳到一個 GitHub repository。
2. 在 Netlify 選「Add new site → Import an existing project」。
3. 選擇該 repository，建置指令使用 `npm run build`。
4. 在「Site configuration → Environment variables」新增：
   - Key：`GOOGLE_SHEETS_API_URL`
   - Value：剛才複製的 Apps Script `/exec` 網址
5. 重新 Deploy。

## 三、更新 Apps Script 時

修改程式後，請在 Apps Script 選「部署 → 管理部署作業 → 編輯」，建立新版本並部署，原本 `/exec` 網址即可繼續使用。
