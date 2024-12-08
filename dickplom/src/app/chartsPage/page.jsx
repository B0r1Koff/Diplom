import "./chartsPage.css";
import PieChart from "../2components/pieChart/pieChart";
import LineChart from "../2components/lineChart/lineChart";
import BarChart from "../2components/barChart/barChart";
import Navbar from "../2components/navbar/navbar";
import { useState } from "react";

export default function Charts(){
    const types = ["Столбчатая", "Круговая", "График"]
    const [chartType, setChartType] = useState(types[0])
    const [chart, setChart] = useState("")

    const chartOptions = types.map((type, index) => {
        return <option key={index}>{type}</option>
    });

    const handleCreate = (e) => {
        setChart(chartType)
    }

    return(
        <div className="charts-page">
            <div className="charts-params">
                <div className='type-options'>
                    <select className="select-type" value={chartType} onChange = {(event) => setChartType(event.target.value)}>
			            {chartOptions}
		            </select>
                    <label className='select-type-label'>Тип:</label>
                </div>
                <div className='type-options'>
                    <select className="select-type" value={chartType} onChange = {(event) => setChartType(event.target.value)}>
			            {chartOptions}
		            </select>
                    <label className='select-type-label'>Период:</label>
                </div>
                <div className='type-options'>
                    <select className="select-type" value={chartType} onChange = {(event) => setChartType(event.target.value)}>
			            {chartOptions}
		            </select>
                    <label className='select-type-label'>Параметр:</label>
                </div>
            </div>
            <button onClick={handleCreate}>Сгенерировать</button>
            <div className="charts-container">
                {
                    chart === "Круговая" ? 
                        <PieChart/>
                    :
                    chart === "Столбчатая" ? 
                        <BarChart/>
                    :
                    chart === "График" ?
                        <LineChart/>
                    :
                    <></>
                }
            </div>

            <Navbar/>
        </div>
    )
}
