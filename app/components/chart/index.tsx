import Basic from '@/app/components/base/basic'
import Loading from '@/app/components/base/loading'
import type { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { groupBy } from 'lodash-es'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

const valueFormatter = (v: string | number) => v

const COMMON_COLOR_MAP = {
  label: '#9CA3AF',
  splitLineLight: '#F3F4F6',
  splitLineDark: '#E5E7EB',
}

export type IChartType = 'line' | 'bar' | 'pie'

export type IChartProps = {
  className?: string
  basicInfo: { title: string; explanation?: string; timePeriod?: string }
  nameKey?: string
  valueKey?: string
  isAvg?: boolean
  unit?: string
  yMax?: number
  chartType: IChartType
  chartData: { data: Array<{ name: string; value: number; currentDate: string }> } | {
    data: Array<{ currentDate: string; value: number }>
  }
}

const Chart: FC<IChartProps> = ({
  basicInfo: {
    title,
    explanation,
    timePeriod,
  },
  chartType = 'bar',
  chartData,
  valueKey,
  nameKey,
  yMax,
  className,
}) => {
  const chartRef = useRef<ReactECharts>(null)
  const [chartDimensions, setChartDimensions] = useState({
    width: '100%',
    height: chartType === 'pie' ? 400 : 200,
  })

  useEffect(() => {
    const handleResize = () => {
      setChartDimensions({
        width: '100%',
        height: chartType === 'pie' ? 400 : 200,
      })
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [chartType])

  const statistics = chartData.data
  const statisticsLen = statistics.length
  const extraDataForMarkLine = new Array(statisticsLen >= 2 ? statisticsLen - 2 : statisticsLen).fill('1')
  extraDataForMarkLine.push('')
  extraDataForMarkLine.unshift('')

  const xData = statistics.map(({ currentDate }) => currentDate)
  const yField = valueKey || Object.keys(statistics[0]).find(name => name.includes('value')) || ''
  const xField = nameKey || (Object.keys(groupBy(statistics, 'currentDate')).length > 1 ? 'currentDate' : 'name')
  const options: EChartsOption = {
    dataset: {
      dimensions: [xField, yField],
      source: statistics,
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '10%',
      top: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'item',
      position: 'top',
      borderWidth: 0,
    },
    color: [
      '#0075ff',
      '#52c1ff',
      '#0736c0',
      '#4144f9',
      '#6598f8',
      '#a8b0f8',
    ],
    xAxis: [{
      type: 'category',
      axisLabel: {
        color: COMMON_COLOR_MAP.label,
        hideOverlap: true,
        overflow: 'break',
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: COMMON_COLOR_MAP.splitLineLight,
          width: 1,
          type: [10, 10],
        },
        interval(index) {
          return index === 0 || index === xData.length - 1
        },
      },
    }, {
      position: 'bottom',
      data: extraDataForMarkLine,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: COMMON_COLOR_MAP.splitLineDark,
        },
        interval(index, value) {
          return !!value
        },
      },
    }],
    yAxis: {
      max: yMax ?? 'dataMax',
      type: 'value',
      axisLabel: {
        color: COMMON_COLOR_MAP.label,
        hideOverlap: true,
      },
      splitLine: {
        lineStyle: {
          color: COMMON_COLOR_MAP.splitLineLight,
        },
      },
    },
    series: [
      {
        type: chartType,
        showSymbol: true,
        labelLine: {
          length: -10,
          length2: -10,
        },
        symbolSize: 4,
        radius: [20, 120],
        center: ['50%', '50%'],
        roseType: 'area',
        barMaxWidth: 14,
        barGap: '10',
        tooltip: {
          padding: [4, 6, 4, 6],
          formatter(params) {
            return `<div style="color:#6B7280;font-size:12px">${params.name}</div>
                <div style="font-size:14px;color:#1F2A37">${valueFormatter((params.data as any)[yField])}
            </div>`
          },
        },
        itemStyle: chartType === 'pie'
          ? {
            borderRadius: 8,
          }
          : {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#0075ff' },
                { offset: 1, color: 'rgba(0,117,255,0.06)' },
              ],
            },
          },

        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#0075ff' },
              { offset: 1, color: 'rgba(82,193,255,0.28)' },
            ],
          },
        },
      },
    ],
  }

  return (
    <div
      className={`flex flex-col w-full px-1 py-1 border-[0.5px] rounded-lg border-gray-200 shadow-xs ${className ?? ''}`}
    >
      <div className="mb-1">
        <Basic name={title} type={timePeriod} hoverTip={explanation}/>
      </div>
      <ReactECharts
        ref={chartRef}
        style={{
          width: '100%',
          height: chartDimensions.height,
        }}
        option={options}
      />
    </div>
  )
}

export const BarChart: FC<IChartProps> = ({
  chartData,
  basicInfo,
}) => {
  const noDataFlag = !chartData || chartData.data.length === 0
  if (noDataFlag) {
    return <Loading/>
  }

  return <Chart
    basicInfo={basicInfo}
    chartData={{ data: chartData.data }}
    chartType="bar"
    {...(noDataFlag ? { yMax: 500 } : {})}
  />
}

export const LineChart: FC<IChartProps> = ({
  chartData,
  basicInfo,
}) => {
  const noDataFlag = !chartData || chartData.data.length === 0
  if (noDataFlag) {
    return <Loading/>
  }

  return <Chart
    basicInfo={basicInfo}
    chartData={{ data: chartData.data }}
    chartType="line"
    {...(noDataFlag ? { yMax: 500 } : {})}

  />
}

export const PieChart: FC<IChartProps> = ({
  chartData,
  basicInfo,
}) => {
  const noDataFlag = !chartData || chartData.data.length === 0
  if (noDataFlag) {
    return <Loading/>
  }

  return <Chart
    basicInfo={basicInfo}
    chartData={{ data: chartData.data }}
    chartType="pie"
    {...(noDataFlag ? { yMax: 500 } : {})}
  />
}
