import axios from 'axios';
import {key,cors} from '../config'
export default class Search{
    constructor(query){
        this.query=query;
    }
    async getRecipes() {
        
        try{
            const res=await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.recipes=res.data.recipes;
        }   
        catch(error){
            alert(error);
        }
    }

}
