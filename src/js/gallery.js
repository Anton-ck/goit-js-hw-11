import { PixabayAPI } from './PixabayAPI';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import createGalleryCards from '../templates/gallery-card.hbs';

const galleryEl = document.querySelector('.js-gallery');
const searchFormEl = document.querySelector('.js-search-form');
const gallery = document.querySelector('.gallery__item');
const dementor = document.querySelector('#dementor');

const pixabayApi = new PixabayAPI();

const onSearchFormSubmit = async event => {
  event.preventDefault();
  clearPage();
  const searchQuery = event.currentTarget.elements['user-search-query'].value
    .toLowerCase()
    .trim();

  pixabayApi.page = 1;
  pixabayApi.query = searchQuery;
  observer.unobserve(dementor);

  if (!searchQuery) {
    oooops();
    searchFormEl.reset();
    // observer.unobserve(dementor);
    return;
  }
  clearPage();

  try {
    renderPage();
  } catch (err) {
    console.log(err);
  }
};

async function renderPage() {
  const { data } = await pixabayApi.getPhotosByQuery();

  // console.table(pixabayApi.page);
  if (data.hits.length === 0) {
    searchFormEl.reset();
    clearPage();

    Notiflix.Report.failure(
      'Failure',
      `We do not have anything for your search`,
      'Ok'
    );
  }
  if (pixabayApi.page === 1 && data.hits.length > 0) {
    Notiflix.Notify.success(`Yep Yep :-) We found ${data.totalHits} images.`);
  }

  galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
  if (pixabayApi.page < Math.ceil(data.totalHits / pixabayApi.per_page)) {
    observer.observe(dementor);
  }
  lightbox.refresh();
  smoothScroll();
}

let onEntry = entries => {
  entries.forEach(entry => {
    if (
      entry.isIntersecting &&
      searchFormEl['user-search-query'].value !== ''
    ) {
      pixabayApi.page += 1;

      try {
        if (entries[0].intersectionRatio <= 0) return;
        renderPage();
        lightbox.refresh();
      } catch (err) {
        console.log(err);
      }
    }
  });
};

let observer = new IntersectionObserver(onEntry, {
  rootMargin: '50px',
});

// observer.observe(dementor);

searchFormEl.addEventListener('submit', onSearchFormSubmit);

////////////////////////////////////////////////////////////////////////////
async function oooops() {
  const image = await document.createElement('img');
  image.height = 400;
  image.width = 400;
  image.src =
    'https://images.lookhuman.com/render/standard/0905030583597000/greetingcard45-off_white-z1-t-oops-you-tried-cat.jpg';
  galleryEl.prepend(image);
  return;
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

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 150,
});
