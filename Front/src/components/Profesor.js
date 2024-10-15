"use client"

import clsx from "clsx"
import styles from "./Profesor.module.css"
import Image from "next/image"

export default function Profesor({name, description}) {
    return (
        <div className={styles}>
            <Image src={`/ ${name}.png`} width={30} height={30} alt= {`Foto de ${name}`}/>
            <h4>{name}</h4>
            <h6>{description}</h6>
        </div>
    )
}