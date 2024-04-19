const router = require("express").Router();
const {
	startPuppeteerController,
	deletePuppeteerController,
} = require("../controllers/startPuppeteer");
const {
	startPuppeteerFunction,
	deletePuppeteerFunction,
	streamCapture,
} = require("../utils/startPuppeteer");

router.post("/start", startPuppeteerController, startPuppeteerFunction);
router.delete("/delete", deletePuppeteerController, deletePuppeteerFunction);
router.get("/stream", streamCapture);

module.exports = router;
