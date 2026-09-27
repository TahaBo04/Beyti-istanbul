import {createHmac, scryptSync, timingSafeEqual} from 'node:crypto';

const PEOPLE=['nouhayla','kaoutar','abderahim'];
const COOKIE='beyti_session';
const MAX_AGE=60*60*24*7;
export function readUsers(){
  const raw=process.env.BEYTI_USERS;
  if(!raw) throw new Error('Accounts are not configured');
  const users=JSON.parse(raw);
  if(!PEOPLE.every(name=>typeof users[name]==='string'&&users[name].startsWith('scrypt:'))) throw new Error('Accounts are incomplete');
  return users;
}
function secret(){
  const value=process.env.BEYTI_SESSION_SECRET;
  if(!value||value.length<32) throw new Error('Session signing is not configured');
  return value;
}
export function verifyPassword(password,stored){
  const [scheme,salt,hex]=stored.split(':');
  if(scheme!=='scrypt'||!/^[a-f0-9]{32}$/.test(salt)||!/^[a-f0-9]{128}$/.test(hex)) return false;
  const actual=scryptSync(password,salt,64);
  return timingSafeEqual(actual,Buffer.from(hex,'hex'));
}
const sign=value=>createHmac('sha256',secret()).update(value).digest('hex');
export function makeCookie(name){
  const payload=Buffer.from(JSON.stringify({name,exp:Math.floor(Date.now()/1000)+MAX_AGE})).toString('base64url');
  return `${COOKIE}=${payload}.${sign(payload)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`;
}
export function clearCookie(){return `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;}
export function authenticatedName(req){
  const raw=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1);
  if(!raw) return null;
  const [payload,signature]=raw.split('.');
  if(!payload||!/^[a-f0-9]{64}$/.test(signature||'')) return null;
  const expected=Buffer.from(sign(payload),'hex');
  if(!timingSafeEqual(expected,Buffer.from(signature,'hex'))) return null;
  try{const {name,exp}=JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));
    return PEOPLE.includes(name)&&Number.isInteger(exp)&&exp>Date.now()/1000?name:null;
  }catch{return null;}
}
export function noStore(res){res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');}
