import React, { useEffect, useState, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import axios from 'axios';
import '../Style/ChartStatistic.css';

const API_URL = 'http://localhost:5000/api/tasks';

Chart.register(ArcElement);

const TaskStatusChart = () => {
    const [data, setData] = useState({
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [
            {
                data: [],
                backgroundColor: ['#4CAF50', '#FFCE56', '#FF6384'],
            },
        ],
    });
    const [period, setPeriod] = useState('7days');
    const [totalTasksCount, setTotalTasksCount] = useState(0);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/report/task-statuses?period=${period}`);
                const { completedTasksCount, inProgressTasksCount, pendingTasksCount, totalTasksCount } = response.data;

                setTotalTasksCount(totalTasksCount || 0);

                const completedPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;
                const inProgressPercentage = totalTasksCount > 0 ? (inProgressTasksCount / totalTasksCount) * 100 : 0;
                const pendingPercentage = totalTasksCount > 0 ? (pendingTasksCount / totalTasksCount) * 100 : 0;

                setData({
                    labels: ['Completed', 'In Progress', 'Pending'],
                    datasets: [
                        {
                            data: [completedPercentage, inProgressPercentage, pendingPercentage],
                            backgroundColor: ['#4CAF50', '#FFCE56', '#FF6384'],
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [period]);

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    const renderCenterText = (chart) => {
        const { ctx, width, height } = chart;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px Arial';
        const text = totalTasksCount === 0 ? "No Tasks" : `Ukupno: ${totalTasksCount}`;
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                display: true,
                position: 'bottom',
            },
        },
        animation: {
            onComplete: function () {
                if (chartRef.current) {
                    renderCenterText(chartRef.current);
                }
            },
        },
    };

    return (
        <div className="chart-container">
            <h3>Statistika aktivnosti</h3>
            <div className="chart-buttons">
                <button onClick={() => handlePeriodChange('7days')}>Poslednjih 7 dana</button>
                <button onClick={() => handlePeriodChange('30days')}>Poslednjih 30 dana</button>
                <button onClick={() => handlePeriodChange('1year')}>Poslednjih godinu dana</button>
            </div>
            <div className="chart-content">
    <Doughnut
        ref={chartRef}
        data={data}
        options={options}
    />
</div>

            {/* Legenda */}
            <div className="status-legend">
                <div className="legend-item">
    <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
    <span>Završenih: {totalTasksCount > 0 ? Math.round((data.datasets[0].data[0] / totalTasksCount) * 10) : 0}%</span>
</div>
<div className="legend-item">
    <span className="legend-color" style={{ backgroundColor: '#FFCE56' }}></span>
    <span>U procesu: {totalTasksCount > 0 ? Math.round((data.datasets[0].data[1] / totalTasksCount) * 10) : 0}%</span>
</div>
<div className="legend-item">
    <span className="legend-color" style={{ backgroundColor: '#FF6384' }}></span>
    <span>Na čekanju: {totalTasksCount > 0 ? Math.round((data.datasets[0].data[2] / totalTasksCount) * 10) : 0}%</span>
</div>

            </div>
        </div>
    );
};

export default TaskStatusChart;
