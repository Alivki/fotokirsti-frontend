"use client"

import React, { type ReactNode, useEffect, useState } from "react"

interface AnimateContentProps {
  delay?: number
  duration?: number
  distance?: number
  stagger?: boolean
  staggerOffset?: number
  direction?: "down" | "up"
  children: ReactNode
}

export function AnimateContent({
  delay = 50,
  duration = 1000,
  distance = 25,
  stagger = false,
  staggerOffset = 0,
  direction = "up",
  children,
}: AnimateContentProps) {
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <>
      {React.Children.map(children, (child, index) =>
        React.isValidElement<{ style?: React.CSSProperties }>(child)
          ? React.cloneElement(child, {
              style: {
                ...child.props.style,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0)"
                  : `translateY(${direction === "down" ? -distance : distance}px)`,
                transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                transitionDelay: isVisible
                  ? `${stagger ? delay + index * staggerOffset : delay}ms`
                  : "0ms",
              },
            })
          : child
      )}
    </>
  )
}
