import { fields } from './base'

//get the input from the field
export const getInput = () => fields.input_field.value;


//clear the input field
export const clearInput = () =>{

    fields.input_field.value='';
}

//clear the searchResults in ui
export const clearSearchResults = () =>{

    fields.search_result_list.innerHTML='';
    fields.pagination_button.innerHTML='';
}
//highlight the selected url

export const highlightSelected= id =>{
    //first clear the other highlighted ones
    const highlightedArray=Array.from(document.querySelectorAll('.results__link'))
    highlightedArray.forEach(el => {
        el.classList.remove('results__link--active');
    })
    //selected url highlighted
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

//reducing the length of the recipe title
export const limitRecipeTitle = (title,length=17) =>{
    const newTitle=[];
    if(title.length >length){
        title.split(" ").reduce((acc,curr)=>{
            if(acc+curr.length <= length){
                newTitle.push(curr);
            }
            return acc + curr.length;
        },0)
        return `${newTitle.join(' ')} ...`    
     }
    return title;
}


const renderRecipe= recipe => {
    const markup=`
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
    `;
    fields.search_result_list.insertAdjacentHTML('beforeend',markup);
}
const createPagButton=(page,type) =>`

    <button class="btn-inline results__btn--${type}" data-goto=${type == 'prev'? page-1 : page+1}>
        <span>page${type == 'prev'? page-1 : page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type == 'prev'? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderPageButtons=(page,results,resultsPerPage) =>{
    const pages=Math.ceil(results/resultsPerPage);
    let button;
    if(page == 1 && pages > 1){
        //only next button
        button=createPagButton(page,'next');
    }
    else if(page<pages){
        //both the buttons
        button=`
           ${createPagButton(page,'next')}
           ${createPagButton(page,'prev')} 
        `

    }else if(page == pages && pages >1 ){
        //prev button
        button=createPagButton(page,'prev');    
    }
    fields.pagination_button.insertAdjacentHTML('afterbegin',button);
}

export const renderResults=(recipes,page=1,resPerPage=10) => {
    //render results of current page
    const start=(page-1)*resPerPage;
    const end=(page)*resPerPage;
    recipes.slice(start,end).forEach(renderRecipe)
    //render pagination buttons
    renderPageButtons(page,recipes.length,resPerPage);

}
