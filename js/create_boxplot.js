// Used https://bl.ocks.org/mbostock/4061502 for guidance
function iqr(k) {
  //function from https://bl.ocks.org/mbostock/4061502
  //returns function that calculates interquartile range.
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}

function draw_box_plot(data, v_name){
  /*var boxPlot = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height+margin.top+margin.bottom)
        .attr("class", "boxplot")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/

var margin = {top: 20, right: 30, bottom:20, left:30};

var width = 120 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var min = d3.min(data, function(d) {return d[v_name];}),
      max = d3.max(data, function(d) {return d[v_name];});
  //debugger;

  //Preparing the data to be used by the box plugin
  var var_data = [[], [], []];
  data.forEach(function(x){
    var v = x[v_name];
    var hand = x.handedness;
    var hands = {"R": 0, "L": 1, "B": 2};
    var_data[hands[hand]].push(v);
  });
  console.log(var_data);

  var boxplot = d3.box()
    .whiskers(iqr(1.5))
    .width(width)
    .height(height);

  boxplot.domain([min, max]);

  var svg = d3.select("body").selectAll("svg .box"+" ."+v_name)
      .data(var_data)
    .enter().append("svg")
      .attr("class", "box"+" "+v_name)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top+")")
      .call(boxplot);
}
