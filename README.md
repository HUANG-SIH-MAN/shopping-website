#### 環境建置與需求

- 使用框架 express
- 使用樣板引擎 express-handlebars
- 使用資料庫 MySOL
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

---

#### 預設使用者資料

- 管理員
  - 帳號：administrator@example.com
  - 密碼：123456789
- 使用者
  - 帳號：root@example.com
  - 密碼：123456789

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
