class PositionManager extends EngineComponent{
    constructor(arg){
        super(arg);
        this.consult = []
    }
    
    register(gameObject){
        super.register(gameObject);
        this.build(gameObject);
    }
    
    build(gameObject){
        gameObject.position = {_x:0, _y:0, pai: this, target: gameObject};
        Object.defineProperty(gameObject.position, 'x', {
            get: function(){return this._x;},
            set: function(arg){
                this._x = this.pai.beforeChangePosition({x:arg, y:this._y}, 'x', this.target);}
        })
        Object.defineProperty(gameObject.position, 'y', {
            get: function(){return this._y;},
            set: function(arg){this._y = this.pai.beforeChangePosition({y:arg, x:this._x}, 'y', this.target);}
        })
    }
    
    consultBeforeChange(func, name, modify){this.consult.push({f: func, name: name, change : (modify == undefined ? false : modify)})}
    
    beforeChangePosition(pos, indice, target){
        for(let i = 0; i < this.consult.length; i++){
            if(this.consult.change) pos = this.consult[i].f[this.consult[i].name](pos, indice, target);
            else this.consult[i].f[this.consult[i].name](pos, indice, target);
        }
        
        return pos[indice];
    }
}
