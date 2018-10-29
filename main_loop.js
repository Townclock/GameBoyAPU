var GameBoyClockSpeed = 4194304; //hertz up to 8.38 on GameBoy Color

var SoundUpdateDelay = 1; // changes in PAPU memory will be audibly expressed
                          // after one second

var elapsed_cycles = 0;

get_scheduling_time = function(){
  var time = context.currentTime + SoundUpdateDelay + (elapsed_cycles * 0.000004194304 );
 // console.log(context.currentTime/time);
  return time;
}



function check_apu_update(){    //the apu runs off the same clock unit of the main cpu
  for (var i = 0; i < GameBoyClockSpeed/1000; i++){

    var update_time = get_scheduling_time();

    elapsed_cycles++;
    gain_bit = linear_feedback_shift_register [0];
    

  pulse_1.update_frequency();
  pulse_1.update_waveform();
  pulse_1.update_volume();
  pulse_1.check_sweep();
  pulse_1.check_length();
  pulse_1.check_envelope();

  pulse_2.update_frequency();
  pulse_2.update_waveform();
  pulse_2.update_volume();
  pulse_2.check_length();
  pulse_2.check_envelope();


  noise_4.update_volume(update_time);
  noise_4.check_length();
  noise_4.check_envelope();
//noise test zone
  if (elapsed_cycles % (8 * noise_4.dividing_ratio * noise_4.shift_clock_frequency) == 0){
    noise_4.output_buffer.getChannelData(0)[noise_4.write_loc + 1] = linear_feedback_shift_register[0];
    noise_4.write_loc++;

    if (noise_4.write_loc >=  1048576) {noise_4.write_loc = 0;};
    }
    linear_feedback_shift_register.push(linear_feedback_shift_register[1] !==
    linear_feedback_shift_register.shift()? 1: 0);
    if (noise_4.lfsr_bit_width) {linear_feedback_shift_register[6] = linear_feedback_shift_register[14]}
  }
  // waveform test zone!
  for (var i = 0; i < 32; i++)
    wave_3.output_buffer.getChannelData(0)[i] = saw[i];
  wave_3.wave_player.playbackRate.value =
  calculate_play_back_rate_from_frequency(32*65536/(2048 - 100));
}



function read_ui_input()
{
  //assuming god like control over the CPU's registers...
  //writing a value to channel one's frequency would take several instructions
  pulse_1.frequency_memory = document.getElementById("channel_1_frequency").value;
  pulse_1.use_length = document.getElementById("channel_1_use_length").checked ? 1:0;
  //(strictly) writing a value to channel one's sweep register would take one instructions
  pulse_1.sweep_shift_number = document.getElementById("channel_1_sweep_shift_number").value;
  pulse_1.sweep_shift_time = document.getElementById("channel_1_sweep_shift_time").value;
  pulse_1.sweep_direction = document.getElementById("channel_1_sweep_direction").checked ? 1:0;
  // pulse width and sound length use the same register
  pulse_1.sound_length_counter = 64 - document.getElementById("channel_1_sound_length").value;
  pulse_1.pulse_width = document.getElementById("channel_1_pulse_width").value;
  // pulse 1 initial volume
  pulse_1.volume = Number(document.getElementById("channel_1_initial_volume").value);
  // envelope sweep
  pulse_1.envelope_direction = document.getElementById("channel_1_envelope_direction").checked ? 1:0
  pulse_1.envelope_number = document.getElementById("channel_1_envelope_number").value;
  
  //writing a value to channel one's frequency would take several instructions
  pulse_2.frequency_memory = document.getElementById("channel_2_frequency").value;
  pulse_2.use_length = document.getElementById("channel_2_use_length").checked ? 1:0;
  // pulse width and sound length use the same register
  pulse_2.sound_length_counter = 64 - document.getElementById("channel_2_sound_length").value;
  pulse_2.pulse_width = document.getElementById("channel_2_pulse_width").value;
  // pulse 2 initial volume
  pulse_2.volume = Number(document.getElementById("channel_2_initial_volume").value);
  // envelope sweep
  pulse_2.envelope_direction = document.getElementById("channel_2_envelope_direction").checked ? 1:0
  pulse_2.envelope_number = document.getElementById("channel_2_envelope_number").value;
  

  noise_4.volume = Number(document.getElementById("channel_4_initial_volume").value);
  noise_4.use_length = document.getElementById("channel_4_use_length").checked ? 1:0;
  noise_4.sound_length_counter = 64 - document.getElementById("channel_4_sound_length").value;
  noise_4.envelope_direction = document.getElementById("channel_4_envelope_direction").checked ? 1:0
  noise_4.envelope_number = document.getElementById("channel_4_envelope_number").value;

  noise_4.lfsr_bit_width = document.getElementById("channel_4_lfsr_bit_width").checked ? 1:0
  noise_4.dividing_ratio = Number(document.getElementById("channel_4_dividing_ratio").value);
  noise_4.shift_clock_frequency = Number(document.getElementById("channel_4_shift_clock_frequency").value);

  if (noise_4.dividing_ratio == 0) {noise_4.dividing_ratio = 0.5;}

  noise_4.noise_player.playbackRate.value = 11.8886167801 / noise_4.dividing_ratio /noise_4.shift_clock_frequency;
  // this is a frequency of 524288 1/8 of the main clock
  // we need to both read and write to the noise buffer at the same frequency

  console.log("read ui")
}



function update_ui(){
  document.getElementById("channel_1_computed_frequency").innerHTML = 131072 / (2048 -
  document.getElementById("channel_1_frequency").value) + 'hz';
}



var update_apu = setInterval(check_apu_update, 1);





console.log("Main_Loop Loaded");
