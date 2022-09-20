import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    // title: {
    //   display: true,
    //   text: 'Chart.js Line Chart',
    // },
  },
};

const labels = ['10Min', '1h', '24h', '1m', '3M', '1Y'];
export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: '',
      data: { min: 0, max: 75000 },
      borderColor: '#fff',
      backgroundColor: 'linear-gradient(180deg, #8124E5 -12.5%, rgba(0, 167, 255, 0.0001) 100%)'
    },
  ],
};

const Chart = () => {
  return (
    <div>
      <Line options={options} data={data} />;
    </div>
  )
} 

export default Chart