const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const hexToBytes=(hex)=>new Uint8Array(hex.match(/.{2}/g).map(x=>parseInt(x,16)));
const toHex=bytes=>Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
function validDoc(doc){
  const d=doc.replace(/[\s-]/g,'').toUpperCase();
  const letters='TRWAGMYFPDXBNJZSQVHLCKE';let n;
  if(/^\d{8}[A-Z]$/.test(d)){n=Number(d.slice(0,8));}
  else if(/^[XYZ]\d{7}[A-Z]$/.test(d)){n=Number(({X:'0',Y:'1',Z:'2'})[d[0]]+d.slice(1,8));}
  else return null;
  return letters[n%23]===d.slice(-1)?d:null;
}
export async function onRequestPost({request,env}){
 if(env.FIRMAS_ENABLED!=='true')return reply({error:'closed'},503);
 if(!env.DB||!env.TURNSTILE_SECRET||!env.DATA_ENCRYPTION_KEY||!env.DNI_HMAC_KEY)return reply({error:'not_configured'},503);
 if(request.headers.get('content-type')?.split(';')[0]!=='application/json')return reply({error:'invalid'},415);
 const size=Number(request.headers.get('content-length')||0);if(size>10000)return reply({error:'invalid'},413);
 let p;try{p=await request.json()}catch{return reply({error:'invalid'},400)};
 if(!p||typeof p!=='object')return reply({error:'invalid'},400);
 const nombre=String(p.nombre||'').trim(),apellidos=String(p.apellidos||'').trim(),email=String(p.email||'').trim().toLowerCase(),dni=validDoc(String(p.dni||''));
 if(!dni||nombre.length<2||nombre.length>80||apellidos.length<2||apellidos.length>120||email.length>254||(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||p.adhesion!==true||p.consentimiento!==true||!['es','ca','en'].includes(p.idioma)||typeof p.turnstileToken!=='string'||p.turnstileToken.length<10||p.turnstileToken.length>2048)return reply({error:'invalid'},400);
 const origin=request.headers.get('origin');if(origin&&origin!=='https://www.unimoscostablanca.com')return reply({error:'origin'},403);
 let check;try{
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:p.turnstileToken})});
  check=await r.json();
 }catch{return reply({error:'verification_unavailable'},503)}
 if(!check.success||check.hostname!=='www.unimoscostablanca.com'||check.action!=='firmar')return reply({error:'verification_failed'},400);
 try{
  if(!/^[a-f0-9]{64}$/i.test(env.DATA_ENCRYPTION_KEY)||!/^[a-f0-9]{64}$/i.test(env.DNI_HMAC_KEY))return reply({error:'not_configured'},503);
  const cryptoObj=globalThis.crypto;
  const hmacKey=await cryptoObj.subtle.importKey('raw',hexToBytes(env.DNI_HMAC_KEY),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const hash=toHex(new Uint8Array(await cryptoObj.subtle.sign('HMAC',hmacKey,new TextEncoder().encode(dni))));
  const aes=await cryptoObj.subtle.importKey('raw',hexToBytes(env.DATA_ENCRYPTION_KEY),'AES-GCM',false,['encrypt']);
  const iv=cryptoObj.getRandomValues(new Uint8Array(12));
  const data=new TextEncoder().encode(JSON.stringify({nombre,apellidos,dni,email}));
  const ciphertext=new Uint8Array(await cryptoObj.subtle.encrypt({name:'AES-GCM',iv},aes,data));
  const payload=JSON.stringify({iv:toHex(iv),ct:toHex(ciphertext),alg:'AES-256-GCM',v:1});
  await env.DB.prepare('INSERT INTO firmas (id,dni_hash,datos_cifrados,consentimiento,adhesion,version_privacidad,version_peticion,idioma) VALUES (?, ?, ?, 1, 1, ?, ?, ?)')
   .bind(cryptoObj.randomUUID(),hash,payload,'2026-10-28-v1','cruce-c243c-pk1-6-v1',p.idioma).run();
  return reply({ok:true},201);
 }catch(e){
  // Never log raw data, hash, token or credentials.
  if(String(e?.message||'').includes('UNIQUE constraint failed'))return reply({error:'duplicate'},409);
  return reply({error:'unavailable'},503);
 }
}
export const onRequestGet=()=>reply({error:'method_not_allowed'},405);
