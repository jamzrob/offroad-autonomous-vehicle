let gltf = null;
let mixer = null;
let clock = new THREE.Clock();
let controls;
let camera;

init();
animate();

function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();

    //let ambient = new THREE.AmbientLight( 0x101030 );
    let ambient = new THREE.AmbientLight( 0xdddddd );
    //scene.add( ambient );

    const light = new THREE.SpotLight(0xFFFFFF, 2, 100, Math.PI / 4, 8);
    light.position.set( 10, 25, 25 );
    light.castShadow = true;
    //scene.add(light);  // KHR_materials_unlit 拡張のテストの為、ライトをコメントアウト

    camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 10000 );
    camera.position.set(0, 3, 10);

    let geometry = new THREE.BoxGeometry(100, 5, 100);
    let material = new THREE.MeshLambertMaterial({
        color: "#707070"
    });

    //let ground = new THREE.Mesh(geometry, material);
    //ground.position.y -= 15;
    //ground.receiveShadow = true;
    //scene.add(ground);

    let manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    let loader = new THREE.GLTFLoader();
    loader.setCrossOrigin( 'anonymous' ); // r84 以降は明示的に setCrossOrigin() を指定する必要がある

    //THREE.DRACOLoader.setDecoderPath( 'https://cdn.rawgit.com/cx20/gltf-test/a63d4941/libs/three.js/r95dev/draco/gltf/' );
    loader.setDRACOLoader( new THREE.DRACOLoader() );

    let scale = 0.05;
    let url = "https://raw.githubusercontent.com/BabylonJS/Exporters/master/Maya/Samples/glTF%202.0/Penguin/penguin.gltf";

    loader.load(url, function (data) {
        gltf = data;
        let object = gltf.scene;
        object.scale.set(scale, scale, scale);
        //object.position.y = -5;
        //object.position.x = 4;
        object.castShadow = true;
        object.receiveShadow = true;

        let animations = gltf.animations;
        if ( animations && animations.length ) {
            mixer = new THREE.AnimationMixer( object );
            for ( let i = 0; i < animations.length; i ++ ) {
                let animation = animations[ i ];
                mixer.clipAction( animation ).play();
            }
        }
        scene.add(object);
    });

    let axis = new THREE.AxesHelper(1000);
    scene.add(axis);

    renderer = new THREE.WebGLRenderer();
    //renderer.setClearColor( 0xbfe4ff );
    renderer.setClearColor( 0x000000 );
    renderer.shadowMap.enabled = true;

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.userPan = false;
    controls.userPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.autoRotate = true;
    //controls.autoRotate = false;
    //controls.autoRotate = false;
    //controls.autoRotateSpeed = 2.0;
    controls.autoRotateSpeed = -2.0;

    renderer.setSize( width, height );
    renderer.gammaOutput = true;
    document.body.appendChild( renderer.domElement );
}

function animate() {
    requestAnimationFrame( animate );
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    render();
}

function render() {
    renderer.render( scene, camera );
}
