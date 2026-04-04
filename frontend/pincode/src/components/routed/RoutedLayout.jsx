import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/explore", label: "Explore", icon: "🔍" },
  { to: "/pincode", label: "Pincode", icon: "📍" },
  { to: "/about", label: "About", icon: "ℹ️" },
];

function RoutedLayout() {
  return (
    <div className="tw-min-h-screen tw-bg-slate-950 tw-text-slate-100">
      <header className="tw-sticky tw-top-0 tw-z-50 tw-border-b tw-border-white/10 tw-bg-gradient-to-r tw-from-blue-600 tw-via-purple-600 tw-to-pink-600 tw-shadow-lg">
        <div className="tw-mx-auto tw-max-w-7xl tw-px-4 sm:tw-px-6 lg:tw-px-8">
          {/* Header Top - Logo & Title */}
          <div className="tw-flex tw-items-center tw-justify-between tw-py-4">
            <NavLink
              to="/"
              className="tw-flex tw-items-center tw-gap-3 tw-no-underline hover:tw-opacity-90 tw-transition"
            >
              <div className="tw-inline-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-lg tw-bg-white tw-text-lg tw-font-black tw-text-purple-600">
                🚀
              </div>
              <span className="tw-text-xl tw-font-black tw-text-white">
                PincodeHub
              </span>
            </NavLink>

            {/* Navigation Bar */}
            <nav className="tw-flex tw-items-center tw-gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `tw-inline-flex tw-items-center tw-gap-2 tw-rounded-lg tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-transition-all tw-duration-200 ${
                      isActive
                        ? "tw-bg-white tw-text-purple-600 tw-shadow-md"
                        : "tw-bg-white/10 tw-text-white hover:tw-bg-white/20"
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span className="tw-hidden sm:tw-inline">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="tw-mx-auto tw-max-w-7xl tw-px-4 tw-py-8 sm:tw-px-6 lg:tw-px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default RoutedLayout;
