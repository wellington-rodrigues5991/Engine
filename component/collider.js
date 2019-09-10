class ColliderManager extends EngineComponent{
    constructor(arg){
        super(arg);
        this.direction;
    }
    
    register(gameObject){
        super.register(gameObject);
        this.build(gameObject);
    }
    
    build(gamaObjects){
        this.engine.consultBeforeChange(this, 'verifyCollision', false);
    }
    
    boundingBox(gameObject){
            let box = {};
            
            box.width = gameObject.size.width;
            box.height = gameObject.size.height;
            box.left = gameObject.position.x;
            box.right = gameObject.position.x + gameObject.size.width;
            box.top = gameObject.position.y;
            box.bottom = gameObject.position.y + gameObject.size.height;
            
            return box;
        }
    
    checkAttr(target){
        if(target.size == undefined) return false;
        if(target.position == undefined) return false;
        
        return true;
    }
    
    verifyCollision(pos, dir, target){
        if(this.engine.engine.state == "stoped"){
            return pos;
        }
        if(!this.checkAttr(target)) return console.log('erro no collider ', target);
        let temp = pos; temp.obj = target;
        dir = {x: null, y: null};
        
        if(this.direction.horizontal.moviment > 0) dir.x = 'right'
        if(this.direction.horizontal.moviment < 0) dir.x = 'left'
        if(this.direction.vertical.moviment < 0) dir.y = 'up'
        if(this.direction.vertical.moviment > 0) dir.y = 'down'
        pos = this.AABBCollider(temp, dir);
        
        return pos;
    }
    
    AABBCollider(data, direction){
        let i = this.gameObjects.indexOf(fish);
        
        if(data.obj == fish) return {x: data.x, y: data.y}
        if(data.obj.colliders == undefined) data.obj.colliders = [];
        if(this.IntersectRect(this.boundingBox(data.obj), this.boundingBox(this.gameObjects[i]))){
            if(this.pixelHitTest(data.obj, this.gameObjects[i])){
                if(!data.obj.trigger || !this.gameObjects[i].trigger){
                    let offset = {x: 0, y: 0};
                    offset = this.resolveCollision(this.boundingBox(data.obj), this.boundingBox(this.gameObjects[i]), direction);

                    if(offset.x != 0 && offset.x == direction.x){
                        data.x = data.obj.position.x;
                    }
                    if(offset.y != 0 && offset.y == direction.y){
                        data.y = data.obj.position.y;
                    }

                    let arr = data.obj.colliders;
                    if(arr.indexOf(this.gameObjects[i]) < 0) data.obj.colliders.push(this.gameObjects[i])
                }

                this.startEvent(data.obj, this.gameObjects[i]);
            }else{
                if(data.obj._collisionStatus == "stay" && data.obj.colliders.indexOf(this.gameObjects[i]) >= 0){
                    delete data.obj.colliders[data.obj.colliders.indexOf(this.gameObjects[i])];
                    this.exitEvent(data.obj, this.gameObjects[i]);
                }
            }
        }
        return{x: data.x, y: data.y}
    }
    
    IntersectRect(A, B, opt){
        if(opt){
            return !(
                ( ( A.y + A.height ) < ( B.y ) ) ||
                ( A.y > ( B.y + B.height ) ) ||
                ( ( A.x + A.width ) < B.x ) ||
                ( A.x > ( B.x + B.width ) )
            );
        }
        return !(B.left > A.right || B.right < A.left || B.top > A.bottom || B.bottom < A.top);
    }
    pixelHitTest(source, target) {
        for( var s = 0; s < source.collider.length; s++ ) {
            var sourcePixel = source.collider[s];
            var sourceArea = {
                x: sourcePixel.x + source.position.x,
                y: sourcePixel.y + source.position.y,
                width: 1,
                height: 1
            };
            for( var t = 0; t < target.collider.length; t++ ) {
                var targetPixel = target.collider[t];
                var targetArea = {
                    x: targetPixel.x + target.position.x,
                    y: targetPixel.y + target.position.y,
                    width: 1,
                    height: 1
                };
                if(this.IntersectRect(sourceArea, targetArea, true) ) {
                    return true;
                }
            }
        }
        
        return false;
    }
    resolveCollision(A, B, dir) {
        let temp = {x: 0, y: 0};
        if(A.left < B.right && A.left > B.right - (B.width/2)){
            temp.x = "left";
        }
        if(A.right > B.left && A.right < B.right + (B.width/2) && temp.x == ""){
            temp.x = "right";
        }
        if(A.bottom > B.top && A.top < B.bottom + (B.height/2)){
            temp.y = "down";
        }
        if(A.top > B.top){
            temp.y = "up";
        }

        return temp;
    }
    
    startEvent(gamaObjects, collisor){
        if(gamaObjects._collisionStatus == '3'){
            gamaObjects._collisionStatus = 'start';
            if(gamaObjects.startCollision != undefined) gamaObjects.startCollision(collisor);
        }else{
            gamaObjects._collisionStatus = 'stay';
            if(gamaObjects.stayCollision != undefined) gamaObjects.stayCollision(collisor);
        }
    }
    exitEvent(gamaObjects, collisor){
        gamaObjects._collisionStatus = '3';
        if(gamaObjects.exitCollision != undefined) gamaObjects.exitCollision(collisor);
    }
    
}   
