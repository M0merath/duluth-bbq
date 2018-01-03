// =========== GLOBAL ===========

// Create a Google Map variable
var map;
// Create an empty array of markers
var markers = [];

// Store the Foursqare client ID and secret for future reference
var client_id = 'SFLIZ3Z0VXO4TXM5C3UUUUETPD4ZZIO5QE1O2LKLHTXLBDUE';
var client_secret = 'QC4XDEDAHXXEYRLTFEHAMD1APQDQOJLIQZMPTEFGEPFEKYNR';
var searchEntry = null;

// Search for Korean BBQ restaurants in Duluth, GA using Foursquare
var initialURL = 'https://api.foursquare.com/v2/venues/search?' + 
'v=20161016&ll=33.958681%2C%20-84.1363947&radius=2000&query=Korean%20BBQ' + 
'&limit=10&intent=browse&client_id=' + client_id + '&client_secret=' + client_secret

var viewModel = {
  // Initialize the map within the div
  initMap: function() {
    searchEntry = ko.observable('');
    map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 33.958681, lng: -84.1363947},
		zoom: 15
	});
	// Create an infowindow to display when a marker is clicked
	largeInfowindow = new google.maps.InfoWindow();

	model.populateRestaurants(initialURL);
	//view.showListings();
	view.sidebarButtons();
  }
}

// ============ MODEL =============
var model = {

	populateRestaurants: function(query) {
    	// Using Foursquare, place 10 markers matching query.
     	$.getJSON(query, function(data) {
      		var results = data.response.venues;
      		for (var i = 0; i < results.length; i++) {
        		var result = results[i];
        		var position = result.location;
        		var title = result.name;
        		var foursquareID = result.id;
        		var marker = new google.maps.Marker({
          			position: position,
          			title: title,
          			animation: google.maps.Animation.DROP,
          			id: i,
          			foursquareID: foursquareID
        		});
        		markers.push(marker);
        		marker.addListener('click', function() {
          			view.prepareInfoWindow(this, largeInfowindow);
        		});
      		}
      		view.populateSidebar(markers);
    	});
	},

    //myLocationsFilter: ko.computed(function() {
    //    var result = [];
    //    for (var i = 0; i < markers.length; i++) {
    //        var markerLocation = markers[i];
    //        if (markerLocation.title.toLowerCase().includes(searchOption()
    //                .toLowerCase())) {
    //            result.push(markerLocation);
    //            markers[i].setVisible(true);
    //        } else {
    //            markers[i].setVisible(false);
    //        }
    //    }
    //    return result;
    //}, ); 
  foursquareVenue: function(id, infowindow, marker) {
      var foursquareURL = 'https://api.foursquare.com/v2/venues/' + id + 
      '?v=20161016&client_id=' + client_id + '&client_secret=' + client_secret;
      $.getJSON(foursquareURL, function(data) {
        var results = data.response.venue;
        // Is there a listed phone number for this venue?
        if (results.contact.formattedPhone != undefined) {
          var phoneContact = results.contact.formattedPhone;
        } else {
          var phoneContact = 'none listed';
        }
        // Is there a rating for this venue?
        if (results.rating != undefined) {
          var venueRating = results.rating;
        } else {
          var venueRating = 'n/a';
        }
        infowindow.setContent(
          '<div>' + 
          '<div style="width: 105px; float: left; display: inline-block;">' + 
          '<span>' + '<img src="' + results.bestPhoto.prefix + 'width100' + results.bestPhoto.suffix + '"></span>' + 
          '</div>' + 
          '<div style="width: 200px; float: left; display: inline-block">' + 
          '<span>' + '<strong>' + results.name + '</strong></span><br>' + 
          '<span>' + '<strong>Rating: </strong>' + venueRating + '</span>' + '&emsp;' +  
          '<span>' + '<strong>Price: </strong>' + results.price.tier + '</span><br>' + 
          '<span>' + '<strong>Address: </strong><br>' + results.location.formattedAddress + '</span><br>' + 
          '<span>' + '<strong>Phone: </strong>' + phoneContact + '</span>' + 
          '</div>' + 
          '</div>');
      });
      infowindow.open(map, marker);
    },
}

// ============ VIEW ==============
var view = {
	showListings: function() {
    //console.log('Before: ' + this.searchEntry);
    //this.searchEntry = ko.observable('');
    //console.log('After: ' + this.searchEntry());
  	var bounds = new google.maps.LatLngBounds();
  	// Extend the boundaries of the map for each marker and display the marker
  	for (var i = 0; i < markers.length; i++) {
    	if (markers[i].title.toLowerCase().includes(searchEntry().toLowerCase())) {
        markers[i].setMap(map);
        markers[i].setVisible(true);
      } else {
        markers[i].setMap(map);
        markers[i].setVisible(false);
      }
      //markers[i].setMap(map);
    	bounds.extend(markers[i].position);
  	}
  	map.fitBounds(bounds);
	},

	// This function will loop through the listings and hide them all.
	hideListings: function() {
  		for (var i = 0; i < markers.length; i++) {
    		markers[i].setMap(null);
  		}
	},

	// This function will select one marker and recenter the map.
	selectOne: function(selection) {
  		google.maps.event.trigger(map, "resize");
		map.panTo(markers[selection].getPosition());
		map.setZoom(16);
	},
	
	// Prepare the infowindow to be filled with Foursquare API data.
	prepareInfoWindow: function(marker, infowindow) {
  		// Check to make sure the infowindow is not already opened on this marker.
  		if (infowindow.marker != marker) {
    		// Clear the infowindow content to give the Foursquare API time to load.
    		infowindow.setContent('');
    		infowindow.marker = marker;
    		// Make sure the marker property is cleared if the infowindow is closed.
    		infowindow.addListener('closeclick', function() {
      			infowindow.marker = null;
    		});
    		model.foursquareVenue(marker.foursquareID, infowindow, marker);
		}
	},
  populateSidebar: function(markers) {
      for (var i = 0; i < markers.length; i++) {
          // Create a listing per restaurant, and add it to the sidebar.
          restaurant = markers[i].title;
          restNum = i;
          var newListing = document.createElement("div");
          var listButton = document.createElement("button");
          listButton.setAttribute("onclick", "view.selectOne(" + restNum + ")");
          var textnode = document.createTextNode(restaurant);
          listButton.appendChild(textnode);
          newListing.appendChild(listButton);
          var sidebar = document.getElementById("sidebar");
          sidebar.insertBefore(newListing, sidebar.childNodes[i]);
        } 
    },

	// Sidebar buttons to 'show' and 'hide' markers.
	sidebarButtons: function() {
	document.getElementById('show-listings').addEventListener('click', view.showListings);
	document.getElementById('hide-listings').addEventListener('click', view.hideListings);
	},
}

// Let's get started by initializing our viewmodel using Knockout
function getStarted() {
  ko.applyBindings(viewModel);
  viewModel.initMap();
};