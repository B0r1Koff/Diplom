/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n6sqk8u7bi23trv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uqwmricu",
    "name": "is_time_based",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n6sqk8u7bi23trv")

  // remove
  collection.schema.removeField("uqwmricu")

  return dao.saveCollection(collection)
})
