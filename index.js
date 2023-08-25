const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const candidateRouter = require("./routes/candidateRoute");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/users", candidateRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

// const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];


// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         var msg =
//           "The CORS policy for this site does not " +
//           "allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     }
//   })
// ); 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


