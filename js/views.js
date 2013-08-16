App.ChartwrapperView = Ember.View.extend({
	templateName: 'chartwrapper'

});

App.ChartView = Ember.View.extend({
	tagName: 'svg',
	templateName: 'chart',
	addChart: function() {
		var format = this.get('context.format'),
			width = this.get('context.width'),
			data = this.get('context.calculatedData'),
			elementId = this.get('elementId'),
			display = this.get('context.display');
		nv.addGraph(function() {


			if (format == "bar")
				var chart = nv.models.multiBarChart();
			else if (format == "line")
				var chart = nv.models.lineChart();

			chart = setGraphxAxis(data, chart);
			chart = setGraphyAxis(data, chart, display);

			d3.select('#'+elementId)
				.datum(data)
				.transition().duration(500)
				.call(chart)

			nv.utils.windowResize(function() { d3.select('#' + elementId).call(chart) })
			return chart
		})
	},

	didInsertElement: function() {
		this.addChart();
	},

	reduceFieldChanged: Ember.observer(function() {
		console.log("field changed");
		this.addChart();
	}, 'controller.reduceField'),

	metricsChanged: Ember.observer(function() {
		console.log("data changed");
		this.addChart();
	}, 'controller.metrics.@each.values')

	}

);

App.ApplicationView = Ember.View.extend({
	didInsertElement: function() {
		$("#slider").dateRangeSlider()

	}
})





