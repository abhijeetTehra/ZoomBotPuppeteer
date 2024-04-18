const puppeteer = require("puppeteer");
const { keyboard, Key } = require("@nut-tree/nut-js");

const startPuppeteerFunction = async (req, res) => {
  const { url, meetingId, passcode, name } = req.body;
  const meetId = meetingId.trim();
  const meetPassCode = passcode.trim();
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-notifications",
      "--enable-automation",
      "--start-maximized",
      // "--use-fake-ui-for-media-stream", // Use fake media stream dialogs
      "--use-fake-device-for-media-stream", // Use fake device for media stream
      '--auto-select-desktop-capture-source="Entire screen"', // Automatically select the entire screen in screen sharing
    ],
    ignoreDefaultArgs: false,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  });
  const page  = await browser.newPage();
  const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
  await page.setUserAgent(ua);
  await page.goto(url);
  await keyboard.pressKey(Key.LeftControl, Key.M);
  await keyboard.releaseKey(Key.LeftControl);
  console.log("Started")
  setInterval(async()=>{
    const recorder = await page.screenshot({
      encoding: 'base64'
    });
    console.log("============================= Recorded Page =============================");
    console.log(recorder);
  }, [1000/60])
  res.send({
    message: "Successful"
  })
};

module.exports = { startPuppeteerFunction };
