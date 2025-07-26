import jwt from 'jsonwebtoken';

// Admin auth middleware
const authAdmin = async (req, res, next) => {
  try {
    const atoken = req.headers.atoken;

    console.log("👉 Received atoken:", atoken);

    if (!atoken) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", token_decode);

    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      console.log("❌ Mismatch! Email did not match.");
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    console.log("✅ Token is valid! Continuing...");
    next();

  } catch (error) {
    console.log("❌ JWT Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
