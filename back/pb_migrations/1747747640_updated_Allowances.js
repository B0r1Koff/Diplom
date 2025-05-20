/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4atlmd6xv1n42nx")

  // remove
  collection.schema.removeField("lcdwtrlw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8btiaezj",
    "name": "type",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4atlmd6xv1n42nx")

  // add
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

  // remove
  collection.schema.removeField("8btiaezj")

  return dao.saveCollection(collection)
})
