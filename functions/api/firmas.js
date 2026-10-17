// Cloudflare Pages Function: /api/firmas
// Configura la variable de entorno APPS_SCRIPT_URL con la URL /exec.
export async function onRequestGet({ env }) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options':'nosniff' };
  if (!env.APPS_SCRIPT_URL || !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(env.APPS_SCRIPT_URL.trim())) {
    return new Response(JSON.stringify({ error:'contador_no_configurado' }), { status:503, headers });
  }
  try {
    const response = await fetch(env.APPS_SCRIPT_URL.trim(), { redirect:'follow', headers:{Accept:'application/json'}, signal:AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Apps Script: '+response.status);
    const data = await response.json();
    if (!Number.isSafeInteger(data.total) || data.total < 0) throw new Error('Respuesta no válida');
    return new Response(JSON.stringify({total:data.total}), { status:200, headers });
  } catch (e) {
    console.error('Error al obtener total de apoyos:', e.message);
    return new Response(JSON.stringify({error:'contador_no_disponible'}), {status:502, headers});
  }
}
