function draw_box_plot(data, v_name){
  data = data.sort(function(a, b){
    return a[v_name] - b[v_name];
  });

  var chart = d3.select("#"+v_name+"-boxplot").append("svg")
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

  function topWhisker(q1, q3, v_array){
    var whisker = q3 + 1.5*(q3-q1);
    var notOutliers = v_array.filter(function(d){
      return d <= whisker;
    });
    return Math.min(whisker, d3.max(notOutliers));
  }

  function bottomWhisker(q1, q3, v_array){
    var whisker = q1 - 1.5*(q3-q1);
    var notOutliers = v_array.filter(function(d){
      return d >= whisker;
    });
    return Math.max(whisker, d3.min(notOutliers));
  }

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
      summary.topWhisker = topWhisker(summary.q1, summary.q3, v_array);
      summary.bottomWhisker = bottomWhisker(summary.q1, summary.q3, v_array);
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
  var medianLine = chart.selectAll(".median")
      .data(summaries)
    .enter().append("line")
      .attr("class", "median")
      .attr("x1", function(d){return x(d.key);})
      .attr("x2", function(d){return x(d.key)+x.rangeBand();})
      .attr("y1", function(d){return y(d.values.median);})
      .attr("y2", function(d){return y(d.values.median);})
      .style("stroke", "red");



  //Draw Whiskers

  function whiskerLines(q, side){
    return chart.selectAll("."+side+".whisker")
        .data(summaries)
      .enter().append("line")
        .attr("class", side+" whisker")
        .attr({
          x1: function(d) {return x(d.key)+x.rangeBand()/2;},
          x2: function(d) {return x(d.key)+x.rangeBand()/2;},
          y1: function(d) {return y(d.values[q]);},
          y2: function(d) {return y(d.values[side+"Whisker"]);}
        });
  }

  var topWhiskers = whiskerLines("q1", "bottom").style("stroke", "black");
  var bottomWhiskers = whiskerLines("q3", "top").style("stroke", "black");

  //Select Outliers

  var mapping = {};
  // mapping connects the handedness to the index of the summaries array
  summaries.forEach(function(hand, index){
    mapping[hand.key] = index;
  });

  var outliers = data.filter(function(player){
      return player[v_name] > summaries[mapping[player.handedness]].values.topWhisker ||
             player[v_name] < summaries[mapping[player.handedness]].values.bottomWhisker;
    });



//Draw outliers
var circles = chart.selectAll("circle.outlier")
    .data(outliers)
  .enter().append("circle")
    .attr("class", "outlier")
    .attr({
      cx: function(d) {return x(d.handedness)+x.rangeBand()/2;},
      cy: function(d) {return y(d[v_name]);},
      r: 2
    });


}
