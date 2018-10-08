
var context = new AudioContext();

var pulse = context.createOscillator();
var channel_1_gain_node = context.createGain();
pulse.connect(channel_1_gain_node);
channel_1_gain_node.connect(context.destination);
pulse.type = 'square';

pulse.connect(context.destination);

pulse.frequency.value = 1000;

pulse.start();






//need to have the different possible waves on hand for pulse
//may have to generate waves on the fly for the 32 bit waveform osc
//http://www.dspguide.com/ch13/4.htm
// 0.25, (2/PI)sin(PI/4), (1/PI)1, (2/3PI)sin(.75 PI)  //short fourier transform for 25% pulse cycle
var real25 = new Float32Array([0.25, 0.45015815807, 0.31830988618, 0.15005271936, 0, -0.090031162161, -0.10610439539, -0.06430830829, 0, 0.05001757311, 0.06366197723]);
var imag25 = new Float32Array(real25.length);
var twenty_five_cycle = context.createPeriodicWave(real25, imag25)

real125 = new Float32Array([0.125, 0.2436238396, 0.335079079, 0.1960533259, 0.1591549431, 0.1176319955, 0.0750263597, 0.0348034057, 0, -0.0270693155, -0.0450158158]);
imag125 = new Float32Array(real125.length);
var twelve_point_five_cycle = context.createPeriodicWave(real125, imag125)



var wave_forms = [
  twelve_point_five_cycle, 
  twenty_five_cycle, 
  null, 
  twenty_five_cycle//75% cycle,is audiobly equivalent
];


//need a way to test if the output waveforms are accurate.
