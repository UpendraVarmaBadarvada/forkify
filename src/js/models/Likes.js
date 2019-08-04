export default class Likes{
    constructor(){
        this.likes=[];
    }
    addLike(id,title,author,img){
        const like = {id,title,author,img};  //object enhancement
        this.likes.push(like);
        this.persistData();
        return like;
    }
    deleteLike(id){
        const index=this.likes.findIndex(el => el.id === id) //check if id passed in is there in items 
        this.likes.splice(index,1);
        this.persistData();
    }
    isLiked(id){
        //so basically it's liked
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    getNumLikes(){
        return this.likes.length;
    }
    persistData(){
        //convert the array to string as local storage value only takes a string
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }
    readStorage(){
        const storage=JSON.parse(localStorage.getItem('likes'));
        //restore from the local storage
        if(storage){
            this.likes=storage;
        }
    }
}