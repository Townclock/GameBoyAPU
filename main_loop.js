var GameBoyClockSpeed = 4194304; //hertz up to 8.38 on GameBoy Color

 var SoundUpdateDelay = 1; // changes in PAPU memory will be audibly expressed
                          // after one second

var elapsed_cycles = 0;

get_scheduling_time = function(){
  var time = context.currentTime + SoundUpdateDelay + (elapsed_cycles % (GameBoyClockSpeed/1000) * 0.000004194304 );
 // console.log(context.currentTime/time);
  return time;
}

var update_time = get_scheduling_time();

function check_apu_update(){    //the apu runs off the same clock unit of the main cpu
  for (var i = 0; i < GameBoyClockSpeed/1000; i++){
    elapsed_cycles++;
    
    update_time = get_scheduling_time();

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


    noise_4.update_volume();
    noise_4.check_length();
    noise_4.check_envelope();
    noise_4.check_frequency();

    wave_3.update_volume();
    wave_3.update_frequency();
    wave_3.check_length();
  }
    wave_3.update_waveform();


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
  

  wave_3.frequency = Number(document.getElementById("channel_3_frequency").value);
  wave_3.use_length = document.getElementById("channel_3_use_length").checked ? 1:0;
  wave_3.sound_length_counter = 256 - document.getElementById("channel_3_sound_length").value;

  wave_3.volume = Number(document.getElementById("channel_3_volume").value);



  noise_4.volume = Number(document.getElementById("channel_4_initial_volume").value);
  noise_4.use_length = document.getElementById("channel_4_use_length").checked ? 1:0;
  noise_4.sound_length_counter = 64 - document.getElementById("channel_4_sound_length").value;
  noise_4.envelope_direction = document.getElementById("channel_4_envelope_direction").checked ? 1:0
  noise_4.envelope_number = document.getElementById("channel_4_envelope_number").value;

  noise_4.lfsr_bit_width = document.getElementById("channel_4_lfsr_bit_width").checked ? 1:0
  noise_4.dividing_ratio = Number(document.getElementById("channel_4_dividing_ratio").value);
  noise_4.shift_clock_frequency = Number(document.getElementById("channel_4_shift_clock_frequency").value);

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
