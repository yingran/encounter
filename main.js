
YUI_config = {
    filter:'raw',
    groups: {
        sys: {
            base: 'module/sys/',
            modules: {
                'sys-base': {
                    path: 'base.js',
                    requires: ['base'],
                    skinnable: false
                }
                // other modules here
            }
        },
        unit: {
            base: 'module/unit/',
            modules: {
                'unit-base': {
                    path: 'base.js',
                    requires: ['base'],
                    skinnable: false
                },
                'unit-test': {
                    path: 'test.js',
                    requires: ['base', 'unit-base'],
                    skinnable: false
                },
                'unit-ground': {
                    path: 'ground.js',
                    requires: ['base', 'unit-base'],
                    skinnable: false
                },
                'unit-block': {
                    path: 'block.js',
                    requires: ['base', 'unit-base'],
                    skinnable: false
                }
            }
        },
        field: {
            base: 'module/field/',
            modules: {
                'field-base': {
                    path: 'base.js',
                    requires: ['base'],
                    skinnable: false
                }
                // other modules here
            }
        },
        terrain: {
            base: 'module/terrain/',
            modules: {
                'terrain-base': {
                    path: 'base.js',
                    requires: ['base'],
                    skinnable: false
                },
                'terrain-brick': {
                    path: 'brick.js',
                    requires: ['base'],
                    skinnable: false
                }
                // other modules here
            }
        }
        // other groups here
    }
};
YUI().use('node','field-base', 'unit-ground', 'unit-test', 'unit-block', 'terrain-base', 'terrain-brick', function(Y){
    var field = new Field({
        'container': Y.one('#field')
    });
    field.setMap('chaos');
    field.on('anime', function(evt){
        //alert('hihi');
    });
    field.anime();
});