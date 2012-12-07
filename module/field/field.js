
YUI.add('field', function(Y) {

var WIDTH = 1200,
    HEIGHT = 800,
    VIEW_ANGLE = 75,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000,
    lastIntersect,
    selected = [];


var Field = function(){
    Field.superclass.constructor.apply(this, arguments);
};

Field.NAME = "Field";

Field.ATTRS = {
};

Y.extend(Field, Y.Base, {
    initializer: function(opts){
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.projector = new THREE.Projector();
        this.addCamera();
        this.addLight();
        this.renderer.setSize(WIDTH , HEIGHT);
        opts['container'].appendChild(this.renderer.domElement);
        this.initTerrain();
        this.initIntersectListener();
        this.motionUnits = [];
        Sys.field = this;
    },
    addCamera: function(){
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR); /* 摄像机视角，视口长宽比，近切面，远切面 */
        this.camera.position.set(0, 1000, 1000); //放置位置
        this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
        this.scene.add(this.camera);
    },
    addLight: function(){
        var light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(0, 0, 100).normalize();
        this.scene.add(light);
    },
    add: function(obj){//测试代码
        this.scene.add(obj);
        obj.unitInstance.anime&&this.motionUnits.push(obj.unitInstance);
    },
    initTerrain: function(opts){
        opts = opts ||{};
        opts['field'] = this;
        this.terrain = new Terrain(opts);
    },
    setMap: function(mapName){
        this.terrain.setMap(mapName);
    },
    clear: function(){
        var terrain = this.terrain;
        if(terrain){
            this.terrain = null;
            terrain.field = null;
            terrain.destory();
        }
    },
    initIntersectListener: function(){
        var mouse = this.mouse = {x:0, y:0},
            self = this;
        document.oncontextmenu = function(){    //删除右键菜单
            return false;
        };
        Y.one(document).on('mousedown', function(evt){
            evt.preventDefault();
            mouse.x = ( (evt.clientX-(window.innerWidth-WIDTH)/2) /WIDTH ) * 2 - 1;
            mouse.y = - ( evt.clientY / HEIGHT ) * 2 + 1;
            self.intersect(evt);
        }, false );
    },
    intersect: function(evt){
        var button = evt.button;
        
        if (button == 2){
            return;
        }
        var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
        this.projector.unprojectVector(vector, this.camera);

        var ray = new THREE.Ray(this.camera.position, vector.subSelf( this.camera.position ).normalize());

        var intersects = ray.intersectObjects(this.scene.children),
            currentIntersect;

        if (intersects.length == 0) {
            return;
        }
        
        currentIntersect = intersects[0].object;
        
        if (button == 1){
            if (!currentIntersect.unitInstance.get('selectable')){
                selected.forEach(function(item, index){
                    item.unitInstance.blur();
                });
                selected.length = 0;
                return;
            }
            /*
            if (currentIntersect.unitInstance.get('group') != 'my group'){  //选中单位不属于操作者
                selected.length = 0;
                selected.push(currentIntersect);
                currentIntersect.unitInstance.focus();
                return;
            }
            */
            if (evt.shiftKey){
                selected.push(currentIntersect);
                currentIntersect.unitInstance.focus();
                return;
            }
            selected.forEach(function(item, index){
                item.unitInstance.blur();
            });
            selected.length = 0;
            selected.push(currentIntersect);
            currentIntersect.unitInstance.focus();
            return;
        } else if (button == 3){
            /*
            if (selected.length == 0 || selected[0].unitInstance.get('group') != 'my group'){  //选中单位不属于操作者
                return;
            }
            */
            if (!currentIntersect.unitInstance.get('selectable')){
                selected.forEach(function(item, index){
                    item.unitInstance.motion({'type':'move', 'destination':intersects[0].point});
                });
            } else {
                if (selected[0].unitInstance.owner != currentIntersect.unitInstance.owner){
                    selected.forEach(function(item, index){
                        item.unitInstance.motion({'type':'attack', 'target':currentIntersect.unitInstance});
                    });
                }
            }
        }
/**
        currentIntersect = intersects[0].object;

        if (button == 1){   //左键
            if (lastIntersect == currentIntersect){
                lastIntersect.unitInstance.blur();
                lastIntersect = null;
                return;
            }
            if (currentIntersect.unitInstance.get('selectable')){
                lastIntersect&&lastIntersect.unitInstance.blur();
                lastIntersect = currentIntersect;
                lastIntersect.unitInstance.focus();
                return;
            } else {
                lastIntersect&&lastIntersect.unitInstance.blur();
                lastIntersect = null;
            }
        } else if (button == 3){    //右键
            if (!lastIntersect || lastIntersect == currentIntersect){
                return;
            }
            if (!currentIntersect.unitInstance.get('selectable')){
                lastIntersect.unitInstance.motion({'type':'move', 'destination':intersects[0].point});
            } else {
                if (lastIntersect.unitInstance.get('group') != currentIntersect.unitInstance.get('group')){
                    lastIntersect.unitInstance.motion({'type':'attack', 'target':currentIntersect.unitInstance});
                }
            }
        }
*/
        
    },
    anime: function(){
        var self = this;
        function anime(){
            self.motionUnits.forEach(function(unit){
                unit.anime();
            });
            self.renderer.render(self.scene, self.camera); //开始渲染
            return requestAnimationFrame(anime);
        }
        anime();
    }
});




window.Field = Field;

}, '3.5.1' ,{requires:['base']});