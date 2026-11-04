'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShieldCheck,
  CreditCard,
  Bell,
  Lock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Smartphone
} from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  { id: 'notifications', label: 'Notification Prefs', icon: Bell },
];

const blockchainLogs = [
  { id: 'tx-89a7', action: 'Smart Contract Execution: Escrow Created', date: '2026-09-15 14:32:01', status: 'verified', hash: '0x3f...8a1c' },
  { id: 'tx-89a8', action: 'Identity Verification: KYC Level 2', date: '2026-09-12 09:15:22', status: 'verified', hash: '0x1b...9d4e' },
  { id: 'tx-89a9', action: 'Wallet Link: Ethereum Mainnet', date: '2026-09-10 18:45:59', status: 'verified', hash: '0x7c...2f5a' },
];

export default function SettingsHub() {
  const [activeTab, setActiveTab] = useState('security');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Account Settings
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your personal information, security protocols, and preferences.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Vertical Navigation */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full md:w-72 flex-shrink-0 space-y-2"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                      : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-rose-600 z-0"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <tab.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-semibold relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </motion.nav>

          {/* Content Area */}
          <div className="flex-1 min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Security Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Account Status</h3>
                      <p className="text-sm text-green-600 font-medium mt-1">Fully Secured</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4 text-rose-600">
                        <Activity className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Account Activity</h3>
                      <p className="text-sm text-gray-500 mt-1">Review recent account updates</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Last Password Change</h3>
                      <p className="text-sm text-gray-500 mt-1">45 days ago</p>
                    </div>
                  </div>

                  {/* 2FA Section */}
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-6">
                      <div className="flex gap-4 items-start">
                        <div className={`p-3 rounded-2xl ${is2FAEnabled ? 'bg-rose-50' : 'bg-gray-100'}`}>
                          <Smartphone className={`w-8 h-8 ${is2FAEnabled ? 'text-rose-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication (2FA)</h3>
                          <p className="text-gray-500 mt-1 max-w-md text-sm">
                            Add an extra layer of security to your account. We recommend leaving this enabled to protect against unauthorized access.
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                        className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 ${
                          is2FAEnabled ? 'bg-rose-600' : 'bg-gray-200'
                        }`}
                      >
                        <motion.span
                          layout
                          className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                            is2FAEnabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Blockchain Logs */}
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">Blockchain Verification Logs</h3>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live Network
                      </span>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {blockchainLogs.map((log) => (
                        <div key={log.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900">{log.action}</span>
                            <span className="text-xs text-gray-500">{log.date}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="font-medium capitalize">{log.status}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded-md text-xs">
                              <span className="text-gray-400">TxHash:</span>
                              {log.hash}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
                      <button className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors">
                        View All Activity
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab !== 'security' && (
                <motion.div
                  key="other"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
                >
                  <AlertTriangle className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Under Construction</h3>
                  <p className="text-gray-500 max-w-sm">
                    The {tabs.find(t => t.id === activeTab)?.label} section is currently being updated to our new futuristic design system.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
