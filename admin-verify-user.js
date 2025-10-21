/*
// admin-verify-user.js
// Executar: FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 node admin-verify-user.js
process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

const admin = require('firebase-admin');

// No emulator NÃO é necessário serviço JSON — basta informar projectId.
admin.initializeApp({
  projectId: 'arcadius-language-8e1fa' // qualquer projectId funciona no emulator
});

async function verifyEmailByAddress(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log('Encontrou usuário:', user.uid, user.email);

    await admin.auth().updateUser(user.uid, { emailVerified: true });
    console.log(`Email ${email} marcado como verificado.`);
  } catch (err) {
    console.error('Erro:', err.message || err);
  }
}

verifyEmailByAddress('teste321@email.com');
*/
