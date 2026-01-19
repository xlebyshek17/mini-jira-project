const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const path = require('path');

// Ładowanie zmiennych z pliku .env
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks/', taskRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Połączenie z MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Sukces: Połączono z MongoDB Atlas!'))
  .catch((err) => {
    console.error('Błąd połączenia z bazą danych:');
    console.error(err.message);
    process.exit(1); 
  });

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});