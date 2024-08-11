fetch('Chess_players.json')
    .then(response => response.json())
    .then(data => {
        const chessPlayers = data;

        const popularOpeningsData = findPopularOpening(chessPlayers);
        const highestRatedPlayerData = findHighestRatedPlayer(chessPlayers);
        const achievementsByPlayerData = getAchievementsByPlayer(chessPlayers);

        console.log(JSON.stringify(chessPlayers, null, 2));

        displayPopularOpenings(popularOpeningsData);
        displayHighestRatedPlayer(highestRatedPlayerData);
        displayAchievementsByPlayer(achievementsByPlayerData);
    })
    .catch(error => console.error('Error loading JSON:', error));

function findPopularOpening(chessPlayers) {
    let allOpenings = [];

    for (let i = 0; i < chessPlayers.chess_players.length; i++) {
        let player = chessPlayers.chess_players[i];
        allOpenings.push(...player.most_popular_openings);
    }

    let openingCounts = {};

    allOpenings.forEach(opening => {
        if (openingCounts[opening]) {
            openingCounts[opening]++;
        } else {
            openingCounts[opening] = 1;
        }
    });

    return Object.entries(openingCounts)
        .sort((a, b) => b[1] - a[1])
        .reduce((acc, [opening, count]) => {
            acc[opening] = count;
            return acc;
        }, {});
}

function findHighestRatedPlayer(chessPlayers) {
    let highestRatedPlayer = null;
    let highestRating = 0;

    chessPlayers.chess_players.forEach(player => {
        if (typeof player.top_rating === "number" && player.top_rating > highestRating) {
            highestRatedPlayer = player.name;
            highestRating = player.top_rating;
        }
    });

    return { name: highestRatedPlayer, rating: highestRating };
}

function getAchievementsByPlayer(chessPlayers) {
    let achievementsByPlayer = {};

    chessPlayers.chess_players.forEach(player => {
        achievementsByPlayer[player.name] = player.achievements.map(achievement => {
            return `${achievement.title} (${achievement.date})`;
        });
    });

    return achievementsByPlayer;
}

function displayPopularOpenings(popularOpeningsData) {
    const popularOpeningsDiv = document.getElementById('openingsList');
    const openingsList = Object.entries(popularOpeningsData)
        .map(([opening, count]) => `<li>${opening}: ${count} players</li>`)
        .join('');

    popularOpeningsDiv.innerHTML = `<ul>${openingsList}</ul>`;
}

function displayHighestRatedPlayer(highestRatedPlayerData) {
    const highestRatedPlayerDiv = document.getElementById('highest-rated-player');
    highestRatedPlayerDiv.innerHTML = `<p>The highest-rated player is <strong>${highestRatedPlayerData.name}</strong> with a rating of <strong>${highestRatedPlayerData.rating}</strong>.</p>`;
}

function displayAchievementsByPlayer(achievementsByPlayerData) {
    const achievementsByPlayerDiv = document.getElementById('achievements-by-player');

    for (const player in achievementsByPlayerData) {
        const playerAchievements = achievementsByPlayerData[player];
        const achievementsList = playerAchievements.map(achievement => `<li>${achievement}</li>`).join('');

        achievementsByPlayerDiv.innerHTML += `
            <h3>${player}</h3>
            <ul>${achievementsList}</ul>
        `;
    }
}
