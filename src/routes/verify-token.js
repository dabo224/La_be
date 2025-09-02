const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");

module.exports = (app) => {
  app.get("/api/verify-token", (req, res) => {
    try {
      const authHeader = req.headers.authorization || "";
      const tokenFromHeader = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      // cookie parsing (simple)
      let tokenFromCookie = null;
      const cookieHeader = req.headers.cookie || "";
      if (cookieHeader) {
        const cookieNames = [
          "token",
          "access_token",
          "id_token",
          "refresh_token",
        ];
        const cookies = cookieHeader.split(";").map((s) => s.trim());
        for (const name of cookieNames) {
          const match = cookies.find((c) => c.startsWith(name + "="));
          if (match) {
            tokenFromCookie = decodeURIComponent(match.split("=")[1]);
            break;
          }
        }
      }

      const token =
        tokenFromHeader ||
        req.query.token ||
        req.headers["x-access-token"] ||
        tokenFromCookie ||
        null;
      if (!token)
        return res.status(401).json({ ok: false, message: "token missing" });

      // Try verify with app secret first (HS256)
      try {
        const payload = jwt.verify(token, privateKey);
        return res.json({ ok: true, user: payload, method: "hs256" });
      } catch (e1) {
        // If a public key is available, attempt to verify with it (e.g. RS256)
        const pub = process.env.JWT_PUBLIC_KEY;
        if (pub) {
          try {
            const payload = jwt.verify(token, pub);
            return res.json({ ok: true, user: payload, method: "public-key" });
          } catch (e2) {
            // fall through to error handling
            err = e2 || e1;
          }
        } else {
          // no public key to try
          err = e1;
        }
      }
    } catch (err) {
      // Try to decode header to expose algorithm for debugging
      try {
        const parts = (token || "").split(".");
        if (parts.length === 3) {
          const header = JSON.parse(
            Buffer.from(parts[0], "base64").toString("utf8")
          );
          return res
            .status(401)
            .json({
              ok: false,
              message: "invalid token",
              error: err && err.message,
              header,
            });
        }
      } catch (e) {
        // ignore
      }
      return res
        .status(401)
        .json({
          ok: false,
          message: "invalid token",
          error: err && err.message,
        });
    }
  });
};
