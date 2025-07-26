import jwt from 'jsonwebtoken';

// User auth middleware
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        console.log("Received token:", token);

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", token_decode);

        // Attach to req safely
        req.userId = token_decode.id;

        next();

    } catch (error) {
        console.log("JWT Error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authUser;
