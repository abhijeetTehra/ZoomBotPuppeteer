const express = require("express");
const app = express();
const dotenv = require("dotenv");
const puppeteerRouter = require("./routes/startPuppeteer");

dotenv.config();

const port = process.env.PORT || 4200;

app.use(express.json());

app.get("/", function (req, res) {
	// res.sendFile(__dirname + "/index.html");
	res.send({
		message: "Welcome to ZoomBot Puppeteer Service",
	});
});

app.use("/zoom", puppeteerRouter);

app.listen(port, () => {
	console.log(`Server is running at port: ${port}`);
});
