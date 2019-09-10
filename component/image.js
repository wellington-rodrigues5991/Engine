class ImageManager{
    constructor(arg){
        this.indice = [];
        this.files = [];
        this.createCollisions = true;
    }
    add(file, name){
        var obj = {file: null, state: false};
        
        this.indice.push(name);
        this.files[this.indice.indexOf(name)] = obj;
        
        obj.file = new Image();
        obj.file.crossOrigin = 'anonymous';
        obj.file.src = file;
        //obj.file.setAttribute('crossOrigin', '');
        obj.file.onreadystatechange  = function(){
            this[1].files[this[0]].state = true;
        }.bind([this.indice.indexOf(name), this])
    }
    
    load(name, width, height){
        var target = this.files[this.indice.indexOf(name)],
            temp,
            file;
        
        this.mapPixels(width, height, 4, target);
        for(var i = 0; i < target.pixelMap.length; i++){
            if(target.pixelMap[i].size == width+'x'+height){
                temp = target.pixelMap[i].data;
                break;
            }
        }
        
        file = target.file;
        file.width = width;
        file.height = height;
        
        return {file: file, collider: temp};
    }
    
    mapPixels(width, height, resolution, target){
        var feito = false;
        if(target.pixelMap == undefined) target.pixelMap = [];
        else{
            var exist = false;
            var e = 0;
            var indice = 0;
            
            for(var i = 0; i < target.pixelMap.length; i++){
                if(target.pixelMap[i].size == width+'x'+height){
                    feito = true;
                    e = i
                    if(target.pixelMap[i].data.length > 0){
                        exist = true;
                        indice = i;
                        break;
                    }
                }
            }
            
            if(exist) return;
        }
        
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        var ctx = canvas.getContext("2d");
        ctx.drawImage(target.file, 0, 0, width, height);
        
        if(!feito){
            target.pixelMap.push({data: [], size:width+'x'+height});
            target = target.pixelMap[target.pixelMap.length-1].data;
        }
        else{
            var t;
            
            for(var i = 0; i < target.pixelMap.length; i++){
                if(target.pixelMap[i].size == width+'x'+height){t = target.pixelMap[i]}
            }
            target = t.data;
        }
        
        for(var y = 0; y < height; y=y+resolution){
            for(var x = 0; x < width; x=x+resolution){
                var pixel = ctx.getImageData(x, y, resolution, resolution);
                
                if(pixel.data[3] != 0){
                    target.push({x: x, y: y})
                }
            }
        }
    }
}
