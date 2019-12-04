// Trace1 for the Greek Data
var trace1 = {
    x: data.map(row => row.year),
    y: data.map(row => row.incident_count),
    name: "Number of Incident Gun Report By year",
    type: "bar"
  };
  
  // Trace 2 for the Roman Data
  var trace2 = {
    x: data.map(row => row.year),
    y: data.map(row => row.n_killed),
    name: "Number of Kiiled Due Gun violence By year",
    type: "bar"
  };

  // Trace 3 for the Roman Data
  var trace3 = {
    x: data.map(row => row.year),
    y: data.map(row => row.n_injured),
    name: "Number of Injured Due Gun violence By year",
    type: "bar"
  };
  
  // Combining both traces
  var data = [trace1, trace2, trace3];
  
  // Apply the group barmode to the layout
  var layout = {
    title: "Gun Violence Bar Chart By Year",
    barmode: "group"
  };
  
  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("plot", data, layout);