const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const store = getStore("m4n-state");
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod === "GET") {
    try {
      const data = await store.get("state");
      return { statusCode: 200, headers, body: data || "{}" };
    } catch(e) {
      return { statusCode: 200, headers, body: "{}" };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      await store.set("state", event.body);
      return { statusCode: 200, headers, body: '{"ok":true}' };
    } catch(e) {
      return { statusCode: 500, headers, body: '{"error":"Could not save"}' };
    }
  }

  return { statusCode: 405, headers, body: '{"error":"Method not allowed"}' };
};
