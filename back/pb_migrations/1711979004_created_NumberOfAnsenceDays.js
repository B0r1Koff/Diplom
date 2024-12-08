/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "58gtphniqiiplmx",
    "created": "2024-04-01 13:43:24.436Z",
    "updated": "2024-04-01 13:43:24.436Z",
    "name": "NumberOfAnsenceDays",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zrit67u3",
        "name": "number_of_days",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "hohsl68g",
        "name": "worker_id",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "4hn31h398vg9enb",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
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
  const collection = dao.findCollectionByNameOrId("58gtphniqiiplmx");

  return dao.deleteCollection(collection);
})
