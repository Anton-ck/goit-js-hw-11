import { PixabayAPI } from './PixabayAPI';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import createGalleryCards from '../templates/gallery-card.hbs';

const galleryEl = document.querySelector('.js-gallery');
const searchFormEl = document.querySelector('.js-search-form');
const gallery = document.querySelector('.gallery__item');

const pixabayApi = new PixabayAPI();

const onSearchFormSubmit = async event => {
  event.preventDefault();
  clearPage();
  const searchQuery = event.currentTarget.elements['user-search-query'].value
    .toLowerCase()
    .trim();

  pixabayApi.query = searchQuery;

  if (!searchQuery) {
    return oooops();
  }
  pixabayApi.page = 1;
  clearPage();

  try {
    renderPage();
  } catch (err) {
    console.log(err);
  }
};

async function renderPage() {
  const { data } = await pixabayApi.getPhotosByQuery();

  if (data.hits.length === 0) {
    {
    }
    searchFormEl.reset();
    Notiflix.Report.failure(
      'Failure',
      `We do not have anything for your search`,
      'Ok'
    );
  } else if (pixabayApi.page === 1 || pixabayApi.page !== 2) {
    Notiflix.Notify.success(`Yep Yep :-) We found ${data.totalHits} images.`);
  }
  galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
  lightboxGallery();
  smoothScroll();
}

options = {
  rootMargin: '100px',
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (
      (entry.isIntersecting =
        true && searchFormEl['user-search-query'].value !== '')
    ) {
      try {
        pixabayApi.page += 1;
        renderPage();
      } catch (err) {
        console.log(err);
      }
    }
  });
}, options);



observer.observe(document.querySelector('#dementor'));

searchFormEl.addEventListener('submit', onSearchFormSubmit);

async function oooops() {
  const image = await document.createElement('img');
  image.src =
    'https://images.lookhuman.com/render/standard/0905030583597000/greetingcard45-off_white-z1-t-oops-you-tried-cat.jpg';
  galleryEl.prepend(image);
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearPage() {
  galleryEl.innerHTML = '';
}

const lightboxGallery = () => {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  lightbox.refresh();
};
