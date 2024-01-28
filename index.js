const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const candidateRouter = require("./routes/candidateRoute");
const vendorRouter = require("./routes/vendorRoute");
const skillsRouter = require("./routes/skillRoute");
const jobsRouter = require("./routes/jobRoute");
const loginRouter = require("./routes/loginRoute");
const candidateJobRouter = require("./routes/candidateJobRoute");
const candidateStatusRouter = require("./routes/candidateStatusRoute");
const fileRouter = require("./routes/fileRoute");
const adminRouter = require("./routes/adminRoute");
const jobCategoryRouter = require("./routes/jobCategoryRoute");
const initRouter = require("./routes/initRoute");

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/users", candidateRouter);
app.use("/vendor", vendorRouter);
app.use("/skills", skillsRouter);
app.use("/jobs", jobsRouter);
app.use("/candidatejob", candidateJobRouter);
app.use("/login", loginRouter);
app.use("/file", fileRouter);
app.use("/candidatestatus", candidateStatusRouter);
app.use("/admin", adminRouter);
app.use("/jobcategory", jobCategoryRouter);
app.use("/init", initRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  if (req.headers.authorization) {
    console.log('authorized service call');
  }
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


