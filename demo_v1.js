$(document).ready(function() {
 		
	$('div#instructions').toggle();

	
 	/*set variables for preview image extents*/
 	
 	if ($('option#wisc').click(function(){
 		$('input#xmin').val(-92)
		$('input#ymin').val(42)
		$('input#xmax').val(-86)
		$('input#ymax').val(46)
 	}));
 	if ($('option#lowerStates').click(function(){
 		$('input#xmin').val(-126)
		$('input#ymin').val(12)
		$('input#xmax').val(-84)
		$('input#ymax').val(54)
 	}));
 	 if ($('option#mad').click(function(){
 		$('input#xmin').val(-89.5)
		$('input#ymin').val(43)
		$('input#xmax').val(-89.3)
		$('input#ymax').val(43.2)
 	}));
 	 if ($('option#minn').click(function(){
 		$('input#xmin').val(-97.3)
		$('input#ymin').val(43.3)
		$('input#xmax').val(-91.3)
		$('input#ymax').val(49.3)
 	}));
 	 	 if ($('option#sun').click(function(){
 		$('input#xmin').val(-89.25)
		$('input#ymin').val(43.17)
		$('input#xmax').val(-89.19)
		$('input#ymax').val(43.23)
 	}));

	/*Takes user input and sends to YQL API to extract XML for the WMS MAPSERVER file*/
$('input#submit').click(function(){
	var wmsRequest = $("form").serialize();
	var url= $('input#wms_url').val();
	requestWMS(url+wmsRequest, function(results){
				$(results).find("Layer").each(function(){
						//var extent = $(this).attr("maxx");
						//alert(extent);
						var name =$(this).find("Name").html();
						var class_id= name;
						var layer_id= "layer";
 						var id = $(this).attr('queryable');
 						var q_id = id;		
 						//$(this).find('title').text()
 						//var col = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
						//$('div#layer').css('background-color',col)
						
						$('#layer_results').append("<div id="+layer_id+" "+"title="+url+" "+"class="+class_id+" "+"name="+class_id+">"+name+"<div id='queryable' class=q"+q_id+">q</div><div id='metadata'"+"name="+class_id+" title='meta not working yet'>?</div><div id='addlayer'"+"name="+class_id+" title='add'>+</div><div id='close' title='close'>x</div></div></div>");
 						
 						/*Tells is layer is queryable or not*/
 						$('div#queryable.qundefined').html("U").attr('title','not queryable');
						$('div#queryable.q0').html("U").attr('title','not queryable');
						$('div#queryable.q1').html("Q").attr('title','queryable');

 						/*Allows user to remove layer choices*/
 						$('div#close').click(function(){
										$(this).parent().hide();
						});
						/*Adds Preview Image*/
						$('div#layer').click(function() {
											
										$(this).css({'color':'#666664','background-color':'#F7F486'});
										var url= $('input#wms_url').val();
						//xMin, yMin, xMax and yMax				
										var xMin = $('input#xmin').val()
										var yMin = $('input#ymin').val()
										var xMax = $('input#xmax').val()
										var yMax = $('input#ymax').val()
										var legend ="service=WMS&version=1.1.1&request=GetLegendGraphic&format=image/png"
										var image ="service=WMS&version=1.1.1&request=GetMap&srs=EPSG:4326&format=image/png&width=200&height=200&bbox="
										var layer = $(this).attr("name")		
										$('div#image_results').html("<img class='preview'src='"+url+image+xMin+","+yMin+","+xMax+","+yMax+"&layers="+layer+"'/>");
											
	 									$("img.preview").click(function(e){
     									var xp = e.pageX-316;
     									var yp = e.pageY-71;    									
     									$("span#status").html(xp +', '+ yp);   									
										var qurl= url+"VERSION=1.1.1&REQUEST=GetFeatureInfo&srs=EPSG:4326&format=image/png&width=200&height=200&bbox="+xMin+","+yMin+","+xMax+","+yMax+"&LAYERS="+layer+"&QUERY_LAYERS="+layer+"&X="+xp+"&Y="+yp+""
     								queryWMS(qurl, function(results){
     								var query_r=$(results).text()
											$('div#qresult').html(query_r);
								
     								});			
								
   /*http://www.mapfeeder.net/cgi-bin/rmb_new.cgi?VERSION=1.1.1&REQUEST=GetFeatureInfo&srs=EPSG:4326&format=image/png&width=960&height=400&bbox=-95.604,45.907,-92.9734,46.997&LAYERS=lakes_rmb&QUERY_LAYERS=lakes_rmb&X=-93.709&Y=46.26155*/									
     									
     									});
										
										$('div#metadata').click(function(){
											$('div#legend').html("<img class='legend'src='"+url+legend+"&layer="+layer+"'/>");
												
										})
										$('div#metadata').dblclick(function(){
										$('div#legend').html("");	
										})
						
			//http://vmap0.tiles.osgeo.org/wms/vmap0?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=population&format=image/png
			//vmap0.tiles.osgeo.org/wms/vmap0?service=WMS&version=1.1.1&request=GetLegendGraphic&format=image/png&layers=Vmap0
				});
				var xMin = $('input#xmin').val()
				var yMin = $('input#ymin').val()
				var xMax = $('input#xmax').val()
				var yMax = $('input#ymax').val()
				$(results).find("GetMap").each(function(){
					var name=$(results).find("GetMap").html();
				});
				
				
				$('div#addlayer').click(function(){
					var wms_url = $('input#wms_url').val()
					var layer = $(this).attr("name")
					$('span#wms_layers').text(layer);
					$('span#wms_url').text(wms_url);
					$('input#var_user').val(layer);
					$('input#var_user').keypress();
				});
	});
	
	return false;
});//end of sumbit function 


//Adds layer to Openlayers
$('div#addtoOL').click(function(){
		var	wms_title = $('span#wms_title').text()
		var	wms_url = $('span#wms_url').text()
		var wms_layers = $('span#wms_layers').text()
		$('#map_layers').append(wms_title+" "+wms_url+" "+wms_layers+"<br>")
		alert("Added "+wms_layers+" to map")
		return map.addLayer(new OpenLayers.Layer.WMS(wms_title,wms_url,{layers:wms_layers,isBaseLayer: "false",transparent: "true"}));

		});
		
		
$('input#var_user').keypress(function(){
		var name = ($(this).val())
		$('span#wms_title').html(name)
		});

//Explaination is in the tutorial http://net.tutsplus.com/tutorials/javascript-ajax/quick-tip-cross-domain-ajax-request-with-yql-and-jquery/
function requestWMS(site, callback){
	if (!site) {
		alert('No site was passed.');
		return false;
	}
	var yql = 'http://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent('select * from xml where url="'+site+'"')+'&format=xml&callback=?';
		$.getJSON(yql,function(data){
		if (data.results[0]){
			data = data.results[0];
		if (typeof callback ==='function'){
			callback(data);	
			}
			}
		else throw new Error("nothing returned");			
		});
}

//HERE
function queryWMS(site, callback){
	if (!site) {
		alert('No site was passed.');
		return false;
	}
	var yql_query = 'http://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent('select * from html where url ="'+site+'"')+'&format=xml&callback=?';
		$.getJSON(yql_query,function(data){
		if (data.results[0]){
			data = data.results[0];
		if (typeof callback ==='function'){
			callback(data);	
			}
			}
		else throw new Error("nothing returned");			
		});
}


     									/*%3D%22http%3A%2F%2Fwww.mapfeeder.net%2Fcgi-bin%2Frmb_new.cgi%3FVERSION%3D1.1.1%26REQUEST%3DGetFeatureInfo%26srs%3DEPSG%253A4326%26format%3Dimage%252Fpng%26width%3D960%26height%3D400%26bbox%3D-95.604%252C45.907%252C-92.9734%252C46.997%26LAYERS%3Dlakes_rmb%26QUERY_LAYERS%3Dlakes_rmb%26X%3D-93.709%26Y%3D46.26155*/





function showValues() {
	var str = $("form").serialize();
	var str_url = document.getElementById("wms_url").value;
	$("#results").text(str_url+str);
    } 
    $(":radio").change(showValues);
    $("select").change(showValues);
	showValues();
	$('div#help').click(function(){
		$('div#instructions').toggle();
	});
	$('span#example').click(function(){
		$('span#example_links').toggle();
	});
	
	$('#wms_loader').submit(function() {
		var wms_request = document.getElementById("wms_url").value;
		var wms_data = $('#results').html();
		$("wms_url").appendTo(showValues);
	return false;	
	});


})
	
});

/*http://www.mapfeeder.net/cgi-bin/rmb_new.cgi?VERSION=1.1.1&REQUEST=GetFeatureInfo&srs=EPSG:4326&format=image/png&width=960&height=400&bbox=-95.604,45.907,-92.9734,46.997&LAYERS=lakes_rmb&QUERY_LAYERS=lakes_rmb&X=-93.709&Y=46.26155*/