/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("g1c9sq0sx1vpd27")

  // remove
  collection.schema.removeField("phbiecna")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "royiebpn",
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
    "id": "4kqscngd",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("g1c9sq0sx1vpd27")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "phbiecna",
    "name": "date",
    "type": "date",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // remove
  collection.schema.removeField("royiebpn")

  // remove
  collection.schema.removeField("4kqscngd")

  return dao.saveCollection(collection)
})
