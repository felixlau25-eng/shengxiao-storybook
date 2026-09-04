# 升小故事簿

K3 升小面試用的**四格漫畫看圖說故事**練習網站。主角是樂樂和安安，共六則故事：誠實、助人、守規、環保、分享、認錯。

線上使用（GitHub Pages）：  
**https://felixlau25-eng.github.io/shengxiao-storybook/**

GitHub 倉庫：  
**https://github.com/felixlau25-eng/shengxiao-storybook**

---

## 網站有什麼

- 六則繪本風四格故事
- 一格一格揭開／一次看四格（像真面試）
- 開口句、粵語詞彙、口語／書面範文
- 面試提問與建議答法
- 模擬面試（看圖 30 秒 → 說故事 → 提問 → 評分）
- 可列印四格

課堂建議：先讓孩子自己看圖說，卡殼才開「開口句」，最後才看範文。

---

## 檔案說明（給想改內容的人）

| 檔案 | 用途 |
|---|---|
| `index.html` | 網頁入口 |
| `styles.css` | 顏色和排版 |
| `app.js` | 按鍵、換頁、模擬面試 |
| `stories.js` | **六則故事的文字**（改教材主要改這裡） |
| `comics/` | 四格插圖 |
| `favicon.svg` | 小圖示 |

改完文字後，把檔案上傳回 GitHub，網站就會更新。

---

## 怎樣在 GitHub 上管理這個程式

### 1. 打開倉庫

用瀏覽器登入 GitHub，打開  
https://github.com/felixlau25-eng/shengxiao-storybook

左邊是資料夾和檔案，右邊綠色 **Code** 可以下載全部檔案。

### 2. 改一則故事的文字

1. 點開 `stories.js`
2. 按鉛筆圖示（Edit）
3. 改口語範文或提問
4. 最下面按 **Commit changes**（儲存）

幾分鐘後，線上網站會自動更新。

### 3. 這個網站為什麼能打開？

GitHub 除了存放程式，也可以把倉庫變成公開網頁，叫做 **GitHub Pages**。

設定位置：倉庫頁面 → **Settings** → 左欄 **Pages** → Source 選 `main` 和 `/ (root)`。

這個倉庫已經打開 Pages，所以老師和家長只要開上面的網址即可，不用安裝任何軟件。

### 4. 下次自己做一個新專案（網頁操作）

1. 右上角 **+** → **New repository**
2. Repository name 用英文，例如 `summer-poster`
3. 選 **Public**（公開才方便用免費網頁）
4. 可勾 **Add a README file**
5. 按 **Create repository**
6. 按 **Add file** → **Upload files**，把 `index.html` 等檔案拖進去
7. 按 **Commit changes**
8. 再到 **Settings → Pages** 打開網頁

和這個「升小故事簿」一樣：一個倉庫 = 一份教材網站。

---

## 授權

教學用途。插圖為本教材原創繪本風格畫面，故事文字可按課堂需要修改。
