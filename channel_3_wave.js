var saw = [-1, -0.875, -0.75, -0.625, -0.5, -0.375, -0.25, -12.5, 0, 
        0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 
        -1, -0.875, -0.75, -0.625, -0.5, -0.375, -0.25, -12.5, 0, 
        0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];

var square = [-1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875, 0.875];

var triangle = [-1, -1, -0.75, -0.75, -0.5, -0.5, -0.25,-0.25, 0, 0, 0.25, 0.25, 0.5,0.5, 0.75, 0.75,
                0.75, 0.75, 0.5,0.5, 0.25, 0.25, 0, 0, -0.25,-0.25, -0.5, -0.5, -0.75, -0.75, -1, -1 ];

var calculate_play_back_rate_from_frequency = function(frequency){
  var base = 44100;
  var rate = frequency/base;
  return rate;
}

//  so I need a 32 wide, nib tall buffer that is entirely passed through at any given frequency
//  x = 11 bits Frequ = 4194304 / (62*(2048 - x))  || 65536/(2048-x)
// it's got to play through the whole table at that frequency??? or is the frequency 1 step

wave_3 = {
  on_off:1,

  output_buffer : context.createBuffer(1, 32, context.sampleRate),

  wave_player : context.createBufferSource(),

  gain : context.createGain(),

  volume: 0, // 0, 25, 50, 100%

  use_length : 0,
  sound_length_counter : 0, // 0-255

  frequency: 2047, // 11 bit higher is higher frequency

}
  wave_3.wave_player.buffer = wave_3.output_buffer;
  wave_3.wave_player.loop = true;
  wave_3.wave_player.connect(wave_3.gain);
  wave_3.gain.connect(context.destination);

  wave_3.wave_player.playbackRate.value = 1; // this will need to be modified by frequency 
                                              // in an update-frequency function
                                              // defaults at 44100

  wave_3.wave_player.start(0);


wave_3.update_volume = function() {  // update the volume of this channel
  if (this.volume == 0)
    this.gain.gain.value = 0;
  if (this.volume == 1)
    this.gain.gain.value = 0.25;
  if (this.volume == 2)
    this.gain.gain.value = 0.5;
  if (this.volume == 3)
    this.gain.gain.value = 1;
}
wave_3.update_frequency = function(){
  this.wave_player.playbackRate.value =
  calculate_play_back_rate_from_frequency(32*65536/(2048 -this.frequency))//- this.frequency));
  //console.log(this.wave_player.playbackRate.value)
  }

//WORKS DIFFERENTLY THAN THE OTHER 3 CHANNELS!!!!!
wave_3.check_length = function(){
    // decrement time for sound length
    //http://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware#Length_Counter
    if (elapsed_cycles % (GameBoyClockSpeed/256) == 0 && this.use_length){
          // again not going to be accurate to the fractional millesecond
      this.sound_length_counter--;
      if (this.sound_length_counter < 0) {this.sound_length_counter = 0;}
      if (this.sound_length_counter == 0){this.volume = 0;}
    }
}




console.log("Wave Three Loaded");
