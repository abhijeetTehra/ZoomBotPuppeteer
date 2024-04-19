const { startVideoStream } = require("../utils/startStream");

const router = require("express").Router();

router.get("/video", startVideoStream);

module.exports = router;
