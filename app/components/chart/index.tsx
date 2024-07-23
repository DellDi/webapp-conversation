import type { FC } from 'react'
import React from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { groupBy } from 'lodash-es'
// import { formatNumber } from '@/utils/format'
import Loading from '@/app/components/base/loading'
import Basic from '@/app/components/base/basic'
const valueFormatter = (v: string | number) => v

const COLOR_TYPE_MAP = {
    green: {
        lineColor: 'rgba(91, 143, 249, 1)',
        bgColor: ['rgba(64, 158, 255, 0.2)', 'rgba(64, 158, 255, 0.08)'],
    },
    orange: {
        lineColor: 'rgba(97, 221, 170, 1)',
        bgColor: ['rgba(119, 230, 184, 0.2)', 'rgba(119, 230, 184, 0.1)'],
    },
    blue: {
        lineColor: 'rgba(28, 100, 242, 1)',
        bgColor: ['rgba(28, 100, 242, 0.3)', 'rgba(28, 100, 242, 0.1)'],
    },
}

const COMMON_COLOR_MAP = {
    label: '#9CA3AF',
    splitLineLight: '#F3F4F6',
    splitLineDark: '#E5E7EB',
}

type IColorType = 'green' | 'orange' | 'blue'
export type IChartType = 'line' | 'bar' | 'pie'
type IChartConfigType = { colorType: IColorType; showTokens?: boolean }


export type IChartProps = {
    className?: string
    basicInfo: { title: string; explanation?: string; timePeriod?: string }
    nameKey?: string
    valueKey?: string
    isAvg?: boolean
    unit?: string
    yMax?: number
    chartType: IChartType
    chartData: { data: Array<{ name: string; value: number; currentDate: string; }> } | { data: Array<{ currentDate: string; value: number }> }
}

const CHART_TYPE_CONFIG: Record<string, IChartConfigType> = {
    line: {
        colorType: 'green',
    },
    bar: {
        colorType: 'orange',
    },
    pie: {
        colorType: 'blue',
    },
}

const sum = (arr: number[]): number => {
    return arr.reduce((acr, cur) => {
        return acr + cur
    })
}

const Chart: React.FC<IChartProps> = ({
    basicInfo: { title, explanation, timePeriod },
    chartType = 'bar',
    chartData,
    valueKey,
    nameKey,
    isAvg,
    unit = '',
    yMax,
    className,
}) => {
    const statistics = chartData.data
    const statisticsLen = statistics.length
    const extraDataForMarkLine = new Array(statisticsLen >= 2 ? statisticsLen - 2 : statisticsLen).fill('1')
    extraDataForMarkLine.push('')
    extraDataForMarkLine.unshift('')

    const xData = statistics.map(({ currentDate }) => currentDate)
    const yField = valueKey || Object.keys(statistics[0]).find(name => name.includes('value')) || ''
    const xField = nameKey || Object.keys(groupBy(statistics, 'currentDate')).length > 1 ? 'currentDate' : 'name'

    const options: EChartsOption = {
        dataset: {
            dimensions: [xField, yField],
            source: statistics,
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '10%',
            top: '10%', containLabel: true
        },
        tooltip: {
            trigger: 'item',
            position: 'top',
            borderWidth: 0,
        },
        xAxis: [{
            type: 'category',
            // boundaryGap: false,
            boundaryGap: [10, 10],
            axisLabel: {
                color: COMMON_COLOR_MAP.label,
                hideOverlap: true,
                overflow: 'break',
                // formatter(value) {
                //     return dayjs(value).format(commonDateFormat)
                // },
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
            boundaryGap: false,
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
            axisLabel: { color: COMMON_COLOR_MAP.label, hideOverlap: true },
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
                // symbol: 'circle',
                // triggerLineEvent: true,
                symbolSize: 4,
                radius: [20, 150],
                center: ['50%', '50%'],
                roseType: 'area',

                barMaxWidth: 14, // 设置柱子的最大宽度为50像素
                barGap: '10', // 控制同一组内柱子之间的间距

                lineStyle: {
                    color: COLOR_TYPE_MAP[CHART_TYPE_CONFIG[chartType].colorType].lineColor,
                    width: 2,
                },
                itemStyle: {
                    borderRadius: chartType === 'pie' ? 4 : 2,
                    color: chartType === 'pie' ? undefined : COLOR_TYPE_MAP[CHART_TYPE_CONFIG[chartType].colorType].lineColor,
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: COLOR_TYPE_MAP[CHART_TYPE_CONFIG[chartType].colorType].bgColor[0],
                        }, {
                            offset: 1, color: COLOR_TYPE_MAP[CHART_TYPE_CONFIG[chartType].colorType].bgColor[1],
                        }],
                        global: false,
                    },
                },
                tooltip: {
                    padding: [4, 6, 4, 6],
                    formatter(params) {
                        return `<div style='color:#6B7280;font-size:12px'>(${params.data.type})${params.name}</div>
                          <div style='font-size:14px;color:#1F2A37'>${valueFormatter((params.data as any)[yField])}
                          </div>`
                    },
                },
            },
        ],
    }

    return (
        <div className={`flex flex-col w-full px-1 py-1 border-[0.5px] rounded-lg border-gray-200 shadow-xs ${className ?? ''}`}>
            <div className='mb-3'>
                <Basic name={title} type={timePeriod} hoverTip={explanation} />
            </div>
            <ReactECharts option={options} style={{ height: chartType === 'pie' ? 400 : 200 }} />
        </div>
    )
}


export const BarChart: FC<IChartProps> = ({ chartData, basicInfo }) => {
    const noDataFlag = !chartData || chartData.data.length === 0
    if (noDataFlag) return <Loading />
    return <Chart
        basicInfo={basicInfo}
        chartData={{ data: chartData.data }}
        chartType='bar'
        {...(noDataFlag ? { yMax: 500 } : {})}

    />
}

export const LineChart: FC<IChartProps> = ({ chartData, basicInfo }) => {
    const noDataFlag = !chartData || chartData.data.length === 0
    if (noDataFlag) return <Loading />
    return <Chart
        basicInfo={basicInfo}
        chartData={{ data: chartData.data }}
        chartType='line'
        {...(noDataFlag ? { yMax: 500 } : {})}

    />
}

export const PieChart: FC<IChartProps> = ({ chartData, basicInfo }) => {
    const noDataFlag = !chartData || chartData.data.length === 0
    if (noDataFlag) return <Loading />
    return <Chart
        basicInfo={basicInfo}
        chartData={{ data: chartData.data }}
        chartType='pie'
        {...(noDataFlag ? { yMax: 500 } : {})}
    />
}