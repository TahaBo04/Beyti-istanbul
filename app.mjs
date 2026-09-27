const $=id=>document.getElementById(id);
const error=$('login-error');
const showLogin=()=>{$('dashboard-view').hidden=true;$('login-view').hidden=false;};
const showError=text=>{error.textContent=text;error.hidden=false;};
async function request(path,options={}){
  const response=await fetch(`/api/${path}`,{credentials:'same-origin',cache:'no-store',...options});
  let data={};try{data=await response.json();}catch{}
  if(!response.ok) throw Object.assign(new Error(data.error||'Service indisponible'),{status:response.status});
  return data;
}
function render(data){
  const date=new Date(`${data.iso}T12:00:00Z`);
  const dateText=new Intl.DateTimeFormat('fr-MA',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date);
  $('top-date').textContent=`${data.week[data.dayIndex].day} ${dateText}`;
  $('first-name').textContent=data.name;
  $('today-label').textContent=data.week[data.dayIndex].day;
  $('today-date').textContent=dateText;
  const shift=$('today-shift');shift.textContent=data.shift;shift.classList.toggle('rest',data.shift==='Repos');
  const grid=$('week-grid');grid.replaceChildren();
  for(let offset=0;offset<7;offset++){
    const index=(offset+1)%7;const item=data.week[index];
    const card=document.createElement('article');card.className='day-card'+(index===data.dayIndex?' current':'');
    const day=document.createElement('strong');day.textContent=item.day;
    const subtitle=document.createElement('span');subtitle.className='mini-date';subtitle.textContent=index===data.dayIndex?'Aujourd’hui':'Service';
    const hours=document.createElement('span');hours.className='mini-shift'+(item.shift==='Repos'?' rest':'');hours.textContent=item.shift;
    card.append(day,subtitle,hours);grid.append(card);
  }
  $('login-view').hidden=true;$('dashboard-view').hidden=false;
}
async function refresh(){
  try{render(await request('me'));}
  catch(e){showLogin();if(e.status!==401)showError('Le planning est momentanément indisponible.');}
}
$('login-form').addEventListener('submit',async event=>{
  event.preventDefault();error.hidden=true;
  const button=$('login-button');button.disabled=true;button.textContent='Connexion…';
  try{
    await request('login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:$('username').value,password:$('password').value})});
    $('password').value='';await refresh();
  }catch(e){showError(e.status===401?'Identifiants incorrects.':e.message||'Connexion indisponible.');}
  finally{button.disabled=false;button.textContent='Se connecter';}
});
$('logout-button').addEventListener('click',async()=>{try{await request('logout',{method:'POST'});}finally{showLogin();}});
await refresh();
document.addEventListener('visibilitychange',()=>{if(!document.hidden&& !$('dashboard-view').hidden)refresh();});
setInterval(()=>{if(!$('dashboard-view').hidden)refresh();},60000);
