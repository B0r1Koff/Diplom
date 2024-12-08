/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "4atlmd6xv1n42nx",
    "created": "2024-04-01 13:32:00.026Z",
    "updated": "2024-04-01 13:32:00.026Z",
    "name": "Allowances",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "1shagqks",
        "name": "percent",
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
        "id": "lcdwtrlw",
        "name": "type",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "overworking",
            "experience"
          ]
        }
      },
      {
        "system": false,
        "id": "8zp1539v",
        "name": "worker_id",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "4hn31h398vg9enb",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": null,
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
  const collection = dao.findCollectionByNameOrId("4atlmd6xv1n42nx");

  return dao.deleteCollection(collection);
})
