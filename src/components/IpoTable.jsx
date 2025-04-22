"use client";
import moment from "moment";
import { FileBarChart2 } from "lucide-react";

export default function IpoTable({ ipos, onSelectIpo }) {
  if (!ipos?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <FileBarChart2 size={56} className="mb-4" />
        <p className="text-lg font-medium">
          No upcoming IPOs on the calendar.
        </p>
        <p className="text-sm text-gray-400">
          Check back soon — new listings appear automatically.
        </p>
      </div>
    );
  }

  return (
    <table className="w-full bg-white shadow-md rounded-xl overflow-hidden">
      <thead className="bg-gray-100/60 text-base font-semibold text-gray-700">
        <tr>
          <th className="py-4 px-4">Symbol</th>
          <th className="py-4 px-4">Company</th>
          <th className="py-4 px-4">Exchange</th>
          <th className="py-4 px-4">Date</th>
          <th className="py-4 px-4 hidden sm:table-cell">Price</th>
          <th className="py-4 px-4 hidden sm:table-cell">Status</th>
        </tr>
      </thead>

      <tbody className="text-lg">
        {ipos.map((ipo) => (
          <tr
            key={ipo._id ?? ipo.symbol}
            onClick={() => onSelectIpo(ipo)}
            className="hover:bg-blue-50/60 cursor-pointer transition-colors"
          >
            <td className="py-4 px-4 font-bold text-blue-700">
              {ipo.symbol}
            </td>
            <td className="py-4 px-4">{ipo.companyName}</td>
            <td className="py-4 px-4">{ipo.exchange.symbol}</td>
            <td className="py-4 px-4">
              {ipo.date
                ? moment(ipo.date).format("YYYY-MM-DD")
                : "N/A"}
            </td>
            <td className="py-4 px-4 hidden sm:table-cell">
              {ipo.price ?? "—"}
            </td>
            <td className="py-4 px-4 hidden sm:table-cell">
              {ipo.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
