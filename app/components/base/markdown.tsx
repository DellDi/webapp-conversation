import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { BarChart, LineChart, PieChart } from '../chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const CustomTableRenderer = ({children}: {children: React.ReactNode}) => {
  const [header, ...rows] = Array.isArray(children) ? children : [children]

  return (
    <Table>
      <TableHeader>
        { header?.props?.children?.map((cell: React.ReactNode, index: number) => (
          <TableHead key={ index }>{ cell }</TableHead>
        )) }
      </TableHeader>
      <TableBody>
        { rows.map((row: any, rowIndex: number) => (
          <TableRow key={ rowIndex }>
            { row.props.children.map((cell: React.ReactNode, cellIndex: number) => (
              <TableCell key={ cellIndex }>{ cell }</TableCell>
            )) }
          </TableRow>
        )) }
      </TableBody>
    </Table>
  )
}

export function Markdown(props: {content: string}) {
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
    <div className="markdown-body">
      { mkStr && <ReactMarkdown
        remarkPlugins={ [RemarkMath, RemarkGfm, RemarkBreaks] }
        rehypePlugins={ [
          RehypeKatex,
        ] }
        components={ {
          table: CustomTableRenderer,
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return (!inline && match)
              ? (
                <SyntaxHighlighter
                  { ...props }
                  children={ String(children).replace(/\n$/, '') }
                  style={ atelierHeathLight }
                  language={ match[1] }
                  showLineNumbers
                  PreTag="div"
                />
              )
              : (
                <code { ...props } className={ className }>
                  { children }
                </code>
              )
          },
        } }
        linkTarget={ '_blank' }
      >
        { mkStr }
      </ReactMarkdown> }

      { isChartRender && (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 w-full mb-2 bg-white">
          { jsonRes.chartType === 'line' && <LineChart chartData={ {data} } basicInfo={ {
            title: `【${ precinctName }】-` + '折线图',
          } } chartType={ 'line' }/> }
          { jsonRes.chartType === 'bar' && <BarChart chartData={ {data} } basicInfo={ {
            title: `【${ precinctName }】-` + '柱状图',
          } } chartType={ 'bar' }/> }
          { jsonRes.chartType === 'pie' && <PieChart chartData={ {data} } basicInfo={ {
            title: `【${ precinctName }】-` + '饼图',
          } } chartType={ 'pie' }/> }
        </div>
      ) }
    </div>
  )
}
