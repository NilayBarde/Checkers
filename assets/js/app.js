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
import indexInit from './index'

import socket from "./socket"


(() => {
    let game = document.getElementById("game-root")
    let index = document.getElementById("index-root")
    if(game) {
        let gameName = window.gameName
        let gameChannel = socket.channel("game:" + gameName)
        gameInit(game, gameName, gameChannel)
    }

    if(index) {
        let channel = socket.channel("game:index") 
        indexInit(index, channel)
    }
})()
