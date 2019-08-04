import axios from 'axios';
import {key,cors} from '../config'
export default class Search{
    constructor(query){
        this.query=query;
    }
    async getRecipes() {
        
        try{
            const res=await axios(`${cors}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.recipes=res.data.recipes;
        }   
        catch(error){
            alert(error);
        }
    }

}