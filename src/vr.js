const THREE = require('./modules/three');
window.THREE = THREE;
require('./modules/three/examples/js/effects/VREffect');
require('./modules/three/examples/js/controls/VRControls');
const ThreeViveController = require('./modules/three-vive-controller');
const ViveController = ThreeViveController(THREE, 'http://10.0.0.6:3000/src/modules/three-vive-controller/');
require('./modules/three/examples/js/controls/OrbitControls');

const {navigator, document, VRDisplay} = window;

// start

// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};

const start = () => {
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

  const planeMesh = (() => {
    const geometry = new THREE.PlaneBufferGeometry(100, 100, 100, 100);
    const mesh = new THREE.Mesh(geometry, material2);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  })();
  scene.add(planeMesh);

  const swordMesh = (() => {
    const mesh = new THREE.Object3D();

    const geometry1 = new THREE.PlaneBufferGeometry(0.1, 0.9, 1, 9);
    geometry1.applyMatrix(new THREE.Matrix4().makeRotationX(-(Math.PI / 2)));
    geometry1.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    geometry1.applyMatrix(new THREE.Matrix4().makeTranslation(0, -(0.1 / 2), -(0.9 / 2)));
    const mesh1 = new THREE.Line(geometry1, material3);
    mesh.add(mesh1);

    const geometry2 = new THREE.BufferGeometry(0.1, 1, 1, 9);
    geometry2.addAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0, 0, -0.9,
      0, 0, -1.0,
      0, -0.1, -0.9,
    ]), 3));
    const mesh2 = new THREE.Line(geometry2, material3);
    mesh.add(mesh2);

    const geometry3 = new THREE.BufferGeometry().fromGeometry(new THREE.SphereGeometry(0.1, 5, 5));
    geometry3.computeVertexNormals();
    const mesh3 = new THREE.Mesh(geometry3, material2);
    mesh.add(mesh3);

    const geometry4 = new THREE.BufferGeometry().fromGeometry(makePyramidGeometry(0, 0, 0, 0.05));
    geometry4.computeVertexNormals();
    const mesh4 = new THREE.Mesh(geometry4, material);
    mesh4.position.z = -1;
    mesh4.position.y = -(0.05 * 0.1);
    mesh4.rotation.x = -(Math.PI / 2) + 0.1;
    mesh.add(mesh4);

    const rootGeometry = new THREE.Geometry();
    rootGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));
    const rootMesh = new THREE.Points(rootGeometry, material4);
    mesh.add(rootMesh);
    mesh.rootMesh = rootMesh;

    const tipGeometry = new THREE.Geometry();
    tipGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));
    const tipMesh = new THREE.Points(tipGeometry, material4);
    tipMesh.position.z = -1;
    mesh1.add(tipMesh);
    mesh.tipMesh = tipMesh;

    return mesh;
  })();
  scene.add(swordMesh);

  const gunMesh = (() => {
    const mesh = new THREE.Object3D();

    const geometry1 = new THREE.Geometry();
    geometry1.vertices.push(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -0.2 ));
    const mesh1 = new THREE.Line(geometry1, material3);
    mesh1.rotation.x = -(Math.PI * 0.3);
    mesh.add(mesh1);

    const rootGeometry = new THREE.Geometry();
    rootGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));
    const rootMesh = new THREE.Points(rootGeometry, material4);
    mesh.add(rootMesh);
    mesh.rootMesh = rootMesh;

    const tipGeometry = new THREE.Geometry();
    tipGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));
    const tipMesh = new THREE.Points(tipGeometry, material4);
    tipMesh.position.z = -1;
    mesh.add(tipMesh);
    mesh.tipMesh = tipMesh;

    const barrelGeometry = new THREE.Geometry();
    barrelGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));
    const barrelMesh = new THREE.Points(barrelGeometry, material4);
    barrelMesh.position.z = -0.2;
    mesh1.add(barrelMesh);
    mesh.barrelMesh = barrelMesh;

    return mesh;
  })();
  scene.add(gunMesh);

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

  const menuMesh = (() => {
    const numSlices = 3;
    const radius = 0.5;
    const innerRadius = 0.2;

    const mesh = new THREE.Object3D();
    mesh.visible = false;
    mesh.numSlices = numSlices;
    mesh.radius = radius;
    mesh.innerRadius = innerRadius;

    const uiMesh = (() => {
      const mesh = new THREE.Object3D();
      mesh.position.z = -1.5;

      const geometry = (() => {
        const result = new THREE.BufferGeometry();

        // const innerDistance = innerRadius / Math.sqrt(Math.pow(innerRadius, 2) + Math.pow(innerRadius, 2));
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

        return result;
      })();

      const solidMesh = new THREE.Mesh(geometry, material5);
      mesh.add(solidMesh);
      mesh.solidMesh = solidMesh;

      const wireframeMesh = new THREE.Mesh(geometry, material2);
      mesh.add(wireframeMesh);

      return mesh;
    })();
    mesh.add(uiMesh);
    mesh.uiMesh = uiMesh;

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
    const centersMesh = new THREE.Points(centersGeometry, material4);
    uiMesh.add(centersMesh);

    const rootGeometry = new THREE.Geometry();
    rootGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));
    const rootMesh = new THREE.Points(rootGeometry, material4);
    uiMesh.add(rootMesh);
    mesh.rootMesh = rootMesh;

    const normalGeometry = new THREE.Geometry();
    normalGeometry.vertices.push(new THREE.Vector3( 0, 0, 0 ));
    const normalMesh = new THREE.Points(normalGeometry, material4);
    normalMesh.position.z = 1;
    uiMesh.add(normalMesh);
    mesh.normalMesh = normalMesh;

    return mesh;
  })();
  scene.add(menuMesh);

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

    const controller0 = new ViveController(0, controls);
    scene.add(controller0);
    result.controller0 = controller0;

    const controller1 = new ViveController(1, controls);
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

  navigator.getVRDisplays()
    .then(ds => {
      console.log(ds);
      const d = ds.find(d => d instanceof VRDisplay);

      d.requestPresent([{
        source: renderer.domElement
      }])
        .then(() => {
          console.log('-------------------------------------------------- present --------------------------------------------------------');

          controllersMesh.controller0.on('TriggerClicked', e => {
            const {position, quaternion, scale} = getMatrixWorld(swordMesh.tipMesh);

            const positionAttribute = pointsMesh.geometry.getAttribute('position');
            const positionArray = positionAttribute.array;
            positionArray[0] = position.x;
            positionArray[1] = position.y;
            positionArray[2] = position.z;
            positionAttribute.needsUpdate = true;
          });
          controllersMesh.controller0.on('Gripped', e => {
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
          });
          controllersMesh.controller0.on('Ungripped', e => {
            menuMesh.visible = false;
          });
          controllersMesh.controller1.on('PadUnpressed', e => {
            if (teleportMesh.visible) {
              positionOffset = teleportMesh.position.clone();
            }
          });
          let shootFrame = null;
          controllersMesh.controller1.on('TriggerClicked', e => {
            const positionAttribute = pointsMesh.geometry.getAttribute('position');
            const positionArray = positionAttribute.array;

            function getPosition(x, y, z) {
              return new THREE.Vector3(
                positionArray[3],
                positionArray[4],
                positionArray[5]
              );
            }
            function setPosition(x, y, z) {
              positionArray[3] = x;
              positionArray[4] = y;
              positionArray[5] = z;
              positionAttribute.needsUpdate = true;
            }

            const rootMatrixWorld = getMatrixWorld(gunMesh.rootMesh);
            const barrelMatrixWorld = getMatrixWorld(gunMesh.barrelMesh);
            const ray = barrelMatrixWorld.position.clone().sub(rootMatrixWorld.position);

            setPosition(barrelMatrixWorld.position.x, barrelMatrixWorld.position.y, barrelMatrixWorld.position.z);

            function recurseBullet() {
              const localShootFrame = shootFrame = d.requestAnimationFrame(() => {
                if (localShootFrame === shootFrame) {
                  const oldPosition = getPosition();
                  const speed = 0.5;
                  setPosition(
                    oldPosition.x + (ray.x * speed),
                    oldPosition.y + (ray.y * speed),
                    oldPosition.z + (ray.z * speed)
                  );

                  recurseBullet();
                }
              });
            }
            recurseBullet();
          });

          var stats = new Stats();
          stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
          document.body.appendChild( stats.dom );

          let lastTime = Date.now();
          function recurseRender() {
            d.requestAnimationFrame(() => {
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
                controller.update(positionOffset); // XXX update(positionOffset) support was hacked in
              });

              // update sword
              (() => {
                const {position, quaternion, scale} = getMatrixWorld(controllersMesh.controller0);
                swordMesh.position.x = position.x;
                swordMesh.position.y = position.y;
                swordMesh.position.z = position.z;
                swordMesh.quaternion.x = quaternion.x;
                swordMesh.quaternion.y = quaternion.y;
                swordMesh.quaternion.z = quaternion.z;
                swordMesh.quaternion.w = quaternion.w;
              })();

              // update gun
              (() => {
                const {position, quaternion, scale} = getMatrixWorld(controllersMesh.controller1);
                gunMesh.position.x = position.x;
                gunMesh.position.y = position.y;
                gunMesh.position.z = position.z;
                gunMesh.quaternion.x = quaternion.x;
                gunMesh.quaternion.y = quaternion.y;
                gunMesh.quaternion.z = quaternion.z;
                gunMesh.quaternion.w = quaternion.w;
              })();

              // update menu targeting
              (() => {
                const positionAttribute = pointsMesh.geometry.getAttribute('position');
                const positionArray = positionAttribute.array;
                function setPosition(x, y, z) {
                  positionArray[6] = x;
                  positionArray[7] = y;
                  positionArray[8] = z;
                  positionAttribute.needsUpdate = true;
                }

                if (menuMesh.visible) {
                  const rootMatrixWorld = getMatrixWorld(swordMesh.rootMesh);
                  const tipMatrixWorld = getMatrixWorld(swordMesh.tipMesh);
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
                    setPosition(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z);

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
                    
                    menuMesh.uiMesh.solidMesh.geometry.setSliceColor(shortestSliceDistanceIndex, 0xca2a19);
                  }
                } else {
                  setPosition(0, 0, 0);
                }
              })();

              // update teleport targeting
              (() => {
                const rootMatrixWorld = getMatrixWorld(gunMesh.rootMesh);
                const tipMatrixWorld = getMatrixWorld(gunMesh.tipMesh);
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
                d.submitFrame(pose);
              }

              lastTime = now;

              stats.end();

              recurseRender();
            });
          }
          recurseRender();
        })
        .catch(err => {
          console.warn(err);
        });
    })
    .catch(err => {
      console.warn(err);
    });
};

start();
