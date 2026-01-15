import AdminHeader from '../../../../components/common/AdminHeader';
import TotalCard from '../../../../components/card/TotalCard';
import WeeklySaleChart from '../../../../components/chart/WeeklySaleChart';
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboardStats, getWeeklyRevenue } from '../../../../services/order';

const AdminDashboard = () => {
  const { data: statsData } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboardStats,
  });

  const { data: weeklyRevenueResponse } = useQuery({
    queryKey: ['weekly-revenue'],
    queryFn: getWeeklyRevenue,
  });

  const weeklyRevenueData = weeklyRevenueResponse?.data ?? [];

  const totalRevenue = statsData?.data?.totalSpent ?? 0;
  const totalOrders = statsData?.data?.totalOrders ?? 0;
  const totalCustomers = statsData?.data?.totalUsers ?? 0;

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Welcome back! Here is what's happening with your store" />
      <section className="px-9 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TotalCard title="Total Revenue" amount={totalRevenue} unit="₫" />
          <TotalCard title="Total Orders" amount={totalOrders} />
          <TotalCard title="Total Customers" amount={totalCustomers} />
        </div>
      </section>

      <section className="px-9 pb-8">
        <WeeklySaleChart data={weeklyRevenueData} />
      </section>
    </>
  );
};

export default AdminDashboard;