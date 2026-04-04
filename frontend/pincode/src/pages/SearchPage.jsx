import ExplorePage from "./ExplorePage";

function SearchPage() {
  return (
    <div>
      <div className="tw-rounded-lg tw-bg-slate-800 tw-p-6 tw-mb-6">
        <h1 className="tw-mb-2 tw-text-3xl tw-font-bold tw-text-white">
          🔎 Search Pincodes
        </h1>
        <p className="tw-text-slate-400">
          Search and filter pincodes by location, state, or district
        </p>
      </div>
      <ExplorePage />
    </div>
  );
}

export default SearchPage;
