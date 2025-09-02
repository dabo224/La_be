const { Op, fn, col, where } = require("sequelize");
const { User, Post, Profil } = require("../db/sequelize");

module.exports = (app) => {
  // Search page (GET) - renders page with optional query
  app.get("/search", async (req, res) => {
    const q = (req.query.q || "").trim();
    if (!q) return res.render("search", { query: "", users: [], posts: [] });

    try {
      const qLower = q.toLowerCase();
      // case-insensitive substring match for users (prenom or nom)
      const users = await User.findAll({
        where: {
          [Op.or]: [
            where(fn("LOWER", col("prenom")), { [Op.like]: `%${qLower}%` }),
            where(fn("LOWER", col("nom")), { [Op.like]: `%${qLower}%` }),
          ],
        },
        include: [{ model: Profil }],
        limit: 50,
      });

      // posts where contenu contains q (case-insensitive)
      const posts = await Post.findAll({
        where: where(fn("LOWER", col("contenu")), { [Op.like]: `%${qLower}%` }),
        include: [{ model: User, include: [Profil] }],
        limit: 100,
        order: [["createdAt", "DESC"]],
      });

      res.render("search", { query: q, users, posts });
    } catch (err) {
      console.error("Search error", err);
      res.render("search", {
        query: q,
        users: [],
        posts: [],
        error: "Erreur serveur",
      });
    }
  });

  // API search (JSON) used by client-side typeahead
  app.get("/api/search", async (req, res) => {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ users: [], posts: [] });
    try {
      const qLower = q.toLowerCase();
      const users = await User.findAll({
        where: {
          [Op.or]: [
            where(fn("LOWER", col("prenom")), { [Op.like]: `%${qLower}%` }),
            where(fn("LOWER", col("nom")), { [Op.like]: `%${qLower}%` }),
          ],
        },
        include: [{ model: Profil }],
        limit: 20,
      });

      const posts = await Post.findAll({
        where: where(fn("LOWER", col("contenu")), { [Op.like]: `%${qLower}%` }),
        include: [{ model: User, include: [Profil] }],
        limit: 40,
        order: [["createdAt", "DESC"]],
      });

      res.json({ users, posts });
    } catch (err) {
      console.error("API search error", err);
      res.status(500).json({ error: "server error" });
    }
  });
};
