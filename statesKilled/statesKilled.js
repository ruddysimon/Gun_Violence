// Import data from states_killed.csv file
//=================================
function makeplot() {
    Plotly.d3.csv("states_killed.csv", function(stateData) { processData(data)} );

};
function processData(stateData) {

    console.log(stateData);


    var state = [], noKilled = [] ;
    for ( var i=0; i < stateData.length; i++) {
        row = stateData[i];
        state.push(row['state']);
        noKilled.push(row['n_killed']);
    }
    makePlotly(state,noKilled);
}



function makePlotly(state, noKilled) {
    var plotDiv = document.getElementById("plot") ;
 
    var trace1 = [{
        x: state ,
        y: noKilled,
        name : "Number of killed people in state Due gun violence" ,
        type: "bar"
    }];
    
    var data = [trace1]
        
    var layout = {
        title : " Number of Gun Violence in states",
        barmode: "group"
    };
        
    Plotly.newPlot("plot", data, layout);

};

makeplot();


