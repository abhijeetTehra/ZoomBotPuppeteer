const puppeteer = require("puppeteer");
let browser = {
	close: () => {
		return "No Browser Instance Running";
	},
};
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const startPuppeteerFunction = async (req, res) => {
	const { url, meetingId, passcode, name } = req.body;
	const meetId = meetingId.trim();
	const meetPassCode = passcode.trim();
	browser = await puppeteer.launch({
		executablePath: "/usr/bin/google-chrome",
		headless: true,
		args: [
			"--disable-notifications",
			"--enable-automation",
			"--start-maximized",
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
	await page.focus("body");

	// Press Ctrl+M
	await page.keyboard.down("ControlLeft"); // Hold down the Control key
	await page.keyboard.press("KeyM"); // Press the M key
	await page.keyboard.up("ControlLeft"); // Release the Control key
	console.log("Started");
	const time = parseInt(1000 / 30);
	setInterval(async () => {
		const screenshotBuffer = await page.screenshot({ encoding: "binary" });
		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(screenshotBuffer);
			}
		});
	}, [time]); // Capture and send every ~16.67 milliseconds
	res.send({
		message: "Successful",
	});
};

module.exports = {
	startPuppeteerFunction,
};
