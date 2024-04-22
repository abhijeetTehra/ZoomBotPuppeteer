const puppeteer = require("puppeteer");
const WebSocket = require("ws");
const http = require("http");

// Store references to browser pages and their respective WebSocket clients
const pages = {};

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", function upgrade(request, socket, head) {
  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;
  console.log("Upgrade requested for", pathname);

  if (pages[pathname]) {
    // Check if the path has been initialized
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, pathname);
    });
  } else {
    socket.destroy(); // Destroy the socket if the path is not recognized
  }
});

wss.on("connection", function connection(ws, request, pathname) {
  console.log("WebSocket connection established on", pathname);

  ws.on("message", async(message) => {
    console.log(`Received message from ${pathname}:`, message);
	try{

		await pages[pathname].page.focus("body");
		// Press Ctrl+M to mute, example of controlling the page
		await pages[pathname].page.keyboard.down("ControlLeft");
		await pages[pathname].page.keyboard.press("KeyM");
		await pages[pathname].page.keyboard.up("ControlLeft");
	}catch(e){
		console.log("PAGE NOT FOUND");
		console.log(pages);
	}
  });

  ws.on("close", () => {
    console.log(`WebSocket connection closed on ${pathname}`);
  });

  // Set an interval to send screenshots
  const interval = setInterval(async () => {
    if (pages[pathname]) {
      const screenshotBuffer = await pages[pathname].page.screenshot({
        encoding: "binary",
      });
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(screenshotBuffer);
      }
    } else {
      clearInterval(interval); // Clear the interval if the page is not found
    }
  }, pages[pathname].time);
});

server.listen(8080, () => {
  console.log("WebSocket Server is running on ws://localhost:8080");
});

const startPuppeteerFunction = async (req, res) => {
  const { url, meetingId, passcode, name } = req.body;
  const path = "/" + name.replaceAll(" ", "").toLowerCase();
  if (pages[path]) {
    return res.send({
      message: "WebSocket channel already exists for this name",
    });
  }

  const browser = await puppeteer.launch({
    headless: true,
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
//   await page.focus("body");

//   // Press Ctrl+M to mute, example of controlling the page
//   await page.keyboard.down("ControlLeft");
//   await page.keyboard.press("KeyM");
//   await page.keyboard.up("ControlLeft");

  console.log("Browser started for", name);

  const time = parseInt(1000 / 30); // ~33.33 milliseconds

  // Store the page and settings under the path
  pages[path] = { page, time, browser };

  res.send({ message: "WebSocket channel created successfully" });
};

module.exports = { startPuppeteerFunction };
