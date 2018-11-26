/* key
frequency: note octave Bn1 Cn4 D#2. . .
volume: 0-f
envelope_direction: 0-1 (down/up)
envelope: 0-f
use_length: 0 - 1
length: 01 - 64
pulse_length: 0 - 3
sweep_direction: 0 - 1
sweep_shift_numner: 0 - 8
sweep_speed: 0 - 8
*/
var interpret_channel_1 = function(){
    pulse_1_input = patterns[1][current_patterns[1]][current_step]
    if (pulse_1_input == "-") return;

    console.log(pulse_1_input.substring(0, 3));
    console.log(square_wave_note_to_memory_value[pulse_1_input.substring(0, 3)]);
    pulse_1.frequency_memory = square_wave_note_to_memory_value[pulse_1_input.substring(0, 3)];
    pulse_1.volume = parseInt(pulse_1_input[3], 16);
    pulse_1.envelope_direction = parseInt(pulse_1_input[4], 2);
    pulse_1.envelope_number = parseInt(pulse_1_input[5], 16);
    pulse_1.use_length = parseInt(pulse_1_input[6], 2);
    pulse_1.sound_length_counter = parseInt(Number(pulse_1_input[7] + "" + pulse_1_input[8], 64) + 1);
    pulse_1.pulse_width = parseInt(pulse_1_input[9], 4);


    pulse_1.sweep_direction = parseInt(pulse_1_input[10], 2);
    pulse_1.sweep_shift_number = parseInt(pulse_1_input[11], 8);
    pulse_1.sweep_shift_time = parseInt(pulse_1_input[12], 8);

}
/* key
frequency: note octave Bn1 Cn4 D#2. . .
volume: 0-f
envelope_direction: 0-1 (down/up)
envelope: 0-f
use_length: 0 - 1
length: 01 - 64
pulse_length: 0 - 3
*/
var interpret_channel_2 = function(){
    pulse_2_input = patterns[2][current_patterns[2]][current_step]

    if (pulse_2_input == "-") return;

    pulse_2.frequency_memory = square_wave_note_to_memory_value[pulse_2_input.substring(0, 3)];
    pulse_2.volume = parseInt(pulse_2_input[3], 16);
    pulse_2.envelope_direction = parseInt(pulse_2_input[4], 2);
    pulse_2.envelope_number = parseInt(pulse_2_input[5], 16);
    pulse_2.use_length = parseInt(pulse_2_input[6], 2);
    pulse_2.sound_length_counter = parseInt(Number(pulse_2_input[7] + "" + pulse_2_input[8], 64) + 1);
    pulse_2.pulse_width = parseInt(pulse_2_input[9], 4);

}

/* key
frequency: note octave Cn1 Cn4 D#2. . .
volume: 0-3
use_length: 0 - 1
length: 01 - 256
shape: 0-f  (0-2 built in currently)
*/
var interpret_channel_3 = function(){
    wave_3_input = patterns[3][current_patterns[3]][current_step]
    if (wave_3_input == "-") return;

    console.log(wave_3_input);

    wave_3.frequency = custom_wave_note_to_memory_value[wave_3_input.substring(0, 3)];
    wave_3.volume = parseInt(wave_3_input[3], 4);
    wave_3.use_length = parseInt(wave_3_input[4], 2);
    wave_3.sound_length_counter = parseInt(Number(wave_3_input[5] + "" + wave_3_input[6] + wave_3_input[7], 256) + 1);
    wave_3.current_waveform = parseInt(wave_3_input[8], 16);

}



/* key 
volume: 0-f
envelope_direction: 0-1 (down/up)
envelope: 0-f
use_length: 0 - 1
length: 01 - 64
noise_preset: 0-f
*/
var interpret_channel_4 = function(){
    noise_input = patterns[4][current_patterns[4]][current_step]
    if (noise_input == "-") return;




  noise_4.volume = parseInt(noise_input[0], 16);
  console.log(noise_4.volume);
  noise_4.envelope_direction = parseInt(noise_input[1], 2);
  noise_4.envelope_number = parseInt(noise_input[2], 16);
  noise_4.use_length = parseInt(noise_input[3], 2);
  noise_4.sound_length_counter = parseInt(Number(noise_input[4] + "" + noise_input[5])+1);

          var noise = custom_noises[noise_input[6]];
          noise_4.lfsr_bit_width = parseInt(noise[2], 2);
          noise_4.dividing_ratio = parseInt(noise[1], 8)
          noise_4.shift_clock_frequency = parseInt(noise[0], 16);
          if (noise_4.dividing_ratio == 0) {noise_4.dividing_ratio = 0.5;}

  noise_4.noise_player.playbackRate.value = 11.8886167801 / noise_4.dividing_ratio /
    Math.pow(2, noise_4.shift_clock_frequency);


    }
