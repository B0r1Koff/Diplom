/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4hn31h398vg9enb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ef4ag5ih",
    "name": "photo",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4hn31h398vg9enb")

  // remove
  collection.schema.removeField("ef4ag5ih")

  return dao.saveCollection(collection)
})
