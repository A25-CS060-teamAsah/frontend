"use client";

import { useState } from "react";
import { Search, Phone, Mail, Users } from "lucide-react";
import { leads } from "@/lib/data";
import { getScoreColor, getScoreBadge } from "@/lib/utils";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function Leads() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");

  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.job.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "high" && lead.score >= 0.75) ||
        (scoreFilter === "medium" && lead.score >= 0.5 && lead.score < 0.75) ||
        (scoreFilter === "low" && lead.score < 0.5);
      return matchesSearch && matchesScore;
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setScoreFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                scoreFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setScoreFilter('high')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                scoreFilter === 'high' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setScoreFilter('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                scoreFilter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setScoreFilter('low')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                scoreFilter === 'low' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low
            </button>
          </div>
        </div>
      </div>

      {/* lead list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Customer List ({filteredLeads.length})</h3>
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`bg-white rounded-xl shadow-sm p-4 border-2 transition-all cursor-pointer hover:shadow-md ${
                selectedLead?.id === lead.id ? 'border-blue-500' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{lead.name}</h4>
                    <p className="text-sm text-gray-500">{lead.age} years • {lead.job}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(lead.score)}`}>
                    {(lead.score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getScoreBadge(lead.score).color}`}></span>
                <span className="text-xs text-gray-600">{getScoreBadge(lead.score).text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* detail */}
        <div className="lg:sticky lg:top-6">
          {selectedLead ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedLead.name}</h3>
                    <p className="text-blue-100">{selectedLead.job}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getScoreBadge(selectedLead.score).color} text-white`}>
                    {getScoreBadge(selectedLead.score).text}
                  </span>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
                    Score: {(selectedLead.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">PERSONAL INFORMATION</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Age</span>
                      <span className="font-semibold text-gray-800">{selectedLead.age} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Education</span>
                      <span className="font-semibold text-gray-800">{selectedLead.education}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Marital Status</span>
                      <span className="font-semibold text-gray-800">{selectedLead.marital}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">FINANCIAL PROFILE</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Account Balance</span>
                      <span className="font-semibold text-green-600">{formatCurrency(selectedLead.balance)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Loan</span>
                      <span className={`font-semibold ${selectedLead.loan === 'No' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedLead.loan}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">CONTACT INFORMATION</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Contact Type</span>
                      <span className="font-semibold text-gray-800">{selectedLead.contact}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Contact</span>
                      <span className="font-semibold text-gray-800">{selectedLead.lastContact} days ago</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Customer
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Lead Selected</h3>
              <p className="text-gray-500">Select a customer from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
