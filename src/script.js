import { spline } from "https://cdn.skypack.dev/@georgedoescode/spline@1.0.1";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@2.4.0";
import gsap from "https://cdn.skypack.dev/gsap";

const morphSpeed = 30;

const simplex = new SimplexNoise();
const points = createPoints();

gsap.fromTo(
  ".blob",
  {
    transformOrigin: "80px 80px",
    attr: { fill: (i) => "hsl(" + i * 20 + ", 75%, 50%)" },
    scale: 0
  },
  {
    delay: 0.2,
    scale: (i) => 1.5 - i * 0.2,
    duration: (i) => 0.5 + i * 0.1
  }
);

function createPoints() {
  const points = [];
  const numPoints = 7; // maybe don't go over 8
  const angleStep = (Math.PI * 2) / numPoints;
  const rad = 75;

  for (let i = 1; i <= numPoints; i++) {
    const x = 100 + Math.cos(i * angleStep) * rad;
    const y = 100 + Math.sin(i * angleStep) * rad;

    points.push({
      x: x,
      y: y,
      originX: x,
      originY: y,
      noiseOffsetX: gsap.utils.random(0, 999),
      noiseOffsetY: gsap.utils.random(0, 999)
    });
  }

  return points;
}

function animate() {
  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    const nX = simplex.noise2D(pt.noiseOffsetX, pt.noiseOffsetX);
    const nY = simplex.noise2D(pt.noiseOffsetY, pt.noiseOffsetY);

    pt.x = gsap.utils.mapRange(-1, 1, pt.originX - 14, pt.originX + 14, nX);
    pt.y = gsap.utils.mapRange(-1, 1, pt.originY - 14, pt.originY + 14, nY);

    pt.noiseOffsetX = pt.noiseOffsetY += morphSpeed / 10000;
  }

  gsap.to(".blob", {
    duration: (i) => i * 0.08,
    attr: { d: spline(points, 1, true) }
  });
}

gsap.ticker.add(animate);
