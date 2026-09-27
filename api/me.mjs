import {authenticatedName,noStore} from './_auth.mjs';
import {casablancaDate,shiftFor,PEOPLE,DAYS} from './_schedule.mjs';
export default function handler(req,res){
  noStore(res);if(req.method!=='GET') return res.status(405).json({error:'Méthode non autorisée'});
  try{
    const name=authenticatedName(req);if(!name) return res.status(401).json({error:'Connexion requise'});
    const today=casablancaDate();
    return res.status(200).json({name:PEOPLE[name],dayIndex:today.dayIndex,iso:today.iso,shift:shiftFor(name,today.dayIndex),week:DAYS.map((day,index)=>({day,shift:shiftFor(name,index)}))});
  }catch{return res.status(503).json({error:'Service indisponible'});}
}
