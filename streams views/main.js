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