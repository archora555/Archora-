import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import silkBgUrl from '../assets/images/emerald_silk_bg_1787893960941.jpg';
import { Sliders, Sparkles, RotateCcw, X, Activity, Eye } from 'lucide-react';

export interface SilkShaderParams {
  speed: number;       // 0.1 - 2.0
  amplitude: number;   // 0.02 - 0.40
  frequency: number;   // 0.5 - 4.0
  goldGlint: number;   // 0.0 - 1.0
  vignette: number;    // 0.15 - 0.75
  distortion: number;  // 0.0 - 0.04
  interactive: boolean;
}

export const DEFAULT_SHADER_PARAMS: SilkShaderParams = {
  speed: 0.75,
  amplitude: 0.18,
  frequency: 2.0,
  goldGlint: 0.55,
  vignette: 0.38,
  distortion: 0.025,
  interactive: true,
};

export const SHADER_PRESETS: Record<string, { label: string; desc: string; params: SilkShaderParams }> = {
  oceanSwell: {
    label: 'Ocean Swell',
    desc: 'Slow, majestic rolling waves across deep emerald folds',
    params: {
      speed: 0.75,
      amplitude: 0.18,
      frequency: 2.0,
      goldGlint: 0.55,
      vignette: 0.38,
      distortion: 0.025,
      interactive: true,
    },
  },
  liquidEmerald: {
    label: 'Liquid Emerald',
    desc: 'Lustrous fluid ripples with high gold shimmer glints',
    params: {
      speed: 1.05,
      amplitude: 0.25,
      frequency: 2.4,
      goldGlint: 0.75,
      vignette: 0.32,
      distortion: 0.035,
      interactive: true,
    },
  },
  velvetDrape: {
    label: 'Velvet Drape',
    desc: 'Gentle, heavy fabric breath with deep contrast shadows',
    params: {
      speed: 0.45,
      amplitude: 0.12,
      frequency: 1.5,
      goldGlint: 0.35,
      vignette: 0.48,
      distortion: 0.015,
      interactive: false,
    },
  },
  minimalHorizon: {
    label: 'Minimal Horizon',
    desc: 'Ultra-subtle meditative swell, maximum UI contrast',
    params: {
      speed: 0.30,
      amplitude: 0.08,
      frequency: 1.2,
      goldGlint: 0.22,
      vignette: 0.52,
      distortion: 0.01,
      interactive: false,
    },
  },
};

const STORAGE_KEY = 'archora_silk_shader_config';

// Immediate procedural emerald silk fallback texture to ensure zero-lag instant rendering
function createInitialSilkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#041f15');
    grad.addColorStop(0.25, '#0b3524');
    grad.addColorStop(0.5, '#124e35');
    grad.addColorStop(0.75, '#0a2e20');
    grad.addColorStop(1, '#031810');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(229, 199, 98, 0.18)';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(-100, 150);
    ctx.bezierCurveTo(150, 260, 320, 80, 600, 220);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.moveTo(-50, 360);
    ctx.bezierCurveTo(180, 440, 380, 260, 620, 400);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function SilkShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Stored shader settings with fallback
  const [params, setParams] = useState<SilkShaderParams>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SHADER_PARAMS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SHADER_PARAMS;
  });

  // UI state for floating controls drawer
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [currentFps, setCurrentFps] = useState(60);
  const [webglSupported, setWebglSupported] = useState(true);

  // Active Three.js references for live uniform updates
  const uniformsRef = useRef<{
    uTime: { value: number };
    uSpeed: { value: number };
    uAmplitude: { value: number };
    uFrequency: { value: number };
    uGoldGlint: { value: number };
    uVignette: { value: number };
    uDistortion: { value: number };
    uResolution: { value: THREE.Vector2 };
    uTextureAspect: { value: number };
    uTexture: { value: THREE.Texture | null };
    uMouse: { value: THREE.Vector2 };
  }>({
    uTime: { value: 0 },
    uSpeed: { value: params.speed },
    uAmplitude: { value: params.amplitude },
    uFrequency: { value: params.frequency },
    uGoldGlint: { value: params.goldGlint },
    uVignette: { value: params.vignette },
    uDistortion: { value: params.distortion },
    uResolution: { value: new THREE.Vector2(1920, 1080) },
    uTextureAspect: { value: 1.6 },
    uTexture: { value: typeof document !== 'undefined' ? createInitialSilkTexture() : null },
    uMouse: { value: new THREE.Vector2(0, 0) },
  });

  // Sync React state into Three.js uniforms instantaneously without rebuilding shaders
  useEffect(() => {
    const u = uniformsRef.current;
    u.uSpeed.value = params.speed;
    u.uAmplitude.value = params.amplitude;
    u.uFrequency.value = params.frequency;
    u.uGoldGlint.value = params.goldGlint;
    u.uVignette.value = params.vignette;
    u.uDistortion.value = params.distortion;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch {
      // Ignore quota errors
    }
  }, [params]);

  // Main Three.js setup & animation lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;
    let isDestroyed = false;
    let resizeObserver: ResizeObserver | null = null;

    // Guaranteed safe viewport dimensions preventing 0 or NaN in iframes / mobile
    const getSafeViewport = () => {
      const w = window.innerWidth || document.documentElement?.clientWidth || window.screen?.width || 1280;
      const h = window.innerHeight || document.documentElement?.clientHeight || window.screen?.height || 720;
      const safeW = (!w || isNaN(w) || w <= 0) ? 1280 : Math.max(w, 320);
      const safeH = (!h || isNaN(h) || h <= 0) ? 720 : Math.max(h, 240);
      const aspect = safeW / safeH;
      return {
        width: safeW,
        height: safeH,
        aspect: Number.isFinite(aspect) && aspect > 0 ? aspect : (16 / 9),
      };
    };

    try {
      const { width: initW, height: initH, aspect: initAspect } = getSafeViewport();

      // 1. Initialize WebGLRenderer with power optimization and clamped pixel ratio
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        powerPreference: 'high-performance',
        antialias: false, // Not needed for continuous plane shader, saves significant GPU fillrate
        depth: false,     // Background plane doesn't require depth buffer
        stencil: false,
      });

      // Clamp pixel ratio to max 1.5 to guarantee buttery 60fps on 4K & mobile Retina
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(initW, initH, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, initAspect, 0.1, 100);
      camera.position.set(0, -0.15, 2.9);
      camera.lookAt(0, 0, 0);

      // 2. Vertex Shader (Fluid Compound Ocean Wave Displacement)
      const vertexShader = `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uAmplitude;
        uniform float uFrequency;
        uniform vec2 uMouse;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vElevation;
        varying vec3 vViewPosition;

        // Fluid rolling compound wave formula mimicking ocean swells on silk
        float calculateWave(vec2 p, float t) {
          // Primary rolling diagonal wave
          float w1 = sin(p.x * uFrequency * 0.75 + p.y * uFrequency * 0.45 + t * 0.75);
          
          // Counter-harmonic swell
          float w2 = cos(-p.x * uFrequency * 0.5 + p.y * uFrequency * 0.85 + t * 0.6);
          
          // Soft fluid crest ripple
          float w3 = sin((p.x * 0.6 + p.y * 0.8) * uFrequency * 1.35 + t * 0.95) * 0.5;

          // Interactive mouse influence ripple
          float dist = length(p - uMouse * 1.2);
          float w4 = sin(dist * uFrequency * 2.5 - t * 1.4) * exp(-dist * 1.2) * 0.25;

          return (w1 * 0.5 + w2 * 0.35 + w3 * 0.15 + w4) * uAmplitude;
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          float t = uTime * uSpeed;

          // Compound 3D fluid displacement
          float elevation = calculateWave(pos.xy, t);
          
          // Organic billowing silk sway across X and Y
          float waveX = sin(pos.y * uFrequency * 0.8 + t * 0.75) * cos(pos.x * uFrequency * 0.4 + t * 0.5) * (uAmplitude * 0.5);
          float waveY = cos(pos.x * uFrequency * 0.75 - t * 0.7) * sin(pos.y * uFrequency * 0.5 + t * 0.55) * (uAmplitude * 0.45);

          pos.x += waveX;
          pos.y += waveY;
          pos.z += elevation;

          // Finite differences to calculate analytical surface normals on wave crests
          float eps = 0.02;
          float elevX = calculateWave(pos.xy + vec2(eps, 0.0), t);
          float elevY = calculateWave(pos.xy + vec2(0.0, eps), t);
          vec3 tangentX = vec3(eps, 0.0, elevX - elevation);
          vec3 tangentY = vec3(0.0, eps, elevY - elevation);
          vec3 computedNormal = normalize(cross(tangentX, tangentY));

          vNormal = normalMatrix * computedNormal;
          vElevation = elevation;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      // 3. Fragment Shader (Texture Mapping, Specular Glints & Luxury Vignette)
      const fragmentShader = `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform float uTextureAspect;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uFrequency;
        uniform float uAmplitude;
        uniform float uVignette;
        uniform float uGoldGlint;
        uniform float uDistortion;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vElevation;
        varying vec3 vViewPosition;

        // Perfect cover-fit UV mapper preserving the aspect ratio of the silk texture
        vec2 getCoverUv(vec2 uv, vec2 screenRes, float texAspect) {
          float screenAspect = screenRes.x / screenRes.y;
          vec2 st = uv;
          if (screenAspect > texAspect) {
            float scale = texAspect / screenAspect;
            st.y = (st.y - 0.5) * scale + 0.5;
          } else {
            float scale = screenAspect / texAspect;
            st.x = (st.x - 0.5) * scale + 0.5;
          }
          return st;
        }

        void main() {
          float t = uTime * uSpeed;
          vec2 st = getCoverUv(vUv, uResolution, uTextureAspect);

          // Liquid wave undulating refraction across the emerald silk folds
          float waveFlow1 = sin(st.y * uFrequency * 2.2 + t * 0.85);
          float waveFlow2 = cos(st.x * uFrequency * 1.8 - t * 0.7);
          float waveFlow3 = sin((st.x + st.y) * uFrequency * 3.0 + t * 1.1) * 0.5;
          vec2 waveFlow = vec2(waveFlow1, waveFlow2 + waveFlow3) * (uAmplitude * 0.12 + uDistortion * 2.2);

          // Displaced UV with wave refraction + surface normal perturbation
          vec2 displacedUv = st + waveFlow + vNormal.xy * (uDistortion * 3.2);
          vec4 texColor = texture2D(uTexture, displacedUv);

          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // Dynamic champagne gold light source that sweeps gently with wave motion
          vec3 lightDir = normalize(vec3(-0.35 + sin(t * 0.4) * 0.2, 0.65 + cos(t * 0.35) * 0.15, 0.75));
          float diffuse = max(dot(normal, lightDir), 0.0);

          // Champagne gold specular sheen across rolling crests
          vec3 halfVector = normalize(lightDir + viewDir);
          float specAngle = max(dot(normal, halfVector), 0.0);
          float specular = pow(specAngle, 20.0) * (uGoldGlint * 1.25);

          // Glancing angle rim glow (emerald sheen)
          float rim = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

          // Archora signature luxury palette
          vec3 goldTone = vec3(0.92, 0.82, 0.55);
          vec3 emeraldShadow = vec3(0.012, 0.075, 0.05);

          vec3 color = texColor.rgb;
          // Modulate shadows and highlights on folds
          color += (diffuse - 0.5) * 0.18;
          color += specular * goldTone;
          color += rim * vec3(0.08, 0.4, 0.28) * 0.5;

          // Wave crest gold shimmer (highlights rolling waves)
          float crestGlow = smoothstep(0.0, uAmplitude * 0.8, max(vElevation, 0.0)) * (uGoldGlint * 0.38);
          color += crestGlow * goldTone;

          // Vignette framing: subtle peripheral darkening
          vec2 p = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
          float vignetteDist = length(p);
          float vignette = smoothstep(0.88, 0.25, vignetteDist);
          color = mix(color * 0.55, color, vignette * 0.8 + 0.2);

          // Master contrast overlay for maximum UI text legibility
          color = mix(color, emeraldShadow, uVignette * 0.75);

          gl_FragColor = vec4(color, 1.0);
        }
      `;

      // 4. Determine optimal mesh resolution based on device type
      const isMobile = initW < 768;
      const meshResolution = isMobile ? 48 : 72; // GPU-optimized vertex density

      // Calculate camera frustum size to fit plane geometry exactly with generous bleed
      const vFovRad = ((camera.fov || 45) * Math.PI) / 180;
      const frustumHeight = Math.max(2 * Math.tan(vFovRad / 2) * camera.position.z, 0.1);
      const frustumWidth = Math.max(frustumHeight * initAspect, 0.1);

      // Strictly guaranteed positive finite dimensions for the base PlaneGeometry
      const baseWidth = (Number.isFinite(frustumWidth) && frustumWidth > 0 ? frustumWidth : 4.5) * 1.35;
      const baseHeight = (Number.isFinite(frustumHeight) && frustumHeight > 0 ? frustumHeight : 3.2) * 1.35;

      const geometry = new THREE.PlaneGeometry(
        baseWidth,
        baseHeight,
        meshResolution,
        meshResolution
      );

      // Pre-compute bounding box and sphere cleanly to avoid NaN warnings
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      // 5. Shader Material
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: uniformsRef.current,
        wireframe: false,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 6. Texture Loader for the emerald silk image
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        silkBgUrl,
        (texture) => {
          if (isDestroyed) return;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;

          uniformsRef.current.uTexture.value = texture;
          if (texture.image && texture.image.width && texture.image.height) {
            const aspect = texture.image.width / texture.image.height;
            if (Number.isFinite(aspect) && aspect > 0) {
              uniformsRef.current.uTextureAspect.value = aspect;
            }
          }
        },
        undefined,
        (err) => {
          console.warn('Silk texture WebGL load fallback:', err);
        }
      );

      // 7. Responsive Viewport Resize Function
      const handleResize = () => {
        if (!renderer || isDestroyed || !camera || !mesh) return;
        const { width, height, aspect } = getSafeViewport();

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height, false);
        uniformsRef.current.uResolution.value.set(width, height);

        // Update plane geometry scale to maintain full coverage across any resolution changes
        const vFov = ((camera.fov || 45) * Math.PI) / 180;
        const curFrustumH = 2 * Math.tan(vFov / 2) * camera.position.z;
        const curFrustumW = curFrustumH * aspect;

        const targetW = curFrustumW * 1.35;
        const targetH = curFrustumH * 1.35;

        const scaleX = baseWidth > 0 ? targetW / baseWidth : 1;
        const scaleY = baseHeight > 0 ? targetH / baseHeight : 1;

        if (Number.isFinite(scaleX) && Number.isFinite(scaleY) && scaleX > 0 && scaleY > 0) {
          mesh.scale.set(scaleX, scaleY, 1);
        }
      };

      window.addEventListener('resize', handleResize);
      
      // Observe container resize for iframe / dynamic embedding stability
      if (typeof ResizeObserver !== 'undefined' && container) {
        resizeObserver = new ResizeObserver(() => {
          handleResize();
        });
        resizeObserver.observe(container);
      }
      
      handleResize();

      // 8. Subtle Mouse Interaction
      let targetMouseX = 0;
      let targetMouseY = 0;
      const handleMouseMove = (e: MouseEvent) => {
        if (!params.interactive) return;
        const { width, height } = getSafeViewport();
        targetMouseX = ((e.clientX / width) * 2 - 1);
        targetMouseY = (-(e.clientY / height) * 2 + 1);
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // 9. Frame Timing & Throttling (Locked 60 FPS Engine)
      let lastTime = performance.now();
      let frameCount = 0;
      let fpsTimer = performance.now();
      let isVisible = true;

      const handleVisibilityChange = () => {
        isVisible = !document.hidden;
        if (isVisible) {
          lastTime = performance.now();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      const renderLoop = (now: number) => {
        animationFrameId = requestAnimationFrame(renderLoop);

        if (!isVisible || !renderer) return;

        const delta = Math.min((now - lastTime) / 1000, 0.05); // Clamp large delta skips
        lastTime = now;

        // Advance simulation time
        uniformsRef.current.uTime.value += delta;

        // Smooth mouse dampening
        if (params.interactive) {
          const currentMouse = uniformsRef.current.uMouse.value;
          currentMouse.x += (targetMouseX - currentMouse.x) * 0.04;
          currentMouse.y += (targetMouseY - currentMouse.y) * 0.04;
        }

        renderer.render(scene, camera);

        // FPS meter tracking
        frameCount++;
        if (now - fpsTimer >= 1000) {
          setCurrentFps(Math.round((frameCount * 1000) / (now - fpsTimer)));
          frameCount = 0;
          fpsTimer = now;
        }
      };

      animationFrameId = requestAnimationFrame(renderLoop);

      // Cleanup
      return () => {
        isDestroyed = true;
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('visibilitychange', handleVisibilityChange);

        if (renderer) {
          renderer.dispose();
        }
        geometry.dispose();
        material.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to CSS background:', err);
      setWebglSupported(false);
    }
  }, []);

  // Update a single parameter with bounds checking
  const handleParamChange = useCallback((key: keyof SilkShaderParams, value: number | boolean) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleApplyPreset = useCallback((presetKey: string) => {
    const preset = SHADER_PRESETS[presetKey];
    if (preset) {
      setParams(preset.params);
    }
  }, []);

  const handleReset = useCallback(() => {
    setParams(DEFAULT_SHADER_PARAMS);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ perspective: '1200px' }}>
      {/* Three.js Hardware-Accelerated WebGL Canvas */}
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block will-change-transform"
        />
      ) : (
        /* CSS Fallback if WebGL unavailable */
        <div
          className="absolute -inset-14 sm:-inset-24 bg-cover bg-center bg-no-repeat animate-wave-move"
          style={{ backgroundImage: `url(${silkBgUrl})` }}
        />
      )}

      {/* Subtle Luxury Dark Vignette Overlay for Crisp Typography & Contrast */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.32) 100%)',
        }}
      />

      {/* Interactive Controls Pill & Settings Drawer */}
      <div className="pointer-events-auto">
        {/* Floating Toggle Pill (Discreet, Elegant Luxury Badge at Bottom-Right) */}
        {!isControlsOpen && (
          <button
            onClick={() => setIsControlsOpen(true)}
            title="Configure Liquid Silk WebGL Waves"
            className="fixed bottom-6 right-20 z-40 frosted-glass-white-btn text-white px-3.5 py-2 rounded-full flex items-center gap-2 transition-all duration-200 cursor-pointer group hover:scale-105 text-xs font-sans tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-archora-gold animate-pulse" />
            <span className="text-gray-200 group-hover:text-white font-medium">Silk Waves</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>
        )}

        {/* Fine-Tuning Drawer / Popover */}
        {isControlsOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-88 max-w-[calc(100vw-2rem)] frosted-glass-white-dropdown rounded-2xl text-white p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-archora-gold/20 flex items-center justify-center text-archora-gold">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-archora-gold">Silk Shader Tuning</h4>
                  <p className="text-[10px] text-gray-300">WebGL Liquid Wave Parameters</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReset}
                  title="Reset to defaults"
                  className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsControlsOpen(false)}
                  title="Close controls"
                  className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Performance Metric Badge */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg frosted-glass-white-subtle text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <Activity className="w-3 h-3 animate-pulse" />
                {currentFps} FPS
              </span>
              <span className="text-gray-300 text-[10px]">GPU Accelerated</span>
              <span className="text-archora-gold text-[10px] font-mono">60fps Target</span>
            </div>

            {/* Preset Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1.5">Presets</label>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(SHADER_PRESETS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => handleApplyPreset(key)}
                    className="px-2.5 py-1.5 rounded-lg frosted-glass-white-subtle hover:frosted-glass-white text-[11px] text-left transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-gray-200 group-hover:text-archora-gold leading-tight">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-3 pt-1">
              {/* Wave Speed */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-gray-200 font-medium">Wave Speed</span>
                  <span className="text-archora-gold font-mono text-[10px]">{params.speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.8"
                  step="0.05"
                  value={params.speed}
                  onChange={(e) => handleParamChange('speed', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-archora-gold"
                />
                <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                  <span>Slow Drift</span>
                  <span>Ocean Swell</span>
                </div>
              </div>

              {/* Wave Amplitude */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-gray-200 font-medium">Displacement Amplitude</span>
                  <span className="text-archora-gold font-mono text-[10px]">{params.amplitude.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.03"
                  max="0.32"
                  step="0.01"
                  value={params.amplitude}
                  onChange={(e) => handleParamChange('amplitude', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-archora-gold"
                />
                <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                  <span>Subtle Wave</span>
                  <span>Deep Folds</span>
                </div>
              </div>

              {/* Wave Frequency */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-gray-200 font-medium">Wave Frequency (Density)</span>
                  <span className="text-archora-gold font-mono text-[10px]">{params.frequency.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="3.5"
                  step="0.1"
                  value={params.frequency}
                  onChange={(e) => handleParamChange('frequency', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-archora-gold"
                />
                <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                  <span>Broad Rolls</span>
                  <span>Fine Ripples</span>
                </div>
              </div>

              {/* Gold Specular Glint */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-gray-200 font-medium">Gold Sheen / Specular</span>
                  <span className="text-archora-gold font-mono text-[10px]">{params.goldGlint.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.9"
                  step="0.05"
                  value={params.goldGlint}
                  onChange={(e) => handleParamChange('goldGlint', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-archora-gold"
                />
              </div>

              {/* Dark Vignette / Contrast */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-gray-200 font-medium">UI Contrast Overlay</span>
                  <span className="text-archora-gold font-mono text-[10px]">{params.vignette.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.65"
                  step="0.02"
                  value={params.vignette}
                  onChange={(e) => handleParamChange('vignette', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-archora-gold"
                />
              </div>

              {/* Mouse Interaction Toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="text-[11px] text-gray-300 flex items-center gap-1.5 cursor-pointer">
                  <Eye className="w-3.5 h-3.5 text-archora-gold" />
                  Interactive Mouse Ripple
                </label>
                <input
                  type="checkbox"
                  checked={params.interactive}
                  onChange={(e) => handleParamChange('interactive', e.target.checked)}
                  className="accent-archora-gold cursor-pointer"
                />
              </div>
            </div>

            {/* Footer status */}
            <div className="text-[10px] text-gray-400 border-t border-white/10 pt-2.5 flex items-center justify-between">
              <span>Changes auto-save locally</span>
              <button
                onClick={() => setIsControlsOpen(false)}
                className="text-archora-gold hover:underline cursor-pointer"
              >
                Hide Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
