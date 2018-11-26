var text_file = null;
var makeTextFile = function(text) {
  var data = new Blob([text], {type: 'text/plain'});
    
  if(text_file !== null) {
    window.URL.createObjectURL(data);
    
  }
    
  text_file = window.URL.createObjectURL(data);
  return text_file;
};
var create = document.getElementById("download");
    
  console.log(create);
var save =function () {
    
    var gb_papu_data = {
        tempo : document.getElementById('tempo').value,
        pattern_layout : pattern_layout,
        patterns : patterns,
        custom_noises : custom_noises,
        custom_waveforms : custom_waveforms,
        patterns_used : patterns_used,
    };


    console.log(event);
    var link = document.getElementById('download_link');
    link.href= makeTextFile(JSON.stringify(gb_papu_data));
    link.style.display ="block";
  }
var load_json =function () {
    
    var gb_papu_data = JSON.parse(document.getElementById('load').value);
    
    console.log(gb_papu_data)
        tempo = gb_papu_data.tempo;
        pattern_layout = gb_papu_data.pattern_layout;
        patterns = gb_papu_data.patterns;
        custom_noises = gb_papu_data.custom_noises;
        custom_waveforms = gb_papu_data.custom_waveforms;
        patterns_used = gb_papu_data.patterns_used;
  
        change_current_custom_waveform(0);
        change_current_custom_noise(0);
        document.getElementById('tempo').value = parseInt(tempo);
        document.getElementById('patterns_in_song').value = patterns_used;
          
  }
