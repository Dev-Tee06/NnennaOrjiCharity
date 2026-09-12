'use client';

import { Search, Bell, ChevronDown, UploadCloud, CheckCircle2, AlertTriangle, Monitor, Smartphone } from 'lucide-react';
import { useState } from 'react';

import { TopHeader } from '@/components/dashboard/TopHeader';
import { MobilePageTitle } from '@/components/dashboard/MobilePageTitle';
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex-1 flex flex-col h-full bg-offWhite min-w-0 w-full">
      {/* Page Header */}
      <TopHeader title="System Settings" />
      <MobilePageTitle title="System Settings" />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        
        <div className="flex overflow-x-auto whitespace-nowrap border-b border-border mb-8 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('general')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general' ? 'border-orangeRed1 text-orangeRed1' : 'border-transparent text-gray-500 hover:text-blackKnight'}`}
          >
            General Operations
          </button>
          <button 
            onClick={() => setActiveTab('email')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'email' ? 'border-orangeRed1 text-orangeRed1' : 'border-transparent text-gray-500 hover:text-blackKnight'}`}
          >
            Email Command Templates
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'security' ? 'border-orangeRed1 text-orangeRed1' : 'border-transparent text-gray-500 hover:text-blackKnight'}`}
          >
            Security & Password Setup
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="bg-white border border-border rounded-xl shadow-sm p-8 max-w-3xl">
            <h3 className="text-lg font-heading font-bold text-blackKnight mb-6 pb-4 border-b border-border">Foundation General Information</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-blackKnight mb-2">Primary Foundation Contact Email</label>
                <input
                  type="email"
                  defaultValue="admin@nocf.org.ng"
                  className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blackKnight mb-2">Primary Support Phone Number</label>
                <input
                  type="text"
                  defaultValue="+234 810 000 0000"
                  className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                />
                <p className="text-xs text-text-secondary mt-2">This is the number donors will see and call when they want to inquire about logistics.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-blackKnight mb-2">Primary HQ / Foundation Address</label>
                <textarea
                  rows={3}
                  defaultValue="12, Adeniyi Jones Avenue, Ikeja, Lagos, Nigeria."
                  className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button type="button" className="bg-orangeRed1 hover:bg-orange-700 text-white px-6 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 space-y-3">
              <h3 className="text-sm font-bold text-blackKnight mb-4 pl-2">Automated System Prompts</h3>
              
              <div className="bg-white border-l-4 border-orangeRed1 rounded-r-lg shadow-sm p-4 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  <span className="text-sm font-bold text-blackKnight">Pledge Received</span>
                </div>
                <p className="text-xs text-text-secondary ml-3.5">Sends automated reply when donor pledges.</p>
              </div>
              
              <div className="bg-transparent border border-transparent hover:bg-white hover:border-gray-200 rounded-lg p-4 cursor-pointer transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                  <span className="text-sm font-bold text-gray-700">Pickup Scheduled</span>
                </div>
                <p className="text-xs text-gray-500 ml-3.5">Sends notification to logistics partner / driver.</p>
              </div>

              <div className="bg-transparent border border-transparent hover:bg-white hover:border-gray-200 rounded-lg p-4 cursor-pointer transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                  <span className="text-sm font-bold text-gray-700">Item Received</span>
                </div>
                <p className="text-xs text-gray-500 ml-3.5">Alerts donor upon items collection.</p>
              </div>

              <div className="bg-transparent border border-transparent hover:bg-white hover:border-gray-200 rounded-lg p-4 cursor-pointer transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                  <span className="text-sm font-bold text-gray-700">Pledge Cancelled</span>
                </div>
                <p className="text-xs text-gray-500 ml-3.5">Auto alert when a pledge is marked unfulfilled.</p>
              </div>
            </div>

            <div className="w-full lg:w-2/3 bg-white border border-border rounded-xl shadow-sm p-8">
              <h3 className="text-lg font-heading font-bold text-blackKnight mb-1">Edit automated Template: Pledge Received</h3>
              <p className="text-xs text-text-secondary mb-6 pb-4 border-b border-border">This goes out to the primary donor's email address upon form submission.</p>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">Subject / Headline Title</label>
                  <input
                    type="text"
                    defaultValue="NOCF: Pledge Received. Thank you for your contribution!"
                    className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">Message / Email Body Context (HTML Supported)</label>
                  <textarea
                    rows={8}
                    defaultValue="Dear {Donor_Name},&#10;&#10;Thank you for choosing to help out the Nnenna Orji Charity Foundation in this box. We have received your pledge...&#10;&#10;Best regards,&#10;The NOCF Project Team."
                    className="block w-full rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">Attachments</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <UploadCloud className="h-5 w-5 text-gray-500" />
                      </div>
                      <span className="text-sm font-bold text-orangeRed1">Upload Files</span>
                      <span className="text-xs text-gray-400 mt-1">Max file size limit is 5MB</span>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50/50">
                      <span className="text-2xl text-gray-300">+</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-blackKnight mb-2">Available Dynamic Short Codes</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs font-mono border border-gray-200">[Donor_Name]</span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs font-mono border border-gray-200">[Pledge_Quantity]</span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs font-mono border border-gray-200">[Pledge_Category]</span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs font-mono border border-gray-200">[Tracking_Number]</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <button type="button" className="text-sm font-bold text-text-secondary hover:text-blackKnight transition-colors underline">
                    Reset Template to Default
                  </button>
                  <button type="button" className="bg-orangeRed1 hover:bg-orange-700 text-white px-6 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm">
                    Save Email Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-border rounded-xl shadow-sm p-8">
              <h3 className="text-lg font-heading font-bold text-blackKnight mb-6 pb-4 border-b border-border">Update Admin's Password</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">Current active admin password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••••"
                    className="block w-full max-w-md rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">New password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••••"
                    className="block w-full max-w-md rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blackKnight mb-2">Confirm new password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••••"
                    className="block w-full max-w-md rounded-md border border-gray-300 py-2.5 px-3.5 text-sm focus:ring-orangeRed1 focus:border-orangeRed1 bg-gray-50/50"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 max-w-md">
                  <h4 className="text-xs font-semibold text-blackKnight mb-2">Password must contain:</h4>
                  <ul className="space-y-1.5">
                    <li className="flex items-center text-xs text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Minimum 8 characters
                    </li>
                    <li className="flex items-center text-xs text-gray-500">
                      <div className="h-3.5 w-3.5 border border-gray-300 rounded-full mr-2"></div> At least one uppercase letter
                    </li>
                    <li className="flex items-center text-xs text-gray-500">
                      <div className="h-3.5 w-3.5 border border-gray-300 rounded-full mr-2"></div> At least one special character (!@#$)
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button type="button" className="bg-orangeRed1 hover:bg-orange-700 text-white px-6 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm">
                    Update Security Settings
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-border rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-blackKnight">Two-Factor Authentication (2FA)</h3>
                  <div className="h-6 w-11 bg-orangeRed1 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 bg-white h-4 w-4 rounded-full"></div>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">Provide an extra layer of security for your admin account.</p>
              </div>

              <div className="bg-white border border-border rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-bold text-blackKnight mb-4 pb-4 border-b border-border">Active Administrative Sessions</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <Monitor className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-blackKnight flex items-center gap-2">
                        Mac OS (Google Chrome)
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Active Now</span>
                      </div>
                      <div className="text-xs text-text-secondary mt-1">IP: 102.165.234.12 • Lagos, NG</div>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start pt-4 border-t border-gray-100">
                    <Smartphone className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-blackKnight">
                        iPhone 13 Pro (Safari)
                      </div>
                      <div className="text-xs text-text-secondary mt-1">IP: 102.82.99.11 • Lagos, NG</div>
                      <div className="text-xs text-text-secondary mt-0.5">Last active: 2 hours ago</div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 text-red-600 bg-white border border-red-200 hover:bg-red-50 py-2.5 rounded-md text-xs font-bold transition-colors">
                  Revoke All Other Sessions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
