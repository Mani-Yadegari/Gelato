import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Css/Dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    dailyOrders: [],
    dailyRevenue: [],
    dailyLabels: [],
    monthlyOrders: [],
    monthlyRevenue: [],
    monthlyLabels: [],
  });
  const [usersCount, setUsersCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const res = await axios.get("https://gelatocafe.ir/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({
          dailyOrders: res.data.dailyOrders || [],
          dailyRevenue: res.data.dailyRevenue || [],
          dailyLabels: res.data.dailyLabels || [],
          monthlyOrders: res.data.monthlyOrders || [],
          monthlyRevenue: res.data.monthlyRevenue || [],
          monthlyLabels: res.data.monthlyLabels || [],
        });

        setUsersCount(res.data.usersCount || 0);
      } catch (err) {
        console.error("⚠️ خطا در دریافت اطلاعات:", err.response?.data || err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  const dailyOrdersTotal = stats.dailyOrders.reduce((a, b) => a + b, 0);
  const dailyRevenueTotal = stats.dailyRevenue.reduce((a, b) => a + b, 0);
  const monthlyOrdersTotal = stats.monthlyOrders.reduce((a, b) => a + b, 0);
  const monthlyRevenueTotal = stats.monthlyRevenue.reduce((a, b) => a + b, 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { font: { family: "Yekan", size: 12 }, color: "#333" } },
      y: {
        beginAtZero: true,
        ticks: {
          font: { family: "Yekan", size: 12 },
          color: "#333",
          stepSize: 1,
        },
        grid: { color: "#eee" },
      },
    },
  };

  const createChartData = (labels, data, color) => ({
    labels,
    datasets: [
      {
        data: data.map((v) => Math.round(v)),
        backgroundColor: color,
        borderRadius: 8,
      },
    ],
  });

  const dailyOrdersChart = createChartData(
    stats.dailyLabels,
    stats.dailyOrders,
    "#3d81ce"
  );
  const dailyRevenueChart = createChartData(
    stats.dailyLabels,
    stats.dailyRevenue,
    "#3dc678"
  );
  const monthlyOrdersChart = createChartData(
    stats.monthlyLabels.slice(-6),
    stats.monthlyOrders.slice(-6),
    "#4e9bde"
  );
  const monthlyRevenueChart = createChartData(
    stats.monthlyLabels.slice(-6),
    stats.monthlyRevenue.slice(-6),
    "#3dc678"
  );

  return (
    <div className="dashboard">
      <div className="title">
        <span className="material-symbols-outlined">dashboard</span>
        <h1>داشبورد</h1>
      </div>

      <div className="cards">
        <div className="card">
          <h3>سفارش امروز</h3>
          <p>{stats.dailyOrders[stats.dailyOrders.length - 1] || 0}</p>
        </div>
        <div className="card">
          <h3>سفارش ماه</h3>
          <p>{monthlyOrdersTotal}</p>
        </div>
        <div className="card">
          <h3>درآمد ماهانه</h3>
          <p>{monthlyRevenueTotal.toLocaleString()} تومان</p>
        </div>
        <div className="card">
          <h3>تعداد کاربران</h3>
          <p>{usersCount}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart">
          <h4>سفارش روزانه (۷ روز اخیر)</h4>
          <Bar data={dailyOrdersChart} options={chartOptions} />
        </div>

        <div className="chart">
          <h4>سفارش ماهانه (۶ ماه اخیر)</h4>
          <Bar data={monthlyOrdersChart} options={chartOptions} />
        </div>
        <div className="chart">
          <h4>درآمد روزانه (۷ روز اخیر)</h4>
          <Bar data={dailyRevenueChart} options={chartOptions} />
        </div>
        <div className="chart">
          <h4>درآمد ماهانه (۶ ماه اخیر)</h4>
          <Bar data={monthlyRevenueChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
