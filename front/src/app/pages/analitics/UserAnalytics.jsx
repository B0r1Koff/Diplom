import { Col, Flex, Radio, Row, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Pocketbase from 'pocketbase';

export default function UserAnalytics(){
    const pb = new Pocketbase('http://127.0.0.1:8090');
    const years = Array.from({ length: 10 }, (_, i) => ({
        value: new Date().getFullYear() - 9 + i,
        label: new Date().getFullYear() - 9 + i
    }));
    const monthes = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    
    const [users, setUsers] = useState([]);
    const [selectedParametr, setSelectedParametr] = useState("");
    
    const [lineChartOptions, setLineChatrOptions] = useState({chart: {id: "basic-line"}, xaxis: {categories: monthes},});
    const [lineChartSeries, setLineChartSeries] = useState([])

    const [barChartOptions, setBarChatrOptions] = useState({chart: {id: "basic-bar"}, xaxis: {categories: monthes},});
    const [barChartSeries, setBarChartSeries] = useState([])

    const onSelectUser = async (userIds) => {
    let barChartSeriesSelection = [{ name: "100%", data: Array.from({ length: monthes?.length })?.fill(100) }];
    let lineChartSeriesSelection = [{ name: "Необходимый KPI", data: Array.from({ length: monthes?.length })?.fill(100) }];

    const promises = userIds?.map(async (userId) => {
        const records = await pb.collection('MonthData').getFullList({
            filter: `user_id = '${userId}' && year = '${new Date().getFullYear()}'`,
            requestKey: userId
        });

        let kpi = [];
        let hours = [];

        for (let i = 0; i < 11; i++) {
            if (records?.some(item => item?.month === i + 1)) {
                const item = records?.filter(a => a?.month === i + 1)[0];
                kpi.push(parseInt(item?.params?.kpi));
                hours.push(parseInt(item?.params?.hoursWorked));
            } else {
                kpi.push(0);
                hours.push(0);
            }
        }

        barChartSeriesSelection.push({ name: `${users?.filter(user => user?.value === userId)[0]?.label}`, data: hours });
        lineChartSeriesSelection.push({ name: `${users?.filter(user => user?.value === userId)[0]?.label}`, data: kpi });
    });

    await Promise.all(promises);

    setBarChartSeries(barChartSeriesSelection);
    setLineChartSeries(lineChartSeriesSelection);
};

    useEffect(() => {
        const records = pb.collection('users').getFullList({
            filter: `position != 'director'`
        });
        records.then((data) => {
            const users = Array.from({ length: data?.length }, (_, i) => ({
                value: data?.[i]?.id,
                label: data?.[i]?.fio
            }));
            setUsers(users);
        })
    }, []);

    return (
        <Col style={{marginTop: '80px', marginLeft: '30px'}}>
            <Row>
                <Typography>Сотрудники: </Typography>
                <Select
                    style={{ width: `${screen.width - 200}px`, marginBottom: 20, marginLeft: 10}}
                    onChange={(value) => onSelectUser(value)}
                    mode="multiple"
                >
                {users.map(user => (
                <Select.Option key={user?.value} value={user?.value}>
                    {user?.label}
                </Select.Option>
                ))}
            </Select>
          </Row>
          <Row>
                <Typography>Параметр: </Typography>
                <Select
                    style={{ width: 200, marginBottom: 20, marginLeft: 23}}
                    onChange={(value) => setSelectedParametr(value)}
                    value={selectedParametr}
                >
                <Select.Option key={"KPI"} value={"kpi"}>
                    {"KPI"}
                </Select.Option>
                <Select.Option key={"Отработанное время"} value={"hoursWorked"}>
                    {"Отработанное время"}
                </Select.Option>
            </Select>
          </Row>
        <Row>
            <Col>
                <Chart
                    options={selectedParametr === "kpi" ? lineChartOptions : barChartOptions}
                    series={selectedParametr === "kpi" ? lineChartSeries : barChartSeries}
                    type="line"
                    width={`${screen.width - 100}`}
                    height={`${screen.height - 400}`}
                />
            </Col>
            {/* <Col>
                <Chart
                    options={barChartOptions}
                    series={barChartSeries}
                    type="bar"
                    width={`${screen.width / 2 - 50}`}
                />
            </Col> */}
        </Row>
        </Col>
    )
};