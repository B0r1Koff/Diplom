/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4atlmd6xv1n42nx")

  // remove
  collection.schema.removeField("1shagqks")

  // remove
  collection.schema.removeField("8btiaezj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lokrrvd3",
    "name": "params",
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
  const collection = dao.findCollectionByNameOrId("4atlmd6xv1n42nx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1shagqks",
    "name": "percent",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

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

  // remove
  collection.schema.removeField("lokrrvd3")

  return dao.saveCollection(collection)
})
