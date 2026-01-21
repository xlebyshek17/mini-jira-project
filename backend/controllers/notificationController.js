const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('sender', 'firstName lastName avatarUrl')
            .populate('project', 'name')
            .populate('task', 'title')
            .sort({ createdAt: -1 }) // Najnowsze na górze
            .limit(20);

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ msg: 'Błąd podczas pobierania powiadomień', error: err.message });
    }
};

// Oznacz powiadomienie jako przeczytane
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.notificationId, { isRead: true });
        res.json({ msg: 'Powiadomienie oznaczone jako przeczytane' });
    } catch (err) {
        res.status(500).json({ msg: 'Błąd serwera', error: err.message });
    }
};