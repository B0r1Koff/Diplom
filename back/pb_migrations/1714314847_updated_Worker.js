/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4hn31h398vg9enb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0q6rfpb7",
    "name": "position",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "worker",
        "head",
        "director"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4hn31h398vg9enb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0q6rfpb7",
    "name": "position",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "worker",
        "head"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
