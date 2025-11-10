(function(){
    // pseudo‑global variables
    var attrArray = ["Obesity"];  // only one attribute currently
    var expressed = attrArray[0]; // initial attribute: Obesity

    window.onload = setMap;

    function setMap(){
        var width = window.innerWidth * 0.5,
            height = 460;

        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

        map.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#d9ecffff"); // Light blue water background


        var projection = d3.geoEckert4()
            .center([-95, 38]) // Center over the continental U.S.
            .scale(500)        // Increase scale to fit all U.S. + territories
            .translate([width / 2, height / 2]); // Center in the SVG


        var path = d3.geoPath()
            .projection(projection);

        var promises = [
            d3.csv("data/national_obesity_prcntg_by_state.csv"),
            d3.json("data/world_countries.topojson"),
            d3.json("data/national_obesity_prcntg_by_state_reproj.topojson")
        ];

        Promise.all(promises).then(function(data){
            callback(data, map, path);
        }).catch(function(err){
            console.error("Error loading files: ", err);
        });
    }

    function callback(data, map, path){
        var csvData = data[0],
            world = data[1],
            statesTopo = data[2];
        
        console.log(Object.keys(world.objects));        // likely 'countries', but confirm
        console.log(Object.keys(statesTopo.objects));   // could be 'states', 'layer', etc.


        // convert world topojson to geojson
        var worldCountries = topojson.feature(world, world.objects.ne_50m_admin_0_countries_lakes);  // adjust object name if needed

        // convert states topojson to geojson
        var statesGeo = topojson.feature(statesTopo, statesTopo.objects.LakeCounty_Health_6754225320146509562).features;  // adjust object name if needed

        // add world countries as background layer
        map.append("path")
            .datum(worldCountries)
            .attr("class", "countries")
            .attr("d", path);

        // join CSV data to statesGeo features
        statesGeo = joinData(statesGeo, csvData);

        // create color scale
        var colorScale = makeColorScale_Block3(csvData);

        // add states layer on top
        setEnumerationUnits(statesGeo, map, path, colorScale);

        // add coordinated bar chart
        setChart(csvData, colorScale);
    }

    // joins the csv data to the GeoJSON features
    function joinData(geoFeatures, csvData){
        for (var i = 0; i < csvData.length; i++){
            var csvRow = csvData[i];
            var csvStateName = csvRow.NAME;

            for (var a = 0; a < geoFeatures.length; a++){
                var geoProps = geoFeatures[a].properties;
                var geoStateName = geoProps.NAME; // or whatever property holds the state name

                if (geoStateName === csvStateName){
                    attrArray.forEach(function(attr){
                        var val = parseFloat(csvRow[attr]);
                        geoProps[attr] = val;
                    });
                }
            }
        }
        return geoFeatures;
    }

    function setEnumerationUnits(geoFeatures, map, path, colorScale){
        map.selectAll(".regions")
            .data(geoFeatures.filter(function(d){
                return d.properties[expressed] !== undefined && !isNaN(d.properties[expressed]);
            }))
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.NAME.replace(/\s+/g, '');
            })
            .attr("d", path)
            .style("fill", function(d){
                return colorScale(d.properties[expressed]);
            })
            .append("title")
            .text(function(d){
                return d.properties.NAME + ": " + d.properties[expressed] + "%";
            });
    }

    // create bar chart
    function setChart(csvData, colorScale){
        var chartWidth = window.innerWidth * 0.425,
            chartHeight = 460;

        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");

        var yScale = d3.scaleLinear()
            .range([0, chartHeight])
            .domain([0, 40 /*d3.max(csvData, function(d){ return parseFloat(d[expressed]); })*/]);

        var bars = chart.selectAll(".bars")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function(a, b){
                return parseFloat(b[expressed]) - parseFloat(a[expressed]);
            })
            .attr("class", function(d){
                return "bars " + d.NAME.replace(/\s+/g, '');
            })
            .attr("width", chartWidth / csvData.length - 1)
            .attr("x", function(d, i){
                return i * (chartWidth / csvData.length);
            })
            .attr("height", function(d){
                return yScale(parseFloat(d[expressed]));
            })
            .attr("y", function(d){
                return chartHeight - yScale(parseFloat(d[expressed]));
            })
            .style("fill", function(d){
                return colorScale(parseFloat(d[expressed]));
            })
            .append("title")
            .text(function(d){
                return d.NAME + ": " + d[expressed] + "%";
            });

        var numbers = chart.selectAll(".numbers")
            .data(csvData)
            .enter()
            .append("text")
            .sort(function(a, b){
                return parseFloat(b[expressed]) - parseFloat(a[expressed]);
            })
            .attr("class", function(d){
                return "numbers " + d.NAME.replace(/\s+/g, '');
            })
            .attr("text-anchor", "middle")
            .attr("x", function(d, i){
                var fraction = chartWidth / csvData.length;
                return i * fraction + (fraction - 1) / 2;
            })
            .attr("y", function(d){
                return chartHeight - yScale(parseFloat(d[expressed])) + 15;
            })
            .text(function(d){
                return d[expressed] + "%";
            });

        chart.append("text")
            .attr("x", 20)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .text("Obesity Percentage by State");
    }

    /* ====== Color scale functions ====== */
    function makeColorScale_Block1(data){
        var colorClasses = [
            "#D4B9DA",
            "#C994C7",
            "#DF65B0",
            "#DD1C77",
            "#980043"
        ];
        var colorScale = d3.scaleQuantile()
            .range(colorClasses);

        var domainArray = data.map(function(d){
            return parseFloat(d[expressed]);
        });

        colorScale.domain(domainArray);

        return colorScale;
    }

    function makeColorScale_Block2(data){
        var colorClasses = [
            "#D4B9DA",
            "#C994C7",
            "#DF65B0",
            "#DD1C77",
            "#980043"
        ];
        var colorScale = d3.scaleQuantile()
            .range(colorClasses);

        var minmax = [
            d3.min(data, function(d){ return parseFloat(d[expressed]); }),
            d3.max(data, function(d){ return parseFloat(d[expressed]); })
        ];
        colorScale.domain(minmax);

        return colorScale;
    }

    function makeColorScale_Block3(data){
        var colorClasses = [
            "#D4B9DA",
            "#C994C7",
            "#DF65B0",
            "#DD1C77",
            "#980043"
        ];

        var colorScale = d3.scaleThreshold()
            .range(colorClasses);

        var domainArray = data.map(function(d){
            return parseFloat(d[expressed]);
        });

        var clusters = ss.ckmeans(domainArray, 5);
        domainArray = clusters.map(function(d){
            return d3.min(d);
        });
        domainArray.shift();

        colorScale.domain(domainArray);

        return colorScale;
    }

})();
