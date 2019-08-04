import uniqid from 'uniqid';
export default class List{
    constructor(){
        this.items=[];
    }

    //add a new item to shopping list
    addItem(count,unit,ingredient){
       const item ={
           id:uniqid(), 
           count,
           unit,
           ingredient
       }
       this.items.push(item);
       return item;
    }

    //delete an item w.r.t an id from shopping list
    deleteItem(id){
        const index=this.items.findIndex(el => el.id === id) //check if id passed in is there in items 
        this.items.splice(index,1);
    }

    updateCount(id,newCount){
        //update the items count after checking if the id is passed in is there 
        this.items.find(el => el.id === id).count=newCount;
    }
}