import React from 'react'
import ReactDOM from 'react-dom'
import '../css/game'
import Tile from './tile'
export default function gameInit(root, gameName, channel) {
    ReactDOM.render(<Checkers gameName={gameName} channel={channel} />, root)
}

class Checkers extends React.Component {
    constructor(props) {
        super(props)
        this.getMoves = this.getMoves.bind(this)
        this.moveDisk = this.moveDisk.bind(this)
        this.messageAdded = this.messageAdded.bind(this)

        // creating the initial board array
        let board = Array(64).fill(null).map((el, index) => {
            return {
                position: index,
                isHighlighted: false,
            }
        })

        this.state = {
            board: board,
            message: [],
            whites: [],
            blacks: [],
            doubleKill: [],
            players: [],
            user: null
        }

        this.channel = props.channel
        this.channel.join()
            .receive("ok", resp => {
                console.log(resp.state)
                this.updateState(resp.state)
            })
            .receive("error", error => console.log("cant connect", error))
        
        this.player = prompt("Please Enter your name")
        this.channel.push("join_game", {player: this.player})
            .receive("ok", resp => console.log(resp))
        this.channel.push("get_games")
        this.channel.on("update", resp => this.updateState(resp.state))
        this.channel.on("player_joined", resp => {
            this.updateState(resp.state)
        })
    }

    updateState(state) {
        this.setState(state)
    }

    // To create the board and populate it with tiles.
    createBoard() {
        let row = []
        for (let i = 0; i < 8; i++) {
            let col = []
            for (let j = 0; j < 8; j++) {
                let color = (i + j) % 2 === 0 ? "white" : "red"
                col.push(this.createTile((i * 8 + j), color))

            }
            row.push(<div className="board-row" key={i}>{col}</div>)
        }
        return row
    }

    // To create a tile.
    createTile(index, color) {
        return (
            <div className="board-col" key={index} id={"tile-" + index}>
                <Tile
                    color={color}
                    disk={this.state.board[index].disk}
                    getMoves={this.getMoves}
                    position={index}
                    isHighlighted={this.state.board[index].isHighlighted}
                    moveDisk={this.moveDisk}
                />
            </div>
        )
    }

    hasGameEnded() {
        const { winner } = this.state;

        if (winner && winner == 'Player 1') {
            alert('Player 1 won!');
        } else if (winner && winner == 'Player 2') {
            alert('Player 2 won!');
        }
    }

    getMoves(position) {
        let player = this.state.players.filter(player => {
            if(player.name === this.player)
                return player
        })

        if(this.state.board[position].disk.color === player[0].disks) {
            this.channel.push("get_moves", { position })
            .receive("ok", resp => {
                this.setState({ board: resp.state.board, doubleKill: resp.state.doubleKill })
                console.log(resp)
            })
        }
    }

    moveDisk(position) {
        this.channel.push("move_disk", { position })
            .receive("ok", resp => {
                console.log(resp)
                this.setState(resp.state)
                console.log(this.state)
            })
        this.hasGameEnded();
    }

    messageAdded() {
        let inputField = document.getElementById('chat-message');
        const message = inputField.value;
        inputField.value = '';
        if (message.replace(/ /g, "").length > 0) {
            this.channel.push("chat_added", { message })
                .receive("ok", resp => {
                    this.setState(resp.state)
                    console.log(this.state)
                })
        }
    }

    renderChatMessages() {
        const { message } = this.state;
        const messages = message;
        let formattedMessages = <p> No Messages </p>;
        if (messages.length > 0) {
            formattedMessages = messages.map((msg, index) => {
                const username = `User ${index + 1}`
                return (
                    <div className="message" key={index}>
                        <div className="message-text">
                            <div className="message-user"> {username} </div>
                            <div>{msg}</div>
                        </div>
                    </div>
                )
            })
        }
        return formattedMessages;
    }

    handleKeyPress(event) {
        if (event.key == 'Enter') {
            this.messageAdded();
        }
    };

    render() {
        if(this.state.players.length < 2) {
            return (
                <div>
                    <h2>Waiting for a player to join...</h2>
                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="row main-row">
                        {/* GAME BOARD */}
                        <div className="column-1">
                            <div className="board">{this.createBoard()}</div>
    
                            <div className="row action-row">
                                <div className="column">
                                    <button onClick={() => { this.demo() }}>Quit Game</button>
                                </div>
                                <div className="column">
                                    <button>Raise a draw</button>
                                </div>
                            </div>
                        </div>
    
                        <div className="column-3">
                            <div className="white-score">
                                <div id="playerName1">{this.state.players[0].name}</div>
                                <h1>{12 - this.state.blacks.length}</h1>
                            </div>
                            <div className="black-score">
                                <h1>{12 - this.state.whites.length}</h1>
                                <div id="playerName2">{this.state.players[1].name}</div>
                            </div>
                        </div>
    
                        {/* CHAT ROOM */}
                        <div className="column-2 chat-room">
                            <div className="messages">
                                {this.renderChatMessages()}
                            </div>
                            <div className="chat-row">
                                <input id="chat-message" onKeyPress={(e) => this.handleKeyPress(e)} type="text" className="chat-input" />
                                <button className="chat-btn" onClick={this.messageAdded}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}