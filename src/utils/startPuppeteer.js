const puppeteer = require("puppeteer");
let browser = {
  close: () => {return "No Browser Instance Running"},
};
const startPuppeteerFunction = async (req, res) => {
  const { url, meetingId, passcode, name } = req.body;
  const meetId = meetingId.trim();
  const meetPassCode = passcode.trim();
  browser = await puppeteer.launch({
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
  const page = await browser.newPage();
  const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
  await page.setUserAgent(ua);
  await page.goto(url);
  //   await keyboard.pressKey(Key.LeftControl, Key.M);
  //   await keyboard.releaseKey(Key.LeftControl);
  //   await page.keyboard.down("ControlLeft");
  //   await page.keyboard.press("KeyM");
  // await page.keyboard.down("KeyY")
  //   await page.keyboard.down("ControlLeft");
  // Focus on the page or a specific element if needed
  await page.focus("body");

  // Press Ctrl+M
  await page.keyboard.down("ControlLeft"); // Hold down the Control key
  await page.keyboard.press("KeyM"); // Press the M key
  await page.keyboard.up("ControlLeft"); // Release the Control key
  console.log("Started");
  setInterval(async () => {
    const recorder = await page.screenshot({
      path: "screenshot.jpg",
    });
    console.log(
      "============================= Recorded Page ============================="
    );
    // console.log(recorder);
  }, [1000 / 60]);
  res.send({
    message: "Successful",
  });
};

const deletePuppeteerFunction = async (req, res) => {
    console.log(browser);
    browser.close();
  res.send({
    message: "Browser Closed",
  });
};

module.exports = { startPuppeteerFunction, deletePuppeteerFunction };
