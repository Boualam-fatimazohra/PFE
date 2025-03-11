import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import { PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Legend, Line } from "recharts";
const absenceData = [
    { name: 'Jan', rate: 5, count: 3 },
    { name: 'Feb', rate: 7, count: 5 },
    { name: 'Mar', rate: 8, count: 7 },
    { name: 'Apr', rate: 3, count: 2 },
    { name: 'May', rate: 4, count: 3 },
    { name: 'Jun', rate: 6, count: 5 },
  ];
const AbsenceManager = () => {
  const [timePeriod, setTimePeriod] = useState("semestre");

 
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <TabsContent value="absences" className="border-none p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Taux de Déperdition des Formations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Vue d'ensemble</h3>
                      <p className="text-gray-500">Taux moyen d'absence: 5.5%</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={absenceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="rate" name="Taux d'absence (%)" stroke="#FF8042" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Détail des Absences par Formation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Nombre d'absences</h3>
                      <p className="text-gray-500">Total absences: 25</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={absenceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Nombre d'absences" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-[#999999] rounded-none mt-6">
                <CardHeader>
                  <CardTitle>Analyse des Absences par Formation</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absences</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">JavaScript Avancé</td>
                        <td className="px-6 py-4 whitespace-nowrap">15/01/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap">15</td>
                        <td className="px-6 py-4 whitespace-nowrap">1</td>
                        <td className="px-6 py-4 whitespace-nowrap">6.7%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Normal
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">React Fundamentals</td>
                        <td className="px-6 py-4 whitespace-nowrap">22/03/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap">12</td>
                        <td className="px-6 py-4 whitespace-nowrap">2</td>
                        <td className="px-6 py-4 whitespace-nowrap">16.7%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            À surveiller
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">UX Design</td>
                        <td className="px-6 py-4 whitespace-nowrap">05/02/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap">8</td>
                        <td className="px-6 py-4 whitespace-nowrap">0</td>                         
                        <td className="px-6 py-4 whitespace-nowrap">3</td>
                        <td className="px-6 py-4 whitespace-nowrap">30%</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                              Critique
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>
  );
};

export default AbsenceManager ;
