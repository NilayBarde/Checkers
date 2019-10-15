import React from 'react'
import ReactDOM from 'react-dom'
import '../css/game'

export default function gameInit(root) {
    ReactDOM.render(<Checkers />, root)
}

class Checkers extends React.Component {
    constructor(props) {
        super(props)
        
        // Setting up color for each tile in the board.
        let board = Array(64).fill(null).map((el, index) => {
            if(index % 2 === 0)
                return {
                    colorTile: "white"
                }
            else
                return {
                    colorTile: "red"
                }
        })

        let msgs = [
            "Message1", 
            "Message2", 
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae inventore, quod voluptas alias excepturi sit iure at mollitia accusantium provident deleniti dolor ipsum facilis nesciunt quisquam ut facere aliquam laudantium.",
            "Message1", 
            "Message2", 
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae inventore, quod voluptas alias excepturi sit iure at mollitia accusantium provident deleniti dolor ipsum facilis nesciunt quisquam ut facere aliquam laudantium.",
            "Message1", 
            "Message2", 
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae inventore, quod voluptas alias excepturi sit iure at mollitia accusantium provident deleniti dolor ipsum facilis nesciunt quisquam ut facere aliquam laudantium.",
            "Message1", 
            "Message2", 
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae inventore, quod voluptas alias excepturi sit iure at mollitia accusantium provident deleniti dolor ipsum facilis nesciunt quisquam ut facere aliquam laudantium.",
            "Message1", 
            "Message2", 
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae inventore, quod voluptas alias excepturi sit iure at mollitia accusantium provident deleniti dolor ipsum facilis nesciunt quisquam ut facere aliquam laudantium.",

        ]

        this.state = {
            board: board,
            message: msgs.map((msg, index) => {
                return <div className="message" key={index}>{msg}</div>
            }) 
        }

        console.log(this.state)
    }

    //To create the board and populate it with tiles.
    createBoard() {
        let row = []
        for (let i = 0; i < 8; i++) {
            let col = []
            for (let j = 0; j < 8; j++)
                col.push(this.createTile(i+j))
            row.push(<div className="board-row" key={i}>{col}</div>)
        }
        return row
    }

    //To create a tile.
    createTile(index) {
        return (
            <div className="board-col" key={index}>
                <Tile color={this.state.board[index].colorTile}/>
            </div>
        )
    }

    render() {
        return (
            <div>
                <div className="row main-row">
                    {/* GAME BOARD */}
                    <div className="column">
                        <div className="board">{this.createBoard()}</div>
                        <div className="row action-row">
                        <div className="column">
                            <button>Quit Game</button>
                        </div>
                        <div className="column">
                            <button>Raise a draw</button>
                        </div>
                        </div>
                    </div>

                    {/* CHAT ROOM */}
                    <div className="column chat-room">
                        <div className="messages">
                            {this.state.message}
                        </div>
                        <div className="chat-row">
                            <input type="text" className="chat-input"/>
                            <button className="chat-btn">Send</button>    
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

// Component for tile.
function Tile(props) {
    if(props.color == "red") {
        return (
            <div className="tile-red"></div>
        )
    }
    else {
        return (
            <div className="tile-white"></div>
        )
    }
}