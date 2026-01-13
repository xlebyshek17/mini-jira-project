const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        let user = await User.findOne({ username });
        if (user)
            return res.status(400).json({ msg: 'Użytkownik już istnije'});

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();
        res.status(200).json({ msg: 'Użytkownik zerejestrowany pomyślnie' });
    } catch (err) {
        res.status(500).send('Błąd serwera przy rejestracji');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ msg: 'Nieprawidłowe imię użytkownika' });

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) 
            return res.status(400).json({ msg: 'Nieprawidłowe hasło' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            proccess.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (err) {
        res.status(500).send('Błąd serwera przy logowaniu');
    }
};

