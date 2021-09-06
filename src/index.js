import './sass/main.scss';
import { alert, info, success, error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
import fetchPhoto from './apiService.js'

const refs = {
    form: document.querySelector(".search-form"),
    input: document.querySelector(".input"),
    listPhoto: document.querySelector(".gallery"),
    loading: document.querySelector(".loading"),
    btnToTop: document.querySelector(".btn__to-top"),
    lightbox: document.querySelector(".lightbox"),
    lightboxOverlay: document.querySelector(".lightbox__overlay"),
    lightboxImage: document.querySelector(".lightbox__image"),
    btnClose: document.querySelector(".lightbox__button")
}
export let pageNumber = 1

export function renderCollection(arr) {
    if (refs.input.value.length === 0) {
        alert({ text: 'Enter a search word' })
    } if (arr.length === 0 && refs.input.value.length !== 0) {
        alert({ text: 'Nothing found. Please enter a more specific query.' })
    }
    const template = arr.map(el => `
        <li class="gallery__item">
                <a class="gallery__link" >
                    <img class="gallery__image" src="${el.webformatURL}" alt="${el.tags}" data-source="${el.largeImageURL}"/>
                </a>
                <div class="stats">
                    <p class="stats-item">
                      <i class="material-icons">thumb_up</i>
                      ${el.likes}
                    </p>
                    <p class="stats-item">
                      <i class="material-icons">visibility</i>
                      ${el.views}
                    </p>
                    <p class="stats-item">
                      <i class="material-icons">comment</i>
                      ${el.comments}
                    </p>
                    <p class="stats-item">
                      <i class="material-icons">cloud_download</i>
                      ${el.downloads}
                    </p>
                </div>
        </li>`).join("")
    refs.listPhoto.insertAdjacentHTML('beforeend', template)
    refs.loading.classList.remove('show')
}

function getMorePhoto() {
    pageNumber = pageNumber + 1
    refs.loading.classList.add('show')
    fetchPhoto(refs.input.value)
}

function modalClose() {
  refs.lightbox.classList.remove("is-open")
  refs.lightboxImage.src = ""
  refs.lightboxImage.alt = ""
}

function openModal(event) {
    if (event.target.nodeName !== 'IMG') {
    return;
    }
    refs.lightbox.classList.add("is-open")
    refs.lightboxImage.src = event.target.dataset.source
    refs.lightboxImage.alt = event.target.alt
}

function getFetchData() {
    refs.listPhoto.innerHTML = ''
    pageNumber = 1
    fetchPhoto(refs.input.value)
}

function loadMorePhoto() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (clientHeight + scrollTop >= scrollHeight - 5) {
            getMorePhoto()
        }
}

function showButton() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop > 200) {
        refs.btnToTop.classList.add("show-btn")
    } else {
        refs.btnToTop.classList.remove("show-btn")
    }
}

refs.form.addEventListener('submit', (e) => {
    e.preventDefault()
    getFetchData()
})
refs.listPhoto.addEventListener('click', (e) => {
    e.preventDefault()
    openModal(e)
})
refs.lightboxOverlay.addEventListener('click', (event) => { 
  if (event.target === event.currentTarget) {
    modalClose()
  }
})
refs.btnClose.addEventListener('click', modalClose)
window.addEventListener('scroll', () => {
    loadMorePhoto()
    showButton()
});