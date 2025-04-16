const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

const teacher = (req, res, next) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied. Teachers only.' });
    }
    next();
};

const student = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied. Students only.' });
    }
    next();
};

module.exports = { admin, teacher, student };
