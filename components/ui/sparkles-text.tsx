'use client'
import React from 'react'
import { CSSProperties, ReactElement, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

interface SparklesTextProps {
  /**
   * @default <div />
   * @type ReactElement
   * @description
   * The component to be rendered as the text
   * */
  as?: ReactElement;

  /**
   * @default ""
   * @type string
   * @description
   * The className of the text
   */
  className?: string;

  /**
   * @required
   * @type string
   * @description
   * The text to be displayed
   * */
  text: string;

  /**
   * @default 10
   * @type number
   * @description
   * The count of sparkles
   * */
  sparklesCount?: number;

  /**
   * @default "{first: '#9E7AFF', second: '#FE8BBB'}"
   * @type string
   * @description
   * The colors of the sparkles
   * */
  colors?: {
    first: string;
    second: string;
  };
}

const SparklesText: React.FC<SparklesTextProps> = ({
  text,
  colors = { first: '#9E7AFF', second: '#FE8BBB' },
  className,
  sparklesCount = 10,
  ...props
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateStar = (): Sparkle => {
      const starX = `${Math.random() * 100}%`
      const starY = `${Math.random() * 100}%`
      const color = Math.random() > 0.5 ? colors.first : colors.second
      const delay = Math.random() * 2
      const scale = Math.random() * 1 + 0.3
      const lifespan = Math.random() * 10 + 5
      const id = `${starX}-${starY}-${Date.now()}`
      return { id, x: starX, y: starY, color, delay, scale, lifespan }
    }

    const initializeStars = () => {
      const newSparkles = Array.from({ length: sparklesCount }, generateStar)
      setSparkles(newSparkles)
    }

    const updateStars = () => {
      setSparkles((currentSparkles) =>
        currentSparkles.map((star) => {
          if (star.lifespan <= 0) {
            return generateStar()
          } else {
            return { ...star, lifespan: star.lifespan - 0.1 }
          }
        }),
      )
    }

    initializeStars()
    const interval = setInterval(updateStars, 100)

    return () => clearInterval(interval)
  }, [colors.first, colors.second])

  return (
    <div
      className={cn('text-6xl font-bold', className)}
      {...props}
      style={
        {
          '--sparkles-first-color': `${colors.first}`,
          '--sparkles-second-color': `${colors.second}`,
        } as CSSProperties
      }
    >
      <span className="relative inline-block">
        {sparkles.map((sparkle) => (
          <Sparkle key={sparkle.id} {...sparkle} />
        ))}
        <strong>{text}</strong>
      </span>
    </div>
  )
}

const Sparkle: React.FC<Sparkle> = ({ id, x, y, color, delay, scale }) => {
  return (
    <motion.svg
      key={id}
      className="pointer-events-none absolute z-20"
      initial={{ opacity: 0, left: x, top: y }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, scale, 0],
        rotate: [75, 120, 150],
      }}
      transition={{ duration: 0.8, repeat: Infinity, delay }}
      width="21"
      height="21"
      viewBox="0 0 21 21" // 修改这里
    >
      <path
        // 修改这里的 path 数据
        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72023C12.4006 4.19225 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59932 18.2797 9.13819L20.1561 9.82531C20.7848 10.0553 20.7848 10.9446 20.1561 11.1746L18.2797 11.8618C16.8077 12.4006 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2797L11.1746 20.1561C10.9446 20.7848 10.0553 20.7848 9.82531 20.1561L9.13819 18.2797C8.59932 16.8077 6.39157 16.8077 5.28314 15.6993C4.17471 14.5909 4.19225 12.4006 3.72023 10.8618L2.84384 9.82531C2.21518 9.59533 2.21518 8.70599 2.84384 8.47601L4.72023 7.78889C6.19225 7.25002 8.39157 7.25909 9.5 6.15066C10.6084 5.04223 10.5994 2.84291 11.1383 1.37089L11.8254 0.843845"
        fill={color}
      />
    </motion.svg>
  )
}

export default SparklesText
