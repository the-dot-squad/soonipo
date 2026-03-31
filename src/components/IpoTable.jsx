"use client";
import moment from "moment";
import { FileBarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function getStatusBadgeClass(status) {
  const s = (status || "").toString().toLowerCase().trim();
  if (["priced", "filed", "active"].includes(s)) {
    return "bg-green-100 text-green-700 border-transparent dark:bg-green-900/40 dark:text-green-300";
  }
  if (["withdrawn", "failed", "canceled", "cancelled"].includes(s)) {
    return "bg-amber-100 text-amber-700 border-transparent dark:bg-amber-900/40 dark:text-amber-300";
  }
  return "";
}

export default function IpoTable({ ipos, onSelectIpo }) {
  if (!ipos?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <FileBarChart2 size={56} className="mb-4" />
        <p className="text-lg font-medium">
          No upcoming IPOs on the calendar.
        </p>
        <p className="text-sm text-muted-foreground">Check back soon - new listings appear automatically.</p>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-border/70">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Exchange</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {ipos.map((ipo) => (
              <TableRow
                key={ipo._id ?? ipo.symbol}
                onClick={() => onSelectIpo(ipo)}
                className="group cursor-pointer transition-all duration-200 hover:scale-[1.002]"
              >
                <TableCell className="whitespace-nowrap font-semibold text-primary">
                  <span className="rounded-md bg-primary/10 px-2 py-1 transition-colors group-hover:bg-primary/15">
                    {ipo.symbol}
                  </span>
                </TableCell>
                <TableCell className="max-w-[240px] truncate">{ipo.companyName}</TableCell>
                <TableCell className="whitespace-nowrap">{ipo.exchange?.symbol ?? "N/A"}</TableCell>
                <TableCell className="whitespace-nowrap">{ipo.date ? moment(ipo.date).format("YYYY-MM-DD") : "N/A"}</TableCell>
                <TableCell className="hidden whitespace-nowrap sm:table-cell">{ipo.price ?? "-"}</TableCell>
                <TableCell className="hidden whitespace-nowrap sm:table-cell">
                  <Badge variant="secondary" className={getStatusBadgeClass(ipo.status)}>
                    {ipo.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
