/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7ccfz7yun79smy3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "u2tbatt0",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Отпуск",
        "Больничный",
        "Оплачиваемый отпуск",
        "Прогул"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7ccfz7yun79smy3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "u2tbatt0",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "sick leave",
        "absenteeism",
        "vacation",
        "paid vacation"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
