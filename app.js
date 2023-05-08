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

app.get("/fetch-data", async (req, res) => {
	const dhis2Url = "https://dhis2.echomoz.org";
	const username = "xnhagumbe";
	const password = "Go$btgo1";
	const indicatorId = "DdzG2THhOPv";
	const period = req.query.period || "202303";

	const apiRequest = `${dhis2Url}/api/analytics.json?dimension=dx:${indicatorId}&dimension=pe:${period}&filter=ou:zQUKoh5WmJt;LEVEL-1&displayProperty=NAME&outputIdScheme=NAME`;

	const response = await fetch(apiRequest, {
		headers: {
			Authorization:
				"Basic " + Buffer.from(username + ":" + password).toString("base64"),
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();
	res.json(data.rows[0][2]);
});

app.listen(5000, () => {
	console.log("Server running at http://localhost:5000");
});
