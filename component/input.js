class InputManager{
    constructor(){
        this.horizontal = {moviment:0, position:0};
        this.vertical = {moviment:0, position:0};
        this.action = {status: false, position: {x:0, y:0}};
        this._temp = {time: 0, _state: false};
        
        window.onkeydown = function(e) {
            if (e.which == 37) this.horizontal.moviment = -1;
            if (e.which == 39) this.horizontal.moviment = 1;
            if (e.which == 38) this.vertical.moviment = -1;
            if (e.which == 40) this.vertical.moviment = 1;
        }.bind(this);
        window.onkeyup = function(e) {
            if (e.which == 37) this.horizontal.moviment = 0;
            if (e.which == 39) this.horizontal.moviment = 0;
            if (e.which == 38) this.vertical.moviment = 0;
            if (e.which == 40) this.vertical.moviment = 0;
        }.bind(this);
        
        window.ontouchmove = function(e){
            e = e.changedTouches[0];
            this.action.state = false;
            this._temp._state = false;
            
            if(e.clientX > this.action.position.x) this.horizontal.moviment = 1;
            if(e.clientX < this.action.position.x) this.horizontal.moviment = -1;
            if(e.clientY > this.action.position.y) this.vertical.moviment = 1;
            if(e.clientY < this.action.position.y) this.vertical.moviment = -1;
        }.bind(this);
        
        window.ontouchend = function(e){
            this.horizontal.moviment = 0;
            this.horizontal.position = 0;
            this.vertical.moviment = 0;
            this.vertical.position = 0;
            this.action.position = {x:0, y:0};
            this._temp.time = 0;
            this.action.state = false;
            this._temp._state = false;
        }.bind(this);
            
            
        //action
        window.onclick = function(e) {
            this.action.status = true;
            this.action.position.x = e.clientX;
            this.action.position.y = e.clientY;
        }.bind(this);
        
        window.ontouchstart = function(e){
            let touch = e.changedTouches[0];
            
            this.action.position.x = touch.clientX;
            this.action.position.y = touch.clientY;
            this._temp.time = new Date();
            this._temp._state = true;
            
            this.horizontal.position = touch.clientX;
            this.vertical.position = touch.clientY;
            
            setTimeout(function(){
                if(!this._temp._state) return;
                if(new Date() - this._temp.time < 200 && 
                   this.action.position.x == this.horizontal.position &&
                   this.action.position.y == this.vertical.position){
                    this.action.status = true;
                    this._temp._state = false;
                }
            }.bind(this), 100);

        }.bind(this);
    }
}
