import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  const COLORS = ["#facc15", "#60a5fa", "#34d399"];
  
  export default function TicketsChart({ stats }) {
    const data = [
      { name: "Todo", value: stats.totalTickets - stats.inProgress - stats.completed },
      { name: "In Progress", value: stats.inProgress },
      { name: "Completed", value: stats.completed },
    ];
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">
          Ticket Distribution
        </h3>
  
        <div className="h-[250px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={90}
                label
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i]}
                  />
                ))}
              </Pie>
  
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  