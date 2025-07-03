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
import { BarChart, LineChart, PieChart, CardChart } from "../chart";
import { Component, memo, useMemo, useState, useCallback } from "react";
import { useTheme } from "ahooks";
import { Theme } from "@/types/app";
import Flowchart from "@/app/components/base/mermaid";
import SVGBtn from "@/app/components/base/svg";
import ActionButton from "@/app/components/base/action-button";
import Button from "@/app/components/base/button";
import CopyIcon from "@/app/components/base/copy-icon";
import ThinkBlock from "@/app/components/base/markdown-blocks/think-block";
import TableComponents from "@/app/components/base/markdown-blocks/table";

// followQuestions handled above
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
        } catch (error) { }
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
              <ReactEcharts option={chartData} style={{ minWidth: "375px" }} />
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

export function Markdown({ content, onFollowQuestion }: { content: string; onFollowQuestion?: (q: string) => void }) {
  const latexContent = flow([preprocessThinkTag])(content);

  /* -------------------------- stable renderer -------------------------- */
  const codeRenderer = useCallback(({ inline, children, ...props }: any) => {
    const languageMatch = /language-(\w+)/.exec(props.className || '');

    if (!inline && languageMatch?.[1] === 'json') {
      let parsed: any;
      try {
        parsed = JSON.parse(String(children).replace(/\n$/, ''));
        parsed = parsed.result ?? parsed;
      } catch {
        // fallthrough
      }
      const param = parsed?.bizInfo?.param;
      let ChartComponent: JSX.Element | null = null;
      if (param?.chartData && param?.chartType) {
        const Comp = {
          line: LineChart,
          bar: BarChart,
          pie: PieChart,
          card: CardChart,
        }[param.chartType as IChartType];
        ChartComponent = Comp ? (
          <Comp
            chartData={{ data: param.chartData }}
            basicInfo={{ title: '' }}
            chartType={param.chartType as IChartType}
          />
        ) : null;
      }
      const fq = parsed?.followQuestions;
      const FollowQuestionsComponent = fq?.list?.length ? (
        <div className="mt-3">
          {fq.title && <div className="text-sm text-gray-900 mb-1">{fq.title}</div>}
          <div className="flex gap-1 flex-wrap">
            {fq.list.map((q: string, idx: number) => (
              <Button key={idx} className="text-sm" type="link" onClick={() => onFollowQuestion?.(q)}>
                {q}
              </Button>
            ))}
          </div>
        </div>
      ) : null;

      if (ChartComponent || FollowQuestionsComponent) {
        return (
          <div>
            {ChartComponent}
            {FollowQuestionsComponent}
          </div>
        );
      }
    }

    if (!inline && languageMatch) {
      return (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, '')}
          style={atelierHeathLight}
          language={languageMatch[1]}
          showLineNumbers
          PreTag="div"
        />
      );
    }
    return <code {...props} className={props.className}>{children}</code>;
  }, [onFollowQuestion]);

  const remarkPluginsMemo = useMemo(() => [RemarkGfm, [RemarkMath, { singleDollarTextMath: false }], RemarkBreaks] as const, []);

  const rehypePluginsMemo = useMemo(() => [
    RehypeKatex,
    RehypeRaw as any,
    () => (tree: any) => {
      const iterate = (node: any) => {
        if (node.type === 'element' && node.properties?.ref) delete node.properties.ref;
        if (node.type === 'element' && !/^[a-z][a-z0-9]*$/i.test(node.tagName)) {
          node.type = 'text';
          node.value = `<${node.tagName}`;
        }
        if (node.children) node.children.forEach(iterate);
      };
      tree.children.forEach(iterate);
    },
  ] as const, []);

  const componentsMemo = useMemo(() => ({
    table: TableComponents.table,
    thead: TableComponents.thead,
    tr: TableComponents.tr,
    th: TableComponents.th,
    td: TableComponents.td,
    code: codeRenderer,
    details: ThinkBlock,
  }), [codeRenderer]);

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={remarkPluginsMemo as any}
        rehypePlugins={rehypePluginsMemo as any}
        components={componentsMemo as any}
      >
        {latexContent}
      </ReactMarkdown>
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
