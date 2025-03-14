import React from 'react'

// 创建一个集成的表格组件系统
const TableComponents = {
  // 表格主体组件
  table: ({ children, ...props }: any) => {
    return (
      <div className="overflow-x-auto bg-white mb-4 rounded-md dark:bg-black">
        <table
          {...props}
          className="min-w-full text-left text-sm font-light text-surface dark:text-white"
        >
          {children}
        </table>
      </div>
    )
  },
  
  // 表头组件
  thead: ({ children, ...props }: any) => {
    return (
      <thead
        {...props}
        className="border-b border-neutral-200 bg-neutral-50 font-medium dark:border-white/10 dark:text-neutral-800"
      >
        {children}
      </thead>
    )
  },
  
  // 表格行组件
  tr: ({ children, ...props }: any) => {
    return (
      <tr
        {...props}
        className="border-b border-neutral-200 dark:border-white/10"
      >
        {children}
      </tr>
    )
  },
  
  // 表头单元格组件
  th: ({ children, ...props }: any) => {
    return (
      <th {...props} className="px-2 py-2">
        {children}
      </th>
    )
  },
  
  // 表格单元格组件
  td: ({ children, ...props }: any) => {
    return (
      <td {...props} className="px-2 py-2 whitespace-nowrap">
        {children}
      </td>
    )
  }
}

export default TableComponents