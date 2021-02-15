import {io} from 'socket.io-client';

const SOCKET_SERVER = 'https://planes-socket-server.herokuapp.com/';
// const SOCKET_SERVER = 'http://192.168.0.229:3000';

const socket = io(SOCKET_SERVER, {
  // auth: {
  //   token: '123',
  // },
});

export {socket};
