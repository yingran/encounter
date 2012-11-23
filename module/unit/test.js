YUI.add('unit-test', function(Y) {

/**
 * 单位测试模块
 * @module unit
 * @submodule unit-test
 * 
 */
    
var MOTION_STOP = 0,
    MOTION_MOVE = 1,
    MOTION_ROTATE = 2,
    MOTION_ATTACK = 3;
    
/**
 * 单位测试类
 * @class Unit.Test
 */
Unit.Test = Y.Base.create(
        
    'Unit.Test', //类名称
    
    Unit.Base,    //扩展自Unit
    
    [],
    
    {
        
        /**
         * 选中单位
         * @method focus
         */
        focus: function(){
            this.entity.material.color.setHex(0xff0000);
        },
        
        /**
         * 单位失焦
         * @method blur 
         */
        blur: function(){
            this.entity.material.color.setHex(0xcccccc);
        },
        motion: (function(){
            var v1 = new THREE.Vector3(0, 0, 0),
                v2 = new THREE.Vector3(0, 0, 1);
            return function(param){
                var pos = this.getPos();
                switch (param['type']){
                    case 'move':
                        var motionList = this.get('_motion'),
                            destination, x, z, l,
                            i, radian,
                            speed = this.get('speed'),
                            route = this.getRoute(param['destination']),
                            rlen;
                        route.push(param['destination']);
                        rlen = route.length;
                        motionList.length = 0;
                        for (i=0; i<rlen; i++){
                            destination = {
                                x: route[i]['x'],
                                y: route[i]['y'],
                                z: route[i]['z']
                            };
                            x = destination['x']-pos['x'];
                            z = destination['z']-pos['z'];
                            l = Math.sqrt((x*x+z*z));
                            v1.set(x, 0, z);
                            radian = Math.acos(v1.dot(v2)/Math.abs(l));
                            if (x<0){
                                radian = -radian;
                            }
                            destination.speedX = speed*x/l;
                            destination.speedZ = speed*z/l;

                            motionList.push([{
                                'type': MOTION_MOVE, 'destination':destination, complete: false, primary: true
                            },{
                                'type': MOTION_ROTATE, 'destination': {x:0, y:radian, z:0}, complete: false
                            }]);

                            pos = destination;
                        }
                        break;
                    case 'attack':
                        break;
                }
            }
        })(),
        move: function(motion){
            var speed = this.get('speed'),
                destination = motion['destination'],
                pos = this.getPos();
            if (Math.abs(destination['x']-pos['x'])<=speed*1.5&&Math.abs(destination['z']-pos['z'])<=speed*1.5){
                motion['complete']=true;
                return;
            }
            this.setPos(pos['x']+destination.speedX, pos['y'], pos['z']+destination.speedZ);
        },
        rotate: function(motion){
            var rotateSpeed = this.get('rotateSpeed'),
                rotationY = this.entity.rotation['y']%(Math.PI*2),
                destination = motion['destination'],
                destinationY = destination['y'],
                diffY = destinationY - rotationY,
                absDiffY = Math.abs(diffY);
            diffY = absDiffY>Math.PI?diffY/absDiffY*(Math.PI*2-absDiffY):diffY;
            if (Math.abs(diffY)<=rotateSpeed){
                this.entity.rotation.setY(destinationY);
                motion['complete']=true;
                return;
            }

            if ((diffY<0&&diffY>-Math.PI)||diffY>Math.PI){
                rotateSpeed = -rotateSpeed;
            }

            if (Math.abs(rotationY)>Math.PI/2&&Math.abs(destinationY)>Math.PI/2&&destinationY/rotationY<0){
                rotateSpeed = -rotateSpeed;
            }

            rotationY = rotationY+rotateSpeed;
            this.entity.rotation.setY(rotationY);
            
        },
        anime: function(){
            var motionList = this.get('_motion'),
                motions = motionList[0],
                len;
            if (!motions||!motions[0]){
                return;
            }
            len = motions.filter(this.execMotion, this).length;
            if (len == motions.length || (motions[0]['primary']&&motions[0]['complete'])){
                motionList.shift();
            }

        },
        execMotion: function(motion, index, list){
            switch (motion['type']){
                case MOTION_MOVE:
                    this.move(motion);
                    break;
                case MOTION_ROTATE:
                    this.rotate(motion);
                    break;
            }
            if (motion['complete']){
                return true;
            }
            return false;
        },

        /**
         * 获取到达目标地点的可行路线
         * @param {Object}destination 目标地点
         *     @param {Number} destination.x
         *     @param {Number} destination.y
         *     @param {Number} destination.z
         * @return {Array} 移动序列
         */
        getRoute: function(destination){
            var terrain = Terrain.entity,
                start = this.getPos();
            return terrain.getRoute(start, destination);
        }
    },
    
    {
        ATTRS: {
            param: {
                value: {
                    'path':'/encounter-action/res/model/test.json',
                    'color': 0xcccccc,
                    'scale': [0.5, 1, 0.5],
                    'position': [0, 0, 0],
                    'rotation': [0, 0, 0]
                },
                readOnly: true
            },
            selectable: {
                value: true,
                readOnly: true
            },
            speed: {
                value: 0.3,
                readOnly: true
            },
            rotateSpeed: {
                value: 0.2,
                readOnly: true
            },
            _motion: {
                value: []
            }
        }
    }
);


}, '3.5.1');