function fetchData() {
	fetch('https://api-try-mf32.onrender.com/').then(response => {
		if (response === null || response === undefined) {
			return null
		} else {
			return response.json();
		}
	}).then(data => {
		if (data !== null) {
			if (data.server) {
				for (const serverCounter of document.querySelectorAll('#server-count')) {
					serverCounter.textContent = `${String(data.server).trim()}`
				}
			} else {
				for (const serverCounter of document.querySelectorAll('#server-count')) {
					serverCounter.textContent = 'N/A'
				}
			}

			if (data.command) {
				for (const commandCounter of document.querySelectorAll('#command-count')) {
					commandCounter.textContent = `${String(data.command).trim()}`
				}
			} else {
				for (const commandCounter of document.querySelectorAll('#command-count')) {
					commandCounter.textContent = 'N/A'
				}
			}

			if (data.channel) {
				for (const channelCounter of document.querySelectorAll('#channel-count')) {
					channelCounter.textContent = `${String(data.channel).trim()}`
				}
			} else {
				for (const channelCounter of document.querySelectorAll('#channel-count')) {
					channelCounter.textContent = 'N/A'
				}
			}

			if (data.user) {
				for (const userCounter of document.querySelectorAll('#user-count')) {
					userCounter.textContent = `${String(data.user).trim()}`
				}
			} else {
				for (const userCounter of document.querySelectorAll('#user-count')) {
					userCounter.textContent = 'N/A'
				}
			}
		} else {
			for (const serverCounter of document.querySelectorAll('#server-count')) {
				serverCounter.textContent = 'N/A'
			}

			for (const userCounter of document.querySelectorAll('#user-count')) {
				userCounter.textContent = 'N/A'
			}
		}
	}).catch((error) => {
		for (const serverCounter of document.querySelectorAll('#server-count')) {
			serverCounter.textContent = 'N/A'
		}

		for (const userCounter of document.querySelectorAll('#user-count')) {
			userCounter.textContent = 'N/A'
		}

		for (const commandCounter of document.querySelectorAll('#command-count')) {
			commandCounter.textContent = 'N/A'
		}

		for (const channelCounter of document.querySelectorAll('#channel-count')) {
			channelCounter.textContent = 'N/A'
		}
	});
}

fetchData()