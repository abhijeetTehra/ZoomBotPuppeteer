const express = require("express");
const app = express();
const dotenv = require("dotenv");
const puppeteerRouter = require("./routes/startPuppeteer");
const streamRouter = require("./routes/streamRouter");
const sampleStream = require("./routes/streamAdd");

dotenv.config();

const port = process.env.PORT || 4200;

app.use(express.json());

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.use("/api", streamRouter);
app.use("/zoom", puppeteerRouter);
app.use("/", sampleStream);

app.listen(port, () => {
	console.log(`Server is running at port: ${port}`);
});
