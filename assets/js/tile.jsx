import Disk from './disk'
import React from 'react'
import ReactDOM from 'react-dom'
import '../css/game'

// Component for tile.
export default function Tile(props) {
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