const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function scrapeLadderData() {
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();

    // Login Page
    await page.goto('https://dashboard.pokemonrevolution.net/auth/login', {
        waitUntil: 'networkidle2',
        timeout: 60000,
    });

    await page.type('input[placeholder="Username"]', 'Frylock', { delay: 50 });
    await page.type('input[placeholder="Password"]', 'Ojasvihrms26-10', { delay: 50 });

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
        page.click('button.btn.btn-primary')
    ]);

    // Go to Dashboard
    await page.goto('https://dashboard.pokemonrevolution.net/dashboard', {
        waitUntil: 'networkidle2',
        timeout: 60000
    });

    const graphqlData = await page.evaluate(async () => {
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

        return res.json();
    });

    await browser.close();
    console.log("✅ Ladder Data:", JSON.stringify(graphqlData, null, 2));
    return graphqlData;
}

scrapeLadderData().catch((err) => {
    console.error("❌ Error:", err);
});
