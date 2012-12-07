YUI.add('terrain-thing', function(Y) {

/**
 * 所有单位的原型
 * @module terrain
 * @submodule terrain-thing
 * 
 */



/**
 * 地形单位的基础类
 * @class Terrain.Thing
 */
var Thing = Terrain.Thing = function(){
    Thing.superclass.constructor.apply(this, arguments);
};


Thing.NAME = "Thing";

Thing.ATTRS = {
    param: {
        value: {}
    }
};

Y.extend(Thing, Y.Base, {
    initializer: function(opts){
        this.loaded = false;
        this._afterLoadFn = [];
        this._load(opts);   //部分派生类会用到此参数
    },
    
    
    _load: function(){
        var loader = new THREE.JSONLoader(),
            self = this,
            param = this.get('param');
        loader.load(param['path'], function(geometry){
            var obj = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: param['color']}) );
            obj.scale.set(param['scale'][0], param['scale'][1],param['scale'][2]);
            obj.position.set(param['position'][0], param['position'][1],param['position'][2]);
            obj.rotation.set(param['rotation'][0], param['rotation'][1],param['rotation'][2]);
            self.entity = obj;
            obj.unitInstance = self;
            self.loaded = true;
            self._afterLoadFn.forEach(function(fn){
                fn();
            });
        });
    },
    
    
    /**
     * 单位生成后执行函数fn，若单位已生成，则立刻执行fn
     * @method afterLoad
     * @param {Function} fn 
     */
    afterLoad: function(fn){
        if (this.loaded){
            fn();
        } else {
            this._afterLoadFn.push(fn);
        }
    },
    
    /**
     * 设置单位位置
     * @method setPos
     * @param {Number} x x坐标
     * @param {Number} y y坐标
     * @param {Number} z z坐标
     */
    setPos: function(x, y, z){
        this.entity.position.set(x, y, z);
    },
    destory: function(){
        this.obj.unitInstance = null;
        this.entity = null;
    }
});

}, '3.5.1');