export const getDepartment = (departments, id) => {
    let result = ""
    departments.map(department => {
      if(department.id === id){
        result = department.name
      }
    })
    return result
}

export const getPosition = (pos) => {
    const positions = {"worker": "Сотрудник", "head": "Руководитель отдела", "director": "Директор"}
    return positions[pos]
}

export const getExperienceAllowance = (allowances, id) => {
    let result = 0
    allowances.map(allowance => {
      if(allowance.worker_id === id && allowance.type === "experience"){
        result = allowance.percent
      }
    })

    return result
}

export const getOverworkingAllowance = (allowances, id) => {
    let result = 0
    allowances.map(allowance => {
      if(allowance.worker_id === id && allowance.type === "overworking"){
        result = allowance.percent
      }
    })

    return result
}

export const getSalary = (contracts, id) => {
    let result = 0
    contracts.map(contract => {
      if(contract.worker_id === id){
        result = contract.salary
      }
    })
    return result
}

export const findUserByLogin = (users, login) => {
    let check = false
    users.map(user => {
      if (user.login === login) {
        check = true
      }
    })

    return check
}