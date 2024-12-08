routerAdd("GET", "/api/collections/Worker/login/:login/:password", (c) => {
    
    let login = c.pathParam("login");
    let password = c.pathParam("password");
    let user = null;

    try {
    user = $app.dao().findFirstRecordByData(
        "Worker", "login", login
    )
    } catch (exception) {
        console.log(exception.message)
        return c.json(403, { "message": "UserNotFoundException" })
    }    

    if(user.getString("password") != password)
        return c.json(403, {"message": "WrongPasswordException"})
    
    return c.json(200, { user })
})

routerAdd("GET", "/api/collections/Worker/findByLogin/:login", (c) => {
    
    let login = c.pathParam("login");
    let user = null;

    try {
    user = $app.dao().findFirstRecordByData(
        "Worker", "login", login
    )
    } catch (exception) {
        console.log(exception.message)
        return c.json(403, { "message": "UserNotFoundException" })
    }    
    
    return c.json(200, { user })
})
