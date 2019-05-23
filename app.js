// margin
let pieAcord = d3.select("#headingOne1")

pieAcord.on("click", function(){
  pieFunction("new_cancer.csv","#pie") 
  pieFunction("cancer_deaths.csv","#pie2")
})


async function pieFunction(fileName,divName) {


var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width =600 - margin.right - margin.left,
    height = 400 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

// color range
var color = d3.scaleOrdinal()
            .range(["#003f5c", "#444e86", "#955196", "#dd5182", "#2196F3", "#ff6e54", "#ffa600"])

// pie chart arc. Need to create arcs before generating pie
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);


// arc for the labels position
var labelArc = d3.arc()
    .outerRadius(radius - 80)
    .innerRadius(radius - 20);

// generate pie chart and donut chart
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.number; });

// define the svg for pie chart had to increase by 100 to make room for the legends
var svg = d3.select(divName).append("svg")
    .attr("width", width + 100)
    .attr("height", height)
   .append("g")
    .attr("transform", "translate(" + (width-90) / 2 + "," + height / 2 + ")");


// import data 
const data = await d3.csv(fileName)
  
  
    // parse data
    var legendText=[]
    
    data.forEach(function(d) {
        legendText.push(d.number)
        d.number = parseFloat(d.number.replace(/,/g, ''))
        txt = d.percent
        init = txt.indexOf('(');
        fin = txt.indexOf(')');
        new_val = txt.substr(init+1,fin-init-1)
       d.percent = new_val
        
        d.cancer_type= d.cancer_type;
    })
    
  // "g element is a container used to group other SVG elements"
  var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

  // append path 
      g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.cancer_type); })
        // transition 
        .transition()
          .ease(d3.easeLinear)
          .duration(3000)
          .attrTween("d", tweenPie);
        
  // append text
 g.append("text")
    .transition()
    .ease(d3.easeLinear)
    .duration(3000)
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .attr("fill","white")
    .text(function(d) { return d.data.percent });

// Helper function for animation of pie chart and donut chart
function tweenPie(b) {
  b.innerRadius = 0;
  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc(i(t)); };
}

var legend = svg.selectAll('.legend-entry').data(data)
  .enter().append('g')
  
 .attr('class', 'legend-entry')

legend.append('rect')
    .data(data)
  .attr('class', 'legend-rect')
  .attr('x', 175)
  .attr('y', function (d, i) { return i * 30})
  .attr('width', 20)
  .attr('height', 20)
  .attr('fill', function (d) {
    return color(d.cancer_type)
   })
   

legend.append('text')
  .attr('class', 'legend-text')
  .attr('x', 200)
  .attr('y', function (d, i) { return ( i * 30) + 15 })
  .style('fill',"#000a19")
  .text(function (d,i) {
    return `${d.cancer_type}: ${legendText[i]}`
  })

  const toolTip = d3.tip()
		.attr('class', 'tooltip')
        .offset([0,+40])
        .html(function(d,i) {
            return (`${d.data.cancer_type}<br><hr>Patients :  ${d.data.number}`)
        })
    g.call(toolTip)
   g.on("mouseover", function(d) {
			toolTip.show(d,this)

		})
    .on("mouseout", function(d) {
        toolTip.hide(d,this);
       
    });

}




