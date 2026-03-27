export default function LogsUploadHistory() {
    return(
        <div className="space-y-6">
            <h2 className="text-2xl text-white font-bold mb-2">Upload History</h2>
            <p className="text-gray-400 mb-4">Review your previous log uploads</p>
            <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
                <table className="w-full text-left">
                    <thead >
                        <tr>
                            <th className="text-gray-400 uppercase text-sm font-bold mb-2">File Name</th>
                            <th className="text-gray-400 uppercase text-sm font-bold mb-2 hidden lg:table-cell">Upload Date</th>
                            <th className="text-gray-400 uppercase text-sm font-bold mb-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t border-[#334155]">
                            <td className="py-2 text-white">server_logs_2024_06_01.log</td>
                            <td className="py-2 text-gray-400 hidden lg:table-cell">June 1, 2024, 10:15 AM</td>
                            <td className="py-2">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-[#10B981]/20 text-[#10B981]">Processed</span>
                            </td>
                        </tr>
                        <tr className="border-t border-[#334155]">
                            <td className="py-2 text-white">app_logs_2024_05_30.txt</td>
                            <td className="py-2 text-gray-400 hidden lg:table-cell">May 30, 2024, 3:45 PM</td>
                            <td className="py-2">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-[#F59E0B]/20 text-[#F59E0B]">Processing</span>
                            </td>
                        </tr>
                        <tr className="border-t border-[#334155]">
                            <td className="py-2 text-white">network_logs_2024_05_28.csv</td>
                            <td className="py-2 text-gray-400 hidden lg:table-cell">May 28, 2024, 11:20 AM</td>
                            <td className="py-2">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-[#EF4444]/20 text-[#EF4444]">Failed</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        )
}