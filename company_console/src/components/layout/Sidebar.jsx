export const NAV_ITEMS = ['Dashboard', 'Firmware', 'Release', 'Vehicles', 'Update History'];


function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col bg-gray-900 text-gray-300">
      <div className="border-b border-gray-800 px-5 py-4 text-lg font-semibold text-white">
        OTA Console
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            className={`block w-full rounded px-3 py-2 text-left text-sm ${
              activePage === item
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;