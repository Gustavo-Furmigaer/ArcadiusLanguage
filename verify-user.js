/*
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Substitua pelo UID do usuário que você quer marcar como verificado
const uid = 'rpjJCWJapGUBzh0YejIpDBL7dZY2';

admin.auth().updateUser(uid, { emailVerified: true })
  .then(userRecord => {
    console.log('Usuário atualizado:', userRecord.toJSON());
  })
  .catch(error => {
    console.error('Erro ao atualizar usuário:', error);
  });
*/

  
