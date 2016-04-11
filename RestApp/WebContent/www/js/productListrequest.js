$(document).on('pageinit', '#home', function () {
  
    $.ajax({
        url: 'http://demo.copak.info/comp5326/GetProductList.php',
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
            $('#Product-data').append('<li><img src="img/' + r[index]["Code"] + '.gif" height=150></li>');
            $('#Product-data').append('<li style="white-space:normal">Name: ' + r[index]["Name"] + '</li>');
            $('#Product-data').append('<li style="white-space:normal">Description : ' + r[index]["Description"] + '</li>');
            $('#Product-data').append('<li>Price: ' + r[index]["SellingPrice"] + '</li>');
            $('#Product-data').append('<li style="white-space:normal"><a href="GetShopByProduct.html?code=' + r[index]["Code"] + '" data-ajax="false" data-role="button" data-transition="slidefade"> Where can I buy this Product? </a></li>');
            sessionStorage.setItem("ByProduct",  r[index]["Code"] ); // Past Product Code to next page for searching
            //$('#Product-data').listview('refresh');
            
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
       // for(index = 0; index < result.length; ++index){
	//		 $("#Product-list").append('<li style="white-space:normal"><a href="" data-id="' + result[index]["ID"] + '"><img src="img/' + result[index]["Code"] + '.gif"/><h3>' + result[index]["Name"] + '</h3><p>HKD ' + result[index]["SellingPrice"] + '</p></a></li>');
	//		 }
        //$('#Product-list').listview('refresh');
        ProductInfo.id=getUrlParameter("dataid");
        //alert(getUrlParameter("dataid"));
        $('#Product-data').empty();
        var r = ProductInfo.result;
        for(index = 0; index < r.length; ++index) {
        if (r[index]["ID"] == ProductInfo.id) {
            $('#Product-list').append('<li><img src="img/' + r[index]["Code"] + '.gif" height=150></li>');
            $('#Product-list').append('<li style="white-space:normal">Name: ' + r[index]["Name"] + '</li>');
            $('#Product-list').append('<li style="white-space:normal">Description : ' + r[index]["Description"] + '</li>');
            $('#Product-list').append('<li>Price: ' + r[index]["SellingPrice"] + '</li>');
            $('#Product-list').append('<li style="white-space:normal"><a href="GetShopByProduct.html?code=' + r[index]["Code"] + '" data-ajax="false" data-role="button" data-transition="slidefade"> Where can I buy this Product? </a></li>');
            sessionStorage.setItem("ByProduct",  r[index]["Code"] ); // Past Product Code to next page for searching
            $('#Product-list').listview('refresh');
            
            }
        }
       // $.mobile.changePage("#headline", {
       // transition: "slide",
       // changeHash: false
       // });

    }
}

  function getUrlParameter(sParam)
  {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
  }