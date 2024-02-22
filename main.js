console.log("main.js loaded successfully.");

document.addEventListener('DOMContentLoaded', function() {
    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#scatter-plot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    let data, x, y, brush;
    // Load the CSV data
    d3.csv('Spotify_Youtube.csv').then(loadedData => {
        // Parse and convert data types
        data = loadedData;
        data.forEach(d => {
            d.stream = +d.stream;
            d.views = +d.views;
        });

        const x = d3.scaleLog()
            .domain([Math.max(1, d3.min(data, d => d.stream)), d3.max(data, d => d.stream)]) // Avoid log(0) by using max(1, min_value)
            .range([0, width]);

        const y = d3.scaleLog()
            .domain([Math.max(1, d3.min(data, d => d.views)), d3.max(data, d => d.views)]) // Avoid log(0) by using max(1, min_value)
            .range([height, 0]);


        // Append SVG for the scatter plot
        const svg = d3.select("#scatter-plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        console.log("Brush started");
        brush = d3.brush()
            .extent([
                [0, 0],
                [width, height]
            ])
            .on("end", updateChart);

        // Add dots
        const dots = svg.append('g');
        dots.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.stream))
            .attr("cy", d => y(d.views))
            .attr("r", 3)
            .style("fill", "#69b3a2")
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Stream: " + d.stream + "<br/>Views: " + d.views)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Add x-axis
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add y-axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the brushing
        svg.append("g")
            .attr("class", "brush")
            .call(brush);

        console.log("Data loaded successfully", data);

    });

    // Function to handle region selection on the scatter plot
    function updateChart(event) {
        const extent = event.selection;
        if (!extent) {
            // If no selection, clear the additional plots
            d3.select("#additional-plots").selectAll("*").remove();
            if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
            x.domain(d3.extent(data, d => d.stream)).nice();
            y.domain(d3.extent(data, d => d.views)).nice();
        } else {
            // Filter data to get the selected points using the isBrushed function
            const selectedData = data.filter(d =>
                isBrushed(extent, x(d.stream), y(d.views))
            );

            // Create additional plots with the selected data
            createAdditionalPlots(selectedData);

            // Reset the brush area to none
            svg.select(".brush").call(brush.move, null);
        }
    }

    // Function to determine if a point is within the brushed area
    function isBrushed(brush_coords, cx, cy) {
        const x0 = brush_coords[0][0],
            y0 = brush_coords[0][1],
            x1 = brush_coords[1][0],
            y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    function drawAdditionalPlot(attributeData, attribute) {

        console.log("Drawing additional plots for attribute:", attribute);

        // Set the dimensions for the additional scatter plots
        const margin = { top: 10, right: 30, bottom: 30, left: 40 },
            width = 300 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // Create SVG for additional scatter plot
        const svg = d3.select("#additional-plots")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis
        const x = d3.scaleLinear()
            .domain(d3.extent(attributeData, d => d.x))
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(attributeData, d => d.y)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add dots for the scatter plot
        svg.append('g')
            .selectAll("dot")
            .data(attributeData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 3)
            .style("fill", "#69b3a2");

        // Add the attribute name as a label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.top + 20)
            .text(attribute);
    }

    function createAdditionalPlots(selectedData) {
        const attributes = ['Danceability', 'Energy', 'Key', 'Loudness', 'Speechiness', 'Acousticness', 'Instrumentalness', 'Liveness', 'Valence', 'Tempo', 'Duration_ms'];
        const averages = {
            stream: d3.mean(selectedData, d => d.stream),
            views: d3.mean(selectedData, d => d.views)
        };

        // Clear any existing additional plots
        d3.select("#additional-plots").selectAll("*").remove();

        // Create a scatter plot for each attribute
        attributes.forEach(attribute => {
            const attributeData = selectedData.map(d => ({
                x: +d[attribute],
                y: (averages.stream + averages.views) / 2
            }));

            // Draw the scatter plot for the attribute
            drawAdditionalPlot(attributeData, attribute);
        });
    }

    // A function that sets idleTimeOut to null
    const idled = () => idleTimeout = null;
    let idleTimeout;
    const idleDelay = 350;
});