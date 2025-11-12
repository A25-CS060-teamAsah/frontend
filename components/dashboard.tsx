"use client";

import { ArrowUpRight, ArrowDownRight, Users, Award, TrendingUp, Phone, CheckCircle, Target, BarChart3, Clock, ChevronRight } from "lucide-react";
import { leads, conversionData, scoreDistribution, targetData, totalLeadsMonthly, highPriorityMonthly, avgScoreMonthly } from "@/lib/data";
import { getScoreColor, getScoreBadge, formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [selectedLead, setSelectedLead] = useState(null);
  const router = useRouter(); // Tambahkan router untuk navigasi

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Total Leads</h3>
                <p className="text-sm text-gray-500 mt-1">Monthly growth</p>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <p className="text-3xl font-bold text-blue-600">{totalLeadsMonthly[totalLeadsMonthly.length - 1].count} Leads</p>
              <div className="flex items-center gap-1 mt-1">
              </div>
            </div>
            <div className="space-y-2">
              {totalLeadsMonthly.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-10">{data.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(data.count / 200) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">{data.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">High Priority</h3>
                <p className="text-sm text-gray-500 mt-1">Quality leads</p>
              </div>
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <p className="text-3xl font-bold text-green-600">{highPriorityMonthly[highPriorityMonthly.length - 1].count} Leads</p>
              <div className="flex items-center gap-1 mt-1">
              </div>
            </div>
            <div className="space-y-2">
              {highPriorityMonthly.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-10">{data.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(data.count / 60) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">{data.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Avg Score */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Avg Score</h3>
                <p className="text-sm text-gray-500 mt-1">Score quality trend</p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <p className="text-3xl font-bold text-purple-600">{(avgScoreMonthly[avgScoreMonthly.length - 1].score * 100).toFixed(0)}%</p>
              <div className="flex items-center gap-1 mt-1">
              </div>
            </div>
            <div className="space-y-2">
              {avgScoreMonthly.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-10">{data.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-purple-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${data.score * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">{(data.score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Hanya Pending Calls dan Monthly Conversions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <Clock className="w-10 h-10 mb-4 opacity-80" />
          <h4 className="text-2xl font-bold mb-2">24</h4>
          <p className="text-blue-100 mb-2">Pending Calls</p>
          <div className="flex items-center gap-1 mb-4">
          </div>
          <button 
            onClick={() => router.push('/pending')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <CheckCircle className="w-10 h-10 mb-4 opacity-80" />
          <h4 className="text-2xl font-bold mb-2">18</h4>
          <p className="text-green-100 mb-2">Monthly Conversions</p>
          <div className="flex items-center gap-1 mb-4">
          </div>
          <button 
            onClick={() => router.push('/targets')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>

      {/* Top Priority Leads Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h3 className="text-lg font-bold text-gray-800">Top Priority Leads</h3>
          <p className="text-sm text-gray-500 mt-1">Nasabah dengan probabilitas berlangganan tertinggi</p>
        </div>
        <div className="divide-y divide-gray-100">
          {leads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="px-6 py-5 hover:bg-blue-50/50 transition-all cursor-pointer group"
                 onClick={() => router.push('/leadList')}>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-base mb-0.5">{lead.name}</h4>
                    <p className="text-sm text-gray-500">{lead.job} • {lead.age} tahun • {lead.marital}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Skor Probabilitas</p>
                    <p className={`text-2xl font-bold ${getScoreColor(lead.score).split(' ')[0]}`}>
                      {(lead.score * 100).toFixed(0)}%
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
