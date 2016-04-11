$(document).on('pageinit', '#home', function () {
    $.ajax({
        url: 'http://demo.copak.info/comp5326/GetShopByProduct.php?code='+sessionStorage.getItem("ByProduct"),
        dataType: "jsonp",
        async: true,
        type: 'POST',
        success: function (result) {  
            ajax.parseJSONP(result);
        },
        error: function (x,e) {
            if(x.status==0){
                alert('You are offline!!\n Please Check Your Network.');
            }else if(x.status==404){
                alert('Requested URL not found.');
            }else if(x.status==500){
                alert('Internel Server Error.');
            }else if(e=='parsererror'){
                alert('Error.\nParsing JSON Request failed.');
            }else if(e=='timeout'){
                alert('Request Time out.');
            }else {
                alert('Unknow Error.\n'+x.responseText);
            }            
        }
    });
});


$(document).on('pagebeforeshow', '#Pheadline', function () {
    	$('#PShop-data').empty();
    	var r = ShopInfo.result;
    	var index = 0;
        for(index = 0; index < r.length; ++index) {        
        if (r[index]["ID"] == ShopInfo.id) {
            $('#PShop-data').append('<li style="white-space:normal">Name: ' + r[index]["Name"] + '</li>');
            $('#PShop-data').append('<li style="white-space:normal">Address: ' + r[index]["Address"] + '</li>');
            $('#PShop-data').append('<li>Lat: ' + r[index]["Lat"] + '</li>');
            $('#PShop-data').append('<li>Lng: ' + r[index]["Lng"] + '</li>');
			$('#PShop-data').listview('refresh');
            }
        }
    
});


$(document).on('vclick', '#PShop-list li a', function () {
	ShopInfo.id = $(this).attr('data-id');		
    $.mobile.changePage("#Pheadline", {
        transition: "slide",
        changeHash: false
    });
});

var ShopInfo= {
    id: null,
    result: null
}

var ajax = {
    parseJSONP: function (result) {
    ShopInfo.result = result;
        for(index = 0; index < result.length; ++index){        	
			 $("#PShop-list").append('<li style="white-space:normal"><a href="" data-id="' + result[index]["ID"] + '"><h3>' + result[index]["Name"] + '</h3><p>' + result[index]["Address"] + '</p></a></li>');
			 }
        $('#PShop-list').listview('refresh');
    }
        
}


$( document ).on( "pagebeforeshow", "#Pheadline", function() {

    	var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
    	var r = ShopInfo.result;
        for(index = 0; index < r.length; ++index) {        
        if (r[index]["ID"] == ShopInfo.id) {
			defaultLatLng = new google.maps.LatLng(r[index]["Lat"],  r[index]["Lng"]);
            }
        }


    if ( navigator.geolocation ) {
        function success(pos) {
            // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        drawMap(defaultLatLng );  // No geolocation support, show default map
    }
    function drawMap(latlng) {
        var myOptions = {
            zoom: 18,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Greetings!"
        });
    }
});
