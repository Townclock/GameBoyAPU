noise_4 = {

  output_buffer : context.createBuffer(1, 1, context.sampleRate),

  noise_player : context.createBufferSource(),

  gain : context.createGain(),

  volume: 15,
  use_length : 0,
  sound_length_counter : 0,

}
  noise_4.noise_output_bit = noise_4.output_buffer.getChannelData(0);
  noise_4.noise_output_bit[0] = 0;
  noise_4.noise_player.buffer = noise_4.output_buffer;
  noise_4.noise_player.loop = true;
  noise_4.noise_player.connect(noise_4.gain);
  noise_4.gain.connect(context.destination);


  noise_4.noise_player.start(0);

//envelope direction and number initial volume

// shift clock frequency, counter step width, dividing ratio of frequencies

var linear_feedback_shift_register = [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];


noise_4.update_volume = function() {  // update the volume of this channel
  this.gain.gain.value = this.volume/15;
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

console.log("Noise_Four Loaded");
