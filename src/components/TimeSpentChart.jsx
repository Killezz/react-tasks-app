import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../index.css";

const TimeSpentChart = ({ dailyActiveTime, chartStartDate, chartEndDate }) => {
  // Creates bar chart based on daily activity and given timeframes.
  const computedStyles = getComputedStyle(document.body);
  const chartLabels = computedStyles.getPropertyValue("--chart-labels-color");
  const chartBarBorderColor = computedStyles.getPropertyValue(
    "--chart-bar-border-color"
  );
  const chartBarBgColor = computedStyles.getPropertyValue(
    "--chart-bar-bg-color"
  ); // Loads current theme variables
  const createChartHistory = (data) => {
    // Creates completed data based on chartStartDate and chartEndDates. If there is
    // no data found then adds 0s activity on that date.
    const currentDate = new Date(chartEndDate);
    const newData = [];
    const chartAddRandomActivity = false; // For testing only
    while (currentDate.toISOString().split("T")[0] >= chartStartDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      const existingData = data.find((item) => item.date === dateString);

      if (existingData) {
        newData.push(existingData);
      } else {
        if (chartAddRandomActivity) {
          newData.push({
            date: dateString,
            activeSeconds: Math.floor(Math.random() * 10000),
            activeIntervals: [],
          });
        } else {
          newData.push({
            date: dateString,
            activeSeconds: 0,
            activeIntervals: [],
          });
        }
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return newData.reverse();
  };

  const completeData = createChartHistory(dailyActiveTime);

  const chartData = {
    labels: completeData.map((item) => item.date),
    datasets: [
      {
        label: "Active minutes",
        data: completeData.map((item) => Math.round(item.activeSeconds / 60)),
        backgroundColor: chartBarBgColor,
        borderColor: chartBarBorderColor,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: chartLabels,
          font: {
            size: 15,
          },
        },
      },
      x: {
        ticks: {
          color: chartLabels,
          font: {
            size: 15,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: chartLabels,
          font: {
            size: 18,
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} height={250} />;
};

export default TimeSpentChart;
