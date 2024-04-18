const {startPuppeteerFunction} = require("../utils/startPuppeteer");

const startPuppeteerController = async(req, res, next) => {
    next()
}

module.exports = { startPuppeteerController };