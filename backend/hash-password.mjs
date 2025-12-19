import { hashPassword } from './src/utils/bcrypt.js';

const password = '483220';
const hash = await hashPassword(password);
console.log('Hash da senha 483220:');
console.log(hash);
