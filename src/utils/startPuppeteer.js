const puppeteer = require("puppeteer");
const WebSocket = require("ws");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const startPuppeteerFunction = async (pages, wss) => {
	const url = process.env.URL;
	const uniqueId = process.env.UNIQUEID;
	const path = uniqueId;

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

	console.log("Browser started for", uniqueId);

	const time = parseInt(1000 / 30); // ~33.33 milliseconds

	// Store the page and settings under the path
	pages[path] = { page, time, browser };

	wss.on("connection", function connection(ws, request) {
		console.log("WebSocket connection established on", path);

		ws.on("message", async (message) => {
			console.log(`Received message from ${pathname}:`, message);
			try {
				await pages[pathname].page.focus("body");
				await pages[pathname].page.keyboard.down("ControlLeft");
				await pages[pathname].page.keyboard.press("KeyM");
				await pages[pathname].page.keyboard.up("ControlLeft");
			} catch (e) {
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
					encoding: "base64",
				});
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(screenshotBuffer);
				}
			} else {
				clearInterval(interval); // Clear the interval if the page is not found
			}
		}, 1000 / 60);
	});
};

module.exports = { startPuppeteerFunction };
