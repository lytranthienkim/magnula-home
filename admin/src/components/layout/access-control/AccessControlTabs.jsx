export default function AccessControlTabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${activeTab === tab.id
              ? 'border-black text-black'
              : 'border-transparent text-gray-600 hover:text-black'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
