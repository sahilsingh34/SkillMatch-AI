"use client"

import { FC, useEffect, useRef, useState } from "react"
import { motion, useSpring } from "motion/react"

interface Position {
  x: number
  y: number
}

export interface SmoothCursorProps {
  cursor?: React.ReactNode
  springConfig?: {
    damping: number
    stiffness: number
    mass: number
    restDelta: number
  }
}

const DefaultCursorSVG: FC = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.5 }}
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill={isDark ? "white" : "black"}
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke={isDark ? "black" : "white"}
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

const PointerCursorSVG: FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const color = isDark ? "white" : "black";
  const outline = isDark ? "black" : "white";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      style={{ marginLeft: '-10px', marginTop: '-2px' }}
    >
      {/* Click effect rays - outline */}
      <g stroke={outline} strokeWidth="4" strokeLinecap="round">
        <line x1="11" y1="1" x2="11" y2="3.5" />
        <line x1="6" y1="3" x2="8" y2="5" />
        <line x1="16" y1="3" x2="14" y2="5" />
        <line x1="3" y1="8" x2="5.5" y2="8" />
        <line x1="19" y1="8" x2="16.5" y2="8" />
      </g>
      {/* Click effect rays */}
      <g stroke={color} strokeWidth="2" strokeLinecap="round">
        <line x1="11" y1="1" x2="11" y2="3.5" />
        <line x1="6" y1="3" x2="8" y2="5" />
        <line x1="16" y1="3" x2="14" y2="5" />
        <line x1="3" y1="8" x2="5.5" y2="8" />
        <line x1="19" y1="8" x2="16.5" y2="8" />
      </g>
      {/* Solid hand */}
      <path
        fill={color}
        stroke={outline}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 11.5V13h1.5V9.5A1.5 1.5 0 0 1 18 9.5V13h1V11.5A1.5 1.5 0 0 1 22 11.5V17.5C22 21 19.5 23.5 16 23.5H10.5C8 23.5 5 21 4 18.5L2.8 16.5C2.2 15.2 2.7 13.8 3.8 13.2C4.9 12.6 6.2 12.9 7 13.8L8.5 15.5V6.5C8.5 4.8 9.6 3.5 11 3.5C12.4 3.5 13.5 4.8 13.5 6.5V11.5Z"
      />
    </svg>
  )
}

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const [isMoving, setIsMoving] = useState(false)
  const lastMousePos = useRef<Position>({ x: 0, y: 0 })
  const velocity = useRef<Position>({ x: 0, y: 0 })
  const lastUpdateTime = useRef(Date.now())
  const previousAngle = useRef(0)
  const accumulatedRotation = useRef(0)
  const [isDesktop, setIsDesktop] = useState(false)
  // State for pointer hover
  const [isPointer, setIsPointer] = useState(false)

  // Only run on desktop devices (with a precise pointer)
  useEffect(() => {
    setIsDesktop(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  })
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  })

  useEffect(() => {
    if (!isDesktop) return;

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastUpdateTime.current

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        }
      }

      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos
    }

    const smoothMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY }
      updateVelocity(currentPos)

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2)
      )

      cursorX.set(currentPos.x)
      cursorY.set(currentPos.y)

      if (speed > 0.1 && !isPointer) { // Disable rotation when it's a pointer hand
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90

        let angleDiff = currentAngle - previousAngle.current
        if (angleDiff > 180) angleDiff -= 360
        if (angleDiff < -180) angleDiff += 360
        accumulatedRotation.current += angleDiff
        rotation.set(accumulatedRotation.current)
        previousAngle.current = currentAngle

        scale.set(0.95)
        setIsMoving(true)

        const timeout = setTimeout(() => {
          scale.set(1)
          setIsMoving(false)
        }, 150)

        return () => clearTimeout(timeout)
      } else if (isPointer) {
        rotation.set(0); // Lock rotation to upright for the pointer hand
      }
    }

    let rafId: number
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        smoothMouseMove(e)
        rafId = 0
      })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      try {
        const hasCursorPointer = window.getComputedStyle(target).cursor === 'pointer';

        // For custom UI components that might intercept standard pointer detection
        const closestClickable = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"], label, select, summary');

        if (closestClickable || hasCursorPointer) {
          setIsPointer(true);
        } else {
          setIsPointer(false);
        }
      } catch (err) {
        // Handle cross-origin iframe computed style errors gracefully
      }
    };

    document.body.style.cursor = "none"
    window.addEventListener("mousemove", throttledMouseMove)
    window.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
      document.body.style.cursor = "auto"
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [cursorX, cursorY, rotation, scale, isDesktop, isPointer])

  if (!isDesktop) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        rotate: rotation,
        scale: scale,
        zIndex: 100,
        pointerEvents: "none",
        willChange: "transform",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      {isPointer ? <PointerCursorSVG /> : cursor}
    </motion.div>
  )
}
