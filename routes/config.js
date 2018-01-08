module.exports = {
    twitterAuth: {
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET,
        callbackURL: 'https://voting-app-sosmaniac.c9users.io/auth/twitter/callback'
    }
};