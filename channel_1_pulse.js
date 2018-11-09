var pulse_1 = {
  osc : context.createOscillator(),
  gain : context.createGain(),
  frequency_memory : 0, // 8 bits located FF13 - NR13 plus 3 bits (2, 1, 0[high bits]) in FF14 - NR14
  previous_frequency : 0, // a placeholder for frequency, so frequency doesn't update outside the gb clock cycle
  sweep_shift_number : 7, // 3 bit number determines speed of magnitude of each sweep shift  bits 2-0 of FF10 - NR10
  sweep_shift_time : 0, // 3 bit number detmines the rate of each sweep shift  bits 6-4 of regist FF10 - NR10
  sweep_direction : 0, // 1 = increase, 0 decreases //bit 3 of FF10 -
// FF11 - NR11 Sound Length and Wave pattern register (Read/Write)
//bits 7-6 Wave Pattern
  pulse_width : 0,//2 bit  00 12.5% uptime, 01 25% up time 10 50% uptime 11 75% uptime
//"Each length counter is clocked at 256 Hz by the frame sequencer. When clocked while enabled by NRx4 and the counter is not zero, it is decremented. If it becomes zero, the channel is disabled."
//bits 5-0 Sound length (used only if bit 6 in NR 1 is 1)
  sound_length_counter : 0,//5 bit 0-31  calculation for length is (64-t)/256 seconds (~4*(64-6)ms)
  use_length : 0, // bit 6 in NR14
  volume : 0, // bits 7-4 of FF12 - NR 12
  previous_volume: 1,
  envelope_direction : 0, // bit 3 FF12 - NR12 0:decrease volume 1: increase
  envelope_number : 0, // bits 2-0 (volume time steps = n/64)
}

// Set up the Audio API componenets of the Pulse Channel
pulse_1.osc.connect(pulse_1.gain);
pulse_1.gain.connect(context.destination);
pulse_1.osc.setPeriodicWave(waveforms_1[2]); //setting oscillator to square wave, do not know if this is the default start state
pulse_1.osc.frequency.value = 0;
pulse_1.osc.start();

pulse_1.gain.gain.value = 0;

// Pulse Channel Functions

pulse_1.update_frequency = function(){ // update the frequency being played by this pulse channel
  //clamp the input into the register so we play only valid frequencies
  if (this.frequency_memory > 2047) this.frequency_memory = 2047;
  if (this.frequency_memory < 0) this.frequency_memory = 0;
  if (this.previous_frequency !== this.frequency_memory)
  {
    this.previous_frequency = this.frequency_memory;
    this.osc.frequency.setValueAtTime( 131072 / (2048 - this.frequency_memory), update_time);
    // js  does not support the maximum frquency that a GameBoy can be set at.
    console.log(get_scheduling_time());
  }
}

pulse_1.update_waveform = function(){  // update the waveform being used for this pulse channel
  this.osc.setPeriodicWave(waveforms_1[this.pulse_width]);
}

pulse_1.update_volume = function() {  // update the volume of this channel
    if (this.volume !== this.previous_volume){
      this.previous_volume = this.volume;
    this.gain.gain.setValueAtTime( this.volume/15, update_time)
  }
}

pulse_1.check_sweep = function(){
  if ( (elapsed_cycles % (this.sweep_shift_time*(GameBoyClockSpeed/128))) == 0 && this.sweep_shift_time != 0){
  // not going to be accurate to the fractional millesecond
    var old_frequency = Number(this.frequency_memory);
    console.log(this.frequency_memory);
    if (this.sweep_direction) {
      this.frequency_memory = old_frequency - (old_frequency / Math.pow(2, this.sweep_shift_number));
    }
    else {
      this.frequency_memory = old_frequency + (old_frequency / Math.pow(2, this.sweep_shift_number));
    }

  }
}

pulse_1.check_length = function(){
    // decrement time for sound length
    //http://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware#Length_Counter
    if (elapsed_cycles % (GameBoyClockSpeed/256) == 0 && this.use_length){
          // again not going to be accurate to the fractional millesecond
      this.sound_length_counter--;
      console.log(this.sound_length_counter)
      if (this.sound_length_counter < 0) {this.sound_length_counter = 0;}
      if (this.sound_length_counter == 0){this.volume = 0;}
    }
}


pulse_1.check_envelope = function(){
    //volume envelope
    if (elapsed_cycles % (this.envelope_number*(GameBoyClockSpeed/64)) == 0 && this.envelope_number != 0 && (this.sound_length_counter != 0 || ! this.use_length)) {
      if (this.envelope_direction == 0) {this.volume-=1;}
      else {this.volume += 1;}
      if (this.volume < 0) this.volume = 0;
      if (this.volume > 15) this.volume = 15;

    console.log(this.volume)
    }
}

console.log("Pulse_One Loaded");
