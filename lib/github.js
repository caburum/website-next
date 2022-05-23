export async function getRepositoriesContributedTo(user, limit = 12) {
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` 
		},
		body: JSON.stringify({ query: `query {
			user(login: "${user}") {
				repositoriesContributedTo(contributionTypes: [COMMIT, REPOSITORY], includeUserRepositories: true, privacy: PUBLIC, last: ${limit}) {
					nodes {
						nameWithOwner
						url
						homepageUrl
						description
						primaryLanguage {
							name
						}
						stargazerCount
						watchers {
							totalCount
						}
						# issues {
						# 	totalCount
						# }
						forks {
							totalCount
						}
						pullRequests {
							totalCount
						}
					}
				}
			}
		}` })
	})

	const json = await res.json() 
	if (res.status !== 200) { 
		console.error(json)
		throw new Error('Failed to query GitHub API') 
	}

	return json.data?.user?.repositoriesContributedTo?.nodes?.reverse()
}