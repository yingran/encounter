
YUI.add('terrain', function(Y) {

/**
 * 地型类
 * @module terrain
 * @submodule terrain
 *
 */

var BRICK_WIDTH = 5;   //砖块宽度

var MAP_PATH = 'map/',
    RES_TERRAIN_PATH = 'res/texture/terrain/';


/**
 * 地型操作类
 * @class Terrain
 */
var Terrain = function(){
    Terrain.superclass.constructor.apply(this, arguments);
};

Terrain.NAME = "Terrain";

Terrain.ATTRS = {
};

Y.extend(Terrain, Y.Base, {
    initializer: function(opts){
        this.field = opts.field;
        this.map = opts.map;
        this.bricks = [];
        Sys.terrain = this;
    },


    /**
     * 获取地型数据文件
     * @method setMap
     * @param {String} name 地图名
     */
    setMap: function(name){
        var self = this;
        Y.io(MAP_PATH+name+'.json?rnd=' + Math.random(), {
            on:{
                success:function(id, xhr){
                    self.mapData = Y.JSON.parse(xhr.responseText);
                    self.initMap();
                } 
            }
        });
    },

    /**
     * 初始化地图相关数据
     * @method initMap
     */
    initMap: function(){
        var self = this,
            mapData = this.mapData,
            i, j, len1 = mapData.width/BRICK_WIDTH, len2 = mapData.height/BRICK_WIDTH,
            block, blockData, blocks = mapData['blocks'];
        this.field.add((new Terrain.Ground(mapData)).entity);
        this.center = {'x':mapData['width']/2, 'y':0, 'z': mapData['height']/2};
        this.field.camera.position.set(this.center.x, 40, this.center.z+40);

        for (i=0; i<len1; i++){
            this.bricks[i] = [];
            for (j=0; j<len2; j++){
                this.bricks[i][j] = {
                    'passable': true,
                    'pos': {
                        'x': (i+0.5)*BRICK_WIDTH,
                        'y': 0,
                        'z': (j+0.5)*BRICK_WIDTH
                    },
                    'x': i,
                    'y': 0,
                    'z': j
                };
            }
        }

        len1 = blocks.length;
        for (i=0; i<len1; i++){
            blockData = blocks[i];
            this.bricks[blockData['x']/BRICK_WIDTH][blockData['z']/BRICK_WIDTH]['passable'] = false;
            block = new Terrain.Block();
            block.afterLoad((function(block, x, z){
                return function(){
                    self.field.add(block.entity);
                    block.setPos(x+Math.ceil(BRICK_WIDTH/2), 0, z+Math.ceil(BRICK_WIDTH/2));
                };
            })(block, blockData['x'], blockData['z']));
        }

    },

    /**
     * 根据坐标获取此坐标所属砖块
     * @method getBrick
     * @param {Object}v
     */
    getBrick: function(v){
        var x = parseInt(v.x/BRICK_WIDTH),
            z = parseInt(v.z/BRICK_WIDTH);
        return this.bricks[x][z];
    },

    /**
     * 获取两点之间的可行最短路径
     * @method getRoute
     * @param {Object}v1
     * @param {Object}v2
     */
    getRoute: function(v1, v2){
        var opts = {
            hasRoute: false,
            olist: {},
            clist: {},
            start: new Terrain.Brick(this.getBrick(v1)),
            destination: new Terrain.Brick(this.getBrick(v2)),
            bricks: this.bricks
        };
        opts.start.setScore(0);
        opts.olist[opts.start.key] = opts.start;
        return getRoute(opts);
    }

});

var getRoute;
(function(){
    getRoute = function(opts){
        var brick, route=[],
            start = opts.start,
            destination = opts.destination,
            olist = opts.olist,
            clist = opts.clist,
            bricks = opts.bricks;
        while (!opts.hasRoute){
            AStar(opts);
        }
        if (!destination.parent){
            route = false;
            return route;
        }
        brick = destination.parent;
        while(brick.parent&&brick.parent!=start){
            if (brick.parent.pDir != brick.pDir){
                route.unshift(brick.parent.pos);
            }
            brick = brick.parent;
        }
        opts.hasRoute = true;
        return route;

    };
    function AStar(opts){
        var start = opts.start,
            destination = opts.destination,
            olist = opts.olist,
            clist = opts.clist,
            bricks = opts.bricks;
        if (olist.length == 0){
            opts.hasRoute = true;
            return true;
        }
        var pBrick = getMinimium(olist, clist),
            neighbour = getNeighbour(pBrick, bricks),
            i, len=neighbour.length,
            brick, key, item;
        for (i=0; i<len; i++){
            item = neighbour[i];
            key = item.x + '_' + item.z;
            if (key == destination.key){
                opts.hasRoute = true;
                destination.setParent(pBrick);
                //destination.parent = pBrick;
                return true;
            }
            if (olist[key] || clist[key]){
                continue;
            }
            brick = new Terrain.Brick(item);
            if (item.passable){
                olist[key] = brick;
                brick.setParent(pBrick);
                brick.calculateScore(start, destination);
            } else {
                clist[key] = brick;
            }
        }
/*
        neighbour.forEach(function(item, index){
            var brick, key = item.x + '-' + item.z;
            if (key == destination.key){
                return true;
            }
            if (olist[key] || clist[key]){
                return;
            }
            brick = new Terrain.Brick(this.getBrick(v2), start, destination);
            if (item.passable){
                olist[key] = brick;
                brick.parent = pBrick;
            } else {
                clist[key] = brick;
            }
        });
*/
    }

    function getNeighbour(brick, bricks){
        var neighbour = [],
            x = brick.x,
            z = brick.z,
            i, j;
        for (i=x-1; i<=x+1; i++){
            if (!bricks[i]){
                continue;
            }
            for (j=z-1; j<=z+1; j++){
                if (!bricks[i][j] || (i==x&&j==z)){
                    continue;
                }
                neighbour.push(bricks[i][j]);
            }
        }
        return neighbour;
    }

    function getMinimium(olist, clist){
        var min = Infinity, minBrick, minIndex;
        for (var key in olist){
            if (olist[key].score < min){
                minBrick = olist[key];
                min = olist[key].score;
            }
        }
        delete olist[minBrick.key];
        clist[minBrick.key] = minBrick;
        return minBrick;


        /*
        olist.forEach(function(item, index){
            if (brick.score < min){
                minBrick = item;
                min = item.score;
                minIndex = index;
            }
        });
        olist.splice(minIndex,1);
        olist.push(minBrick);
        return minBrick;
         */
    }
})();

window.Terrain = Terrain;

}, '3.5.1' ,{requires:['io','json-parse']});
    
