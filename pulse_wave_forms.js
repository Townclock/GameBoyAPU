//need to have the different possible waves on hand for pulse
//may have to generate waves on the fly for the 32 bit waveform osc
//http://www.dspguide.com/ch13/4.htm
// 0.25, (2/PI)sin(PI/4), (1/PI)1, (2/3PI)sin(.75 PI)  //short fourier transform for 25% pulse cycle
var real = new Float32Array([0.25, 0.45015815807, 0.31830988618, 0.15005271936, 0, -0.090031162161, -0.10610439539, -0.06430830829, 0, 0.05001757311, 0.06366197723]);
var imag = new Float32Array(real.length);
var twenty_five_cycle = context.createPeriodicWave(real, imag)

//sequence for 12.5% pulse cycle
real = new Float32Array([0.125, 0.2436238396, 0.335079079, 0.1960533259, 0.1591549431, 0.1176319955, 0.0750263597, 0.0348034057, 0, -0.0270693155, -0.0450158158]);
imag = new Float32Array(real.length);
var twelve_point_five_cycle = context.createPeriodicWave(real, imag)

//sequence for 50% pulse cycle  (comparing this to the default square wave to check if this method of waveform genertion is accurate)
real = new Float32Array([
0.5,0.6366197724,0,-0.2122065908,0,0.1273239545,0,-0.0909456818,0,0.0707355303,0,-0.0578745248,0,0.0489707517, 0, -0.0424413182, 0, 0.0374482219, 0, -0.0335063038, 0]);
imag = new Float32Array(real.length);
var fifty_cycle = context.createPeriodicWave(real, imag)


waveforms = [
  twelve_point_five_cycle,
  twenty_five_cycle, 
  fifty_cycle,
  twenty_five_cycle//75% cycle,is audibly equivalent
];


//need a way to test if the output waveforms are accurate.
