import { LineChart, Line, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import * as React from "react";
import { Button } from "../ui/button";

const PerformanceOdc = () => {
    const yValues = [0, 200, 400, 600, 800];

    const data = [
        { name: "Jan", blue: 400, green: 100, yellow: 50 },
        { name: "Feb", blue: 450, green: 150, yellow: 100 },
        { name: "Mar", blue: 420, green: 130, yellow: 120 },
        { name: "Apr", blue: 410, green: 140, yellow: 200 },
        { name: "May", blue: 380, green: 120, yellow: 350 },
        { name: "Jun", blue: 500, green: 110, yellow: 50 },
        { name: "Jul", blue: 600, green: 250, yellow: 10 },
        { name: "Aug", blue: 550, green: 200, yellow: 30 },
        { name: "Sep", blue: 470, green: 180, yellow: 120 },
        { name: "Oct", blue: 520, green: 230, yellow: 200 },
        { name: "Nov", blue: 580, green: 260, yellow: 50 },
        { name: "Dec", blue: 560, green: 280, yellow: 0 }
      ];
    
    return (
<div className="bg-white p-4 rounded-[4px]   mb-6 w-[959px] h-[390px] border border-gray-200 ">
<div className="flex justify-between items-center mb-4">
  <h2 className="font-bold text-2xl">Performance ODC</h2>
  
  <div className="flex items-center gap-4">
    <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
      </svg>
      Filtres
    </Button>
    
    <div className="border px-3 py-1 rounded flex items-center">
      Année 2025
      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>



        <div className="flex">
          {/* Axe Y */}
          <div className="flex flex-col justify-between h-56 pr-2 text-right text-xs text-gray-500">
            {yValues.map((value, index) => (
              <span key={index}>{value}</span>
            ))}
          </div>

          {/* Graphique */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart 
                data={data} 
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid horizontal={true} vertical={false} stroke="#f0f0f0" />
                <Tooltip />
                <Line type="monotone" dataKey="blue" stroke="#007bff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="green" stroke="#28a745" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="yellow" stroke="#ffc107" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>

            {/* Axe X */}
            <div className="flex justify-between px-6 text-xs text-gray-500">
              {data.map((item, index) => (
                <span key={index}>{item.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default PerformanceOdc;
