const mysql = require("mysql2/promise");
const config = require("../config");
const pool = require("../connection");

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, params);
  // const results = await pool.connectionPool.getConnection(function (err, connection) {
  //   return connection.query(sql, params, function(err, rows) {
  //     connection.release();
  //     return rows;
  //   });
  // });

  return results;
}


function getConnection(callback) {
  pool.connectionPool.getConnection(function (err, connection) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    callback(err, connection);
  })
}

module.exports = {
  query,
  getConnection,
};
