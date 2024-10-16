import type { FC } from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import style from './style.module.css'
import defaultIconUrl from './icon.png' // 假设默认图标仍保留

export type AppIconProps = {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string // 现在将用于定义图标路径
  background?: string
  className?: string
  innerIcon?: JSX.Element
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  background,
  className,
  icon = defaultIconUrl, // 添加默认图标作为 fallback
  innerIcon,
}) => {
  const effectiveIcon = icon || defaultIconUrl

  return (
    <span
      className={classNames(
        style.appIcon,
        size !== 'medium' && style[size],
        rounded && style.rounded,
        className ?? '',
      )}
      style={{ background }}
    >
      <Image
        src={effectiveIcon}
        alt="logo"
      />
    </span>
  )
}

export default AppIcon
