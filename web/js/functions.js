$(document).ready(function() {

	var flight_data_jfk = {};
	var flight_data_lax = {};

	$.getJSON("https://raw.githubusercontent.com/pirasathv/TravelSight/master/data/flight_data.json").then(function(response) {
	flight_data_lax = response;
	
    var airport = [];
    for(var i = 0; i<response.length;i++)
        {
            airport[i] = response[i].airport_name + " - " + response[i].airport;
        }
    
    $.unique(airport);
    
    $('#form-arrival').autocomplete({
        source:airport
    });
    
    $('#form-destination').autocomplete({
        source:airport
    });

    var toValue ;
    $('#form-destination').on('autocompletechange change', function () {
        toValue = this.value;
    }).change();

	$('#form-submit').on('click',function( event ) {
	
	var fromValue = $('#form-arrival').val();
	var toValue = $('#form-destination').val();
	var date = $('#form-datepicker').val();

	var symbol = fromValue.substring((fromValue.length-3), fromValue.length);
	
	var objDate = new Date(date);
    month = objDate.getMonth() + 1;

	var chartPercent = averageDelayAirport(flight_data_lax,symbol,month);
    drawChart(chartPercent);
    drawChartDetail((chartPercent*100)*4, (chartPercent*100)*3, (chartPercent*100)*2);

	});

	function averageDelayAirport(airport,name,month){
		var totalAirport = 0;  
		var counter = 0;
		for (key in airport) {
			if(airport[key].airport === name){
				if((airport[key].month === month)){
				counter++;
				totalAirport += delay(airport[key]);
				}
			}
		}
		return totalAirport/counter;
	}

	});

});

function delay(airportDelay){

	//bug with data set that will add null value so implment check to see if one value is null then return 0
	if(airportDelay.arr_cancelled === null){
		return 0;
	}

	var divisor = airportDelay.arr_flights;
	var arr_del15 = (airportDelay.arr_del15/divisor)*100;
	var carrier_ct = (airportDelay.carrier_ct/divisor)*100;
	var weather_ct = (airportDelay.weather_ct/divisor)*100;
	var nas_ct = (airportDelay.nas_ct/divisor)*100;
	var security_ct = (airportDelay.security_ct/divisor)*100;
	var late_aircraft_ct = (airportDelay.late_aircraft_ct/divisor)*100;
	var arr_cancelled = (airportDelay.arr_cancelled/divisor)*100;
	var arr_diverted = (airportDelay.arr_diverted/divisor)*100;

	var total_delay = arr_del15 + carrier_ct + weather_ct + nas_ct + security_ct + late_aircraft_ct + arr_cancelled + arr_diverted;
    
	return total_delay;
}

