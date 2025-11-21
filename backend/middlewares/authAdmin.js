import jwt from 'jsonwebtoken';

// Admin auth middleware
const authAdmin = async (req, res, next) => {
  try {
    const atoken = req.headers.atoken;
    if (!atoken) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    next();

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
