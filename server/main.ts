Bun.serve({
	async fetch(req) {
		return new Response(
			JSON.stringify({
				testData: true,
				coord: { lon: -87.0639, lat: 41.4678 },
				weather: [
					{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
				],
				base: 'stations',
				main: {
					temp: 280,
					feels_like: 301.95,
					temp_min: 298.94,
					temp_max: 301.28,
					pressure: 1016,
					humidity: 64,
					sea_level: 1016,
					grnd_level: 990,
				},
				visibility: 10000,
				wind: { speed: 4.12, deg: 260 },
				clouds: { all: 20 },
				dt: 1721752622,
				sys: {
					type: 2,
					id: 2000450,
					country: 'US',
					sunrise: 1721730889,
					sunset: 1721783661,
				},
				timezone: -18000,
				id: 4925020,
				name: 'Porter',
				cod: 200,
			}),
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			},
		)
	},
})
