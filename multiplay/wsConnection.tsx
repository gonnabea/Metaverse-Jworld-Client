import { w3cwebsocket } from "websocket";

const wsConnection = new w3cwebsocket('ws://localhost:4001')

  wsConnection.onopen = () => {
      console.log("웹소켓 연결됨")

      

  }

export default wsConnection;