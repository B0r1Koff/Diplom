/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("g1c9sq0sx1vpd27")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l5bhtt9b",
    "name": "user_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("g1c9sq0sx1vpd27")

  // remove
  collection.schema.removeField("l5bhtt9b")

  return dao.saveCollection(collection)
})
