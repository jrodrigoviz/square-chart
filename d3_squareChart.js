var Square_Chart = function(opt) {
  this.data = opt.data;
  this.col = opt.col;
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

  this.generateData();
  this.generateXScale();
  this.generateYScale();
  this.generateColorScale();
  this.addAxis();
  this.generateButtons();
  this.generateBars();

};

Square_Chart.prototype.generateXScale = function() {
  this.xScale = d3.scaleLinear()
    .domain([0, this.rows])
    .range([0, this.width - 2 * this.padding]);

  this.xAxis = d3.axisBottom().ticks(5).scale(this.xScale);
}

Square_Chart.prototype.generateYScale = function() {
  this.yScale = d3.scaleLinear()
    .domain([0, this.rows])
    .range([0, this.height - 2 * this.padding]);
  this.yAxis = d3.axisLeft().ticks(5).scale(this.yScale);
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
  this.data.sort(function(a, b) {
    return a.value - b.value;
  });

  this.numSeries = this.data.length;
  this.chart_data = [];
  this.numRect = 0;
  var rectIndex = 0;


  //calcualte total number of rectangles to draw
  for (var i = 0; i < this.numSeries; i++) {
    this.numRect += this.data[i].value;
  }

  var col = Math.ceil(Math.sqrt(this.numRect));
  this.rows = Math.ceil(Math.sqrt(this.numRect));
  for (var i = 0; i < this.numSeries; i++) {
    for (var j = 0; j < this.data[i].value; j++) {

      this.chart_data.push({
        "series": this.data[i].series,
        "value": j + 1,
        "of": this.data[i].value,
        "x": rectIndex % col,
        "row": Math.floor(rectIndex / col),
        "color": i
      });
      rectIndex += 1;
    };
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
    .transition().duration(this.speed)
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
  this.generateData();
  this.generateXScale();
  this.generateYScale();
  this.generateColorScale();
  this.updateAxis();
  this.generateBars();

};

Square_Chart.prototype.showToolTip = function(d) {

  if (this.tooltipNode != undefined) {
    this.tooltipNode.remove()
  };

  this.tooltipNode = this.plot.append("g");

  //check length of text
  this.tooltipNode.append("text")
    .attr("id","tooltiptext")
    .attr("opacity",1)
    .text(d.series + " | "+ d.dollar +" | " + d.value );

  var text_width = d3.select("#tooltiptext").node().getComputedTextLength()+15;

  this.tooltipNode
    .attr("transform", "translate(" +Math.min(this.xScale( d.x) * 1 + 5, this.width-this.padding - text_width )   + "," + (this.yScale(d.row) * 1 - 10) + ")")
    .style("opacity", 0);

  this.tooltipNode.append("rect")
    .attr("id","rext")
    .attr("width",text_width)
    .attr("height", "1.6em")
    .attr("y", "-1.25em")
    .attr("fill", "lightgray")
    .attr("rx", 4)
    .style("pointer-events", "none");

  this.tooltipNode.append("text")
      .attr("x", "0.5em")
      .style("opacity",0.9)
      .style("background", "lightgray")
      .text(d.series + " | "+ d.dollar +" | " + d.value );

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

  d3.select(".button-container").append("button")
    .text("Add Another Series")
    .on("click", function() {
      that.addData();
      that.updateBars();
    })
  d3.select(".button-container").append("button")
    .text("Remove Last Series")
    .on("click", function() {
      that.removeData();
      that.updateBars();
    })

}

Square_Chart.prototype.removeData = function() {
  this.data.pop();
  this.updateBars();

};

Square_Chart.prototype.addData = function() {
  this.data.push({
    "series": "A" + this.data.length + 1,
    "value": Math.floor(Math.random() * 100)
  });
  this.updateBars();

};


Square_Chart.prototype.generateColorScale = function() {
  this.colorScale = d3.scaleOrdinal()
    .domain(d3.range(10))
    .range(this.colorPalette.slice(0).reverse().map(function(d) {
      return d.color
    }))

}
