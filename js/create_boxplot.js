function draw_box_plot(data, v_name){
  data = data.sort(function(a, b){
    return a[v_name] - b[v_name];
  });

  var chart = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height+margin.top+margin.bottom)
        .attr("class", "boxplot "+v_name)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var byHand = d3.nest()
    .key(function(d){
      return d.handedness;
    })
    .entries(data);

  /* d3.quantile does not work with an acessor function
  therefore the values need to be extracted to an array and
  sorted beforehand*/
  var summaries = d3.nest()
    .key(function(d){
      return d.handedness;
    })
    .rollup(function(leaves){
      var v_array = leaves.map(function(d){return d[v_name];});
      var summary = {"min": d3.min(v_array),
              "q1": d3.quantile(v_array, 0.25),
              "median": d3.median(v_array),
              "q3": d3.quantile(v_array, 0.75),
              "max": d3.max(v_array)
            };
      summary.iqr = summary.q3 - summary.q1;
      summary.topWhisker = summary.q3 + 1.5*summary.iqr;
      summary.bottomWhisker = summary.q1 - 1.5*summary.iqr;
      return summary;
      })
    .entries(data);

  var x = d3.scale.ordinal()
          .domain(["R", "L", "B"])
          .rangeBands([0, width], 0.1);

  var y = d3.scale.linear()
            .domain([0, d3.max(summaries, function(d) {return d.values.max;})])
            .range([height, 0]);

  //Add axis
  var hand_axis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(value){//replace RLB with longer labels
      new_labels = {"R": "Right-handed Players",
                    "L": "Left-handed Players",
                    "B": "Ambidextrous Players"};
      return new_labels[value];
    });

  var count_axis = d3.svg.axis()
    .scale(y)
    .orient("left");

  chart.append("g")
    .attr("class", "hand axis")
    .attr("transform", "translate(0,"+ height+")")
    .call(hand_axis);

  chart.append("g")
    .attr("class", "count axis")
    .call(count_axis);

  //draw boxes  - very similar
  //to boxplot, just the y and height are different.
  var box = chart.selectAll(".box")
      .data(summaries)
    .enter().append("rect")
    //put the boxes on the x axis
      .attr("class", "box")
      .attr("x", function(d){return x(d.key);})
      .attr("width", x.rangeBand())
      .attr("y", function(d){return y(d.values.q3);})
      .attr("height", function(d){return y(d.values.q1)-y(d.values.q3);});

  //draw median line
  var line = chart.selectAll(".median")
      .data(summaries)
    .enter().append("line")
      .attr("class", "median")
      .attr("x1", function(d){return x(d.key);})
      .attr("x2", function(d){return x(d.key)+x.rangeBand();})
      .attr("y1", function(d){return y(d.values.median);})
      .attr("y2", function(d){return y(d.values.median);})
      .style("stroke", "red");

  //Select Outliers
  //





}
