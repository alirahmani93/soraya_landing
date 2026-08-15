import * as THREE from "three";

/** The drawer box as a three.js model, ported from the Claude Design spec
 *  (project ac31e815, `soraya-box-model.js`). Dimensions are metres and match the
 *  box maker's sheet: 200 mm cube, 3 mm board, four drawers of 40/44/48/53 mm. */

export type BoxFonts = { display: string; arabic: string; body: string };

const SAFFRON = "#AF5A20",
  SAFFRON_DEEP = "#98481A",
  SAGE = "#6F7E58",
  ROSE = "#A6636F",
  CREAM = "#E7D9C1",
  FOIL = "#D9B25C";

const W = 0.2,
  H = 0.2,
  D = 0.2,
  t = 0.003,
  R = 0.007;

const slots = [
  { key: "saffron", h: 0.04, color: SAFFRON_DEEP, label: "SAFFRON", ar: "ثريا", open: 0.03 },
  { key: "kakuti", h: 0.044, color: SAGE, label: "KAKUTI", open: 0.052 },
  { key: "rose", h: 0.048, color: ROSE, label: "DAMASK ROSE", open: 0.074 },
  { key: "tea", h: 0.053, color: CREAM, label: "BLEND TEA", open: 0.096 },
] as const;

export async function loadBoxFonts(fonts: BoxFonts) {
  try {
    await Promise.all([
      document.fonts.load(`400 100px ${fonts.display}`, "SORAYA"),
      document.fonts.load(`700 100px ${fonts.arabic}`, "ثريا"),
      document.fonts.load(`500 100px ${fonts.body}`, "SAFFRON"),
    ]);
    await document.fonts.ready;
  } catch {
    // lettering is indicative
  }
}

/** Warm softbox: paper picks up bounce, brass and foil get something to reflect. */
export function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 256;
  const c = cv.getContext("2d")!;
  const g = c.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#fffdf8");
  g.addColorStop(0.4, "#f2e8d8");
  g.addColorStop(0.52, "#cfc3ae");
  g.addColorStop(1, "#9d9282");
  c.fillStyle = g;
  c.fillRect(0, 0, 512, 256);
  c.fillStyle = "rgba(255,255,255,0.95)";
  c.beginPath();
  c.ellipse(140, 50, 90, 34, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "rgba(255,255,255,0.55)";
  c.beginPath();
  c.ellipse(380, 70, 60, 24, 0, 0, Math.PI * 2);
  c.fill();
  const eq = new THREE.CanvasTexture(cv);
  eq.mapping = THREE.EquirectangularReflectionMapping;
  eq.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(eq).texture;
  pmrem.dispose();
  eq.dispose();
  return env;
}

function shade(hex: string, amt: number) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + amt)));
  return "#" + c.getHexString();
}

function grainCanvas(size = 512, strength = 26) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * strength;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 700; i++) {
    ctx.strokeStyle = Math.random() > 0.5 ? "#fff" : "#000";
    ctx.lineWidth = 1;
    const x = Math.random() * size,
      y = Math.random() * size,
      a = Math.random() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * 16, y + Math.sin(a) * 16);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  return cv;
}

export function buildSorayaBox(fonts: BoxFonts) {
  const grain = new THREE.CanvasTexture(grainCanvas());
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(16, 16);

  const paper = (name: string, color: string, bump = 0.22) =>
    new THREE.MeshStandardMaterial({
      name,
      color,
      roughness: 0.93,
      metalness: 0,
      bumpMap: grain,
      bumpScale: bump,
      envMapIntensity: 0.6,
    });

  /** Damask-rose rosette, tiled, printed a shade under the saffron ground. */
  function rosePrint(bg: string) {
    const S = 512;
    const cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const ctx = cv.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, S, S);
    const rosette = (cx: number, cy: number, r: number, alpha: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = shade(bg, -0.075);
      for (let ring = 0; ring < 2; ring++) {
        const n = 6,
          rr = r * (ring ? 0.58 : 1),
          rot = ring ? Math.PI / 6 : 0;
        for (let i = 0; i < n; i++) {
          const a = rot + (i * Math.PI * 2) / n;
          ctx.beginPath();
          ctx.ellipse(
            Math.cos(a) * rr * 0.48,
            Math.sin(a) * rr * 0.48,
            rr * 0.52,
            rr * 0.38,
            a,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
      ctx.globalAlpha = alpha * 0.9;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.17, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    rosette(S * 0.25, S * 0.25, S * 0.16, 0.34);
    rosette(S * 0.75, S * 0.75, S * 0.16, 0.34);
    rosette(S * 0.75, S * 0.25, S * 0.09, 0.24);
    rosette(S * 0.25, S * 0.75, S * 0.09, 0.24);
    ctx.globalAlpha = 0.35;
    ctx.globalCompositeOperation = "overlay";
    ctx.drawImage(grainCanvas(S, 22), 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    tex.anisotropy = 8;
    return tex;
  }

  /** One text mask drives colour, metalness, roughness and relief, so only the
   *  letters shine and the ground stays matte paper. */
  function foilPanel(
    name: string,
    wM: number,
    hM: number,
    bg: string,
    drawText: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  ) {
    const px = 1024;
    const hpx = Math.max(128, Math.round((px * hM) / wM));
    const mk = () => {
      const c = document.createElement("canvas");
      c.width = px;
      c.height = hpx;
      return c;
    };

    const mask = mk();
    const mctx = mask.getContext("2d")!;
    mctx.fillStyle = "#fff";
    drawText(mctx, px, hpx);

    const mapCv = mk(),
      mctx2 = mapCv.getContext("2d")!;
    mctx2.fillStyle = bg;
    mctx2.fillRect(0, 0, px, hpx);
    mctx2.globalAlpha = 0.35;
    mctx2.globalCompositeOperation = "overlay";
    mctx2.drawImage(grainCanvas(512, 20), 0, 0, px, hpx);
    mctx2.globalAlpha = 1;
    mctx2.globalCompositeOperation = "source-over";

    const foilCv = mk(),
      fctx = foilCv.getContext("2d")!;
    const fg = fctx.createLinearGradient(0, 0, 0, hpx);
    fg.addColorStop(0, "#F0D191");
    fg.addColorStop(0.45, FOIL);
    fg.addColorStop(0.7, "#B98F3E");
    fg.addColorStop(1, "#E6C377");
    fctx.fillStyle = fg;
    fctx.fillRect(0, 0, px, hpx);
    fctx.globalCompositeOperation = "destination-in";
    fctx.drawImage(mask, 0, 0);
    mctx2.drawImage(foilCv, 0, 0);

    const metalCv = mk(),
      xctx = metalCv.getContext("2d")!;
    xctx.fillStyle = "#000";
    xctx.fillRect(0, 0, px, hpx);
    xctx.drawImage(mask, 0, 0);

    const roughCv = mk(),
      rctx = roughCv.getContext("2d")!;
    rctx.fillStyle = "#eeeeee";
    rctx.fillRect(0, 0, px, hpx);
    const rc = mk(),
      rc2 = rc.getContext("2d")!;
    rc2.fillStyle = "#3c3c3c";
    rc2.fillRect(0, 0, px, hpx);
    rc2.globalCompositeOperation = "destination-in";
    rc2.drawImage(mask, 0, 0);
    rctx.drawImage(rc, 0, 0);

    const tex = (cv: HTMLCanvasElement) => {
      const x = new THREE.CanvasTexture(cv);
      x.anisotropy = 8;
      return x;
    };
    const map = tex(mapCv);
    map.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({
      name,
      map,
      metalnessMap: tex(metalCv),
      roughnessMap: tex(roughCv),
      bumpMap: tex(mask),
      bumpScale: 0.9,
      metalness: 1,
      roughness: 1,
      envMapIntensity: 1.35,
    });
  }

  const mats = {
    saffron: new THREE.MeshStandardMaterial({
      name: "paper_saffron",
      color: "#ffffff",
      map: rosePrint(SAFFRON),
      bumpMap: grain,
      bumpScale: 0.22,
      roughness: 0.93,
      metalness: 0,
      envMapIntensity: 0.6,
    }),
    cream: paper("paper_cream", CREAM),
    foam: paper("foam_cream", "#DCCFB6", 0.1),
    sage: paper("paper_kakuti", SAGE),
    rose: paper("paper_rose", ROSE),
    brass: new THREE.MeshStandardMaterial({
      name: "brass_brushed",
      color: "#C09B48",
      roughness: 0.28,
      metalness: 0.8,
      envMapIntensity: 1.5,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      name: "glass",
      color: "#eef4f1",
      roughness: 0.06,
      metalness: 0,
      transmission: 0.92,
      thickness: 0.004,
      ior: 1.5,
      transparent: true,
      envMapIntensity: 1,
    }),
    saffronThread: new THREE.MeshStandardMaterial({
      name: "saffron_threads",
      color: "#8C2B0E",
      roughness: 0.85,
    }),
    kakutiLeaf: new THREE.MeshStandardMaterial({
      name: "kakuti_leaf",
      color: "#5E6B47",
      roughness: 0.9,
    }),
    roseBud: new THREE.MeshStandardMaterial({ name: "rose_bud", color: "#8E3646", roughness: 0.85 }),
    rosePetal: new THREE.MeshStandardMaterial({
      name: "rose_petal",
      color: "#C08290",
      roughness: 0.88,
    }),
    kraft: paper("paper_kraft", "#CDB894"),
    teaPaper: paper("paper_teabag", "#EDE2CD", 0.14),
  };

  const box = (
    name: string,
    sx: number,
    sy: number,
    sz: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material | THREE.Material[],
  ) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
    m.name = name;
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    return m;
  };

  function roundedRect<P extends THREE.Path>(
    w: number,
    h: number,
    r: number,
    PathClass: new () => P,
  ) {
    const p = new PathClass();
    const x = -w / 2,
      y = -h / 2;
    p.moveTo(x + r, y);
    p.lineTo(x + w - r, y);
    p.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    p.lineTo(x + w, y + h - r);
    p.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    p.lineTo(x + r, y + h);
    p.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    p.lineTo(x, y + r);
    p.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return p;
  }

  /** Soft-edged slab (pouches, sachets, foam) — rounded in plan, extruded in y. */
  function slab(name: string, w: number, d: number, h: number, r: number, mat: THREE.Material) {
    const shape = roundedRect(w, d, r, THREE.Shape);
    const bev = Math.min(0.0012, h / 4);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: h - 2 * bev,
      bevelEnabled: true,
      bevelThickness: bev,
      bevelSize: bev,
      bevelSegments: 2,
      curveSegments: 6,
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, h / 2, 0);
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    m.castShadow = m.receiveShadow = true;
    return m;
  }

  const model = new THREE.Group();
  model.name = "soraya_drawer_box";
  model.position.y = 0.0014;
  const shell = new THREE.Group();
  shell.name = "case";
  model.add(shell);

  {
    const outer = roundedRect(W, H, R, THREE.Shape);
    outer.holes.push(roundedRect(W - 2 * t, H - 2 * t, Math.max(0.001, R - t), THREE.Path));
    const bev = 0.0014;
    const geo = new THREE.ExtrudeGeometry(outer, {
      depth: D - 2 * bev,
      bevelEnabled: true,
      bevelThickness: bev,
      bevelSize: bev,
      bevelSegments: 3,
      curveSegments: 10,
    });
    geo.translate(0, 0, -(D - 2 * bev) / 2);
    const sleeve = new THREE.Mesh(geo, mats.saffron);
    sleeve.name = "case_sleeve";
    sleeve.castShadow = sleeve.receiveShadow = true;
    sleeve.position.y = H / 2;
    shell.add(sleeve);
  }
  shell.add(box("case_back", W - 2 * t, H - 2 * t, t, 0, H / 2, -D / 2 + t / 2, mats.saffron));
  shell.add(
    box(
      "lining_back",
      W - 2.4 * t,
      H - 2.4 * t,
      0.0008,
      0,
      H / 2,
      -D / 2 + t + 0.0004,
      mats.cream,
    ),
  );

  {
    const LW = 0.172;
    const lidMat = foilPanel("foil_lid", LW, LW, SAFFRON, (ctx, w, h) => {
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = `400 ${Math.round(h * 0.125)}px ${fonts.display}, serif`;
      ctx.fillText("SORAYA", w * 0.075, h * 0.72);
      ctx.font = `500 ${Math.round(h * 0.032)}px ${fonts.body}, sans-serif`;
      ctx.fillText("Z A N J A N   ·   I R A N", w * 0.08, h * 0.855);
      ctx.font = `700 ${Math.round(h * 0.115)}px ${fonts.arabic}, serif`;
      ctx.textAlign = "right";
      ctx.fillText("ثريا", w * 0.925, h * 0.3);
    });
    shell.add(
      box("lid_panel", LW, 0.0025, LW, 0, H + 0.00075, 0, [
        mats.saffron,
        mats.saffron,
        lidMat,
        mats.saffron,
        mats.saffron,
        mats.saffron,
      ]),
    );
    shell.add(box("stripe_kakuti", LW, 0.0011, 0.0045, 0, H + 0.00255, -0.0685, mats.sage));
    shell.add(box("stripe_rose", LW, 0.0011, 0.0045, 0, H + 0.00255, -0.0745, mats.rose));
  }

  function saffronContents(g: THREE.Group, y0: number, dz: number) {
    const c = new THREE.Group();
    c.name = "contents_saffron";
    c.add(box("foam_saffron", 0.176, 0.002, 0.174, 0, y0 + 0.001, dz - 0.0045, mats.foam));
    const cradle = y0 + 0.002;
    const jar = new THREE.Group();
    jar.name = "jar_saffron";
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.042, 40), mats.glass);
    body.name = "jar_glass";
    body.rotation.z = Math.PI / 2;
    body.castShadow = true;
    const threads = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0122, 0.0122, 0.03, 32),
      mats.saffronThread,
    );
    threads.name = "jar_saffron_threads";
    threads.rotation.z = Math.PI / 2;
    threads.position.x = -0.004;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.0147, 0.0147, 0.008, 40), mats.brass);
    cap.name = "jar_cap";
    cap.rotation.z = Math.PI / 2;
    cap.position.x = 0.024;
    cap.castShadow = true;
    jar.add(body, threads, cap);
    // laid in a cut channel so the 2-mesghal jar clears the 40 mm drawer
    jar.position.set(-0.03, cradle + 0.014, dz - 0.008);
    jar.rotation.y = -0.12;
    c.add(jar);
    const sach = slab("sachet_saffron_powder", 0.062, 0.086, 0.012, 0.006, mats.kraft);
    sach.position.set(0.05, cradle, dz - 0.004);
    c.add(sach);
    g.add(c);
  }

  function kakutiContents(g: THREE.Group, y0: number, dz: number) {
    const c = new THREE.Group();
    c.name = "contents_kakuti";
    const p1 = slab("pouch_kakuti_powder", 0.082, 0.12, 0.02, 0.008, mats.sage);
    p1.position.set(-0.046, y0 + 0.002, dz - 0.006);
    const p2 = slab("pouch_kakuti_leaf", 0.082, 0.12, 0.024, 0.008, mats.kraft);
    p2.position.set(0.046, y0 + 0.002, dz - 0.006);
    c.add(p1, p2);
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.007, 12, 8), mats.kakutiLeaf);
      leaf.name = `kakuti_leaf_${i + 1}`;
      leaf.scale.set(1, 0.22, 0.55);
      leaf.position.set(
        0.046 + (Math.random() - 0.5) * 0.05,
        y0 + 0.027,
        dz - 0.006 + (Math.random() - 0.5) * 0.08,
      );
      leaf.rotation.y = Math.random() * Math.PI;
      leaf.castShadow = true;
      c.add(leaf);
    }
    g.add(c);
  }

  function roseContents(g: THREE.Group, y0: number, dz: number) {
    const c = new THREE.Group();
    c.name = "contents_rose";
    c.add(box("insert_rose", 0.176, 0.0025, 0.174, 0, y0 + 0.00125, dz - 0.0045, mats.foam));
    c.add(box("insert_rose_wall", 0.0025, 0.02, 0.174, 0, y0 + 0.012, dz - 0.0045, mats.foam));
    const base = y0 + 0.0025;
    for (let i = 0; i < 26; i++) {
      const bud = new THREE.Mesh(new THREE.SphereGeometry(0.0068, 14, 10), mats.roseBud);
      bud.name = `rose_bud_${i + 1}`;
      bud.scale.set(0.85, 1.25, 0.85);
      bud.position.set(
        -0.046 + (Math.random() - 0.5) * 0.06,
        base + 0.008 + Math.random() * 0.008,
        dz - 0.006 + (Math.random() - 0.5) * 0.13,
      );
      bud.rotation.set(Math.random(), Math.random(), Math.random() * 0.6);
      bud.castShadow = true;
      c.add(bud);
    }
    for (let i = 0; i < 30; i++) {
      const petal = new THREE.Mesh(new THREE.CircleGeometry(0.0085, 10), mats.rosePetal);
      petal.name = `rose_petal_${i + 1}`;
      petal.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      petal.rotation.y = Math.random() * Math.PI;
      petal.scale.set(1, 0.7, 1);
      petal.position.set(
        0.046 + (Math.random() - 0.5) * 0.06,
        base + 0.001 + Math.random() * 0.01,
        dz - 0.006 + (Math.random() - 0.5) * 0.13,
      );
      c.add(petal);
    }
    g.add(c);
  }

  function teaContents(g: THREE.Group, y0: number, dz: number) {
    const c = new THREE.Group();
    c.name = "contents_tea";
    let n = 0;
    for (let col = 0; col < 2; col++) {
      for (let row = 0; row < 2; row++) {
        for (let k = 0; k < 5; k++) {
          const s = slab(`sachet_${++n}`, 0.056, 0.076, 0.0045, 0.004, mats.teaPaper);
          s.position.set(-0.045 + col * 0.09, y0 + 0.001 + k * 0.0048, dz - 0.048 + row * 0.086);
          s.rotation.y = (Math.random() - 0.5) * 0.05;
          c.add(s);
        }
      }
    }
    g.add(c);
  }

  const contents: Record<string, (g: THREE.Group, y0: number, dz: number) => void> = {
    saffron: saffronContents,
    kakuti: kakutiContents,
    rose: roseContents,
    tea: teaContents,
  };

  let y = t;
  const stack = [...slots].reverse();
  stack.forEach((s, i) => {
    const bottom = y,
      top = y + s.h;
    y = top;
    if (i < stack.length - 1) {
      shell.add(box(`shelf_${i + 1}`, W - 2 * t, t, D - 2 * t, 0, y + t / 2, t / 2, mats.cream));
      y += t;
    }

    const g = new THREE.Group();
    g.name = `drawer_${s.key}`;
    const dz = s.open || 0;
    const isTop = i === stack.length - 1;
    const fh = s.h + (isTop ? 0.0005 : 0.0022);
    const fy = (bottom + top) / 2 + (isTop ? -0.0007 : 0);
    const fw = W - 2 * t - 0.0008;

    const ar = "ar" in s ? (s.ar as string) : undefined;
    const faceMat = foilPanel(`foil_${s.key}_face`, fw, fh, s.color, (ctx, w, h) => {
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      if (ar) {
        ctx.font = `700 ${Math.round(h * 0.72)}px ${fonts.arabic}, serif`;
        ctx.fillText(ar, w * 0.05, h * 0.44);
        ctx.font = `500 ${Math.round(h * 0.19)}px ${fonts.body}, sans-serif`;
        ctx.fillText(s.label, w * 0.235, h * 0.54);
      } else {
        ctx.font = `500 ${Math.round(h * 0.19)}px ${fonts.body}, sans-serif`;
        ctx.fillText(s.label, w * 0.05, h * 0.5);
      }
    });
    const side = paper(`paper_${s.key}_side`, s.color);
    g.add(
      box(`face_${s.key}`, fw, fh, 0.0035, 0, fy, D / 2 - 0.0022 + dz, [
        side,
        side,
        side,
        side,
        faceMat,
        side,
      ]),
    );

    const pull = new THREE.Group();
    pull.name = `pull_${s.key}`;
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.0145, 0.0026, 20, 64, Math.PI), mats.brass);
    bow.name = `pull_${s.key}_bow`;
    bow.rotation.z = Math.PI;
    bow.castShadow = true;
    pull.add(bow);
    [-1, 1].forEach((sx) => {
      const boss = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0035, 0.0035, 0.0022, 20),
        mats.brass,
      );
      boss.name = `pull_${s.key}_boss_${sx > 0 ? "r" : "l"}`;
      boss.rotation.x = Math.PI / 2;
      boss.position.set(sx * 0.0145, 0, -0.0011);
      pull.add(boss);
    });
    pull.position.set(0.056, fy + 0.0035, D / 2 - 0.0004 + dz);
    g.add(pull);

    const tw = 0.186,
      td = 0.184,
      wall = 0.0025,
      th = s.h - 0.006;
    const cz = -0.0045 + dz;
    g.add(box(`tray_${s.key}_bottom`, tw, wall, td, 0, bottom + 0.002 + wall / 2, cz, mats.cream));
    g.add(
      box(
        `tray_${s.key}_left`,
        wall,
        th,
        td,
        -tw / 2 + wall / 2,
        bottom + 0.002 + th / 2,
        cz,
        mats.cream,
      ),
    );
    g.add(
      box(
        `tray_${s.key}_right`,
        wall,
        th,
        td,
        tw / 2 - wall / 2,
        bottom + 0.002 + th / 2,
        cz,
        mats.cream,
      ),
    );
    g.add(
      box(
        `tray_${s.key}_back`,
        tw,
        th,
        wall,
        0,
        bottom + 0.002 + th / 2,
        cz - td / 2 + wall / 2,
        mats.cream,
      ),
    );

    contents[s.key](g, bottom + 0.002 + wall, cz);
    model.add(g);
  });

  return model;
}
