Bun.serve({
	async fetch(req) {
		return new Response(
			JSON.stringify({
				testData: true,
				coord: { lon: 12, lat: 41 },
				weather: [
					{
						id: 804,
						main: 'Clouds',
						description: 'overcast clouds',
						icon: '04n',
					},
				],
				base: 'stations',
				main: {
					temp: 300.65,
					feels_like: 304.54,
					temp_min: 300.65,
					temp_max: 300.65,
					pressure: 1007,
					humidity: 84,
					sea_level: 1007,
					grnd_level: 1007,
				},
				visibility: 10000,
				wind: { speed: 3.48, deg: 155, gust: 4.03 },
				clouds: { all: 100 },
				dt: 1722655261,
				sys: { country: 'IT', sunrise: 1722658205, sunset: 1722709569 },
				timezone: 7200,
				id: 3183005,
				name: 'Anzio',
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

