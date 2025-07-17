import bcrypt from 'bcrypt';

const password = '123456';
const hash = await bcrypt.hash(password, 10);
console.log('Hash completo:', hash);
console.log('Tamanho:', hash.length);
