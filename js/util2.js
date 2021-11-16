var clients_data = [ { hostname: "193.161.15.26", port: 9002, client_id: random_client_id(),  
						connect_params: {onSuccess:on_connect(0), useSSL: false, userName:"js_client", password:"behaveYourselfOnConnect"} },
					 { hostname: "62.80.177.106", port: 9002, client_id: random_client_id(),  
					    connect_params: {onSuccess:on_connect(1), useSSL: false, userName:"js_client", password:"behaveYourselfOnConnect" }} ]
var clients = []  // 62.80.177.106

function random_client_id(){
  return Math.random().toString(16).slice(2)
}

var topic_name = "FQ";
var publish_cnt = 0;

// called when the client loses its connection
function on_connection_lost(client_id){
  return function (responseObject) {
    client = clients[client_id]
    client.is_connected = 0;
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost: "+responseObject.errorMessage + "client #" + client_id);
    }
  }
}
// called when a message arrives
function on_message_arrived(client_index){
  return function (message) {
    // console.log("onMessageArrived: "+message.payloadString);
    let message_payload = message.payloadString;
    let freq = message_payload.split(",")[1]  // get message from MQTT broker, obtain data value
    update2( message_payload.split(",")[0] )  // update a date (here "date2")
    add_datum(+freq, client_index)
	if( client_index == 1){ 
      draw()
	}  
  }
}

function on_connect(client_index){
  return function () {
    client = clients[client_index]
    client.is_connected = 1;
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect " + client_index);
    client.subscribe(topic_name, {qos:2});
  }
}



// when tab come into focus again
document.addEventListener('visibilitychange', function(){
    let c0 = clients[0];
	let c1 = clients[1];
    if(c0.is_connected == 0) c0.connect(clients_data[0].connect_params);
    if(c1.is_connected == 0) c1.connect(clients_data[1].connect_params);
})

