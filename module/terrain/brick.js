YUI.add('terrain-brick', function(Y){

/**
 * 地形内砖块类
 * @module terrain
 * @submodule terrain-brick
 *
 */
var Brick = Terrain.Brick = function(){
    Terrain.superclass.constructor.apply(this, arguments);
};

Brick.NAME = 'Terrain.Brick';

Brick.ATTRS = {
};

Y.extend(Brick, Y.Base, {
    initializer: function(opts){
        var pos = opts.pos
        this.x = opts.x;
        this.z = opts.z;
        this.pos = {
            x: pos.x,
            y: pos.y,
            z: pos.z
        };
        this.key = this.x + '_' + this.z;
    },

    /**
     * 计算此砖块分数
     * @method calculateScore
     * @param {Terrain.Brick}start 起点
     * @param {Terrain.Brick}destination 终点
     */
    calculateScore: function(start, destination){
        var parent = this.parent;
        if (!parent){
            return null;
        }
        this.score = Math.sqrt(Math.pow((this.pos.x-destination.pos.x), 2) + Math.pow((this.pos.z-destination.pos.z),2));
        this.score += Math.sqrt(Math.pow((this.pos.x-parent.pos.x), 2) + Math.pow((this.pos.z-parent.pos.z),2));
        this.score += parent.score;
    },

    /**
     * 设置分数
     * @method setSocre
     * @param {Number}score
     */
    setScore: function(score){
        this.score = score;
    },

    /**
     * @method setParent
     * @param {Terrain.Brick}parent
     */
    setParent: function(parent){
        this.parent = parent;
        this.pDir = (parent.x-this.x) + '_' + (parent.z-this.z);
    }
});



});