const express = require("express");
const app = express();
const dotenv = require("dotenv");
const puppeteerRouter = require("./routes/startPuppeteer");

dotenv.config();

const port = process.env.PORT || 4000;


app.use(express.json());

app.use("/zoom", puppeteerRouter);

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
})