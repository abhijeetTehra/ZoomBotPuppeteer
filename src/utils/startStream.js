const fs = require("fs");
const path = require("path");

function startVideoStream(req, res) {
	const range = req.headers.range;
	if (!range) {
		return res.status(400).send("Requires Range header");
	}

	const videoPath = path.join(
		__dirname,
		"../Big_Buck_Bunny_1080_10s_30MB.mp4"
	);

	fs.stat(videoPath, (err, stats) => {
		if (err) {
			console.error("Error reading video file:", err);
			return res.status(500).send("Internal Server Error");
		}

		const videoSize = stats.size;
		const CHUNK_SIZE = 10 ** 6;
		const start = Number(range.replace(/\D/g, ""));
		const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
		const contentLength = end - start + 1;

		const headers = {
			"Content-Range": `bytes ${start}-${end}/${videoSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": contentLength,
			"Content-Type": "video/mp4",
		};

		res.writeHead(206, headers);

		const videoStream = fs.createReadStream(videoPath, { start, end });
		videoStream.on("error", (err) => {
			console.error("Error reading video stream:", err);
			res.end();
		});

		videoStream.pipe(res);
	});
}

module.exports = { startVideoStream };
