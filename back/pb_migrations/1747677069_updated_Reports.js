/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8jxb4g7uztbcvyi")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7wz3vxld",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q8nnnwwn",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8jxb4g7uztbcvyi")

  // remove
  collection.schema.removeField("7wz3vxld")

  // remove
  collection.schema.removeField("q8nnnwwn")

  return dao.saveCollection(collection)
})
