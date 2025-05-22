<template>
  <div>
    <Header />

    <div class="mx-auto lg:max-w-xl mt-5 mirror-container">
      <div class="relative w-full h-[570px] overflow-hidden">
        <canvas id="WebARRocksFaceCanvas"></canvas>
        <canvas id="threeCanvas"></canvas>
      </div>

      <div class="flex justify-center mt-2">
        <div
          class="w-24 h-10 bg-gray-500 cursor-pointer text-sm flex justify-center items-center rounded text-gray-100"
          @click="loadModel('assets/models3D/head/ironman.glb')"
        >
          Mask 1
        </div>
        <div
          class="w-24 h-10 ml-1 bg-gray-500 cursor-pointer text-sm flex justify-center items-center rounded text-gray-100"
          @click="loadModel('assets/models3D/head/logi.glb')"
        >
          Mask 2
        </div>
      </div>
    </div>

    <!-- <div id="controls">
        <div @click="loadModel('assets/models3D/glasses1.glb')">Glasses 1</div>
        <div @click="loadModel('assets/models3D/glasses2.glb')">Glasses 2</div>
      </div> -->
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";

onMounted(() => {
  const scripts = [
    "/dist/WebARRocksFace.js",
    "/helpers/WebARRocksFaceThreeHelper.js",
    "/libs/three/v136/build/three.js",
    "/libs/three/v136/examples/js/loaders/GLTFLoader.js",
    "/libs/three/v136/examples/js/loaders/RGBELoader.js",
    "/libs/three/v136/examples/js/postprocessing/EffectComposer.js",
    "/libs/three/v136/examples/js/postprocessing/ShaderPass.js",
    "/libs/three/v136/examples/js/postprocessing/RenderPass.js",
    "/libs/three/v136/examples/js/shaders/CopyShader.js",
    "/libs/three/v136/examples/js/postprocessing/UnrealBloomPassTweaked.js",
    "/libs/three/v136/examples/js/shaders/LuminosityHighPassShader.js",
    "/libs/three/v136/examples/js/postprocessing/SSAARenderPass.js",
    "/libs/three/v136/examples/js/postprocessing/TAARenderPass.js",
    "/helpers/landmarksStabilizers/OneEuroLMStabilizer.js",
    "/helpers/WebARRocksMirror.js",
  ];

  loadScriptsSequentially(scripts).then(() => {
    if (window.WebARRocksMirror) {
      startMirror();
    }
  });
});

function loadScriptsSequentially(sources) {
  return sources.reduce((promise, src) => {
    return promise.then(
      () =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error(`Failed to load script: ${src}`));
          document.body.appendChild(script);
        })
    );
  }, Promise.resolve());
}

function startMirror() {
  const canvasFace = document.getElementById("WebARRocksFaceCanvas");
  const canvasThree = document.getElementById("threeCanvas");
  const container = document.querySelector(".mirror-container");
  const rect = container.getBoundingClientRect();

  if (!window.WebARRocksMirror) return;

  window.WebARRocksMirror.init({
    solvePnPImgPointsLabels: [
      "leftEarBottom",
      "rightEarBottom",
      "noseBottom",
      "noseLeft",
      "noseRight",
      "leftEyeExt",
      "rightEyeExt",
    ],
    specWebARRocksFace: {
      NNCPath: "/neuralNets/NN_GLASSES_9.json",
      scanSettings: {
        threshold: 0.65,
        detectionSize: 128,
        skipAfterDetection: 5,
      },
      maxFacesDetected: 3,
    },
    landmarksStabilizerSpec: {
      beta: 10,
      minCutOff: 0.001,
      freqRange: [2, 144],
      forceFilterNNInputPxRange: [2.5, 6],
    },
    canvasFace,
    canvasThree,
    width: rect.width,
    height: rect.height,
    branchFadingZ: -0.9,
    branchFadingTransition: 0.6,
    branchBendingAngle: 5,
    branchBendingZ: 0,
    occluderURL: "/assets/models3D/occluder.glb",
    modelURL: "/assets/models3D/head/ironman.glb",
    envmapURL: "/assets/envmaps/venice_sunset_1k.hdr",
    pointLightIntensity: 0.5,
    pointLightY: 200,
    hemiLightIntensity: 0,
    bloom: { threshold: 0.8, strength: 10, radius: 1 },
    taaLevel: 3,
    debugLandmarks: false,
    debugOccluder: false,
  })
    .then(() => {
      console.log("WebARRocksMirror initialized");
      document.getElementById("controls").style.display = "flex";

      window.addEventListener("resize", () => {
        const newRect = container.getBoundingClientRect();
        window.WebARRocksMirror.resize(newRect.width, newRect.height);
      });
    })
    .catch((err) => {
      console.error("WebARRocksMirror init error:", err);
    });
}

function loadModel(path) {
  if (window.WebARRocksMirror) {
    window.WebARRocksMirror.load(path);
  }
}
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  background-color: silver;
}

#WebARRocksFaceCanvas,
#threeCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: rotateY(180deg);
}

#WebARRocksFaceCanvas {
  z-index: 0;
}
#threeCanvas {
  z-index: 1;
}
</style>
