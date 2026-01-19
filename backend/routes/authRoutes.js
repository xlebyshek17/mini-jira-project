const express = require('express')
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');
const multer = require('multer');
const path = require('path');
const protect = require('../middleware/authMiddleware'); 
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', protect, updateProfile);

// Konfiguracja zapisu plików
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Trasa przesyłania awatara
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'Nie przesłano pliku' });

        const user = await User.findById(req.user._id); 
        user.avatarUrl = `/uploads/${req.file.filename}`; // Zapisujemy ścieżkę do pola avatarUrl
        await user.save();

        res.json({ 
            msg: 'Zdjęcie zaktualizowane',
            avatarUrl: user.avatarUrl 
        });
    } catch (err) {
        res.status(500).json({ 
            msg: 'Błąd serwera',
            error: err.message 
        });
    }
});

module.exports = router;