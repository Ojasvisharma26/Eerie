const puppeteer = require('puppeteer');

async function scrapeLadderData() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Step 1: Go to login page
    await page.goto('https://dashboard.pokemonrevolution.net/auth/login', {
        waitUntil: 'networkidle2',
    });

    // Step 2: Fill in login form
    await page.type('input[placeholder="Username"]', 'Frylock', { delay: 50 });
    await page.type('input[placeholder="Password"]', 'Ojasvihrms26-10', { delay: 50 });

    // Step 3: Submit login form
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('button.btn.btn-primary')
    ]);

    // Step 4: Go to /dashboard page (to make sure session is active)
    await page.goto('https://dashboard.pokemonrevolution.net/dashboard', {
        waitUntil: 'networkidle2'
    });

    // Step 5: Perform GraphQL call in browser context
    const response = await page.evaluate(async () => {
        const res = await fetch("/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                operationName: null,
                variables: {},
                query: `{
                  silver: toplists(server: silver) {
                    rankedLadder {
                      username
                      PVP { rankedRating rankedWins rankedLosses }
                      guild { name }
                      lastLocation { countryLong }
                    }
                  }
                  gold: toplists(server: gold) {
                    rankedLadder {
                      username
                      PVP { rankedRating rankedWins rankedLosses }
                      guild { name }
                      lastLocation { countryLong }
                    }
                  }
                }`
            })
        });
        return await res.json();
    });

    await browser.close();

    // ✅ Return GraphQL response
    return response;
}

module.exports = { scrapeLadderData };
