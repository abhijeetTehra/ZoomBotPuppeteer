const router = require("express").Router();
const {
	startPuppeteerController
} = require("../controllers/startPuppeteer");
const {
	startPuppeteerFunction,
} = require("../utils/startPuppeteer");

router.post("/start", startPuppeteerController, startPuppeteerFunction);

module.exports = router;
