import { pageNumber, renderCollection } from './index.js'
import { alert, info, success, error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';

export default async function fetchPhoto(value) {
    try {
        const request = await fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${value}&page=${pageNumber}&per_page=12&key=23140827-84799927bd5cf84c72c1ef99f`)
        const result = await request.json()
        renderCollection(result.hits)
    } catch (error) {
        console.log(error)
        error({text: 'Error'})
    }
}