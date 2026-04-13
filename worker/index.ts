/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/cards" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM cards ORDER BY id"
      ).all();
      const cards = results.map((row: Record<string, unknown>) => ({
        id: row.id,
        category: row.category,
        front: row.front,
        back: row.back,
        keyPoints: JSON.parse(row.key_points as string),
      }));
      return Response.json(cards);
    }

    if (url.pathname === "/api/state") {
      if (request.method === "GET") {
        const row = await env.DB.prepare(
          "SELECT data FROM app_state WHERE id = 1"
        ).first<{ data: string }>();
        if (!row) return Response.json(null);
        return Response.json(JSON.parse(row.data));
      }
      if (request.method === "PUT") {
        const body = await request.text();
        await env.DB.prepare(
          "INSERT OR REPLACE INTO app_state (id, data) VALUES (1, ?)"
        )
          .bind(body)
          .run();
        return new Response("OK");
      }
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
