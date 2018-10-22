//UNUSED
var CommandLength = 8; //bit
var GameBoyMemoryRAM = 8; //kb up to 32kb on GameBoy Color 
var GameBoyI0Registers = 128 // addressed $FF00 to $FF7F in memory



//USED
var GameBoyClockSpeed = 4194304; //hertz up to 8.38 on GameBoy Color

var elapsed_cycles = 0;










function check_apu_update(){    //the apu runs off the same clock unit of the main cpu
  for (var i = 0; i < GameBoyClockSpeed/1000; i++){
    elapsed_cycles++;
    noise_output_bit[0] = linear_feedback_shift_register [0];
    

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

  }

  //placehoder statement to test noise shift register
  //if (elapsed_cycles % ((GameBoyClockSpeed/(65536*16))) == 0 )
   // {noise_output_bit[0] = !noise_output_bit[0];}
   // linear_feedback_shift_register.push(linear_feedback_shift_register[1] !== linear_feedback_shift_register.shift());
  //}
  
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
  
  //assuming god like control over the CPU's registers...
  //writing a value to channel one's frequency would take several instructions
  pulse_2.frequency_memory = document.getElementById("channel_2_frequency").value;
  pulse_2.use_length = document.getElementById("channel_2_use_length").checked ? 1:0;
  // pulse width and sound length use the same register
  pulse_2.sound_length_counter = 64 - document.getElementById("channel_2_sound_length").value;
  pulse_2.pulse_width = document.getElementById("channel_2_pulse_width").value;
  // pulse 1 initial volume
  pulse_2.volume = Number(document.getElementById("channel_2_initial_volume").value);
  // envelope sweep
  pulse_2.envelope_direction = document.getElementById("channel_2_envelope_direction").checked ? 1:0
  pulse_2.envelope_number = document.getElementById("channel_2_envelope_number").value;
  
  console.log("read ui")
}



function update_ui(){
  document.getElementById("channel_1_computed_frequency").innerHTML = 131072 / (2048 -
  document.getElementById("channel_1_frequency").value) + 'hz';
}



var update_apu = setInterval(check_apu_update, 1);





console.log("Main_Loop Loaded");
