function AboutPage() {
  const apiPoints = [
    "GET /api/states",
    "GET /api/states/:state/districts",
    "GET /api/states/:state/districts/:district/taluks",
    "GET /api/pincodes",
    "GET /api/search",
    "GET /api/pincode/:pincode",
    "GET /api/stats",
    "GET /api/stats/state-distribution",
    "GET /api/stats/delivery-distribution",
    "GET /api/export",
  ];

  return (
    <div className="tw-space-y-8">
      <section className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-gradient-to-br tw-from-slate-900 tw-via-slate-950 tw-to-emerald-950/50 tw-p-8 tw-shadow-2xl">
        <p className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.35em] tw-text-emerald-300">
          About
        </p>
        <h2 className="tw-mt-3 tw-text-4xl tw-font-black tw-text-white">
          Full stack postal explorer
        </h2>
        <p className="tw-mt-4 tw-max-w-3xl tw-text-base tw-leading-7 tw-text-slate-300">
          This application now has a preserved legacy home page plus dedicated
          React routes for dashboard, explore, pincode lookup, and about. The
          new routed pages use Tailwind-based components and the backend uses
          MongoDB Atlas through Express APIs.
        </p>
      </section>

      <section className="tw-grid tw-gap-6 lg:tw-grid-cols-2">
        <div className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-white/5 tw-p-6">
          <p className="tw-text-xs tw-uppercase tw-tracking-[0.3em] tw-text-slate-400">
            Stack
          </p>
          <h3 className="tw-mt-2 tw-text-2xl tw-font-bold tw-text-white">
            Technology used
          </h3>
          <ul className="tw-mt-6 tw-space-y-3 tw-text-sm tw-text-slate-300">
            <li className="tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-900/70 tw-p-4">
              React with route-based pages for dashboard, explore, pincode, and
              about.
            </li>
            <li className="tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-900/70 tw-p-4">
              Tailwind for the new routed page components, isolated from the old
              homepage styles.
            </li>
            <li className="tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-900/70 tw-p-4">
              Node and Express backend APIs connected to MongoDB Atlas postal
              data.
            </li>
          </ul>
        </div>

        <div className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-white/5 tw-p-6">
          <p className="tw-text-xs tw-uppercase tw-tracking-[0.3em] tw-text-slate-400">
            APIs
          </p>
          <h3 className="tw-mt-2 tw-text-2xl tw-font-bold tw-text-white">
            Available backend routes
          </h3>
          <div className="tw-mt-6 tw-flex tw-flex-wrap tw-gap-3">
            {apiPoints.map((item) => (
              <span
                key={item}
                className="tw-rounded-full tw-border tw-border-emerald-400/20 tw-bg-emerald-400/10 tw-px-4 tw-py-2 tw-text-xs tw-font-semibold tw-tracking-[0.1em] tw-text-emerald-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
