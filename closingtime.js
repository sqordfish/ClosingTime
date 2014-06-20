/*
closingtime.js
Author: Jacob Rust
Date: 2/28/2014
This file contains javascript code to retrieve info about a place using
google places api
*/

//function Coordinates(latitude, longitude) {
//    var latitude;
//    var longitude;
//    function setLat(lat) {
//        this.latitude = lat;
//    } 
//    function setLong(long) {
//        this.longitude = long;
//    }
//}

//Gets location of the user and 
function getLocation() {
    
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(search, error);
    } else {
	alert("geolocation did not work");
    }
    
    function success(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;;
        search(latitude, longitude);
    }
    
    function error(position) {
	alert("Error");
        coords = new Coordinates(40, 74);
    }
}

//Searches for whatever is in the search box based off the location
function search(position) {

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, false);
    var service = new google.maps.places.PlacesService(document.getElementById("places-services"));
    var firstEntry = true;
    
    var request = {
	location: latLng,
        query: document.getElementById("box").value,
	radius: 10
    };

    service.textSearch(request, textCallback);
    
    //Callback function for the text search
    //Creates a request and gets the details of the place
    function textCallback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i=0; i< (results.length/3); i++) {      
                request = {
                    key: "AIzaSyD3EP515KhhM_8-DynbR10EcSg8D8c7KFs",
                    reference: results[i].reference,
                    sensor: false
                };
                
                service.getDetails(request, detailsCallback);
            }
        } else {
            alert("fail");
        }
    }
    
    //Callback function for the place details
    //Displays info about the place to the screen
    function detailsCallback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var hours = place.opening_hours.periods;
            var name = place.name;
            var div = document.getElementById("searchResults");
                    
            //Results for the first entry look different
            if (firstEntry) {
                firstEntry = false;        
                var firstDiv = document.createElement('div');
                firstDiv.style.fontSize = "50px";
                firstDiv.style.color = "#0074bc";
                var day = (new Date()).getDay();
                
                //TODO get a photo of the place
//                try {
//                    var photoUrl = place.photos.raw_reference.fife_url;
//                    firstDiv.innerHTML += "<img src=&quot" + photoUrl + "&quot>";
//                } catch (e) {}
                       
                //If open 24 hours
                if (hours.length <= 2) {
                    firstDiv.innerHTML += name + " is open 24 hours a day!";
                } else {
                    var index = 0;
                    for (var element in hours) {
                        if (element == day) {
                            index = element;
                        } 
                    }
                    firstDiv.innerHTML += name + " is open today from " +
                    parseTime(hours[index].open.time) + " to " + 
                    parseTime(hours[index].close.time);
                }
                        
                div.appendChild(firstDiv);
                var notesDiv = document.createElement('div');
                notesDiv.style.color = "#C1272D";
                
                notesDiv.innerHTML += "These results come from the " + name +
                        " at ";
                
                //Display info about the location
                var addressInfo = place.address_components;
                for (var i = 0; i < addressInfo.length; i++) {
                    notesDiv.innerHTML += addressInfo[i].short_name + " ";
                }
                               
                notesDiv.innerHTML += "<br>Refresh the page to look up something else.";
                
                div.appendChild(notesDiv);
            }
                    
//            TODO include more locations
//            for (var i = 1; i < hours.length; i++) {
//                div.innerHTML += "<br> Day: "+ hours[i].open.day;
//                div.innerHTML += "<br>"+hours[i].open.time+"-"+hours[i].close.time;
//            }
        }
    }
}

//Changes time from googles representation to the normal
//ex: 0130 -> 1:30
function parseTime(time) {

    var period = (time >= 1200 ? "PM": "AM");
    
    time = time % 1200;

    //if it is 12 o clock
    if (time <= 59) {
        time += 1200;
    }
    
    time = new String(time);
    //add the colon to the time
    //length - 2 accounts for 3 and 4 digit times
    return time.substr(0, time.length-2) + ":" 
            + time.substr(time.length-2) + period;
    
}

//Changes day from google representation to normal
//ex 1 -> Monday
function parseDay(day) {
    switch(day) {
        case '0':
            return "Sunday";
        case '1':
            return "Monday";
        case '2':
            return "Tuesday";    
        case '3':
            return "Wednesday";
        case '4':
            return "Thursday";
        case '5':
            return "Friday";
        case '6':
            return "Saturday";
    }
}

function start() {
    getLocation();
}


