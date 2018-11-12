var interpret_channel_1 = function(){}
var interpret_channel_2 = function(){}
var interpret_channel_3 = function(){}



/* key 
volume: 0-f
envelope_direction: 0-1 (down/up)
envelope: 0-f
use_length: 0 - 1
length: 01 - 64
noise_preset: 00-63
small_shit_register: 0-1

*/
var interpret_channel_4 = function(){
    noise_input = document.getElementById("ch4_"+current_step).value;
    
    if (noise_input == "-") return;

  noise_4.volume = parseInt(noise_input[0], 16);
  console.log(noise_4.volume);
  noise_4.envelope_direction = parseInt(noise_input[1], 2);
  noise_4.envelope_number = parseInt(noise_input[2], 16);
  noise_4.sound_length_counter = Number(noise_input[3] + "" + noise_input[4]);
  noise_4.use_length = parseInt(noise_input[5], 2);
  noise_4.lfsr_bit_width = parseInt(noise_input[6], 2);
  noise_4.dividing_ratio = Number(0);                               // special set-up
  noise_4.shift_clock_frequency = Number(4);                        // special set-up
  if (noise_4.dividing_ratio == 0) {noise_4.dividing_ratio = 0.5;}

  noise_4.noise_player.playbackRate.value = 11.8886167801 / noise_4.dividing_ratio /
    Math.pow(2, noise_4.shift_clock_frequency);


    }
