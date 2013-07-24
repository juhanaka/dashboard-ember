var selectedFilters = function(filters) {
	_.map(filters, function(filter) {
		return {id: filter.get('id'), }
	})
}