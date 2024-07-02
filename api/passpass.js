// How to use passpass api
const WebSocket = require('ws');

async function startWebSocketClient() {
    const ws = new WebSocket('ws://localhost:8765');
    ws.on('open', function open() {
        // send api key to authentify
        ws.send(JSON.stringify({'apiKey':'0'}));
      });

    ws.on('disconnected', (message) => {
        console.log(message)
        // TODO handle
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
        // TODO handle
    });

    // /!\ Do not toucvh /!\ awaiter for event receive
    while (true) {
        // Do not touch timeout or server could be rejected by limit
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Do nothing
    }
}

startWebSocketClient().catch(console.error);