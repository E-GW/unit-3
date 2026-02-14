// Full Encasing Function
(function () {
    // ------------------------------------------------------
    // Attribute definitions (safe keys + human-readable labels)
    // ------------------------------------------------------
    const attrArray = [
        // Totals & vehicles
        { key: "total_households", label: "Total households" },
        { key: "hh_no_vehicle", label: "Households with no vehicle available" },
        { key: "hh_1_vehicle", label: "Households with 1 vehicle available" },
        { key: "hh_2_vehicle", label: "Households with 2 vehicles available" },
        { key: "hh_3_vehicle", label: "Households with 3 vehicles available" },
        { key: "hh_4plus_vehicle", label: "Households with 4+ vehicles available" },

        // 1-person households
        { key: "hh_1p_total", label: "1-person households" },
        { key: "hh_1p_no_vehicle", label: "1-person households with no vehicle available" },
        { key: "hh_1p_1_vehicle", label: "1-person households with 1 vehicle available" },
        { key: "hh_1p_2_vehicle", label: "1-person households with 2 vehicles available" },
        { key: "hh_1p_3_vehicle", label: "1-person households with 3 vehicles available" },
        { key: "hh_1p_4plus_vehicle", label: "1-person households with 4+ vehicles available" },

        // 2-person households
        { key: "hh_2p_total", label: "2-person households" },
        { key: "hh_2p_no_vehicle", label: "2-person households with no vehicle available" },
        { key: "hh_2p_1_vehicle", label: "2-person households with 1 vehicle available" },
        { key: "hh_2p_2_vehicle", label: "2-person households with 2 vehicles available" },
        { key: "hh_2p_3_vehicle", label: "2-person households with 3 vehicles available" },
        { key: "hh_2p_4plus_vehicle", label: "2-person households with 4+ vehicles available" },

        // 3-person households
        { key: "hh_3p_total", label: "3-person households" },
        { key: "hh_3p_no_vehicle", label: "3-person households with no vehicle available" },
        { key: "hh_3p_1_vehicle", label: "3-person households with 1 vehicles available" }, // note: "vehicles" in CSV
        { key: "hh_3p_2_vehicle", label: "3-person households with 2 vehicles available" },
        { key: "hh_3p_3_vehicle", label: "3-person households with 3 vehicles available" },
        { key: "hh_3p_4plus_vehicle", label: "3-person households with 4+ vehicles available" },

        // 4+ person households
        { key: "hh_4plus_total", label: "4+ person households" },
        { key: "hh_4plus_no_vehicle", label: "4+ person households with no vehicle available" },
        { key: "hh_4plus_1_vehicle", label: "4+ person households with 1 vehicle available" },
        { key: "hh_4plus_2_vehicle", label: "4+ person households with 2 vehicles available" },
        { key: "hh_4plus_3_vehicle", label: "4+ person households with 3 vehicles available" },
        { key: "hh_4plus_4plus_vehicle", label: "4+ person households with 4+ vehicles available" },

        // % of all households
        { key: "pct_hh_no_vehicle", label: "% of households with no vehicle available" },
        { key: "pct_hh_1_vehicle", label: "% of households with 1 vehicle available" },
        { key: "pct_hh_2_vehicle", label: "% of households with 2 vehicles available" },
        { key: "pct_hh_3_vehicle", label: "% of households with 3 vehicles available" },
        { key: "pct_hh_4plus_vehicle", label: "% of households with 4+ vehicles available" },

        // % of 1-person households
        { key: "pct_hh_1p_total", label: "% of 1-person households" },
        { key: "pct_hh_1p_no_vehicle", label: "% of 1-person households with no vehicle available" },
        { key: "pct_hh_1p_1_vehicle", label: "% of 1-person households with 1 vehicle available" },
        { key: "pct_hh_1p_2_vehicle", label: "% of 1-person households with 2 vehicles available" },
        { key: "pct_hh_1p_3_vehicle", label: "% of 1-person households with 3 vehicles available" },
        { key: "pct_hh_1p_4plus_vehicle", label: "% of 1-person households with 4+ vehicles available" },

        // % of 2-person households
        { key: "pct_hh_2p_total", label: "% of 2-person households" },
        { key: "pct_hh_2p_no_vehicle", label: "% of 2-person households with no vehicle available" },
        { key: "pct_hh_2p_1_vehicle", label: "% of 2-person households with 1 vehicle available" },
        { key: "pct_hh_2p_2_vehicle", label: "% of 2-person households with 2 vehicles available" },
        { key: "pct_hh_2p_3_vehicle", label: "% of 2-person households with 3 vehicles available" },
        { key: "pct_hh_2p_4plus_vehicle", label: "% of 2-person households with 4+ vehicles available" },

        // % of 3-person households
        { key: "pct_hh_3p_total", label: "% of 3-person households" },
        { key: "pct_hh_3p_no_vehicle", label: "% of 3-person households with no vehicle available" },
        { key: "pct_hh_3p_1_vehicle", label: "% of 3-person households with 1 vehicle available" },
        { key: "pct_hh_3p_2_vehicle", label: "% of 3-person households with 2 vehicles available" },
        { key: "pct_hh_3p_3_vehicle", label: "% of 3-person households with 3 households available" }, // note typo in label kept to match CSV
        { key: "pct_hh_3p_4plus_vehicle", label: "% of 3-person households with 4+ vehicles available" },

        // % of 4+ person households
        { key: "pct_hh_4plus_total", label: "% of 4+ person households" },
        { key: "pct_hh_4plus_no_vehicle", label: "% of 4+ person households with no vehicle available" },
        { key: "pct_hh_4plus_1_vehicle", label: "% of 4+ person households with 1 vehicle available" },
        { key: "pct_hh_4plus_2_vehicle", label: "% of 4+ person households with 2 vehicles available" },
        { key: "pct_hh_4plus_3_vehicle", label: "% of 4+ person households with 3 vehicles available" },
        { key: "pct_hh_4plus_4plus_vehicle", label: "% of 4+ person households with 4+ vehicles available" },

        // Geometry
        { key: "shape_area", label: "Shape__Area" },
        { key: "shape_length", label: "Shape__Length" }
    ];

    // Currently selected attribute (key form, not label)
    let expressed = attrArray[0].key;

    // Helper: get current attribute object {key, label}
    function getCurrentAttr() {
        return attrArray.find(a => a.key === expressed) || attrArray[0];
    }

    // Shared tooltip for the map
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // ------------------------------------------------------
    // Create dropdown/menu before map/chart are built
    // ------------------------------------------------------
    function createAttributeDropdown() {
        const container = d3.select("body")
            .append("div")
            .attr("class", "map-container");

        container.append("select")
            .attr("id", "attributeSelector")
            .on("change", function () {
                expressed = this.value; // this.value is the key
                d3.selectAll("svg").remove();
                setMap();
            })
            .selectAll("option")
            .data(attrArray)
            .enter()
            .append("option")
            .attr("value", d => d.key)
            .text(d => d.label);

        d3.select("#attributeSelector").property("value", expressed);
    }
    
    function verbalizeLabel(label) {
        // Basic number → word conversion
        const numWords = {
            "0": "zero",
            "1": "one",
            "2": "two",
            "3": "three",
            "4": "four",
            "5": "five",
            "6": "six",
            "7": "seven",
            "8": "eight",
            "9": "nine"
        };

        // Replace digits with English words:
        let out = label.replace(/(\d+)\s*-\s*person/g, (_, n) => {
            return `${numWords[n] || n}-person`;
        });

        // Handle 4+ (four-plus)
        out = out.replace(/4\+ person/g, "four-plus-person");

        return out;
    }

    function smartTitleCase(str) {
        // Words that should NOT be capitalized unless first/last
        const minorWords = [
            "a","an","and","as","at","but","by","for","in","nor","of","on",
            "or","per","the","to","vs","via","with"
        ];

        return str
            .split(/\s+/)
            .map((word, index, allWords) => {
                let lower = word.toLowerCase();

                // Always capitalize first & last word
                if (index === 0 || index === allWords.length - 1) {
                    return capitalizeWord(word);
                }

                // If minor word → keep lowercase
                if (minorWords.includes(lower)) {
                    return lower;
                }

                // Otherwise → smart capitalize (handles hyphens)
                return capitalizeWord(word);
            })
            .join(" ");
    }

    // Properly capitalize hyphenated words (Three-Person, Four-Plus-Person)
    function capitalizeWord(word) {
        return word
            .split("-")
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join("-");
    }



    // Launch map setup when page loads
    window.onload = function () {
        createAttributeDropdown();
        setMap();
    };

    // ------------------------------------------------------
    // Map SVG and Load Data
    // ------------------------------------------------------
    function setMap() {
        const width = window.innerWidth * 0.5, // Responsive map width
            height = 460;

        // Create main svg container for the map
        const map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

        // Water background for map
        map.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#c0c094ff");

        // Projection centered on Madison, Wisconsin
        const projection = d3.geoEquirectangular()
            .center([-89.4, 43.07])
            .scale(110000)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        // Load the csv and topojson files
        const promises = [
            d3.csv("data/Madison_Household_Vehicles.csv"),
            d3.json("data/Madison_Household_Vehicles.topojson")
        ];

        Promise.all(promises)
            .then(function (data) {
                let csvData = data[0];
                const vehiclesTopo = data[1];

                // Precompute numeric values on csvData using safe keys  uuu
                csvData.forEach(row => {
                    attrArray.forEach(attr => {
                        const raw = row[attr.label]; // original column header
                        const val = (raw === undefined || raw === null || raw === "") ? NaN : parseFloat(raw);
                        row[attr.key] = val;
                    });
                });

                callback(csvData, vehiclesTopo, map, path);
            })
            .catch(function (err) {
                console.error("Error loading files: ", err);
            });
    }

    // ------------------------------------------------------
    // Main Callback Function (Once Data is Loaded)
    // ------------------------------------------------------
    function callback(csvData, vehiclesTopo, map, path) {
        let vehiclesGeo = topojson.feature(
            vehiclesTopo,
            vehiclesTopo.objects[Object.keys(vehiclesTopo.objects)[0]]
        ).features;

        // Draw the base shapes (unshaded)
        map.selectAll(".regions")
            .data(vehiclesGeo)
            .enter()
            .append("path")
            .attr("class", "regions")
            .attr("d", path);

        // Attach csv attributes to GeoJSON features
        vehiclesGeo = joinData(vehiclesGeo, csvData);

        // Make color scale for choropleth shading
        const colorScale = makeColorScale(csvData);

        // Put polygons on the map with shading & tooltip & highlighting
        setEnumerationUnits(vehiclesGeo, map, path, colorScale, csvData);

        // Show the bar chart beside the map
        setChart(csvData, colorScale, vehiclesGeo);
    }

    // ------------------------------------------------------
    // Join the CSV to the GeoJSON
    // ------------------------------------------------------
    function joinData(geoFeatures, csvData) {
        for (let i = 0; i < csvData.length; i++) {
            const csvRow = csvData[i];
            const csvKey = csvRow.GEOID.trim();

            for (let j = 0; j < geoFeatures.length; j++) {
                const geoProps = geoFeatures[j].properties;
                const geoKey = geoProps.GEOID.toString().trim();

                if (csvKey === geoKey) {
                    // Copy all numeric attributes (using safe keys)
                    attrArray.forEach(attr => {
                        const val = csvRow[attr.key]; // already parsed
                        geoProps[attr.key] = val;
                    });

                    // Name (if present)
                    geoProps.NAME = csvRow.NAME;
                }
            }
        }
        return geoFeatures;
    }

    // ------------------------------------------------------
    // Put units on the Map with tooltip & linked highlight
    // ------------------------------------------------------
    function setEnumerationUnits(geoFeatures, map, path, colorScale, csvData) {
        const filteredFeatures = geoFeatures.filter(d =>
            d.properties[expressed] !== undefined &&
            !isNaN(d.properties[expressed])
        );

        const regions = map.selectAll("path.region")
            .data(filteredFeatures, d => d.properties.GEOID);

        regions.exit().remove();

        const regionsEnter = regions.enter()
            .append("path")
            .attr("class", d => "region region" + d.properties.GEOID)
            .attr("d", path)
            .style("stroke", "#000")
            .style("stroke-width", "0.5px")
            .on("mouseover", function (event, d) {
                const currentAttr = getCurrentAttr();

                // highlight on map
                d3.select(this)
                    .style("stroke", "#000")
                    .style("stroke-width", "1.5px")
                    .raise();

                // also highlight corresponding bar
                d3.select(".bars.bar" + d.properties.GEOID)
                    .style("stroke", "#000")
                    .style("stroke-width", "2px")
                    .style("opacity", 1);

                // tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);

                const value = d.properties[expressed];
                tooltip.html(`
                    <strong>${d.properties.NAME || "Unknown tract"}</strong><br>
                    ${currentAttr.label}: ${value != null && !isNaN(value) ? value : "N/A"}
                `)
                    .style("left", (event.pageX - 50) + "px")
                    .style("top", (event.pageY - 40) + "px");
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .style("stroke", "#000")
                    .style("stroke-width", "0.5px");

                d3.select(".bars.bar" + d.properties.GEOID)
                    .style("stroke", "none")
                    .style("opacity", 0.95);

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        regionsEnter.merge(regions)
            .style("fill", d => {
                const val = d.properties[expressed];

                if (val === 0) return "#d5d5d5ff";   // <-- gray for zero (pick shade)
                if (isNaN(val)) return "#ccc";     // unchanged
                return colorScale(val);            // natural breaks for > 0
            });

    }

    // ------------------------------------------------------
    // Bar Chart (with linked highlight)
    // ------------------------------------------------------
    function setChart(csvData, colorScale, geoFeatures) {
        const chartWidth = window.innerWidth * 0.425,
            chartHeight = 460;

        const chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");

        const topPadding = 10,
            bottomPadding = 10,
            leftPadding = 30;

        const maxVal = d3.max(csvData, d => parseFloat(d[expressed]));
        const yScale = d3.scaleLinear()
            .range([chartHeight - bottomPadding, topPadding])
            .domain([0, maxVal || 0]);

        // Y axis
        chart.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${leftPadding}, 0)`)
            .call(d3.axisLeft(yScale).ticks(8));

        // Horizontal grid lines
        chart.selectAll(".horizontalGrid")
            .data(yScale.ticks(8))
            .enter()
            .append("line")
            .attr("class", "horizontalGrid")
            .attr("x1", leftPadding)
            .attr("x2", chartWidth)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d));

        // Separate tooltip for bars (optional - you can reuse the same one if desired)
        const tooltipChart = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        // Remove rows where expressed value is missing or NaN
        const validData = csvData.filter(d => {
            const v = parseFloat(d[expressed]);
            return v != null && !isNaN(v);
        });


        const barWidth = (chartWidth - leftPadding) / validData.length;

        // 1. Make a sorted copy of validData
        const sortedData = validData.slice().sort((a, b) => {
            return parseFloat(b[expressed]) - parseFloat(a[expressed]);
        });

        chart.selectAll(".bars")
            .data(sortedData, d => d.GEOID)
            .enter()
            .append("rect")
            .attr("class", d => "bars bar" + d.GEOID)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("x", (d, i) => leftPadding + i * barWidth)
            .attr("y", d => yScale(parseFloat(d[expressed])))
            .attr("width", barWidth - 1)
            .attr("height", d => {
                const v = parseFloat(d[expressed]);
                return chartHeight - bottomPadding - yScale(v);
            })
            .style("fill", d => colorScale(parseFloat(d[expressed])))
            .style("opacity", 0.95)
            .on("mouseover", function (event, d) {
                // highlight bar
                d3.select(this)
                    .style("stroke", "#000")
                    .style("stroke-width", "2px")
                    .style("opacity", 1);

                // highlight corresponding map region
                d3.select(".region" + d.GEOID)
                    .style("stroke", "#000")
                    .style("stroke-width", "1.5px")
                    .raise();

                tooltipChart.transition()
                    .duration(200)
                    .style("opacity", 0.9);

                const value = d[expressed];
                tooltipChart.html(`
                    <strong>${d.NAME || d.ID || "Unknown tract"}</strong><br>
                    ${currentAttr.label}: ${value != null && !isNaN(value) ? value : "N/A"}
                `)
                    .style("left", (event.pageX - 35) + "px")
                    .style("top", (event.pageY - 48) + "px");
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.95);

                d3.select(".region" + d.GEOID)
                    .style("stroke", "#000")
                    .style("stroke-width", "0.5px");

                tooltipChart.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Chart title (static; you can make this dynamic based on expressed if you want)
        const currentAttr = getCurrentAttr();
        const readable = verbalizeLabel(currentAttr.label);
        const titleText = smartTitleCase(readable);



        let title = chart.append("text")
            .attr("x", chartWidth / 2)
            .attr("y", 25)
            .attr("class", "chartTitle")
            .attr("text-anchor", "middle")
            .text(titleText);
    
        // ------------------
        // ADD LEGEND
        // ------------------
        function addLegend(chart, colorScale, chartWidth, chartHeight) {
            chart.selectAll(".legendGroup").remove();

            const zeroColor = "#d5d5d5ff";   // match map zero color

            const legendGroup = chart.append("g")
                .attr("class", "legendGroup")
                .attr("transform", `translate(${chartWidth - 200}, 60)`);

            const legendBg = legendGroup.append("rect")
                .attr("class", "legendBackground")
                .attr("width", 195)
                .attr("height", 175) // Adjust as needed for your legend items
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("fill", "#ffffffcc") // semi-transparent white
                .attr("stroke", "#666")
                .attr("stroke-width", 1);

            const legendTitle = legendGroup.append("text")
                .attr("class", "legendTitle")
                .attr("x", 10)
                .attr("y", 15)
                .style("font-weight", "bold")
                .style("font-size", "16px")
                .text("Number of Households");

            const thresholds = colorScale.domain();
            const colors = colorScale.range();
            const ranges = [];

            ranges.push({
                color: colors[0],
                label: `< ${thresholds[0].toFixed(0)}`
            });

            for (let i = 0; i < thresholds.length - 1; i++) {
                ranges.push({
                    color: colors[i + 1],
                    label: `${thresholds[i].toFixed(0)} - ${thresholds[i + 1].toFixed(0)}`
                });
            }

            ranges.push({
                color: colors[colors.length - 1],
                label: `> ${thresholds[thresholds.length - 1].toFixed(0)}`
            });

            ranges.reverse();

            ranges.push({
                color: zeroColor,
                label: "Zero Households"
            });

            const legendItem = legendGroup.selectAll(".legendItem")
                .data(ranges)
                .enter()
                .append("g")
                .attr("class", "legendItem")
                .attr("transform", (d, i) => `translate(10, ${25 + i * 22})`);

            legendItem.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", d => d.color)
                .attr("stroke", "#000")
                .attr("stroke-width", 0.5);

            legendItem.append("text")
                .attr("x", 28)
                .attr("y", 15)
                .style("font-size", "13px")
                .text(d => d.label);
        }


        addLegend(chart, colorScale, chartWidth, chartHeight);

        // Wrap title to fit within chart width
        wrapText(title, chartWidth * 0.9);
    
    }

    function wrapText(text, width) {
        text.each(function () {
            let textObj = d3.select(this);
            let words = textObj.text().split(/\s+/).reverse();
            let line = [];
            let lineNumber = 0;
            let lineHeight = 1.2; // ems
            let x = textObj.attr("x");
            let y = textObj.attr("y");
            let dy = 0;
            let tspan = textObj.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");

            let word;
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));

                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = textObj.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", (++lineNumber * lineHeight) + "em")
                        .text(word);
                }
            }
        });
    }


    // ------------------------------------------------------
    // Color Scale function
    // ------------------------------------------------------
    function makeColorScale(data) {
        const colorClasses = [
            '#edf8e9',
            '#bae4b3',
            '#74c476',
            '#238b45'
        ];

        const colorScale = d3.scaleThreshold().range(colorClasses);

        let domainArray = data
            .map(d => parseFloat(d[expressed]))
            .filter(val => !isNaN(val));

        if (domainArray.length === 0) {
            console.warn("No valid numeric values found for", expressed);
            colorScale.domain([0, 1, 2, 3, 4]);
            return colorScale;
        }

        const clusters = ss.ckmeans(domainArray, 5);
        domainArray = clusters.map(d => d3.min(d));
        domainArray.shift(); // remove the minimum of the first cluster
        colorScale.domain(domainArray);

        return colorScale;
    }

    // ------------------------------------------------------
    // Redraw map & chart on window resize
    // ------------------------------------------------------
    window.addEventListener("resize", () => {
        d3.selectAll("svg").remove();
        setMap();
    });
})(); // end of script
