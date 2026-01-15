import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type WeeklySaleChartProps = {
  data: Array<{ day: string; amount: number }>;
};

const WeeklySaleChart = ({ data }: WeeklySaleChartProps) => {
  // Calculate max value and appropriate scale
  const maxAmount = Math.max(...data.map(item => item.amount), 0);
  const maxScaleValue = Math.ceil((maxAmount * 1.2) / 1000); // Add 20% padding, convert to thousands
  const stepSize = Math.ceil(maxScaleValue / 5); // Create ~5 ticks
  
  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        label: 'Sales',
        data: data.map(item => item.amount / 1000), // Convert to thousands for display
        borderColor: '#0f766e',
        backgroundColor: 'rgba(15, 118, 110, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#0f766e',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 11 },
        cornerRadius: 6,
        callbacks: {
          title: function (context: any) {
            return context[0].label;
          },
          label: function (context: any) {
            return `Sales: ${(context.parsed.y * 1000).toLocaleString()}₫`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxScaleValue > 0 ? maxScaleValue : 15000,
        ticks: {
          stepSize: stepSize > 0 ? stepSize : 3000,
          callback: function (value: any) {
            return `${(value * 1000).toLocaleString()}₫`;
          },
          font: { size: 10 },
          color: '#9ca3af',
          padding: 5,
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          font: { size: 10 },
          color: '#6b7280',
          padding: 5,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm w-full">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-neutral-900 mb-1">Sales Overview</h2>
        <p className="text-sm text-neutral-600">Weekly sales performance</p>
      </div>
      <div className="w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeeklySaleChart;