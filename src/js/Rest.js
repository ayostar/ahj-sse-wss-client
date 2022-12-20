export default class API {
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
  }

  load() {
    return fetch(this.url);
  }

  add(contact) {
    return fetch(this.url, {
      body: JSON.stringify(contact),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  // async add(contact) {
  //   const request = fetch(this.url, {
  //     body: JSON.stringify(contact),
  //     method: 'POST',
  //     headers: this.contentTypeHeader,
  //   });
  //   const result = await request;

  //   if (!result.ok) {
  //     console.log(`Ошибка ${result}`);
  //     return;
  //   }
  //   const json = await result.json();

  //   const status = json.status;
  //   console.log(status);
  // }

  remove(id) {
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE',
    });
  }

  loginOut() {
    return fetch(this.url, {
      method: 'PUT',
    });
  }
}
