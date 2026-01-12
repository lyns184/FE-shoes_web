import AdminHeader from '../../../../components/common/AdminHeader';
import TotalCard from '../../../../components/card/TotalCard';
import WeeklySaleChart from '../../../../components/chart/WeeklySaleChart';

const AdminDashboard = () => {
  const weeklyRevenueData = [
    { day: 'Mon', amount: 5200000 },
    { day: 'Tue', amount: 6800000 },
    { day: 'Wed', amount: 4500000 },
    { day: 'Thu', amount: 7200000 },
    { day: 'Fri', amount: 8900000 },
    { day: 'Sat', amount: 12500000 },
    { day: 'Sun', amount: 10300000 },
  ];

    const totalRevenue = 123456000;
    const totalOrders = 7890;   
    const totalCustomers = 4567; 

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Welcome back! Here is what's happening with your store" />
      <section className="px-9 py-11">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TotalCard title="Total Revenue" amount={totalRevenue} unit="₫" />
          <TotalCard title="Total Orders" amount={totalOrders} />
          <TotalCard title="Total Customers" amount={totalCustomers} />
        </div>
      </section>

      <section className="px-9 pb-11">
        <WeeklySaleChart data={weeklyRevenueData} />
      </section>
    </>
  );
};

export default AdminDashboard;