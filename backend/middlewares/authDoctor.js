import jwt from 'jsonwebtoken';

// doctor auth middleware
const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers;

       

        if (!dtoken) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
        }

        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
        

        //  Attach to req safely
        req.docId = token_decode.id;

        next();

    } catch (error) {
        console.log(" JWT Error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authDoctor
