/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4atlmd6xv1n42nx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "z9jjeldx",
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
  const collection = dao.findCollectionByNameOrId("4atlmd6xv1n42nx")

  // remove
  collection.schema.removeField("z9jjeldx")

  return dao.saveCollection(collection)
})
