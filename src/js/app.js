import API from './Rest';
import Chat from './Chat';
import PageController from './PageController';

const api = new API('https://ahj-sse-wss-server.onrender.com/contacts');
const chat = new Chat(document.querySelector('.container'));
const pageCtrl = new PageController(api, chat);
pageCtrl.bindToDOM(document.querySelector('.container'));
pageCtrl.init();
