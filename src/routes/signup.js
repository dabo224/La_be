
module.exports = (app) =>{
    app.get('/inscription', (req, res) => {
        res.render('inscription');
    });
}