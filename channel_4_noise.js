// 1048576 Hz is the highest frequency of noise  1.048576 MHz 1/4 of the main clock speed
//   44100 Hz is the standard playback speed
//
// if we are going to sample every step of noise we need playback rate of 23.7772335601 for the noise buffer

//  we are going to need n(n=SoundUpdateDelay*1000) buffers, ~1000 values for each ms of noise,  (or 1~mil bit buffer)
//  to precalculate our noise and then play it with a delay

noise_4 = {

  output_buffer : context.createBuffer(1, 1048576, context.sampleRate),

  noise_player : context.createBufferSource(),

  gain : context.createGain(),

  volume: 15,
  use_length : 0,
  sound_length_counter : 0,

  envelope_direction : 0, // bit 3 FF12 - NR12 0:decrease volume 1: increase
  envelope_number : 0, // bits 2-0 (volume time steps = n/64)

  lfsr_bit_width:0,
  dividing_ratio:0.5,
  shift_clock_frequency:1,


  write_loc : 1

}
  noise_4.noise_player.buffer = noise_4.output_buffer;
  noise_4.noise_player.loop = true;
  noise_4.noise_player.connect(noise_4.gain);
  noise_4.gain.connect(context.destination);

  noise_4.noise_player.playbackRate.value = 23.7772335601;

  noise_4.noise_player.start(0);

//envelope direction and number initial volume

// shift clock frequency, counter step width, dividing ratio of frequencies

var linear_feedback_shift_register = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];

noise_4.update_volume = function(update_time) {  // update the volume of this channel
  this.gain.gain.value = this.volume/15;

//  this.gain.gain.setValueAtTime(gain_bit, update_time);

}
noise_4.check_length = function(){
    // decrement time for sound length
    //http://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware#Length_Counter
    if (elapsed_cycles % (GameBoyClockSpeed/256) == 0 && this.use_length){
          // again not going to be accurate to the fractional millesecond
      this.sound_length_counter--;
      if (this.sound_length_counter < 0) {this.sound_length_counter = 0;}
      if (this.sound_length_counter == 0){this.volume = 0;}
    }
}

noise_4.check_envelope = function(){
    //volume envelope
    if (elapsed_cycles % (this.envelope_number*(GameBoyClockSpeed/64)) == 0 && this.envelope_number != 0 && (this.sound_length_counter != 0 || ! this.use_length)) {
      if (this.envelope_direction == 0) {this.volume-=1;}
      else {this.volume += 1;}
      if (this.volume < 0) this.volume = 0;
      if (this.volume > 15) this.volume = 15;

    console.log(this.volume)
    }
}

console.log("Noise_Four Loaded");
