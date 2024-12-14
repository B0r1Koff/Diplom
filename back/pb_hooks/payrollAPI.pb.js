routerAdd("POST", "/api/collections/users/payroll", (c) => {
    const monthes = arrayOf(new DynamicModel({
        "date": ""
    }))

    const notices = arrayOf(new DynamicModel({
        "id": "",
        "start_date": "",
        "end_date": "",
        "type": "",
        "user_id": "",
    }))

    const contracts = arrayOf(new DynamicModel({
        "id": "",
        "salary": 0,
        "is_time_based": false,
        "user_id": "",
    }))

    const allowances = arrayOf(new DynamicModel({
        "id": "",
        "percent": 0,
        "type": "",
        "user_id": "",
    }))

    try {
        $app.dao().db()
            .newQuery("SELECT date FROM MonthData")
            .all(monthes) 

        $app.dao().db()
            .newQuery("SELECT id, start_date, end_date, type, user_id FROM Notices")
            .all(notices) 

        $app.dao().db()
            .newQuery("SELECT id, salary, is_time_based, user_id FROM Contract")
            .all(contracts) 

        $app.dao().db()
            .newQuery("SELECT id, percent, type, user_id FROM Allowances")
            .all(allowances) 
    } catch (exception) {
        console.log(exception.message)
    }   

    function isBelarusWeekend(date) {
        const day = date.getDay();
        return day === 6 || day === 0;
      }
      
      function getWorkingDaysInMonth(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
      
        let workingDays = 0;
        let currentDate = firstDay;
      
        while (currentDate <= lastDay) {
          if (!isBelarusWeekend(currentDate)) {
            workingDays++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      
        return workingDays;
      }
      
      function calculateSalary(contracts, notices, allowances) {
        const currentDate = new Date(); 
        const lastMonth = currentDate.getMonth(); 
        const lastMonthYear = currentDate.getFullYear(); 
      
        contracts.forEach((contract) => {
          const workingDaysInLastMonth = getWorkingDaysInMonth(lastMonthYear, lastMonth);
      
          let totalWorkDays = workingDaysInLastMonth; 
          let salary = 0; 
          const { id: contractId, salary: contractSalary, user_id: employeeId } = contract;
      
          const absenceNotices = notices.filter(
            (notice) =>
              notice.user_id === employeeId &&
              (new Date(notice.start_date.substring(0,10)).getMonth() === lastMonth || new Date(notice.end_date.substring(0,10)).getMonth() === lastMonth || new Date(notice.start_date.substring(0,10)).getMonth() < lastMonth && new Date(notice.end_date.substring(0,10)).getMonth() > lastMonth) &&
              (new Date(notice.start_date.substring(0,10)).getFullYear() === lastMonthYear || new Date(notice.end_date.substring(0,10)).getFullYear() === lastMonthYear)
          );
            
          let totalAbsentDays = 0; 
      
            absenceNotices.forEach((notice) => {
              if (notice.type !== 'Отпуск' &&  notice.type !== 'Больничный') {
                let startDate = new Date(notice.start_date.substring(0,10))
                let endDate = new Date(notice.end_date.substring(0,10))

                if(startDate.getDate() > endDate.getDate() || startDate.getMonth() < endDate.getMonth()){
                  startDate = 1
                }else{
                  startDate = startDate.getDate()
                }
                if(endDate.getMonth() > lastMonth){
                  endDate = new Date(lastMonthYear, lastMonth, 0).getDate()
                }else{
                  endDate = endDate.getDate()
                }
      
                for (let day = startDate; day <= endDate; day++) {
                  const date = new Date(lastMonthYear, lastMonth, day);
      
                  if (!isBelarusWeekend(date)) {
                    totalAbsentDays += 1;
                  }
                }
              }
            });
      
            totalWorkDays -= totalAbsentDays; 
      
          // if (totalWorkDays >= 22) {
          //   totalWorkDays = 22; 
          // }
      
          const employeeAllowances = allowances.filter(
            (allowance) => allowance.user_id === employeeId
          );
      
          let totalAllowance = 0;
          employeeAllowances.forEach((allowance) => {
            totalAllowance += allowance.percent;
          });
          const totalSalary = contractSalary * (1 + totalAllowance/100)
      
         salary += (totalSalary / workingDaysInLastMonth) * totalWorkDays; 
        
         const collection = $app.dao().findCollectionByNameOrId("MonthData")

         console.log(totalWorkDays);
         console.log(totalAbsentDays);

         const record = new Record(collection, {
                "date": new Date(),
                "salary": parseInt(salary * 0.87),
                "allowances": parseInt(salary * totalAllowance / 100),
                "deductions": parseInt(salary * 0.13),
                "user_id": employeeId
         })

         $app.dao().saveRecord(record)
        });
      }

      if(new Date(monthes.reverse()[0].date.substring(0,10)).getMonth() < new Date().getMonth()+1){
        calculateSalary(contracts, notices, allowances)
      }
      
})