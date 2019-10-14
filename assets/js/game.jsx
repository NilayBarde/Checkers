import React from 'react'
import ReactDOM from 'react-dom'

export default function gameInit(root) {
    ReactDOM.render(<Checkers />, root)
}

class Checkers extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="column">Game</div>
                    <div className="column">Chat</div>
                </div>
            </div>
        )
    }
}