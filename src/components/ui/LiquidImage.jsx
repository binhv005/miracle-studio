import { useEffect, useRef, useState } from 'react'
import { getLenis, prefersReducedMotion } from '../../lib/smooth.js'
import { Photo } from './primitives.jsx'

// Fragment shader adapted from k95.it (liquid domain-warp + rising "tear" band),
// with object-fit: cover handled in UV space. Plain WebGL1, no 3D library.
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
precision highp float;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uIntensity;
uniform float uLiquid;
uniform vec2  uResolution;
uniform vec4  uCover; // xy = visible fraction, zw = offset
varying vec2 vUv;

float rand(vec2 c) { return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453123); }

void main() {
  vec2 uv = vUv;
  float gY = uv.y;

  vec2 liquid;
  liquid.x = sin(gY * 6.0 + uTime * 1.1) * 0.022
           + sin(gY * 13.0 - uTime * 0.7) * 0.012
           + sin(uv.x * 4.0 + uTime * 0.6) * 0.010;
  liquid.y = sin(uv.x * 5.0 - uTime * 0.9) * 0.016
           + cos(gY * 9.0 + uTime * 1.3) * 0.010;

  float line = floor(gY * uResolution.y / 3.0);
  float t = floor(uTime * 10.0);
  float bandPos = fract(gY * 0.8 - uTime * 0.12);
  float band = smoothstep(0.0, 0.06, bandPos) * smoothstep(0.34, 0.12, bandPos);
  float wave = sin(gY * 7.0 - uTime * 3.0) * 0.16
             + sin(gY * 23.0 - uTime * 6.0) * 0.05;
  float chaos = (rand(vec2(line * 0.37, t)) - 0.5) * 0.22;
  float bigTear = (wave + chaos) * band;

  float shiftX = (bigTear * uIntensity + liquid.x * uLiquid * band) * 0.6;
  float shiftY = liquid.y * uLiquid * band * 0.6;
  // Gentle overall drift so the photo feels alive even outside the band.
  vec2 warped = uv + vec2(shiftX, shiftY) + liquid * uLiquid * 0.12;

  vec2 texUv = uCover.zw + clamp(warped, 0.0, 1.0) * uCover.xy;
  gl_FragColor = texture2D(uTexture, texUv);
}`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
  return s
}

/**
 * Photo rendered through the k95 liquid-tear shader. Falls back to a normal <img>
 * when WebGL is unavailable or reduced motion is requested.
 * `intensity` = tear strength, `liquid` = wave strength. Scroll speed and hover boost both.
 */
export default function LiquidImage({ image, alt, position = '50% 50%', intensity = 0.35, liquid = 0.6, eager = false, sizes = '100vw', className = '' }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const cv = canvas.current
    const gl = cv.getContext('webgl', { premultipliedAlpha: false, antialias: false })
    if (!gl) return

    let raf = 0
    let disposed = false
    let visible = true
    let hover = 0
    let hoverTarget = 0
    const [px, py] = position.split(' ').map((v) => parseFloat(v) / 100)

    const prog = gl.createProgram()
    try {
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
    } catch (e) {
      console.warn('[LiquidImage]', e)
      return
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    const u = (n) => gl.getUniformLocation(prog, n)
    const uTime = u('uTime'), uInt = u('uIntensity'), uLiq = u('uLiquid'), uRes = u('uResolution'), uCover = u('uCover')

    const tex = gl.createTexture()
    const img = new Image()
    img.decoding = 'async'
    img.src = image.src

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const w = cv.clientWidth, h = cv.clientHeight
      if (!w || !h) return
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      gl.viewport(0, 0, cv.width, cv.height)
      gl.uniform2f(uRes, cv.width, cv.height)
      // object-fit: cover + object-position, in texture space (texture is flipped so y=1 is the top)
      const s = Math.max(w / image.w, h / image.h)
      const fx = w / (image.w * s), fy = h / (image.h * s)
      gl.uniform4f(uCover, fx, fy, (1 - fx) * px, (1 - fy) * (1 - py))
    }

    const start = performance.now()
    const render = () => {
      raf = requestAnimationFrame(render)
      if (!visible || document.hidden) return
      hover += (hoverTarget - hover) * 0.06
      const v = Math.min(Math.abs(getLenis()?.velocity || 0) / 40, 1)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform1f(uInt, intensity * (1 + v * 1.6 + hover * 1.4))
      gl.uniform1f(uLiq, liquid * (1 + v + hover))
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    img.onload = () => {
      if (disposed) return
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      resize()
      render()
      setReady(true)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(cv)
    // Overlays sit above the canvas, so listen on the whole section for hover.
    const el = wrap.current.closest('section') || wrap.current
    const enter = () => (hoverTarget = 1)
    const leave = () => (hoverTarget = 0)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [image, position, intensity, liquid])

  return (
    <div ref={wrap} className={`absolute inset-0 ${className}`}>
      {/* The <img> stays for SEO / no-WebGL and until the texture is ready */}
      <Photo image={image} alt={alt} position={position} eager={eager} sizes={sizes} className={`transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`} />
      <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  )
}
