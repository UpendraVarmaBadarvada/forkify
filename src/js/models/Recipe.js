import axios from 'axios';
import {key,cors} from '../config'

export default class Recipe{
    constructor(id){
        this.id=id;
    }

    async getRecipe(){

        try{

           const res=await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`); //rId-> recipeId
           this.title=res.data.recipe.title;
           this.author=res.data.recipe.publisher;
           this.img=res.data.recipe.image_url;
           this.url=res.data.recipe.source_url;
           this.ingredients=res.data.recipe.ingredients;
        }
        catch(error){
            alert(`something went wrong ${error}`);    
        }
    }

    calcTime(){
        //assume we need 15 min for each combo of 3 ingredients to cook
        const numIng=this.ingredients.length;
        const combos=Math.ceil(numIng/3);
        this.time=combos * 15;
    }
    calcServings(){
        this.servings=4;
    }
    parseIngredients(){
        const unitsLong=['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort=['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units=[...unitsShort,'kg','g'];
        const newIngredients=this.ingredients.map(el =>{
            //1. uniform units i.e convert from long units to short units
            let ingredient=el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                ingredient=ingredient.replace(unit,unitsShort[i]);
            });
            /*2. remove paranthesis;
                    starts with ( and arbitrary no of char except ) 
                    and ends with ) and enclosed with arbitrary no of spaces on either side;*/
            ingredient=ingredient.replace(/ *\([^)]*\) */g,' ');
            
            
            //3. parse ingredients into count unit and ingredient 
            const arrIng=ingredient.split(' ');// divide the string into array of words
            //check if any of unitShort elements are in above created array
            const unitIndex=arrIng.findIndex(el2 => units.includes(el2));
            let objIng;
            //always remember *count will be there at the starting of the string only 
            if(unitIndex > -1){
                //there is a unit in the string and the ingredients start like 4 1/2 cups or 4 cups and that starting charecter is not a no
                const arrNoCount=arrIng.slice(0,unitIndex);
                let count;
                if(arrNoCount.length == 1){
                    // only 4 for ex or if there is a string like 4-1/2 convert it to 4+1/2 and eval it 
                    count=eval(arrIng[0].replace('-','+'));
                }
                else{ 
                    //if there are 2 no's in array at the start 4 and 1/2 for ex join those two no's and eval that string
                    count=eval(arrIng.slice(0,unitIndex).join('+'));
                }
                objIng={
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(' ')
                }
            }else if(parseInt(arrIng[0],10)){  // if false returns a NAN(which is false by default)
                //1st element of the array is a number
                objIng={
                    count:parseInt(arrIng[0],10),
                    unit:'gms',
                    ingredient:arrIng.slice(1).join(' ')
                }
            }
            else if(unitIndex === -1){
                //unit not there
                objIng={
                    count:1,
                    unit:'gms',
                    ingredient //es6 object enhancement
                }

            }  
            return objIng;
        })
        this.ingredients=newIngredients;
    }
    updateServings(type){
        //calc new servings
        const newServings = type === 'dec'? this.servings-1:this.servings+1;

        //calc new ingredients count
        this.ingredients.forEach(ing =>{
            ing.count*= newServings/this.servings;
        })

        this.servings=newServings;    
    }

}
