"use client";

import { useState } from "react";
import { leads } from "@/lib/data";
import { Award, Clock, Phone, MessageCircle, Mail, TrendingUp } from "lucide-react"; 
import { getScoreBadge, getScoreColor } from "@/lib/utils";

export default function Pending() {
  const [showContactOptions, setShowContactOptions] = useState<number | null>(null); // state dropdown contact

  const pendingLeads = leads.filter((l) => l.status === "pending");

  // Hitung jumlah untuk kartu
  const totalPending = pendingLeads.length;
  const highPriority = pendingLeads.filter((l) => l.score >= 0.75).length;
  const mediumPriority = pendingLeads.filter((l) => l.score >= 0.5 && l.score < 0.75).length;

  return (
    <div className="space-y-6">
      {/* Stat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Pending</p>
              <p className="text-3xl font-bold text-blue-600">{totalPending}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">High Priority</p>
              <p className="text-3xl font-bold text-green-600">{highPriority}</p>
            </div>
            <Award className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Medium Priority</p>
              <p className="text-3xl font-bold text-yellow-600">{mediumPriority}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Pending Calls List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Pending List</h3>
          <p className="text-sm text-gray-500 mt-1">Sorted by priority score</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.job}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(lead.score)}`}>
                      {(lead.score * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{lead.lastContact} days ago</p>
                    {lead.lastContact > 180 && (
                      <p className="text-xs text-red-600 font-semibold">Overdue!</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{lead.contact}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getScoreBadge(lead.score).color}`}></span>
                    <span className="text-sm text-gray-600">{getScoreBadge(lead.score).text}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowContactOptions(showContactOptions === lead.id ? null : lead.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Contact
                      </button>

                      {showContactOptions === lead.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Call Now</span>
                          </button>
                          <button className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center gap-3 border-b border-gray-100">
                            <MessageCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                          </button>
                          <button className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3">
                            <Mail className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Email</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
