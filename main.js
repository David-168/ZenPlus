  import * as THREE from "three";
  import { SplatMesh } from "@sparkjsdev/spark";

  const scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement)

  var videoElement;
  var solutionOptions;
  
  class ZenEsti {
        depth = 1.0;
        constructor() {
                console.log("ZenEsti.constructor");
        }

        estimateDepth(landmarks, imageWidth, imageHeight,fovDeg) {

                console.log("ZenEsti.estimateDepth tag0");
                
                let leftEye = landmarks[33];
                leftEye={ x:leftEye.x*imageWidth, y:leftEye.y*imageHeight, z:leftEye.z*5};
                  console.log("ZenEsti.estimateDepth tag1");

                let rightEye = landmarks[263];
                rightEye={ x:rightEye.x*imageWidth, y:rightEye.y*imageHeight, z:rightEye.z*5};
                const dx = (leftEye.x - rightEye.x);
                const dy = (leftEye.y - rightEye.y);
                const pixelDistance = Math.sqrt(dx * dx + dy * dy);
  
                //let focalLength = focalLengthFromFOV(fovDeg, imageWidth);
                  console.log("ZenEsti.estimateDepth tag2");

                let focalLength = videoElement.videoHeight;//1080;//320;//272;//424;// (2.65-focal length/4-focal width)*640
                const realIPD = 0.063; // meters
  
                const depthMeters = (focalLength * realIPD) / pixelDistance;
                const cx = imageWidth / 2;
                const cy = imageHeight / 2;
        
                //console.log("ZenEsti.estimateDepth tag4");
                const worldPoint = this.pixelToWorld(
                rightEye.x,
                rightEye.y,
                depthMeters,
                focalLength,
                cx,
                cy
                );
        
                //console.log("ZenEsti.estimateDepth tag5");
                this.depth = depthMeters;
                //console.log("ZenEsti.estimateDepth tag6");
        //        console.log("LeftEye Meters:",worldPoint.x,",",worldPoint.y,",",worldPoint.z);
                return depthMeters;
                };
        
        pixelToWorld(inx, iny, Z, f, cx, cy) {
                return {
                        x: ((inx - cx) * Z) / f,
                        y: -1 * ((iny - cy) * Z) / f,
                        z: Z
                };
                }
        

        getProjection(eyepos)
        {
  
  //        console.log("FrustumProjection tag00");
  
                const widthPx = window.innerWidth;//screen.width;              // CSS pixels
                const heightPx = window.innerHeight;//screen.height;            // CSS pixels
                const dpr = window.devicePixelRatio || 1; // pixels per CSS pixel
  
                const realWidthPx = widthPx * dpr;
                const realHeightPx = heightPx * dpr;
  
  //        console.log("Real pixels:", realWidthPx, realHeightPx);
  
                const ppi = 460; // replace with your device's PPI
                const widthInches = realWidthPx / ppi;
                const heightInches = realHeightPx / ppi;
  //        console.log("Real pixels:", realWidthPx, realHeightPx);
//          console.log("FrustumProjection tag01");
  
          const widthMeters = widthInches * 0.0254;
          const heightMeters = heightInches * 0.0254;
//          console.log("Real meters:", widthMeters, heightMeters);
  
                const EyePos = new THREE.Vector3(eyepos.x,eyepos.y,eyepos.z);
//          console.log("FrustumProjection tag02");
                const LeftTop =new THREE.Vector3(-0.032,0.05,0);
  //        const LeftTop =new THREE.Vector3(-1*widthMeters,heightMeters,0);
                const RightBottom =new THREE.Vector3(0.032,-0.05,0);
  //        const RightBottom =new THREE.Vector3(widthMeters,-1*heightMeters,0);
//          console.log("FrustumProjection tag03");
                const LeftTopCameraSpace = LeftTop.sub(EyePos);//LeftTop.clone().applyMatrix4(camera.matrixWorldInverse);
  //        console.log("LeftTop:", LeftTopCameraSpace);
//          console.log("FrustumProjection tag04");
  
                const RightBottomCameraSpace = RightBottom.sub(EyePos);//RightBottom.clone().applyMatrix4(camera.matrixWorldInverse);
  //        console.log("RightBottom:", RightBottomCameraSpace);
//          console.log("FrustumProjection tag040");
          //camera.position.copy(EyePos);
//                camera.lookAt(new THREE.Vector3(eyepos.x,eyepos.y,0));
//          console.log("FrustumProjection tag041");
//                camera.projectionMatrix.makePerspective(LeftTopCameraSpace.x,
//                RightBottomCameraSpace.x,
//                LeftTopCameraSpace.y,
//                RightBottomCameraSpace.y,
//                -1*LeftTopCameraSpace.z,
//                100
//                ); 
//          console.log("FrustumProjection tag042");

                var projmat = new THREE.Matrix4().makePerspective(LeftTopCameraSpace.x,
                RightBottomCameraSpace.x,
                LeftTopCameraSpace.y,
                RightBottomCameraSpace.y,
                -1*LeftTopCameraSpace.z,
                100
                );
  
//                console.log("FrustumProjection tag05");//  };
  
                return projmat;
        };

                     
        }
        
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
            console.log("onFrame Tag0");
              await faceMesh.send({ image: videoElement });
            console.log("onFrame Tag1");
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
        console.log("onResults Tag01",videoElement,videoElement.videoWidth,videoElement.videoHeight);
  //		        let landmarks =  results.landmarks[0];
                let distanceZ=ZenEst.estimateDepth(landmarks,videoElement.videoWidth,videoElement.videoHeight,76);
//                let distanceZ = estimateDepth(landmarks,videoElement.videoWidth,videoElement.videoHeight,76);
        //          console.log("Distance",distanceZ);
  		console.log("onResults Tag011");
                const cx = videoElement.videoWidth / 2;
                const cy = videoElement.videoHeight / 2;
                let rightEye = landmarks[33];//263];
                const focalLength = videoElement.videoHeight;//1080;//460;//424;// (2.65-focal length/4-focal width)*640
                rightEye={ x:rightEye.x*videoElement.videoWidth, y:rightEye.y*videoElement.videoHeight, z:rightEye.z};
  
  		console.log("onResults Tag012");
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
		console.log("onResults Tag013");
                worldPoint.x=worldPoint.x;
                worldPoint.y=worldPoint.y
                +(window.innerHeight*window.devicePixelRatio/ppi)*0.0254
                ;//-((heightInches)/2);
  //				console.log("LeftEye Meters:",worldPoint.x,",",worldPoint.y,",",worldPoint.z);
  
//                console.log("leftEye Pixel:",worldPoint.x.toFixed(2),",",worldPoint.y.toFixed(2),",",worldPoint.z.toFixed(2));
  
  //				camera.position.x=worldPoint.x; 
  //				camera.position.y=worldPoint.y;
  //				camera.position.z=worldPoint.z; //z position is fixed.    
		console.log("onResults Tag0130");
                camera.position.copy(new THREE.Vector3(worldPoint.x, worldPoint.y, worldPoint.z));
                //  camera.position = new THREE.Vector3(worldPoint.x, worldPoint.y, worldPoint.z);
                console.log("onResults Tag014");
                camera.lookAt(new THREE.Vector3(worldPoint.x,worldPoint.y,0));

                console.log("onResults Tag015");                    
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
  const butterfly = new SplatMesh({ url: splatconfig.scene });
  // create Euler rotation
  const euler = new THREE.Euler(        
    splatconfig.rotation[0] * Math.PI/180,
    splatconfig.rotation[1] * Math.PI/180,
    splatconfig.rotation[2] * Math.PI/180
  );

  // convert to quaternion
  const quaternion = new THREE.Quaternion();

  
  quaternion.setFromEuler(euler);


    butterfly.rotation.set((
    splatconfig.rotation[0] * Math.PI/180,
    splatconfig.rotation[1] * Math.PI/180,
    splatconfig.rotation[2] * Math.PI/180
  ));

  butterfly.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  butterfly.position.set(splatconfig.position[0],
     splatconfig.position[1], splatconfig.position[2]);
 // butterfly.rotation.set((
//    splatconfig.rotation[0] * Math.PI/180,
//    splatconfig.rotation[1] * Math.PI/180,
//    splatconfig.rotation[2] * Math.PI/180
//  ));
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');

console.log("GL Width/Height: ", gl.drawingBufferWidth, gl.drawingBufferHeight);

  scene.add(butterfly);
  renderer.setClearColor(splatconfig.backgroundColor, 1)
  butterfly.scale.set(splatconfig.scale[0], splatconfig.scale[1], splatconfig.scale[2]);
  renderer.setAnimationLoop(function animate(time) {
    renderer.render(scene, camera);
//    butterfly.rotation.y += 0.01;
  });
