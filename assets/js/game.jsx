import React from 'react'
import ReactDOM from 'react-dom'
import '../css/game'

export default function gameInit(root, gameName, channel) {
    ReactDOM.render(<Checkers gameName={gameName} channel={channel}/>, root)
}

class Checkers extends React.Component {
    constructor(props) {
        super(props)
        this.computeMoves = this.computeMoves.bind(this)
        this.getMoves = this.getMoves.bind(this)
        this.moveDisk = this.moveDisk.bind(this)
        

        this.channel = props.channel
        this.channel.join()
            .receive("ok", resp => this.updateState(resp.state))
            .receive("error", error => console.log("cant connect", error))

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
            doubleKill: []
        }
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

        // check if there are no white/black disks remaining on the board
        const noBlackDisks = blacks.length == 0;
        const noWhiteDisks = whites.length == 0;
        if (noBlackDisks) {
            alert('Player 2 won!');
        } else if (noWhiteDisks) {
            alert('Player 1 won!');
        }

        // check if there are no possible moves
        // const noPossibleMovesBlack = false;
        // const noPossibleMovesWhite = false;
        // board.forEach((tile) => {
        //     if (tile.disk && tile.disk.color == 'black') {
        //         const moves = this.getPossibleMoves(tile.disk, tile.position);
        //         if (moves && moves.length > 0) {
        //             noPossibleMovesBlack = true;
        //         }
        //     } else if (tile.disk && tile.disk.color == 'white') {
        //         const moves = this.getPossibleMoves(tile.disk, tile.position);
        //         if (moves && moves.length > 0) {
        //             noPossibleMovesWhite = true;
        //         }
        //     }
        // });
        // if (noPossibleMovesBlack || noPossibleMovesWhite) {
        //     if (noPossibleMovesBlack) {
        //         alert('No possible moves for Player 1, Player 2 wins!');
        //     } else if (noPossibleMovesWhite) {
        //         alert('No possible moves for Player 2, Player 1 wins!');
        //     }
        // }
    }

    // To compute the next possible moves for a selected disk
    computeMoves(position) {
        let { board } = this.state;
        let possibleMoves = this.getPossibleMoves(board[position].disk, position);
        // check if there's a disk at the possible move position
        let availableMoves = []
        let jumpTiles = []
        possibleMoves.forEach((tile) => {
            if(!board[tile].disk)
                availableMoves.push(tile) 

            // Compute if there is an enemy disk
            else {
                if(board[tile].disk.color !== board[position].disk.color) {
                    let delta =  tile - position
                    //Check if the tile after that disk is empty or not
                    if(tile + delta >= 0 && tile+delta <=63) {
                        if(!board[tile + delta].disk) {
                            //Check for the left and right edge
                            if((tile+1)%8 !== 0 && tile%8 !==0)
                                jumpTiles.push(tile + delta)                        
                        }
                    }
                }
            }
        })
    

        //Check if there is possibility of double kill
        let doubleKills = []
        if(jumpTiles.length > 0) {
            jumpTiles.forEach(tile => {
                //GET POSSIBLE MOVES
                const tempMoves = this.getPossibleMoves(board[position].disk, tile)
                //FIND ENEMY                 
                tempMoves.forEach(tempTile => {
                    if(board[tempTile].disk) {
                        if(board[tempTile].disk.color !== board[position].disk.color) {
                            let delta = 2 * (tempTile - tile)
                            //CHECK IF TILE AFTER THE ENEMY IS EMPTY
                            if(tile + delta > 0 && tile + delta < 63) {
                                if(!board[tile + delta].disk) {
                                    console.log(tile+1)
                                    if((tempTile + 1) % 8 !== 0 && tempTile % 8 !== 0)
                                        doubleKills.push(tile + delta)
                                }
                            }
                        }
                    }
                })
            })
        }

        // console.log()
        if(doubleKills.length > 0) {
            this.setState({doubleKill: jumpTiles.concat(doubleKills)})
            return jumpTiles.concat(doubleKills)
        }
        else
            return jumpTiles.length > 0 ? jumpTiles : availableMoves
    }

    getMoves(position) {
        this.channel.push("get_moves", {position})
            .receive("ok", resp => {
                this.setState({board: resp.state.board, doubleKill: resp.state.doubleKill})
                console.log(resp)
            })
    }

    shiftDisk(position) {
        const {board} = this.state
        // get the selected disk
        let selectedDisk
        console.log(position)
        board.forEach((tile) => {
            if (tile.disk && tile.disk.isSelected) {
                tile.disk.isSelected = false

                // Check if the enemy disk was killed
                if (Math.abs(tile.disk.position - position) > 9) {
                    let delta = (tile.disk.position - position) / 2
                    const deadDisk = tile.disk.position - delta
                    let color = board[deadDisk].disk.color
                    board[deadDisk].disk = null

                    // Remove enemy disk from the white/black array
                    if (color === "white") {
                        this.state.whites.forEach(disk => {
                            if (disk.position === deadDisk) {
                                this.state.whites.splice(this.state.whites.indexOf(disk), 1)
                            }
                        })
                    }
                    else {
                        this.state.blacks.forEach(disk => {
                            if (disk.position === deadDisk) {
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
        if (!selectedDisk.isKing) {
            selectedDisk.isKing = this.isKing(selectedDisk)
        }

        // move the disk to the selected tile
        board.forEach((tile) => {
            if (tile.position == position) {
                tile.disk = selectedDisk
            }
        })
    }

    moveDisk(position) {
        
        this.channel.push("move_disk", {position})
            .receive("ok", resp => {
                console.log(resp)
                this.setState(resp.state)
                console.log(this.state)
            })
        // const { board, doubleKill } = this.state;
        // // remove highlight from all the previous tiles
        // board.forEach(tile => tile.isHighlighted = false)
        
        // if(doubleKill.length > 0) {
        //     this.shiftDisk(doubleKill[0])
        //     board[doubleKill[0]].disk.isSelected = true
        //     if(doubleKill.indexOf(position) != -1) {
        //         this.shiftDisk(doubleKill[doubleKill.indexOf(position)])
        //     }
        //     else {
        //         this.shiftDisk(doubleKill[1])
        //     }     
        //     this.setState({doubleKill: []})
        // }
        // else {
        //     this.shiftDisk(position)
        // }
        // this.hasGameEnded();
        // this.setState({ board })
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
                                <button onClick={() => { this.demo() }}>Quit Game</button>
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
                            <input type="text" className="chat-input" />
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
    if (props.color == "red") {
        if (props.disk) {
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
            const tile = isHighlighted ?
                <div className="tile-highlighted" onClick={() => { props.moveDisk(props.position) }} /> : <div className="tile-red" />;
            return tile;
        }
    }
    else {
        if (props.disk) {
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
    if (props.color == "black") {
        if (props.disk.isKing) {
            return (
                <div className="black-disk-king" onClick={() => { props.getMoves(props.position) }}></div>
            )
        } else {
            return (
                <div className="black-disk" onClick={() => { props.getMoves(props.position) }}></div>
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