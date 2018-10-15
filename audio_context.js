
var context = new AudioContext();

var pulse = context.createOscillator();
var channel_1_gain_node = context.createGain();
pulse.connect(channel_1_gain_node);
channel_1_gain_node.connect(context.destination);
pulse.type = 'square';

pulse.connect(context.destination);

pulse.frequency.value = 1000;

pulse.start();

//https://noisehack.com/generate-noise-web-audio-api/
//directly controlling output with script processing node. testing with noise, might be able to use with table waveforms


/* Noise Generation example

// I think I can use a small buffer that is updated on the fly to emulate the GB shift register

// A custom buffer might be able emulate the custom wave table for channel 3

var bufferSize = 2 * context.sampleRate;
var noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
var output = noiseBuffer.getChannelData(0);

for (var i = 0; i < bufferSize;i++) {
  output[i] = Math.random()*2-1
}

var whiteNoise = context.createBufferSource();
whiteNoise.buffer=noiseBuffer;
whiteNoise.loop=true;
whiteNoise.start(0);

whiteNoise.connect(context.destination);


*/
