import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("grimoire");
  const cors = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, PUT, POST, OPTIONS",
    "access-control-allow-headers": "Content-Type"
  };
  if (req.method === "OPTIONS") return new Response("", { headers: cors });
  try {
    if (req.method === "GET") {
      const data = await store.get("data");
      return new Response(data || "{}", { headers: cors });
    }
    if (req.method === "PUT" || req.method === "POST") {
      const body = await req.text();
      await store.set("data", body || "{}");
      return new Response('{"ok":true}', { headers: cors });
    }
    return new Response('{"error":"method"}', { status: 405, headers: cors });
  } catch (e) {
    return new Response('{"error":"' + (e && e.message ? e.message : "store") + '"}', { status: 500, headers: cors });
  }
};
