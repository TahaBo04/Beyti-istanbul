import {PEOPLE, DAYS, SHIFTS, casablancaDate, shiftFor} from './schedule.mjs';

const $ = id => document.getElementById(id);
let selectedPerson = null;

function showPeople() {
  selectedPerson = null;
  $('dashboard-view').hidden = true;
  $('people-view').hidden = false;
}

function render(person) {
  const {dayIndex, iso} = casablancaDate();
  const date = new Date(`${iso}T12:00:00Z`);
  const dateText = new Intl.DateTimeFormat('fr-MA', {day:'numeric', month:'long', year:'numeric', timeZone:'UTC'}).format(date);
  $('top-date').textContent = `${DAYS[dayIndex]} ${dateText}`;
  $('first-name').textContent = PEOPLE[person];
  $('today-label').textContent = DAYS[dayIndex];
  $('today-date').textContent = dateText;
  const todayShift = shiftFor(person, dayIndex);
  const shift = $('today-shift');
  shift.textContent = todayShift;
  shift.classList.toggle('rest', todayShift === 'Repos');
  const grid = $('week-grid');
  grid.replaceChildren();
  for (let offset = 0; offset < 7; offset++) {
    const index = (offset + 1) % 7;
    const card = document.createElement('article');
    card.className = 'day-card' + (index === dayIndex ? ' current' : '');
    const day = document.createElement('strong');
    day.textContent = DAYS[index];
    const subtitle = document.createElement('span');
    subtitle.className = 'mini-date';
    subtitle.textContent = index === dayIndex ? 'Aujourd’hui' : 'Service';
    const hours = document.createElement('span');
    hours.className = 'mini-shift' + (SHIFTS[person][index] === 'Repos' ? ' rest' : '');
    hours.textContent = SHIFTS[person][index];
    card.append(day, subtitle, hours);
    grid.append(card);
  }
  $('people-view').hidden = true;
  $('dashboard-view').hidden = false;
}

document.querySelectorAll('[data-person]').forEach(button => {
  button.addEventListener('click', () => {
    selectedPerson = button.dataset.person;
    render(selectedPerson);
  });
});
$('back-button').addEventListener('click', showPeople);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && selectedPerson) render(selectedPerson);
});
setInterval(() => { if (selectedPerson) render(selectedPerson); }, 60000);
