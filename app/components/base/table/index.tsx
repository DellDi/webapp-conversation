
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

export const DataTable = () => {
  return (
    <Table>
      <TableHeader>
        {tableData.headers.map((header, index) => (
          <TableHead key={index}>{header}</TableHead>
        ))}
      </TableHeader>
      <TableBody>
        {tableData.rows.map((row, index) => (
          <TableRow key={index}>
            {row.map((cell, index) => (
              <TableCell key={index}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
