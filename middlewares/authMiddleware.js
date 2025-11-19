const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({success: false, msg: "No token, authorization denied"});
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.jwt_secret);

        req.user = {userId: payload.userId, firstname: payload.firstname, lastname: payload.lastname, role: payload.role};
        next()
    } catch (error) {
        res.status(401).json({success: false, msg: "Token is not valid"});
    }

};



module.exports = verifyToken;