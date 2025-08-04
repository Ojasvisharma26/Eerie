// ✅ Replit-friendly GraphQL request with cookies
const axios = require('axios');

async function scrapeLadderData() {
    const res = await axios.post('https://dashboard.pokemonrevolution.net/graphql', {
        operationName: null,
        variables: {},
        query: `
        {
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
        }
        `
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `pro_session=9aa09b0c-c648-47dc-ba17-311fb700bc38; ips4_loggedIn=1754319572; ips4_login_key=760c98e1523dc2b40a17e682259e2c84; ips4_member_id=2035207;`
        }
    });

    if (res.data.errors) {
        console.log("❌ GraphQL Error:", res.data.errors);
        throw new Error("GraphQL failed");
    }

    return res.data;
}

module.exports = { scrapeLadderData };
