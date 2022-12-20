export default class Chat {
  constructor(chatContainer) {
    this.chatContainer = chatContainer;
    this.activeId = null;
    this.name = null;
    this.active = null;
    this.ws = new WebSocket('ws://ahj-sse-wss-server.onrender.com//ws');
    this.idVasserman = null;
  }

  start(contacts) {
    this.userList = this.chatContainer.querySelector('.user-list');
    this.chatArea = this.chatContainer.querySelector('.chat-area');
    this.inputChat = this.chatContainer.querySelector('.input-chat');
    this.msgForm = this.chatContainer.querySelector('.msg-form');

    this.userList.addEventListener('click', (event) => this.disableUser(event));
    this.msgForm.addEventListener('submit', (event) => this.createChat(event));

    this.showUserList(contacts);
    this.sortMessages();
  }

  disableUser(event) {
    event.preventDefault();

    if (!event.target.classList.contains('login-status')) return;
    event.target.classList.toggle('check');

    if (!event.target.classList.contains('check')) {
      const removeId = event.target.closest('.user-container').dataset.id;
      const data = JSON.stringify({
        event: 'disableUser',
        removeId,
      });

      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(data);
      }

      this.ws.addEventListener('message', (evt) => {
        const msg = JSON.parse(evt.data);
        Chat.clearChat();
        this.showUserList(msg.message);
        this.sortMessages();
      });
    }
  }

  createChat(event) {
    event.preventDefault();

    if (!this.active) {
      this.clearMessages();
      return;
    }

    const messages = this.inputChat.value;
    this.createMessege(messages, this.activeId);
    this.showMessegeBot();
  }

  showUserList(contacts) {
    this.clearMessages();

    Array.from(contacts).forEach((item) => {
      const {
        id, name, active, status,
      } = item;

      if (name === 'Vasserman') {
        this.idVasserman = id;
      }

      let checked;
      let nickName;

      if (status === true || status === true) {
        checked = 'check';
      } else {
        checked = '';
      }

      this.name = name;
      this.active = active;

      const userEl = document.createElement('div');
      userEl.classList.add('user-container');
      userEl.dataset.id = id;

      if (this.active === true || this.active === 'true') {
        this.activeId = id;
        nickName = `Вы (${this.name})`;
        userEl.classList.add('invalid');
      } else {
        nickName = this.name;
      }

      userEl.innerHTML = `<div class="login-status ${checked}"></div>`
        + `                        <div class="login">${nickName}</div>`;
      this.userList.append(userEl);
      const msglength = item.msg.length;

      if (msglength) {
        this.showMessageChat(item.msg);
      }
    });
  }

  showMessageChat(messages) {
    messages.forEach((item) => {
      const { userId, created, message } = item;
      const formated = Chat.formatDate(created);
      let messageActive;
      let activeUser;

      if (this.active === true || this.active === 'true') {
        messageActive = 'message-you';
        activeUser = 'Вы';
      } else {
        messageActive = 'message-client';
        activeUser = this.name;
      }

      const messageEl = document.createElement('div');
      messageEl.dataset.userId = userId;
      messageEl.id = Date.parse(created);
      messageEl.classList.add('message', `${messageActive}`);
      messageEl.innerHTML = `<div class="message-time">${activeUser}, ${formated}</div>`
        + `                 <div class="message-text">${message}</div>`;

      this.chatArea.append(messageEl);
      messageEl.scrollIntoView(false);
    });
  }

  sortMessages() {
    const chatElements = [...this.chatArea.children];
    const sortedChatElements = chatElements.sort((a, b) => a.id - b.id);
    chatElements.forEach((item) => {
      item.remove();
    });
    sortedChatElements.forEach((elem) => this.chatArea.append(elem));
  }

  createMessege(message, idClient) {
    const created = new Date();
    const idUser = idClient;

    const createMsg = { idUser, created, message };
    const data = JSON.stringify({
      event: 'createMessage',
      createMsg,
    });

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }

    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      Chat.clearChat();
      this.showUserList(msg.message);
      this.sortMessages();
    });
  }

  static formatDate(date) {
    const data = new Date(date);

    let day = data.getDate();
    const month = data.getMonth();
    const year = data.getFullYear();
    let hour = data.getHours();
    let minutes = data.getMinutes();

    day = day < 10 ? `0${day}` : day;
    hour = hour < 10 ? `0${hour}` : hour;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hour}:${minutes}  ${day}.${month}.${year}`;
  }

  static clearChat() {
    const userLisrt = document.querySelectorAll('.user-container');
    userLisrt.forEach((item) => {
      item.remove();
    });
    const messagesEl = document.querySelectorAll('.message');
    messagesEl.forEach((item) => {
      item.remove();
    });
  }

  clearMessages() {
    this.inputChat.value = '';
  }

  showMessegeBot() {
    const botText = Chat.getBotText();
    this.renderBotText(botText);
  }

  static getBotText() {
    const botText = [
      'Ценность информации заранее неизвестна никому',
      'Профессионалом делает не диплом и не репутация, а именно знания и понимание всего относящегося к делу',
      'Экономика — это наука (а зачастую — и искусство) распоряжения ограниченными ресурсами',
      'Представление о справедливости у людей разное и зачастую меняется в зависимости от текущего положения человека',
      'Самостоятельно изучайте наши ошибки, чтобы не повторять их, а делать свои собственные',
      'Поговорка «Заставь дурака богу молиться, он лоб расшибет» не учитывает, что дурак обычно расшибает чужие лбы',
      'Так уж мы устроены, что большинство из нас готовы совершенствоваться только осознавая, что другого выхода нет.',
      'Точные знания — основа точных прогнозов',
      'Ум отчасти в том и состоит, чтобы отсекать разрешимые и важные для вас задачи от второстепенных',
    ];
    const index = Math.floor(Math.random() * botText.length);

    return botText[index];
  }

  renderBotText(botText) {
    const activeidVasserman = Array.from(
      this.userList.querySelectorAll('.user-container'),
    ).find((item) => item.dataset.id === this.idVasserman);
    if (!activeidVasserman) {
      return;
    }
    const delay = Math.floor(Math.random() * (botText.length * 200));
    setTimeout(() => {
      this.createMessege(botText, this.idVasserman);
    }, delay);
  }
}
