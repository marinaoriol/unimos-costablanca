export async function onRequestGet({env}){
 const enabled=env.FIRMAS_ENABLED==='true'&&Boolean(env.DB&&env.TURNSTILE_SECRET&&env.DATA_ENCRYPTION_KEY&&env.DNI_HMAC_KEY);
 return new Response(JSON.stringify({enabled}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
}
