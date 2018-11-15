var initialize = false;
var custom_waveforms = [saw, triangle, square];
var fill_table = function(current_pattern) {
    if (initialize){
        current_patterns[1] = document.getElementById('pattern_1').value;
        current_patterns[2] = document.getElementById('pattern_2').value;
        current_patterns[3] = document.getElementById('pattern_3').value;
        current_patterns[4] = document.getElementById('pattern_4').value;
    }
    initialize = true

    var table_header = "<tr><td>Pulse 1"+
    "<select id='pattern_1' onchange='fill_table()' value="+current_patterns[1]+"></select>"+
    "</td><td>Pulse 2"+
    "<select id='pattern_2' onchange='fill_table()' value="+current_patterns[1]+"></select>"+
    "</td><td>Waveform"+
    "<select id='pattern_3' onchange='fill_table()' value="+current_patterns[1]+"></select>"+
    "</td><td>Noise"+
    "<select id='pattern_4' onchange='fill_table()' value="+current_patterns[1]+"></select>"+
    "</td></tr>";



    var table_contents = "";
    for (var j = 0; j < 32; j++){
        table_contents = table_contents + "<tr id=row_" + j + ">" + 
        "<td><input type='text' onchange='setValue(1, "+j+")' id='ch1_" + j + "' value='" + patterns[1][current_patterns[1]][j] + "'></input></td>"+
        "<td><input type='text' onchange='setValue(2, "+j+")' id='ch2_" + j + "' value='" + patterns[2][current_patterns[2]][j] + "'></input></td>"+
        "<td><input type='text' onchange='setValue(3, "+j+")' id='ch3_" + j + "' value='" + patterns[3][current_patterns[3]][j] + "'></input></td>"+
        "<td><input type='text' onchange='setValue(4, "+j+")' id='ch4_" + j + "' value='" + patterns[4][current_patterns[4]][j] + "'></input></td>"+
        "</tr>"
    }
    document.getElementById('control_table').innerHTML = table_header + table_contents;
        
    var selection = "";
    for (var i = 0; i < 36; i++){
        selection += "<option value='"+patterns_available[i]+"'>"+patterns_available[i]+"</option>";
    }
    document.getElementById('pattern_1').innerHTML = selection;
    document.getElementById('pattern_2').innerHTML = selection;
    document.getElementById('pattern_3').innerHTML = selection;
    document.getElementById('pattern_4').innerHTML = selection;
    document.getElementById('pattern_1').value = current_patterns[1];
    document.getElementById('pattern_2').value = current_patterns[2];
    document.getElementById('pattern_3').value = current_patterns[3];
    document.getElementById('pattern_4').value = current_patterns[4];
    
}
var setValue = function(channel, note){
        var new_note = (document.getElementById("ch" +channel+"_" +  note).value);
        document.getElementById("ch4_" +  current_step).innerHTML = new_note;
        console.log(channel, note
        , document.getElementById("ch" +channel+"_" +  note).value);


        patterns[channel][current_patterns[channel]][note] = new_note;
}


var tempo;
var playing_interval;
var play_pattern = function(){
    window.clearTimeout(playing_interval)
    current_step = 0; //setting this up for visualyzing either
    tempo = document.getElementById('tempo').value;
    playing_interval = setInterval(function(){
        document.getElementById('row_' + current_step).style.backgroundColor = "";
        document.getElementById('row_' + current_step).style.color = "";
        current_step = ++current_step % 32;
        document.getElementById('row_' + current_step).style.backgroundColor = "#87678c";
        document.getElementById('row_' + current_step).style.color = "white";
    
        interpret_channel_1(); 
        interpret_channel_2(); 
        interpret_channel_3(); 
        interpret_channel_4(); 
    }, 1000 / ( tempo / 60))
    
}
var stop_playing = function(){
    window.clearTimeout(playing_interval)
}


var current_patterns = [1,1,1,1,1];

var patterns_available = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
                          'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
                          'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 
                          's', 't', 'u', 'w', 'x', 'y', 'z' ] 

var patterns = []
        patterns[1] = {}
        patterns[2] = {}
        patterns[3] = {}
        patterns[4] = {}

    for (var j = 1; j < 5; j++){
        for (var i = 0; i < 34; i++){
        patterns[j][patterns_available[i]] = [];
            for (var k=0; k < 32; k++)
                patterns[j][patterns_available[i]][k] = '-' ;//15; //patterns_available[i] + k
        }
    }

fill_table();


var current_step = 0; //setting this up for visualyzing either
var selection = "";
