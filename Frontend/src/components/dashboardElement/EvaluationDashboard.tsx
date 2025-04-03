import * as react  from 'react';
import { Search, ChevronRight, ChevronLeft, Filter, Star, ChevronUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const EvaluationDashboard = () => {
    const navigate = useNavigate();

  // Sample data
  const evaluations = [
    { id: 1, title: 'AWS : Développement, déploiement et gestion', date: '15 Mars 2025', participants: '24/20', note: '5/5', satisfaction: '75%' },
    { id: 2, title: 'AWS : Développement, déploiement et gestion', date: '15 Mars 2025', participants: '24/20', note: '5/5', satisfaction: '75%' },
    { id: 3, title: 'AWS : Développement, déploiement et gestion', date: '15 Mars 2025', participants: '24/20', note: '5/5', satisfaction: '75%' },
    { id: 4, title: 'AWS : Développement, déploiement et gestion', date: '15 Mars 2025', participants: '24/20', note: '5/5', satisfaction: '75%' },
    { id: 5, title: 'AWS : Développement, déploiement et gestion', date: '15 Mars 2025', participants: '24/20', note: '5/5', satisfaction: '75%' },
    { id: 6, title: 'AWS : Développement, déploiement et gestion', date: '15 Mars 2025', participants: '24/20', note: '5/5', satisfaction: '75%' },
    { id: 7, title: 'AWS : Développement, déploiement et gestion', date: '15 Mars 2025', participants: '24/20', note: '5/5', satisfaction: '75%' },
  ];

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 w-[90%]    p-4">
      {/* Top section with button */}
      <div className="flex justify-between items-center w-full mb-4">
  <h2 className="text-2xl font-bold">Évaluations</h2>
  <button
        className="bg-orange-500 text-white px-4 py-2 rounded text-sm"
        onClick={() => navigate("/formateur/creatEvaluation")}
      >
        Créer une Évaluation
      </button>
</div>


      {/* Key metrics section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-yellow-100 p-2 rounded">
                <Star color="orange" size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Note Moyenne Globale</p>
              <p className="text-2xl font-bold">4.9/5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-orange-100 p-2 rounded">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M7 12h10" />
                  <path d="M12 7v10" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Évaluations</p>
              <p className="text-2xl font-bold">521</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-red-100 p-2 rounded">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux de Réponse</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-orange-100 p-2 rounded">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21v-2a7 7 0 0 0-14 0v2" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Formations Évaluées</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-4">Distribution des Notes</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            Graphique de progression
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-4">Évolution Mensuelle</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            Graphique de progression
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-medium mb-4">Listes des évaluations</h2>
        
        {/* Search and filter */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Recherche participants..."
              className="w-full pl-10 pr-4 py-2 border rounded"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
          
          <button className="border p-2 rounded">
            <Filter size={18} className="text-gray-600" />
          </button>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 text-left">Titre Formation</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Participants</th>
                <th className="py-2 px-3 text-left">Notes</th>
                <th className="py-2 px-3 text-left">Satisfaction</th>
                <th className="py-2 px-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map(evaluation => (
                <tr key={evaluation.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-3 flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-xs">AB</span>
                    </div>
                    <span className="text-sm">{evaluation.title}</span>
                  </td>
                  <td className="py-3 px-3 text-sm">{evaluation.date}</td>
                  <td className="py-3 px-3 text-sm">{evaluation.participants}</td>
                  <td className="py-3 px-3 text-sm">{evaluation.note}</td>
                  <td className="py-3 px-3 text-sm">{evaluation.satisfaction}</td>
                  <td className="py-3 px-3">
                    <button className="bg-black text-white px-4 py-1 rounded text-xs">
                      Analyser
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          <button className="w-8 h-8 border rounded flex items-center justify-center mr-2">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 border rounded bg-black text-white flex items-center justify-center mr-2">
            1
          </button>
          <button className="w-8 h-8 border rounded flex items-center justify-center mr-2">
            2
          </button>
          <button className="w-8 h-8 border rounded flex items-center justify-center mr-2">
            3
          </button>
          <button className="w-8 h-8 border rounded flex items-center justify-center">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Scroll to top button */}
      <div className="flex justify-center mt-4">
        <button className="w-8 h-8 border rounded flex items-center justify-center">
          <ChevronUp size={16} />
        </button>
      </div>
    </div>
  );
};

export default EvaluationDashboard;