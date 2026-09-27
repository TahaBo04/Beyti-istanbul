import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes,scryptSync} from 'node:crypto';
import {verifyPassword,makeCookie,authenticatedName,clearCookie} from '../api/_auth.mjs';
const salt=randomBytes(16).toString('hex');
const encoded=`scrypt:${salt}:${scryptSync('test-password',salt,64).toString('hex')}`;
test('password checks use the stored hash',()=>{assert.equal(verifyPassword('test-password',encoded),true);assert.equal(verifyPassword('wrong',encoded),false);});
test('signed session accepts owner, rejects tampering',()=>{
  process.env.BEYTI_SESSION_SECRET='test-secret-of-at-least-32-characters-long';
  const cookie=makeCookie('nouhayla').split(';')[0];
  assert.equal(authenticatedName({headers:{cookie}}),'nouhayla');
  assert.equal(authenticatedName({headers:{cookie:cookie.replace('=', '=x')}}),null);
  const tampered=cookie.slice(0,-1)+(cookie.endsWith('0')?'1':'0');
  assert.equal(authenticatedName({headers:{cookie:tampered}}),null);
  assert.match(clearCookie(),/Max-Age=0/);
});
