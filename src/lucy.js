import glbFile from '../dist/assets/Lucy.glb'

const Lucy = (THREE, GLTFLoader, scene) => {
  let mixer
  let model
  let animations
  let lastAnim
  let pistol

  // Load GLTF model
  const loader = new GLTFLoader()

  // Load normaly
  // loader.load('./assets/Lucy.glb', function (gltf) {
  //   loadModel(gltf)
  // })

  // Load using web pack
  loader.load(glbFile, function (gltf) {
    loadModel(gltf)
  })

  const loadModel = (gltf) => {
    model = gltf.scene
    scene.add(model)
    model.name = "lucy"

    animations = gltf.animations
    mixer = new THREE.AnimationMixer(model)
    playAnimationByName("Idle")

    initializeAnimations()

    pistol = getNodebyName(model, "Pistol")
    pistol.visible = false
  }

  const getNodebyName = (node, name) => {
    if (node.name == name) return node

    for (const child of node.children) {
      const foundNode = getNodebyName(child, name)
      if (foundNode) return foundNode
    }
  
    return null
  }

  const initializeAnimations = () => {
    const action = mixer.clipAction(THREE.AnimationClip.findByName(animations, "DancingTwirl"))
    action.loop = THREE.LoopOnce
    action.clampWhenFinished = true
    
    mixer.addEventListener('finished', () => {
      //console.log("Animation finished", lastAnim)
      if (lastAnim._clip.name == "DancingTwirl") playAnimationByName("Idle");
  });
  }

  const playAnimationByName = (animationName) => {
    if (!mixer) return
    if (!animations) return
  
    const action = mixer.clipAction(THREE.AnimationClip.findByName(animations, animationName));
    if (action) {
      action.reset().fadeIn(0.2).play()
      if (lastAnim) lastAnim.fadeOut(0.2)
      lastAnim = action
    }
    else {
      console.log("cannot find action")
      return
    }

    if (animationName.includes("Pistol")) {
      if (pistol) pistol.visible = true
    } else {
      if (pistol) pistol.visible = false
    }
  }

  const updateMixer = (delta) => {
    if (!mixer) return
    mixer.update(delta)
  }

  return {model, updateMixer, playAnimationByName}
}

export default Lucy