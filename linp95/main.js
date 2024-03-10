document.addEventListener('DOMContentLoaded', function () {
    const fullLyricsText = `Hi everyone, I'm Lay, a very special music creator and a senior majoring in computer science. I have demonstrated exceptional talent not only academically but also as a passionate musician. As an avid music producer, I love sharing my sounds with the world. However, real-life difficulties and challenges can be stressful, especially when trying to stand out on digital music platforms like Spotify and YouTube. Nevertheless, I was not intimidated by these challenges. Instead, I used my expertise in data visualization to find new expressions of music creation. Next, please follow me into the story of my breakthrough in Spotify streams, and YouTube views and likes.
    `;
    let currentCharIndex = 0;
    const lyricsContainer = document.getElementById('lyrics');
    const playButton = document.getElementById('playButton');
    const audio = new Audio('music.mp3'); // Replace with the path to your music file
    let typingInterval;

    const typeChar = () => {
        if (currentCharIndex < fullLyricsText.length) {
            lyricsContainer.textContent += fullLyricsText.charAt(currentCharIndex);
            currentCharIndex++;
        } else {
            clearInterval(typingInterval);
        }
    };

    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playButton.textContent = 'Pause Intro';
            typingInterval = setInterval(typeChar, 65); // The speed of typing, adjust as needed
        } else {
            audio.pause();
            playButton.textContent = 'Play Intro';
            clearInterval(typingInterval);
        }
    });
    // Assuming you have a variableInfo object with details for each feature
    const info = {
        'Loudness': {
            Definition: 'How loud a song is from start to end.',
            Range: 'Between -60 dB (quiet) and 0 dB (loud).',
            Application: 'Keeps song volumes consistent across tracks.'
        },
        'Duration_ms': {
            Definition: 'The length of the track in milliseconds.',
            Range: 'In milliseconds, varies from short to very long tracks.',
            Application: 'Useful for making playlists with time - specific needs, like short songs for a quick workout or longer tracks for relaxation.'
        },
        'Acousticness': {
            Definition: 'Indicates how likely a track is made with acoustic (non-electronic) sounds.',
            Range: '0.0 (not acoustic) to 1.0 (very acoustic).',
            Application: 'Great for finding natural-sounding music for specific playlists.'
        },
        'Tempo': {
            Definition: 'The speed of a track in beats per minute (BPM).',
            Range: 'Typically 50 to 150 BPM.',
            Application: 'Useful for matching songs with similar tempos for a playlist.'
        },
        'Valence': {
            Definition: 'Measures how positive or happy music sounds.',
            Range: '0.0 (sad or negative) to 1.0 (happy or positive).',
            Application: 'Used to create playlists that fit a mood, like cheerful or somber.'
        },
        'Energy': {
            Definition: 'A measure of intensity and activity.',
            Range: 'Ranges from 0.0 to 1.0.',
            Application: 'Often higher for faster, louder, more energetic tracks.'
        },
        'Speechiness': {
            Definition: 'Determines if a track has more talking than music.',
            Range: 'Above 0.66 (mostly talk), 0.33 to 0.66 (mix of music and talk), below 0.33 (mostly music).',
            Application: 'Helps sort music from podcasts or audiobooks.'
        },
        'Danceability': {
            Definition: 'Tells you if a track is good for dancing, considering its rhythm and beat.',
            Range: '0.0 (hard to dance to) to 1.0 (great for dancing).',
            Application: 'Useful for making dance playlists or for music at parties.'
        },
        'Liveness': {
            Definition: 'Indicates if a track was recorded live.',
            Range: '0.0 (studio recording) to 1.0 (live recording).',
            Application: 'Great for finding live music or avoiding it.'
        },
        'Instrumentalness': {
            Definition: 'Predicts if a track has vocals.',
            Range: '0.0 (likely has vocals) to 1.0 (likely instrumental).',
            Application: 'Useful for creating instrumental playlists or background music.'
        },
        'Key': {
            Definition: 'Shows the musical key of a track, affecting its mood and harmony.',
            Range: 'A, A#, B, C, C#, D, D#, E, F, F#, G, G#.',
            Application: 'Helps DJs and music enthusiasts mix tracks harmoniously.'
        }
    };
    document.querySelectorAll('.feature-info').forEach(el => {
        el.addEventListener('mouseenter', e => {
            const feature = e.target.getAttribute('data-feature');
            const data = info[feature];
            const infoBox = document.getElementById('infoBox');
            infoBox.innerHTML = `<strong>${feature.toUpperCase()}</strong><br><strong>Definition:</strong> ${data.Definition}<br><strong>Range:</strong> ${data.Range}<br><strong>Application:</strong> ${data.Application}`;
            infoBox.style.display = 'block';
            infoBox.style.left = `${e.pageX}px`;
            infoBox.style.top = `${e.pageY}px`;
        });

        el.addEventListener('mouseleave', () => {
            document.getElementById('infoBox').style.display = 'none';
        });
    });

    fetch('spotify_feature_importances.csv')
        .then(response => response.text())
        .then(text => {
            const rows = text.split('\n').slice(1); // Skip header row
            let features = [];
            let importances = [];

            rows.forEach(row => {
                const columns = row.split(',');
                features.push(columns[0]);
                importances.push(parseFloat(columns[1]));
            });

            const ctx = document.getElementById('spotifyFeaturesRadar').getContext('2d');
            const spotifyFeaturesRadar = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: features,
                    datasets: [{
                        label: 'Feature Importances',
                        data: importances,
                        fill: true,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgb(255, 99, 132)',
                        pointBackgroundColor: 'rgb(255, 99, 132)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(255, 99, 132)'
                    }]
                },
                options: {
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    },
                    animation: {
                        duration: 2000, // Duration in milliseconds
                        easing: 'easeInOutBounce', // Easing function to use
                    },
                    legend: {
                        position: 'bottom', // Moves the legend to the bottom
                    },
                    scale: {
                        pointLabels: {
                            fontSize: 32, // Adjust the font size as needed
                            fontColor: '#000', // Example font color, adjust as needed
                            fontStyle: 'bold', // Makes the text bold, optional
                        }
                    }
                }
            });

        });
    // heatmap.js content
    d3.csv("correlation_matrix.csv").then(function (data) {
        const canvas_width = document.getElementById("heatmap-div").clientWidth;
        const canvas_height = document.getElementById("heatmap-div").clientHeight;
        console.log(canvas_width, canvas_height);
        const margin = { top: 50, right: 100, bottom: 100, left: 100 }, // Adjust right margin for legend
            width = canvas_width - margin.left - margin.right,
            height = canvas_height - margin.top - margin.bottom,
            svgWidth = width + margin.left + margin.right, // SVG total width
            svgHeight = height + margin.top + margin.bottom; // SVG total height

        const svg = d3.select("#heatmap")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        const heatmapGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Assuming the first row of the CSV contains the feature names
        const features = Object.keys(data[0]).slice(1); // Exclude the first column for labels


        const xScale = d3.scaleBand()
            .range([0, width])
            .domain(features)
            .padding(0.05);

        const yScale = d3.scaleBand()
            .range([height, 0])
            .domain(features)
            .padding(0.05);

        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateRdBu)
            .domain([-1, 1]);

        // Convert data into a format suitable for heatmap
        const heatmapData = [];
        data.forEach((row, i) => {
            features.forEach((feature, j) => {
                heatmapData.push({
                    x: feature,
                    y: features[i],
                    value: +row[feature]
                });
            });
        });

        heatmapGroup.append("g")
            .selectAll("rect")
            .data(heatmapData)
            .enter().append("rect")
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("fill", d => colorScale(d.value))
            .style("opacity", 0.8);

        // Add X axis
        heatmapGroup.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        heatmapGroup.append("g")
            .call(d3.axisLeft(yScale));


        // Legend setup
        const legendGroup = svg.append("g")
            .attr("transform", `translate(${svgWidth - margin.right + 20}, ${margin.top})`);

        var defs = legendGroup.append("defs");
        var linearGradient = defs.append('linearGradient')
            .attr('id', 'linear-gradient')
            .attr("x1", "0%")
            .attr("y1", "100%") // Gradient goes from bottom to top
            .attr("x2", "0%")
            .attr("y2", "0%");

        // Create the stops for the gradient, matching the domain of the colorScale
        const numStops = 10; // Number of stops for the gradient
        const stopValues = d3.range(numStops).map(d => d / (numStops - 1));
        linearGradient.selectAll('stop')
            .data(stopValues)
            .enter().append('stop')
            .attr('offset', d => `${d * 100}%`)
            .attr('stop-color', d => colorScale(d * 2 - 1));

        // Draw the legend bar
        legendGroup.append("rect")
            .attr("width", 20)
            .attr("height", height)
            .style("fill", "url(#linear-gradient)");

        // Legend scale and axis
        var legendScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);
        var legendAxis = d3.axisRight(legendScale).ticks(5).tickFormat(d3.format(".2f"));

        legendGroup.append("g")
            .attr("transform", "translate(20,0)")
            .call(legendAxis);
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("text-align", "center")
            .style("width", "160px")
            .style("height", "auto")
            .style("padding", "2px")
            .style("font", "12px sans-serif")
            .style("background", "lightsteelblue")
            .style("border", "0px")
            .style("border-radius", "8px")
            .style("pointer-events", "none");
        heatmapGroup.selectAll("rect")
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Value: ${d.value}<br>Row: ${d.y}<br>Column: ${d.x}`)
                    .style("left", (event.pageX + 10) + "px") // Adjusted for better positioning
                    .style("top", (event.pageY - 28) + "px");
            })

            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    });
});
// Assuming you have an async function to fetch data
async function fetchData() {
    const response = await fetch('data1.json');
    const data = await response.json();
    return data;
}
// Loudness Plot
fetchData().then(data => {
    // Extract loudness, views, and likes into separate arrays
    var data_loudness = data.map(item => item.Loudness);
    var data_views = data.map(item => item.Views);
    var data_stream = data.map(item => item.Stream);

    var data_labels = data.map((item) => `${item.Track}<br>Loudness: ${item.Loudness}<br>Views: ${item.Views}<br>Stream: ${item.Stream}`);

    // Now, you can use these arrays with Plotly.js as shown in the previous examples
    var trace = {
        x: data_loudness,
        y: data_views,
        z: data_stream,
        mode: 'markers',
        marker: {
            size: 12,
            opacity: 0.8,
            color: data_loudness,
            colorscale: 'Viridis',
        },
        type: 'scatter3d',
        text: data_labels,
        hoverinfo: 'text'
    };

    var layout = {
        title: 'Loudness vs. YouTube Views and Spotify Stream',
        scene: {
            xaxis: { title: 'Loudness' },
            yaxis: { title: 'YouTube Views' },
            zaxis: { title: 'Spotify Stream' },
            // Set the background of the 3D plot area to transparent
            bgcolor: 'rgba(0,0,0,0)' // RGBA color format, alpha set to 0 for transparency
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        // Set the overall background color of the plot to transparent
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
    };
    Plotly.newPlot('plotly-div-1', [trace], layout);
});
// Energy Plot
fetchData().then(data => {
    // Extract energy, views, and likes into separate arrays
    var data_energy = data.map(item => item.Energy);
    var data_views = data.map(item => item.Views);
    var data_stream = data.map(item => item.Stream);

    var data_labels = data.map((item) => `${item.Track}<br>Energy: ${item.Energy}<br>Views: ${item.Views}<br>Stream: ${item.Stream}`);

    // Define the trace for the 3D scatter plot
    var trace = {
        x: data_energy,
        y: data_views,
        z: data_stream,
        mode: 'markers',
        marker: {
            size: 12,
            opacity: 0.8,
            color: data_energy, // Use energy to color the markers
            colorscale: 'Viridis',
        },
        type: 'scatter3d',
        text: data_labels,
        hoverinfo: 'text'
    };

    // Define the layout of the plot
    var layout = {
        title: 'Energy vs. YouTube Views and Spotify Stream',
        scene: {
            xaxis: { title: 'Energy' },
            yaxis: { title: 'YouTube Views' },
            zaxis: { title: 'Spotify Stream' },
            bgcolor: 'rgba(0,0,0,0)' // Make plot background transparent
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        paper_bgcolor: 'rgba(0,0,0,0)', // Make overall plot background transparent
        plot_bgcolor: 'rgba(0,0,0,0)',
    };

    // Create the plot at the plotly-div-2 element
    Plotly.newPlot('plotly-div-2', [trace], layout);
});
// Valence Plot
fetchData().then(data => {
    // Extract valence, views, and likes into separate arrays
    var data_valence = data.map(item => item.Valence);
    var data_views = data.map(item => item.Views);
    var data_stream = data.map(item => item.Stream);

    var data_labels = data.map((item) => `${item.Track}<br>Valence: ${item.Valence}<br>Views: ${item.Views}<br>Stream: ${item.Stream}`);

    // Define the trace for the 3D scatter plot
    var trace = {
        x: data_valence,
        y: data_views,
        z: data_stream,
        mode: 'markers',
        marker: {
            size: 12,
            opacity: 0.8,
            color: data_valence, // Use valence to color the markers
            colorscale: 'RdBu',
        },
        type: 'scatter3d',
        text: data_labels,
        hoverinfo: 'text'
    };

    // Define the layout of the plot
    var layout = {
        title: 'Valence vs. YouTube Views and Spotify Stream',
        scene: {
            xaxis: { title: 'Valence' },
            yaxis: { title: 'YouTube Views' },
            zaxis: { title: 'Spotify Stream' },
            bgcolor: 'rgba(0,0,0,0)' // Make plot background transparent
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        paper_bgcolor: 'rgba(0,0,0,0)', // Make overall plot background transparent
        plot_bgcolor: 'rgba(0,0,0,0)',
    };

    // Create the plot at the plotly-div-3 element
    Plotly.newPlot('plotly-div-3', [trace], layout);
});
// Dancebility Plot
fetchData().then(data => {
    // Extract danceability, views, and likes into separate arrays
    var data_danceability = data.map(item => item.Danceability);
    var data_views = data.map(item => item.Views);
    var data_stream = data.map(item => item.Stream);

    var data_labels = data.map((item) => `${item.Track}<br>Danceability: ${item.Danceability}<br>Views: ${item.Views}<br>Stream: ${item.Stream}`);

    // Define the trace for the 3D scatter plot
    var trace = {
        x: data_danceability,
        y: data_views,
        z: data_stream,
        mode: 'markers',
        marker: {
            size: 12,
            opacity: 0.8,
            color: data_danceability, // Use danceability to color the markers
            colorscale: 'RdBu',
        },
        type: 'scatter3d',
        text: data_labels,
        hoverinfo: 'text'
    };

    // Define the layout of the plot
    var layout = {
        title: 'Danceability vs. YouTube Views and Spotify Stream',
        scene: {
            xaxis: { title: 'Danceability' },
            yaxis: { title: 'YouTube Views' },
            zaxis: { title: 'Spotify Stream' },
            bgcolor: 'rgba(0,0,0,0)' // Make plot background transparent
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        paper_bgcolor: 'rgba(0,0,0,0)', // Make overall plot background transparent
        plot_bgcolor: 'rgba(0,0,0,0)',
    };

    // Create the plot at the plotly-div-4 element
    Plotly.newPlot('plotly-div-4', [trace], layout);
});
// Tempo Plot
fetchData().then(data => {
    // Extract tempo, views, and stream into separate arrays
    var data_tempo = data.map(item => item.Tempo);
    var data_views = data.map(item => item.Views);
    var data_stream = data.map(item => item.Stream);

    var data_labels = data.map((item) => `${item.Track}<br>Tempo: ${item.Tempo}<br>Views: ${item.Views}<br>Stream: ${item.Stream}`);

    // Define the trace for the 3D scatter plot
    var trace = {
        x: data_tempo,
        y: data_views,
        z: data_stream,
        mode: 'markers',
        marker: {
            size: 12,
            opacity: 0.8,
            color: data_tempo, // Use tempo to color the markers
            colorscale: 'Jet',
        },
        type: 'scatter3d',
        text: data_labels,
        hoverinfo: 'text'
    };

    // Define the layout of the plot
    var layout = {
        title: 'Tempo vs. YouTube Views and Spotify Stream',
        scene: {
            xaxis: { title: 'Tempo' },
            yaxis: { title: 'YouTube Views' },
            zaxis: { title: 'Spotify Stream' },
            bgcolor: 'rgba(0,0,0,0)' // Make plot background transparent
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        paper_bgcolor: 'rgba(0,0,0,0)', // Make overall plot background transparent
        plot_bgcolor: 'rgba(0,0,0,0)',
    };

    // Create the plot at the plotly-div-5 element
    Plotly.newPlot('plotly-div-5', [trace], layout);
});
// Acousticness Plot
fetchData().then(data => {
    // Extract acousticness, views, and stream into separate arrays
    var data_acousticness = data.map(item => item.Acousticness);
    var data_views = data.map(item => item.Views);
    var data_stream = data.map(item => item.Stream);

    var data_labels = data.map((item) => `${item.Track}<br>Accousticness: ${item.Acousticness}<br>Views: ${item.Views}<br>Stream: ${item.Stream}`);

    // Define the trace for the 3D scatter plot
    var trace = {
        x: data_acousticness,
        y: data_views,
        z: data_stream,
        mode: 'markers',
        marker: {
            size: 12,
            opacity: 0.8,
            color: data_acousticness, // Use acousticness to color the markers
            colorscale: 'Jet',
        },
        type: 'scatter3d',
        text: data_labels,
        hoverinfo: 'text'
    };

    // Define the layout of the plot
    var layout = {
        title: 'Acousticness vs. YouTube Views and Spotify Stream',
        scene: {
            xaxis: { title: 'Acousticness' },
            yaxis: { title: 'YouTube Views' },
            zaxis: { title: 'Spotify Stream' },
            bgcolor: 'rgba(0,0,0,0)' // Make plot background transparent
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        paper_bgcolor: 'rgba(0,0,0,0)', // Make overall plot background transparent
        plot_bgcolor: 'rgba(0,0,0,0)',
    };

    // Create the plot at the plotly-div-6 element
    Plotly.newPlot('plotly-div-6', [trace], layout);
});

// boxplots.js
async function generateBoxPlot(category, elementId) {
    const data = await d3.csv("Spotify_Youtube.csv");

    const values = data.map(row => parseFloat(row[category]));

    const trace = {
        y: values,
        type: 'box',
        name: category,
        boxpoints: 'all',
        jitter: 0.5,
        whiskerwidth: 0.2,
        marker: {
            size: 2
        },
        boxpoints: false,
        line: {
            width: 1
        }
    };

    const layout = {
        title: `${category} Box Plot`,
        yaxis: {
            autorange: true,
            showgrid: true,
            zeroline: true,
            gridcolor: 'transparent',
            gridwidth: 1,
            zerolinecolor: '#969696',
            zerolinewidth: 2,
        },
        margin: {
            l: 40,
            r: 30,
            b: 80,
            t: 100,
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        showlegend: false
    };

    Plotly.newPlot(elementId, [trace], layout);
}

document.addEventListener('DOMContentLoaded', () => {
    const categories = ['Danceability', 'Energy', 'Key', 'Loudness', 'Speechiness',
        'Acousticness', 'Instrumentalness', 'Liveness', 'Valence',
        'Tempo', 'Duration_ms'
    ];

    categories.forEach((category, index) => {
        const elementId = `boxPlot${index}`;
        generateBoxPlot(category, elementId);
    });
});

function playVideo(element) {
    // Hide the thumbnail
    var img = element.querySelector("img");
    img.style.display = "none";

    // Show the iframe
    var iframe = element.querySelector("iframe");
    iframe.style.display = "block";

    // Check if the src URL already has a query string
    if (iframe.src.indexOf('?') === -1) {
        // If not, add "?autoplay=1"
        iframe.src += "?autoplay=1";
    } else {
        // If the URL already has a query string, add "&autoplay=1"
        iframe.src += "&autoplay=1";
    }
}
// Function to minimize the menu bar
function toggleMenuBar() {
    var menuBar = document.getElementById("corner-menu-bar");
    var minimizeButton = document.getElementById("minimize-button");
    var returnButton = document.getElementById("return-button");

    // Check the current state of the menu bar to toggle between minimize and return
    if (menuBar.style.display !== "none") {
        // Minimize the menu bar
        menuBar.style.display = "none";
        minimizeButton.style.display = "none";
        returnButton.style.display = "block";
    } else {
        // Return (maximize) the menu bar
        menuBar.style.display = "block";
        minimizeButton.style.display = "block";
        returnButton.style.display = "none";
    }
}
