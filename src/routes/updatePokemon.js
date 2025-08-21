const { ValidationError, UniqueConstraintError } = require('sequelize') // Importation des erreurs spécifiques de Sequelize
const { Pokemon } = require('../db/sequelize') // Importation du modèle Pokemon depuis la base de données Sequelize

module.exports = (app) => { // Exportation d'une fonction qui prend l'application Express en paramètre et définit une route
  app.put('/api/pokemons/:id', (req, res) => { // Définition d'une route PUT pour modifier un Pokémon par son identifiant
    const id = req.params.id // Récupération de l'identifiant du Pokémon depuis les paramètres de la requête
    
    Pokemon.update(req.body, { // Mise à jour des informations du Pokémon avec les données envoyées dans le corps de la requête
      where: { id: id } // Condition pour mettre à jour uniquement le Pokémon correspondant à l'identifiant fourni
    })
    .then(_ => { // Une fois la mise à jour effectuée
      return Pokemon.findByPk(id).then(pokemon => { // Recherche du Pokémon mis à jour pour renvoyer les nouvelles informations
        if (pokemon === null) { // Vérification si le Pokémon existe
          const message = `Le Pokémon demandé n'existe pas. Réessayez avec un autre identifiant.` // Message d'erreur si l'identifiant est incorrect
          return res.status(404).json({ message }) // Retour d'une réponse JSON avec un code 404 (Non trouvé)
        }
        
        const message = `Le Pokémon ${pokemon.name} a bien été modifié.` // Message de confirmation de la mise à jour
        res.json({ message, data: pokemon }) // Retour d'une réponse JSON contenant le message et les nouvelles données du Pokémon
      })
    })
    .catch(error => { // Gestion des erreurs éventuelles lors de la mise à jour
      if (error instanceof ValidationError) { // Vérification si l'erreur est une erreur de validation Sequelize
        return res.status(400).json({ message: error.message, data: error }) // Retour d'une réponse JSON avec un code 400 (Mauvaise requête)
      }
      if (error instanceof UniqueConstraintError) { // Vérification si l'erreur est une violation de contrainte d'unicité
        return res.status(400).json({ message: error.message, data: error }) // Retour d'une réponse JSON avec un code 400 (Mauvaise requête)
      }

      const message = `Le Pokémon n'a pas pu être modifié. Réessayez dans quelques instants.` // Message d'erreur générique en cas d'échec
      res.status(500).json({ message, data: error }) // Retour d'une réponse JSON avec un code 500 (Erreur serveur) et les détails de l'erreur
    })
  })
}
