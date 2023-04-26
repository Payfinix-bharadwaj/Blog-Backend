const express = require("express");
const errorHandler = require("./middleware/ErrorHandler");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection.js");

connectDB();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
// app.use('/api/blog', require("../blog-backend/routes/BlogRouter"))
app.use("/api/article", require("./routes/articleRouter"));
app.use("/api/users", require("./routes/userRouter"));
app.use("/api/selected", require("./routes/topicSelectedRouter"));
app.use("/api/topic", require("./routes/topicMainRouter"));
app.use("/api/profile", require("./routes/profileRouter"));
app.use("/api/followunfollow", require("./routes/followUnfollowRouter"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("Press Ctrl+C to quit.");
});
