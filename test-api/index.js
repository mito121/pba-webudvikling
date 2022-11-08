if (process.env.NODE_ENV !== "production") {
    /* Get .env varibales */
    require("dotenv").config();
}


const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");

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

app.post('/project/create', (req, res) => {
    console.log("create gfrol")
})

/* OAuth */
/* https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/ */
app.get('/auth/callback', (req, res) => {
    axios({
        method: 'post',
        url: 'https://auth.atlassian.com/oauth/token',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: {
            'grant_type': 'authorization_code',
            'client_id': process.env.JIRA_CLIENT_ID,
            'client_secret': process.env.JIRA_CLIENT_SECRET,
            'code': req.query.code,
            'redirect_uri': 'http://localhost:3000/auth/callback'
        },
    }).then((response) => {
        console.log("res", response.data)
        const access_token = response.data.access_token
        /* Get cloudids */
        axios({
            method: "get",
            url: "https://api.atlassian.com/oauth/token/accessible-resources",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            }
        }).then((cloudidRes) => {
            const resultObj = {
                data: cloudidRes.data,
                token: access_token
            }
            const encodedData = encodeURIComponent(JSON.stringify(resultObj))
            res.redirect(`http://127.0.0.1:5173?q=${encodedData}`)
        }).catch(e => {
            console.log("error", e)
            res.sendStatus(500)
        })
    }).catch(e => {
        console.log("error", e)
        res.sendStatus(500)
    })
})

app.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
})