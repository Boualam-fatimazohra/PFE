import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const KPIStats = () => {
  const [timePeriod, setTimePeriod] = useState("ce-mois-ci");

  return (
    <Card className="w-[554px] h-[425px] max-w-2xl p-6 rounded-[4px] overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl">KPI’s</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-sm font-medium border border-gray-300 px-3 py-1.5 rounded bg-black text-white">
              Exporter KPI’s
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M14.7152 11.5468V15.6868H3.67518V11.5468H1.37518V16.1468C1.37518 17.163 2.19898 17.9868 3.21518 17.9868H15.1752C16.1914 17.9868 17.0152 17.163 17.0152 16.1468V11.5468H14.7152ZM11.9552 9.24677V3.72677C11.9552 3.36077 11.8098 3.00976 11.551 2.75096C11.2922 2.49216 10.9412 2.34677 10.5752 2.34677H7.81518C7.05303 2.34677 6.43518 2.96462 6.43518 3.72677V9.24677H3.67518L6.43518 11.988L8.47497 14.0139C8.86809 14.4043 9.52228 14.4043 9.9154 14.0139L11.9552 11.988L14.7152 9.24677H11.9552Z" fill="white"/>
              </svg>
            </button>
            <div className="relative inline-flex items-center border border-gray-300 rounded px-2 py-1">
  <select
    className="appearance-none bg-gray-30 text-sm pr-6 outline-none"
    value={timePeriod}
    onChange={(e) => setTimePeriod(e.target.value)}
  >
    <option value="ce-mois-ci">Ce mois-ci</option>
    <option value="mois-dernier">Mois dernier</option>
  </select>
  <svg
    xmlns="http://www.w3.org/2000/svg"width="24"height="24"viewBox="0 0 24 24" fill="none" className="absolute right-2 pointer-events-none"><path fillRule="evenodd" clipRule="evenodd" d="M14.8306 6.33861C14.8303 5.8435 15.0633 5.37732 15.4594 5.08056V6.33861C15.4594 6.85963 15.882 7.28223 16.4031 7.28223C16.9244 7.28223 17.347 6.85963 17.347 6.33861L17.3467 6.02418H17.347V5.09305C17.7425 5.38464 17.9758 5.84715 17.9758 6.33861C17.9758 7.20728 17.2717 7.91111 16.4031 7.91111C15.535 7.91111 14.8306 7.20728 14.8306 6.33861ZM6.02415 6.33861C6.02385 5.8435 6.25693 5.37732 6.65303 5.08056V6.33861C6.65303 6.85963 7.07563 7.28223 7.59695 7.28223C8.11797 7.28223 8.54026 6.85963 8.54026 6.33861V6.02418H8.54057V5.08086C9.23525 5.60188 9.37602 6.58754 8.8547 7.28254C8.33338 7.97692 7.34741 8.11768 6.65303 7.59636C6.25693 7.29929 6.02415 6.83343 6.02415 6.33861ZM20.4919 20.4919H4.45164C3.93063 20.4919 3.50803 20.0693 3.50803 19.5483V9.79831H19.5483C20.0693 9.79831 20.4919 10.2206 20.4919 10.7419V20.4919ZM19.8631 4.13693H17.347V3.18082C17.347 2.6598 16.9244 2.25 16.403 2.25C15.882 2.25 15.4594 2.6723 15.4594 3.19331V4.13693H8.54058L8.54027 3.19331C8.54027 2.6723 8.11798 2.25 7.59696 2.25C7.07564 2.25 6.65304 2.6723 6.65304 3.19331V4.13693H2.25V19.8628C2.25 20.9051 3.09459 21.75 4.13693 21.75H21.75V6.02416C21.75 4.98183 20.9051 4.13693 19.8631 4.13693Z"fill="#999999"/></svg>
</div>

          </div>
        </div>

        {/* Conteneur du graphique */}
        <div className="flex flex-col items-center justify-center w-full h-[300px] overflow-hidden">
          {/* Donut Chart ajusté */}
          <div className="relative flex items-center justify-center w-64 h-64">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="10" strokeDasharray="62.8 251.2"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#22C55E" strokeWidth="10" strokeDasharray="62.8 251.2" strokeDashoffset="-62.8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#EAB308" strokeWidth="10" strokeDasharray="62.8 251.2" strokeDashoffset="-125.6"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="10" strokeDasharray="62.8 251.2" strokeDashoffset="-188.4"/>
            </svg>

            {/* Centre du graphique */}
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold">2,162</span>
              <span className="text-sm text-gray-500">Total Participants</span>
            </div>
          </div>

          {/* Légende améliorée */}
          <div className="flex justify-center gap-4 mt-4">
            {[
              { color: "bg-blue-500", label: "Data 1" },
              { color: "bg-green-500", label: "Data 2" },
              { color: "bg-yellow-500", label: "Data 3" },
              { color: "bg-red-500", label: "Data 4" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIStats;
