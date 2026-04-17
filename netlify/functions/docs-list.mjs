import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() });
  }

  const store = getStore("hamiscan-docs");

  // Lister toutes les clés
  const { blobs } = await store.list();

  // Charger chaque document
  const docs = await Promise.all(
    blobs.map(async ({ key }) => {
      try {
        return await store.get(key, { type: 'json' });
      } catch (e) {
        return null;
      }
    })
  );

  // Trier par date décroissante, filtrer les nulls
  const sorted = docs
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return resp({ success: true, docs: sorted, total: sorted.length });
};

export const config = { path: "/api/docs/list" };

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function resp(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors() }
  });
}
