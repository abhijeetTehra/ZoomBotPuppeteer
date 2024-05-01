const express = require("express");
const app = express();
const dotenv = require("dotenv");
// const puppeteerRouter = require("./routes/startPuppeteer");
const cors = require("cors");
const { startPuppeteerFunction } = require("./utils/startPuppeteer");
const http = require("http");
const WebSocket = require("ws");

dotenv.config();

const port = 4200;

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let pages = {};
let upgraded = 0;
const uniqueId = process.env.UNIQUEID;

app.get("/", function (req, res) {
	// res.sendFile(__dirname + "/index.html");
	res.send({
		message: "Welcome to ZoomBot Puppeteer Service",
	});
});

// app.use("/zoom", puppeteerRouter);
startPuppeteerFunction(pages, wss);

server.on("upgrade", function upgrade(request, socket, head) {
	upgrade++;
	pathname = new URL(
		request.url,
		`http://${request.headers.host}`
	).pathname.split("/")[1];
	if (upgrade != 1) {
		return;
	}
	console.log("Upgrade requested for", pathname);

	if (pathname === uniqueId && upgrade == 1) {
		// Check if the path has been initialized
		wss.handleUpgrade(request, socket, head, (ws) => {
			wss.emit("connection", ws, request, pathname);
		});
	} else {
		socket.destroy(); // Destroy the socket if the path is not recognized
	}
});
console.log("Rendered");
server.listen(port, () => {
	console.log(`Server is running at port: ${port}`);
});
