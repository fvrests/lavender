import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
	request: VercelRequest,
	response: VercelResponse,
) {
	console.log('query', request.query)
	let baseUrl = process.env.WEATHER_API_URL
	let appid = process.env.VITE_WEATHER_KEY_DEV
	const res = await fetch(
		`${baseUrl}?lat=${request.query.lat}&lon=${request.query.lon}&appid=${appid}`,
	)
	response.status(200).json({
		body: res.json(),
		query: request.query,
		cookies: request.cookies,
	})
}
