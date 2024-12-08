routerAdd("GET", "/api/collections/MonthData/findByUserId/:id", (c) => {
    
    let id = c.pathParam("id");
    let data = [];

    try {
        data = $app.dao().findRecordsByExpr("MonthData",
        $dbx.exp("LOWER(worker_id) = {:id}", { "id": id })    
    )
    } catch (exception) {
        console.log(exception.message)
        return c.json(403, { "message": "DataNotFoundException" })
    }    
    
    return c.json(200, {data})
})
