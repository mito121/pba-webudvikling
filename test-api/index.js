const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const passport = require('passport')
const initializePassport = require('./config/passport-setup')
const session = require('express-session')
const flash = require('express-flash')

/* Passport */
initializePassport(
    passport
);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
})); // session secret
app.use(passport.initialize());
app.use(flash()); // use connect-flash for flash messages stored in session

const API_SERVICE_URL = "https://eark.atlassian.net"

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} -> ${req.originalUrl}`);

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-mac"
    );
    res.header("Access-Control-Expose-Headers", "x-mac, x-host");

    next();
});

/* Get issues */
app.get("/rest/api/2/search", createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
}));

/* Post issue */
app.post("/issue", async (req, res) => {
    axios({
        method: 'post',
        url: `${API_SERVICE_URL}/rest/api/2/issue`,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: req.headers.authorization
        },
        data: req.body
    }).then((response) => {
        res.send({ data: response.data })
    }).catch(e => {
        console.log("error", e)
        res.sendStatus(500)
    })
});


/* Oauth */
app.get('/auth/atlassian-oauth',
    passport.authenticate('atlassian-oauth'),
    (req, res) => {
        // The request will be redirected to the Atlassian app for authentication, so this
        // function will not be called.
        console.log("frol?")
    });

app.get('/auth/atlassian-oauth/callback',
    passport.authenticate('atlassian-oauth', { failureRedirect: '/login' }),
    function (req, res) {
        console.log("frol???")
        res.redirect('/');
    });


app.get('/login', passport.authenticate('atlassian-oauth', {
    failWithError: true,
    // scope: ['profile']
}))

app.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
})