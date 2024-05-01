const puppeteer = require("puppeteer");
const WebSocket = require("ws");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const startPuppeteerFunction = async (pages, wss) => {
  const url = process.env.URL || "https://mo.aidtaas.com";
  const uniqueId = process.env.UNIQUEID || "test";
  const path = uniqueId;

  if (pages[path]) {
    return res.send({
      message: "WebSocket channel already exists for this name",
    });
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome",
    args: [
      "--disable-notifications",
      "--enable-automation",
      "--start-maximized",
    ],
    defaultViewport: { width: 1280, height: 720 },
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
  );
  await page.goto(url);

  console.log("Browser started for", uniqueId);

  const time = parseInt(1000 / 30); // ~33.33 milliseconds

  // Store the page and settings under the path
  pages[path] = { page, time, browser };
  var interval = 54654;
  wss.on("connection", function connection(ws, request) {
    console.log("WebSocket connection established on", path);

    ws.on("message", async (message) => {
      console.log(`Received message from ${path}:`, message);
      try {
        await pages[path].page.goto(url);
        await pages[path].page.focus("body");
        await pages[path].page.keyboard.down("ControlLeft");
        await pages[path].page.keyboard.press("KeyM");
        await pages[path].page.keyboard.up("ControlLeft");
        interval = setInterval(async () => {
          if (pages[path]) {
            const screenshotBuffer = await pages[path].page.screenshot({
              encoding: "base64",
            });
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(screenshotBuffer);
            }
          } else {
            clearInterval(interval); // Clear the interval if the page is not found
          }
        }, 1000 / 60);
      } catch (e) {
        console.log("PAGE NOT FOUND");
        console.log(pages);
      }
    });

    ws.on("close", () => {
      clearInterval(interval);
      console.log(`WebSocket connection closed on ${path}`);
    });
  });
};

module.exports = { startPuppeteerFunction };
