/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("g1c9sq0sx1vpd27")

  // remove
  collection.schema.removeField("sybdhbbe")

  // remove
  collection.schema.removeField("hcvnszoz")

  // remove
  collection.schema.removeField("rdmuaiuf")

  // remove
  collection.schema.removeField("b1bceihp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hy5kwmzu",
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
  const collection = dao.findCollectionByNameOrId("g1c9sq0sx1vpd27")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sybdhbbe",
    "name": "salary",
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
    "id": "hcvnszoz",
    "name": "allowances",
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
    "id": "rdmuaiuf",
    "name": "deductions",
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
    "id": "b1bceihp",
    "name": "worker_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "4hn31h398vg9enb",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("hy5kwmzu")

  return dao.saveCollection(collection)
})
