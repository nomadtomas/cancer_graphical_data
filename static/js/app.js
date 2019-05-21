function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(sampleData) {
      console.log(sampleData)
      // Use d3 to select the panel with id of `#sample-metadata`
      var sample_metadata = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      sample_metadata.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(sampleData).forEach(([key, value]) => {
        sample_metadata.append("h5").text(`BB_${key}: ${value}`);
    })
  }
  )}
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  
  function buildGauge(data) {
    // Enter a speed between 0 and 180
    d3.json(`/metadata/${data}`).then(function(data){
    console.log('data.!', data)
    let degree = parseInt(data.WFREQ) * (180/10);
  
    let level = degree;
  
    // Trig to calc meter point
    let degrees = 180 - level,
         radius = .5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);
  
    // Path: may have to change to create a better triangle
    let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    let path = mainPath.concat(pathX,space,pathY,pathEnd);
  
    let trace = [{ type: 'scatter',
       x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'WASH FREQ',
        text: data.WFREQ,
        hoverinfo: 'text+name'},
      { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
      textinfo: 'text',
      textposition:'inside',
      textfont:{
        size : 16,
        },
      marker: {colors:['rgba(6, 51, 0, .5)', 'rgba(9, 77, 0, .5)', 
                             'rgba(12, 102, 0 ,.5)', 'rgba(14, 127, 0, .5)',
                             'rgba(110, 154, 22, .5)','rgba(170, 202, 42, .5)', 
                             'rgba(202, 209, 95, .5)','rgba(210, 206, 145, .5)', 
                             'rgba(232, 226, 202, .5)','rgba(255, 255, 255, 0)'
                      ]},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
      hoverinfo: 'text',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];
  
    let layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
  
      title: '<b> Belly Button Washing Frequency</b> <br> Scrub Per Week',
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
    };
  
    Plotly.newPlot('gauge', trace, layout, {responsive: true});
  }
    )}
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then(function(sampleData) {
    console.log(sampleData)
      // @TODO: Build a Bubble Chart using the sample data
      const 
        otu_ids = sampleData.otu_ids,
        otu_labels = sampleData.otu_labels,
        sample_values = sampleData.sample_values;
     
      const trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          colorscale: 'Earth',
          size: sample_values
        }
      }
  
      const bubbleData = [trace1];
  
      const bubbleLayout = {
        margin: {t: 0},
        hovermode: 'closest',
        xaxis: { title: "OTU ID" }  
      }
  
      Plotly.newPlot('bubble', bubbleData, bubbleLayout, {responsive: true});
  
      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
      const pieData = [{
        values: sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hovertext: otu_ids.slice(0,10),
        hoverinfo: 'hovertext',
        type: 'pie'
      }]
  
      const pieLayout = {
        margin: {t: 0, l: 0}
      }
      
      Plotly.newPlot('pie', pieData, pieLayout, {responsive: true})
  
      })
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
      buildGauge(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    buildGauge(newSample);
  }
  
  // Initialize the dashboard
  init();
  