import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() });
  }
  if (req.method !== 'POST') {
    return resp({ error: 'Méthode non autorisée' }, 405);
  }

  let doc;
  try {
    doc = await req.json();
  } catch (e) {
    return resp({ error: 'JSON invalide' }, 400);
  }

  if (!doc.text || !doc.title) {
    return resp({ error: 'Champs manquants : title et text requis' }, 400);
  }

  const store = getStore("hamiscan-docs");
  const id = Date.now().toString();

  const record = {
    id,
    title:         doc.title     || 'Sans titre',
    category:      doc.category  || 'document',
    text:          doc.text,
    confidence:    doc.confidence || null,
    words:         doc.words     || doc.text.split(/\s+/).filter(Boolean).length,
    date:          new Date().toISOString(),
    // On stocke l'image si elle est fournie (base64)
    imageData:     doc.imageData || null,
    processedData: doc.processedData || null,
  };

  await store.setJSON(id, record);
  return resp({ success: true, id, record });
};

export const config = { path: "/api/docs/save" };

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
