# Duluth BBQ (AKA: My Udacity Neighborhood Map project)
## Project Description
The primary purpose of Duluth BBQ is to demonstrate mastery of many tools and technologies useful to a fullstack web developer, including: AJAX requests, combining third-party APIs to create something new, JQUERY, and Knockout.js. The secondary purpose of Duluth BBQ is to help people in and around Duluth, GA locate tasty Korean barbeque. Because good Korean barbeque is a treasure, and Duluth is the motherlode.

## Contents
This repository contains all of the following:
- README.md		(you are reading this now)
- DuluthBBQ.html	(your entry point to the Duluth BBQ app)
- DuluthBBQ.js		(the Javascript executable, in the "js" folder)
- styles.css		(the CSS "style file", in the "css" folder)

## To Use
1. Clone or fork this repository to your local machine. See Github documentation for details.
2. Open the DuluthBBQ.html file to start the app. You must have internet access, and your firewall must admit Foursquare; otherwise you will receive an error and/or the map will remain blank.
3. The map will populate with ten markers within seconds. These are restaurants Foursquare selected on the basis of geographic proximity matching the query "Korean BBQ".
4. To the left of the map you will see a sidebar containing one search field. Type anything here to activate the filter. Restaurant names corresponding to the markers will populate the sidebar, instantly. Restaurants will disappear from the sidebar AND map if their names do not match any part of the search query.
5. You may select any marker by clicking its link in the sidebar or clicking the marker directly. The map will pan and recenter, the marker will bounce, and an infowindow will appear with detailed information about your selection. This includes the restaurant address, rating (if available), and a photo. To close this infowindow, simply select any other marker.
6. (optional) Drive to Duluth, GA and sample delicious Korean BBQ! Knowledge is power, and power is spicy!

## Credits
This app was developed as the penultimate project for the Udacity Fullstack Web Developer program, and is the product of every lesson I've learned and every bone-headed coding mistake I've ever made. My Git logfile is a testament to the many twists and turns on this journey.

This could not have been completed without the help of free software like:
- JQUERY		(for all the AJAX requests connecting HTML to Javascript)
- Google Maps API 	(for the map, markers, and animations)
- Foursquare API	(for up-to-date restaurant data)
- Knockout.js		(for a search filter that updates automatically)
- Git Bash		(funny name; serious version tracking)
- Github		(hosting solution for my online repository)      