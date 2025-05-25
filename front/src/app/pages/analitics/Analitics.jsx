import { Col, Flex, Radio, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Pocketbase from 'pocketbase';
import UserAnalytics from "./UserAnalytics";

export default function Analytics(){
    const [mode, setMode] = useState("Workers");

     const handleModeChange = (e) => {
        setMode(e.target.value);
    };

    return (
        <Flex vertical>
            {/* <Radio.Group onChange={handleModeChange} value={mode} style={{ position: 'absolute', top: '65px', left: '30px' }}>
                <Radio.Button value="Workers">По сотрудникам</Radio.Button>
                <Radio.Button value="Departments">По отделам</Radio.Button>
            </Radio.Group> */}

        {mode === "Workers"
        ?
        <UserAnalytics/>
    : 
    <></>
}
        </Flex>
    )
};