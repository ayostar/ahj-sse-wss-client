import LoginWidget from './widgets/LoginWidget';
import ChatWidget from './widgets/ChatWidget';

export default class PageController {
  constructor(api, chat) {
    this.api = api;
    this.chat = chat;
    this.container = null;
    this.createLogin = this.createLogin.bind(this);
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Контейнер не является элементом "HTMLElement"');
    }
    this.container = container;
    this.loginWidget = new LoginWidget(this.container);
    this.chatWidget = new ChatWidget(this.container);
  }

  init() {
    this.loginWidget.init();
    this.chatWidget.init();

    this.loginWidget.openLoginWidget((event) => this.createLogin(event));
    this.loginWidget.inputNickname.addEventListener('click', (event) => {
      const parentEl = event.target.closest('.login-form');

      if (parentEl.querySelector('.error-text').textContent === '') {
        return;
      }

      this.clearErrorMessage();
    });
  }

  createLogin(event) {
    event.preventDefault();

    const nickName = event.target.elements[0].value;
    const nickNameTrim = nickName.trim();
    (async () => {
      const response = await this.api.load();

      if (response.ok) {
        const data = await response.json();
        const activeLog = data.find(
          (item) => item.active === true || item.active === 'true',
        );
        if (activeLog) {
          this.api.loginOut();
        }

        const verified = data.find(
          (item) => item.name.toLowerCase() === nickNameTrim.toLowerCase(),
        );
        event.target.reset();

        if (verified) {
          this.showErrorMessage(
            'Такой никнэйм уже существует, выберите другое имя!',
          );
          this.loginWidget.inputNickname.blur();
        } else {
          await this.api.add({
            name: nickName,
            active: true,
            status: true,
            msg: [],
          });
          this.loginWidget.closeLoginWidget();
          const res = await this.api.load();

          if (res.ok) {
            const contacts = await res.json();
            this.chatWidget.openChatWidget(this.chat.start(contacts));
          }
        }
      }
    })();
  }

  showErrorMessage(message) {
    this.loginWidget.errorText.classList.add('invalid');
    this.loginWidget.errorText.innerHTML = message;
  }

  clearErrorMessage() {
    this.loginWidget.errorText.classList.remove('invalid');
    this.loginWidget.errorText.innerHTML = '';
  }
}
