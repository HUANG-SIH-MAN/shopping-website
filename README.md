#### User story

- 消費者
  - 使用本地註冊登入或是第三方登入(FB、google、twitter)
  - 可以瀏覽商品所有商品資訊，也可以透過分類、關鍵字搜尋自己想要的商品
  - 將商品放入購物車或我的最愛進行收藏
  - 利用信用卡進行結帳支付
  - 可以在消費紀錄中查詢自己最近的消費
  - 在會員專區修改會員資料
- 後台管理
  - 管理所有商品、可以新增、修改、刪除商品，上下架商品
  - 新增、修改、刪除商品分類
  - 查詢顧客資訊

#### 資料庫架構

![image](/public/image/購物網站ERD圖.drawio.png)

#### 環境建置與需求

- 使用框架 express
- 使用樣板引擎 express-handlebars
- 使用資料庫 MySQL
- 安裝
  - 下載專案
    ```
    https://github.com/HUANG-SIH-MAN/shopping-website.git
    ```
  - 安裝專案
    ```
    $ cd shopping-website
    $ npm install
    ```
  - 資料庫建置
    ```
    $ npx sequelize db:migrate:all
    $ npx sequelize db:seed:all
    ```
  - 執行程式
    ```
    $ npm run start
    $ npm run dev
    ```
  - 伺服器位置
    ```
    localhost:3000
    ```

#### env 檔案設定

```
unsplashAPIClientId = 需到unsplash申請API，用於商品種子資料的圖片來源
sessionSecret = 請自訂任意英文文字
IMGUR_CLIENT_ID = 需到imgur申請API，可將圖片上傳到第三方儲存空間

FACEBOOK_ID = 需到FB申請，用於第三方登入
FACEBOOK_SECRET = 需到FB申請，用於第三方登入
FACEBOOK_CALLBACK = 請輸入網站網址 + /auth/facebook/callback

GOOGLE_CLIENT_ID = 需到google申請，用於第三方登入
GOOGLE_CLIENT_SECRET = 需到google申請，用於第三方登入
GOOGLE_CALLBACK = 請輸入網站網址 + /auth/google/callback

TWITTER_CONSUMER_KEY = 需到twitter申請，用於第三方登入
TWITTER_CONSUMER_SECRET = 需到twitter申請，用於第三方登入
TWITTER_CALLBACK = 請輸入網站網址 + /auth/twitter/callback

HashKey = 需到藍新金流申請API，用於金流結帳功能
HashIV = 需到藍新金流申請API，用於金流結帳功能
MerchantID = 需到藍新金流申請API，用於金流結帳功能
URL = 請輸入網站網址
```

---

#### 預設使用者資料

- 管理員
  - 帳號：administrator@example.com
  - 密碼：123456789
- 使用者
  - 帳號：root@example.com
  - 密碼：123456789

#### 信用卡交易使用藍新金流 (測試 API)

- 測試信用卡號
  - 4000-2211-1111-1111
  - 測試卡號有效月年及卡片背面末三碼，請任意填寫
  - 以測試卡號之外的卡號資料進行交易都會失敗

#### 詳細作品介紹部落

[medium 部落格](https://medium.com/@cindy20303705/%E7%B0%A1%E6%98%93%E7%9A%84%E8%B3%BC%E7%89%A9%E7%B6%B2%E7%AB%99%E5%BB%BA%E6%A7%8B-ab4ac445e499)

#### 引用資源

- icon 圖示

```
https://www.flaticon.com/
https://fontawesome.com/
```

- 商品圖片

```
https://unsplash.com/
```
