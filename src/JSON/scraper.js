const fetch = require("node-fetch");

async function scrapeLadderData() {
    const cookies = [
        "csrf=yab6bnwspv8n23eqmhxwv7flj18pc0y36s661jcmiua76t8ygmvnsd",
        "dashboard=" + encodeURIComponent(`{"sidebarShow":"responsive","sidebarMinimize":false,"asideShow":false,"darkMode":true,"i18n":{"lang":"en"},"Toplists":{"choices":["silver","silver","silver","silver","silver","silver"]},"Auth":{"loggedIn":true}}`),
        "ips4_device_key=1dc2113826f3f9759ddf44b3304e2668",
        "ips4_hasJS=true",
        "ips4_IPSSessionFront=hggr896qqh784ag612tupui8cp",
        "ips4_ipsTimezone=Asia/Calcutta",
        "ips4_loggedIn=1754319572",
        "ips4_login_key=760c98e1523dc2b40a17e682259e2c84",
        "ips4_member_id=2035207",
        "pro_session=cb357344-b3ac-452d-a950-bf8d72fe6d7c",
        "pro_session_expiration=1"
    ].join("; ");

    const response = await fetch("https://dashboard.pokemonrevolution.net/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookies,
        },
        body: JSON.stringify({
            operationName: null,
            variables: {},
            query: `
                {
                  silver: toplists(server: silver) {
                    rankedLadder {
                      username
                      PVP { rankedRating rankedWins rankedLosses }
                      guild { name }
                      lastLocation { countryShort countryLong }
                    }
                  }
                  gold: toplists(server: gold) {
                    rankedLadder {
                      username
                      PVP { rankedRating rankedWins rankedLosses }
                      guild { name }
                      lastLocation { countryShort countryLong }
                    }
                  }
                }
            `,
        }),
    });

    const result = await response.json();
    if (result.errors) {
        console.error("❌ GraphQL Error:", result.errors);
        throw new Error("GraphQL failed");
    }

    return result;
}

module.exports = { scrapeLadderData };
