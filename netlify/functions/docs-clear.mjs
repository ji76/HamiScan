import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() });
  }
  if (req.method !== 'DELETE') {
    return resp({ error: 'Méthode non autorisée' }, 405);
  }

  const store = getStore("hamiscan-docs");
  const { blobs } = await store.list();

  await Promise.all(blobs.map(({ key }) => store.delete(key)));

  return resp({ success: true, deleted: blobs.length });
};

export const config = { path: "/api/docs/clear" };

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
