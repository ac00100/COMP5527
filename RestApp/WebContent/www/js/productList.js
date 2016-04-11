$(document).on('pageinit', '#home', function(){  
	var jsonString = localStorage.getItem("productobj");
	var obj = JSON.parse(jsonString);
	ajax.parseJSONP(obj);
	/*
    var url = 'http://api.themoviedb.org/3/',
        mode = 'search/movie?query=',
        movieName = '&query='+encodeURI('Batman'),        
        key = '&api_key=5fbddf6b517048e25bc3ac1bbeafb919';        
   
    $.ajax({
        url: url + mode + key + movieName ,
        dataType: "jsonp",
        async: true,
        success: function (result) {
        	
           // ajax.parseJSONP(result);
        	var jsonString = '{"results":[{"id":"1","product":"coke","price":"3","quantity":"400"},{"id":"2","product":"banana","price":"2","quantity":"100"}]}';
        	var obj = JSON.parse(jsonString);
        	ajax.parseJSONP(obj);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });     
    console.log("Product:" + localStorage.getItem("productobj"));
    */
});

$(document).on('pagebeforeshow', '#headline', function(){      
	var jsonString = localStorage.getItem("productobj");
	var obj = JSON.parse(jsonString);
	ajax.parseJSONP(obj);
    $('#movie-data').empty();
    $.each(movieInfo.result, function(i, row) {
        if(row.id == movieInfo.id) {
            $('#movie-data').append('<li>Product: '+row.product+'</li>');
            $('#movie-data').append('<li>Price: <input type="text" id="price" value="'+row.price+'"></li>');
            $('#movie-data').append('<li>Quantity : <input type="text" id="quantity" value="'+row.quantity+'"></li>');   
            $('#movie-data').append('<li><input type="button" value="Save" onclick="setProduct('+row.id+');"></li>');
            $('#movie-data').listview('refresh');            
        }
    });    
});

$(document).on('vclick', '#movie-list li a', function(){  
    movieInfo.id = $(this).attr('data-id');
    $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });
});

var movieInfo = {
    id : null,
    result : null
}

var ajax = {  
    parseJSONP:function(result){  
    	$('#movie-list').empty();
        movieInfo.result = result.results;
        $.each(result.results, function(i, row) {
            console.log(JSON.stringify(row));
            $('#movie-list').append('<li><a href="" data-id="' + row.id + '"><h3>' + row.product + '</h3><p>' + row.price + '</p></a></li>');
        });
        $('#movie-list').listview('refresh');
    }
}

function setProduct(id) {
	var jsonString = localStorage.getItem("productobj");
	var jsonObj = JSON.parse(jsonString).results;
	console.log(jsonObj);
	console.log(jsonObj.length);
	for (var i=0; i<jsonObj.length; i++) {
	    if (jsonObj[i].id == id) {
	      jsonObj[i].price = $('#price').val().toString();
	      jsonObj[i].quantity = $('#quantity').val().toString();
	    }
	  }
	console.log(jsonObj);
	localStorage.setItem("productobj",'{"results":'+JSON.stringify(jsonObj)+'}'); 
	}