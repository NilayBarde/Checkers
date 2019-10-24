import React from 'react'
import ReactDOM from 'react-dom'
import '../css/game'

// Component for disk.
export default function Disk(props) {
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