const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Initialisation de Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./quizjson.json')),
});

// Fonction pour obtenir les utilisateurs
const listUsers = async (req, res) => {
  const users = [];
  let nextPageToken;

  try {
    do {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      console.log('Nombre d’utilisateurs récupérés:', result.users.length);
      users.push(...result.users);
      nextPageToken = result.pageToken;
    } while (nextPageToken);

    console.log('Liste complète des utilisateurs:', users.map(u => u.email));
    res.json({ users });
  } catch (error) {
    console.error('Erreur listUsers:', error);
    res.status(500).json({ error: error.message });
  }
};

// Route pour récupérer la liste des utilisateurs
app.get('/api/users', listUsers);

// Démarrer le serveur
const PORT = 3001;  // Assure-toi que le front appelle http://localhost:3001
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
