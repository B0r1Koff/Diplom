/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7ccfz7yun79smy3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0w6hsf1f",
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
  const collection = dao.findCollectionByNameOrId("7ccfz7yun79smy3")

  // remove
  collection.schema.removeField("0w6hsf1f")

  return dao.saveCollection(collection)
})
