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
        "Отгул",
        "Не оплачиваемый отпуск"
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
        "Отпуск",
        "Больничный",
        "Отгул",
        "Отпуск за счет сотрудника"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
