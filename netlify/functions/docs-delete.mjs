import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() });
  }
  if (req.method !== 'DELETE') {
    return resp({ error: 'Méthode non autorisée' }, 405);
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return resp({ error: 'Paramètre id manquant' }, 400);
  }

  const store = getStore("hamiscan-docs");
  await store.delete(id);

  return resp({ success: true, deleted: id });
};

export const config = { path: "/api/docs/delete" };

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
