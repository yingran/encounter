YUI.add('terrain-ground', function(Y) {


/**
 * 地型模块
 * @module terrain
 * @submodule terrain-ground
 * 
 */


var RES_TERRAIN_PATH = 'res/texture/terrain/';


/**
 * 地型单位类
 * @class Terrain.Ground
 */
Terrain.Ground = Y.Base.create(
        
    'Terrain.Ground', //类名称
    
    Terrain.Thing,    //扩展自Terrain.Thing
    
    [],
    
    {
        _load: function(param){

            var planeSimple = new THREE.PlaneGeometry(param.width, param.height);
            var planeTesselated = new THREE.PlaneGeometry(param.width, param.height , 25, 40 );
            var matWire = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( RES_TERRAIN_PATH + 'dirt1.jpg' )});
            var matSolid = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture( RES_TERRAIN_PATH + 'dirt1.jpg' )});
            matSolid.color.setHSV( 0.1, 0.75, 1 );
            var ground = new THREE.Mesh( planeSimple, matSolid );
            ground.material.map.repeat.set( 20, 20 );
            ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
            ground.receiveShadow = true;
            ground.position.set(param.width/2, 0, param.height/2);
            ground.unitInstance = this;
            this.entity = ground;
            this.loaded = true;
            this._afterLoadFn.forEach(function(fn){
                fn();
            });
        },

        focus: function(){
            
        },

        blur: function(){
            
        }
    },
    
    {
        ATTRS: {
            selectable: {
                value: false,
                readOnly: true
            }
        }
    }
);

}, '3.5.1');