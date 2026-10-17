// Cloudflare Pages Function: /api/firmas
// Configura la variable de entorno APPS_SCRIPT_URL con la URL /exec.
export async function onRequestGet({ env }) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options':'nosniff' };
  // Este endpoint solo expone el total de apoyos, nunca respuestas personales.
  const scriptUrl = 'https://script.google.com/macros/s/AKfycby_NCjSOJKH4pleY50FH6sRx9HhYHrygS6TaTs6Dt2ugikO7-Ir2_l7NxPrjkQemsNLWA/exec';
  try {
    const response = await fetch(scriptUrl, { redirect:'follow', headers:{Accept:'application/json'}, signal:AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Apps Script: '+response.status);
    const data = await response.json();
    if (!Number.isSafeInteger(data.total) || data.total < 0) throw new Error('Respuesta no válida');
    return new Response(JSON.stringify({total:data.total}), { status:200, headers });
  } catch (e) {
    console.error('Error al obtener total de apoyos:', e.message);
    return new Response(JSON.stringify({error:'contador_no_disponible'}), {status:502, headers});
  }
}
