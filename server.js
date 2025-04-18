// 載入環境變數設定
require("dotenv").config();

// 載入所需的套件
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { Sequelize, DataTypes } = require("sequelize");
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLDate } = require("graphql");

// 初始化Express
const app = express();

// 讀取環境變數，並設置PostgreSQL連線
const sequelize = new Sequelize({
    host: process.env.DB_HOST,  // 資料庫主機
    port: process.env.DB_PORT,  // 資料庫端口
    username: process.env.DB_USER,  // 資料庫用戶名稱
    password: process.env.DB_PASSWORD, // 資料庫密碼
    database: process.env.DB_NAME,  // 資料庫名稱
    dialect: "postgres",  // 使用PostgreSQL資料庫
    logging: false  // 禁用Sequelize的SQL日誌輸出
});

// 定義Users資料模型
const Users = sequelize.define("Users", {
    ID: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true, field: "id" },  // 讀者編號，自動遞增
    Name: { type: DataTypes.TEXT, allowNull: false, field: "name" },  // 讀者名稱
    Email: { type: DataTypes.TEXT, allowNull: false, field: "email" },  // 讀者電子郵件
    Phone: { type: DataTypes.TEXT, allowNull: false, field: "phone" },  // 讀者電話
    Address: { type: DataTypes.TEXT, allowNull: false, field: "address" },  // 讀者地址
    Membership_Date: { type: DataTypes.DATE, allowNull: false, field: "membership_date" }, // 讀者加入日期
    Membership_Type: { type: DataTypes.TEXT, allowNull: false, field: "membership_type" }, // 讀者會員類型
    Status: { type: DataTypes.TEXT, allowNull: false, field: "status" }  // 讀者狀態
}, {
    tableName: "users", // 對應的資料表名稱
    timestamps: false  // 不使用自動時間戳（createdAt和updatedAt）
});

// 定義Books資料模型
const Books = sequelize.define("Books", {
    ID: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true, field: "id" },  // 書籍編號，自動遞增
    Title: { type: DataTypes.TEXT, allowNull: false, field: "title" },  // 書籍名稱
    Author: { type: DataTypes.TEXT, allowNull: false, field: "author" },  // 書籍作者
    Publisher: { type: DataTypes.TEXT, allowNull: false, field: "publisher" },  // 書籍出版社
    Publication_Date: { type: DataTypes.DATE, allowNull: false, field: "publication_date" }, // 書籍出版日期
    ISBN: { type: DataTypes.TEXT, allowNull: false, field: "isbn" },  // 書籍ISBN
    Category: { type: DataTypes.INTEGER, allowNull: false, field: "category" },  // 書籍類別
    Language: { type: DataTypes.TEXT, allowNull: false, field: "language" },  // 書籍語言
    Pages: { type: DataTypes.INTEGER, allowNull: false, field: "pages" },  // 書籍頁數
    Location: { type: DataTypes.TEXT, allowNull: false, field: "location" },  // 書籍放置位置
    Copies_Available: { type: DataTypes.INTEGER, allowNull: false, field: "copies_available" },  // 書籍副本數量
    Copies_Borrowed: { type: DataTypes.INTEGER, allowNull: false, field: "copies_borrowed" }  // 書籍借出數量
}, {
    tableName: "books", // 對應的資料表名稱
    timestamps: false  // 不使用自動時間戳（createdAt和updatedAt）
});

// 定義Categories資料模型
const Categories = sequelize.define("Categories", {
    ID: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true, field: "id" },  // 類別編號，自動遞增
    Name: { type: DataTypes.TEXT, allowNull: false, field: "name" },  // 類別名稱
    Description: { type: DataTypes.TEXT, allowNull: false, field: "description" }  // 類別描述
}, {
    tableName: "categories", // 對應的資料表名稱
    timestamps: false  // 不使用自動時間戳（createdAt和updatedAt）
});

// 定義Borrowing資料模型
const Borrowing = sequelize.define("Borrow", {
    ID: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true, field: "id" },  // 借閱編號，自動遞增
    User_ID: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },  // 借閱用戶編號
    Book_ID: { type: DataTypes.INTEGER, allowNull: false, field: "book_id" },  // 借閱書籍編號
    Borrow_Date: { type: DataTypes.DATE, allowNull: false, field: "borrow_date" }, // 借閱日期
    Return_Date: { type: DataTypes.DATE, allowNull: false, field: "return_date" }, // 預計歸還日期
    Actual_Return_Date: { type: DataTypes.DATE, allowNull: true, field: "actual_return_date" }  // 實際歸還日期
}, {
    tableName: "borrowing", // 對應的資料表名稱
    timestamps: false  // 不使用自動時間戳（createdAt和updatedAt）
});

// 定義GraphQL中的Users類型
const UsersType = new GraphQLObjectType({
    name: "Users",  // 類型名稱
    fields: () => ({
        ID: { type: GraphQLInt },  // 讀者編號
        Name: { type: GraphQLString },  // 讀者名稱
        Email: { type: GraphQLString },  // 讀者電子郵件
        Phone: { type: GraphQLString },  // 讀者電話
        Address: { type: GraphQLString },  // 讀者地址
        Membership_Date: { type: GraphQLString },  // 讀者加入日期
        Membership_Type: { type: GraphQLString },  // 讀者會員類型
        Status: { type: GraphQLString }  // 讀者狀態
    })
});

// 定義GraphQL中的Books類型
const BooksType = new GraphQLObjectType({
    name: "Books",  // 類型名稱
    fields: () => ({
        ID: { type: GraphQLInt },  // 書籍編號
        Title: { type: GraphQLString },  // 書籍名稱
        Author: { type: GraphQLString },  // 書籍作者
        Publisher: { type: GraphQLString },  // 書籍出版社
        Publication_Date: { type: GraphQLString },  // 書籍出版日期
        ISBN: { type: GraphQLString },  // 書籍ISBN
        Category: { type: GraphQLInt },  // 書籍類別
        Language: { type: GraphQLString },  // 書籍語言
        Pages: { type: GraphQLInt },  // 書籍頁數
        Location: { type: GraphQLString },  // 書籍放置位置
        Copies_Available: { type: GraphQLInt },  // 書籍副本數量
        Copies_Borrowed: { type: GraphQLInt }  // 書籍借出數量
    })
});

// 定義GraphQL中的Categories類型
const CategoriesType = new GraphQLObjectType({
    name: "Categories",  // 類型名稱
    fields: () => ({
        ID: { type: GraphQLInt },  // 類別編號
        Name: { type: GraphQLString },  // 類別名稱
        Description: { type: GraphQLString }  // 類別描述
    })
});

// 定義GraphQL中的Borrowing類型
const BorrowingType = new GraphQLObjectType({
    name: "Borrowing",  // 類型名稱
    fields: () => ({
        ID: { type: GraphQLInt },  // 借閱編號
        User_ID: { type: GraphQLInt },  // 借閱用戶編號
        Book_ID: { type: GraphQLInt },  // 借閱書籍編號
        Borrow_Date: { type: GraphQLString },  // 借閱日期
        Return_Date: { type: GraphQLString },  // 預計歸還日期
        Actual_Return_Date: { type: GraphQLString }  // 實際歸還日期
    })
});

// 建立GraphQL的RootQuery物件，查詢資料使用
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",  // 類型名稱
    // 定義所有可用的Query操作
    fields: {
        // 查詢所有讀者
        findAllUsers: {
            type: new GraphQLList(UsersType),  // 回傳值是一個UsersType陣列
            resolve(parent, args) {  // resolve會實際執行資料查詢的邏輯
                return Users.findAll();  // 使用ORM的findAll方法取得所有讀者
            }
        },
        // 查詢特定讀者
        findSpecificUsers: {
            type: new GraphQLList(UsersType),  // 回傳值是一個UsersType陣列
            // 定義可接受的查詢參數，可依Name和Email做條件篩選
            args: {
                Name: { type: GraphQLString },
                Email: { type: GraphQLString }
            },
            resolve(parent, args) {  // resolve根據參數建立where條件進行查詢
                const whereClause = {};
                if (args.Name) whereClause.Name = args.Name;  // 如果有提供Name，加入條件
                if (args.Email) whereClause.Email = args.Email;  // 如果有提供Email，也加入條件
                return Users.findAll({ where: whereClause });  // 根據組好的where條件查詢資料
            }
        },
        // 查詢特定書籍名稱
        findSpecificBooksTitle: {
            type: new GraphQLList(BooksType),  // 回傳值是一個BooksType陣列
            // 定義可接受的查詢參數，可依Title做條件篩選
            args: {
                Title: { type: GraphQLString }
            },
            resolve(parent, args) {  // resolve根據參數建立where條件進行查詢
                const whereClause = {};
                if (args.Title) whereClause.Title = args.Title;  // 如果有提供Title，加入條件
                return Books.findAll({ where: whereClause });  // 根據組好的where條件查詢資料
            }
        },
        // 查詢特定書籍ISBN
        findSpecificBooksISBN: {
            type: new GraphQLList(BooksType),  // 回傳值是一個BooksType陣列
            // 定義可接受的查詢參數，可依ISBN做條件篩選
            args: {
                ISBN: { type: GraphQLString }
            },
            resolve(parent, args) {  // resolve根據參數建立where條件進行查詢
                const whereClause = {};
                if (args.ISBN) whereClause.ISBN = args.ISBN;  // 如果有提供ISBN，加入條件
                return Books.findAll({ where: whereClause });  // 根據組好的where條件查詢資料
            }
        },
        // 查詢所有類別
        findAllCategories: {
            type: new GraphQLList(CategoriesType),  // 回傳值是一個CategoriesType陣列
            resolve(parent, args) {  // resolve會實際執行資料查詢的邏輯
                return Categories.findAll();  // 使用ORM的findAll方法取得所有書籍
            }
        },
        // 查詢特定讀者借閱紀錄
        findSpecificUserBorrowing: {
            type: new GraphQLList(BorrowingType),  // 回傳值是一個BorrowType陣列
            // 定義可接受的查詢參數，可依User_ID做條件篩選
            args: {
                User_ID: { type: GraphQLInt }
            },
            resolve(parent, args) {  // resolve根據參數建立where條件進行查詢
                const whereClause = {};
                if (args.User_ID) whereClause.User_ID = args.User_ID;  // 如果有提供User_ID，加入條件
                return Borrowing.findAll({ where: whereClause });  // 根據組好的where條件查詢資料
            }
        },
        // 查詢特定書籍借閱紀錄
        findSpecificBookBorrowing: {
            type: new GraphQLList(BorrowingType),  // 回傳值是一個BorrowType陣列
            // 定義可接受的查詢參數，可依Book_ID做條件篩選
            args: {
                Book_ID: { type: GraphQLInt }
            },
            resolve(parent, args) {  // resolve根據參數建立where條件進行查詢
                const whereClause = {};
                if (args.Book_ID) whereClause.Book_ID = args.Book_ID;  // 如果有提供Book_ID，加入條件
                return Borrowing.findAll({ where: whereClause });  // 根據組好的where條件查詢資料
            }
        },
    }
});

// 建立GraphQL的Mutation物件
const Mutation = new GraphQLObjectType({
    name: "Mutation",  // 類型名稱
    // 定義所有可用的mutation操作
    fields: {
        // 新增讀者的Mutation
        addUser: {
            type: UsersType,  // 回傳值是新增後的UsersType陣列
            // 定義可接受的輸入參數
            args: {
                Name: { type: GraphQLString },
                Email: { type: GraphQLString },
                Phone: { type: GraphQLString },
                Address: { type: GraphQLString },
                Membership_Date: { type: GraphQLString },
                Membership_Type: { type: GraphQLString },
                Status: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Users.create({  // 呼叫ORM的create方法，新增一筆讀者資料
                    Name: args.Name,
                    Email: args.Email,
                    Phone: args.Phone,
                    Address: args.Address,
                    Membership_Date: args.Membership_Date,
                    Membership_Type: args.Membership_Type,
                    Status: args.Status
                });
            }
        },

        // 更新讀者資料的Mutation
        updateUser: {
            type: UsersType,  // 回傳值是更新後的UsersType陣列
            // 定義可接受的輸入參數，包含欲更新的欄位及讀者的ID
            args: {
                ID: { type: GraphQLInt },  // 透過ID指定要更新哪筆資料
                Name: { type: GraphQLString },
                Email: { type: GraphQLString },
                Phone: { type: GraphQLString },
                Address: { type: GraphQLString },
                Membership_Date: { type: GraphQLString },
                Membership_Type: { type: GraphQLString },
                Status: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Users.update({  // 呼叫ORM的update方法，更新一筆讀者資料
                    Name: args.Name,
                    Email: args.Email,
                    Phone: args.Phone,
                    Address: args.Address,
                    Membership_Date: args.Membership_Date,
                    Membership_Type: args.Membership_Type,
                    Status: args.Status
                }, {
                    where: { ID: args.ID },  // 根據ID進行更新
                    returning: true  // 回傳更新後的資料
                });
            }
        },

        // 刪除讀者資料的Mutation
        deleteUser: {
            type: UsersType,  // 回傳值是刪除後的UsersType陣列
            args: {
                ID: { type: GraphQLInt }  // 回傳刪除的讀者ID
            },
            resolve(parent, args) {
                return Users.destroy({  // 呼叫ORM的destroy方法，刪除一筆讀者資料
                    where: { ID: args.ID }  // 根據ID進行刪除
                }).then(deleted => {
                    if (deleted === 0) throw new Error("User not found");  // 如果沒有刪除任何資料，代表找不到該讀者
                    return { ID: args.ID };  // 成功刪除則回傳該ID
                });
            }
        },

        // 新增書籍的Mutation
        addBook: {
            type: BooksType,  // 回傳值是新增後的BooksType陣列
            // 定義可接受的輸入參數
            args: {
                Title: { type: GraphQLString },
                Author: { type: GraphQLString },
                Publisher: { type: GraphQLString },
                Publication_Date: { type: GraphQLString },
                ISBN: { type: GraphQLString },
                Category: { type: GraphQLInt },
                Language: { type: GraphQLString },
                Pages: { type: GraphQLInt },
                Location: { type: GraphQLString },
                Copies_Available: { type: GraphQLInt },
                Copies_Borrowed: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return Books.create({  // 呼叫ORM的create方法，新增一筆書籍資料
                    Title: args.Title,
                    Author: args.Author,
                    Publisher: args.Publisher,
                    Publication_Date: args.Publication_Date,
                    ISBN: args.ISBN,
                    Category: args.Category,
                    Language: args.Language,
                    Pages: args.Pages,
                    Location: args.Location,
                    Copies_Available: args.Copies_Available,
                    Copies_Borrowed: args.Copies_Borrowed
                });
            }
        },

        // 更新讀者資料的Mutation
        updateBook: {
            type: BooksType,  // 回傳值是更新後的BooksType陣列
            // 定義可接受的輸入參數，包含欲更新的欄位及書籍的ID
            args: {
                ID: { type: GraphQLInt },  // 透過ID指定要更新哪筆資料
                Title: { type: GraphQLString },
                Author: { type: GraphQLString },
                Publisher: { type: GraphQLString },
                Publication_Date: { type: GraphQLString },
                ISBN: { type: GraphQLString },
                Category: { type: GraphQLInt },
                Language: { type: GraphQLString },
                Pages: { type: GraphQLInt },
                Location: { type: GraphQLString },
                Copies_Available: { type: GraphQLInt },
                Copies_Borrowed: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return Books.update({  // 呼叫ORM的update方法，更新一筆書籍資料
                    Title: args.Title,
                    Author: args.Author,
                    Publisher: args.Publisher,
                    Publication_Date: args.Publication_Date,
                    ISBN: args.ISBN,
                    Category: args.Category,
                    Language: args.Language,
                    Pages: args.Pages,
                    Location: args.Location,
                    Copies_Available: args.Copies_Available,
                    Copies_Borrowed: args.Copies_Borrowed
                }, {
                    where: { ID: args.ID },  // 根據ID進行更新
                    returning: true  // 回傳更新後的資料
                });
            }
        },

        // 刪除書籍資料的Mutation
        deleteBook: {
            type: BooksType,  // 回傳值是刪除後的BooksType陣列
            args: {
                ID: { type: GraphQLInt }  // 回傳刪除的書籍ID
            },
            resolve(parent, args) {
                return Books.destroy({  // 呼叫ORM的destroy方法，刪除一筆書籍資料
                    where: { ID: args.ID } // 根據ID進行刪除
                }).then(deleted => {
                    if (deleted === 0) throw new Error("Book not found");  // 如果沒有刪除任何資料，代表找不到該書籍
                    return { ID: args.ID };  // 成功刪除則回傳該ID
                });
            }
        },

        // 新增類別的Mutation
        addCategory: {
            type: CategoriesType,  // 回傳值是新增後的CategoriesType陣列
            // 定義可接受的輸入參數
            args: {
                Name: { type: GraphQLString },
                Description: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Categories.create({  // 呼叫ORM的create方法，新增一筆類別資料
                    Name: args.Name,
                    Description: args.Description
                });
            }
        },

        // 更新類別資料的Mutation
        updateCategory: {
            type: CategoriesType,  // 回傳值是更新後的CategoriesType陣列
            // 定義可接受的輸入參數，包含欲更新的欄位及類別的ID
            args: {
                ID: { type: GraphQLInt }, // 透過ID指定要更新哪筆資料
                Name: { type: GraphQLString },
                Description: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Categories.update({  // 呼叫ORM的update方法，更新一筆類別資料
                    Name: args.Name,
                    Description: args.Description,
                }, {
                    where: { ID: args.ID }, // 根據ID進行更新
                    returning: true // 回傳更新後的資料
                });
            }
        },

        // 刪除類別資料的Mutation
        deleteCategory: {
            type: CategoriesType,  // 回傳值是刪除後的CategoriesType陣列
            args: {
                ID: { type: GraphQLInt }  // 回傳刪除的類別ID
            },
            resolve(parent, args) {
                return Categories.destroy({  // 呼叫ORM的destroy方法，刪除一筆類別資料
                    where: { ID: args.ID }  // 根據ID進行刪除
                }).then(deleted => {
                    if (deleted === 0) throw new Error("Category not found");  // 如果沒有刪除任何資料，代表找不到該類別
                    return { ID: args.ID };  // 成功刪除則回傳該ID
                });
            }
        },

        // 新增借閱紀錄的Mutation
        addBorrow: {
            type: BorrowingType,  // 回傳值是新增後的BorrowingType陣列
            // 定義可接受的輸入參數
            args: {
                User_ID: { type: GraphQLInt },
                Book_ID: { type: GraphQLInt },
                Borrow_Date: { type: GraphQLString },
                Return_Date: { type: GraphQLString },
                Actual_Return_Date: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Borrowing.create({  // 呼叫ORM的create方法，新增一筆借閱紀錄資料
                    User_ID: args.User_ID,
                    Book_ID: args.Book_ID,
                    Borrow_Date: args.Borrow_Date,
                    Return_Date: args.Return_Date,
                    Actual_Return_Date: args.Actual_Return_Date
                });
            }
        },

        // 更新借閱紀錄資料的Mutation
        updateBorrow: {
            type: BorrowingType,  // 回傳值是更新後的BorrowingType陣列
            // 定義可接受的輸入參數，包含欲更新的欄位及借閱紀錄的ID
            args: {
                ID: { type: GraphQLInt }, // 透過ID指定要更新哪筆資料
                User_ID: { type: GraphQLInt },
                Book_ID: { type: GraphQLInt },
                Borrow_Date: { type: GraphQLString },
                Return_Date: { type: GraphQLString },
                Actual_Return_Date: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Borrowing.update({  // 呼叫ORM的update方法，更新一筆借閱紀錄資料
                    User_ID: args.User_ID,
                    Book_ID: args.Book_ID,
                    Borrow_Date: args.Borrow_Date,
                    Return_Date: args.Return_Date,
                    Actual_Return_Date: args.Actual_Return_Date
                }, {
                    where: { ID: args.ID }, // 根據ID進行更新
                    returning: true // 回傳更新後的資料
                });
            }
        },

        // 刪除借閱紀錄資料的Mutation
        deleteBorrow: {
            type: BorrowingType,  // 回傳值是刪除後的BorrowingType陣列
            args: {
                ID: { type: GraphQLInt }  // 回傳刪除的借閱紀錄ID
            },
            resolve(parent, args) {
                return Borrowing.destroy({  // 呼叫ORM的destroy方法，刪除一筆借閱紀錄資料
                    where: { ID: args.ID }  // 根據ID進行刪除
                }).then(deleted => {
                    if (deleted === 0) throw new Error("Borrow not found");  // 如果沒有刪除任何資料，代表找不到該借閱紀錄
                    return { ID: args.ID };  // 成功刪除則回傳該ID
                });
            }
        }
    }
});  

// 定義GraphQL Schema
const schema = new GraphQLSchema({
    query: RootQuery,  // 設定根查詢
    mutation: Mutation  // 
});

// 使用express-graphql中介軟體來處理GraphQL請求
app.use("/graphql", graphqlHTTP({
    schema,  // 使用已定義的GraphQL Schema
    graphiql: true  // 啟用GraphiQL用戶界面
}));

// 啟動伺服器，並同步資料庫
sequelize.sync().then(() => {
    app.listen(8095, () => {
        console.log("Server is running on http://localhost:8095/graphql");  // 顯示伺服器啟動訊息
    });
});
