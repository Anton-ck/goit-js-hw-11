import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34828268-d3c9207948fe19a18b525d048';
  page = 1;
  query = null;
  per_page = 10;

  getPhotosByQuery() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: this.per_page,
        page: this.page,
      },
    });
  }
}
