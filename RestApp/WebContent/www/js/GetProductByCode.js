
$(document).on('pageinit', '#home', function () {
    $.ajax({
    	//http://demo.copak.info/comp5326/GetProductByCode.php?code=P0001
        url: 'http://demo.copak.info/comp5326/GetProductByCode.php?code=P0001',
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

$(document).on('pagebeforeshow', '#headline', function () {
    	$('#Product-data').empty();
    	var r = ProductInfo.result;
        for(index = 0; index < r.length; ++index) {        
        if (r[index]["ID"] == ProductInfo.id) {
            $('#Product-data').append('<li><img src="img/' + r[index]["Code"] + '.gif"></li>');
            $('#Product-data').append('<li>Name: ' + r[index]["Name"] + '</li>');
            $('#Product-data').append('<li>Description: ' + r[index]["Description"] + '</li>');
            $('#Product-data').listview('refresh');
            }
        }
    
});

$(document).on('vclick', '#Product-list li a', function () {
	ProductInfo.id = $(this).attr('data-id');		
    $.mobile.changePage("#headline", {
        transition: "slide",
        changeHash: false
    });
});

var ProductInfo= {
    id: null,
    result: null
}

var ajax = {
    parseJSONP: function (result) {
    ProductInfo.result = result;
        for(index = 0; index < result.length; ++index){        	
			 $("#Product-list").append('<li><a href="" data-id="' + result[index]["ID"] + '"><img src="img/' + result[index]["Code"] + '.gif"/><h3>' + result[index]["Name"] + '</h3><p>' + result[index]["Description"] + '</p></a></li>');
			 }
        $('#Product-list').listview('refresh');
    }
}
