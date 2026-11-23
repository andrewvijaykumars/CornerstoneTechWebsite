// Hero globe in raw WebGL (no three.js): a few KB instead of ~120 KB gzipped, with near-zero start-up cost.
interface Options {
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
}

type Mat = Float32Array;

const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// --- minimal column-major 4x4 matrix helpers ---
const ident = (): Mat => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
const mul = (a: Mat, b: Mat): Mat => {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
};
const persp = (fovy: number, aspect: number, n: number, f: number): Mat => {
  const t = 1 / Math.tan(fovy / 2);
  const m = new Float32Array(16);
  m[0] = t / aspect;
  m[5] = t;
  m[10] = (f + n) / (n - f);
  m[11] = -1;
  m[14] = (2 * f * n) / (n - f);
  return m;
};
const translate = (x: number, y: number, z: number): Mat => {
  const m = ident();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
};
const scaleM = (s: number): Mat => {
  const m = ident();
  m[0] = m[5] = m[10] = s;
  return m;
};
const rotX = (a: number): Mat => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const m = ident();
  m[5] = c;
  m[6] = s;
  m[9] = -s;
  m[10] = c;
  return m;
};
const rotY = (a: number): Mat => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const m = ident();
  m[0] = c;
  m[2] = -s;
  m[8] = s;
  m[10] = c;
  return m;
};

// --- shaders ---
const POINT_VS = `
attribute vec3 aPos; attribute float aSeed;
uniform mat4 uMVP, uModel; uniform float uTime, uSize, uPR, uScale, uHorizon;
varying float vF, vTw, vVis; varying vec3 vCol;
void main() {
  vec3 n = normalize(mat3(uModel) * aPos);
  vVis = smoothstep(uHorizon - 0.04, uHorizon + 0.08, n.z);
  vF = smoothstep(uHorizon, 0.95, n.z);
  vTw = 0.65 + 0.35 * sin(uTime * 1.4 + aSeed * 60.0);
  vec3 a = vec3(0.39, 0.40, 0.95), b = vec3(0.13, 0.83, 0.93), c = vec3(0.20, 0.85, 0.60);
  vCol = mix(mix(a, b, smoothstep(-1.0, 0.2, aPos.y)), c, smoothstep(0.3, 1.0, aPos.y) * 0.7);
  vec4 clip = uMVP * vec4(aPos, 1.0);
  gl_PointSize = uSize * uScale * uPR * (0.55 + 0.9 * aSeed) * (0.8 + 0.6 * vF) / clip.w;
  gl_Position = clip;
}`;
const POINT_FS = `
precision mediump float;
varying float vF, vTw, vVis; varying vec3 vCol;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vCol * (0.7 + 0.7 * vF), a * (0.2 + 0.8 * vF) * vTw * vVis);
}`;
const ARC_VS = `
attribute vec3 aPos; attribute float aT, aOff;
uniform mat4 uMVP, uModel; uniform float uScale, uHorizon;
varying float vT, vOff, vVis;
void main() {
  vec3 w = mat3(uModel) * aPos / uScale;
  vVis = smoothstep(uHorizon - 0.04, uHorizon + 0.08, w.z);
  vT = aT; vOff = aOff;
  gl_Position = uMVP * vec4(aPos, 1.0);
}`;
const ARC_FS = `
precision mediump float;
uniform float uTime;
varying float vT, vOff, vVis;
void main() {
  float head = fract(uTime * 0.16 + vOff);
  float d = head - vT;
  d = d < 0.0 ? d + 1.0 : d;
  float trail = exp(-d * 7.0);
  float ends = sin(3.14159 * vT);
  vec3 col = mix(vec3(0.13, 0.83, 0.93), vec3(0.45, 1.0, 0.8), trail);
  gl_FragColor = vec4(col, (0.07 + trail * 0.9) * ends * vVis);
}`;
const HUB_VS = `
attribute vec3 aPos; attribute float aSeed;
uniform mat4 uMVP, uModel; uniform float uTime, uPR, uScale, uHorizon;
varying float vP, vVis;
void main() {
  vec3 n = normalize(mat3(uModel) * aPos);
  vVis = smoothstep(uHorizon - 0.04, uHorizon + 0.08, n.z);
  vP = 0.5 + 0.5 * sin(uTime * 2.0 + aSeed * 20.0);
  vec4 clip = uMVP * vec4(aPos, 1.0);
  gl_PointSize = (26.0 + 14.0 * vP) * uScale * uPR / clip.w;
  gl_Position = clip;
}`;
const HUB_FS = `
precision mediump float;
varying float vP, vVis;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float core = smoothstep(0.16, 0.0, d);
  float halo = smoothstep(0.5, 0.0, d) * 0.45;
  gl_FragColor = vec4(mix(vec3(0.13, 0.83, 0.93), vec3(1.0), core), (core + halo) * (0.6 + 0.4 * vP) * vVis);
}`;
const LINE_VS = `
attribute vec3 aPos; uniform mat4 uMVP;
void main() { gl_Position = uMVP * vec4(aPos, 1.0); }`;
const LINE_FS = `
precision mediump float; uniform vec4 uColor;
void main() { gl_FragColor = uColor; }`;
const DUST_VS = `
attribute vec3 aPos; uniform mat4 uMVP; uniform float uPR;
void main() { gl_Position = uMVP * vec4(aPos, 1.0); gl_PointSize = 1.6 * uPR; }`;
const DUST_FS = `
precision mediump float;
void main() { gl_FragColor = vec4(0.62, 0.71, 1.0, 0.5); }`;
const GLOW_VS = `
attribute vec2 aCorner; uniform vec2 uCenter, uHalf; varying vec2 vP;
void main() { vP = aCorner * 1.3; gl_Position = vec4(uCenter + aCorner * uHalf, 0.0, 1.0); }`;
const GLOW_FS = `
precision mediump float;
varying vec2 vP;
void main() {
  float r = length(vP);
  float inside = 1.0 - smoothstep(0.985, 1.0, r);
  float z = sqrt(max(0.0, 1.0 - r * r));
  float rim = pow(1.0 - z, 2.0);
  vec3 c = mix(vec3(0.02, 0.035, 0.09), vec3(0.09, 0.16, 0.38), rim);
  float a = 0.92 * inside;
  float outer = r > 1.0 ? pow(clamp(1.0 - (r - 1.0) / 0.14, 0.0, 1.0), 2.2) : 0.0;
  float inner = r <= 1.0 ? pow(smoothstep(0.5, 1.0, r), 3.0) * 0.5 : 0.0;
  vec3 glow = vec3(0.2, 0.62, 1.0) * (outer + inner) * 0.55;
  gl_FragColor = vec4(c * a + glow, a);
}`;

const FOV = (40 * Math.PI) / 180;
const CAM_Z = 4.4;

interface Prog {
  p: WebGLProgram;
  u: (name: string) => WebGLUniformLocation | null;
  a: (name: string) => number;
}

/** Returns a disposer, or null when WebGL is unavailable. Setup yields between stages to keep the main thread responsive. */
export async function startGlobe({ canvas, reducedMotion }: Options): Promise<(() => void) | null> {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
  if (!gl) return null;
  // Software rasterisers (VMs, blocklisted GPUs) would stutter the whole page, so show the static fallback instead.
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer) && !location.search.includes('globe=force')) return null;
  const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowPower = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || innerWidth < 700;
  const POINTS = lowPower ? 2800 : 7500;
  let dprCap = lowPower ? 1.5 : 2;
  let pr = Math.min(devicePixelRatio || 1, dprCap);

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = (vs: string, fs: string): Prog => {
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    const cache = new Map<string, WebGLUniformLocation | null>();
    const u = (name: string) => {
      if (!cache.has(name)) cache.set(name, gl.getUniformLocation(p, name));
      return cache.get(name) ?? null;
    };
    return { p, u, a: (n: string) => gl.getAttribLocation(p, n) };
  };
  const buffer = (data: Float32Array) => {
    const b = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  };
  const attr = (loc: number, buf: WebGLBuffer, size: number, stride = 0, offset = 0) => {
    if (loc < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride * 4, offset * 4);
  };

  const pointProg = program(POINT_VS, POINT_FS);
  const arcProg = program(ARC_VS, ARC_FS);
  await tick();
  const hubProg = program(HUB_VS, HUB_FS);
  const lineProg = program(LINE_VS, LINE_FS);
  await tick();
  const dustProg = program(DUST_VS, DUST_FS);
  const glowProg = program(GLOW_VS, GLOW_FS);
  await tick();

  // Dotted sphere: interleaved x, y, z, seed
  const rand = rng(7);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const sphere = new Float32Array(POINTS * 4);
  for (let i = 0; i < POINTS; i++) {
    const y = 1 - (i / (POINTS - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = i * golden;
    const j = 1 + (rand() - 0.5) * 0.012;
    sphere.set([Math.cos(t) * r * j, y * j, Math.sin(t) * r * j, rand()], i * 4);
  }
  const sphereBuf = buffer(sphere);

  // Hubs and the arcs between them
  const r2 = rng(21);
  const HUBS = 14;
  const hubs: number[][] = [];
  for (let i = 0; i < HUBS; i++) {
    const u = r2() * 2 - 1;
    const t = r2() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    hubs.push([Math.cos(t) * r, u, Math.sin(t) * r]);
  }
  const SEG = 48;
  const arcData: number[] = []; // x, y, z, t, offset per vertex, as line segments
  for (let k = 0; k < 12; k++) {
    const a = hubs[k % HUBS];
    const b = hubs[(k * 5 + 3) % HUBS];
    if (a === b) continue;
    const dist = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    const ml = Math.hypot(m[0], m[1], m[2]) || 1;
    const lift = 1 + dist * 0.55;
    const c = [(m[0] / ml) * lift, (m[1] / ml) * lift, (m[2] / ml) * lift];
    const off = r2();
    const pts: number[][] = [];
    for (let i = 0; i <= SEG; i++) {
      const t = i / SEG;
      const w0 = (1 - t) * (1 - t);
      const w1 = 2 * (1 - t) * t;
      const w2 = t * t;
      pts.push([w0 * a[0] + w1 * c[0] + w2 * b[0], w0 * a[1] + w1 * c[1] + w2 * b[1], w0 * a[2] + w1 * c[2] + w2 * b[2]]);
    }
    for (let i = 0; i < SEG; i++) arcData.push(...pts[i], i / SEG, off, ...pts[i + 1], (i + 1) / SEG, off);
  }
  const arcBuf = buffer(new Float32Array(arcData));
  const arcCount = arcData.length / 5;

  const hubData = new Float32Array(HUBS * 4);
  hubs.forEach((h, i) => hubData.set([h[0] * 1.005, h[1] * 1.005, h[2] * 1.005, r2()], i * 4));
  const hubBuf = buffer(hubData);

  // Orbit rings (tilt baked into the vertices)
  const ringDefs: [number, number, number, [number, number, number]][] = [
    [1.38, 0.35, 0.1, [0.13, 0.83, 0.93]],
    [1.62, -0.6, 0.4, [0.39, 0.4, 0.95]],
    [1.9, 1.05, -0.2, [0.2, 0.85, 0.6]],
  ];
  const rings = ringDefs.map(([radius, rx, rz, color]) => {
    const n = 160;
    const d = new Float32Array((n + 1) * 3);
    for (let i = 0; i <= n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const x0 = Math.cos(ang) * radius;
      const z0 = Math.sin(ang) * radius;
      const x1 = x0 * Math.cos(rz);
      const y1 = x0 * Math.sin(rz);
      d.set([x1, y1 * Math.cos(rx) - z0 * Math.sin(rx), y1 * Math.sin(rx) + z0 * Math.cos(rx)], i * 3);
    }
    return { buf: buffer(d), count: n + 1, color };
  });

  // Distant dust
  const r3 = rng(99);
  const dustN = lowPower ? 250 : 700;
  const dust = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    const r = 3 + r3() * 6;
    const t = r3() * Math.PI * 2;
    const u = r3() * 2 - 1;
    const s = Math.sqrt(1 - u * u);
    dust.set([Math.cos(t) * s * r, u * r * 0.7, Math.sin(t) * s * r - 2], i * 3);
  }
  const dustBuf = buffer(dust);
  const cornerBuf = buffer(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
  await tick();

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);

  let width = 1;
  let height = 1;
  let radius = 1;
  let gx = 0;
  let gy = 0;
  let proj = ident();

  const resize = () => {
    width = canvas.clientWidth || innerWidth;
    height = canvas.clientHeight || innerHeight;
    pr = Math.min(devicePixelRatio || 1, dprCap);
    canvas.width = Math.max(1, Math.round(width * pr));
    canvas.height = Math.max(1, Math.round(height * pr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    const aspect = width / height;
    proj = persp(FOV, aspect, 0.1, 50);
    const wide = aspect > 1.15;
    const visH = 2 * Math.tan(FOV / 2) * CAM_Z;
    const visW = visH * aspect;
    radius = Math.min(visH * 0.38, wide ? visW * 0.205 : visW * 0.44);
    gx = wide ? visW * 0.25 : 0;
    gy = wide ? 0 : visH * 0.12;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    target.x = (e.clientX / innerWidth - 0.5) * 2;
    target.y = (e.clientY / innerHeight - 0.5) * 2;
  };
  addEventListener('pointermove', onMove, { passive: true });

  let time = 0;
  let spin = 0.6;
  let last = performance.now();
  let raf = 0;
  let visible = true;
  let frames = 0;
  let slow = 0;

  const draw = (dt: number) => {
    time += dt;
    spin += dt * 0.12;
    cur.x += (target.x - cur.x) * 0.05;
    cur.y += (target.y - cur.y) * 0.05;
    const p = Math.min(1, scrollY / (innerHeight || 1));
    const camX = cur.x * 0.08;
    const camY = -p * 0.9;

    const vp = mul(proj, translate(-camX, -camY, -CAM_Z));
    const model = mul(mul(mul(translate(gx, gy, 0), rotX(0.28 + cur.y * 0.22)), rotY(spin + cur.x * 0.45)), scaleM(radius));
    const mvp = mul(vp, model);
    const horizon = radius / CAM_Z;

    gl.clear(gl.COLOR_BUFFER_BIT);

    // Core disc and atmosphere (premultiplied "over" blend)
    {
      const g = glowProg;
      const aspect = width / height;
      const tanHalf = Math.tan(FOV / 2);
      gl.useProgram(g.p);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      attr(g.a('aCorner'), cornerBuf, 2);
      const silY = radius / Math.sqrt(CAM_Z * CAM_Z - radius * radius) / tanHalf;
      gl.uniform2f(g.u('uCenter'), (gx - camX) / (CAM_Z * tanHalf * aspect), (gy - camY) / (CAM_Z * tanHalf));
      gl.uniform2f(g.u('uHalf'), (silY * 1.3) / aspect, silY * 1.3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    {
      const d = dustProg;
      gl.useProgram(d.p);
      gl.uniformMatrix4fv(d.u('uMVP'), false, vp);
      gl.uniform1f(d.u('uPR'), pr);
      attr(d.a('aPos'), dustBuf, 3);
      gl.drawArrays(gl.POINTS, 0, dustN);
    }

    {
      const l = lineProg;
      gl.useProgram(l.p);
      gl.uniformMatrix4fv(l.u('uMVP'), false, mul(mvp, rotY(-spin * 0.6)));
      for (const r of rings) {
        gl.uniform4f(l.u('uColor'), r.color[0], r.color[1], r.color[2], 0.22);
        attr(l.a('aPos'), r.buf, 3);
        gl.drawArrays(gl.LINE_STRIP, 0, r.count);
      }
    }

    const common = (q: Prog) => {
      gl.useProgram(q.p);
      gl.uniformMatrix4fv(q.u('uMVP'), false, mvp);
      gl.uniformMatrix4fv(q.u('uModel'), false, model);
      gl.uniform1f(q.u('uTime'), time);
      gl.uniform1f(q.u('uPR'), pr);
      gl.uniform1f(q.u('uScale'), radius);
      gl.uniform1f(q.u('uHorizon'), horizon);
    };

    common(pointProg);
    gl.uniform1f(pointProg.u('uSize'), 15);
    attr(pointProg.a('aPos'), sphereBuf, 3, 4, 0);
    attr(pointProg.a('aSeed'), sphereBuf, 1, 4, 3);
    gl.drawArrays(gl.POINTS, 0, POINTS);

    common(arcProg);
    attr(arcProg.a('aPos'), arcBuf, 3, 5, 0);
    attr(arcProg.a('aT'), arcBuf, 1, 5, 3);
    attr(arcProg.a('aOff'), arcBuf, 1, 5, 4);
    gl.drawArrays(gl.LINES, 0, arcCount);

    common(hubProg);
    attr(hubProg.a('aPos'), hubBuf, 3, 4, 0);
    attr(hubProg.a('aSeed'), hubBuf, 1, 4, 3);
    gl.drawArrays(gl.POINTS, 0, HUBS);
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    draw(dt);
    // Drop resolution once if the device cannot hold ~40fps.
    if (++frames > 30 && frames < 150 && dt > 0.025 && ++slow > 40 && dprCap > 1) {
      dprCap = 1;
      resize();
    }
  };
  const start = () => {
    if (raf || reducedMotion) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !document.hidden) start();
    else stop();
  });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : visible && start());
  document.addEventListener('visibilitychange', onVis);
  const onLost = (e: Event) => {
    e.preventDefault();
    stop();
    canvas.classList.remove('is-ready');
  };
  canvas.addEventListener('webglcontextlost', onLost);

  draw(0);
  if (!reducedMotion) start();
  canvas.classList.add('is-ready');

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    removeEventListener('pointermove', onMove);
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('webglcontextlost', onLost);
  };
}
