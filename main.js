document.addEventListener('DOMContentLoaded', function() {
    fetch('Spotify_Youtube.csv')
        .then(response => response.text())
        .then(csvString => {
            var data = Papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: function(results) {
                    var tracks = results.data
                        .sort((a, b) => b.Stream - a.Stream) // Sort by Stream in descending order
                        .slice(0, 2000) // Adjust as needed
                        .map(row => ({
                            name: row.Track,
                            stream: row.Stream,
                            views: row.Views,
                            danceability: row.Danceability,
                            energy: row.Energy,
                            valence: row.Valence
                        }));

                    // First plot: Comparison Between Spotify Streams and YouTube Views
                    var plotData = {
                        x: tracks.map(t => t.stream),
                        y: tracks.map(t => t.views),
                        text: tracks.map(t => t.name),
                        mode: 'markers',
                        marker: {
                            size: tracks.map(t => Math.sqrt(t.views) / 1000),
                            sizemode: 'diameter'
                        },
                        type: 'scatter'
                    };
                    var layout = {
                        title: 'Comparison Between Spotify Streams and YouTube Views',
                        xaxis: {
                            title: 'Spotify Streams',
                            type: 'log',
                            autorange: true
                        },
                        yaxis: {
                            title: 'YouTube Views',
                            type: 'log',
                            autorange: true
                        },
                        hovermode: 'closest',
                        width: 1900, // Adjust the width as needed
                        height: 1000 // Adjust the height as needed
                    };
                    Plotly.newPlot('plot', [plotData], layout);

                    var officialVideos = tracks.filter(track => track.official_video);
                    var nonOfficialVideos = tracks.filter(track => !track.official_video);

                    // Calculate and plot
                    plotOfficialVideoImpact(officialVideos, nonOfficialVideos);
                }
            });
        });
});

function calculateAverageMetrics(videos, metric) {
    let total = videos.reduce((acc, video) => acc + parseFloat(video[metric] || 0), 0);
    return total / videos.length;
}

function plotOfficialVideoImpact(officialVideos, nonOfficialVideos) {
    console.log('Official Videos:', officialVideos.length, 'Non-Official Videos:', nonOfficialVideos.length);

    var metrics = ['views', 'likes', 'comments'];
    var officialMetrics = metrics.map(metric => calculateAverageMetrics(officialVideos, metric));
    var nonOfficialMetrics = metrics.map(metric => calculateAverageMetrics(nonOfficialVideos, metric));

    console.log('Official Metrics:', officialMetrics);
    console.log('Non-Official Metrics:', nonOfficialMetrics);

    var barData = [{
        x: metrics,
        y: officialMetrics,
        name: 'Official Videos',
        type: 'bar'
    }, {
        x: metrics,
        y: nonOfficialMetrics,
        name: 'Non-official Videos',
        type: 'bar'
    }];

    var barLayout = {
        title: 'Impact of Official Video on Engagement Metrics',
        barmode: 'group',
        xaxis: { title: 'Metric' },
        yaxis: { title: 'Average Value', autorange: true },
        width: 1300,
        height: 600
    };

    Plotly.newPlot('officialVideoImpact', barData, barLayout);
}