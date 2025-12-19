import bcrypt from 'bcryptjs';

const password = '483220';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
