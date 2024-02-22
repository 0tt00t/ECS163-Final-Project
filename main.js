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
                        hovermode: 'closest',
                        width: 1900, // Adjust the width as needed
                        height: 1000 // Adjust the height as needed
                    };

                    Plotly.newPlot('plot', [plotData], layout);
                }
            });
        });

    // Function to generate radar chart for a track
    function generateRadarChart(trackData, divId) {
        var trace = {
            type: 'scatterpolar',
            r: [trackData.danceability, trackData.energy, trackData.valence, trackData.danceability],
            theta: ['Danceability', 'Energy', 'Valence', 'Danceability'],
            fill: 'toself'
        };

        var data = [trace];

        var layout = {
            polar: {
                radialaxis: {
                    visible: true,
                    range: [0, 1]
                }
            },
            showlegend: false,
            title: `${trackData.name} Audio Features`
        };

        Plotly.newPlot(divId, data, layout);
    }

    // Inside the Papa.parse complete function, after processing tracks
    tracks.forEach((track, index) => {
        // Assume each track's data includes audio features
        // Generate a radar chart for each track in a specific div
        // You might need to dynamically create divs for each track or use a predefined set of divs
        generateRadarChart(track, `divIdForTrack${index}`);
    });

});