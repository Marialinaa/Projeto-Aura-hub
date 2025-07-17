import bcrypt from 'bcrypt';

async function generateHash() {
  try {
    const password = '123456';
    const hash = await bcrypt.hash(password, 10);
    console.log('Hash da senha "123456":', hash);
    console.log('\nComandos para atualizar o banco:');
    console.log(`mysql -u root -p9728 -e "USE projeto_ufla; UPDATE usuarios SET password = '${hash}' WHERE email = 'admin@sistema.com';"`);
  } catch (error) {
    console.error('Erro:', error);
  }
}

generateHash();
