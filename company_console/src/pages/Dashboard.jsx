
const stats = [
  { label: "Registered Vehicles", value: "24" },
  { label: "Firmware Releases", value: "12" },
  { label: "Successful Updates", value: "18" },
  { label: "Failed Updates", value: "2" },
];

function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Monitor firmware releases and vehicle update activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-slate-200"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Activity
        </h2>

        <p className="text-sm text-slate-500 mt-4">
          No recent firmware activity available.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
