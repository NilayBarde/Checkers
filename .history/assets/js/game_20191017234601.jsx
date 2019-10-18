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
        this.getMoves = this.getMoves.bind(this)
        this.moveDisk = this.moveDisk.bind(this)
        
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
                        position: 40 + 8*i + j,
                        isSelected: false,
                        isKing: false
                    }
                    whites[count] = {
                        color: "white",
                        position: 8*i + j + 1,
                        isSelected: false,
                        isKing: false
                    }
                    board[8*i + j + 1]["disk"] = whites[count]
                    board[40 + 8*i + j]["disk"] = blacks[count]
                    count++
                }
                else {
                    blacks[count] = {
                        color: "black",
                        position: 41 + 8*i + j,
                        isSelected: false,
                        isKing: false
                    }
                    whites[count] = {
                        color: "white",
                        position: 8*i + j,
                        isSelected: false,
                        isKing: false
                    }
                    board[8*i + j]["disk"] = whites[count]
                    board[41 + 8*i + j]["disk"] = blacks[count]
                    count++
                }
            }
        }

        let msgs = [
            {
                user: "user 1",
                msg: "Message1"
            }, 
            {
                user: "user 2",
                msg: "Message2"
            }, 
            {
                user: "user 3",
                msg: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae inventore, quod voluptas alias excepturi sit iure at mollitia accusantium provident deleniti dolor ipsum facilis nesciunt quisquam ut facere aliquam laudantium."
            },
            {
                user: "user 1",
                msg: "Message1"
            }, 
            {
                user: "user 2",
                msg: "Message2"
            }, 
            {
                user: "user 3",
                msg: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae inventore, quod voluptas alias excepturi sit iure at mollitia accusantium provident deleniti dolor ipsum facilis nesciunt quisquam ut facere aliquam laudantium."
            },
            {
                user: "user 1",
                msg: "Message1"
            }, 
            {
                user: "user 2",
                msg: "Message2"
            }, 
            {
                user: "user 3",
                msg: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae inventore, quod voluptas alias excepturi sit iure at mollitia accusantium provident deleniti dolor ipsum facilis nesciunt quisquam ut facere aliquam laudantium."
            },
        ]

        this.state = {
            board: board,
            message: msgs.map((msg, index) => {
                return (
                    <div className="message" key={index}>
                        <div className="message-text">
                            <div className="message-user">{msg.user}</div> 
                            <div>{msg.msg}</div>
                        </div>
                    </div>
                )
            }),
            whites: whites,
            blacks: blacks 
        }
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
                    getMoves={this.getMoves}
                    position={index}
                    isHighlighted={this.state.board[index].isHighlighted}
                    moveDisk={this.moveDisk}
                />
            </div>
        )
    }

    // checks if a disk is King
    isKing(disk) {
        if (disk.color == 'black' && disk.position <= 7) {
            return true;
        }
        if (disk.color == 'white' && disk.position >= 56) {
            return true;
        }
        return false;
    }

    hasGameEnded() {
        const { blacks, whites, board } = this.state;
        const noBlackDisks = blacks.length == 0;
        const noWhiteDisks = whites.length == 0;
        if (noBlackDisks) {
            alert('Player 2 won!');
        } else if (noWhiteDisks) {
            alert('Player 1 won!');
        }
    }

    // To compute the next possible moves for a selected disk
    computeMoves(position) {
        let { board } = this.state;
        let possibleMoves;

        // remove highlight from all the previous tiles
        board.forEach(tile => tile.isHighlighted = false)

        // select the clicked disk
        board.forEach((tile) => {
            if(tile.position == position) {
                if(tile.disk) {
                    tile.disk.isSelected = true
                }
            } else {
                if(tile.disk) {
                    tile.disk.isSelected = false
                }
            }
        })
        
        // get the possible moves for the current disk
        if(board[position].disk.color === "black") 
            possibleMoves = [position-7, position-9]
        else 
            possibleMoves = [position+7, position+9]

        // check if there's a disk at the possible move position
        let availableMoves = [] 
        let jumpTiles = []
        possibleMoves.forEach((tile) => {
            if(!this.state.board[tile].disk)
                availableMoves.push(tile) 

            // Compute if there is an enemy disk
            else
                if(this.state.board[tile].disk.color !== this.state.board[position].disk.color) {
                    let delta =  tile - position
                    const deltaInBounds = delta >= 0 && delta <= 63
                    //Check if the tile after that disk is empty or not
                    if(deltaInBounds && !this.state.board[tile + delta].disk) {
                        //Check for the edge case
                        if(delta !== -7 && delta !== 7)
                            jumpTiles.push(tile + delta)
                        //Check if there is possibility of double kill
                        
                    }
                }
        })

        return jumpTiles.length > 0 ? jumpTiles : availableMoves
    }

    getMoves(position) {
        const moves = this.computeMoves(position)
        const board = this.state.board
        moves.forEach(tile => board[tile].isHighlighted = true)
        this.setState({board})
    }

    moveDisk(position) {
        const { board } = this.state;
        
        // remove highlight from all the previous tiles
        board.forEach(tile => tile.isHighlighted = false)

        // get the selected disk
        let selectedDisk
        board.forEach((tile) => {
            if(tile.disk && tile.disk.isSelected) {
                tile.disk.isSelected = false

                // Check if the enemy disk was killed
                if(Math.abs(tile.disk.position - position) > 9) {
                    let delta = (tile.disk.position - position)/2
                    const deadDisk = tile.disk.position - delta
                    let color = board[deadDisk].disk.color
                    board[deadDisk].disk = null
                    
                    // Remove enemy disk from the white/black array
                    if(color === "white") {
                        this.state.whites.forEach(disk => {
                            if(disk.position === deadDisk) {
                                this.state.whites.splice(this.state.whites.indexOf(disk), 1)
                            }
                        })   
                    }
                    else {
                        this.state.blacks.forEach(disk => {
                            if(disk.position === deadDisk) {
                                this.state.blacks.splice(this.state.blacks.indexOf(disk), 1)
                            }
                        })
                    }
                }

                // Move the current disk to appropriate position
                tile.disk.position = position
                selectedDisk = tile.disk
                tile.disk = null
                console.log(this.state)
            }
        })

        // check if the selected disk becomes king after moving to position
        selectedDisk.isKing = this.isKing(selectedDisk)

        // move the disk to the selected tile
        board.forEach((tile) => {
            if (tile.position == position) {
                tile.disk = selectedDisk
            }
        })
        this.hasGameEnded();
        this.setState({ board })
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
                    <Disk
                        getMoves={props.getMoves}
                        color={props.disk.color}
                        disk={props.disk}
                        position={props.position}
                    />
                </div>
            )
        } else {
            const { isHighlighted } = props;
            const tile = isHighlighted? 
                <div className="tile-highlighted" onClick={() => {props.moveDisk(props.position)}}/> : <div className="tile-red"/>;
            return tile;
        }
    }
    else {
        if(props.disk) {
            return (
                <div className="tile-white">
                    <Disk
                        getMoves={props.getMoves}
                        color={props.disk.color}
                        disk={props.disk}
                        position={props.position}
                    />
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
        if (props.disk.isKing) {
            return (
                <div className="black-disk-king" onClick={() => {props.getMoves(props.position)}}></div>
            )
        } else {
            return (
                <div className="black-disk" onClick={() => {props.getMoves(props.position)}}></div>
            )
        }
        
    }
    else {
        if (props.disk.isKing) {
            return (
                <div className="white-disk-king" onClick={() => props.getMoves(props.position)}></div>
            )
        } else {
            return (
                <div className="white-disk" onClick={() => props.getMoves(props.position)}></div>
            )
        }
    }
}