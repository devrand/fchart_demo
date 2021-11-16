var blue = "#13dddf", orange = "#ff9000", green = "#4eff00", hoverOrange = "#ea6e00", dragOrange = "#c94d02";

// init canvas
var w = 800, h = 400;
var color, getColor2;

// globals
var n = w/2;

var cd1 = new Array(n); for (let i=0; i<n; ++i) cd1[i] = -1;
var cd2 = new Array(n); for (let i=0; i<n; ++i) cd2[i] = -1;
var chart_data = [cd1, cd2]

var ctx;

function init_canvas(){
  var plots = document.querySelectorAll(".plot")
  var plot1 = plots[0]
  var canvas = createElement("canvas", { width:w, height:h });
  plot1.appendChild(canvas);
  ctx = canvas.getContext("2d");
}


window.onload = function () {
  // Create a client instance
  clients_data.forEach( function(e, i){ 
    client = new Paho.Client(e.hostname, Number(e.port), e.client_id);

  // set callback handlers
    client.onConnectionLost = on_connection_lost(i);
    client.onMessageArrived = on_message_arrived(i);

  // connect the client
    console.log("attempting to connect, client " + i )
    client.connect(e.connect_params);
	clients.push(client)
  })

  // called when the client connects
  init_canvas()
  //add_datum(50)
  //draw();
}


/* ------- ---- - --  functions ------*/

function add_datum(datum, idx){
  let cd = chart_data[idx]
  if(datum > 49.5 && datum < 50.5){
    cd.shift()
    cd.push(datum)
  } else { // in case value out of the accepted interval, we repeat previous point
    cd.shift()
    let prev = cd.pop()
    cd.push(prev)
    cd.push(prev)
  }
  chart_data[idx] = cd
}


function draw(){
        ctx.clearRect(0,0,w,h);
		draw_x_axis();
		draw_plotline(orange, 0);
		draw_plotline(blue, 1);
}


function draw_x_axis(){
        // axis
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, 0.5*h + 0.5); ctx.lineTo(w, 0.5*h +0.5); ctx.stroke();
}


function draw_plotline(color, idx){
        // plot
		let shift_down = 50; // 50 px shift
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (var x = 0; x < w/2; x++) {
            var y = getY(x, idx);
            //if (x == 0)  ctx.moveTo(2*x,y);  // starting point
			if(y == -1)  ctx.moveTo(2*x, h/2); // lack of data
            else ctx.lineTo(2*x,y + shift_down*idx); 
        }
        ctx.stroke();

}


function getY(x, idx){
  let ymin = -0.06
  let ymax = 0.06
  let cd = chart_data[idx]
  if(cd[x] > 0){
    let y = 50 - cd[x]
	return (y - ymin)/(ymax - ymin) * h
  }else{
    return -1
  }
}

function createElement (tag, properties) {                                                                                                                    
    var el = document.createElement(tag);                                                                                                                     
    Object.getOwnPropertyNames(properties || {}).forEach(function (k) {
        if (k === "html") { el.innerHTML = properties[k]; }                                                                                                   
        else { el.setAttribute(k, properties[k]); }
    });                                                                                                                                                       
    return el;                                                                                                                                                
}   

function unix2date(seconds){
  let date = new Date(seconds * 1000);  // in millisec
  return date.toLocaleString() 
}

function update2(seconds){
  var date = unix2date(seconds)
  var div = document.getElementById("d1");
  div.innerText = date
}

