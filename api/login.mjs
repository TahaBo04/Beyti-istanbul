import {readUsers,verifyPassword,makeCookie,noStore} from './_auth.mjs';
export default function handler(req,res){
  noStore(res);if(req.method!=='POST') return res.status(405).json({error:'Méthode non autorisée'});
  const name=String(req.body?.username||'').trim().toLowerCase();
  const password=req.body?.password;
  if(typeof password!=='string'||password.length>256||!['nouhayla','kaoutar','abderahim'].includes(name)) return res.status(401).json({error:'Identifiants incorrects'});
  try{
    const users=readUsers();
    if(!verifyPassword(password,users[name])) return res.status(401).json({error:'Identifiants incorrects'});
    res.setHeader('Set-Cookie',makeCookie(name));return res.status(200).json({ok:true});
  }catch{return res.status(503).json({error:'Connexion non configurée'});}
}
