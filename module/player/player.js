YUI.add('player', function(Y) {

/**
 * 游戏者类
 * @module player
 * @submodule player
 * 
 */

var mark = 1;

/**
 * 游戏者基础类
 * @class Player
 */
var Player = function(){
    Player.superclass.constructor.apply(this, arguments);
};


Player.NAME = "Player";

Player.ATTRS = {
};

Y.extend(Player, Y.Base, {
    initializer: function(opts){
        this.id = opts['id'];
        this.group = opts['group'];
        this.color = Sys.config.PLAYER_COLOR[opts['id']];
    },
    
    addUnit: function(clsName, opts){
        var self = this;
        new Unit[clsName]({
            'id': Math.random(),
            'owner': self.id,
            //'pos': {x:50, y:0, z:50},
            'pos': opts['pos']
        });
    },
    
    destory: function(){
    }
});

window.Player = Player;

}, '3.5.1');