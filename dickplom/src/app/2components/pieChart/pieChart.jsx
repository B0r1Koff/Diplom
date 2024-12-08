import { useEffect, useRef } from "react";
import Chart from "chart.js";
import "./pieChart.css";

export default function PieChart(){
    const canvas = useRef();

    useEffect(() => {
        const ctx = canvas.current
        const myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["Accepted", "Pending", "Rejected"],
                datasets: [{
                    data: [70, 10, 6],
                    backgroundColor: [
                        `#${Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)}`,
                        `#${Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)}`,
                        `#${Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)}`,
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        display: false,
                    }],
                    yAxes: [{
                        display: false,
                    }],
                }
            },
        });
    }, [])
    return (
        <>
            {/* Pie chart */}
            <div className='pie-chart-container'>
                <canvas className='pie-chart' ref={canvas}></canvas>
            </div>
        </>
    )
}
