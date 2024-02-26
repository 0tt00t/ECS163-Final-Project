function calculateStatistics(data, feature) {
    // Filter out null, undefined, and non-numeric values
    const validFeatureData = data
        .map(item => {
            // Convert the value to a number and check if it's NaN
            const num = Number(item[feature]);
            return isNaN(num) ? null : num;
        })
        .filter(num => num !== null) // Remove null values resulting from non-numeric entries
        .slice(0, 26313); // Limit to the first 26,313 entries if needed

    // If there's no valid data after filtering, handle it accordingly
    if (validFeatureData.length === 0) {
        console.error(`No valid numeric data found for feature: ${feature}`);
        return null; // Return null or appropriate default value
    }

    // Proceed with sorted data for calculations
    const sortedFeatureData = validFeatureData.sort((a, b) => a - b);
    const mean = sortedFeatureData.reduce((acc, val) => acc + val, 0) / sortedFeatureData.length;
    const median = calculateMedian(sortedFeatureData);
    const q1 = calculateMedian(sortedFeatureData.slice(0, Math.floor(sortedFeatureData.length / 2)));
    const q3 = calculateMedian(sortedFeatureData.slice(Math.ceil(sortedFeatureData.length / 2)));

    return { mean, median, q1, q3 };
}


function calculateMedian(values) {
    if (values.length === 0) throw new Error("No inputs");
    values.sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half];
    return (values[half - 1] + values[half]) / 2.0;
}

// Load and parse the CSV data
fetch('Spotify_Youtube.csv')
    .then(response => response.text())
    .then(csvString => {
        const data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;


        const danceabilityStats = calculateStatistics(data, 'Danceability');
        displayStatistics(danceabilityStats, 'danceabilityStatsContainer');

        // Analyze the dataset to extract data for charts
        const artistTrackCounts = data.reduce((acc, curr) => {
            const artist = curr['Artist']; // Assuming there's an 'Artist' column
            acc[artist] = (acc[artist] || 0) + 1;
            return acc;
        }, {});

        const musicFeaturesAverage = {
            danceability: data
                .map(item => item['Danceability'])
                .filter((value, index) => {
                    const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);
                    if (!isNumeric) {
                        console.error(`Invalid value encountered at index ${index}:`, value);
                    }
                    return isNumeric;
                })
                .slice(0, 26313) // Limit to the first 26,313 entries if needed
                .reduce((acc, value) => acc + Number(value), 0) / Math.min(26313, data.length)
        };



        console.log(musicFeaturesAverage);

        // Once data is ready, create the charts
        createCharts(artistTrackCounts, musicFeaturesAverage, danceabilityStats);

        displayStatistics(danceabilityStats);
    });

function displayStatistics(stats) {
    // Assuming you have an element with the ID 'statisticsContainer' below your chart
    const statsContainer = document.getElementById('statisticsContainer');
    statsContainer.innerHTML = `
            <div style="text-align:center;">
                <div><strong>Mean:</strong> ${stats.mean.toFixed(2)}</div>
                <div><strong>Median:</strong> ${stats.median.toFixed(2)}</div>
                <div><strong>25th Percentile (Q1):</strong> ${stats.q1.toFixed(2)}</div>
                <div><strong>75th Percentile (Q3):</strong> ${stats.q3.toFixed(2)}</div>
            </div>
        `;
    // Add any additional styling you need
}


function createCharts(artistTrackCounts, musicFeaturesAverage, stats) {
    // Chart for Artist Track Count Distribution
    const ctxArtistTrackCount = document.getElementById('artistTrackCountChart').getContext('2d');
    new Chart(ctxArtistTrackCount, {
        type: 'bar',
        data: {
            labels: Object.keys(artistTrackCounts),
            datasets: [{
                label: 'Track Count',
                data: Object.values(artistTrackCounts),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Chart for Music Features Distribution
    const ctxMusicFeatures = document.getElementById('musicFeaturesChart').getContext('2d');
    new Chart(ctxMusicFeatures, {
        type: 'radar',
        data: {
            labels: ['Danceability'], // Use feature labels here
            datasets: [{
                    label: 'Mean',
                    data: [stats.mean],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'Median',
                    data: [stats.median],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgb(54, 162, 235)',
                },
                {
                    label: '25th Percentile (Q1)',
                    data: [stats.q1],
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                    borderColor: 'rgb(255, 206, 86)',
                },
                {
                    label: '75th Percentile (Q3)',
                    data: [stats.q3],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgb(75, 192, 192)',
                }
            ]
        },
        options: {
            scale: {
                angleLines: {
                    display: true
                },
                ticks: {
                    suggestedMin: 0
                }
            },
            tooltips: {
                enabled: true,
                callbacks: {
                    // Custom tooltip callbacks if needed
                }
            }
        }
    });
}