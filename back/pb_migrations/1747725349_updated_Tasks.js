/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wc4xytsmywa7m21")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "skdtq1lp",
    "name": "date_of_start",
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
  const collection = dao.findCollectionByNameOrId("wc4xytsmywa7m21")

  // remove
  collection.schema.removeField("skdtq1lp")

  return dao.saveCollection(collection)
})
