"use client"

import React, { type ReactNode, useEffect, useState } from "react"

interface FadeContentProps {
  delay?: number
  duration?: number
  children: ReactNode
}

export function FadeContent({
  delay = 0,
  duration = 1500,
  children,
}: FadeContentProps) {
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement<{ style?: React.CSSProperties }>(child)
          ? React.cloneElement(child, {
              style: {
                ...child.props.style,
                opacity: isVisible ? 1 : 0,
                transition: `opacity ${duration}ms ease-out`,
              },
            })
          : child
      )}
    </>
  )
}
