import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

function formatCount(value) {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

function StatsCard({ label, value, accent }) {
  return (
    <div className={`tw-rounded-3xl tw-border tw-p-5 tw-shadow-lg ${accent}`}>
      <p className="tw-text-sm tw-font-medium tw-text-slate-200/90">{label}</p>
      <p className="tw-mt-3 tw-text-3xl tw-font-black tw-text-white">
        {formatCount(value)}
      </p>
    </div>
  );
}

function StateDistributionChart({ data }) {
  const maxValue = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="tw-space-y-4">
      {data.map((item) => (
        <div key={item.state} className="tw-space-y-2">
          <div className="tw-flex tw-items-center tw-justify-between tw-gap-4">
            <span className="tw-text-sm tw-font-medium tw-text-slate-200">
              {item.state}
            </span>
            <span className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.2em] tw-text-slate-400">
              {formatCount(item.count)}
            </span>
          </div>
          <div className="tw-h-3 tw-overflow-hidden tw-rounded-full tw-bg-white/10">
            <div
              className="tw-h-full tw-rounded-full tw-bg-gradient-to-r tw-from-amber-400 tw-via-orange-400 tw-to-rose-500"
              style={{ width: `${(item.count / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DeliveryDonutChart({ delivery, nonDelivery }) {
  const total = delivery + nonDelivery || 1;
  const deliveryRatio = delivery / total;
  const circumference = 2 * Math.PI * 54;
  const deliveryStroke = circumference * deliveryRatio;
  const nonDeliveryStroke = circumference - deliveryStroke;

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-gap-6 lg:tw-flex-row lg:tw-items-start">
      <div className="tw-relative tw-h-40 tw-w-40">
        <svg viewBox="0 0 140 140" className="tw-h-full tw-w-full tw--rotate-90">
          <circle
            cx="70"
            cy="70"
            r="54"
            fill="transparent"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="16"
          />
          <circle
            cx="70"
            cy="70"
            r="54"
            fill="transparent"
            stroke="#fbbf24"
            strokeWidth="16"
            strokeDasharray={`${deliveryStroke} ${circumference}`}
            strokeLinecap="round"
          />
          <circle
            cx="70"
            cy="70"
            r="54"
            fill="transparent"
            stroke="#38bdf8"
            strokeWidth="16"
            strokeDasharray={`${nonDeliveryStroke} ${circumference}`}
            strokeDashoffset={-deliveryStroke}
            strokeLinecap="round"
          />
        </svg>
        <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center">
          <span className="tw-text-xs tw-uppercase tw-tracking-[0.2em] tw-text-slate-400">
            Offices
          </span>
          <strong className="tw-text-2xl tw-font-black tw-text-white">
            {formatCount(delivery + nonDelivery)}
          </strong>
        </div>
      </div>

      <div className="tw-grid tw-w-full tw-gap-3">
        <div className="tw-rounded-2xl tw-border tw-border-amber-400/20 tw-bg-amber-400/10 tw-p-4">
          <p className="tw-text-xs tw-uppercase tw-tracking-[0.2em] tw-text-amber-200">
            Delivery
          </p>
          <p className="tw-mt-2 tw-text-2xl tw-font-black tw-text-white">
            {formatCount(delivery)}
          </p>
        </div>
        <div className="tw-rounded-2xl tw-border tw-border-sky-400/20 tw-bg-sky-400/10 tw-p-4">
          <p className="tw-text-xs tw-uppercase tw-tracking-[0.2em] tw-text-sky-200">
            Non Delivery
          </p>
          <p className="tw-mt-2 tw-text-2xl tw-font-black tw-text-white">
            {formatCount(nonDelivery)}
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [stateDistribution, setStateDistribution] = useState([]);
  const [deliveryDistribution, setDeliveryDistribution] = useState({
    delivery: 0,
    nonDelivery: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [statsResponse, stateResponse, deliveryResponse] = await Promise.all([
          api.get("/api/stats"),
          api.get("/api/stats/state-distribution"),
          api.get("/api/stats/delivery-distribution"),
        ]);

        if (!ignore) {
          setStats(statsResponse.data || null);
          setStateDistribution(stateResponse.data || []);
          setDeliveryDistribution(
            deliveryResponse.data || { delivery: 0, nonDelivery: 0 }
          );
        }
      } catch (requestError) {
        console.error("Dashboard error:", requestError);

        if (!ignore) {
          setError("Unable to load dashboard stats right now.");
        }
      }

      if (!ignore) {
        setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const topStates = useMemo(() => stateDistribution.slice(0, 8), [stateDistribution]);

  return (
    <div className="tw-space-y-8">
      <section className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-gradient-to-br tw-from-slate-900 tw-via-slate-950 tw-to-amber-950/50 tw-p-8 tw-shadow-2xl">
        <p className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.35em] tw-text-amber-300">
          Dashboard
        </p>
        <h2 className="tw-mt-3 tw-text-4xl tw-font-black tw-text-white">
          Postal Network Overview
        </h2>
        <p className="tw-mt-4 tw-max-w-3xl tw-text-base tw-leading-7 tw-text-slate-300">
          This route uses the new backend stats APIs and keeps the earlier home
          page untouched. The cards and charts below come directly from MongoDB
          Atlas through your Express server.
        </p>
      </section>

      {error && (
        <div className="tw-rounded-2xl tw-border tw-border-rose-400/20 tw-bg-rose-400/10 tw-p-4 tw-text-rose-100">
          {error}
        </div>
      )}

      <section className="tw-grid tw-gap-4 md:tw-grid-cols-2 xl:tw-grid-cols-4">
        <StatsCard
          label="Unique PIN Codes"
          value={stats?.totalPincodes}
          accent="tw-border-amber-400/15 tw-bg-amber-400/10"
        />
        <StatsCard
          label="States Covered"
          value={stats?.totalStates}
          accent="tw-border-sky-400/15 tw-bg-sky-400/10"
        />
        <StatsCard
          label="Delivery Offices"
          value={stats?.deliveryOffices}
          accent="tw-border-emerald-400/15 tw-bg-emerald-400/10"
        />
        <StatsCard
          label="Non Delivery Offices"
          value={stats?.nonDeliveryOffices}
          accent="tw-border-fuchsia-400/15 tw-bg-fuchsia-400/10"
        />
      </section>

      <section className="tw-grid tw-gap-6 lg:tw-grid-cols-[1.45fr_1fr]">
        <div className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-white/5 tw-p-6">
          <div className="tw-mb-6 tw-flex tw-items-center tw-justify-between tw-gap-4">
            <div>
              <p className="tw-text-xs tw-uppercase tw-tracking-[0.3em] tw-text-slate-400">
                State Distribution
              </p>
              <h3 className="tw-mt-2 tw-text-2xl tw-font-bold tw-text-white">
                Top states by unique pincode count
              </h3>
            </div>
            <span className="tw-rounded-full tw-border tw-border-white/10 tw-bg-white/5 tw-px-3 tw-py-1 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.2em] tw-text-slate-300">
              {loading ? "Loading" : `${topStates.length} states`}
            </span>
          </div>

          {topStates.length > 0 ? (
            <StateDistributionChart data={topStates} />
          ) : (
            <p className="tw-text-slate-400">
              {loading ? "Loading chart..." : "No distribution data available."}
            </p>
          )}
        </div>

        <div className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-white/5 tw-p-6">
          <p className="tw-text-xs tw-uppercase tw-tracking-[0.3em] tw-text-slate-400">
            Delivery Mix
          </p>
          <h3 className="tw-mt-2 tw-text-2xl tw-font-bold tw-text-white">
            Delivery status distribution
          </h3>
          <div className="tw-mt-8">
            <DeliveryDonutChart
              delivery={deliveryDistribution.delivery}
              nonDelivery={deliveryDistribution.nonDelivery}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
