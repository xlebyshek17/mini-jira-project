const jwt = require('jsonwebtoken');

// sprawdzamy, czy użytkownik jest zalogowany (ma ważny token)
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startWith('Bearer')) {
        try {
            // pobieramy token (ucinamy słowo 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // weryfikacja tokenu (zwraca objekt, który podczas logowaniu został zaszyty w środku tokena)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //dodajemy dane użytkownika (id i role) do req
            req.user = decoded;

            next(); // jak wszystko ok, idzeny do kolejnej funckcji
        } catch(err) {
            res.status(401).json({ msg: 'Brak autoryzacji, błędny token' });
        }

        if (!token) {
            res.status(401).json({ msg: 'Brak autoryzacji, brak tokena' });
        }
    }
}

// sprawdzamy, czy użytkownik jest adminem
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Brak uprawnień - wymagane konto administratora' });
    }
};

module.exports = { protect, admin };