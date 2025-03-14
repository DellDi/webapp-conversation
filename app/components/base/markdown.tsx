import ReactMarkdown from "react-markdown";
import ReactEcharts from "echarts-for-react";
import { flow } from "lodash-es";
import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeRaw from "rehype-raw";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atelierHeathDark,
  atelierHeathLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import type { IChartType } from "../chart";
import { BarChart, LineChart, PieChart } from "../chart";
import { Component, memo, useMemo, useState } from "react";
import { useTheme } from "ahooks";
import { Theme } from "@/types/app";
import Flowchart from "@/app/components/base/mermaid";
import SVGBtn from "@/app/components/base/svg";
import ActionButton from "@/app/components/base/action-button";
import CopyIcon from "@/app/components/base/copy-icon";
import ThinkBlock from "@/app/components/base/markdown-blocks/think-block";
import TableComponents from "@/app/components/base/markdown-blocks/table";

// Available language https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_HLJS.MD
const capitalizationLanguageNameMap: Record<string, string> = {
  sql: "SQL",
  javascript: "JavaScript",
  java: "Java",
  typescript: "TypeScript",
  vbscript: "VBScript",
  css: "CSS",
  html: "HTML",
  xml: "XML",
  php: "PHP",
  python: "Python",
  yaml: "Yaml",
  mermaid: "Mermaid",
  markdown: "MarkDown",
  makefile: "MakeFile",
  echarts: "ECharts",
  shell: "Shell",
  powershell: "PowerShell",
  json: "JSON",
  latex: "Latex",
  svg: "SVG",
};

const preprocessThinkTag = (content: string) => {
  return flow([
    (str: string) => str.replace("<think>\n", "<details data-think=true>\n"),
    (str: string) => str.replace("\n</think>", "\n[ENDTHINKFLAG]</details>"),
  ])(content);
};

const getCorrectCapitalizationLanguageName = (language: string) => {
  if (!language) return "Plain";

  if (language in capitalizationLanguageNameMap)
    return capitalizationLanguageNameMap[language];

  return language.charAt(0).toUpperCase() + language.substring(1);
};

const CodeBlock: any = memo(
  ({ inline, className, children, ...props }: any) => {
    const { theme } = useTheme();
    const [isSVG, setIsSVG] = useState(true);
    const match = /language-(\w+)/.exec(className || "");
    const language = match?.[1];
    const languageShowName = getCorrectCapitalizationLanguageName(
      language || ""
    );
    const chartData = useMemo(() => {
      if (language === "echarts") {
        try {
          return JSON.parse(String(children).replace(/\n$/, ""));
        } catch (error) {}
      }
      return JSON.parse(
        '{"title":{"text":"ECharts error - Wrong JSON format."}}'
      );
    }, [language, children]);

    const renderCodeContent = useMemo(() => {
      const content = String(children).replace(/\n$/, "");
      if (language === "mermaid" && isSVG) {
        return <Flowchart PrimitiveCode={content} />;
      } else if (language === "echarts") {
        return (
          <div
            style={{
              minHeight: "350px",
              minWidth: "100%",
              overflowX: "scroll",
            }}
          >
            <ErrorBoundary>
              <ReactEcharts option={chartData} style={{ minWidth: "700px" }} />
            </ErrorBoundary>
          </div>
        );
      } else {
        return (
          <SyntaxHighlighter
            {...props}
            style={theme === Theme.light ? atelierHeathLight : atelierHeathDark}
            customStyle={{
              paddingLeft: 12,
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              backgroundColor: "var(--color-components-input-bg-normal)",
            }}
            language={match?.[1]}
            showLineNumbers
            PreTag="div"
          >
            {content}
          </SyntaxHighlighter>
        );
      }
    }, [language, match, props, children, chartData, isSVG]);

    if (inline || !match)
      return (
        <code {...props} className={className}>
          {children}
        </code>
      );

    return (
      <div className="relative">
        <div className="bg-components-input-bg-normal rounded-t-[10px] flex justify-between h-8 items-center p-1 pl-3 border-b border-divider-subtle">
          <div className="system-xs-semibold-uppercase text-text-secondary">
            {languageShowName}
          </div>
          <div className="flex items-center gap-1">
            {["mermaid", "svg"].includes(language!) && (
              <SVGBtn isSVG={isSVG} setIsSVG={setIsSVG} />
            )}
            <ActionButton>
              <CopyIcon content={String(children).replace(/\n$/, "")} />
            </ActionButton>
          </div>
        </div>
        {renderCodeContent}
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

export function Markdown({ content }: { content: string }) {
  let latexContent = flow([preprocessThinkTag])(content);
  
  let isChartRender;
  let jsonRes = {
    chartType: "line",
    targetName: "",
    precinctName: "",
    data: [
      {
        name: "新安明珠",
        value: 1000.22,
        currentDate: "2024",
      },
    ],
  };
  let chartStr, mkStr;
  const contentArr = latexContent.split("---图表信息如下---");
  if (contentArr.length > 1) {
    mkStr = contentArr[0];
    chartStr = contentArr[1];
  } else {
    chartStr = contentArr[0];
  }
  try {
    jsonRes = JSON.parse(chartStr);
    isChartRender = true;
  } catch (error) {
    isChartRender = false;
    mkStr = latexContent;
  }
  const data = jsonRes.data;
  const precinctName = jsonRes.precinctName;
  return (
    <div className="markdown-body">
      {mkStr && (
        <ReactMarkdown
          remarkPlugins={[
            RemarkGfm,
            [RemarkMath, { singleDollarTextMath: false }],
            RemarkBreaks,
          ]}
          rehypePlugins={[
            RehypeKatex,
            RehypeRaw as any,
            // The Rehype plug-in is used to remove the ref attribute of an element
            () => {
              return (tree) => {
                const iterate = (node: any) => {
                  if (node.type === "element" && node.properties?.ref)
                    delete node.properties.ref;

                  if (
                    node.type === "element" &&
                    !/^[a-z][a-z0-9]*$/i.test(node.tagName)
                  ) {
                    node.type = "text";
                    node.value = `<${node.tagName}`;
                  }

                  if (node.children) node.children.forEach(iterate);
                };
                tree.children.forEach(iterate);
              };
            },
          ]}
          components={{
            table: TableComponents.table,
            thead: TableComponents.thead,
            tr: TableComponents.tr,
            th: TableComponents.th,
            td: TableComponents.td,
            code({ children, ...props }) {
              const match = /language-(\w+)/.exec(props.className || "");
              return !props.inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, "")}
                  style={atelierHeathLight}
                  language={match[1]}
                  showLineNumbers
                  PreTag="div"
                />
              ) : (
                <code {...props} className={props.className}>
                  {children}
                </code>
              );
            },
            details: ThinkBlock,
          }}
        >
          {mkStr}
        </ReactMarkdown>
      )}

      {isChartRender && (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 w-full mb-2 bg-white">
          {(() => {
            const ChartComponent = {
              line: LineChart,
              bar: BarChart,
              pie: PieChart,
            }[jsonRes.chartType];

            return ChartComponent ? (
              <ChartComponent
                chartData={{ data }}
                basicInfo={{ title: `【${precinctName}】` }}
                chartType={jsonRes.chartType as IChartType}
              />
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}

export default class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ hasError: true });
    console.error(error, errorInfo);
  }

  render() {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    if (this.state.hasError)
      return (
        <div>
          Oops! An error occurred. This could be due to an ECharts runtime error
          or invalid SVG content. <br />
          (see the browser console for more information)
        </div>
      );
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    return this.props.children;
  }
}
