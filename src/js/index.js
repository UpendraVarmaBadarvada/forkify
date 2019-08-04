import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { fields,renderLoader,deleteLoader } from './views/base'
/* global state of our app

1.search object
2.current recipe object
3.shopping list object
4.liked recipes

*/

const state={}

//search controller
const controlSearch=async () =>{
    
    //get input fro ui
    const query=searchView.getInput();
    if(query){
        //new search object and add that to state
        state.search=new Search(query)
        //clearing input fields
        searchView.clearInput();
        searchView.clearSearchResults();
        renderLoader(fields.recipe_Loader);
        //get the recipes 
        try{
        await state.search.getRecipes();
        //clear the loader
        deleteLoader();
        //render theese recipes in the ui
        searchView.renderResults(state.search.recipes)
        }catch(error){
            deleteLoader();
            alert(`error while processing search controller:${error}`)
        }

    }
};
//search button
fields.search_button.addEventListener('submit',e =>{  // for search_button see base.js 
    e.preventDefault();
    controlSearch();
});
//event delegation  && navigation buttons   
fields.pagination_button.addEventListener('click',e =>{
    const btn=e.target.closest('.btn-inline');   // element closest to the class specified
    if(btn){
       const goToPage = parseInt(btn.dataset.goto,10);//parseInt with index 10
       searchView.clearSearchResults();
       searchView.renderResults(state.search.recipes,goToPage);

    }
})

//controller for recipe
const controlRecipe=async () =>{
    const id=window.location.hash.replace('#','');
    if(id){
        //clear the previous recipe
        recipeView.clearRecipe();
        //render the loader
        renderLoader(fields.recipe);
        //highlight the selected recipe ife there is only a search
        if(state.search) searchView.highlightSelected(id);
        //create a recipe object
        state.recipe=new Recipe(id);

        //get the recipe
    try{
        await state.recipe.getRecipe();
        
        //calc time & servings
        state.recipe.calcTime();
        state.recipe.calcServings();
        state.recipe.parseIngredients();
        
        //render the recipe
        deleteLoader();
        recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));//send both recipe and likes
        }catch(error){
            alert(`error while processing recipe:${error}`);
        }
    }
}

//recipe should open on load of a window and change of url after selecting a item in likes list
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/**
 * List controller
 */

 const controlList=() =>{
     //create a list if there is none yet

     if(!state.list) state.list=new List();

     //add each ingredient to the  list
    state.recipe.ingredients.forEach(el => {
       const item = state.list.addItem(el.count,el.unit,el.ingredient);
       listView.renderItem(item);
       
    })
}
//handle the shopping list delete and update fn's
fields.shopping_list.addEventListener('click',e =>{
    //event delegation
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button 
    if(e.target.matches('.shopping__delete,.shopping__delete *')){
        //delete from the state
        state.list.deleteItem(id);
        //delete from the ui
        listView.deleteItem(id);
    }
    //handles the update of list count values
    else if(e.target.matches('.shopping_count_value')){
        const val= parseFloat(e.target.value);
        state.list.updateCount(id,val);
    }
});

/**
 * Likes controller
 */

 const controlLikes =() =>{
     //create a likes item if there is none yet

     if(!state.likes) state.likes=new Likes();
     const currId=state.recipe.id;
     
     //user has not yet liked current recipe   
     if(!state.likes.isLiked(currId)){
        //add the like to the state
        const newLike=state.likes.addLike(
            currId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle the like button
        likesView.toggleLike(true);
        //add the like to the ui list
        likesView.renderLike(newLike);
     } 
     //user has  liked current recipe 
     else{
        //remove the like from the state
        state.likes.deleteLike(currId);

        //toggle the like button
        likesView.toggleLike(false);
        //remove the like from the ui list
        likesView.deleteLike(currId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
 }

 //restore the likes on load of a window
 window.addEventListener('load',() =>{
    state.likes=new Likes();
    //restore the likes using local storage
    state.likes.readStorage();
    //on load as there are no likes the likes menu should be hidden
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //render the likes on ui by iterating through likes array 
    state.likes.likes.forEach(like =>likesView.renderLike(like));
 })


//handling recipe button inc / dec clicks uing event delegation;

fields.recipe.addEventListener('click',el =>{
    
    //checks if element matches either of theese 2 classes where * denotes element and its any child 
    if(el.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        if(state.recipe.servings > 1){
            //if servings is positive then only its allowed to update the servings
            state.recipe.updateServings('dec');
            //update the servings on ui
            recipeView.updateServingsCount(state.recipe);
        }
    }else
    if(el.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        //update the servings on ui
        recipeView.updateServingsCount(state.recipe);
    }
    else if(el.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        //add the ingredients to the shopping list
        controlList();
    }
    else if(el.target.matches('.recipe__love,.recipe__love *')){
        //add the ingredients to the shopping list
        controlLikes();
    }

})


