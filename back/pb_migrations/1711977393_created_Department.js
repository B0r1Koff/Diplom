/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "kdbr220nyr1mxwv",
    "created": "2024-04-01 13:16:33.205Z",
    "updated": "2024-04-01 13:16:33.205Z",
    "name": "Department",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7nhsk1rs",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("kdbr220nyr1mxwv");

  return dao.deleteCollection(collection);
})
