import React from 'react'
import ReactDOM from 'react-dom'
import '../css/game'

export default function gameInit(root) {
    ReactDOM.render(<Checkers />, root)
}

class Checkers extends React.Component {
    constructor(props) {
        super(props)
        this.computeMoves = this.computeMoves.bind(this)
        
        // Setting up color for each tile in the board.
        let board = Array(64).fill(null).map((el, index) => {
            return {
                position: index,
                isHighlighted: false,
            }
        })

        let blacks = Array(12).fill(null)
        let whites = Array(12).fill(null)

        let count = 0;

        // Assign each disk an initial position and assign that disk to
        // the corresponding tile in the board.
        for(let i=0; i<3; i++) {
            for(let j=0; j<8; j+=2) {
                if(i%2 == 0) {
                    blacks[count] = {
                        color: "black",
                        position: 40 + 8*i + j
                    }
                    whites[count] = {
                        color: "white",
                        position: 8*i + j
                    }
                    board[8*i + j]["disk"] = whites[count]
                    board[40 + 8*i + j]["disk"] = blacks[count]
                    count++
                }
                else {
                    blacks[count] = {
                        color: "black",
                        position: 41 + 8*i + j
                    }
                    whites[count] = {
                        color: "white",
                        position: 8*i + j + 1
                    }
                    board[1 + 8*i + j]["disk"] = whites[count]
                    board[41 + 8*i + j]["disk"] = blacks[count]
                    count++
                }
            }
        }

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
                return <div className="message" key={index}><div className="message-text">{msg}</div></div>
            }),
            whites: whites,
            blacks: blacks 
        }

        console.log(this.state)
    }

    // To create the board and populate it with tiles.
    createBoard() {
        let row = []
        for (let i = 0; i < 8; i++) {
            let col = []
            for (let j = 0; j < 8; j++) {
                let color = (i+j)%2 === 0 ? "white" : "red"
                col.push(this.createTile((i*8 +j), color))

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
                    computeMoves={this.computeMoves}
                    position={index}
                    isHighlighted={this.state.board[index].isHighlighted}/>
            </div>
        )
    }

    // A temp function to see the re-rendering of the board
    demo() {
        let board = this.state.board
        let disk = board[0].disk
        board[18].disk = null
        disk.position = 27
        board[27].disk = disk
        console.log(board)
        this.setState({
            board
        })
    }

    computeMoves(position) {
        console.log(position)
        let possibleMoves
        if(position >= 40) 
            possibleMoves = [position-7, position-9]
        else 
            possibleMoves = [position+7, position+9]

        let availableMoves = possibleMoves.filter((tile) => {
            if(!this.state.board[tile].disk)
                return tile
        })
        let board = this.state.board
        board.forEach(tile => tile.isHighlighted = false)
        availableMoves.forEach(tile => {
            board[tile].isHighlighted = true
        })
        
        this.setState({board: board})
    }
    render() {
        return (
            <div>this
                <div className="row main-row">
                    {/* GAME BOARD */}
                    <div className="column">
                        <div className="board">{this.createBoard()}</div>

                        <div className="row action-row">
                        <div className="column">
                            <button onClick={() => {this.demo()}}>Quit Game</button>
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
        if(props.disk) {
            return (
                <div className="tile-red">
                    <Disk computeMoves={props.computeMoves} color={props.disk.color} disk={props.disk} position={props.position}/>
                </div>
            )
        } else {
            const { isHighlighted } = props;
            const tile = isHighlighted? <div className="tile-highlighted"/> : <div className="tile-red"/>;
            return tile;
        }
    }
    else {
        if(props.disk) {
            return (
                <div className="tile-white">
                    <Disk computeMoves={props.computeMoves} color={props.disk.color} disk={props.disk} position={props.position}/>
                </div>
            )
        } else {
            return <div className="tile-white"></div>;
        }
    }
}

// Component for disk.
function Disk(props) {
    if(props.color == "black") {
        return (
            <div className="black-disk" onClick={() => {props.computeMoves(props.position)}}></div>
        )
    }
    else {
        return (
            <div className="white-disk" onClick={() => props.computeMoves(props.position)}></div>
        )
    }
}