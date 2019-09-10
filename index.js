class Game{
    constructor(arg){
        this.content = arg.content;
        this.width = arg.width;
        this.height = arg.height;
        this.x = arg.x;
        this.y = arg.y;
        this.background = arg.background;
        
        this.cenas = [];
        this.tags = ['default'];
        
        this.canvas = [];
        this.layers = {};
        this._target = null;
        this._count = 0;
        
        this.update = null;
        this.start = null;
        this.state = 'stoped';

        this.score = 0;
        this._score = 0;
    }
    
    build(layers){
        this.content.innerHTML = '';
        let content = document.createElement('div');
        content.className = "engine-game-content";
        this.content.appendChild(content);
        
        let sheet = window.document.styleSheets[1];
        sheet.insertRule('.engine-game-content { background: '+this.background+'; position: absolute; top:'+this.y+'px; left:'+this.x+'px; width: '+this.width+'px; height: '+this.height+'px }', sheet.cssRules.length);
        sheet.insertRule('.engine-game-content canvas { position: absolute; top:0px; left:0px; }', sheet.cssRules.length);
        
        
        
        for(let i = 0; i < layers.length; i++){
            let canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            canvas.id = layers[i];

            content.appendChild(canvas);
            this.canvas.push(canvas);
            this.layers[layers[i]] = canvas.getContext('2d');
        }

        let score = document.createElement('div');
        score.id = 'score';
        score.innerHTML = '0';
        content.appendChild(score);
        
        this.loop();
    }
    
    loop(){
        if(this._target != null){
            this.clean();
            this._play();
            if(typeof this.update == 'function'){this.update();}
        }
        window.requestAnimationFrame(()=>this.loop())
    }
    
    play(){
        if(this.start != null) this.start();
        let cena = 0;
        if(arguments.length > 0) cena = this.cenas;
        else{
            for(let i = 0; i < this.cenas.length; i++){
                if(this.cenas[i].main == true){
                    cena = i;
                    break;
                }
            }
        }
        this._target = this.cenas[cena];
        this.state = 'playing';
        this.score = 0;
        this._score = new Date();
    }
    
    stop(){        
        this._target = null;
        this._count = 0;
        this.state = 'stopped';
    }
    
    clean(){
        for(let i = 0; i < this.canvas.length; i++){
            this.canvas[i].getContext('2d').clearRect(0, 0, this.canvas[i].width, this.canvas[i].height)
        }
    }
    
    _play(){
        let obj = this._target.gameObjects;
        for(let i = 0; i < obj.length; i++){
            if(typeof obj[i].start == 'function' && this._count == 0) obj[i].start();
            if(typeof obj[i].update == 'function' && this._count > 0) obj[i].update();
        }

        this._count = this._count+1;
        let score = new Date() - this._score;
        score = score/1000;
        score = score/60;
        score = score.toFixed(2);

        this.score = score;

        document.getElementById('score').innerHTML = window.Koji.general.scoreMessage+' '+score;
    }
}

class Cena{
    constructor(arg){
        this.gameObjects = [];
        this.main = false;
        arg.cenas.push(this);
    }
    load(obj){
        this.gameObjects.push(obj);
    }
    destroy(obj){
        this.gameObjects = this.gameObjects.filter(function(t){
           return t != obj;
       });
    }
}

class GameObject{     
    constructor(arg){
        if(arg == undefined) arg = {}
        this.tag = (arg.tag != undefined ? arg.tag : 'default');
        this.uuid = function (){ let dt = new Date().getTime(); let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { let r = (dt + Math.random()*16)%16 | 0; dt = Math.floor(dt/16); return (c=='x' ? r :(r&0x3|0x8)).toString(16);}); return uuid;}();
        
        this.start = null;
        this.update = null;
        this.components = [];
    }
}
