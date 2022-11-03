const AtlassianStrategy = require('passport-atlassian-oauth').Strategy
function initialize(passport) {
    passport.use(new AtlassianStrategy({
        /* Options */
        // applicationURL: "https://eark.atlassian.net/",
        applicationURL: "http://localhost:3000/auth/atlassian-oauth",
        // applicationURL: "http://127.0.0.1:5173",
        callbackURL: "http://localhost:3000/auth/atlassian-oauth/callback",
        consumerKey: "OauthKey",
        consumerSecret:
            `-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDYB+rGZJGfg5Z5Kh2wM36e8nrNBlPbuJ05zbeiRszWuUjHyyLk
lGSjyqswVTYDK4cMlOnsZsil1zHT2SLCetx3BA5ttAQCL+MaQOvy3i0gBg1XrZYJ
BgB4y6K6eP/67+Hh2EnGuFb4dHADddIDKE/j0COTTOFpG/xRpm9pFP3qPwIDAQAB
AoGBAJqrgHIuyvxUMEXr23muRLf0j+t+3kdwNFGQciujWUFbQzqYvBDAFhYXIt3m
BFfcsEJX0+vH41ypaClvSy3G3VSfmO652Fa4HMXMOKR3N2C60jZ12Jm5cZ9fyLw9
ZFt/kVOqHFssnLA2QPCEfMsSZtN4T5JrxFSfIZbJqQPHTRlxAkEA+fbslOKETd/G
NKemuKKCIwl0MS3uMfaJjo7SHOA4p8wbGfmkacaz4Zv8EUvendlHrv8HhWR+UqcZ
r5lZYw/n6wJBAN0/Pj1I959d8JUFYznImHwA2+x/PXClv9+/yf3osYhRYWBlS7Yr
z12VacailMLum1k5LRR6HFbsGzzbmLvSZf0CQQDYTh0cGYhz+xkBp7JWRAppV1z8
0co14inW+zBHXKCqU62AJM9p2VEAAoN2VDkoT0YA4SAZBoVp8MABfKolVzZRAkBe
gjR5A2Fbf0pUre978HdKiSdot9Wr9/Glh4ymXK7xdynsfnjAAajb5gZAJpT7S+eq
TmU2WQ8gBk2ASqHMoYyVAkEAs6l5VsiOyY7LD0HhcIzq1JKMebY1JxvL4ZoWf18n
BehKuLCiYeoLBm+XDV1M6gN9k1/ZbzuMiVIsfS2kZ3m/qA==
-----END RSA PRIVATE KEY-----`,
    }, (token, tokenSecret, profile, done) => {
        User.findOrCreate({ userid: profile.id }, function (err, user) {
            return done(err, user);
        })
    }))
}

module.exports = initialize;





