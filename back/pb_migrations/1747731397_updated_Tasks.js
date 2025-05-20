/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wc4xytsmywa7m21")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mzho5whn",
    "name": "files",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wc4xytsmywa7m21")

  // remove
  collection.schema.removeField("mzho5whn")

  return dao.saveCollection(collection)
})
