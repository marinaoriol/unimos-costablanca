export async function onRequestGet({env}){
 const enabled=env.FIRMAS_ENABLED==='true'&&Boolean(env.DB&&env.TURNSTILE_SECRET&&env.DATA_ENCRYPTION_KEY&&env.DNI_HMAC_KEY);
 return new Response(JSON.stringify({enabled,siteKey:env.TURNSTILE_SITE_KEY||"0x4AAAAAAFpabUekpw5zgo_B"}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
}
