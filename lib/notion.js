import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export async function getDatabase(databaseId, args = {}) {
	args = Object.assign({
		limit: 100,
		nextCursor: null,
		filter: null
	}, args)

	let response = await notion.databases.query({
		database_id: databaseId,
		page_size: args.limit,
		...args.nextCursor && ({ start_cursor: args.nextCursor }),
		...args.filter && ({ filter: args.filter })
	})
	let results = [...response.results]
	let moreResults = response.next_cursor

	if (response.has_more && args.limit > results.length) {
		response = await getDatabase(databaseId, {
			limt: args.limit - results.length,
			nextCursor: response.next_cursor
		})

		results = [...results, ...response.results]
		moreResults = response.moreResults
	}

	return { results, moreResults }
}

export async function getPageById(pageId) {
	const response = await notion.pages.retrieve({ page_id: pageId })
	return response
}

export async function getPageBySlug(databaseId, slug) {
	const page = await getDatabase(databaseId, {
		filter: {
			property: 'Slug',
			equals: slug
		}
	})

	return page?.[0]
}