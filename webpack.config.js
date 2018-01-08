const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'public/static');
const APP_DIR = path.resolve(__dirname, 'public/static');

module.exports = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                include: APP_DIR,
                loader: 'babel-loader'
            }
        ]
    }
};

// production, development