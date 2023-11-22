const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    // host: "db4free.net",
    // user: "restapitest123",
    // password: "restapitest123",
    // database: "restapitest123",
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'recruit',
    port: 3306,
  },
  listPerPage: 10,
};

module.exports = config;
