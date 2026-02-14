import Card from "../../components/Card";
import FiltersBar from "./FiltersBar";
import TransactionsTable from "./TransactionsTable";
import Pagination from "./Pagination";

export default function TransactionsSection({
  category,
  setCategory,
  sortBy,
  setSortBy,
  limit,
  setLimit,
  offset,
  setOffset,
}) {
  const total = 1250; // mock
  const hasMore = offset + limit < total;

  return (
    <Card title="Transactions">
      <FiltersBar
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        limit={limit}
        setLimit={setLimit}
        onReset={() => {
          setCategory("");
          setSortBy("date_desc");
          setLimit(20);
          setOffset(0);
        }}
      />

      <div className="mt-3">
        <TransactionsTable rows={[]} loading={false} />
      </div>

      <div className="mt-3">
        <Pagination
          total={total}
          limit={limit}
          offset={offset}
          onPrev={() => setOffset(Math.max(0, offset - limit))}
          onNext={() => setOffset(offset + limit)}
          hasMore={hasMore}
        />
      </div>
    </Card>
  );
}
