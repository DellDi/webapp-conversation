import Loading from '@/app/components/base/loading'
import type { IChartProps } from './index'
import type { FC } from 'react'

/**
 * 卡片图表，用于展示单条数据概览
 * 预期 chartData.data 至多 1 条
 */
const CardChart: FC<IChartProps> = ({ chartData, basicInfo }) => {
  const noDataFlag = !chartData || chartData.data.length === 0
  if (noDataFlag) return <Loading />

  const { name, type, value, currentDate } = chartData.data[0] as any
  return (
    <div className="flex flex-col justify-between w-full p-4 rounded-lg shadow border border-gray-200 bg-white min-h-[120px]">
      <div>
        <div className="text-gray-900 font-medium text-base mb-1 truncate">{name}</div>
        {type && <div className="text-gray-500 text-sm mb-2 truncate">{type}</div>}
      </div>
      <div className="flex items-end justify-between w-full">
        <div className="text-blue-600 text-2xl font-semibold leading-none">
          {value}
          {typeof value === 'number' && <span className="text-base ml-0.5">%</span>}
        </div>
        {currentDate && <div className="text-gray-400 text-xs ml-2">{currentDate}</div>}
      </div>
    </div>
  )
}

export default CardChart
