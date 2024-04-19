const puppeteer = require("puppeteer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const router = require("express").Router();
const locateChrome = require("locate-chrome");

const MAX_VIDEO_DURATION_SECONDS = 3600; // One hour
const FPS = 30;

let startTime;
let lastFrameTime;

async function captureFrame(page, frameNumber, outputDir) {
	const framePath = path.join(outputDir, `frame-${frameNumber}.png`);
	await page.screenshot({ path: framePath });
	return framePath;
}

async function encodeVideo(framesDir, outputFilePath) {
	return new Promise((resolve, reject) => {
		ffmpeg()
			.input(path.join(framesDir, "frame-%d.png"))
			.inputFPS(FPS)
			.outputOptions("-pix_fmt", "yuv420p")
			.output(outputFilePath)
			.on("end", () => resolve())
			.on("error", (err) => reject(err))
			.run();
	});
}

async function main() {
	const url = "https://aidtaas.com/"; // URL to capture frames from
	const outputDir = "./frames"; // Directory to save frames
	const outputFilePath = "./output.mp4"; // Output MP4 file path

	// Ensure output directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	// Initialize start time and last frame time
	startTime = Date.now();
	lastFrameTime = startTime;

	const executablePath =
		(await new Promise((resolve) => locateChrome((arg) => resolve(arg)))) ||
		"";

	console.log(executablePath, "here");

	const browser = await puppeteer.launch({
		executablePath,
	});
	const page = await browser.newPage();

	// Capture frames continuously
	let frameNumber = 0;
	let frames = [];

	const captureLoop = async () => {
		const frameTime = Date.now() - startTime;

		// Capture frame
		const framePath = await captureFrame(page, frameNumber, outputDir);
		frames.push({ path: framePath, time: frameTime });

		// Check if one hour duration exceeded
		if (frameTime > MAX_VIDEO_DURATION_SECONDS * 1000) {
			// Remove frames older than one hour
			const cutoffTime = frameTime - MAX_VIDEO_DURATION_SECONDS * 1000;
			frames = frames.filter((frame) => frame.time > cutoffTime);

			// Update start time
			startTime = frames[0].time;
		}

		// Encode video if enough frames
		if (frames.length >= FPS) {
			const tempOutputFilePath = "./temp_output.mp4";
			await encodeVideo(outputDir, tempOutputFilePath);

			// If output file exists, remove it
			if (fs.existsSync(outputFilePath)) {
				fs.unlinkSync(outputFilePath);
			}

			// Rename temporary output file to final output file
			fs.renameSync(tempOutputFilePath, outputFilePath);
		}

		frameNumber++;

		// Calculate delay for next frame capture
		const currentTime = Date.now();
		const elapsedTime = currentTime - lastFrameTime;
		const delay = Math.max(1000 / FPS - elapsedTime, 0);

		// Continue capturing frames
		setTimeout(captureLoop, delay);

		lastFrameTime = currentTime;
	};

	captureLoop();
}

// main().catch(err => console.error('Error:', err));
router.get("/cap", main);
module.exports = router;
