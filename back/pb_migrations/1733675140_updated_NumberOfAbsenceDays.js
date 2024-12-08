/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("58gtphniqiiplmx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3bdxdphk",
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
  const collection = dao.findCollectionByNameOrId("58gtphniqiiplmx")

  // remove
  collection.schema.removeField("3bdxdphk")

  return dao.saveCollection(collection)
})
