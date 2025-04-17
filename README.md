# Backend library management system based on GraphQL

基於Node.js技術打造的GraphQL圖書資訊管理系統後端平台。

## 壹、基本說明
**一、目標：**
這個GraphQL平台旨在為前端提供書籍借閱的管理功能，支援讀者、書籍與借閱紀錄的創建、瀏覽、修改和刪除等常見操作。平台開發基於PostgreSQL、Node.js及相關套件。
<br>

**二、開發環境：**
以下是開發該平台所採用的環境：
* 虛擬機：Docker
* 作業系統：Debian
* 程式語言：JavaScript
* JavaScript執行環境：Node.js
* Node.js資源管理工具：npm
* 資料庫：PostgreSQL
* 程式編輯器：Visual Studio Code

**三、使用相依套件：**
以下是開發該平台所使用的Node.js套件：
* express（Web應用程式架構）
* express-graphql（GraphQL API伺服器）
* graphql（GraphQL套件）
* dotenv（將敏感變數放入環境變數中）
* sequelize（基於Node.js的非同步ORM框架）
  
**四、對於RESTful API請求：** 
以下是此後端平台提供的RESTful API端點，包含對應的http方法、路徑及參數說明，如下所示：
* `GET` /：首頁
* `POST` /api/register：創建帳號
* `POST` /api/login：登入帳號
* `POST` /api/posts：儲存貼文
* `GET` /api/posts或`GET` /api/posts?limit=列出資料筆數&offset=從第幾筆資料開始列出：查詢貼文
> [!Note]
> 此GET請求採用偏移分頁方法，使用兩個參數：offset（資料集中的起始位置）和limit（返回的資料數量）。其中，offset通常表示搜尋結果的第一筆資料的索引（需注意，資料集的索引是從0開始計算），而limit則指定響應中返回的資料筆數。例如，請求`GET`  api/posts?limit=10&offset=0 中，limit=10表示返回10篇貼文，offset=0則表示從資料集的第0筆貼文開始計算。若採用沒有參數傳遞方法（`GET` /api/posts），則會列出所有搜尋結果。
* `PUT` /api/posts：更新貼文
* `DELETE` /api/posts：刪除貼文

**五、檔案說明：** 
此專案檔案（指coding這個資料夾）主要分為兩個資料夾：nodejs和tests。其中，nodejs資料夾為後端平台的主要程式碼，tests資料夾則存放使用jest框架進行的單元測試。接下來將對各資料夾中的檔案內容進行詳細說明。
1. nodejs
   * .env：儲存環境變數
   * db.js：連結資料庫
   * server.js：建立http伺服器
   * index.js：首頁，為`GET` /的程式碼
   * register.js：註冊帳號，為`POST` /api/register的程式碼
   * login.js：登入帳號，為`POST` /api/login的程式碼
   * posts.js：貼文管理，為`POST` /api/posts、`GET` /api/posts、`PUT` /api/posts和`DELETE` /api/posts的程式碼
2. tests
   * index.test.js：對`GET` /的單元測試程式碼
   * register.test.js：對`POST` /api/register的單元測試程式碼
   * login.test.js：對`POST` /api/login的單元測試程式碼
> [!Warning]
> 請特別注意，由於node_modules資料夾包含大量且龐大的檔案，專案中用於存儲Node.js依賴的此資料夾並未包含在內。如果您選擇從GitHub下載專案並進行平台建置，請務必先安裝相依套件，相關安裝步驟將於後續說明中詳細提供。

## 貳、操作說明
**ㄧ、安裝程式方式：** 
從GitHub下載檔案，則需先架設程式運行環境，其步驟如下：
  * PostgreSQL
    * 請事先安裝好PostgreSQL，並啟動。在將資料庫帳號postgres，密碼設為123456。
    * 建立資料庫：指令如下：
    ```psql
    CREATE DATABASE lms
    ```
    * 資料表：由於本後端平台使用Sequelize進行資料操作，程式執行過程中會自動將資料物件映射到資料庫，因此無需手動創建資料表。
  * Node.js程式碼：請事先安裝好Node.js與NPM，其設定步驟如下：
    * 下載程式碼，並解壓縮。
    * 安裝相依套件
    ```shell
    npm init
    npm install express
    npm install dotenv
    npm install pg
    npm install sequelize
    ```
    * 創建儲存環境變數檔案.env，內容如下：（此檔案務必要於nodejs資料夾中新增，否則將造成平台無法運作）
    ```.env
    DB_HOST=postgres
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=123456
    DB_NAME=LMS
    ```
    * 啟動伺服器，請執行以下指令啟動伺服器：
    ```shell
    cd 檔案位置/coding/nodejs
    node index.js
    ```
**三、運行程式方式：**
呼叫此後端平台有多種方式，本篇將介紹其中一種API測試工具軟體，Hoppscotch。
1. 查詢所有讀者:
```graphql
query {
    findAllUsers {
        ID
        Name
        Email
        Phone
        Address
        Membership_Date
        Membership_Type
        Status
    }
}
```
2. 查詢特定讀者:
```graphql
query {
    findSpecificUsers(Name: "John Doe", Email: "john@example.com") {
        ID
        Name
        Email
        Phone
        Address
        Membership_Date
        Membership_Type
        Status
    }
}
```
3. 新增讀者:
```graphql
mutation {
    addUser(Name: "John Doe", Email: "john@example.com", Phone: "123-456789", Address: "Wanhua District, Taipei City, Republic of China", Membership_Date: "2025-04-016 11:05:06", Membership_Type: "premium", Status: "active") {
        Name
        Email
        Phone
        Address
        Membership_Date
        Membership_Type
        Status
    }
}
```
4. 更改讀者資訊:
```graphql
mutation {
    updateUser(ID: 2, Name: "Tom Chen", Email: "Tom@example.com", Phone: "123-987654", Address: "Xinyi District, Taipei City, Republic of China", Membership_Date: "2024-04-01", Membership_Type: "member", Status: "active") {
        ID
        Name
        Email
        Phone
        Address
        Membership_Date
        Membership_Type
        Status
    }
}
```
5. 刪除讀者:
```graphql
mutation {
    deleteUser(ID: 4) {
        ID
    }
}
```
6. 查詢特定書籍名稱:
```graphql
query {
    findSpecificBooksTitle(Title: "Angel Learning") {
        ID
        Title
        Author
        Publisher
        Publication_Date
        ISBN
        Category
        Language
        Pages
        Location
        Copies_Available
        Copies_Borrowed
    }
}
```
7. 查詢特定書籍ISBN:
```graphql
query {
    findSpecificBooksISBN(ISBN: "ISBN 978-1-16-148410-0") {
        ID
        Title
        Author
        Publisher
        Publication_Date
        ISBN
        Category
        Language
        Pages
        Location
        Copies_Available
        Copies_Borrowed
    }
}
```
8. 新增書籍:
```graphql
mutation {
    addBook(Title: "Angel Learning", Author: "Xiaoming Wang", Publisher: "Genius Publishing", Publication_Date: "2024-04-01", ISBN: "ISBN 978-1-16-148410-0", Category: 1, Language: "chinese", Pages: 102, Location: "Republic of China", Copies_Available: 3, Copies_Borrowed: 0) {
        Title
        Author
        Publisher
        Publication_Date
        ISBN
        Category
        Language
        Pages
        Location
        Copies_Available
        Copies_Borrowed
    }
}
```
9. 更改書籍資訊:
```graphql
mutation {
    updateBook(ID: 1, Title: "Angel Learning", Author: "Xiaoming Wang", Publisher: "Genius Publishing", Publication_Date: "2024-04-01", ISBN: "ISBN 978-1-16-148410-0", Category: 1, Language: "chinese", Pages: 102, Location: "Republic of China", Copies_Available: 3, Copies_Borrowed: 1) {
        ID
        Title
        Author
        Publisher
        Publication_Date
        ISBN
        Category
        Language
        Pages
        Location
        Copies_Available
        Copies_Borrowed
    }
}
```
10. 刪除書籍:
```graphql
mutation {
    deleteBook(ID: 1) {
        ID
    }
}
```
