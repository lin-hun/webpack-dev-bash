require('./index.scss')
window.onload = ()=>{
  // set canvas
  let canvas = document.getElementById('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  let ctx = canvas.getContext('2d')
  //
  ctx.beginPath();
  ctx.fillOpacity = .8
  ctx.arc(100,100 , 100, 0, 2 * Math.PI, false);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 1;
  ctx.stroke();
}