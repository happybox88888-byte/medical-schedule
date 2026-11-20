import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("schedule");
  const key = "events";

  // GET: загрузка расписания
  if (req.method === "GET") {
    try {
      const events = await store.get(key, { type: "json" });
      return new Response(JSON.stringify({ events: events || [] }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ events: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // PUT: сохранение расписания
  if (req.method === "PUT") {
    try {
      const body = await req.json();
      const events = body.events;
      await store.setJSON(key, events);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to save" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
};
