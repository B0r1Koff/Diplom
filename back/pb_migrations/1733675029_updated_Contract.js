/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n6sqk8u7bi23trv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9h2dgeho",
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
  const collection = dao.findCollectionByNameOrId("n6sqk8u7bi23trv")

  // remove
  collection.schema.removeField("9h2dgeho")

  return dao.saveCollection(collection)
})
