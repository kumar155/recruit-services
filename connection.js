const mysql = require("mysql2");

function connection() {
    try {
        const pool = mysql.createPool({
            host: '127.0.0.1',
            user: 'root',
            password: 'P@55word',
            database: 'recruit',
            timezone: 'utc',
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0
        });

        const promisePool = pool.promise();

        return promisePool;
    } catch (error) {
        return console.log(`Could not connect - ${error}`);
    }
}

const pool = connection();

module.exports = {
    connection: async () => pool.getConnection(),
    execute: (...params) => pool.execute(...params),
};