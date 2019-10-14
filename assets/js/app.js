// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//

import "phoenix_html"

// Import local files

import gameInit from './game'

// import socket from "./socket"

(() => {
    let game = document.getElementById("game-root")
    if(game) {
        gameInit(game)
    }
})()
