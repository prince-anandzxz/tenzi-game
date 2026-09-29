import { useEffect, useState } from "react"

export default function Buttons({ arr, all, handleButton, statusCheck }) {



    let col = all.isSupport == false ? "btn" : all.isSupport == true ? "btn-win" : "btn-lose"

    return (
        <button id={all.id} className={statusCheck ? "wins" : col} onClick={handleButton}>{all.value}</button>
    )
}