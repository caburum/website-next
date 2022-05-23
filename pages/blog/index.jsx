import Card from 'components/Card'
import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getDatabase } from 'lib/notion'
import Head from 'next/head'
import cardStyles from 'styles/Card.module.scss'
import { useState } from 'react'

export default function Blog(firstData) {
	const [posts, setPosts] = useState(firstData.results)
	const [cursor, setCursor] = useState(firstData.moreResults)

	const getMorePosts = async () => {
		const res = await fetch(`/api/posts?cursor=${cursor}`)
		const newPosts = res.json()

		setCursor(cursor + 1)
		setPosts((post) => [...post, ...newPosts.results])
	}

	return <>
		<InfiniteScroll
			dataLength={posts.length}
			next={getMorePosts}
			hasMore={cursor !== null}
			loader={<h3> Loading...</h3>}
			endMessage={<h4>Nothing more to show</h4>}
			className={cardStyles.cards}
		>
			{posts.map(post => (
				<Card
					key={post.id}
					title={post.properties.Name.title[0].plain_text}
					link={post.url}
				/>
			))}
		</InfiniteScroll>
	</>
}

export async function getStaticProps({ params }) {
	const firstData = await getDatabase(process.env.NOTION_DATABASE, {
		limit: 100
	})

	return {
		props: {
			results: firstData.results,
			moreResults: 2
		},
		revalidate: 120,
	}
}