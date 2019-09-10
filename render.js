class RenderManager extends EngineComponent{
    constructor(arg){
        super(arg);
        
    }
    
    register(gameObject){
        super.register(gameObject);
        this.build(gameObject);
    }
    
    build(gameObject){
        gameObject.render = function(){
            let pos = {x: 0, y: 0};
            if(arguments[0] != undefined){
                if(arguments[0].collider != this.target.collider) this.target.collider = arguments[0].collider;
                if(arguments[0].file != this.target.sprite) this.target.sprite = arguments[0].file;
            }
            if(this.target.sprite == undefined) return console.error("no file to render");
            if(this.target.position != undefined) pos = {x: this.target.position.x, y: this.target.position.y};
            
            this.target.size = {width: this.target.sprite.width, height: this.target.sprite.height}
            this.t.render(this.target.sprite, pos, this.target.layer);
        }.bind({t:this, target: gameObject});
    }
    
    render(file, pos, layer){
        if(layer == undefined) return console.error("without a layer to render");
        this.engine.layers[layer].drawImage(file, pos.x, pos.y, file.width, file.height);
    }
}

