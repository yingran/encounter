YUI.add('unit-block', function(Y) {

/**
 * 障碍测试模块
 * @module unit
 * @submodule unit-block
 * 
 */
    
/**
 * 障碍测试类
 * @class Unit.Block
 */
Unit.Block = Y.Base.create(
        
    'Unit.Block', //类名称
    
    Unit.Base,    //扩展自Unit
    
    [],
    
    {

    },
    
    {
        ATTRS: {
            param: {
                value: {
                    'path':'/encounter-action/res/model/stone.json?rnd='+Math.random(),
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