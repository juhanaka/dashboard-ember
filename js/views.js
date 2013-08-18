App.ChartwrapperView = Ember.View.extend({
	templateName: 'chartwrapper'

});

App.ChartView = Ember.View.extend({
	tagName: 'svg',
	templateName: 'chart',
	addedChart: false,
	addChart: function() {
		console.log('in addchart function')
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
		var self = this;
		var loadedMetrics = self.get('context.metrics.loadedMetrics');
		loadedMetrics.then(function () {self.addChart();console.log('adding chart from insert element')})
	},

	reduceFieldChanged: Ember.observer(function() {
		console.log("field changed");
		var self = this;
		var loadedMetrics = this.get('context.metrics.loadedMetrics');
		loadedMetrics.then(function () {self.addChart(); console.log('adding chart from field change')})
	}, 'controller.reduceField'),

	metricsChanged: Ember.observer(function() {
		console.log("data changed");
		var loadedMetrics = this.get('context.metrics.loadedMetrics');
		var self = this;
		loadedMetrics.then(function () {console.log('adding chart from metric change');self.addChart(); })
	}, 'controller.metrics.@each.values')

	}

);

App.dateRangeSlider = JQ.slider.extend({
	range: true,
	max: function() {return Math.floor((new Date(this.get('context.values.0.bounds.max'))).getTime() / 86400000) +1 ;}.property('context'),
	min: function() {return Math.floor((new Date(this.get('context.values.0.bounds.min'))).getTime() / 86400000) +1 ;}.property('context'),
	values: function() {return [
		Math.floor((new Date(this.get('context.values.0.selected.min'))).getTime() / 86400000) +1, 
		Math.floor((new Date(this.get('context.values.0.selected.max'))).getTime() / 86400000) +1
		]
		;}.property('context'),

	slide: function(event, ui) {
		var minDate = ui.values[0],
			maxDate = ui.values[1];
		this.set('controller.values.0.selected.min', (new Date(minDate*86400000)).toISOString());
		this.set('controller.values.0.selected.max', (new Date(maxDate*86400000)).toISOString());
		console.log(ui.values[0], ui.values[1]);
	}
})





