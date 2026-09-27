import test from 'node:test';
import assert from 'node:assert/strict';
import {casablancaDate,shiftFor,SHIFTS} from '../api/_schedule.mjs';

test('Saturday and Sunday swaps for all three people',()=>{
  assert.equal(shiftFor('nouhayla',6),'11:00 – 19:00');
  assert.equal(shiftFor('kaoutar',6),'08:00 – 16:00');
  assert.equal(shiftFor('abderahim',6),'16:00 – Fin de service');
  assert.equal(shiftFor('nouhayla',0),'16:00 – Fin de service');
  assert.equal(shiftFor('kaoutar',0),'11:00 – 19:00');
  assert.equal(shiftFor('abderahim',0),'08:00 – 16:00');
});
test('one rest day and six shifts per person',()=>{
  for(const shifts of Object.values(SHIFTS)){assert.equal(shifts.length,7);assert.equal(shifts.filter(x=>x==='Repos').length,1);}
});
test('Casablanca local day at UTC midnight',()=>{
  assert.equal(casablancaDate(new Date('2026-09-27T17:40:00Z')).dayIndex,0);
  assert.equal(casablancaDate(new Date('2026-09-28T00:30:00Z')).dayIndex,1);
});
test('unknown identities are rejected',()=>assert.throws(()=>shiftFor('other',0)));
