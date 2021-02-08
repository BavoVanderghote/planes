import {io} from 'socket.io-client';

const SOCKET_SERVER = 'https://planes-socket-server.herokuapp.com/';
const socket = io(SOCKET_SERVER, {
  // auth: {
  //   token: '123',
  // },
});

export {socket};
