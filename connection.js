const mysql = require("mysql2");

function connection() {
    try {
        const pool = mysql.createPool({
            host: '3.149.240.114',
            port: '3306',
            user: 'satish',
            password: 'Satish@123',
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
    host: '3.149.240.114',
    port: '3306',
    user: 'satish',
    password: 'Satish@123',
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