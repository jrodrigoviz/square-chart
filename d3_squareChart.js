var Square_Chart = function(opt) {
  this.data = opt.data;
  this.rows = Math.floor(Math.sqrt(opt.data))
  this.col = opt.col;
  this.series1 = opt.series1;
  this.series2 = opt.series2;
  this.series3 = opt.series3;
  this.series4 = opt.series4;
  this.series5 = opt.series5;
  this.element = opt.element;
  this.speed = 1000;
  this.colorPalette = [{
      "color": "#17becf"
    },
    {
      "color": "#bcbd22"
    },
    {
      "color": "#7f7f7f"
    },
    {
      "color": "#e377c2"
    },
    {
      "color": "#8c564b"
    },
    {
      "color": "#9467bd"
    },
    {
      "color": "#d62728"
    },
    {
      "color": "#2ca02c"
    },
    {
      "color": "#ff7f0e"
    },
    {
      "color": "#1f77b4"
    }
  ]
  this.draw();
}


Square_Chart.prototype.draw = function() {
  this.padding = 50;
  this.width = 500;
  this.height = 500;

  var svg = d3.select(this.element).append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .attr('padding', this.padding)

  this.plot = svg.append('g')
    .attr('class', 'Square_Chart_holder')
    .attr('transform', "translate(" + this.padding + "," + this.padding + ")");

  this.generateXScale();
  this.generateYScale();
  this.generateData();
  this.generateColorScale();
  this.addAxis();
  this.generateButtons();
  this.generateBars();

};

Square_Chart.prototype.generateXScale = function() {
  this.xScale = d3.scaleLinear()
    .domain([0, Math.max(this.rows + 1, this.data / this.rows + 1)])
    .range([0, this.width - 2 * this.padding]);

  this.xAxis = d3.axisTop().scale(this.xScale);
}

Square_Chart.prototype.generateYScale = function() {
  this.yScale = d3.scaleLinear()
    .domain([0, Math.max(this.rows + 1, this.data / this.rows + 1)])
    .range([0, this.height - 2 * this.padding]);
  this.yAxis = d3.axisLeft().scale(this.yScale);
}


Square_Chart.prototype.addAxis = function() {
  this.plot.append("g")
    .attr("id", "x-axisGroup")
    .attr("class", "x-axis")
    .attr("transform", "translate(" + "0" + "," + (this.height - 2 * this.padding) + ")");

  this.plot.select(".x-axis")
    .transition()
    .duration(1000)
    .call(this.xAxis)

  this.plot.append("g")
    .attr("id", "y-axisGroup")
    .attr("class", "y-axis")
    .attr("transform", "translate(0,0)");

  this.plot.select(".y-axis")
    .transition()
    .duration(1000)
    .call(this.yAxis)

}

Square_Chart.prototype.updateAxis = function() {
  this.plot.select(".x-axis")
    .transition()
    .duration(1000)
    .call(this.xAxis)

  this.plot.select(".y-axis")
    .transition()
    .duration(1000)
    .call(this.yAxis)

}

Square_Chart.prototype.generateData = function() {
  var col = Math.ceil(this.data / this.rows);
  this.chart_data = [];
  for (var i = 0; i < this.data; i++) {
    if (i < this.series1) {
      var color = 9;
      var series = "A1";
      var seriesNum = i;
    } else if (i < this.series2) {
      var color = 8;
      var series = "A2";
      var seriesNum = i - this.series1;
    } else if (i < this.series3) {
      var color = 7;
      var series = "A3"
      var seriesNum = i - this.series2;
    } else if (i < this.series4) {
      var color = 6;
      var series = "A4"
      var seriesNum = i - this.series3;
    } else if (i < this.series5) {
      var color = 5;
      var series = "A5"
      var seriesNum = i - this.series4;
    } else {
      var color = 4;
      var series = "A6"
      var seriesNum = i - this.series5;
    };

    this.chart_data.push({
      "series": series,
      "seriesNum": seriesNum,
      "i": i,
      "x": i % col,
      "row": Math.floor(i / col),
      "color": color
    });
  };
};

Square_Chart.prototype.generateBars = function() {
  var that = this;
  var rect = this.plot.selectAll("rect")
    .data(this.chart_data);

  //remove any elements that don't have data
  rect.exit().remove();

  //update elements that do have Data
  rect
    .transition().duration(1000)
    .attr("x", function(d) {
      return that.xScale(d.x)
    })
    .attr("y", this.height - 2 * this.padding)
    .attr("height", 0)

    .attr("y", function(d) {
      return that.yScale(d.row)
    })
    .attr("height", function(d) {
      return that.yScale(0.9)
    })
    .attr("width", function(d) {
      return that.xScale(0.9)
    })
    .attr("fill", function(d) {
      return that.colorScale(d.color)
    });

  rect.enter().append("rect")
    .attr("x", function(d) {
      return that.xScale(d.x)
    })
    .attr("y", this.height - 2 * this.padding)
    .on("mouseover", function(d) {
      that.showToolTip(d)
    })
    .on("mouseout", function(d) {
      that.hideToolTip(d)
    })
    .transition().duration(this.speed) // start at "y=0" then transition to the top of the grpah while the height increases
    .attr("y", function(d) {
      return that.yScale(d.row)
    })
    .attr("height", function(d) {
      return that.yScale(0.9)
    })
    .attr("width", function(d) {
      return that.xScale(0.9)
    })
    .attr("fill", function(d) {
      return that.colorScale(d.color)
    })

};

Square_Chart.prototype.updateBars = function() {
  this.generateXScale();
  this.generateYScale();
  this.generateData();
  this.generateColorScale();
  this.updateAxis();
  this.generateBars();

};


Square_Chart.prototype.updateChart = function() {
  this.data = 1 * d3.select("#dataInput").property("value");
  this.rows = 1 * d3.select("#rowsInput").property("value");
  this.series5 = 1 * d3.select("#series5Input").property("value");
  this.updateBars();
};

Square_Chart.prototype.showToolTip = function(d) {

  if (this.tooltipNode != undefined) {
    this.tooltipNode.remove()
  };

  this.tooltipNode = this.plot.append("g")
    .attr("transform", "translate(" + (this.xScale(d.x) * 1 + 5) + "," + (this.yScale(d.row) * 1 - 10) + ")")
    .style("opacity", 0)

  this.tooltipNode
    .append("rect")
    .attr("width", String(d.series + " | " + d.seriesNum).length * 9.1) //8.2 as a proxy of char length to calculate tooltip box width
    .attr("height", "1.6em")
    .attr("y", "-1.25em")
    .attr("fill", "lightgray")
    .attr("rx", 4)
    .style("pointer-events", "none");


  this.tooltipNode.append("text")
    .attr("x", "0.5em")
    .style("opacity", 0.9)
    .style("background", "lightgray")
    .text(d.series + " | " + d.seriesNum);

  this.tooltipNode
    .transition().duration(200)
    .style("opacity", 1);

};

Square_Chart.prototype.hideToolTip = function() {
  var that = this;
  that.tooltipNode.remove();
}

Square_Chart.prototype.generateButtons = function() {
  var that = this;
  d3.select(".button-container").append("div")
    .text("Data Points")
    .append("input")
    .attr("id", "dataInput")
    .attr("value", this.data)
  d3.select(".button-container").append("div")
    .text("Rows")
    .append("input")
    .attr("id", "rowsInput")
    .attr("value", this.rows)
  d3.select(".button-container").append("div")
    .text("Number of last series")
    .append("input")
    .attr("id", "series5Input")
    .attr("value", this.series5)
  d3.select(".button-container").append("button")
    .text("Update Data")
    .on("click", function() {
      that.updateChart()
    });

}

Square_Chart.prototype.removeData = function() {
  this.data.pop();
  this.updateBars();

};


Square_Chart.prototype.generateColorScale = function() {
  this.colorScale = d3.scaleOrdinal()
    .domain(d3.range(10))
    .range(this.colorPalette.map(function(d) {
      return d.color
    }))



}
