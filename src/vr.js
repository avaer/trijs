const THREE = require('./modules/three');
window.THREE = THREE;
require('./modules/three/examples/js/effects/VREffect');
require('./modules/three/examples/js/controls/VRControls');
const ThreeViveController = require('./modules/three-vive-controller');
const ViveController = ThreeViveController(THREE, '/src/modules/three-vive-controller/');
require('./modules/three/examples/js/controls/OrbitControls');

require('./modules/physijs/physi.js');
Physijs.scripts.worker = '/src/modules/physijs/physijs_worker.js';
Physijs.scripts.ammo = '/src/modules/physijs/ammo.js';

const {navigator, document, VRDisplay} = window;

// start

// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};

const start = () => {
  const vibrateIntensity = 0.5;
  const vibrateTime = 10;

  function makePyramidGeometry(x, y, z, s) {
    var geometry = new THREE.Geometry();

    // back
    geometry.vertices.push(new THREE.Vector3(x, y + s / 2, z));
    geometry.vertices.push(new THREE.Vector3(x - s / 2, y - s / 2, z + s / 2));
    geometry.vertices.push(new THREE.Vector3(x + s / 2, y - s / 2, z + s / 2));
    geometry.faces.push(new THREE.Face3(0, 1, 2));

    // left
    geometry.vertices.push(new THREE.Vector3(x, y + s / 2, z));
    geometry.vertices.push(new THREE.Vector3(x, y - s / 2, z - s / 2));
    geometry.vertices.push(new THREE.Vector3(x - s / 2, y - s / 2, z + s / 2));
    geometry.faces.push(new THREE.Face3(3, 4, 5));

    // right
    geometry.vertices.push(new THREE.Vector3(x, y + s / 2, z));
    geometry.vertices.push(new THREE.Vector3(x + s / 2, y - s / 2, z + s / 2));
    geometry.vertices.push(new THREE.Vector3(x, y - s / 2, z - s / 2));
    geometry.faces.push(new THREE.Face3(6, 7, 8));

    // bottom
    geometry.vertices.push(new THREE.Vector3(x, y - s / 2, z - s / 2));
    geometry.vertices.push(new THREE.Vector3(x + s / 2, y - s / 2, z + s / 2));
    geometry.vertices.push(new THREE.Vector3(x - s / 2, y - s / 2, z + s / 2));
    geometry.faces.push(new THREE.Face3(9, 10, 11));

    return geometry;
  }
  function getMatrixWorld(mesh) {
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    mesh.matrixWorld.decompose(position, quaternion, scale);

    return {
      position,
      quaternion,
      scale,
    };
  }
  function _colorHexToFloatArray(colorHex) {
    return [
      ((colorHex >> 16) & 0xFF) / 0xFF,
      ((colorHex >> 8) & 0xFF) / 0xFF,
      ((colorHex >> 0) & 0xFF) / 0xFF,
    ];
  }

  const scene = new THREE.Scene();

  const material = new THREE.MeshLambertMaterial({
    color: 0x40ff80,
    shading: THREE.FlatShading,
  });
  const material2 = new THREE.MeshBasicMaterial({
    color: 0x333333,
    wireframe: true,
    opacity: 0.5,
    transparent: true,
  });
  const material3 = new THREE.LineBasicMaterial({
    color: 0x808080,
  });
  const material4 = new THREE.PointsMaterial({
    color: 0x333333,
    size: 0.025,
  });
  const material5 = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    // shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors,
  });

  const sphereMesh = (() => {
    const result = new THREE.Object3D();

    const geometry = new THREE.BufferGeometry().fromGeometry(new THREE.SphereGeometry(0.1, 6, 4));
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    result.add(mesh);

    const wireMesh = new THREE.Mesh(geometry, material2);
    result.add(wireMesh);

    result.position.y = 1.5;
    result.rotation.x = Math.PI / 2;
    result.rotation.y = Math.PI / 2;
    return result;
  })();
  scene.add(sphereMesh);

  const boxMesh = (() => {
    const result = new THREE.Object3D();
    result.position.y = 3;
    result.position.z = -2;

    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    // geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));

    const mesh = new THREE.Mesh(geometry, material);
    result.add(mesh);

    const wireMesh = new THREE.Mesh(geometry, material2);
    result.add(wireMesh);

    return result;
  })();
  scene.add(boxMesh);

  const gridMesh = (() => {
    const geometry = new THREE.PlaneBufferGeometry(100, 100, 100, 100);
    const mesh = new THREE.Mesh(geometry, material2);
    mesh.rotation.x = -(Math.PI / 2);
    return mesh;
  })();
  scene.add(gridMesh);

  const pointsMesh = (() => {
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0, 0, 0,
      0, 0, 0,
      0, 0, 0
    ]), 3));
    const mesh = new THREE.Points(geometry, material4);
    mesh.frustumCulled = false;
    return mesh;
  })();
  scene.add(pointsMesh);

  const teleportMesh = (() => {
    const geometry = new THREE.TorusBufferGeometry(0.5, 0.1, 3, 5, Math.PI * 2);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-(Math.PI / 2)));
    geometry.applyMatrix(new THREE.Matrix4().makeRotationY((1 / 20) * (Math.PI * 2)));
    const mesh = new THREE.Mesh(geometry, material2);
    return mesh;
  })();
  scene.add(teleportMesh);

  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  const light2 = new THREE.DirectionalLight(0xFFFFFF, 1);
  light2.position.set(-10, 10, 10);
  scene.add(light2);

  const camera = new THREE.PerspectiveCamera( 120, 1, 0.001, 1000 );
  let positionOffset = new THREE.Vector3(0, 0, 0);

  const renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( 0xffffff, 1);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  const effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  const controls = new THREE.VRControls(camera);
  controls.standing = true;

  const controllersMesh = (() => {
    const result = new THREE.Object3D();

    let shootFrame = null;
    const _makeController = id => {
      const controller = new ViveController(id, controls);

      const rootGeometry = new THREE.Geometry();
      rootGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));
      const rootMesh = new THREE.Points(rootGeometry, material4);
      rootMesh.visible = false;
      controller.add(rootMesh);
      controller.rootMesh = rootMesh;

          
      const tipGeometry = new THREE.Geometry();
      tipGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));
      const tipMesh = new THREE.Points(tipGeometry, material4);
      tipMesh.position.z = -1;
      tipMesh.visible = false;
      controller.add(tipMesh);
      controller.tipMesh = tipMesh;

      const menuMesh = _makeMenuMesh();
      controller.menuMesh = menuMesh;
      scene.add(menuMesh);

      const weaponMeshes = {};
      controller.weaponMeshes = weaponMeshes;
      const weaponMeshesList = [];
      controller.weaponMeshesList = weaponMeshesList;
      _makeWeaponMeshes().forEach(weaponMesh => {
         const {name, mesh} = weaponMesh;

         scene.add(mesh);

         controller.weaponMeshes[name] = mesh;
         controller.weaponMeshesList.push(mesh);
      });
      controller.weapon = null;
      controller.droppedWeapon = null;

      // update menu targeting
      controller.update = (oldUpdateFn => {
        return ({positionOffset}) => {
          oldUpdateFn({positionOffset});

          const positionAttribute = pointsMesh.geometry.getAttribute('position');
          const positionArray = positionAttribute.array;
          const _setPosition = (x, y, z) => {
            positionArray[6] = x;
            positionArray[7] = y;
            positionArray[8] = z;
            positionAttribute.needsUpdate = true;
          };

          if (controller.weapon) {
            const weaponMesh = controller.weaponMeshes[controller.weapon];
            const controllerMatrixWorld = getMatrixWorld(controller);

            weaponMesh.position.x = controllerMatrixWorld.position.x;
            weaponMesh.position.y = controllerMatrixWorld.position.y;
            weaponMesh.position.z = controllerMatrixWorld.position.z;

            weaponMesh.quaternion.x = controllerMatrixWorld.quaternion.x;
            weaponMesh.quaternion.y = controllerMatrixWorld.quaternion.y;
            weaponMesh.quaternion.z = controllerMatrixWorld.quaternion.z;
            weaponMesh.quaternion.w = controllerMatrixWorld.quaternion.w;

            weaponMesh.updateMatrixWorld(); 
          }

          if (menuMesh.visible) {
            const rootMatrixWorld = getMatrixWorld(controller.rootMesh);
            const tipMatrixWorld = getMatrixWorld(controller.tipMesh);
            const ray = tipMatrixWorld.position.clone().sub(rootMatrixWorld.position);
            const controllerLine = new THREE.Line3(
              rootMatrixWorld.position.clone(),
              rootMatrixWorld.position.clone().add(ray.clone().multiplyScalar(10))
            );
            const menuRootMatrixWorld = getMatrixWorld(menuMesh.rootMesh);
            const menuNormalMatrixWorld = getMatrixWorld(menuMesh.normalMesh);
            const menuNormal = menuNormalMatrixWorld.position.clone().sub(menuRootMatrixWorld.position);
            const menuPosition = menuRootMatrixWorld.position;
            const menuPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(menuNormal, menuPosition);
            const intersectionPoint = menuPlane.intersectLine(controllerLine);

            if (intersectionPoint) {
              _setPosition(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z);

              const sliceCenters = (() => {
                const {numSlices, innerRadius} = menuMesh;
                const result = Array(numSlices);
                for (let i = 0; i < numSlices; i++) {
                  const absoluteCenter = new THREE.Vector3(
                    -Math.sin((i / numSlices) * (Math.PI * 2)),
                    Math.cos((i / numSlices) * (Math.PI * 2)),
                    0
                  ).multiplyScalar(innerRadius);
                  const relativeCenter = absoluteCenter.clone().applyMatrix4(menuMesh.rootMesh.matrixWorld);
                  result[i] = relativeCenter;
                }
                return result;
              })();
              const sliceDistanceSpecs = sliceCenters.map((center, i) => {
                const distance = intersectionPoint.distanceTo(center);
                return {
                  center,
                  index: i,
                  distance,
                };
              });
              const sortedSliceDistanceSpecs = sliceDistanceSpecs.sort((a, b) => a.distance - b.distance);
              const shortestSliceDistanceSpec = sortedSliceDistanceSpecs[0];
              const shortestSliceDistanceIndex = shortestSliceDistanceSpec.index;
              const weaponIndex = shortestSliceDistanceIndex;
              
              menuMesh.uiMesh.solidMesh.geometry.setSliceColor(weaponIndex, 0xca2a19);

              const _setWeapon = newWeapon => {
                if (newWeapon) {
                  const {weapon: oldWeapon} = controller;
                  if (oldWeapon) {
                    const oldWeaponMesh = controller.weaponMeshes[oldWeapon];
                    oldWeaponMesh.visible = false;
                    controller.weapon = null;
                  }

                  const newWeaponMesh = controller.weaponMeshes[newWeapon];
                  newWeaponMesh.visible = true;
                  controller.weapon = newWeapon;
                }
              };

              const weapon = (() => {
                switch (weaponIndex) {
                  case 1: return 'gun';
                  case 2: return 'sword';
                  default: return null;
                }
              })();
              _setWeapon(weapon);
            }
          } /* else {
            _setPosition(0, 0, 0);
          } */
        };
      })(controller.update);

      controller.on('Gripped', e => {
        if (controller.droppedWeapon) {
          const droppedWeaponMesh = controller.weaponMeshes[controller.droppedWeapon];
          const {physicsMesh} = droppedWeaponMesh;
          physicsScene.remove(physicsMesh);

          controller.droppedWeapon = null;

          console.log('clear dropped weapon');
        }

        if (!controller.weapon) {
          const position = new THREE.Vector3();
          const quaternion = new THREE.Quaternion();
          const scale = new THREE.Vector3();
          camera.matrix.decompose(position, quaternion, scale);

          menuMesh.position.x = position.x;
          menuMesh.position.y = position.y;
          menuMesh.position.z = position.z;
          menuMesh.quaternion.x = quaternion.x;
          menuMesh.quaternion.y = quaternion.y;
          menuMesh.quaternion.z = quaternion.z;
          menuMesh.quaternion.w = quaternion.w;

          menuMesh.visible = true;

          console.log('open menu');
        }
      });
      controller.on('Ungripped', e => {
        if (menuMesh.visible) {
          menuMesh.visible = false;

          console.log('close menu');
        } else {
          const {weapon} = controller;
          if (weapon) {
            const weaponMesh = weaponMeshes[weapon];
            const {physicsMesh} = weaponMesh;

            physicsMesh.position.x = weaponMesh.position.x;
            physicsMesh.position.y = weaponMesh.position.y;
            physicsMesh.position.z = weaponMesh.position.z;
            physicsMesh.__dirtyPosition = true;

            physicsMesh.rotation.x = weaponMesh.rotation.x;
            physicsMesh.rotation.y = weaponMesh.rotation.y;
            physicsMesh.rotation.z = weaponMesh.rotation.z;
            physicsMesh.rotation.w = weaponMesh.rotation.w;
            physicsMesh.__dirtyRotation = true;

            physicsScene.add(physicsMesh);

            controller.weapon = null;
            controller.droppedWeapon = weapon;

            console.log('drop weapon', weapon);
          }
        }
      });
      controller.on('TriggerClicked', e => {
        if (controller.weapon === 'sword') {
          const {position, quaternion, scale} = getMatrixWorld(weaponMeshes.sword.tipMesh);

          const positionAttribute = pointsMesh.geometry.getAttribute('position');
          const positionArray = positionAttribute.array;
          positionArray[0] = position.x;
          positionArray[1] = position.y;
          positionArray[2] = position.z;
          positionAttribute.needsUpdate = true;

          controller.vibrate(vibrateIntensity, vibrateTime);
        } else if (controller.weapon === 'gun') {
          const positionAttribute = pointsMesh.geometry.getAttribute('position');
          const positionArray = positionAttribute.array;

          const _getPosition = (x, y, z) => {
            return new THREE.Vector3(
              positionArray[3],
              positionArray[4],
              positionArray[5]
            );
          };
          const _setPosition = (x, y, z) => {
            positionArray[3] = x;
            positionArray[4] = y;
            positionArray[5] = z;
            positionAttribute.needsUpdate = true;
          };

          const rootMatrixWorld = getMatrixWorld(weaponMeshes.gun.rootMesh);
          const barrelMatrixWorld = getMatrixWorld(weaponMeshes.gun.barrelMesh);
          const ray = barrelMatrixWorld.position.clone().sub(rootMatrixWorld.position);

          _setPosition(barrelMatrixWorld.position.x, barrelMatrixWorld.position.y, barrelMatrixWorld.position.z);

          const _recurseBullet = () => {
            if (display) {
              const localShootFrame = shootFrame = display.requestAnimationFrame(() => {
                if (localShootFrame === shootFrame) {
                  const oldPosition = _getPosition();
                  const speed = 0.5;
                  _setPosition(
                    oldPosition.x + (ray.x * speed),
                    oldPosition.y + (ray.y * speed),
                    oldPosition.z + (ray.z * speed)
                  );

                  _recurseBullet();
                }
              });
            }
          };
          _recurseBullet();

          controller.vibrate(vibrateIntensity, vibrateTime);
        }
      });

      return controller;
    };

    const _makeWeaponMeshes = (() => {
      const weaponPhysicsMaterial = Physijs.createMaterial(
        material2,
        1, // friction
        0.1, // restitution
      );
      const weaponPhysicsMass = 1;

      const _makeSwordMesh = (() => {
        const geometry1 = new THREE.PlaneBufferGeometry(0.1, 0.9, 1, 9);
        geometry1.applyMatrix(new THREE.Matrix4().makeRotationX(-(Math.PI / 2)));
        geometry1.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
        geometry1.applyMatrix(new THREE.Matrix4().makeTranslation(0, -(0.1 / 2), -(0.9 / 2)));

        const geometry2 = new THREE.BufferGeometry(0.1, 1, 1, 9);
        geometry2.addAttribute('position', new THREE.BufferAttribute(new Float32Array([
          0, 0, -0.9,
          0, 0, -1.0,
          0, -0.1, -0.9,
        ]), 3));

        const geometry3 = new THREE.BufferGeometry().fromGeometry(new THREE.SphereGeometry(0.1, 5, 5));
        geometry3.computeVertexNormals();

        const geometry4 = new THREE.BufferGeometry().fromGeometry(makePyramidGeometry(0, 0, 0, 0.05));
        geometry4.computeVertexNormals();

        const rootGeometry = new THREE.Geometry();
        rootGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));

        const tipGeometry = new THREE.Geometry();
        tipGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));

        return () => {
          const mesh = new THREE.Object3D();
          mesh.visible = false;

          const mesh1 = new THREE.Line(geometry1, material3);
          mesh.add(mesh1);

          const mesh2 = new THREE.Line(geometry2, material3);
          mesh.add(mesh2);

          const mesh3 = new THREE.Mesh(geometry3, material2);
          mesh.add(mesh3);

          const mesh4 = new THREE.Mesh(geometry4, material);
          mesh4.position.z = -1;
          mesh4.position.y = -(0.05 * 0.1);
          mesh4.rotation.x = -(Math.PI / 2) + 0.1;
          mesh.add(mesh4);

          const rootMesh = new THREE.Points(rootGeometry, material4);
          mesh.add(rootMesh);
          mesh.rootMesh = rootMesh;

          const tipMesh = new THREE.Points(tipGeometry, material4);
          tipMesh.position.z = -1;
          mesh1.add(tipMesh);
          mesh.tipMesh = tipMesh;

          const physicsMesh = (() => {
            const geometry = new THREE.BoxGeometry(0.1, 0.1, 1);
            const mesh = new Physijs.BoxMesh(geometry, weaponPhysicsMaterial, weaponPhysicsMass);
            return mesh;
          })();
          mesh.physicsMesh = physicsMesh;

          return mesh;
        };
      })();

      const _makeGunMesh = (() => {
        const geometry1 = new THREE.Geometry();
        geometry1.vertices.push(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -0.2 ));

        const barrelGeometry = new THREE.Geometry();
        barrelGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));

        const rootGeometry = new THREE.Geometry();
        rootGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));

        const tipGeometry = new THREE.Geometry();
        tipGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));

        return () => {
          const mesh = new THREE.Object3D();
          mesh.visible = false;

          const mesh1 = new THREE.Line(geometry1, material3);
          mesh1.rotation.x = -(Math.PI * 0.3);
          mesh.add(mesh1);

          const barrelMesh = new THREE.Points(barrelGeometry, material4);
          barrelMesh.position.z = -0.2;
          mesh1.add(barrelMesh);
          mesh.barrelMesh = barrelMesh;

          const rootMesh = new THREE.Points(rootGeometry, material4);
          mesh.add(rootMesh);
          mesh.rootMesh = rootMesh;

          const tipMesh = new THREE.Points(tipGeometry, material4);
          tipMesh.position.z = -1;
          mesh.add(tipMesh);
          mesh.tipMesh = tipMesh;

          const physicsMesh = (() => {
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const mesh = new Physijs.BoxMesh(geometry, weaponPhysicsMaterial, weaponPhysicsMass);
            return mesh;
          })();
          mesh.physicsMesh = physicsMesh;

          return mesh;
        }
      })();

      return () => {
        const swordMesh = _makeSwordMesh();
        const gunMesh = _makeGunMesh();

        return [
          {
            name: 'sword',
            mesh: swordMesh,
          },
          {
            name: 'gun',
            mesh: gunMesh,
          },
        ];
      };
    })();

    const _makeMenuMesh = (() => {
      const numSlices = 3;
      const radius = 0.5;
      const innerRadius = 0.2;

      const _makeUiGeometry = ({colored = false} = {}) => {
        const result = new THREE.BufferGeometry();

        const numSegments = 3;
        const numTriangles = numSlices * numSegments * 3;

        const positions = new Float32Array(numTriangles * 3);
        for (let i = 0; i < numSlices; i++) {
          const thetaLength = 1 / numSlices;
          const thetaStart = (1 / 12) + (i / numSlices);
          const planeGeometry = new THREE.CircleGeometry(radius, numSegments, thetaStart * (Math.PI * 2), thetaLength * (Math.PI * 2));
          const {vertices, faces} = planeGeometry;
          for (let j = 0; j < numSegments; j++) {
            const face = faces[j];
            const va = vertices[face.a];
            const vb = vertices[face.b];
            const vc = vertices[face.c];

            positions[(i * (numSegments * 9)) + (j * 9) + 0] = va.x - (innerRadius * Math.sin((i / numSlices) * (Math.PI * 2)));
            positions[(i * (numSegments * 9)) + (j * 9) + 1] = va.y + (innerRadius * Math.cos((i / numSlices) * (Math.PI * 2)));
            positions[(i * (numSegments * 9)) + (j * 9) + 2] = va.z;

            positions[(i * (numSegments * 9)) + (j * 9) + 3] = vb.x - (innerRadius * Math.sin((i / numSlices) * (Math.PI * 2)));
            positions[(i * (numSegments * 9)) + (j * 9) + 4] = vb.y + (innerRadius * Math.cos((i / numSlices) * (Math.PI * 2)));
            positions[(i * (numSegments * 9)) + (j * 9) + 5] = vb.z;

            positions[(i * (numSegments * 9)) + (j * 9) + 6] = vc.x - (innerRadius * Math.sin((i / numSlices) * (Math.PI * 2)));
            positions[(i * (numSegments * 9)) + (j * 9) + 7] = vc.y + (innerRadius * Math.cos((i / numSlices) * (Math.PI * 2)));
            positions[(i * (numSegments * 9)) + (j * 9) + 8] = vc.z;
          }
        }
        result.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        result.computeVertexNormals();

        if (colored) {
          const colors = new Float32Array(numTriangles * 3);
          for (let i = 0; i < numTriangles; i++) {
            colors[(i * 3) + 0] = 1;
            colors[(i * 3) + 1] = 1;
            colors[(i * 3) + 2] = 1;
          }
          result.addAttribute('color', new THREE.BufferAttribute(colors, 3));

          result.setSliceColor = (sliceIndex, colorHex) => {
            const colorsAttribute = result.getAttribute('color');
            const colors = colorsAttribute.array;

            for (let i = 0; i < numTriangles; i++) {
              colors[(i * 3) + 0] = 1;
              colors[(i * 3) + 1] = 1;
              colors[(i * 3) + 2] = 1;
            }

            const colorFloatArray = _colorHexToFloatArray(colorHex);
            for (let i = 0; i < numSegments; i++) {
              colors[(sliceIndex * (numSegments * 9)) + (i * 9) + 0] = colorFloatArray[0];
              colors[(sliceIndex * (numSegments * 9)) + (i * 9) + 1] = colorFloatArray[1];
              colors[(sliceIndex * (numSegments * 9)) + (i * 9) + 2] = colorFloatArray[2];

              colors[(sliceIndex * (numSegments * 9)) + (i * 9) + 3] = colorFloatArray[0];
              colors[(sliceIndex * (numSegments * 9)) + (i * 9) + 4] = colorFloatArray[1];
              colors[(sliceIndex * (numSegments * 9)) + (i * 9) + 5] = colorFloatArray[2];

              colors[(sliceIndex * (numSegments * 9)) + (i * 9) + 6] = colorFloatArray[0];
              colors[(sliceIndex * (numSegments * 9)) + (i * 9) + 7] = colorFloatArray[1];
              colors[(sliceIndex * (numSegments * 9)) + (i * 9) + 8] = colorFloatArray[2];
            }

            colorsAttribute.needsUpdate = true;
          };
        }

        return result;
      };

      const centersGeometry = (() => {
        const result = new THREE.Geometry();
        for (let i = 0; i < numSlices; i++) {
          const absoluteCenter = new THREE.Vector3(
            -Math.sin((i / numSlices) * (Math.PI * 2)),
            Math.cos((i / numSlices) * (Math.PI * 2)),
            0
          ).multiplyScalar(innerRadius);
          result.vertices.push(absoluteCenter);
        }
        return result;
      })();

      const rootGeometry = new THREE.Geometry();
      rootGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));

      const normalGeometry = new THREE.Geometry();
      normalGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));

      return () => {
        const mesh = new THREE.Object3D();
        mesh.visible = false;
        mesh.numSlices = numSlices;
        mesh.radius = radius;
        mesh.innerRadius = innerRadius;

        const uiMesh = (() => {
          const mesh = new THREE.Object3D();
          mesh.position.z = -1.5;

          const solidUiGeometry = _makeUiGeometry({colored: true});
          const solidMesh = new THREE.Mesh(solidUiGeometry, material5);
          mesh.add(solidMesh);
          mesh.solidMesh = solidMesh;

          const wireframeUiGeometry = _makeUiGeometry();
          const wireframeMesh = new THREE.Mesh(wireframeUiGeometry, material2);
          mesh.add(wireframeMesh);

          return mesh;
        })();
        mesh.add(uiMesh);
        mesh.uiMesh = uiMesh;

        const centersMesh = new THREE.Points(centersGeometry, material4);
        uiMesh.add(centersMesh);

        const rootMesh = new THREE.Points(rootGeometry, material4);
        uiMesh.add(rootMesh);
        mesh.rootMesh = rootMesh;

        const normalMesh = new THREE.Points(normalGeometry, material4);
        normalMesh.position.z = 1;
        uiMesh.add(normalMesh);
        mesh.normalMesh = normalMesh;

        return mesh;
      };
    })();

    const controller0 = _makeController(0);
    scene.add(controller0);
    result.controller0 = controller0;

    const controller1 = _makeController(1);
    scene.add(controller1);
    result.controller1 = controller1;

    return result;
  })();
  scene.add(controllersMesh);

  function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize, true);
  window.addEventListener('vrdisplaypresentchange', onResize, true);

  let display = null;
  navigator.getVRDisplays()
    .then(ds => {
      console.log(ds);
      display = ds.find(d => d instanceof VRDisplay);

      display.requestPresent([{
        source: renderer.domElement
      }])
        .then(() => {
          console.log('-------------------------------------------------- present --------------------------------------------------------');

          controllersMesh.controller0.on('PadUnpressed', e => {
            boxPhysicsMesh.position.x = 0;
            boxPhysicsMesh.position.y = 3;
            boxPhysicsMesh.position.z = -2;
            boxPhysicsMesh.__dirtyPosition = true;

            boxPhysicsMesh.rotation.x = 0;
            boxPhysicsMesh.rotation.y = 0;
            boxPhysicsMesh.rotation.z = 0;
            boxPhysicsMesh.rotation.w = 0;
            boxPhysicsMesh.__dirtyRotation = true;

            /* boxPhysicsMesh.setLinearVelocity(0, 0, 0); // XXX
            boxPhysicsMesh.setAngularVelocity(0, 0, 0); */

            controllersMesh.controller0.vibrate(vibrateIntensity, vibrateTime);
          });
          controllersMesh.controller1.on('PadUnpressed', e => {
            if (teleportMesh.visible) {
              positionOffset = teleportMesh.position.clone();
            }
          });

          var stats = new Stats();
          stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
          document.body.appendChild( stats.dom );

          let lastTime = Date.now();
          const _recurseRender = () => {
            display.requestAnimationFrame(() => {
              stats.begin();

              const pose = controls.update(); // XXX returning the pose here was hacked in

              const now = Date.now();
              const timeDiff = now - lastTime;
              const rotationDiff = (timeDiff / 1000) * (0.5 * Math.PI / 2);

              // offset objects by player position
              camera.position.x += positionOffset.x;
              camera.position.y += positionOffset.y;
              camera.position.z += positionOffset.z;
              camera.updateMatrix();
              [ controllersMesh.controller0, controllersMesh.controller1 ].forEach(controller => {
                controller.update({positionOffset}); // XXX update({positionOffset}) support was hacked in, and it's additionally intercepted in the controller maker
              });

              // update teleport targeting
              (() => {
                const rootMatrixWorld = getMatrixWorld(controllersMesh.controller1.weaponMeshes.gun.rootMesh);
                const tipMatrixWorld = getMatrixWorld(controllersMesh.controller1.weaponMeshes.gun.tipMesh);
                const ray = tipMatrixWorld.position.clone().sub(rootMatrixWorld.position);
                const controllerLine = new THREE.Line3(
                  rootMatrixWorld.position.clone(),
                  rootMatrixWorld.position.clone().add(ray.clone().multiplyScalar(15))
                );
                const groundPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0));
                const intersectionPoint = groundPlane.intersectLine(controllerLine);

                if (intersectionPoint) {
                  teleportMesh.position.x = intersectionPoint.x;
                  teleportMesh.position.y = intersectionPoint.y;
                  teleportMesh.position.z = intersectionPoint.z;

                  teleportMesh.quaternion.x = 0;
                  teleportMesh.quaternion.y = rootMatrixWorld.quaternion.y;
                  teleportMesh.quaternion.z = 0;
                  teleportMesh.quaternion.w = rootMatrixWorld.quaternion.w;

                  if (!teleportMesh.visible) {
                    teleportMesh.visible = true;
                  }
                } else {
                  if (teleportMesh.visible) {
                    teleportMesh.visible = false;
                  }
                }
              })();

              // update rotating sphere
              sphereMesh.rotation.x = (sphereMesh.rotation.x + rotationDiff) % (Math.PI * 2);
              sphereMesh.rotation.y = (sphereMesh.rotation.y + rotationDiff) % (Math.PI * 2);

              effect.render(scene, camera);

              if (pose) {
                display.submitFrame(pose);
              }

              lastTime = now;

              stats.end();

              _recurseRender();
            });
          };
          _recurseRender();
        })
        .catch(err => {
          console.warn(err);
        });
    })
    .catch(err => {
      console.warn(err);
    });

  const physicsScene = new Physijs.Scene({
    fixedTimeStep: 1 / 90, // XXX
  });

  const _updatePhysics = () => {
    boxMesh.position.x = boxPhysicsMesh.position.x;
    boxMesh.position.y = boxPhysicsMesh.position.y;
    boxMesh.position.z = boxPhysicsMesh.position.z;
    boxMesh.quaternion.x = boxPhysicsMesh.quaternion.x;
    boxMesh.quaternion.y = boxPhysicsMesh.quaternion.y;
    boxMesh.quaternion.z = boxPhysicsMesh.quaternion.z;
    boxMesh.quaternion.w = boxPhysicsMesh.quaternion.w;

    [ controllersMesh.controller0, controllersMesh.controller1 ].forEach(controller => {
      if (controller.droppedWeapon) {
        const droppedWeaponMesh = controller.weaponMeshes[controller.droppedWeapon];
        const {physicsMesh} = droppedWeaponMesh;

        droppedWeaponMesh.position.x = physicsMesh.position.x;
        droppedWeaponMesh.position.y = physicsMesh.position.y;
        droppedWeaponMesh.position.z = physicsMesh.position.z;
        droppedWeaponMesh.quaternion.x = physicsMesh.quaternion.x;
        droppedWeaponMesh.quaternion.y = physicsMesh.quaternion.y;
        droppedWeaponMesh.quaternion.z = physicsMesh.quaternion.z;
        droppedWeaponMesh.quaternion.w = physicsMesh.quaternion.w;
      }
    });

    _recursePhysics();
  };
  const _recursePhysics = () => {
    physicsScene.simulate();
  };
  physicsScene.addEventListener('update', _updatePhysics);

  const floorPhysicsMesh = (() => {
    const floorPhysicsGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    const floorPhysicsMaterial = Physijs.createMaterial(
      material2,
      1, // friction
      0.1, // restitution
    );

    const physicsMesh = new Physijs.PlaneMesh(floorPhysicsGeometry, floorPhysicsMaterial, 0);
    physicsMesh.rotation.x = -(Math.PI / 2);

    return physicsMesh;
  })();
  physicsScene.add(floorPhysicsMesh);

  const boxPhysicsMesh = (() => {
    const boxPhysicsGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxPhysicsMaterial = Physijs.createMaterial(
      material2,
      1, // friction
      0.1, // restitution
    );
    const physicsMesh = new Physijs.BoxMesh(boxPhysicsGeometry, boxPhysicsMaterial, 1);
    physicsMesh.position.x = boxMesh.position.x;
    physicsMesh.position.y = boxMesh.position.y;
    physicsMesh.position.z = boxMesh.position.z;
    physicsMesh.__dirtyPosition = true;

    return physicsMesh;
  })();
  physicsScene.add(boxPhysicsMesh);

  _recursePhysics();
};

start();
