import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import type { IChartType } from '../chart'
import { BarChart, LineChart, PieChart } from '../chart'

export function Markdown(props: { content: string }) {
  let isChartRender
  let jsonRes = {
    chartType: 'line',
    targetName: '',
    precinctName: '',
    data: [
      {
        name: '新安明珠',
        value: 1000.22,
        currentDate: '2024',
      },
    ],
  }
  let chartStr, mkStr
  const contentArr = props.content.split('---图表信息如下---')
  if (contentArr.length > 1) {
    mkStr = contentArr[0]
    chartStr = contentArr[1]
  } else {
    chartStr = contentArr[0]
  }
  try {
    jsonRes = JSON.parse(chartStr)
    isChartRender = true
  } catch (error) {
    isChartRender = false
    mkStr = props.content
  }
  const data = jsonRes.data
  const precinctName = jsonRes.precinctName
  return (
    <div className="markdown-body">
      {mkStr && <ReactMarkdown
        remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
        rehypePlugins={[
          RehypeKatex,
        ]}
        components={{
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto bg-white mb-4 rounded-md dark:bg-black">
                <table {...props} className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                  {children}
                </table>
              </div>
            )
          },
          thead({ children, ...props }) {
            return (
              <thead {...props}
                     className="border-b border-neutral-200 bg-neutral-50 font-medium dark:border-white/10 dark:text-neutral-800">
              {children}
              </thead>
            )
          },
          tr({ children, ...props }) {
            return (
              <tr {...props} className="border-b border-neutral-200 dark:border-white/10">
                {children}
              </tr>
            )
          },
          th({ children, ...props }) {
            return (
              <th {...props} className="px-2 py-2">
                {children}
              </th>
            )
          },
          td({ children, ...props }) {
            return (
              <td {...props} className="px-2 py-2 whitespace-nowrap">
                {children}
              </td>
            )
          },
          code({ children, ...props }) {
            const match = /language-(\w+)/.exec(props.className || '')
            return (!props.inline && match)
              ? (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, '')}
                  style={atelierHeathLight}
                  language={match[1]}
                  showLineNumbers
                  PreTag="div"
                />
              )
              : (
                <code {...props} className={props.className}>
                  {children}
                </code>
              )
          },
        }}
        linkTarget={'_blank'}
      >
        {mkStr}
      </ReactMarkdown>}

      {isChartRender && (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 w-full mb-2 bg-white">
          {(() => {
            const ChartComponent = {
              line: LineChart,
              bar: BarChart,
              pie: PieChart,
            }[jsonRes.chartType]

            return ChartComponent
              ? (
                <ChartComponent
                  chartData={{ data }}
                  basicInfo={{ title: `【${precinctName}】` }}
                  chartType={jsonRes.chartType as IChartType}
                />
              )
              : null
          })()}
        </div>
      )}
    </div>
  )
}
