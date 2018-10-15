// https://mgba.io/2017/04/30/emulation-accuracy/
// http://www.codeslinger.co.uk/pages/projects/gameboy/beginning.html
// http://web.archive.org/web/20080226170411/http://nocash.emubase.de:80/pandocs.htm#soundcontroller
// https://codepen.io/gregh/post/recreating-legendary-8-bit-games-music-with-web-audio-api
var CommandLength = 8; //bits

var GameBoyMemoryRAM = 8; //kb up to 32kb on GameBoy Color 
var GameBoyClockSpeed = 4194304; //hertz up to 8.38 on GameBoy Color

var GameBoyI0Registers = 128 // addressed $FF00 to $FF7F in memory

// previous frequency: I think I updated the frequeny too quickly might ead to some distortion, this variable is to only change the output frequency when it should (totally disconnect from the emulation of the APU)
var previous_frequency = 0


var elapsed_cycles = 0;

var channel_1_frequency_memory = 0 // 8 bits located FF13 - NR13 plus 3 bits (2, 1, 0[high bits]) in FF14 - NR14
var channel_1_sweep_shift_number = 7 // 3 bit number determines speed of magnitude of each sweep shift  bits 2-0 of FF10 - NR10
var channel_1_sweep_shift_time = 0 // 3 bit number detmines the rate of each sweep shift  bits 6-4 of regist FF10 - NR10
var channel_1_sweep_direction = 0 // 1 = increase, 0 decreases //bit 3 of FF10 - 


// FF11 - NR11 Sound Length and Wave pattern register (Read/Write)
//bits 7-6 Wave Pattern
var channel_1_pulse_width = 0//2 bit  00 12.5% up time, 01 25% up time 10 50% up time 11 75% up time


//http://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware#Length_Counter
//"Each length counter is clocked at 256 Hz by the frame sequencer. When clocked while enabled by NRx4 and the counter is not zero, it is decremented. If it becomes zero, the channel is disabled."
//bits 5-0 Sound length (used only if bit 6 in NR 1 is 1)
var channel_1_sound_length_counter = 0;//5 bit 0-31  calculation for length is (64-t)/256 seconds (~4*(64-6)ms)
var channel_1_use_length = 0 ; // bit 6 in NR14

var channel_1_volume = 0; // bits 7-4 of FF12 - NR 12 

var channel_1_envelope_direction = 0; // bit 3 FF12 - NR12 0:decrease volume 1: increase

var channel_1_envelope_number = 0 // bits 2-0 (volume time steps = n/64)




function check_apu_update(){    //the apu runs off the same clock unit of the main cpu
  for (var i = 0; i < GameBoyClockSpeed/1000; i++){
    elapsed_cycles++;
    if (channel_1_frequency_memory > 2047) channel_1_frequency_memory = 2047;
    if (channel_1_frequency_memory < 0) channel_1_frequency_memory = 0;
    if (channel_1_pulse_width == 3) {pulse.type = 'square';} // currently using this as a test against a scratch generated square wave (waveform[2])
    else{pulse.setPeriodicWave(waveforms[channel_1_pulse_width])}
    
    channel_1_gain_node.gain.value = (channel_1_volume -6) /6;

    if (previous_frequency !== channel_1_frequency_memory)
    {
    previous_frequency = channel_1_frequency_memory;
      pulse.frequency.value = 131072 / (2048 - channel_1_frequency_memory); // js  does not support the maximum frquency that a GameBoy can be set at.
    }
    if ( (elapsed_cycles % (channel_1_sweep_shift_time*(GameBoyClockSpeed/128))) == 0 && channel_1_sweep_shift_time != 0){ // not going to be accurate to the fractional millesecond
      var old_frequency = Number(channel_1_frequency_memory);
      
      if (channel_1_sweep_direction) {
        channel_1_frequency_memory = old_frequency - (old_frequency / Math.pow(2, channel_1_sweep_shift_number));
      }
      else {
        channel_1_frequency_memory = old_frequency + (old_frequency / Math.pow(2, channel_1_sweep_shift_number));
      }
    }
    // decrement time for sound length  
    //http://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware#Length_Counter
    if (elapsed_cycles % (GameBoyClockSpeed/256) == 0 && channel_1_use_length){ 
          // again not going to be accurate to the fractional millesecond
      channel_1_sound_length_counter--;
      if (channel_1_sound_length_counter < 0) channel_1_sound_length_counter = 0;
      if (channel_1_sound_length_counter == 0){channel_1_volume = 0;}
    }
    //volume envelope

    if (elapsed_cycles % (channel_1_envelope_number*(GameBoyClockSpeed/64)) == 0 && channel_1_envelope_number != 0 && (channel_1_sound_length_counter != 0 || ! channel_1_use_length)) {
      if (channel_1_envelope_direction == 0) {channel_1_volume-=1;}
      else {channel_1_volume += 1;}
      if (channel_1_volume < 0) channel_1_volume = 0;
      if (channel_1_volume > 15) channel_1_volume = 15; 

    console.log(channel_1_volume)
    }
  }
 // console.log(elapsed_cycles);
}



function read_ui_input()
{
  //assuming god like control over the CPU's registers...
  
  //writing a value to channel one's frequency would take several instructions
  channel_1_frequency_memory = document.getElementById("channel_1_frequency").value;
  channel_1_use_length = document.getElementById("channel_1_use_length").checked ? 1:0;
  
  //(strictly) writing a value to channel one's sweep register would take one instructions
  channel_1_sweep_shift_number = document.getElementById("channel_1_sweep_shift_number").value;
  
  channel_1_sweep_shift_time = document.getElementById("channel_1_sweep_shift_time").value;
  
  channel_1_sweep_direction = document.getElementById("channel_1_sweep_direction").checked ? 1:0;
    
  // pulse width and sound length use the same register
  channel_1_sound_length_counter = 64 - document.getElementById("channel_1_sound_length").value;
  channel_1_pulse_width = document.getElementById("channel_1_pulse_width").value;
  
  // pulse 1 initial volume
  channel_1_volume = Number(document.getElementById("channel_1_initial_volume").value);
  
  // envelope sweep
  channel_1_envelope_direction = document.getElementById("channel_1_envelope_direction").checked ? 1:0

  channel_1_envelope_number = document.getElementById("channel_1_envelope_number").value;
  
  console.log("read ui")
}



function update_ui(){
  document.getElementById("channel_1_computed_frequency").innerHTML = 131072 / (2048 -
  document.getElementById("channel_1_frequency").value) + 'hz';
}



var update_apu = setInterval(check_apu_update, 1);





console.log("js loaded");
