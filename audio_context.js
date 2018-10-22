
var context = new AudioContext();



//https://noisehack.com/generate-noise-web-audio-api/
//directly controlling output with script processing node. testing with noise, might be able to use with table waveforms


 //Noise Generation example

// I think I can use a small buffer that is updated on the fly to emulate the GB shift register

// A custom buffer might be able emulate the custom wave table for channel 3

/*
var bufferSize = 1;
var noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
var noise_output_bit = noiseBuffer.getChannelData(0);

  noise_output_bit[0] = 1;



var whiteNoise = context.createBufferSource();
whiteNoise.buffer=noiseBuffer;
whiteNoise.loop=true;
whiteNoise.start(0);

whiteNoise.connect(context.destination);
*/

