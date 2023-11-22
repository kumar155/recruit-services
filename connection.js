const mysql = require("mysql2");

function connection() {
    try {
        const pool = mysql.createPool({
            host: '127.0.0.1',
            user: 'admin',
            password: 'Admin@1234',
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

const connectionPool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'recruit',
    timezone: 'utc',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

const pool = connection();

module.exports = {
    connection: async () => pool.getConnection(),
    execute: async (connection, ...params) => {
        const [results] = await pool.query(...params);
        const con = await connection();
        con.release();
        return results;
    },
    connectionPool,
};