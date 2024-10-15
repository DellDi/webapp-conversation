import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import RehypeKatex from 'rehype-katex'
import RemarkBreaks from 'remark-breaks'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'
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
      {
        name: '未来中心',
        value: 9912.22,
        currentDate: '2024',
      },
      {
        name: '金色蓝庭',
        value: 1120.22,
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
    <div className="markdown-body overflow-x-auto">
      {mkStr && <ReactMarkdown
        remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
        rehypePlugins={[
          RehypeKatex,
        ]}
        components={{
          table: ({
            node,
            ...props
          }) => <Table {...props} />,
          thead: ({
            node,
            ...props
          }) => <TableHead {...props} />,
          tr: ({
            node,
            ...props
          }) => <TableRow {...props} />,
          th: ({
            node,
            ...props
          }) => <TableCell as="th" {...props} />,
          td: ({
            node,
            ...props
          }) => <TableCell {...props} />,
          tbody: ({
            node,
            ...props
          }) => <TableBody {...props} />,
          code({
            node,
            inline,
            className,
            children,
            ...props
          }) {
            const match = /language-(\w+)/.exec(className || '')
            return (!inline && match)
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
                <code {...props} className={className}>
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
        <div className="grid  w-full mb-2 bg-white">
          {jsonRes.chartType === 'line' && <LineChart chartData={{ data }} basicInfo={{
            title: `【${precinctName}】-` + '折线图',
          }} chartType={'line'}
          />}
          {jsonRes.chartType === 'bar' && <BarChart chartData={{ data }} basicInfo={{
            title: `【${precinctName}】-` + '柱状图',
          }} chartType={'bar'}
          />}
          {jsonRes.chartType === 'pie' && <PieChart chartData={{ data }} basicInfo={{
            title: `【${precinctName}】-` + '饼图',
          }} chartType={'pie'}
          />}
        </div>
      )}
    </div>
  )
}
