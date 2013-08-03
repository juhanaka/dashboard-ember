App.ChartView = Ember.View.extend({
	templateName: 'chart',

	addChart: function() {
		var format = this.get('context.format'),
			width = this.get('context.width'),
			values = this.get('context.values'),
			elementId = this.get('elementId');
		nv.addGraph(function() {
			if (format == "bar")
				var chart = nv.models.multiBarChart();
			else if (format == "line")
				var chart = nv.models.lineChart();

			chart.xAxis
				.tickFormat(d3.format(',f'));

			chart.yAxis
				.tickFormat(d3.format(',.1f'));

			d3.select('#'+elementId)
				.datum(values)
				.transition().duration(500).call(chart);

			nv.utils.windowResize(chart.update);

			return chart
		})
	},

	didInsertElement: function() {
		this.addChart();
	}


	}

);

