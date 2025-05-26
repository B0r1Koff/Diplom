import { useState, useEffect } from "react";
import "./absenceNotice.css";
import Navbar from "../2components/navbar/navbar";
import Notice from "../2components/notice/notice";
import PocketBase from 'pocketbase';
import { notification, Table } from "antd";
import moment from 'moment';

export default function AbsenceNotice() {
    const pb = new PocketBase("http://127.0.0.1:8090");
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const holidays = [
        new Date(year, 0, 1),   // 1 января – Новый год
        new Date(year, 0, 2),   // 2 января – Новый год
        new Date(year, 0, 7),   // 7 января – Рождество Христово
        new Date(year, 2, 8),   // 8 марта – День женщин
        new Date(year, 3, 29),  // 29 апреля – Радуница
        new Date(year, 4, 1),   // 1 мая – Праздник труда
        new Date(year, 4, 9),   // 9 мая – День Победы
        new Date(year, 6, 3),   // 3 июля – День Независимости Республики Беларусь
        new Date(year, 10, 7),  // 7 ноября – День Октябрьской революции
        new Date(year, 11, 25)  // 25 декабря – Рождество Христово (католическое Рождество)
    ];

    const defaultNoticeState = {
        start_date: "",
        end_date: "",
        type: "",
        user_id: ""
    };

    const [noticeData, setNoticeData] = useState(defaultNoticeState);
    const [notices, setNotices] = useState([]);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const countWorkingDays = (startDate, endDate) => {
        let workingDays = 0;
        const currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
            const dayOfWeek = currentDate.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
            const isHoliday = holidays.some(holiday =>
                holiday.getDate() === currentDate.getDate() &&
                holiday.getMonth() === currentDate.getMonth() &&
                holiday.getFullYear() === currentDate.getFullYear()
            );

            if (!isWeekend && !isHoliday) {
                workingDays++;
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return workingDays;
    };

    const fetchNotices = async (page = 1, perPage = 10) => {
        try {
            const result = await pb.collection('Notices').getList(page, perPage, {
                sort: '-created',
            });
            setNotices(result.items);
            setPagination({
                ...pagination,
                total: result.totalItems,
            });
        } catch (error) {
            //
        }
    };

    const fetchUsers = async () => {
        try {
            const result = await pb.collection('users').getList(1, 100); // Adjust the perPage as needed
            setUsers(result.items);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        fetchNotices(pagination.current, pagination.pageSize);
        fetchUsers();
    }, [pagination.current, pagination.pageSize]);

    const handleTableChange = (pagination) => {
        setPagination({
            ...pagination,
        });
    };

    const formatDate = (date) => {
        return moment(date).format('DD.MM.YYYY');
    };

    const getUserFio = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.fio : userId;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (noticeData.end_date === "" || noticeData.start_date === "" || noticeData.type === "" || noticeData.user_id === "") {
            alert("Заполните все поля!");
            return;
        }

        if (noticeData.type === "Отпуск") {
            const numberOfAbsenceDaysResult = await pb.collection('NumberOfAbsenceDays').getList(1, 1, {
                filter: `user_id = '${noticeData.user_id}'`,
                requestKey: noticeData.user_id
            });
            const contractResult = await pb.collection('Contract').getList(1, 1, {
                filter: `user_id = '${noticeData.user_id}'`,
                requestKey: noticeData.user_id
            });

            const maxAbsenceDays = contractResult?.items[0]?.sick_days;
            const workingDays = countWorkingDays(noticeData.start_date, noticeData.end_date);

            if (numberOfAbsenceDaysResult?.items?.length === 0) {
                if (maxAbsenceDays >= workingDays) {
                    pb.collection('Notices').create(noticeData)
                        .then(response => {
                            if (response.created) {
                                notification.success({
                                    message: 'Успех',
                                    description: `Уведомление создано`,
                                });
                                setNoticeData(defaultNoticeState);
                                fetchNotices(); // Refresh the notices list
                            }
                        });
                    const data = {
                        "number_of_days": workingDays,
                        "user_id": noticeData.user_id
                    };

                    const record = await pb.collection('NumberOfAbsenceDays').create(data);
                } else {
                    notification.error({
                        message: 'Ошибка',
                        description: `Выбрано слишком много дней отпуска`,
                    });
                }
            } else {
                const absenceDays = numberOfAbsenceDaysResult?.items[0]?.number_of_days;
                if (maxAbsenceDays >= workingDays + absenceDays) {
                    pb.collection('Notices').create(noticeData)
                        .then(response => {
                            if (response.created) {
                                notification.success({
                                    message: 'Успех',
                                    description: `Уведомление создано`,
                                });
                                setNoticeData(defaultNoticeState);
                                fetchNotices(); // Refresh the notices list
                            }
                        });
                    const data = {
                        "number_of_days": workingDays + absenceDays,
                        "user_id": noticeData.user_id
                    };

                    const record = await pb.collection('NumberOfAbsenceDays').update(numberOfAbsenceDaysResult?.items[0]?.id, data);
                } else {
                    notification.error({
                        message: 'Ошибка',
                        description: `Выбрано слишком много дней отпуска`,
                    });
                }
            }
        } else {
            const record = pb.collection('Notices').create(noticeData);
            record.then(response => {
                if (response.created) {
                    notification.success({
                        message: 'Успех',
                        description: `Уведомление создано`,
                    });
                    setNoticeData(defaultNoticeState);
                    fetchNotices(); // Refresh the notices list
                }
            });
        }
    };

    const columns = [
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Дата начала',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => formatDate(text),
        },
        {
            title: 'Дата окончания',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (text) => formatDate(text),
        },
        {
            title: 'Пользователь',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (userId) => getUserFio(userId),
        },
    ];

    return (
        <div className='notice-page'>
            <div className='notice-content'>
                <div className='notice-info-wrapper'>
                    <Notice noticeData={noticeData} setNoticeData={setNoticeData} />
                    <Table
                    dataSource={notices}
                    columns={columns}
                    pagination={pagination}
                    onChange={handleTableChange}
                    rowKey="id"
                />
                </div>
                <button className='create-notice-button' onClick={handleSubmit}>Создать</button>
            </div>
            {/* <Navbar/> */}
        </div>
    );
}
