import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Cube from './cube'
import Lucy from './lucy'
//import glbFile from './assets/Lucy.glb'

const element = document.getElementById("three-container");

const animIdleButton = document.getElementById("anim-idle-button")
const animDancingButton = document.getElementById("anim-dancing-button")
const animPistolReadyButton = document.getElementById("anim-pistol-ready-button")
const animPistolFireButton = document.getElementById("anim-pistol-fire-button")
animIdleButton.addEventListener("click", ()=>{playLucyAnim("Idle")})
animDancingButton.addEventListener("click", ()=>{playLucyAnim("Dancing")})
animPistolReadyButton.addEventListener("click", ()=>{playLucyAnim("Pistol Ready")})
animPistolFireButton.addEventListener("click", ()=>{playLucyAnim("Pistol Fire")})

const playLucyAnim = (anim) => {
  if (!lucy) {
    console.log("No Lucy")
    return
  }

  lucy.playAnimationByName(anim)
}

// Initialize Three.js scene
var scene = new THREE.Scene()
console.log("Starting three scene!")
scene.background = null

// Set up camera
var camera = new THREE.PerspectiveCamera(75, element.clientWidth / element.clientHeight, 0.1, 1000)
camera.position.set(0,2,2)
//camera.lookAt(new THREE.Vector3(0,4,0))

// Set up renderer
var renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(element.clientWidth, element.clientHeight)
renderer.shadowMap.enabled = true
function resizeRenderer() {
  const width = element.clientWidth
  const height = element.clientHeight
  renderer.setSize(width, height)
}
resizeRenderer()
window.addEventListener("resize", resizeRenderer)

if (element) element.appendChild(renderer.domElement)
else document.body.appendChild(renderer.domElement)

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 1, 0)

// Lighting
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.2)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.99)
directionalLight.position.set(2, 3, 4)
directionalLight.castShadow = true
scene.add(directionalLight)

const clock = new THREE.Clock(true)

// Click raycasters
renderer.domElement.addEventListener('click', (event) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Calculate mouse position relative to the canvas element
  const canvasBounds = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
  mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera)

  // Check for intersections
  const intersects = raycaster.intersectObjects(scene.children, true); // Pass all scene children for intersection check
  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    
    //console.log(intersectedObject.name)
    
    if (intersectedObject.name == "Ana") lucy.playAnimationByName("DancingTwirl")
    else if (intersectedObject.name == "cube1") intersectedObject.spinning = !intersectedObject.spinning
    else if (intersectedObject.name == "cube2") intersectedObject.spinning = !intersectedObject.spinning
  }
})

// Simple cubes
const cube = Cube(THREE, scene, "cube1", 0x339933, [-1,-0.5,0])
const cube2 = Cube(THREE, scene, "cube2", 0xEE0099, [1,-0.5,0])

// Main character
let lucy = Lucy(THREE, GLTFLoader, scene)

function spinCubes() {
  if (cube) cube.spin(0.01,0.005,0)
  if (cube2) cube2.spin(0,0,0.01)
}

// Render loop
function animate() {
  requestAnimationFrame(animate)

  var delta = clock.getDelta()

  controls.update()

  spinCubes()

  if (lucy) {
    lucy.updateMixer(delta)
  }

  renderer.render(scene, camera)
}

animate()