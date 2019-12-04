d3.csv("states_killed.csv", function(err, rows) {
    function unpack(rows, key) {
        return rows.map(function(row) {return row[key]; });
    }

    var trace1 = {
        x:unpack(rows, state),
        y:unpack(rows ,noKilled),
        name : "Number of killed people in state Due gun violence" ,
        type: "bar"
    };

    var data = [trace1];

    var layout = {
        title : " Number of Gun Violence in states",
        barmode: "group"
    };
        
Plotly.newPlot("plot", data, layout);
});