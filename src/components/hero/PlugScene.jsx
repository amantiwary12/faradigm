import { useCallback, useEffect, useRef, useState } from 'react';
import { cn, prefersReducedMotion as reduce } from '../../lib/env.js';
import {
  CHARGE_MS, DRAIN_MS, HOLD_MS, REST, SOCKET, cablePath, chargeColors, inBoard,
} from './plugMath.js';

const mono = 'IBM Plex Mono,monospace';
const BAR_YS = [282, 258, 234, 210, 186]; // bottom to top

/**
 * Hero visual: plug the adapter into the switchboard, flip the switch, and the cell charges
 * 0 -> 100% on a loop while power flows (current runs board -> cell). Drag or tap the plug;
 * Enter/Space work on both the plug and the switch. `running` is false while off screen.
 */
export default function PlugScene({ running }) {
  const svgRef = useRef(null);
  const plugRef = useRef(null);
  const drag = useRef({ grab: { x: 0, y: 0 }, down: { x: 0, y: 0 }, moved: false, wasPlugged: false });
  const posRef = useRef({ ...REST });
  const tweenRaf = useRef(null);
  const charge = useRef({ level: 0, hold: 0 });

  const [pos, setPos] = useState({ ...REST });
  const [plugged, setPlugged] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [near, setNear] = useState(false);
  const [idle, setIdle] = useState(true); // the plug bobs until the visitor touches it
  const [burst, setBurst] = useState(0);
  const [bob, setBob] = useState(0); // idle hover offset, in SVG units (drives both plug and cable end)
  const [pct, setPct] = useState(0);
  const [full, setFull] = useState(false);

  const powered = plugged && switchOn;
  const stage = !plugged ? 1 : !switchOn ? 2 : 3;

  const move = useCallback((p) => {
    posRef.current = p;
    setPos(p);
  }, []);

  useEffect(() => () => cancelAnimationFrame(tweenRaf.current), []);

  const tween = useCallback((to, done) => {
    cancelAnimationFrame(tweenRaf.current);
    const from = { ...posRef.current };
    const t0 = performance.now();
    const dur = reduce ? 0 : 420;
    const frame = (now) => {
      const p = dur ? Math.min(1, (now - t0) / dur) : 1;
      const e = 1 - Math.pow(1 - p, 3);
      move({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
      if (p < 1) tweenRaf.current = requestAnimationFrame(frame);
      else done?.();
    };
    frame(t0);
  }, [move]);

  const plugIn = useCallback(() => {
    move({ ...SOCKET });
    setPlugged(true);
    setIdle(false);
    setBurst((n) => n + 1);
  }, [move]);
  const goHome = useCallback(() => tween(REST, () => setIdle(true)), [tween]);

  // Charge loop: fill 0 -> 100%, flash, hold, then start again from 0 while power flows.
  // Sleeps when nothing is moving; re-runs when power or visibility changes.
  useEffect(() => {
    if (reduce) {
      setPct(powered ? 100 : 0);
      return undefined;
    }
    if (!running) return undefined;
    const s = charge.current;
    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(50, now - last);
      last = now;
      if (powered) {
        if (s.hold > 0) {
          s.hold -= dt;
          if (s.hold <= 0) {
            s.level = 0;
            setFull(false);
          }
        } else {
          s.level = Math.min(1, s.level + dt / CHARGE_MS);
          if (s.level >= 1) {
            s.hold = HOLD_MS;
            setFull(true);
          }
        }
      } else {
        s.hold = 0;
        setFull(false);
        s.level = Math.max(0, s.level - dt / DRAIN_MS);
      }
      setPct(Math.round(s.level * 100));
      if (powered || s.level > 0) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [powered, running]);

  // Idle hint: the plug hovers gently until the visitor touches it
  useEffect(() => {
    if (!idle || reduce || !running) {
      setBob(0);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const loop = (now) => {
      setBob(-3 + 3 * Math.cos(((now - t0) / 2400) * 2 * Math.PI));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [idle, running]);

  // touch-action is not honoured on SVG children in every browser, so also block the scroll here
  useEffect(() => {
    const el = plugRef.current;
    const stop = (e) => e.preventDefault();
    el.addEventListener('touchstart', stop, { passive: false });
    el.addEventListener('touchmove', stop, { passive: false });
    return () => {
      el.removeEventListener('touchstart', stop);
      el.removeEventListener('touchmove', stop);
    };
  }, []);

  const toSvg = (e) => new DOMPoint(e.clientX, e.clientY).matrixTransform(svgRef.current.getScreenCTM().inverse());
  // Catch radius is never smaller than a fingertip on screen
  const isNear = (p) => {
    const px = svgRef.current.getScreenCTM()?.a || 1;
    return Math.hypot(p.x - SOCKET.x, p.y - SOCKET.y) < Math.max(42, 44 / px) || inBoard(p);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    cancelAnimationFrame(tweenRaf.current);
    const d = drag.current;
    d.wasPlugged = plugged;
    d.down = { x: e.clientX, y: e.clientY };
    d.moved = false;
    const p = toSvg(e);
    d.grab = { x: posRef.current.x - p.x, y: posRef.current.y - p.y };
    if (plugged) setPlugged(false);
    setDragging(true);
    setIdle(false);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const d = drag.current;
    if (Math.hypot(e.clientX - d.down.x, e.clientY - d.down.y) > 8) d.moved = true;
    const p = toSvg(e);
    const next = { x: Math.max(24, Math.min(616, p.x + d.grab.x)), y: Math.max(24, Math.min(330, p.y + d.grab.y)) };
    setNear(isNear(next));
    move(next);
  };
  const onDrop = () => {
    if (!dragging) return;
    const d = drag.current;
    setDragging(false);
    setNear(false);
    if (!d.moved) return d.wasPlugged ? goHome() : tween(SOCKET, plugIn); // a tap toggles
    return isNear(posRef.current) ? plugIn() : goHome();
  };
  const onPlugKey = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (plugged) {
      setPlugged(false);
      goHome();
    } else {
      setIdle(false);
      tween(SOCKET, plugIn);
    }
  };
  const flip = () => setSwitchOn((on) => !on);
  const onSwitchKey = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    flip();
  };

  const level = pct / 100;
  const { lo, hi } = chargeColors(level);
  const lit = Math.round(level * BAR_YS.length);
  const path = cablePath({ x: pos.x, y: pos.y + bob }); // the cable end rides the bob, so it never detaches from the plug
  // The plug's artwork. The wall switch is drawn after the plug (so Tab reaches the plug first), which would
  // cover the plug while it is moved over the switch; a non-interactive copy is drawn on top while it moves.
  const plugArt = (
    <g transform="scale(.75)">
      <rect x="-45" y="-48" width="90" height="100" fill="transparent" />
      <rect x="-19" y="-23" width="38" height="44" rx="3" fill="#29166F" stroke="#0093DD" strokeWidth="1.5" className="group-focus-visible/plug:stroke-focus group-focus-visible/plug:stroke-3" />
      <path d="M-11 4h22M-11 9h22M-11 14h22" stroke="#FFFFFF" strokeOpacity=".28" />
      <circle cy="-10" r="4" fill="none" stroke="#FFFFFF" strokeOpacity=".5" />
      <rect x="-7" y="21" width="14" height="9" fill="#1A0E4A" />
    </g>
  );
  const display = powered ? `IN ${pct}% · ON` : switchOn ? '230 V~ · NO LOAD' : '230 V~ · OFF';
  const message = stage === 1 ? 'Unplugged.' : stage === 2 ? 'Plugged in. Turn the switch on to charge.' : 'Switched on. The ultracapacitor is charging.';
  const steps = ['1 · Plug in', '2 · Switch on', '3 · Charging'];

  return (
    <>
      <ol aria-hidden="true" className="mb-1 flex flex-wrap gap-1.5 p-0">
        {steps.map((label, i) => (
          <li
            key={label}
            className={cn(
              'rounded-pill border bg-surface px-[11px] py-[7px] font-mono text-[11px] leading-none font-medium tracking-[.1em] text-muted transition-[background-color,color,border-color] duration-300',
              i + 1 === stage && 'border-brand-navy bg-brand-navy text-white',
              i + 1 < stage && 'border-cyan-100 bg-cyan-100 text-brand-navy',
            )}
          >
            {label}
          </li>
        ))}
      </ol>
      <div className="relative before:absolute before:-inset-x-[6%] before:-inset-y-[8%] before:-z-10 before:bg-[radial-gradient(closest-side,#fff_72%,rgba(255,255,255,0))]">
        <svg
          ref={svgRef}
          viewBox="0 0 640 400"
          role="group"
          aria-labelledby="sceneTitle"
          className="block h-auto w-full overflow-visible select-none [-webkit-tap-highlight-color:transparent]"
        >
          <title id="sceneTitle">Faradigm ultracapacitor wired to a wall switchboard. Plug the adapter into the socket, then turn the switch on to charge the cell.</title>
          <defs>
            <linearGradient id="hBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#33217F" /><stop offset=".5" stopColor="#221459" /><stop offset="1" stopColor="#150B3C" /></linearGradient>
            <linearGradient id="hTop" x1="0" y1="1" x2=".35" y2="0"><stop offset="0" stopColor="#43309B" /><stop offset="1" stopColor="#271764" /></linearGradient>
            <linearGradient id="hSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1C1050" /><stop offset="1" stopColor="#0E0730" /></linearGradient>
            <linearGradient id="hCharge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={lo} /><stop offset="1" stopColor={hi} /></linearGradient>
            <radialGradient id="hGlow"><stop offset="0" stopColor={hi} stopOpacity=".42" /><stop offset="1" stopColor={hi} stopOpacity="0" /></radialGradient>
            <linearGradient id="hSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0" /><stop offset=".5" stopColor="#FFFFFF" stopOpacity=".16" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></linearGradient>
            <clipPath id="hBodyClip"><rect x="90" y="150" width="130" height="170" /></clipPath>
          </defs>
          <path d="M0 350H640" stroke="#DCDAE6" strokeWidth="2" />
          <ellipse cx="148" cy="346" rx="138" ry="9" fill="#29166F" fillOpacity=".08" />

          {/* Ultracapacitor: top and side faces behind, front face over them */}
          <g transform="matrix(1.45 0 0 1.45 -90.5 -122)">
            <circle cx="165" cy="232" r="130" fill="url(#hGlow)" style={{ opacity: level * 0.9 }} className="transition-opacity duration-300" />
            <circle cx="165" cy="235" r="96" fill="none" stroke={hi} strokeWidth="3" className={cn('origin-center opacity-0 [transform-box:fill-box]', full && 'animate-full-ring')} />
            <path d="M90 150H220L244 132H114Z" fill="url(#hTop)" />
            <path d="M220 150L244 132V302L220 320Z" fill="url(#hSide)" />
            <rect x="90" y="150" width="130" height="170" fill="url(#hBody)" />
            <rect x="90" y="150" width="130" height="34" fill="#FFFFFF" fillOpacity=".05" />
            <path d="M122 136h18l6-5h-18zM180 136h18l6-5h-18z" fill="#F4F4F8" />
            <rect x="122" y="118" width="18" height="18" fill="#C9C4DF" /><rect x="180" y="118" width="18" height="18" fill="#C9C4DF" />
            <path d="M140 118l6-5v18l-6 5zM198 118l6-5v18l-6 5z" fill="#8C83B8" />
            <text x="131" y="110" textAnchor="middle" fontFamily="Archivo,Arial" fontWeight="800" fontSize="15" fill="#0093DD">+</text>
            <text x="189" y="110" textAnchor="middle" fontFamily="Archivo,Arial" fontWeight="800" fontSize="16" fill="#0093DD">−</text>
            <text x="155" y="169" textAnchor="middle" fontFamily="Archivo,Arial" fontStyle="italic" fontWeight="800" fontSize="11" letterSpacing="1" fill="#FFFFFF">FARADIGM®</text>
            <text x="155" y="179" textAnchor="middle" fontFamily={mono} fontWeight="500" fontSize="5.5" letterSpacing="2" fill="#BFBCCC">ULTRACAPACITOR</text>
            <g fill="#FFFFFF" fillOpacity=".04" stroke="#FFFFFF" strokeOpacity=".08">
              {BAR_YS.map((y) => <rect key={y} x="105" y={y} width="100" height="18" />)}
            </g>
            <g>
              {BAR_YS.map((y, i) => (
                <rect key={y} x="105" y={y} width="100" height="18" fill="url(#hCharge)" className={cn('transition-opacity duration-200', i < lit ? 'opacity-100' : 'opacity-[.12]')} />
              ))}
            </g>
            <text x="105" y="314" fontFamily={mono} fontWeight="500" fontSize="8" letterSpacing="1.2" fill="#BFBCCC">CHARGE</text>
            <text x="205" y="315" textAnchor="end" fontFamily={mono} fontWeight="500" fontSize="11" fill={lo}>{pct}%</text>
            <g clipPath="url(#hBodyClip)"><rect x="20" y="150" width="70" height="170" fill="url(#hSheen)" className={cn(powered && 'animate-sheen')} /></g>
            <path d="M90 150H220" stroke="#FFFFFF" strokeOpacity=".4" strokeWidth="1.5" fill="none" />
            <path d="M220 150V320M220 150L244 132" stroke="#FFFFFF" strokeOpacity=".2" strokeWidth="1.5" fill="none" />
            <path d="M114 132H244M90 150V320" stroke="#FFFFFF" strokeOpacity=".12" strokeWidth="1.5" fill="none" />
            <path d="M228 282l12-9v14l-12 9z" fill="#0E0730" stroke="#0093DD" strokeWidth="1.2" />
          </g>

          {/* Wall switchboard */}
          <g transform="matrix(.72 0 0 .72 167.6 29.52)">
            <rect x="420" y="84" width="196" height="210" fill="#FFFFFF" stroke="#29166F" strokeWidth="2" />
            <g stroke="#0093DD" strokeWidth="1.6"><path d="M430 98h8M434 94v8" /><path d="M598 98h8M602 94v8" /><path d="M430 280h8M434 276v8" /><path d="M598 280h8M602 276v8" /></g>
            <rect x="438" y="108" width="160" height="30" fill="#1A0E4A" />
            <text x="448" y="128" fontFamily={mono} fontWeight="500" fontSize="11" letterSpacing="1" fill={switchOn ? '#5CC1F2' : '#8C83B8'}>{display}</text>
            <rect x="438" y="150" width="160" height="126" fill="#F4F4F8" stroke="#DCDAE6" />
            <g transform="translate(486 210)">
              <g className={cn('opacity-0 transition-opacity duration-200', near && 'opacity-100')}>
                <circle r="40" fill="none" stroke="#0093DD" strokeWidth="2" className="origin-center animate-target-ring [transform-box:fill-box]" />
              </g>
              <circle r="30" fill="#FFFFFF" stroke="#29166F" strokeWidth="2" />
              <circle cy="-10.2" r="5.1" fill="#1A0E4A" /><circle cx="-10.2" cy="8.4" r="3.6" fill="#1A0E4A" /><circle cx="10.2" cy="8.4" r="3.6" fill="#1A0E4A" />
              <circle key={burst} r="34" fill="none" stroke="#0093DD" strokeWidth="3" className={cn('origin-center opacity-0 [transform-box:fill-box]', burst > 0 && 'animate-burst')} />
            </g>
          </g>

          {/* Cable from the cell's input port to the adapter plug; the dashes carry current toward the cell */}
          <path d={path} fill="none" stroke="#1A0E4A" strokeWidth="6" strokeLinecap="round" />
          <path d={path} fill="none" stroke="#5CC1F2" strokeWidth="2" strokeLinecap="round" className={cn('[stroke-dasharray:6_12] transition-opacity duration-300', powered ? 'animate-wire-flow opacity-100' : 'opacity-0')} />
          <g className={cn('transition-opacity duration-[400ms]', powered && 'opacity-0')}>
            <text x="320" y="384" textAnchor="middle" fontFamily={mono} fontWeight="500" fontSize="12" letterSpacing="1.5" fill="#5E5A72">
              {stage === 2 ? 'STEP 2 · FLIP THE SWITCH ↗' : 'STEP 1 · DRAG OR TAP THE PLUG →'}
            </text>
          </g>

          <g
            ref={plugRef}
            transform={`translate(${pos.x.toFixed(1)} ${(pos.y + bob).toFixed(1)})`}
            tabIndex={0}
            role="button"
            aria-label="Adapter plug. Press Enter to plug it into the socket, or to unplug it."
            className={cn('group/plug touch-none outline-none [-webkit-touch-callout:none]', dragging ? 'cursor-grabbing' : 'cursor-grab')}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onDrop}
            onPointerCancel={onDrop}
            onKeyDown={onPlugKey}
          >
            <g>
              {plugArt}
            </g>
          </g>

          {/* The wall switch comes after the plug so Tab reaches step 1 (plug) before step 2 (switch) */}
          <g transform="matrix(.72 0 0 .72 167.6 29.52)">
            <g
              tabIndex={0}
              role="switch"
              aria-checked={switchOn}
              aria-label="Wall switch"
              className="group/rocker cursor-pointer outline-none"
              onClick={flip}
              onKeyDown={onSwitchKey}
            >
              <rect x="528" y="150" width="72" height="122" fill="transparent" />
              <rect x="540" y="176" width="40" height="68" rx="2" fill="#FFFFFF" stroke="#29166F" strokeWidth="2" className="group-focus-visible/rocker:stroke-focus group-focus-visible/rocker:stroke-3" />
              <rect x="546" y={switchOn ? 210 : 182} width="28" height="28" fill="#29166F" />
              <text x="560" y="258" textAnchor="middle" fontFamily={mono} fontWeight="500" fontSize="8" fill="#5E5A72">I / O</text>
              <circle cx="560" cy="168" r="3.5" fill={switchOn ? '#0093DD' : '#DCDAE6'} />
            </g>
          </g>
          {!idle && !plugged && (
            <g aria-hidden="true" pointerEvents="none" transform={`translate(${pos.x.toFixed(1)} ${(pos.y + bob).toFixed(1)})`}>
              {plugArt}
            </g>
          )}
        </svg>
        <p className="sr-only" role="status" aria-live="polite">{message}</p>
      </div>
    </>
  );
}
