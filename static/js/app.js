
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(url).then(data=>{
    console.log(data)
})

function init() {
    // Grab a reference to the dropdown select element
    let dropdownMenu = d3.select("#selDataset");
    
    // have names appear in dropdown menu
    d3.json(url).then((data) => {
      let individualNames = data.names;
      individualNames.forEach((individual) => {
        dropdownMenu
          .append("option")
          .text(individual)
          .property("value", individual);
      });
    
      
      //have individual 940 start on initialization
      createCharts(940);
      demographicInfo(940);
    });
    }
//function for metadata/demographic information
function demographicInfo(individual){
d3.json(url).then(data => {
let metaData = data.metadata
let resultsArray = metaData.filter(sampleobject => sampleobject.id == individual)
console.log(resultsArray)
let result = resultsArray[0]
let demographicPanel = d3.select("#sample-metadata")
demographicPanel.html("")
Object.entries(result).forEach(([key, value]) => {
    demographicPanel.append("h6").text(`${key}: ${value}`);
})
})

}
//function to create the bubble and bar charts
  function createCharts(individual) {
  
  // fetch the sample data for the charts
  d3.json(url).then((data) => {
    let samples= data.samples;
    let resultsarray= samples.filter(sampleobject => sampleobject.id == individual);
    let result= resultsarray[0]
    let ids = result.otu_ids;
    let labels = result.otu_labels;
    let values = result.sample_values;

  //create bar chart
  //get bar data
  let barData =[
    {
      x:values.slice(0,10).reverse(),
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];
//create bar chart layout
  let barLayout = {
    title: `Top 10 OTUS in individual ${individual}`
  };

  Plotly.newPlot("bar", barData, barLayout);
  //create bubble chart

  //get bubble chart data
      let bubbleData = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          colorscale: 'Portland'
          }
      }
    ];
    //create bubble chart layout
    let bubbleLayout = {
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
        };
    
    
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
  
  });
  }
   

  // function to get new data each time a new sample is selected
  function optionChanged(newSample) {

    createCharts(newSample);
    demographicInfo(newSample);
  }
  
  
  
  // Initialize the html
  init();

