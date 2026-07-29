import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import './CarGame.css'

const CarGame = ({ isOpen, onClose, embedded = false }) => {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const carGroupRef = useRef(null)
  const animFrameRef = useRef(null)

  // Game-state refs (no stale-closure issues in the rAF loop)
  const keysRef = useRef({ left: false, right: false })
  const carXRef = useRef(0)
  const speedRef = useRef(0.15)
  const scoreRef = useRef(0)
  const runningRef = useRef(false)
  const obstaclesRef = useRef([])

  // Tracked world objects that scroll with the road
  const worldObjectsRef = useRef([])
  const worldInitialZRef = useRef([])

  // React state for UI overlays
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState(null)

  // ──────────────────────────────────────────────
  // 1.  Scene setup + animation loop (runs once)
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen && !embedded) return

    const mount = mountRef.current
    if (!mount) return

    let localAnimFrame = null
    let obstacleTimer = 0
    const worldObjs = []
    const initialZ = []

    try {
      /* ------ Scene ------ */
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x87ceeb)
      scene.fog = new THREE.Fog(0x87ceeb, 50, 100)

      /* ------ Camera ------ */
      const w = mount.clientWidth || window.innerWidth
      const h = mount.clientHeight || window.innerHeight
      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200)
      camera.position.set(0, 6, -10)
      camera.lookAt(0, 0, 20)

      /* ------ Renderer ------ */
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      mount.appendChild(renderer.domElement)

      const handleResize = () => {
        const w2 = mount.clientWidth || window.innerWidth
        const h2 = mount.clientHeight || window.innerHeight
        camera.aspect = w2 / h2
        camera.updateProjectionMatrix()
        renderer.setSize(w2, h2)
      }
      window.addEventListener('resize', handleResize)

      /* ------ Lights ------ */
      scene.add(new THREE.AmbientLight(0x404060, 0.5))
      const sun = new THREE.DirectionalLight(0xffeedd, 1)
      sun.position.set(10, 20, 10)
      sun.castShadow = true
      sun.shadow.mapSize.width = 1024
      sun.shadow.mapSize.height = 1024
      const d2 = 30
      sun.shadow.camera.left = -d2
      sun.shadow.camera.right = d2
      sun.shadow.camera.top = d2
      sun.shadow.camera.bottom = -d2
      sun.shadow.camera.near = 1
      sun.shadow.camera.far = 50
      scene.add(sun)
      scene.add(new THREE.AmbientLight(0x404060, 0.3))

      /* ------ Road surface ------ */
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
      const road = new THREE.Mesh(new THREE.PlaneGeometry(12, 200), roadMat)
      road.rotation.x = -Math.PI / 2
      road.position.set(0, -0.01, 50)
      road.receiveShadow = true
      scene.add(road)

      /* ------ Grass ------ */
      const grassMat = new THREE.MeshStandardMaterial({ color: 0x4caf50 })
      const grassGeom = new THREE.PlaneGeometry(20, 200)
      const leftGrass = new THREE.Mesh(grassGeom, grassMat)
      leftGrass.rotation.x = -Math.PI / 2
      leftGrass.position.set(-16, -0.01, 50)
      scene.add(leftGrass)
      const rightGrass = new THREE.Mesh(grassGeom, grassMat)
      rightGrass.rotation.x = -Math.PI / 2
      rightGrass.position.set(16, -0.01, 50)
      scene.add(rightGrass)

      /* ------ Scrolling world objects ------ */
      const addWorldObject = (obj, z) => {
        scene.add(obj)
        worldObjs.push(obj)
        initialZ.push(z)
      }

      // Lane markings
      const markMat = new THREE.MeshStandardMaterial({ color: 0xffffff })
      for (let z = 0; z < 200; z += 6) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 3), markMat)
        m.rotation.x = -Math.PI / 2
        m.position.set(0, 0, z)
        addWorldObject(m, z)
      }

      // Road-edge chevrons
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0xffff00 })
      for (let z = 0; z < 200; z += 4) {
        const e1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 2), edgeMat)
        e1.position.set(-6.2, 0, z)
        addWorldObject(e1, z)
        const e2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 2), edgeMat)
        e2.position.set(6.2, 0, z)
        addWorldObject(e2, z)
      }

      // Roadside poles
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 })
      for (let z = 0; z < 200; z += 8) {
        const side = Math.random() > 0.5 ? 1 : -1
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.5, 4), poleMat)
        pole.position.set(side * 7.5, 0.25, z)
        addWorldObject(pole, z)
      }

      worldObjectsRef.current = worldObjs
      worldInitialZRef.current = initialZ

      /* ------ Player car ------ */
      const carGroup = new THREE.Group()

      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.3, metalness: 0.3 })
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 3.5), bodyMat)
      body.position.y = 0.35
      body.castShadow = true
      carGroup.add(body)

      const cabinMat = new THREE.MeshStandardMaterial({ color: 0x2196f3, roughness: 0.1, metalness: 0.8 })
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.5), cabinMat)
      cabin.position.set(0, 0.7, -0.3)
      carGroup.add(cabin)

      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
      ;[[-1, 0.15, 1.2], [1, 0.15, 1.2], [-1, 0.15, -1.2], [1, 0.15, -1.2]].forEach(
        ([x, y, z]) => {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 12), wheelMat)
          wheel.rotation.z = Math.PI / 2
          wheel.position.set(x, y, z)
          carGroup.add(wheel)
        }
      )

      carGroup.position.set(0, 0, 3)
      scene.add(carGroup)

      // Publish refs for outside access (start / restart)
      sceneRef.current = scene
      cameraRef.current = camera
      rendererRef.current = renderer
      carGroupRef.current = carGroup

      /* ------ Animation loop ------ */
      const animate = () => {
        if (!renderer || !scene || !camera) return

        if (runningRef.current) {
          const keys = keysRef.current

          // Steer (fixed: left = negative X, right = positive X)
          if (keys.left) carXRef.current -= 0.08
          if (keys.right) carXRef.current += 0.08
          carXRef.current = Math.max(-4.5, Math.min(4.5, carXRef.current))
          carGroup.position.x = carXRef.current

          // Speed ramps with score
          speedRef.current = Math.min(0.15 + scoreRef.current * 0.002, 0.5)
          const speed = speedRef.current

          // Scroll the world (lane marks, edges, poles)
          const SCROLL_THRESHOLD = -8
          const RESPAWN_DELTA = 200
          for (const obj of worldObjs) {
            obj.position.z -= speed
            if (obj.position.z < SCROLL_THRESHOLD) {
              obj.position.z += RESPAWN_DELTA
            }
          }

          // Spawn obstacles
          obstacleTimer += speed
          if (obstacleTimer > 5) {
            obstacleTimer = 0
            const obsColors = [0xff5252, 0xff4081, 0xe040fb, 0x7c4dff]
            const obs = new THREE.Mesh(
              new THREE.BoxGeometry(1, 1, 1),
              new THREE.MeshStandardMaterial({
                color: obsColors[Math.floor(Math.random() * obsColors.length)],
                emissive: 0xffffff,
                emissiveIntensity: 0.2,
              })
            )
            obs.position.set((Math.random() - 0.5) * 6, 0.5, 80 + Math.random() * 20)
            scene.add(obs)
            obstaclesRef.current.push(obs)
          }

          // Collision detection
          const carBox = new THREE.Box3().setFromObject(carGroup)
          const remaining = []
          for (const obs of obstaclesRef.current) {
            if (!obs) continue
            if (carBox.intersectsBox(new THREE.Box3().setFromObject(obs))) {
              scene.remove(obs)
              runningRef.current = false
              speedRef.current = 0
              const finalScore = Math.floor(scoreRef.current)
              scoreRef.current = finalScore
              setScore(finalScore)
              setGameOver(true)
              setStarted(false)
              continue
            }
            if (obs.position.z < -5) {
              scene.remove(obs)
              continue
            }
            remaining.push(obs)
          }
          obstaclesRef.current = remaining

          // Score
          scoreRef.current += 0.01
          setScore(Math.floor(scoreRef.current))
        }

        renderer.render(scene, camera)
        localAnimFrame = requestAnimationFrame(animate)
      }

      localAnimFrame = requestAnimationFrame(animate)
      animFrameRef.current = localAnimFrame

      /* ------ Cleanup ------ */
      return () => {
        if (localAnimFrame) cancelAnimationFrame(localAnimFrame)
        window.removeEventListener('resize', handleResize)
        runningRef.current = false

        // Remove & dispose obstacles
        for (const o of obstaclesRef.current) {
          scene.remove(o)
          if (o.geometry) o.geometry.dispose()
          if (o.material) o.material.dispose()
        }
        obstaclesRef.current = []

        // Dispose every mesh in the scene
        scene.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.geometry) obj.geometry.dispose()
            if (obj.material) {
              if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
              else obj.material.dispose()
            }
          }
        })
        renderer.dispose()
        const canvas = renderer.domElement
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas)

        sceneRef.current = null
        cameraRef.current = null
        rendererRef.current = null
        carGroupRef.current = null
        worldObjectsRef.current = []
        worldInitialZRef.current = []
      }
    } catch (e) {
      console.error('CarGame init error:', e)
      setError(e.message || 'Failed to initialize 3D')
    }
    // Only re-run when the overlay is toggled or mount mode changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, embedded])

  // ──────────────────────────────────────────────
  // 2.  Keyboard bindings
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen && !embedded) return

    const onDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true
    }
    const onUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [isOpen, embedded])

  // ──────────────────────────────────────────────
  // 3.  Start / Restart
  // ──────────────────────────────────────────────
  const handleStart = useCallback(() => {
    speedRef.current = 0.15
    carXRef.current = 0
    scoreRef.current = 0
    setScore(0)
    setGameOver(false)
    setStarted(true)

    const scene = sceneRef.current
    // Clear obstacles
    for (const o of obstaclesRef.current) {
      scene?.remove(o)
      if (o.geometry) o.geometry.dispose()
      if (o.material) o.material.dispose()
    }
    obstaclesRef.current = []

    // Reset car
    if (carGroupRef.current) carGroupRef.current.position.x = 0

    // Reset world objects
    const objs = worldObjectsRef.current
    const zs = worldInitialZRef.current
    if (objs.length === zs.length) {
      for (let i = 0; i < objs.length; i++) objs[i].position.z = zs[i]
    }

    runningRef.current = true
  }, [])

  // ──────────────────────────────────────────────
  // 4.  Render
  // ──────────────────────────────────────────────
  if (!isOpen && !embedded) return null

  // --- shared touch/mouse helpers ---
  const ctrlLeft = (v) => (e) => { keysRef.current.left = v; e.preventDefault() }
  const ctrlRight = (v) => (e) => { keysRef.current.right = v; e.preventDefault() }

  const overlayContent = (
    <>
      {error && (
        <div className="car-game-start">
          <p style={{ color: '#fff' }}>⚠️ {error}</p>
        </div>
      )}

      {!error && !started && !gameOver && (
        <div className="car-game-start">
          <h3>🏎️ 3D Drive</h3>
          <button className="car-game-btn" onClick={handleStart}>
            ▶ Start Playing
          </button>
        </div>
      )}

      {!error && gameOver && (
        <div className="car-game-start">
          <h3 className="car-game-over-title">💥 Game Over!</h3>
          <p className="car-game-final-score">{score}</p>
          <button className="car-game-btn" onClick={handleStart}>
            Play Again
          </button>
        </div>
      )}
    </>
  )

  const touchControls = (
    <div className="car-game-keys">
      <button
        className="ctrl-btn"
        onTouchStart={ctrlLeft(true)}
        onTouchEnd={ctrlLeft(false)}
        onMouseDown={ctrlLeft(true)}
        onMouseUp={ctrlLeft(false)}
        onMouseLeave={ctrlLeft(false)}
      >
        ←
      </button>
      <button
        className="ctrl-btn"
        onTouchStart={ctrlRight(true)}
        onTouchEnd={ctrlRight(false)}
        onMouseDown={ctrlRight(true)}
        onMouseUp={ctrlRight(false)}
        onMouseLeave={ctrlRight(false)}
      >
        →
      </button>
    </div>
  )

  // --- Embedded mode ---
  if (embedded) {
    return (
      <div className="car-game-embedded">
        <div className="car-game-canvas" ref={mountRef}>
          {!error && started && !gameOver && (
            <div className="car-game-embedded-score">{score}</div>
          )}
          {overlayContent}
        </div>
        <div className="car-game-controls">{touchControls}</div>
      </div>
    )
  }

  // --- Overlay (full-screen) mode ---
  return (
    <div className="car-game-overlay">
      <div className="car-game-container">
        <div className="car-game-canvas" ref={mountRef}>
          {overlayContent}
        </div>
        <button className="car-game-close" onClick={onClose}>
          ✕
        </button>
        <div className="car-game-controls">{touchControls}</div>
      </div>
    </div>
  )
}

export default CarGame
