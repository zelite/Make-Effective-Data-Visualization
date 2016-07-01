// Defining margins as in  http://bl.ocks.org/mbostock/3019563
var margin = {top: 20, right: 10, bottom:25, left:100};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function draw_box_plot(data, v_name){
  data = data.sort(function(a, b){
    return a[v_name] - b[v_name];
  });

  var chart = d3.select("#"+v_name+"-boxplot>.plot-container").append("svg")
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
          .domain(["L", "B", "R"])
          .rangeBands([0, width], 0.3);

  var y = d3.scale.linear()
          .domain([d3.min(summaries, function(d) {return d.values.bottomWhisker;}),
                   d3.max(summaries, function(d) {return d.values.topWhisker;})])
          .range([height, 0]);

  //Add axis

  var hand_labels = {"R": "Right-handed Players",
                "L": "Left-handed Players",
                "B": "Ambidextrous Players"};
  var hand_axis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(value){//replace RLB with longer labels
      return hand_labels[value];
    });

  var vertical_axis = d3.svg.axis()
    .scale(y)
    .orient("left");

  chart.append("g")
    .attr("class", "hand axis")
    .attr("transform", "translate(0,"+ height+")")
    .call(hand_axis);

  var vertLabels = {"avg": "Batting Average", "HR": "Home runs"};
  chart.append("g")
      .attr("class", "vertical axis")
      .call(vertical_axis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("class", "vertical label")
      .style("text-anchor", "end")
      .text(vertLabels[v_name]);



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
      .attr("height", function(d){return Math.abs(y(d.values.q3)-y(d.values.q1));});



  function update_box(newScale){
    chart.selectAll(".box")
    .transition()
    .attr("y", function(d){return newScale(d.values.q3);})
    .attr("height", function(d){return newScale(d.values.q1)-newScale(d.values.q3);});
  }

  //median tooltip
  var median_tip = d3.tip()
            .attr("class", "d3-tip")
            .html(function(d){
              return "<b>"+hand_labels[d.key]+" median:</b> "+d.values.median;
            })
            .direction("n");

  chart.call(median_tip);

  var medianLine = chart.selectAll(".median")
      .data(summaries)
    .enter().append("line")
      .attr("class", "median")
      .attr("x1", function(d){return x(d.key);})
      .attr("x2", function(d){return x(d.key)+x.rangeBand();})
      .attr("y1", function(d){return y(d.values.median);})
      .attr("y2", function(d){return y(d.values.median);})
      .on("mouseover", median_tip.show)
      .on("mouseout", median_tip.hide)
      .on("mouseout", console.log("test"));

  //Put the mouseouver effect also on the surrounding boxes
  //for easier targetting with the mouse

  chart.selectAll("rect.box")
    .on("mouseover", median_tip.show)
    .on("mouseout", median_tip.hide);

  function update_median(newScale){
    chart.selectAll(".median")
      .transition()
      .attr("y1", function(d){return newScale(d.values.median);})
      .attr("y2", function(d){return newScale(d.values.median);});
  }

  //Draw Whiskers

  function whiskerLines(q, side, vScale){
    return chart.selectAll("."+side+".whisker")
        .data(summaries)
      .enter().append("line")
        .attr("class", side+" whisker")
        .attr({
          x1: function(d) {return x(d.key)+x.rangeBand()/2;},
          x2: function(d) {return x(d.key)+x.rangeBand()/2;},
          y1: function(d) {return vScale(d.values[q]);},
          y2: function(d) {return vScale(d.values[side+"Whisker"]);}
        });
  }

  var topWhiskers = whiskerLines("q1", "bottom", y);
  var bottomWhiskers = whiskerLines("q3", "top", y);

function update_whiskers(newScale){
    var mapper = {"bottom": "q1",
                  "top": "q3"};
    chart.selectAll(".whisker")
    .transition()
    .attr({
      //get "top"/"bottom" from DOM object: this.classList[0]
      //convert to q1 or q3 with mapper
      y1: function(d) {return newScale(d.values[mapper[this.classList[0]]]);},
      y2: function(d) {return newScale(d.values[this.classList[0]+"Whisker"]);}
    });

  }
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



//Outlier tooltip
//On this plot I'll use the d3-tip library: https://github.com/caged/d3-tip
  function formatData(d){
    html_text = "<b>Name: </b> #name</br>"+
                "<b>Batting Average: </b> #avg</br>"+
                "<b>Home runs: </b> #HR</br>";

    html_text = html_text.replace(/#(\w+)/g, function(match, p1){
      return d[p1];
    });
    return html_text;
  }

  var circles_tip = d3.tip()
        .attr("class", "d3-tip")
        .html(formatData)
        .direction("ne");
        //position of tooltip is northeast of target element
  chart.call(circles_tip);
//Draw outliers
update_outliers(outliers, y);

//Update Outliers
  function update_outliers(outliers, newScale){
    //outliers need to be remove from the
    //plot if they are outside the axis range, and
    //need to be reinserted if the range includes them again.
    //debugger;

    //First select data that will be kept
    var circles = chart.selectAll("circle.outlier")
                  .data(outliers
                        .filter(function(d) {
                          return d[v_name] >= newScale.domain()[0] &&
                          d[v_name] <= newScale.domain()[1];
                      }), function(d) {return d.name;});


    //if new circles are entering then
    //the x position and radius are set
    circles
      .enter()
      .append("circle")
      .attr("class", "outlier")
      .attr({
          cx: function(d) {return x(d.handedness)+x.rangeBand()/2;},
          r: 5
        })
      .on("mouseover", circles_tip.show)
      .on("mouseout", circles_tip.hide);

    //all circles get new cy value.
    circles.transition().attr("cy", function(d) {return newScale(d[v_name]);});

    //circles out of range are removed
    circles.exit().remove();
  }


  var zoomtButtons = d3.select("#"+v_name+"-boxplot>.plot-container").append("div")
                          .attr("class", "buttons "+v_name);

  //Buttons to zoom in and out of the boxes
  var button_zoomIn = d3.select(".buttons."+v_name).append("button")
    .attr("name", "in")
    .attr("type", "button")
    .property("disabled", true)
    .text("Zoom on Boxes");

  var button_zoomOut = d3.select(".buttons."+v_name).append("button")
    .attr("name", "out")
    .attr("class", "out")
    .attr("type", "button")
    .text("Zoom out");

  //zoomed out scale for full range of outliers
    var y_zoom = d3.scale.linear()
      .domain([0, d3.max(summaries, function(d) {return d.values.max;})])
      .range([height, 0]);

 //Updating everything for the new zoom
  function update_axis(newScale){
    chart.select(".vertical.axis").
      transition()
      .call(vertical_axis.scale(newScale));
  }

  function updateScale(){
    var newScale;
    if(this.name === "in"){
      newScale = y;
      button_zoomIn.property("disabled", true);
      button_zoomOut.property("disabled", false);
    }else{
      newScale = y_zoom;
      button_zoomOut.property("disabled", true);
      button_zoomIn.property("disabled", false);
    }
    //Update boxes
    update_box(newScale);
    update_median(newScale);
    update_whiskers(newScale);
    update_axis(newScale);
    update_outliers(outliers, newScale);

  }

  button_zoomIn.on("click", updateScale);
  button_zoomOut.on("click", updateScale);

}
