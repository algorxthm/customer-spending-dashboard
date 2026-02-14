import { useMemo, useState } from "react";
import PageContainer from "../../components/PageContainer";
import TopBar from "../../components/TopBar";
import ProfileCard from "./ProfileCard";
import SummaryGrid from "./SummaryGrid";
import CategoryChartCard from "./CategoryChartCard";
import TrendChartCard from "./TrendChartCard";
import GoalsSection from "./GoalsSection";
import TransactionsSection from "./TransactionSection";

export default function DashboardPage() {
  const [customerId, setCustomerId] = useState("12345");
  const [period, setPeriod] = useState("30d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const [refreshKey, setRefreshKey] = useState(0);

  const dateParams = useMemo(() => {
    const p = {};
    if (startDate) p.startDate = startDate;
    if (endDate) p.endDate = endDate;
    return p;
  }, [startDate, endDate]);

  const onRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <PageContainer>
      <TopBar
        customerId={customerId}
        setCustomerId={(id) => {
          setCustomerId(id);
          setOffset(0);
          setCategory("");
        }}
        period={period}
        setPeriod={(p) => {
          setPeriod(p);
          setOffset(0);
        }}
        startDate={startDate}
        setStartDate={(v) => {
          setStartDate(v);
          setOffset(0);
        }}
        endDate={endDate}
        setEndDate={(v) => {
          setEndDate(v);
          setOffset(0);
        }}
        onRefresh={onRefresh}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ProfileCard customerId={customerId} refreshKey={refreshKey} />
        </div>
        <div className="lg:col-span-8">
          <SummaryGrid customerId={customerId} period={period} refreshKey={refreshKey} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <CategoryChartCard
            customerId={customerId}
            period={period}
            dateParams={dateParams}
            selectedCategory={category}
            onSelectCategory={(c) => {
              setCategory(c || "");
              setOffset(0);
            }}
            refreshKey={refreshKey}
          />
        </div>
        <div className="lg:col-span-6">
          <TrendChartCard customerId={customerId} refreshKey={refreshKey} />
        </div>
      </div>

      <div className="mt-4">
        <GoalsSection customerId={customerId} refreshKey={refreshKey} />
      </div>

      <div className="mt-4">
        <TransactionsSection
          customerId={customerId}
          period={period}
          dateParams={dateParams}
          category={category}
          setCategory={(c) => {
            setCategory(c);
            setOffset(0);
          }}
          sortBy={sortBy}
          setSortBy={setSortBy}
          limit={limit}
          setLimit={(v) => {
            setLimit(v);
            setOffset(0);
          }}
          offset={offset}
          setOffset={setOffset}
          refreshKey={refreshKey}
        />
      </div>
    </PageContainer>
  );
}
