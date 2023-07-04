class Controls{
    constructor(type){
    this.forward=false;
    this.left=false;
    this.right=false;
    this.reverse=false;
    switch(type){
        case "KEYS":
            this.#addKeyboardListeners();//# means pvt user defined method
            break;// alowed key control to our car
        case "DUMMY": 
            this.forward=true;//traffic car only move forwrd
            break;

    }
    }


#addKeyboardListeners(){
    document.onkeydown=(event)=>{//when keys pressed
        switch(event.key){
            case "ArrowLeft": //if left arrow key pressed
                this.left=true; 
                break;
            case "ArrowRight":
                this.right=true;
                break;
            case "ArrowUp":
                this.forward=true;
                break;
            case "ArrowDown":
                this.reverse=true;
                break;  
        }
    }
    document.onkeyup=(event)=>{//when keys released
        switch(event.key){
            case "ArrowLeft"://if left arrow key released
                this.left=false;
                break;
            case "ArrowRight":
                this.right=false;
                break;
            case "ArrowUp":
                this.forward=false;
                break;
            case "ArrowDown":
                this.reverse=false;
                break;  
        }

    }
}
}