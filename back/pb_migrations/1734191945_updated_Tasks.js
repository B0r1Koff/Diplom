/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wc4xytsmywa7m21")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dpyakitt",
    "name": "priority",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "simple",
        "medium",
        "hard"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wc4xytsmywa7m21")

  // remove
  collection.schema.removeField("dpyakitt")

  return dao.saveCollection(collection)
})
