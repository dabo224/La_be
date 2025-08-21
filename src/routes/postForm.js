module.exports = (app) =>{
    app.get('/post/:userid', (req, res) => {
        res.render('sendPost');
    });
}