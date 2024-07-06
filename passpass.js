// How to use passpass api
const WebSocket = require('ws');

apiKey = "31204c34-03ce-4b31-b435-6206b8caefd8"
timeout = null
async function startWebSocketClient() {
    const ws = new WebSocket('ws://localhost:8765');
    ws.on('open', function open() {
        // send api key to authentify
        ws.send(JSON.stringify({'apiKey':apiKey}));
      });

    ws.on('disconnected', (message) => {
        console.log(message)
        ws.close();
        reconnect()
    });

    ws.on('message', (message) => {
        data = message.toString('utf8');
        console.log('message: ',data)
    });

    ws.on('scan', (message) => {
      const parsedMessage = JSON.parse(message);
      console.log(`Received message: ${parsedMessage.data}`);
      tpe = parsedMessage.TPE
      rfid = parsedMessage.RFID
      // EXAMPLE:
      // user with RFID scan on TPE, verify if subscription is good or not
      user_subscription = "ok"
      if(user_subscription === "ok")
        ws.send(JSON.stringify({ action: 'scanComplete', status: 'succes', TPE: tpe, RFID: rfid }));
      else{
        ws.send(JSON.stringify({ action: 'scanComplete', status: 'failed', TPE: tpe, RFID: rfid }));
      }
    });

    ws.on('close', function close() {
        console.log('Disconnected from WebSocket server');
        ws.close();
        reconnect()
    });

    ws.on('error', (error) => {
        console.error(`Connection error: ${error.message}`);
        // Close the socket to ensure proper cleanup
        ws.close();
        reconnect()
    });

    // /!\ Do not toucvh /!\ awaiter for event receive
    while (true) {
        // Do not touch timeout or server could be rejected by limit
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Do nothing
    }
}

function reconnect(){
    clearTimeout(timeout)
    timeout = setTimeout(startWebSocketClient, 1000);
}

startWebSocketClient().catch((e)=>{
    console.log(e)
});