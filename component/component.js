class EngineComponent{
    constructor(arg){
        this.engine = arg;
        this.gameObjects = [];
    }
    
    register(gameObject){
         if(gameObject.constructor.name == "GameObject") this.gameObjects.push(gameObject);
    }
}
