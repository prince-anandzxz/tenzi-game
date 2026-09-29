import { useEffect, useState } from "react"
import Buttons from "./Buttons"
import Data from "./Data"
import confetti from "canvas-confetti"



export default function Box() {

    const [arr, setArr] = useState(Data)
    const [track, setTrack] = useState({ roll: 0, win: false, start: false, timer: 0 })
    const [first, setFirst] = useState(null)

    const statusCheck = arr.filter((prev) => prev.isSupport === true).length === 10


    const [timer, setTimer] = useState(null)

    function handleRoll() {
        if (track.win) {
            setArr(Data)
            setFirst(null)
            setTrack((prev) => ({ roll: 0, win: false, start: false, timer: 0 }))
            return;
        }

        if (track.start === false) {
            setTrack((prev) => ({ ...prev, start: true }))
        } else {
            track.start && setTrack((prev) => ({ ...prev, roll: prev.roll + 1 }))
        }
        setArr((prev) => prev.map((val => val.isSupport == true ? ({ ...val }) : ({ ...val, value: Math.floor((Math.random() * 10) + 1) }))
        ))
        if (track.timer === 0) {
            setTimer(setInterval(() => {
                setTrack((prev) => ({ ...prev, timer: prev.timer + 1 }))
            }, 1000));
        }

    }





    function handleButton(e) {
        if (!track.start) {
            return;
        }
        if (first === null) {
            setFirst(e.target.innerHTML)
            setArr((prev) => prev.map((val) => e.target.id == val.id ? ({ ...val, isSupport: true }) : ({ ...val })))
        }
        else if (e.target.innerHTML == first) {
            setArr((prev) => prev.map((val) => e.target.id == val.id ? ({ ...val, isSupport: true }) : ({ ...val })))
            if (arr.filter((prev) => prev.isSupport === true).length === 9) {
                clearInterval(timer)
                confetti()
                setTrack((prev) => ({ ...prev, win: true, start: false }))


                if (localStorage.getItem("best") === null) {
                    localStorage.setItem("best", track.timer)
                } else if (Number(localStorage.getItem("best")) > track.timer) {
                    localStorage.setItem("best", track.timer)
                }
            }
        }
        else {
            setArr((prev) => prev.map((val) => e.target.id == val.id ? ({ ...val, isSupport: "guess" }) : ({ ...val })))
            setTimeout(() => {
                setArr((prev) => prev.map((val) => e.target.id == val.id ? ({ ...val, isSupport: false }) : ({ ...val })))
            }, 1000);
        }
    }




    return (
        <div className={track.win ? "overall-win" : "overall"}>
            <h1>Tenzi</h1>
            <p>Roll until all dice are the same. Click each die to <br />
                freeze it at its current value between rolls. <br />
                <span>Try to get the fastest time!</span>
            </p>
            <ul className="progress">
                <li>
                    <dt>Rolls</dt>
                    <dd>{track.roll}</dd>
                </li>
                <li>
                    <dt>Best Time</dt>
                    <dd>{localStorage.getItem("best")}s</dd>
                </li>
                <li>
                    <dt>Time</dt>
                    <dd>{track.timer}s</dd>
                </li>
            </ul>
            <div className="btn-parent">
                {
                    arr.map((prev) => <Buttons statusCheck={statusCheck} key={prev.id} all={prev} handleButton={handleButton} />)
                }
            </div>
            <button className={track.win ? "strt-win" : "strt"} onClick={handleRoll} >{track.win ? "Play Again" : !track.start ? "Start" : "Roll"}</button>
        </div >
    )
}