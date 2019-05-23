// Bubble Chart
// var g_xScale;
// var g_csvData;
let scatterAcord = d3.select("#headingTwo2")

scatterAcord.on("click", scatter)
async function scatter() {

  //setting up the margins and chartwidth
   const svgWidth = 960;
   const svgHeight = 600;

   const margin = {
       top: 50,
       right: 10,
       bottom: 50,
       left: 50
   };

   const height = svgHeight - margin.top - margin.bottom;
   const width = svgWidth - margin.left - margin.right;
   // console.log(height)
   // console.log(width)

   // data
   const csvData = await d3.csv("both_cancer_rates.csv")
   csvData.forEach(d=>{
       d.Site = d.Site
       d.Estimated_NewCases_2019 = +d.Estimated_NewCases_2019/100
       d.Survival_per_2009_2015 = +d.Survival_per_2009_2015

   })
   console.log(csvData)
   g_csvData = csvData;

  
//    append svg and group
   const svg = d3.select("#scatter")
       .append("svg")
       .attr("height", svgHeight)
       .attr("width", svgWidth);

   const chartGroup = svg.append("g")
       .attr("transform", `translate(${margin.left}, ${margin.top})`);

   // scales
   const xScale = d3.scaleBand()
          .domain(csvData.map(d => d.Site))
          .range([0, width])
          .padding(0.1);
    g_xScale = xScale;


   const yScale = d3.scaleLinear()
               .domain([0, d3.max(csvData, d=>d.Estimated_NewCases_2019)])
               .range([height, 0]);


//    // Create axis functions
//    // ==============================
   const bottomAxis = d3.axisBottom()
                        .scale(xScale)
                        .ticks(28)
   const leftAxis = d3.axisLeft(yScale)

//    // Append Axes to the chart
//    // ==============================
   chartGroup.append("g")
            .call(leftAxis)
           

   chartGroup.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(bottomAxis)
       .selectAll("text")	
       .style("text-anchor", "end")
       .attr("dx", "-.8em")
       .attr("dy", ".15em")
       .attr("transform", function(d) {
           return "rotate(-65)" 
           });

   // append circles to data points
   const circlesGroup = chartGroup.selectAll("circle")
   .data(csvData)
   .enter()
   .append("circle")
    .attr("opacity","0.5")
   .attr("fill", "blue")

   //labels for the circle
//    const labelCircle = chartGroup.selectAll(null)
//            .data(csvData)
//            .enter()
//            .append("text")
//    labelCircle.attr("text-anchor", "middle")
//        .attr("fill","white")

// Initialize tool tip
// ==============================
   const toolTip = d3.tip()
       .attr("class", "d3-tip")
       .offset([0, 0])
       .html(function(d) {
       return (`<strong>${d.Site}</strong><br><strong>Survival % (2009-2015): ${d.Survival_per_2009_2015}%</strong><br><strong>Estimated New Cases: ${d.Estimated_NewCases_2019}</strong>`);
       });

// //   Add an onmouseover event to display a tooltip
// //     // ========================================================
   chartGroup.call(toolTip);

//  Create event listeners to display and hide the tooltip
//     // ==============================
   circlesGroup.on("click", function(d) {
           toolTip.show(d, this);
       })
       .on("mouseout", function(d) {
       toolTip.hide(d);
       });

//      Create axes labels
   chartGroup.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left - 4)
       .attr("x", 0 - (height / 2))
       .attr("dy", "1em")
   
       .style("fill", "#0000ff")
       .text("Estimated New Cases (2019)");

//    chartGroup.append("text")
//        .attr("transform", `translate(${width / 2}, ${height + margin.top-2})`)
//        .attr("class", "aText")
//        .text("All Sites");
// transtion for circles
   circlesGroup.transition()
               .duration(3000)
               .attr("cx", (d,i) => xScale(d.Site))
               .attr("cy", d => yScale(d.Estimated_NewCases_2019))
               .attr('r', d=> d.Survival_per_2009_2015/5*2)
//transition for labels
//    labelCircle.transition()
//                .duration(1500)
//                .attr("x",(d,i)=>xScale(d.Site))
//                .attr("y",d=>yScale(d.Estimated_NewCases_2019))
//                .text(d=>d.Survival_per_2009_2015)

}

