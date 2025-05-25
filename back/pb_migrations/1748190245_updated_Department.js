/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kdbr220nyr1mxwv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xchui7el",
    "name": "parent_department_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "kdbr220nyr1mxwv",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kdbr220nyr1mxwv")

  // remove
  collection.schema.removeField("xchui7el")

  return dao.saveCollection(collection)
})
