
// Full Encasing Function
(function(){
    // Pseudo-global variables
    var attrArray = ["Obesity"];  // List of attributes (only one: Obesity)
    var expressed = attrArray[0]; // Currently selected attribute

    // Shared tooltip for the map and chart
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    // Launch map setup when page loads
    window.onload = setMap;


    
    // Map SVG and Load Data Function
    function setMap(){
        var width = window.innerWidth * 0.5,  // Responsive map width
            height = 460;

        // Create the main svg container for the map
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

        // Water background for map
        map.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#d9ecffff");

        // Eckert IV projection, centered on North America
        var projection = d3.geoEckert4()
            .center([-95, 38])       // Long/Lat center point
            .scale(550)              // Zoom level
            .translate([width / 2, height / 2]); // Center in SVG

        var path = d3.geoPath().projection(projection);

        // Load the csv and topojson files
        var promises = [
            d3.csv("data/national_obesity_prcntg_by_state.csv"), // attribute data
            d3.json("data/world_countries.topojson"),             // background countries
            d3.json("data/national_obesity_prcntg_by_state_reproj.topojson") // states
        ];

        Promise.all(promises).then(function(data){
            callback(data, map, path); // Proceed once data is loaded
        }).catch(function(err){
            console.error("Error loading files: ", err);
        });
    }


    // Main Callback Function (Once Data is Loaded)
    function callback(data, map, path){
        var csvData = data[0],    // attribute values
            world = data[1],      // background topojson
            statesTopo = data[2]; // main state layer topojson

        // Debug logs for inspecting object names
        console.log(Object.keys(world.objects));
        console.log(Object.keys(statesTopo.objects));

        // Convert topojson to geojson for the map background
        var worldCountries = topojson.feature(world, world.objects.ne_50m_admin_0_countries_lakes);

        // Convert states topojson to geojson features
        var statesGeo = topojson.feature(statesTopo, statesTopo.objects.LakeCounty_Health_6754225320146509562).features;

        // Draw world countries
        map.append("path")
            .datum(worldCountries)
            .attr("class", "countries")
            .attr("d", path);

        // Attach csv attributes to the state geojson features
        statesGeo = joinData(statesGeo, csvData);

        // Make color scale for choropleth shading
        var colorScale = makeColorScale(csvData);

        // Put state polygons on the map
        setEnumerationUnits(statesGeo, map, path, colorScale);

        // Show the bar chart beside the map
        setChart(csvData, colorScale);
    }


    // Join the CSV to the GeoJSON Function
    function joinData(geoFeatures, csvData){
        for (var i = 0; i < csvData.length; i++){
            var csvRow = csvData[i];               // current row in csv
            var csvStateName = csvRow.NAME;        // state name from csv

            for (var a = 0; a < geoFeatures.length; a++){
                var geoProps = geoFeatures[a].properties;
                var geoStateName = geoProps.NAME;  // state name from geojson

                // Match by name and transfer value(s)
                if (geoStateName === csvStateName){
                    attrArray.forEach(function(attr){
                        var val = parseFloat(csvRow[attr]);
                        geoProps[attr] = val; // Attach value to geojson properties
                    });
                }
            }
        }
        return geoFeatures;
    }


    //Put States on the Map with the Info-on-Hover (tooltip) Feature Function
    function setEnumerationUnits(geoFeatures, map, path, colorScale) {
        map.selectAll(".regions")
            .data(geoFeatures.filter(d => d.properties[expressed] !== undefined && !isNaN(d.properties[expressed])))
            .enter()
            .append("path")
            .attr("class", d => "regions " + d.properties.NAME.replace(/\s+/g, ''))
            .attr("d", path)
            .style("fill", d => colorScale(d.properties[expressed]))

            // Tooltip on hover
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .style("stroke", "#000")
                    .style("stroke-width", 1.5)
                    .raise();

                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`<strong>${d.properties.NAME}</strong><br>${d.properties[expressed]}%`)
                    .style("left", (event.pageX - 50) + "px")
                    .style("top", (event.pageY - 40) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .style("stroke", "#000")
                    .style("stroke-width", 0.5);

                tooltip.transition().duration(500).style("opacity", 0);
            });
    }


    // Bar Chart function
    function setChart(csvData, colorScale) {
        var chartWidth = window.innerWidth * 0.425,
            chartHeight = 460;

        // Create the chart svg
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");

        // Set chart vertical scale and page padding
        var topPadding = 10,
            bottomPadding = 10;

        var yScale = d3.scaleLinear()
            .range([chartHeight - bottomPadding, topPadding])
            .domain([0, 40]); // assume max obesity % ~40

        // Add y-axis
        chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(30, 0)")
            .call(d3.axisLeft(yScale).ticks(8));

        // Add horizontal gridlines for reference
        chart.selectAll(".horizontalGrid")
            .data(yScale.ticks(8))
            .enter()
            .append("line")
            .attr("class", "horizontalGrid")
            .attr("x1", 30)
            .attr("x2", chartWidth)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d));

        // Tooltip (hover feature) for bars on the chart
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var barWidth = (chartWidth - 30) / csvData.length; // -30 for axis padding

        // Render chart bars
        chart.selectAll(".bars")
            .data(csvData)
            .enter()
            .append("rect")
            .sort((a, b) => parseFloat(b[expressed]) - parseFloat(a[expressed])) // sort bars
            .attr("class", d => "bars " + d.NAME.replace(/\s+/g, ''))
            .attr("rx", 3)  // rounded corners
            .attr("ry", 3)
            .attr("x", (d, i) => 30 + i * barWidth)
            .attr("y", d => yScale(parseFloat(d[expressed])))
            .attr("width", barWidth - 1)
            .attr("height", d => chartHeight - bottomPadding - yScale(parseFloat(d[expressed])))
            .style("fill", d => colorScale(parseFloat(d[expressed])))

            // Tooltip on hover
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`<strong>${d.NAME}</strong><br>${d[expressed]}%`)
                    .style("left", (event.pageX - 35) + "px")
                    .style("top", (event.pageY - 48) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        // Add chart title
        chart.append("text")
            .attr("x", chartWidth / 2)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .attr("text-anchor", "middle")
            .text("Obesity Percentage by State");
    }


    // Color Scale function
    function makeColorScale(data){
        // 5-class color scheme from light to dark blue (from ColorBrewer)
        var colorClasses = [
            '#eff3ff',
            '#bdd7e7',
            '#6baed6',
            '#3182bd',
            '#08519c'
        ];

        var colorScale = d3.scaleThreshold().range(colorClasses);

        // Collect all values of the expressed attribute
        var domainArray = data.map(d => parseFloat(d[expressed]));

        // Group values into 5 natural breaks using ckmeans
        var clusters = ss.ckmeans(domainArray, 5);
        domainArray = clusters.map(d => d3.min(d)); // get min of each cluster
        domainArray.shift(); // remove the first minimum to use as thresholds

        colorScale.domain(domainArray); // assign thresholds to color scale

        return colorScale;
    }

// End of Script (obviously)
})();
