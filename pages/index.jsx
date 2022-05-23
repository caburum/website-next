import Card from 'components/Card'
import Image from 'next/image'
import { getRepositoriesContributedTo } from 'lib/github'
import { getDatabase } from 'lib/notion'
import { langs } from 'lib/logos'
import Head from 'next/head'
import styles from 'styles/Home.module.scss'
import cardStyles from 'styles/Card.module.scss'

export default function Home({ repos, posts }) {
	return <>
		<Head>
			<title>Caburum</title>
		</Head>
		<h1>Recent blog posts</h1>
		<div className={cardStyles.cards}>
			{posts.map(post => (
				<Card key={post.id} title={post.properties.Name.title[0].plain_text} />
			))}
		</div>

		<h1>GitHub repos</h1>
		<div className={cardStyles.cards}>
			{repos.map(repo => (
				<Card key={repo.nameWithOwner} title={repo.nameWithOwner} link={repo.url}>
					<div className={cardStyles.cardDescription}>{repo.description}</div>
					<div className={cardStyles.cardStats}>
						<p>{repo.stargazerCount} <span>stars</span></p>
						<p>{repo.watchers.totalCount} <span>watchers</span></p>
						<p>{repo.forks.totalCount} <span>forks</span></p>
						<p>{repo.pullRequests.totalCount} <span>pulls</span></p>
						{repo.primaryLanguage?.name && langs[repo.primaryLanguage.name.toLowerCase()] && <img src={langs[repo.primaryLanguage.name.toLowerCase()]} height="50" alt={repo.primaryLanguage.name} />}
					</div>
				</Card>
			))}
		</div>
		<a href="https://github.com/caburum?tab=repositories">More…</a>
	</>
}

export async function getStaticProps({ params }) {
	const repos = await getRepositoriesContributedTo('caburum', 12)
	const { results: posts } = await getDatabase(process.env.NOTION_DATABASE, 6)

	return {
		props: { repos, posts },
		revalidate: 120,
	}
}