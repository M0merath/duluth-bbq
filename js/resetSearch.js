function viewModel2() {
	this.searchEntry = ko.observable(null);
	this.searchFilter = ko.computed(function() {
    	this.searchEntry();
    	var result = [];
    	for (var i = 0; i < this.markers.length; i++) {
      		var marker = this.markers[i];
      		if (marker.title.toLowerCase().includes(this.searchEntry().toLowerCase())) {
        		result.push(marker);
        		this.markers[i].setVisible(true);
      		} else {
        		this.markers[i].setVisible(false);
      		}
    	} 
    	return result;
  	}, this);
}