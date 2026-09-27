export const TIME_ZONE = 'Africa/Casablanca';
export const DAYS = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
export const PEOPLE = Object.freeze({nouhayla:'Nouhayla',kaoutar:'Kaoutar',abderahim:'Abderahim'});
export const SHIFTS = Object.freeze({
  nouhayla:['16:00 – Fin de service','Repos','08:00 – 16:00','08:00 – 16:00','16:00 – Fin de service','08:00 – 16:00','11:00 – 19:00'],
  kaoutar:['11:00 – 19:00','08:00 – 16:00','Repos','16:00 – Fin de service','08:00 – 16:00','16:00 – Fin de service','08:00 – 16:00'],
  abderahim:['08:00 – 16:00','16:00 – Fin de service','16:00 – Fin de service','11:00 – 19:00','Repos','11:00 – 19:00','16:00 – Fin de service']
});
export function casablancaDate(at=new Date()) {
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit',weekday:'short'}).formatToParts(at);
  const get=type=>parts.find(part=>part.type===type)?.value;
  const dayIndex={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[get('weekday')];
  return {dayIndex,iso:`${get('year')}-${get('month')}-${get('day')}`};
}
export function shiftFor(person, dayIndex) {
  if (!Object.hasOwn(SHIFTS,person) || !Number.isInteger(dayIndex) || dayIndex<0 || dayIndex>6) throw new Error('Profil ou jour invalide');
  return SHIFTS[person][dayIndex];
}
