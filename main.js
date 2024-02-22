document.addEventListener('DOMContentLoaded', function() {
    fetch('Spotify_Youtube.csv')
        .then(response => response.text())
        .then(csvString => {
            // Convert CSV string to array of objects
            var data = Papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: function(results) {
                    var tracks = results.data.map(row => ({
                        name: row.Track,
                        stream: row.Stream,
                        views: row.Views
                    }));

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
                        hovermode: 'closest'
                    };

                    Plotly.newPlot('plot', [plotData], layout);
                }
            });
        });
});