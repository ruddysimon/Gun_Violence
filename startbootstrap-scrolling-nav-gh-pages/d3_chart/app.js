
var svgWidth = 980;
var svgHeight = 750;
    
    
var margin = {top: 20,right: 40,bottom: 100,left: 130};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
    
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
// Append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
// Initial Params
var chosenXAxis = "unemployment_rate";
var chosenYAxis ="income";

// function used for updating x-scale var upon click on axis label
function xScale(myData, chosenXAxis) {
// create scales
var xLinearScale = d3.scaleLinear()
      .domain([d3.min(myData, d => d[chosenXAxis]) * 0.8,
        d3.max(myData, d => d[chosenXAxis]) * 1.2])
      .range([0, width]);
  
    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(myData, chosenYAxis) {
// create scales
var yLinearScale = d3.scaleLinear()
      .domain([d3.min(myData, d => d[chosenYAxis]) * 0.8,
        d3.max(myData, d => d[chosenYAxis]) * 1.2])
      .range([height, 0]);
  
    return yLinearScale;
}
    
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}
    
// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}
    
// function used for updating circles group and text group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
}

function renderText(textGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
          
    return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        if (chosenXAxis === "unemployment_rate"){
          return (`${d.State}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`); 
      
        } else if (chosenXAxis === "income"){
          return (`${d.State}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`); 
        }    
        else {
          return (`${d.State}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`); 
        }
        });
        
       
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d,this);
      })
      .on("mouseout", function(d, index) {
        toolTip.hide(d);
      });
    return circlesGroup;
  }

// Retrieve data from the CSV file and execute everything below
d3.csv("2017_economics.csv").then(function(myData) {
    // parse data
    myData.forEach(function(data) {
        data.State = data.State;
        data.unemployment_rate  = +data.unemployment_rate;
        data.income = +data.income;
        data.t_killed = +data.t_killed;
        data.n_incidents = +data.n_incidents;
        data.t_injured = +data.t_injured;
        data.poverty_rate = +data.poverty_rate;
        // data.abbr = data.abbr;
    });
    
    // xLinearScale function above csv import
    var xLinearScale = xScale(myData, chosenXAxis);
    
    // Create y scale function
    var yLinearScale = yScale(myData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles and text
    var circlesGroup = chartGroup.selectAll("circle")
        .data(myData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r",17)
        .attr("fill", "#00d5ff");

    var textGroup = chartGroup.selectAll("text")
        .exit()
        .data(myData)
        .enter()
        .append("text")
        .text(d => d.State)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("font-size", 11)
        .attr("text-anchor", "middle")
        .style("fill","black")
        .attr("class","stateText");
    
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);
    
    // Create group for x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var unemploymentLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("class","axis-text-x")
        .attr("value", "unemployment_rate") 
        .classed("active", true)
        .text("Unemployment (%)");

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("class","axis-text-x")
        .attr("value", "poverty_rate") 
        .classed("inactive", true)
        .text("Poverty (%)");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("class","axis-text-x")
        .attr("value", "income") 
        .classed("inactive", true)
        .text("Income (Median)");

    // Create group for y-axis labels
    
    var ylabelsGroup = chartGroup.append("g");

    var incidentsLabel = ylabelsGroup.append("text")
        .attr("transform", `translate(-60,${height / 2})rotate(-90)`)
        .attr("dy", "1em")
        .attr("class","axis-text-y")
        .classed("axis-text", true)
        .attr("value", "n_incidents") 
        .classed("active", true)
        .text("Number of Incidents");

    var killedLabel = ylabelsGroup.append("text")
        .attr("transform", `translate(-80,${height / 2})rotate(-90)`)
        .attr("dy", "1em")
        .attr("class","axis-text-y")
        .attr("value", "t_killed") 
        .classed("inactive", true)
        .text("Number of Killed");

    var injuredLabel = ylabelsGroup.append("text")
        .attr("transform", `translate(-100,${height / 2})rotate(-90)`)
        .attr("dy", "1em")
        .attr("class","axis-text-y")
        .attr("value", "t_injured") 
        .classed("inactive", true)
        .text("Number of Injured");

    // x axis labels event listener
    labelsGroup.selectAll(".axis-text-x")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            console.log(chosenXAxis)

            // updates x scale for new data
            xLinearScale = xScale(myData, chosenXAxis);
            // updates y scale for new data
            yLinearScale = yScale(myData, chosenYAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

            textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "unemployment_rate") {
            unemploymentLabel
                .classed("active", true)
                .classed("inactive", false);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
                
            }
            else if (chosenXAxis === "poverty_rate")
            {
            unemploymentLabel
                .classed("active", false)
                .classed("inactive", true);
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            
            }
            else {
            unemploymentLabel
                .classed("active", false)
                .classed("inactive", true);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            }

        }
        });


    // y axis labels event listener
    ylabelsGroup.selectAll(".axis-text-y")
        .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis)

        // updates x scale for new data
        xLinearScale = xScale(myData, chosenXAxis);
        // updates y scale for new data
        yLinearScale = yScale(myData, chosenYAxis);
        // updates Y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

        textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

        
        if (chosenYAxis === "n_incidents") {
        incidentsLabel
            .classed("active", true)
            .classed("inactive", false);
        killedLabel
            .classed("active", false)
            .classed("inactive", true);
        injuredLabel
            .classed("active", false)
            .classed("inactive", true);
        
        }
        else if (chosenYAxis === "t_killed")
        {
        injuredLabel
            .classed("active", false)
            .classed("inactive", true);
        killedLabel
            .classed("active", true)
            .classed("inactive", false);
        incidentsLabel
            .classed("active", false)
            .classed("inactive", true);
        } 
        else {
        incidentsLabel
            .classed("active", false)
            .classed("inactive", true);
        killedLabel
            .classed("active", false)
            .classed("inactive", true);
        injuredLabel
            .classed("active", true)
            .classed("inactive", false);   
        }
        }
    });
    });

