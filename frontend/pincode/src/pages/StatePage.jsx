import ExplorePage from "./ExplorePage";

function StatePage() {
  return (
    <div>
      <div className="tw-rounded-lg tw-bg-slate-800 tw-p-6 tw-mb-6">
        <h1 className="tw-mb-2 tw-text-3xl tw-font-bold tw-text-white">
          🏛️ Browse by State
        </h1>
        <p className="tw-text-slate-400">
          Browse and explore pincodes in each state of India
        </p>
      </div>
      <ExplorePage />
    </div>
  );
}

export default StatePage;
