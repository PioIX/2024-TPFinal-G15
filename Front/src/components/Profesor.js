"use client"

import styles from "./Profesor.module.css"
import Image from "next/image"

export default function Profesor({name, description}) {
    return (
        <div className={styles.profesor}>
            <Image src={`/${name}.gif`} width={300} height={300} alt= {`Foto de ${name}`} unoptimized/>
            <h4>{name}</h4>
            <p>{description}</p>
        </div>
    )
}