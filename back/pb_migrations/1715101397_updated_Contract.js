/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n6sqk8u7bi23trv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "285huwo4",
    "name": "date_of_start",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n5yncswm",
    "name": "date_of_end",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n6sqk8u7bi23trv")

  // remove
  collection.schema.removeField("285huwo4")

  // remove
  collection.schema.removeField("n5yncswm")

  return dao.saveCollection(collection)
})
