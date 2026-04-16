<script lang="ts">
  let canvas: HTMLCanvasElement | undefined = $state();

  interface Hex {
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    rotation: number;
    vr: number;
    opacity: number;
  }

  function init(node: HTMLCanvasElement) {
    const ctx = node.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = window.devicePixelRatio || 1;

    let width = 0;
    let height = 0;
    let hexagons: Hex[] = [];
    let raf = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      node.width = width * dpr;
      node.height = height * dpr;
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      ctx!.scale(dpr, dpr);

      const count = Math.max(14, Math.floor((width * height) / 60000));
      hexagons = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 20 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.002,
        opacity: 0.05 + Math.random() * 0.08,
      }));
    }

    function drawHex(h: Hex) {
      ctx!.save();
      ctx!.translate(h.x, h.y);
      ctx!.rotate(h.rotation);
      ctx!.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = Math.cos(angle) * h.size;
        const py = Math.sin(angle) * h.size;
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
      ctx!.strokeStyle = `rgba(110, 198, 200, ${h.opacity})`;
      ctx!.lineWidth = 1;
      ctx!.stroke();
      ctx!.restore();
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);
      for (const h of hexagons) {
        if (!reducedMotion) {
          h.x += h.vx;
          h.y += h.vy;
          h.rotation += h.vr;

          if (h.x < -h.size) h.x = width + h.size;
          if (h.x > width + h.size) h.x = -h.size;
          if (h.y < -h.size) h.y = height + h.size;
          if (h.y > height + h.size) h.y = -h.size;
        }
        drawHex(h);
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener('resize', resize);

    return {
      destroy() {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
      },
    };
  }
</script>

<canvas bind:this={canvas} use:init class="hexagon-bg" aria-hidden="true"></canvas>

<style>
  .hexagon-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
</style>
