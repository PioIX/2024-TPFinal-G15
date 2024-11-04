import styles from "./Title.module.css"

const Title = ({titulo}) => {
    return (
        <h1 className={styles.title}>{titulo}</h1>
    )
}

export default Title