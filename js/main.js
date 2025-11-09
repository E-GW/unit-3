(function(){
    // pseudo‑global variables
    var attrArray = ["varA", "varB", "varC", "varD", "varE"];
    var expressed = attrArray[0]; // initial attribute

    window.onload = setMap;

    function setMap(){
        var width = window.innerWidth * 0.5,
            height = 460;

        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

        var projection = d3.geoAlbers()
            .center([0, 46.2])
            .rotate([-2, 0, 0])
            .parallels([43, 62])
            .scale(2500)
            .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(projection);

        var promises = [
            d3.csv("data/unitsData.csv"),
            d3.json("data/EuropeCountries.topojson"),
            d3.json("data/FranceRegions.topojson")
        ];

        Promise.all(promises).then(function(data){
            callback(data, map, path);
        });
    }

    function callback(data, map, path){
        var csvData = data[0],
            europe = data[1],
            france = data[2];

        setGraticule(map, path);

        var europeCountries = topojson.feature(europe, europe.objects.EuropeCountries);
        var franceRegions = topojson.feature(france, france.objects.FranceRegions).features;

        // add Europe countries (background)
        map.append("path")
            .datum(europeCountries)
            .attr("class", "countries")
            .attr("d", path);

        // join CSV data to GeoJSON properties
        franceRegions = joinData(franceRegions, csvData);

        // — Create color scale using preferred method —
        // Uncomment one of the three style blocks below:

        // **Block 1 style** (quantile based on all values)  
        //var colorScale = makeColorScale_Block1(csvData);

        // **Block 2 style** (quantile based on min & max)  
        // var colorScale = makeColorScale_Block2(csvData);

        // **Block 3 style** (threshold with natural breaks via ckmeans)  
        var colorScale = makeColorScale_Block3(csvData);

        // — Now add enumeration units with colorScale passed in —
        setEnumerationUnits(franceRegions, map, path, colorScale);

        //add coordinated visualization to the map
        setChart(csvData, colorScale);
    }

    //function to create coordinated bar chart
    function setChart(csvData, colorScale){
        //chart frame dimensions
        var chartWidth = window.innerWidth * 0.425,
            chartHeight = 460;

        //create a second svg element to hold the bar chart
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");

        //create a scale to size bars proportionally to frame
        var yScale = d3.scaleLinear()
            .range([0, chartHeight])
            .domain([0, 105]);

        //set bars for each province
        var bars = chart.selectAll(".bars")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function(a, b){
                return a[expressed]-b[expressed]
            })
            .attr("class", function(d){
                return "bars " + d.adm1_code;
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
                return colorScale(d[expressed]);
            });

        //annotate bars with attribute value text
        var numbers = chart.selectAll(".numbers")
            .data(csvData)
            .enter()
            .append("text")
            .sort(function(a, b){
                return a[expressed]-b[expressed]
            })
            .attr("class", function(d){
                return "numbers " + d.adm1_code;
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
                return d[expressed];
            });

        var chartTitle = chart.append("text")
        .attr("x", 20)
        .attr("y", 40)
        .attr("class", "chartTitle")
        .text("Number of Variable " + expressed[3] + " in each region");
    };

    function setGraticule(map, path){
        var graticule = d3.geoGraticule()
            .step([5, 5]); // every 5 degrees

        map.append("path")
            .datum(graticule.outline())
            .attr("class", "gratBackground")
            .attr("d", path);

        map.selectAll(".gratLines")
            .data(graticule.lines())
            .enter()
            .append("path")
            .attr("class", "gratLines")
            .attr("d", path);
    }

    function joinData(franceRegions, csvData){
        for (var i = 0; i < csvData.length; i++){
            var csvRegion = csvData[i];
            var csvKey = csvRegion.adm1_code;

            for (var a = 0; a < franceRegions.length; a++){
                var geojsonProps = franceRegions[a].properties;
                var geojsonKey = geojsonProps.adm1_code;

                if (geojsonKey === csvKey){
                    attrArray.forEach(function(attr){
                        var val = parseFloat(csvRegion[attr]);
                        geojsonProps[attr] = val;
                    });
                }
            }
        }
        return franceRegions;
    }

    function setEnumerationUnits(franceRegions, map, path, colorScale){
        map.selectAll(".regions")
            .data(franceRegions.filter(function(d){
                // Only include regions that have a value for the expressed variable
                return d.properties[expressed] !== undefined && !isNaN(d.properties[expressed]);
            }))
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.adm1_code;
            })
            .attr("d", path)
            .style("fill", function(d){
                var val = d.properties[expressed];
                return colorScale(val); // no fallback needed — we filtered already
            });
    }


    /* ====== Block 1: makeColorScale style 1 ====== */
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

        var domainArray = [];
        for (var i = 0; i < data.length; i++){
            var val = parseFloat(data[i][expressed]);
            domainArray.push(val);
        }
        colorScale.domain(domainArray);

        return colorScale;
    }

    /* ====== Block 2: makeColorScale style 2 ====== */
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

    /* ====== Block 3: makeColorScale style 3 (threshold + natural breaks) ====== */
    function makeColorScale_Block3(data){
        var colorClasses = [
            "#D4B9DA",
            "#C994C7",
            "#DF65B0",
            "#DD1C77",
            "#980043"
        ];

        //create color scale generator
        var colorScale = d3.scaleThreshold()
            .range(colorClasses);

        //build array of all values of the expressed attribute
        var domainArray = [];
        for (var i=0; i<data.length; i++){
            var val = parseFloat(data[i][expressed]);
            domainArray.push(val);
        };

        //cluster data using ckmeans clustering algorithm to create natural breaks
        var clusters = ss.ckmeans(domainArray, 5);
        //reset domain array to cluster minimums
        domainArray = clusters.map(function(d){
            return d3.min(d);
        });
        //remove first value from domain array to create class breakpoints
        domainArray.shift();

        //assign array of last 4 cluster minimums as domain
        colorScale.domain(domainArray);

        return colorScale;
    };

})();
