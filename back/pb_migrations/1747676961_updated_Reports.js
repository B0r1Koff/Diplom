/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8jxb4g7uztbcvyi")

  // remove
  collection.schema.removeField("6kmocs03")

  // remove
  collection.schema.removeField("8e8fxjxx")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8jxb4g7uztbcvyi")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6kmocs03",
    "name": "month",
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
    "id": "8e8fxjxx",
    "name": "year",
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

  return dao.saveCollection(collection)
})
