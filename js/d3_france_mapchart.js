(function(){
    // Pseudo-global variables
    var attrArray = ["varA", "varB", "varC", "varD", "varE"];
    var expressed = attrArray[0];

    var chartWidth = window.innerWidth * 0.425,
        chartHeight = 460,
        leftPadding = 2,
        rightPadding = 2,
        topBottomPadding = 2,
        chartInnerWidth = chartWidth - leftPadding - rightPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

    var yScale = d3.scaleLinear()
        .range([463, 0])
        .domain([0, 110]);

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
            .attr("fill", "#d9ecffff");

        var projection = d3.geoAlbers()
            .center([0, 46.2])
            .rotate([-2, 0, 0])
            .parallels([43, 62])
            .scale(2500)
            .translate([width / 2, height / 2]);

        var path = d3.geoPath().projection(projection);

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

        var europeCountries = topojson.feature(europe, europe.objects.EuropeCountries);
        var franceRegions = topojson.feature(france, france.objects.FranceRegions).features;

        map.append("path")
            .datum(europeCountries)
            .attr("class", "countries")
            .attr("d", path);

        franceRegions = joinData(franceRegions, csvData);

        var colorScale = makeColorScale_Block3(csvData);
        setEnumerationUnits(franceRegions, map, path, colorScale);
        setChart(csvData, colorScale);
        createDropdown(csvData);
    }

    function createDropdown(csvData){
        var dropdown = d3.select("body")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function(){
                changeAttribute(this.value, csvData);
            });

        dropdown.append("option")
            .attr("class", "titleOption")
            .attr("disabled", true)
            .text("Select Attribute");

        dropdown.selectAll("attrOptions")
            .data(attrArray)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);
    }

    function changeAttribute(attribute, csvData){
        expressed = attribute;

        var colorScale = makeColorScale_Block3(csvData);

        d3.selectAll(".regions")
            .transition()
            .duration(1000)
            .style("fill", function(d){
                var value = d.properties[expressed];
                return value ? colorScale(value) : "#ccc";
            });

        var bars = d3.selectAll(".bar")
            .sort((a, b) => b[expressed] - a[expressed]);

        updateChart(bars, csvData.length, colorScale);

        // Update bar values (numbers)
        d3.selectAll(".numbers")
            .sort((a, b) => b[expressed] - a[expressed])
            .transition()
            .duration(1000)
            .attr("x", function(d, i){
                var fraction = chartInnerWidth / csvData.length;
                return i * fraction + leftPadding + (fraction - 1) / 2;
            })
            .attr("y", function(d){
                return yScale(parseFloat(d[expressed])) + topBottomPadding + 15;
            })
            .text(function(d){
                return d[expressed];
            });

        d3.select(".chartTitle")
            .text("Number of Variable " + expressed[3] + " in each region");
    }

    function updateChart(bars, n, colorScale){
        // Update bars
        bars.transition()
            .duration(1000)
            .attr("x", function(d, i){
                return i * (chartInnerWidth / n) + leftPadding;
            })
            .attr("height", function(d){
                return 463 - yScale(parseFloat(d[expressed]));
            })
            .attr("y", function(d){
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
            .style("fill", function(d){
                var value = d[expressed];
                return value ? colorScale(value) : "#ccc";
            });

        // Update or create bar value labels
        var numbers = d3.select(".chart").selectAll(".numbers")
            .data(bars.data());

        numbers.enter()
            .append("text")
            .attr("class", d => "numbers " + d.adm1_code)
            .merge(numbers)
            .transition()
            .duration(1000)
            .attr("text-anchor", "middle")
            .attr("x", function(d, i){
                var fraction = chartInnerWidth / n;
                return i * fraction + leftPadding + (fraction - 1) / 2;
            })
            .attr("y", function(d){
                return yScale(parseFloat(d[expressed])) + topBottomPadding + 15;
            })
            .text(d => d[expressed]);

        numbers.exit().remove();

        // Update chart title
        d3.select(".chartTitle")
            .text("Number of Variable " + expressed[3] + " in each region");
    }


    function setChart(csvData, colorScale){
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");

        chart.append("rect")
            .attr("class", "chartBackground")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate)
            .attr("fill", "#e0e0e0");

        var bars = chart.selectAll(".bar")
            .data(csvData)
            .enter()
            .append("rect")
            .sort((a, b) => b[expressed] - a[expressed])
            .attr("class", d => "bar " + d.adm1_code)
            .attr("width", chartInnerWidth / csvData.length - 1)
            .on("mouseover", function(event, d){
                highlight(d);
            });


        updateChart(bars, csvData.length, colorScale);

        chart.append("text")
            .attr("x", 40)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .text("Number of Variable " + expressed[3] + " in each region");
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
        .data(franceRegions.filter(d => d.properties[expressed] !== undefined && !isNaN(d.properties[expressed])))
        .enter()
        .append("path")
        .attr("class", d => "regions " + d.properties.adm1_code)
        .attr("d", path)
        .style("fill", d => {
            var value = d.properties[expressed];
            return value ? colorScale(value) : "#ccc";
        })
        .on("mouseover", function(event, d){
            highlight(d.properties);
        });
}


    function makeColorScale_Block3(data){
        var colorClasses = [
            "#D4B9DA",
            "#C994C7",
            "#DF65B0",
            "#DD1C77",
            "#980043"
        ];

        var colorScale = d3.scaleThreshold().range(colorClasses);

        var domainArray = data.map(d => parseFloat(d[expressed]));
        var clusters = ss.ckmeans(domainArray, 5);
        domainArray = clusters.map(d => d3.min(d));
        domainArray.shift();

        colorScale.domain(domainArray);
        return colorScale;
    }

})();
