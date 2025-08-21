module.exports = (app) =>{
    app.get('/profil/:userid', (req, res) => {
        res.render('sendProfil');
    });
}