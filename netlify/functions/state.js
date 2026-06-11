const https = require("https");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const token = process.env.NETLIFY_TOKEN;
  const siteID = "25518391-1288-48ac-8ab2-b589ff0cfc9a";

  function apiRequest(method, path, body) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "api.netlify.com",
        path: `/api/v1/${path}`,
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/octet-stream"
        }
      };
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      });
      req.on("error", reject);
      if (body) req.write(typeof body === "string" ? body : JSON.stringify(body));
      req.end();
    });
  }

  try {
    if (event.httpMethod === "GET") {
      const res = await apiRequest("GET", `blobs/${siteID}/m4n-store/state`);
      return { statusCode: 200, headers, body: res.status === 200 ? res.body : "{}" };
    }
    if (event.httpMethod === "POST") {
      await apiRequest("PUT", `blobs/${siteID}/m4n-store/state`, event.body);
      return { statusCode: 200, headers, body: '{"ok":true}' };
    }
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
  return { statusCode: 405, headers, body: "{}" };
};
