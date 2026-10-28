// Historical figure is a manually reported 220 previous signatures, not a verified DB import.
const HISTORIC_TOTAL=220;
export async function onRequestGet({env}){
 try{
  if(!env.DB)throw Error('D1 binding unavailable');
  const r=await env.DB.prepare('SELECT COUNT(*) AS n FROM firmas WHERE consentimiento=1 AND adhesion=1').first();
  const n=Number(r?.n);
  if(!Number.isSafeInteger(n)||n<0)throw Error('Invalid count');
  return new Response(JSON.stringify({total:HISTORIC_TOTAL+n,previous:HISTORIC_TOTAL,new:n}),{headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }catch{
  return new Response(JSON.stringify({error:'contador_no_disponible'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 }
}
