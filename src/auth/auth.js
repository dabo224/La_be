/* Authentification : Créer un modèle User avec Sequelize */
// Importation de la bibliothèque 'jsonwebtoken' pour manipuler les jetons JWT (JSON Web Tokens)
const jwt = require('jsonwebtoken')
// Importation de la clé privée pour vérifier les jetons JWT, stockée dans un fichier séparé
const privateKey = require('../auth/private_key')

// Exportation d'une fonction middleware qui gère l'authentification des requêtes HTTP
module.exports = (req, res, next) => {
  // Récupération de l'en-tête d'autorisation de la requête HTTP
  const authorizationHeader = req.headers.authorization
  
  // Si l'en-tête d'autorisation n'est pas présent dans la requête, on retourne une erreur 401
  if(!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
    return res.status(401).json({ message }) // Retourne un message d'erreur avec le code de statut 401
  }
    
  // Extraction du token JWT à partir de l'en-tête d'autorisation, qui doit être au format "Bearer <token>"
  const token = authorizationHeader.split(' ')[1]
  
  // Vérification du jeton en utilisant la clé privée pour décoder le token
  const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
    // Si le jeton est invalide ou expiré, une erreur 401 est renvoyée
    if(error) {
      const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`
      return res.status(401).json({ message, data: error }) // Retourne une erreur d'autorisation
    }
    
    // Récupération de l'ID utilisateur depuis le token décodé
    const userId = decodedToken.userId
    
    // Vérification si l'ID utilisateur dans le corps de la requête correspond à l'ID de l'utilisateur du jeton
    if (req.body.userId && req.body.userId !== userId) {
      const message = `L'identifiant de l'utilisateur est invalide.`
      res.status(401).json({ message }) // Retourne une erreur si l'ID ne correspond pas
    } else {
      // Si tout est valide, on passe au middleware suivant
      next() // Passe à la fonction suivante dans le pipeline de traitement des requêtes
    }
  })
}
