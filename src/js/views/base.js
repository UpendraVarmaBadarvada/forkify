export const fields={
    input_field:document.querySelector('.search__field'),
    search_button:document.querySelector('.search'),
    search_result_list:document.querySelector('.results__list'),
    recipe_Loader:document.querySelector('.results'),
    pagination_button:document.querySelector('.results__pages'),
    recipe:document.querySelector('.recipe'),
    shopping_list:document.querySelector('.shopping__list'),
    likes_menu:document.querySelector('.likes__field'),
    likes_list:document.querySelector('.likes__list')
};

export const loaderString={
    loader:'loader'
}

//render the loader
export const renderLoader = parent => {
    const loader =`
        <div class="${loaderString.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin',loader);
}

//delete the loader
export const deleteLoader = () =>{
    const loader= document.querySelector(`.${loaderString.loader}`);
    if(loader) loader.parentNode.removeChild(loader);
}