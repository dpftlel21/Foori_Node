import mysql from 'mysql2';

const db_info = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "1234",
    database: "test"
};

const DB = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function (conn) {
        conn.connect(function (err) {
            if (err) console.error("mysql connection error : " + err);
            else console.log("mysql is connected successfully!");
        });
    },
    query: function (conn, sql, values) {
        return new Promise((resolve, reject) => {
            conn.query(sql, values, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
};



export { DB };
