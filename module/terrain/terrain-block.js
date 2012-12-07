YUI.add('terrain-block', function(Y) {

/**
 * 障碍测试模块
 * @module terrain
 * @submodule terrain-block
 * 
 */
    
/**
 * 障碍测试类
 * @class Terrain.Block
 */
Terrain.Block = Y.Base.create(
        
    'Terrain.Block', //类名称
    
    Terrain.Thing,    //扩展自Terrain.Thing
    
    [],
    
    {

    },
    
    {
        ATTRS: {
            param: {
                value: {
                    'path':'res/model/stone.json?rnd='+Math.random(),
                    'color': 0xcccc00,
                    'scale': [2, 2, 2],
                    'position': [0, 1, 0],
                    'rotation': [0, 0, 0]
                },
                readOnly: true
            },
            selectable: {
                value: false,
                readOnly: true
            }
        }
    }
);

}, '3.5.1');