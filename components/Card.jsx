import styles from 'styles/Card.module.scss'

export default function Card({ title, link = null, children }) {

	return <div className={styles.card}>
		<div className={styles.cardHeader}>
			<h2>{link ? <a href={link}>{title}</a> : title}</h2>
		</div>
		{children}
	</div>
}