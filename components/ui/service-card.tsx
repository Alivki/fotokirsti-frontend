import React, { type CSSProperties, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface ServiceCardProps {
  title: string
  text: string
  icon: ReactNode
  style?: CSSProperties
}

export function ServiceCard({ title, text, icon, style }: ServiceCardProps) {
  return (
    <div
      style={style}
      className={cn(
        "flex min-h-[136px] flex-row gap-6 rounded-md border border-border bg-secondary p-6 shadow",
        "md:w-[40%] md:flex-grow lg:min-h-[156px] lg:w-[30%] xl:p-8"
      )}
    >
      <div>{icon}</div>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground xl:text-base">{text}</p>
      </div>
    </div>
  )
}
