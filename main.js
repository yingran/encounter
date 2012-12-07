
YUI_config = {
    filter:'raw',
    groups: {
        sys: {
            base: 'module/sys/',
            modules: {
                'sys': {
                    path: 'sys.js',
                    requires: ['base'],
                    skinnable: false
                }
                // other modules here
            }
        },
        unit: {
            base: 'module/unit/',
            modules: {
                'unit': {
                    path: 'unit.js',
                    requires: ['base'],
                    skinnable: false
                },
                'unit-mobile': {
                    path: 'unit-mobile.js',
                    requires: ['base', 'unit'],
                    skinnable: false
                }
            }
        },
        field: {
            base: 'module/field/',
            modules: {
                'field': {
                    path: 'field.js',
                    requires: ['base'],
                    skinnable: false
                }
                // other modules here
            }
        },
        terrain: {
            base: 'module/terrain/',
            modules: {
                'terrain': {
                    path: 'terrain.js',
                    requires: ['base'],
                    skinnable: false
                },
                'terrain-brick': {
                    path: 'terrain-brick.js',
                    requires: ['base'],
                    skinnable: false
                },
                'terrain-thing': {
                    path: 'terrain-thing.js',
                    requires: ['base', 'terrain'],
                    skinnable: false
                },
                'terrain-ground': {
                    path: 'terrain-ground.js',
                    requires: ['base', 'terrain', 'terrain-thing'],
                    skinnable: false
                },
                'terrain-block': {
                    path: 'terrain-block.js',
                    requires: ['base', 'terrain', 'terrain-thing'],
                    skinnable: false
                }
            }
        },
        player: {
            base: 'module/player/',
            modules: {
                'player': {
                    path: 'player.js',
                    requires: ['base'],
                    skinnable: false
                }
                // other modules here
            }
        }
        // other groups here
    }
};
YUI().use('node', 'sys', 'field', 'unit-mobile', 'terrain', 'terrain-brick', 'terrain-ground', 'terrain-block', 'player', function(Y){
    var field = new Field({
        'container': Y.one('#field')
    });
    field.setMap('chaos');
    field.anime();
    var player = new Player({
        'id': 0,
        'group': 0
    });
    player.addUnit('Mobile',{
        'pos': {x:40, y:0, z:50}
    });
});