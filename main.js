  import * as THREE from "three";
  import { SplatMesh, SplatLoader} from "@sparkjsdev/spark";
  import ZenEsti from "https://david-168.github.io/ZenLib/ZenLib.js";

  const scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement)

  var videoElement;
  var solutionOptions;
  
        
  const ZenEst = new ZenEsti();

  function initMediaPipe() {
      console.log("Script loaded V67");
  
      console.log("Init Tag000");
  
  
      const PPI = 460;//460; // real screen PPI
  
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;
      console.log("Inner",cssWidth + " x " + cssHeight + " pixels");
  
      const ratio = window.devicePixelRatio;
      console.log("ratio",ratio);
  
      const physicalWidth = cssWidth * ratio;
      const physicalHeight = cssHeight * ratio;
  
      console.log("physicalHeight",physicalWidth + " x " + physicalHeight + " pixels");
      const widthInches = physicalWidth / PPI;
      const heightInches = physicalHeight / PPI;
  
      console.log("Window physical size:");
      console.log(widthInches + " x " + heightInches + " inches");
  
      console.log(widthInches + " x " + heightInches + " inches");
  
      console.log("Screen width:", screen.width,":", screen.height, " pixels");
  
      console.log("Visual Viewport width:", window.visualViewport?.width,":", window.visualViewport?.height, " pixels");
  
      const mpFaceMesh = window;
  
  
      //var camera;//virtual camera (=view point)
      const config = { locateFile: (file) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@` +
                  `${mpFaceMesh.VERSION}/${file}`;
          } };
              console.log("Init Tag001");
      // Our input frames will come from here.
          videoElement = document.getElementsByClassName('input_video')[0];
          console.log("Init Tag00",videoElement);
          console.log("Init Tag000");
  
          scene.addEventListener('loaded', () => {
              console.log("Loaded  Tag0 ");
              console.log("Loaded  Tag1 ");
          
          });
          console.log("Init Tag002");
      //    camera= scene.camera;  
          console.log("Init Tag003");
              //Accessing to virtual camera of a-frame 
  
              //const gsrenderer = new SPLAT.WebGLRenderer();
      //        document.body.appendChild(gsrenderer.domElement);
  
      //        camera= scene.camera;  
  
  
      solutionOptions = {
          selfieMode: true,
          enableFaceGeometry: false,
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
      };
          console.log("Init Tag004");
  
  
      // We'll add this to our control panel later, but we'll save it here so we can
      // call tick() each time the graph runs.
  
              console.log("Init Tag01");
  
      //    canvasCtx.restore();
              console.log("Init Tag02");
              console.log("Init Tag021");
              console.log("Init Tag022",config);
  
      const faceMesh = new mpFaceMesh.FaceMesh(config);
              console.log("Init Tag03");
  
      faceMesh.setOptions(solutionOptions);
              console.log("Init Tag04");
  
      faceMesh.onResults(onResults);
              console.log("Init Tag05");
  
          const cameraMediaPipe = new window.Camera(videoElement, {
          onFrame: async () => {
              await faceMesh.send({ image: videoElement });
              },
              width: 640,
              height: 480
          });
          
          console.log("Init Tag06");
          console.log("Video:",videoElement.width,":",videoElement.height);
  
          cameraMediaPipe.start();
  
          console.log("Init Tag07");
  }
  
  function onResults(results) {
      // Hide the spinner.
      // Update the frame rate.
  //    fpsControl.tick();
      // Draw the overlays.
//        console.log("onResults Tag00");
      if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
              if (solutionOptions.refineLandmarks) {
//        console.log("onResults Tag01",videoElement,videoElement.videoWidth,videoElement.videoHeight);
  //		        let landmarks =  results.landmarks[0];
                let distanceZ=ZenEst.estimateDepth(landmarks,videoElement.videoWidth,videoElement.videoHeight,76);
//                let distanceZ = estimateDepth(landmarks,videoElement.videoWidth,videoElement.videoHeight,76);
        //          console.log("Distance",distanceZ);
//  		console.log("onResults Tag011");
                const cx = videoElement.videoWidth / 2;
                const cy = videoElement.videoHeight / 2;
                let rightEye = landmarks[33];//263];
                const focalLength = videoElement.videoHeight;//1080;//460;//424;// (2.65-focal length/4-focal width)*640
                rightEye={ x:rightEye.x*videoElement.videoWidth, y:rightEye.y*videoElement.videoHeight, z:rightEye.z};
  
//  		console.log("onResults Tag012");
                let worldPoint = ZenEst.pixelToWorld(
                    rightEye.x,
                    rightEye.y,
                    distanceZ,
                    focalLength,
                    cx,
                    cy
                );
//                const worldPoint = pixelToWorld(
//                    rightEye.x,
//                    rightEye.y,
//                    distanceZ,
//                    focalLength,
//                    cx,
//                    cy
//                );
  
                const ppi = 460; // 
//		console.log("onResults Tag013");
                worldPoint.x=worldPoint.x;
                worldPoint.y=worldPoint.y
                +((window.innerHeight*window.devicePixelRatio/ppi)*0.0254)/2
                ;//-((heightInches)/2);
  //				console.log("LeftEye Meters:",worldPoint.x,",",worldPoint.y,",",worldPoint.z);
  
//                console.log("leftEye Pixel:",worldPoint.x.toFixed(2),",",worldPoint.y.toFixed(2),",",worldPoint.z.toFixed(2));
  
  //				camera.position.x=worldPoint.x; 
  //				camera.position.y=worldPoint.y;
  //				camera.position.z=worldPoint.z; //z position is fixed.    
//		console.log("onResults Tag0130");
                camera.position.copy(new THREE.Vector3(worldPoint.x, worldPoint.y, worldPoint.z));
                //  camera.position = new THREE.Vector3(worldPoint.x, worldPoint.y, worldPoint.z);
//                console.log("onResults Tag014");
                camera.lookAt(new THREE.Vector3(worldPoint.x,worldPoint.y,0));

//                console.log("onResults Tag015");                    
                camera.projectionMatrix.copy(ZenEst.getProjection(worldPoint));
                  
              }
          }
      }
  };

initMediaPipe();

const el = document.getElementById("splat");

// Parse the JSON string
const splatconfig = JSON.parse(el.dataset.config);

console.log(splatconfig.scene);              // "garden.splat"
console.log(splatconfig.position[0]);           // 0
console.log(splatconfig.scale);           // 1
console.log(splatconfig.rotation);                // 60
console.log(splatconfig.backgroundColor);    // "#000000"

//  const splatURL = "https://sparkjs.dev/assets/splats/butterfly.spz";
//////  const butterfly = new SplatMesh({ url: splatconfig.scene });
  // create Euler rotation

  function setupConfig(smesh,sconfig) {
  const euler = new THREE.Euler(        
    sconfig.rotation[0] * Math.PI/180,
    sconfig.rotation[1] * Math.PI/180,
    sconfig.rotation[2] * Math.PI/180);
  // convert to quaternion
  const quaternion = new THREE.Quaternion();

  
  quaternion.setFromEuler(euler);


    smesh.rotation.set((
    sconfig.rotation[0] * Math.PI/180,
    sconfig.rotation[1] * Math.PI/180,
    sconfig.rotation[2] * Math.PI/180
  ));

  smesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  smesh.position.set(sconfig.position[0],
     sconfig.position[1], sconfig.position[2]);
    smesh.scale.set(sconfig.scale[0], sconfig.scale[1], sconfig.scale[2]);

  scene.add(smesh);
  renderer.setClearColor(sconfig.backgroundColor, 1);
  renderer.setAnimationLoop(function animate(time) {
    renderer.render(scene, camera);
//console.log("GL Width/Height: ", gl.drawingBufferWidth, gl.drawingBufferHeight);

//    butterfly.rotation.y += 0.01;
  });



  };
 // butterfly.rotation.set((
//    splatconfig.rotation[0] * Math.PI/180,
//    splatconfig.rotation[1] * Math.PI/180,
//    splatconfig.rotation[2] * Math.PI/180
//  ));
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
const ppi = 460; // replace with your device's PPI
console.log("Window inner Height: ",window.innerHeight);
console.log("Window Height: ",(window.innerHeight*window.devicePixelRatio/ppi)*0.0254);
console.log("Window Ratio: ",window.devicePixelRatio);
console.log("GL Width/Height: ", gl.drawingBufferWidth, gl.drawingBufferHeight);
console.log("Canvas Width/Height: ", canvas.width, canvas.height);
  const viewport = gl.getParameter(gl.VIEWPORT);
  console.log('Viewport:', viewport); // [x, y, width, height]

    // Progress bar elements
const bar = document.getElementById("progress-bar");
const text = document.getElementById("progress-text");



///////  setupConfig(butterfly,splatconfig);

  const loader = new SplatLoader();
loader.loadAsync(splatconfig.scene , (event) => {
  if (event.type === "progress") {
    const progress = event.lengthComputable
      ? `${((event.loaded / event.total) * 100).toFixed(2)}%`
      : `${event.loaded} bytes`;
    console.log(`Background download progress: ${progress}`);
      const percent = (event.loaded  / event.total) * 100;
             bar.style.width = percent + "%";
            text.textContent ="Loading..."+ Math.floor(percent) + "%";

  }
})
.then((packedSplats) => {
        document.getElementById("progress-container").style.display = "none";
  const splatMesh = new SplatMesh({ packedSplats });
  // Re-orient from OpenCV to OpenGL coordinates
  //splatMesh.quaternion.set(1, 0, 0, 0);
  //splatMesh.position.set(0, 0, -1);
  //splatMesh.scale.setScalar(0.5);
  //scene.add(splatMesh);

  setupConfig(splatMesh,splatconfig);
})
.catch((error) => {
  console.warn(error);
});

