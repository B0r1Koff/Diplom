/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n6sqk8u7bi23trv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l3upzrsf",
    "name": "start_wotking_date",
    "type": "date",
    "required": false,
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
  collection.schema.removeField("l3upzrsf")

  return dao.saveCollection(collection)
})
