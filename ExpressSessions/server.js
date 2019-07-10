const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }));
app.use(session({ secret: 'helloworld',saveUninitialized:false, resave: false }));

app.get('/', (req, res) => {
    if(req.session.user){
        res.send('<h1>Dashboard</h1><a href="/logout">Logout</a>');
    }
    else {
        res.redirect('/login');
    }

});

app.get('/logout', (req, res) => {
    // res.json({session: req.session, id: req.sessionID});
    req.session.destroy();
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.send(`
    <form method='post' action='/login/submit'>
    <input name='username'/>
    <input type='password' name='password'/>
    <input type='submit' />
    </form>`)
});

app.use('/login/submit', (req, res) => {
    const {username, password} = req.body;
    console.log(req.body);
    console.log(req.session);
    if(username=='sameer' && password=='admin'){
        req.session.user = {username, password};
        res.redirect('/');
    }else {
        res.send('<h1>Error: Invalid Credentials</h1><a href="/login">Login</a> ')
    };
});

app.listen(3000, (err) => {
    console.log(err?err:'');
});