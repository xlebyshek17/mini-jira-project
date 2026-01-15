const jwt = require('jsonwebtoken');
const User = required('../models/User');

// sprawdzamy, czy użytkownik jest zalogowany (ma ważny token)
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startWith('Bearer')) {
        try {
            // pobieramy token (ucinamy słowo 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // weryfikacja tokenu (zwraca objekt, który podczas logowaniu został zaszyty w środku tokena)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //dodajemy dane użytkownika do req
            req.user = req.user = await User.findById(decoded.id).select('-password');

            return next(); // jak wszystko ok, idzemy do kolejnej funckcji
        } catch(err) {
            return res.status(401).json({ msg: 'Brak autoryzacji, błędny token' });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: 'Brak autoryzacji, brak tokena' });
    }
}

module.exports = protect;