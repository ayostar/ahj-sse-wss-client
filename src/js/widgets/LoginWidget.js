export default class LoginWidget {
  constructor(loginWidgetContainer) {
    if (!loginWidgetContainer) {
      throw Error('Элемент не найден');
    }

    this.loginWidgetContainer = loginWidgetContainer;
    this.widget = document.createElement('div');
  }

  init() {
    this.widget.classList.add('widget', 'login-widget', 'hidden');
    this.widget.innerHTML = `<div class="login-control">\n <h3 class="login-title">Выберите псевдоним</h3>\n <form class="login-form">\n
    <input type="text" class="input input-nickname" required>\n<div class="error-container">\n<span class="error-text"></span>\n</div>\n
    <div class="btn-box">\n<button class="continue-btn">Продолжить</button>\n</div>\n</form>\n</div>\n`;

    this.loginWidgetContainer.append(this.widget);
    this.loginform = this.widget.querySelector('.login-form');
    this.inputNickname = this.widget.querySelector('.input-nickname');
    this.errorText = this.widget.querySelector('.error-text');
    this.errorText.textContent.trim();
    this.continueBtn = this.widget.querySelector('.continue-btn');
  }

  openLoginWidget(callback) {
    this.widget.classList.remove('hidden');
    this.widget.style.top = `${
      (window.innerHeight - this.widget.offsetHeight) / 2
    }px`;
    this.widget.style.left = `${
      (window.innerWidth - this.widget.offsetWidth) / 2
    }px`;
    this.loginform.addEventListener('submit', callback);
  }

  closeLoginWidget() {
    this.widget.classList.add('hidden');
    this.loginform.reset();
  }
}
