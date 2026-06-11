exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const { getStore } = require("@netlify/blobs");
    const store = getStore("m4n-state");

    if (event.httpMethod === "GET") {
      const data = await store.get("state", { type: "text" });
      return { statusCode: 200, headers, body: data || "{}" };
    }

    if (event.httpMethod === "POST") {
      await store.set("state", event.body);
      return { statusCode: 200, headers, body: '{"ok":true}' };
    }
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({error: e.message}) };
  }

  return { statusCode: 405, headers, body: '{"error":"Method not allowed"}' };
};
