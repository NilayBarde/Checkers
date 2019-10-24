import React from 'react'
import ReactDom from 'react-dom'

import '../css/index'

export default function initIndex(root, channel) {
    ReactDom.render(<Index channel={channel}/>, root)
}

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.channel = props.channel
        this.channel.join().receive("ok", resp => console.log(resp))

        // this.channel.push("get_games").receive("ok", resp => this.updateState(resp.games))
        
        this.channel.on("update", (resp) => console.log(resp))
        this.state = {
            games: []
        }
    }

    updateState(gamesObj) {
        let games = Object.keys(gamesObj).filter(game => {
            if(game !== "index")
                return game
        })
        games = games.map(game => {
            return {
                name: game
            }
        })
        this.setState({games})
    }

    activeGames() {
        
        return this.state.games.map((game, index) => {
            return (
                <div className="row game-row" key={index}>
                    <div className="column">{game.name}</div>
                    <div className="column">Player 1</div>
                    <div className="column">Player 2</div>
                    <a className="column join-btn" href={"/game/" + game.name}>Join</a>
                </div>
            )
        })
    }

    createGame() {
        let gameName = document.getElementById("gameName").value
        let playerName = document.getElementById("playerName").value
        if(gameName !== "" && playerName !== "") {
            console.log(gameName, playerName)
        }
    }
    render() {
        return (
            <div className="container">
                <h2 className="page-title">Checkers Game</h2>
                <div className="row">
                    <input type="text" id="gameName" placeholder="Game name"/>
                    <button id="newGameBtn" onClick={() => {this.createGame()}}>Join / Create</button>
                </div>
                <div className="row">
                    <div className="column" id="pendingGames">
                        <h4>Pending Games</h4>
                        <h5>You can join one of these and start to play</h5>
                    </div>

                    <div className="column" id="activeGames">
                        <h4>Active Games</h4>
                        <h5>You can join and observe the ongoing games</h5>
                        <div className="row game-row">
                            <div className="column">Game Name</div>
                            <div className="column">Player 1</div>
                            <div className="column">Player 2</div>
                            <div className="column">Actions</div>
                        </div>    
                        <div className="games">
                            {this.activeGames()}
                        </div>
                    </div>                    
                </div>
            </div>
        )
    }

}