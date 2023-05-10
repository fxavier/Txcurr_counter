import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fetch = (url, options) =>
	import("node-fetch").then((mod) => mod.default(url, options));

const app = express();

app.use(express.static(path.join(__dirname)));

const getCurrentPeriod = () => {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
	return `${year}${month}`;
};
app.get("/fetch-data", async (req, res) => {
	const dhis2Url = "https://dhis2.echomoz.org";
	const username = "xnhagumbe";
	const password = "Go$btgo1";
	const indicatorId = "DdzG2THhOPv";
	let period = req.query.period || "";

	if (!period) {
		const currentDate = new Date();
		currentDate.setMonth(currentDate.getMonth() - 1);
		const year = currentDate.getFullYear();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
		period = `${year}${month}`;
	}

	const apiRequest = `${dhis2Url}/api/analytics.json?dimension=dx:${indicatorId}&dimension=pe:${period}&filter=ou:zQUKoh5WmJt;LEVEL-1&displayProperty=NAME&outputIdScheme=NAME`;

	try {
		const response = await fetch(apiRequest, {
			headers: {
				Authorization:
					"Basic " + Buffer.from(username + ":" + password).toString("base64"),
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		if (!data || !data.rows || data.rows.length === 0) {
			// return default value or error message if data or rows is empty
			res.status(404).json({ message: "No data found" });
		} else {
			res.json(data.rows[0][2]);
		}
	} catch (error) {
		// return error message if API request fails
		res.status(500).json({ message: error.message });
	}
});

//	res.json(data.rows[0][2]);

app.listen(5000, () => {
	console.log("Server running at http://localhost:5000");
});
