YUI.add('unit-base', function(Y) {

/**
 * 所有单位的原型
 * @module unit
 * @submodule unit-base
 * 
 */


var Unit = {};


/**
 * 所有单位的基础类
 * @class Unit.Base
 */
Unit.Base = function(){
    Unit.Base.superclass.constructor.apply(this, arguments);
};


Unit.Base.NAME = "Unit.Base";

Unit.Base.ATTRS = {
    param: {
        value: {}
    }
};

Y.extend(Unit.Base, Y.Base, {
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
    
    /**
     * 获取单位位置
     * @method getPos
     * @return {Object} [pos] 单位坐标对象
     */
    getPos: function(){
        var pos = this.entity.position;
        return pos;
    },
    setScale: function(x, y, z){
        this.entity.scale.set(x, y, z);
    },
    motion: function(){
    },
    focus: function(){
    },
    blur: function(){
    },
    destory: function(){
        this.obj.unitInstance = null;
        this.entity = null;
    }
});

window.Unit = Unit;

}, '3.5.1');