'use client';

import { useState } from 'react';
import UsersPage from '../users/page';
import RolesPage from '../roles/page';
import PermissionsPage from '../permissions/page';

export default function AccessControlPage() {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Users' },
    { id: 'roles', label: 'Roles' },
    { id: 'permissions', label: 'Permissions' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h3 className="font-bold text-black uppercase">Access Control</h3>
        <p className="body-02 text-black">Manage users, roles, and permissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-semibold uppercase border-b-2 transition ${
              activeTab === tab.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'users' && <UsersPage />}
        {activeTab === 'roles' && <RolesPage />}
        {activeTab === 'permissions' && <PermissionsPage />}
      </div>
    </div>
  );
}
