import * as React from "react";

import { Eye, Download, Trash2, FileText, Search, Filter, Import, FileDown, Printer } from 'lucide-react';

interface Document {
  title: string;
  date: string;
}

interface StatItem {
  label: string;
  value: string;
}

interface Participant {
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  status: string;
}

function FormationTerminer() {
  const documents: Document[] = [
    { title: "Programme du formation", date: "25/02/2025" },
    { title: "Présentation Jour 01", date: "25/02/2025" },
    { title: "Exercices Pratiques", date: "25/02/2025" },
  ];

  const stats: StatItem[] = [
    { label: "Total Bénéficiaires", value: "250" },
    { label: "Total Formations", value: "64" },
    { label: "Prochain événement", value: "07" },
    { label: "Satisfaction moyenne", value: "95%" },
  ];

  const participants: Participant[] = [
    {
      date: "26/05/2024",
      time: "14h00-16h00",
      firstName: "Mohamed",
      lastName: "Bikarrane",
      email: "mohamed.bika@gmail.com",
      gender: "Homme",
      phone: "06445454512",
      status: "Présent (e)",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          <span className="mr-2">←</span> Retour
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Formation</h1>
            <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">Terminé</span>
          </div>
          <h2 className="text-lg text-gray-600">AWS : Développement, déploiement et gestion</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kit Formations */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Kit Formations</h2>
              <button className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2">
                <Import size={16} />
                Importer
              </button>
            </div>
            <div className="p-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <FileText className="text-gray-400" size={20} />
                    <span>{doc.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <span>{doc.date}</span>
                    <div className="flex items-center gap-2">
                      <button><Eye size={18} /></button>
                      <button><Download size={18} /></button>
                      <button><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rapport & Statistiques */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Rapport & Statistiques</h2>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-md">
                Générer Lien
              </button>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Taux de completion</p>
                <p className="text-3xl font-bold">85%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Taux Satisfaction</p>
                <p className="text-3xl font-bold">85%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Heures</p>
                <p className="text-3xl font-bold">75%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="mt-6 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Listes des participants</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Recherche participants..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border rounded-md flex items-center gap-2">
                  <Filter size={16} />
                  Filtres
                </button>
                <button className="px-4 py-2 border rounded-md flex items-center gap-2">
                  <Import size={16} />
                  Importer
                </button>
                <button className="px-4 py-2 border rounded-md flex items-center gap-2">
                  <FileDown size={16} />
                  Exporter
                </button>
                <button className="px-4 py-2 border rounded-md flex items-center gap-2">
                  <Printer size={16} />
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-8 p-4">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="p-4 text-left">Date & Heure</th>
                  <th className="p-4 text-left">Nom</th>
                  <th className="p-4 text-left">Prénom</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Genre</th>
                  <th className="p-4 text-left">Téléphone</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-4">
                      <div>{participant.date}</div>
                      <div className="text-sm text-gray-500">{participant.time}</div>
                    </td>
                    <td className="p-4">{participant.lastName}</td>
                    <td className="p-4">{participant.firstName}</td>
                    <td className="p-4">{participant.email}</td>
                    <td className="p-4">{participant.gender}</td>
                    <td className="p-4">{participant.phone}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {participant.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        Voir plus
                      </button>
                    </td>
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


export default FormationTerminer;
