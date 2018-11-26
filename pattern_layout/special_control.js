
    function convert_to_nibbles(wave){
        var nibble_form = []
        wave.forEach(function(val){nibble_form.push(((val+1) * 8).toString(16))})
        return nibble_form;
    }
    function convert_from_nibbles(wave){
        var absolute_form = []
        wave.forEach(function(val){absolute_form.push((parseInt(val, 16)/8)-1)})
        return absolute_form;
    }

    function draw_waveform(){
        var canvas_context = document.getElementById("custom_wave_visualizer").getContext("2d");
        canvas_context.clearRect(0, 0, 320, 240);
        custom_waveforms[current_custom_waveform]
        for (var i = 0; i < 32; i++){
        canvas_context.fillRect(i*10, 232-((custom_waveforms[current_custom_waveform][i]+1)*240)/2, 10, 240)
        }        
        canvas_context.stroke();
    }

    function change_current_custom_waveform(new_id){
        document.getElementById("custom_waveform").value;
        current_custom_waveform = parseInt(new_id, 16); 
        document.getElementById("custom_waveform_controller").value = 
            convert_to_nibbles(custom_waveforms[current_custom_waveform]).join("");
        draw_waveform();
    }

    function update_custom_waveform(new_form){
        custom_waveforms[current_custom_waveform] = convert_from_nibbles(new_form.split(""));
        draw_waveform();
    }
    function play_custom_c(octave){
        wave_3.frequency = custom_wave_note_to_memory_value["Cn" + octave];
        wave_3.current_waveform =current_custom_waveform;
        wave_3.volume = 2;
    }

    var saw = [
        -1,     -1,  -0.875,    -0.875, -0.75, -0.75,  -0.625,     -0.625,
        -0.5,     -0.5,     -0.375,     -0.375,     -0.25,     -0.25,     -0.125,    -0.125,
        0,     0,     0.125,     0.125,     0.25,     0.25,     0.375,     0.375, 
        0.5,     0.5,     0.625,     0.625,     0.75,     0.75,     0.875,     0.875 
    ]
    var square = [-1, -1, -1, -1, -1, -1, -1, -1,
                  -1, -1, -1, -1, -1, -1, -1, -1,
                  0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 
                  0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875];

    var triangle = [-1, -1, -0.75, -0.75, -0.5, -0.5, -0.25,-0.25, 
                    0, 0, 0.25, 0.25, 0.5,0.5, 0.75, 0.75,
                    0.75, 0.75, 0.5, 0.5, 0.25, 0.25, 0, 0,
                    -0.25,-0.25, -0.5, -0.5, -0.75, -0.75, -1, -1 ];

    
    var custom_waveforms = [saw, triangle, square, [], [], [], [], [],
                            [], [], [], [], [], [], [], []];
    change_current_custom_waveform(0);
    
    function change_current_custom_noise(new_id){
        document.getElementById("custom_noise").value;
        current_custom_noise = parseInt(new_id, 16); 
        document.getElementById("custom_noise_controller").value = 
            custom_noises[current_custom_noise];
    }

    function update_custom_noise(new_form){
        custom_noises[current_custom_noise] = new_form;
    }
    function play_custom_noise(){
          var noise = custom_noises[current_custom_noise];

          noise_4.envelope_number = 0;
          noise_4.use_length = 0;
          
            noise_4.lfsr_bit_width = parseInt(noise[2], 2);
          noise_4.dividing_ratio = parseInt(noise[1], 8)  
          noise_4.shift_clock_frequency = parseInt(noise[0], 16); 
          if (noise_4.dividing_ratio == 0) {noise_4.dividing_ratio = 0.5;}

        noise_4.volume = 4;
    }
    var custom_noises = ["000", "000", "000", "000", "000", "000", "000", "000"] ;
    change_current_custom_noise(0);
    
    for (var i = 3; i < 16; i++){
        while (custom_waveforms[i].length < 32) {custom_waveforms[i].push(0)};
    }
    // create selection menu for custom waveforms
    var custom_wave_options = ['0', '1', '2', '3', '4', '5', '6', '7', 
                               '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    var custom_waveform_options_html = ""
    for (var i = 0; i < 16; i++){
        custom_waveform_options_html += "<option value='" + custom_wave_options[i] + "'>" + custom_wave_options[i] + "</option>";
    }
    document.getElementById("custom_waveform").innerHTML = custom_waveform_options_html
    document.getElementById("custom_noise").innerHTML = custom_waveform_options_html
