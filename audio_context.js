
var context = new AudioContext();

var pulse = context.createOscillator();
var channel_1_gain_node = context.createGain();
pulse.connect(channel_1_gain_node);
channel_1_gain_node.connect(context.destination);
pulse.type = 'square';

pulse.connect(context.destination);

pulse.frequency.value = 1000;

pulse.start();




//need a way to test if the output waveforms are accurate.
