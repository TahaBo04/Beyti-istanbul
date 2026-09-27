import {randomBytes,scryptSync} from 'node:crypto';
const people=['nouhayla','kaoutar','abderahim'];const users={};const passwords={};
for(const person of people){const password=randomBytes(18).toString('base64url');const salt=randomBytes(16).toString('hex');users[person]=`scrypt:${salt}:${scryptSync(password,salt,64).toString('hex')}`;passwords[person]=password;}
console.log(JSON.stringify({passwords,BEYTI_USERS:JSON.stringify(users),BEYTI_SESSION_SECRET:randomBytes(32).toString('hex')},null,2));
