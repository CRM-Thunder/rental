const jwt=require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is invalid.' });
        req.user = user;
        next();
    });
};

module.exports=authenticateToken;