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
  const keysRef = useRef({ left: false, right: false })
  const obstaclesRef = useRef([])
  const speedRef = useRef(0.15)
  const carXRef = useRef(0)
  const scoreRef = useRef(0)

  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const runningRef = useRef(false)

  const cleanup = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (rendererRef.current) {
      const canvas = rendererRef.current.domElement
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
      rendererRef.current.dispose()
      rendererRef.current = null
    }
    sceneRef.current = null
    cameraRef.current = null
    carGroupRef.current = null
    obstaclesRef.current = []
    runningRef.current = false
  }, [])

  // Initialize Three.js scene when game opens
  useEffect(() => {
    if (!isOpen && !embedded) return

    const mount = mountRef.current
    if (!mount) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87CEEB)
    scene.fog = new THREE.Fog(0x87CEEB, 50, 100)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 200)
    camera.position.set(0, 6, -10)
    camera.lookAt(0, 0, 20)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Lights
    const ambient = new THREE.AmbientLight(0x404060, 0.5)
    scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xffeedd, 1)
    sun.position.set(10, 20, 10)
    sun.castShadow = true
    sun.shadow.mapSize.width = 1024
    sun.shadow.mapSize.height = 1024
    const d = 30
    sun.shadow.camera.left = -d
    sun.shadow.camera.right = d
    sun.shadow.camera.top = d
    sun.shadow.camera.bottom = -d
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 50
    scene.add(sun)
    scene.add(new THREE.AmbientLight(0x404060, 0.3))

    // Road
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 200),
      new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
    )
    road.rotation.x = -Math.PI / 2
    road.position.set(0, -0.01, 50)
    road.receiveShadow = true
    scene.add(road)

    // Lane markings
    for (let z = 0; z < 200; z += 6) {
      const mark = new THREE.Mesh(
        new THREE.PlaneGeometry(0.3, 3),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      )
      mark.rotation.x = -Math.PI / 2
      mark.position.set(0, 0, z)
      scene.add(mark)
    }

    // Road edges
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0xffff00 })
    for (let z = 0; z < 200; z += 4) {
      const e1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 2), edgeMat)
      e1.position.set(-6.2, 0, z)
      scene.add(e1)
      const e2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 2), edgeMat)
      e2.position.set(6.2, 0, z)
      scene.add(e2)
    }

    // Grass
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50 })
    const leftGrass = new THREE.Mesh(new THREE.PlaneGeometry(20, 200), grassMat)
    leftGrass.rotation.x = -Math.PI / 2
    leftGrass.position.set(-16, -0.01, 50)
    scene.add(leftGrass)
    const rightGrass = new THREE.Mesh(new THREE.PlaneGeometry(20, 200), grassMat)
    rightGrass.rotation.x = -Math.PI / 2
    rightGrass.position.set(16, -0.01, 50)
    scene.add(rightGrass)

    // Colorful buildings
    const buildingColors = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0xA8E6CF, 0xFF8A5C, 0x7C4DFF, 0xFF4081, 0x00BCD4]
    const buildings = []
    for (let z = 0; z < 200; z += 8) {
      const side = Math.random() > 0.5 ? 1 : -1
      const bw = 2 + Math.random() * 3
      const bh = 2 + Math.random() * 6
      const bd = 2 + Math.random() * 2
      const color = buildingColors[Math.floor(Math.random() * buildingColors.length)]
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(bw, bh, bd),
        new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
      )
      building.position.set(side * (8 + Math.random() * 4), bh / 2, z)
      building.castShadow = true
      building.receiveShadow = true
      scene.add(building)
      buildings.push(building)
    }

    // Car
    const carGroup = new THREE.Group()
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.3, metalness: 0.3 })
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 3.5), bodyMat)
    body.position.y = 0.35
    body.castShadow = true
    carGroup.add(body)

    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.1, metalness: 0.8 })
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.5), cabinMat)
    cabin.position.set(0, 0.7, -0.3)
    carGroup.add(cabin)

    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
    const wp = [[-1, 0.15, 1.2], [1, 0.15, 1.2], [-1, 0.15, -1.2], [1, 0.15, -1.2]]
    wp.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 12), wheelMat)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(x, y, z)
      carGroup.add(wheel)
    })

    carGroup.position.set(0, 0, 3)
    scene.add(carGroup)
    carGroupRef.current = carGroup

    return () => {
      window.removeEventListener('resize', handleResize)
      cleanup()
    }
  }, [isOpen, embedded, cleanup])

  // Game loop - runs continuously when open
  useEffect(() => {
    if ((!isOpen && !embedded) || !sceneRef.current || !rendererRef.current) return

    const scene = sceneRef.current
    const camera = cameraRef.current
    const renderer = rendererRef.current

    let obstacleTimer = 0

    const animate = () => {
      if (!sceneRef.current || !rendererRef.current) return

      const carGroup = carGroupRef.current
      if (carGroup && runningRef.current) {
        const keys = keysRef.current
        if (keys.left) carXRef.current -= 0.08
        if (keys.right) carXRef.current += 0.08
        carXRef.current = Math.max(-4.5, Math.min(4.5, carXRef.current))
        carGroup.position.x = carXRef.current

        speedRef.current = Math.min(0.15 + scoreRef.current * 0.002, 0.5)

        // Move world objects
        scene.children.forEach(child => {
          if (child === carGroup || child.isMesh && (child.material?.color?.getHex() === 0x333333 || child.material?.color?.getHex() === 0x4CAF50)) return
          if (child.position && child.position.z !== undefined && child !== camera) {
            child.position.z -= speedRef.current
            if (child.position.z < -5 && child.position.z > -50) {
              child.position.z = 100 + Math.random() * 80
            }
          }
        })

        // Obstacles
        obstacleTimer += speedRef.current
        if (obstacleTimer > 5) {
          obstacleTimer = 0
          const obsColors = [0xFF5252, 0xFF4081, 0xE040FB, 0x7C4DFF]
          const obs = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: obsColors[Math.floor(Math.random() * obsColors.length)], emissive: 0xffffff, emissiveIntensity: 0.2 })
          )
          obs.position.set((Math.random() - 0.5) * 6, 0.5, 80)
          scene.add(obs)
          obstaclesRef.current.push(obs)
        }

        // Collision
        const carBox = new THREE.Box3().setFromObject(carGroup)
        obstaclesRef.current = obstaclesRef.current.filter(obs => {
          if (!obs) return false
          const obsBox = new THREE.Box3().setFromObject(obs)
          if (carBox.intersectsBox(obsBox)) {
            scene.remove(obs)
            runningRef.current = false
            speedRef.current = 0
            scoreRef.current = Math.floor(scoreRef.current)
            setScore(scoreRef.current)
            setGameOver(true)
            setStarted(false)
            return false
          }
          if (obs.position.z < -5) {
            scene.remove(obs)
            return false
          }
          return true
        })

        // Clean up far obstacles
        obstaclesRef.current = obstaclesRef.current.filter(obs => {
          if (obs.position.z < -5) { scene.remove(obs); return false }
          return true
        })

        scoreRef.current += 0.01
        setScore(Math.floor(scoreRef.current))
      }

      renderer.render(scene, camera)
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isOpen, embedded])

  // Keyboard controls
  useEffect(() => {
    if (!isOpen && !embedded) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true
    }
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isOpen, embedded])

  const handleStart = useCallback(() => {
    speedRef.current = 0.15
    carXRef.current = 0
    scoreRef.current = 0
    obstaclesRef.current.forEach(o => sceneRef.current?.remove(o))
    obstaclesRef.current = []
    setScore(0)
    setGameOver(false)
    setStarted(true)
    runningRef.current = true
    if (carGroupRef.current) carGroupRef.current.position.x = 0
  }, [])

  if (!isOpen && !embedded) return null

  // Embedded mode: just the canvas with overlays, no fullscreen wrapper
  if (embedded) {
    return (
      <div className="car-game-embedded">
        <div className="car-game-canvas" ref={mountRef}>
          {!started && !gameOver && (
            <div className="car-game-start">
              <button className="car-game-btn car-game-btn-play" onClick={handleStart}>▶ Play</button>
            </div>
          )}
          {gameOver && (
            <div className="car-game-start">
              <h3 className="car-game-over-title">💥 Game Over</h3>
              <p className="car-game-final-score">{score}</p>
              <button className="car-game-btn car-game-btn-play" onClick={handleStart}>↻ Play Again</button>
            </div>
          )}
          {started && !gameOver && (
            <div className="car-game-embedded-score">{score}</div>
          )}
        </div>
        <div className="car-game-controls">
          <div className="car-game-keys">
            <button
              className="ctrl-btn"
              onTouchStart={() => keysRef.current.left = true}
              onTouchEnd={() => keysRef.current.left = false}
              onMouseDown={() => keysRef.current.left = true}
              onMouseUp={() => keysRef.current.left = false}
            >←</button>
            <button
              className="ctrl-btn"
              onTouchStart={() => keysRef.current.right = true}
              onTouchEnd={() => keysRef.current.right = false}
              onMouseDown={() => keysRef.current.right = true}
              onMouseUp={() => keysRef.current.right = false}
            >→</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="car-game-overlay">
      <div className="car-game-container">
        <div className="car-game-canvas" ref={mountRef}>
          {!started && !gameOver && (
            <div className="car-game-start">
              <h3>🏎️ 3D Drive</h3>
              <button className="car-game-btn" onClick={handleStart}>▶ Start Playing</button>
            </div>
          )}
          {gameOver && (
            <div className="car-game-start">
              <h3>💥 Game Over!</h3>
              <p className="car-game-final-score">Score: {score}</p>
              <button className="car-game-btn" onClick={handleStart}>Play Again</button>
            </div>
          )}
        </div>

        <button className="car-game-close" onClick={onClose}>✕</button>

        <div className="car-game-controls">
          <div className="car-game-keys">
            <button
              className="ctrl-btn"
              onTouchStart={() => keysRef.current.left = true}
              onTouchEnd={() => keysRef.current.left = false}
              onMouseDown={() => keysRef.current.left = true}
              onMouseUp={() => keysRef.current.left = false}
            >←</button>
            <button
              className="ctrl-btn"
              onTouchStart={() => keysRef.current.right = true}
              onTouchEnd={() => keysRef.current.right = false}
              onMouseDown={() => keysRef.current.right = true}
              onMouseUp={() => keysRef.current.right = false}
            >→</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarGame