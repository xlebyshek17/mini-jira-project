const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        let user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ msg: 'Użytkownik już istnije'});

        // haszowanie hasłą
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        await user.save();
        res.status(200).json({ msg: 'Użytkownik zerejestrowany pomyślnie' });
    } catch (err) {
        res.status(500).json({ 
            msg: 'Błąd serwera przy rejestracji',
            error: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: 'Nieprawidłowe imię użytkownika' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) 
            return res.status(400).json({ msg: 'Nieprawidłowe hasło' });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { 
                id: user._id, 
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (err) {
        res.status(500).json({ 
            msg: 'Błąd serwera przy logowaniu',
            error: err.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Użytkownik nie istnieje' });
        }

        user.firstName = firstName || user.firsName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.password = password || user.password;

        const updatedUser = await user.save();

        res.json({
                user: {
                    id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email
                }
            });
    } catch (err) {
        res.status(500).json({ 
            msg: 'Błąd serwera',
            error: err.message
        });
    }
};

