export default class ChatWidget {
  constructor(chatWidgetContainer) {
    if (!chatWidgetContainer) {
      throw Error('Элемент не найден');
    }

    this.chatWidgetContainer = chatWidgetContainer;
    this.widget = document.createElement('div');
  }

  init() {
    this.widget.classList.add('chat-widget', 'hidden');

    this.widget.innerHTML = '<div class="chat-container">\n'
      + '                      <div class="user-list"></div>\n'
      + '                      <div class="chat-messages">\n'
      + '                        <div class="chat-area"></div>\n'
      + '                        <form class="msg-form">\n'
      + '                          <input type="text" class="input input-chat" placeholder="Введите ваше сообщение..." required>\n'
      + '                        </form>\n'
      + '                      </div>\n'
      + '                    </div>\n';

    this.chatWidgetContainer.prepend(this.widget);
    this.userList = document.querySelector('.user-list');
    this.msgForm = this.widget.querySelector('.msg-form');
    this.inputChat = this.widget.querySelector('.input-chat');
  }

  openChatWidget(callback) {
    this.widget.classList.remove('hidden');
    this.msgForm.addEventListener('submit', callback);
  }

  closeChatWidgetl() {
    this.widget.classList.add('hidden');
  }
}
