import {clearCookie,noStore} from './_auth.mjs';
export default function handler(req,res){noStore(res);if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});res.setHeader('Set-Cookie',clearCookie());return res.status(200).json({ok:true});}
