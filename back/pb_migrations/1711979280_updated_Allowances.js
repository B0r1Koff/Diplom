/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4atlmd6xv1n42nx")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lcdwtrlw",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "overworking",
        "experience"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4atlmd6xv1n42nx")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lcdwtrlw",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "overworking",
        "experience"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
