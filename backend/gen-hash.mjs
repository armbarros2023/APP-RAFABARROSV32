// Script para gerar hash bcrypt da senha
import bcrypt from 'bcrypt';

const password = '483220';
const hash = await bcrypt.hash(password, 10);

console.log('Hash da senha 483220:');
console.log(hash);
console.log('\nComando SQL para atualizar:');
console.log(`UPDATE users SET password = '${hash}' WHERE email = 'armbrros2023@gmail.com';`);
