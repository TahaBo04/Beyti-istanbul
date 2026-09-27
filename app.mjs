import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from './config.mjs';
import {DAYS,PEOPLE,casablancaDate,shiftFor,TIME_ZONE} from './schedule.mjs';
const $=id=>document.getElementById(id);
const today=casablancaDate();
const dateFormatter=new Intl.DateTimeFormat('fr-MA',{timeZone:TIME_ZONE,day:'numeric',month:'long',year:'numeric'});
const weekdayFormatter=new Intl.DateTimeFormat('fr-MA',{timeZone:TIME_ZONE,weekday:'long'});
$('top-date').textContent=`${DAYS[today.dayIndex]} ${dateFormatter.format(new Date())}`;

if (SUPABASE_URL.includes('YOUR_PROJECT_REF') || SUPABASE_PUBLISHABLE_KEY==='YOUR_PUBLISHABLE_KEY') {
  $('setup-view').hidden=false;
} else {
  // Pinned release. The browser receives only the public publishable key.
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.57.0');
  const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  const login=$('login-view'),dashboard=$('dashboard-view'),error=$('login-error');
  function showError(message){error.textContent=message;error.hidden=false;}
  function showLogin(){dashboard.hidden=true;login.hidden=false;}
  async function showDashboard(){
    // getUser verifies the current user with the Auth server; profile access is RLS-scoped to auth.uid().
    const {data:{user},error:userError}=await supabase.auth.getUser();
    if(userError||!user){showLogin();return;}
    const {data:profile,error:profileError}=await supabase.from('team_profiles').select('person').eq('user_id',user.id).single();
    if(profileError||!profile||!Object.hasOwn(PEOPLE,profile.person)){
      await supabase.auth.signOut();showLogin();showError('Compte non attribué. Contactez le responsable.');return;
    }
    const person=profile.person;
    $('first-name').textContent=PEOPLE[person];
    $('today-label').textContent=weekdayFormatter.format(new Date());
    $('today-date').textContent=dateFormatter.format(new Date());
    const currentShift=shiftFor(person,today.dayIndex);
    const shift=$('today-shift');shift.textContent=currentShift;shift.classList.toggle('rest',currentShift==='Repos');
    const grid=$('week-grid');grid.replaceChildren();
    for(let offset=0;offset<7;offset++){
      const dayIndex=(offset+1)%7;
      const label=DAYS[dayIndex];const value=shiftFor(person,dayIndex);
      const card=document.createElement('article');card.className='day-card'+(today.dayIndex===dayIndex?' current':'');
      const name=document.createElement('strong');name.textContent=label;
      const subtitle=document.createElement('span');subtitle.className='mini-date';subtitle.textContent=today.dayIndex===dayIndex?"Aujourd’hui":"Service";
      const hours=document.createElement('span');hours.className='mini-shift'+(value==='Repos'?' rest':'');hours.textContent=value;
      card.append(name,subtitle,hours);grid.append(card);
    }
    login.hidden=true;dashboard.hidden=false;
  }
  $('login-form').addEventListener('submit',async event=>{
    event.preventDefault();error.hidden=true;
    const button=$('login-button');button.disabled=true;button.textContent='Connexion…';
    const email=$('email').value.trim();const password=$('password').value;
    try{
      const {error:authError}=await supabase.auth.signInWithPassword({email,password});
      if(authError)showError('Identifiants incorrects ou compte non confirmé.');
      else { $('password').value='';await showDashboard(); }
    }catch{showError('Connexion indisponible. Vérifiez votre réseau et réessayez.');}
    finally{button.disabled=false;button.textContent='Se connecter';}
  });
  $('logout-button').addEventListener('click',async()=>{await supabase.auth.signOut();showLogin();});
  try{await showDashboard();}catch{showLogin();showError('Impossible de charger votre planning. Réessayez plus tard.');}
  // Reload at the next local day boundary or upon returning to the tab.
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&casablancaDate().iso!==today.iso)location.reload();});
  setInterval(()=>{if(casablancaDate().iso!==today.iso)location.reload();},60000);
}
