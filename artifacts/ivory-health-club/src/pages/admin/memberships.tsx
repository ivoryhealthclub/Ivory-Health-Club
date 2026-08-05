import { useGetMembershipBreakdown } from "@workspace/api-client-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function AdminMemberships() {
  const { data: breakdown, isLoading } = useGetMembershipBreakdown();

  const COLORS = ['#29166F', '#4A329A', '#F8C301', '#FFD54A', '#140A3A', '#8b5cf6', '#d946ef'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-secondary">Membership Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-6">Plan Distribution</h2>
          
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">Loading chart...</div>
          ) : !breakdown || breakdown.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">No data available</div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="planName"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} members`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-6">Data Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Plan Name</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3 text-right">Member Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
                ) : breakdown?.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.planName}</td>
                    <td className="px-4 py-3 text-gray-500 uppercase text-xs">{item.tier.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-right font-bold text-secondary">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
