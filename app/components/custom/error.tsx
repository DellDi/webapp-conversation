'use client'
import React from 'react'
import Globe from '@/components/ui/globe'
import SparklesText from '@/components/ui/sparkles-text'

export default function GlobeError() {
  return (
    <div
      className="relative flex size-full max-w-xl align-middle items-center justify-center overflow-hidden rounded-lg border bg-background mx-auto px-4 pb-4 pt-8 md:pb-60 md:shadow-xl">
      <Globe className="top-12"/>
      <div
        className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]"/>
      <div
        className="absolute bottom-1/4 pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-2xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        <h3>错误：缺少必要参数</h3>
        <SparklesText className="text-blue-700 text-sm mt-2" text="请联系管理员进行AI授权"/>
      </div>
    </div>
  )
}
