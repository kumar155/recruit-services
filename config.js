const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    // host: "db4free.net",
    // user: "restapitest123",
    // password: "restapitest123",
    // database: "restapitest123",
    host: '127.0.0.1',
    user: 'root',
    password: 'P@55word',
    database: 'recruit'
  },
  listPerPage: 10,
};

module.exports = config;
