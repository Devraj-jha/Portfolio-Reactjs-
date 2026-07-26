import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import './CarGame.css'

const CarGame = ({ isOpen, onClose }) => {
  const mountRef = useRef(null)

  if (!isOpen) return null
  const sceneRef = useRef(null)
  const gameStateRef = useRef({
    score: 0,
    gameOver: false,
    started: false,
    speed: 0.15,
    carX: 0,
    obstacles: [],
    buildings: [],
    laneOffset: 0,
  })
  const keysRef = useRef({ left: false, right: false })
  const animFrameRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const resetGame = useCallback(() => {
    const gs = gameStateRef.current
    gs.score = 0
    gs.gameOver = false
    gs.speed = 0.15
    gs.carX = 0
    gs.obstacles = []
    setScore(0)
    setGameOver(false)
  }, [])

  const startGame = useCallback(() => {
    resetGame()
    const gs = gameStateRef.current
    gs.started = true
    setStarted(true)
  }, [resetGame])

  const endGame = useCallback(() => {
    const gs = gameStateRef.current
    gs.gameOver = true
    gs.started = false
    setGameOver(true)
    setStarted(false)
  }, [])

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87CEEB) // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 50, 100)

    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 200)
    camera.position.set(0, 6, -10)
    camera.lookAt(0, 0, 20)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)
    sceneRef.current = { scene, camera, renderer }

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

    const fill = new THREE.DirectionalLight(0x4444ff, 0.3)
    fill.position.set(-10, 10, -10)
    scene.add(fill)

    // Ground / Road
    const roadGeo = new THREE.PlaneGeometry(12, 200)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
    const road = new THREE.Mesh(roadGeo, roadMat)
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

    // Grass / sides
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50 })
    const leftGrass = new THREE.Mesh(new THREE.PlaneGeometry(20, 200), grassMat)
    leftGrass.rotation.x = -Math.PI / 2
    leftGrass.position.set(-16, -0.01, 50)
    scene.add(leftGrass)

    const rightGrass = new THREE.Mesh(new THREE.PlaneGeometry(20, 200), grassMat)
    rightGrass.rotation.x = -Math.PI / 2
    rightGrass.position.set(16, -0.01, 50)
    scene.add(rightGrass)

    // Colorful buildings on sides
    const buildingColors = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0xA8E6CF, 0xFF8A5C, 0x7C4DFF, 0xFF4081, 0x00BCD4]
    const gs = gameStateRef.current
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
      const bx = side * (8 + Math.random() * 4)
      building.position.set(bx, bh / 2, z)
      building.castShadow = true
      building.receiveShadow = true
      scene.add(building)
      gs.buildings.push(building)
    }

    // Car - simplified 3D car
    const carGroup = new THREE.Group()

    // Car body
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.3, metalness: 0.3 })
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 3.5), bodyMat)
    body.position.y = 0.35
    body.castShadow = true
    carGroup.add(body)

    // Car cabin (windshield area)
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.1, metalness: 0.8 })
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.5), cabinMat)
    cabin.position.set(0, 0.7, -0.3)
    carGroup.add(cabin)

    // Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
    const wheelPositions = [
      [-1, 0.15, 1.2],
      [1, 0.15, 1.2],
      [-1, 0.15, -1.2],
      [1, 0.15, -1.2],
    ]
    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 12), wheelMat)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(x, y, z)
      carGroup.add(wheel)
    })

    // Headlights
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffaa, emissive: 0xffffaa, emissiveIntensity: 0.3 })
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), lightMat)
    hl.position.set(-0.5, 0.3, 1.8)
    carGroup.add(hl)
    const hr = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), lightMat)
    hr.position.set(0.5, 0.3, 1.8)
    carGroup.add(hr)

    carGroup.position.set(0, 0, 3)
    scene.add(carGroup)

    gs.carGroup = carGroup

    // Trees on sides (colorful spheres)
    for (let z = 0; z < 200; z += 6) {
      const side = Math.random() > 0.5 ? 1 : -1
      const treeColors = [0x66BB6A, 0x43A047, 0x81C784, 0x2E7D32, 0xE91E63, 0x9C27B0, 0xFF9800]
      const tc = treeColors[Math.floor(Math.random() * treeColors.length)]
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 1),
        new THREE.MeshStandardMaterial({ color: 0x795548 })
      )
      trunk.position.set(side * (9 + Math.random() * 3), 0.5, z)
      scene.add(trunk)

      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(0.8 + Math.random() * 0.5, 8, 8),
        new THREE.MeshStandardMaterial({ color: tc })
      )
      foliage.position.set(side * (9 + Math.random() * 3), 1.2 + Math.random() * 0.5, z)
      scene.add(foliage)
    }

    // Stars / sparkles in the sky (colorful points)
    const sparkleGeo = new THREE.BufferGeometry()
    const sparkleCount = 200
    const positions = new Float32Array(sparkleCount * 3)
    const colors = new Float32Array(sparkleCount * 3)
    for (let i = 0; i < sparkleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = 20 + Math.random() * 30
      positions[i * 3 + 2] = Math.random() * 100
      colors[i * 3] = Math.random()
      colors[i * 3 + 1] = Math.random()
      colors[i * 3 + 2] = Math.random()
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    sparkleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const sparkleMat = new THREE.PointsMaterial({ size: 0.3, vertexColors: true, transparent: true, opacity: 0.6 })
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat)
    scene.add(sparkles)

    // Animation loop
    let obstacleTimer = 0
    let lastObstacleZ = 0

    const animate = () => {
      const gs = gameStateRef.current
      if (!gs.started || gs.gameOver) {
        animFrameRef.current = requestAnimationFrame(animate)
        renderer.render(scene, camera)
        return
      }

      const keys = keysRef.current

      // Car movement
      if (keys.left) gs.carX -= 0.08
      if (keys.right) gs.carX += 0.08
      gs.carX = Math.max(-4.5, Math.min(4.5, gs.carX))
      carGroup.position.x = gs.carX

      // Speed increase over time
      gs.speed = Math.min(0.15 + gs.score * 0.002, 0.5)

      // Move world elements (buildings, trees, road markings)
      const worldObjects = []
      scene.children.forEach(child => {
        if (child.isMesh && child !== road && child !== leftGrass && child !== rightGrass) {
          worldObjects.push(child)
        }
      })

      // Move everything that's not the car, lights, or helpers
      scene.children.forEach(child => {
        if (child === carGroup || child === road || child === leftGrass || child === rightGrass) return
        if (child.isMesh || child.isPoints || child.isGroup) {
          child.position.z -= gs.speed
          if (child.position.z < -5) {
            // Reset obstacles
            if (child.userData.isObstacle) {
              child.position.z = 80 + Math.random() * 40
              child.position.x = (Math.random() - 0.5) * 7
            } else if (child !== sun && child !== ambient && child !== fill) {
              child.position.z = 100 + Math.random() * 80
              // Re-randomize building color
              if (child.isMesh && child.material && child.material.color && buildingColors.includes(child.material.color.getHex())) {
                child.material.color.setHex(buildingColors[Math.floor(Math.random() * buildingColors.length)])
              }
            }
          }
        }
      })

      // Spawn obstacles
      obstacleTimer += gs.speed
      if (obstacleTimer > 5) {
        obstacleTimer = 0
        const obstacleColors = [0xFF5252, 0xFF4081, 0xE040FB, 0x7C4DFF]
        const obs = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({
            color: obstacleColors[Math.floor(Math.random() * obstacleColors.length)],
            emissive: 0xffffff,
            emissiveIntensity: 0.2,
          })
        )
        obs.position.set((Math.random() - 0.5) * 6, 0.5, 80)
        obs.userData.isObstacle = true
        scene.add(obs)
        gs.obstacles.push(obs)
      }

      // Collision detection
      const carBox = new THREE.Box3().setFromObject(carGroup)
      gs.obstacles.forEach(obs => {
        if (!obs) return
        const obsBox = new THREE.Box3().setFromObject(obs)
        if (carBox.intersectsBox(obsBox)) {
          endGame()
        }
      })

      // Score
      gs.score += 0.01
      setScore(Math.floor(gs.score))

      renderer.render(scene, camera)
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Keyboard controls
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true
      if (e.key === ' ') { e.preventDefault(); startGame() }
    }
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [startGame, endGame])

  return (
    <div className="car-game-overlay">
      <div className="car-game-container">
        <div className="car-game-header">
          <h2>🏎️ 3D Drive</h2>
          <div className="car-game-hud">
            <span>Score: {score}</span>
          </div>
          <button className="car-game-close" onClick={onClose}>✕</button>
        </div>

        <div className="car-game-canvas" ref={mountRef}>
          {!started && !gameOver && (
            <div className="car-game-start">
              <h3>Colorful 3D Drive</h3>
              <p>Dodge the obstacles! Use <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd></p>
              <button className="car-game-btn" onClick={startGame}>Start Game</button>
            </div>
          )}
          {gameOver && (
            <div className="car-game-start">
              <h3>💥 Game Over!</h3>
              <p className="car-game-final-score">Score: {Math.floor(score)}</p>
              <button className="car-game-btn" onClick={startGame}>Play Again</button>
            </div>
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
    </div>
  )
}

export default CarGame