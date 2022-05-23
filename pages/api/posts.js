import { getDatabase } from 'lib/notion'

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Fetches more posts for infinite scrolling in /blog
export default async function handler(req, res) {
	const { cursor, limit } = req.query

	const db = await getDatabase(process.env.NOTION_DATABASE, {
		nextCursor: cursor,
		limit: clamp(Number(limit), 1, 100) || 100
	})

	res.status(200).json(db)
}
