const router = require("express").Router();
const { startPuppeteerController, deletePuppeteerController } = require("../controllers/startPuppeteer");
const { startPuppeteerFunction, deletePuppeteerFunction } = require("../utils/startPuppeteer");

router.post("/start", startPuppeteerController, startPuppeteerFunction);
router.delete("/delete", deletePuppeteerController, deletePuppeteerFunction);

module.exports = router;