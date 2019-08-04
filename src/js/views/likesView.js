import { fields } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLike = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    //change the href
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)
    //icons.svg#icon-heart-outlined

}

export const toggleLikeMenu = numLikes => {
    fields.likes_menu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLike = like => {
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${limitRecipeTitle(like.title)}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;
    fields.likes_list.insertAdjacentHTML('beforeend',markup);
};
export const deleteLike = id => {
    //remove the like from ui from the parent
    const el=document.querySelector(`.likes__link[href="#${id}"]`).parentNode;
    if(el) el.parentNode.removeChild(el);
}