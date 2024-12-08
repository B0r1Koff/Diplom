/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "7ccfz7yun79smy3",
    "created": "2024-04-01 13:41:40.840Z",
    "updated": "2024-04-01 13:41:40.840Z",
    "name": "Notices",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "4w7csv7n",
        "name": "start_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "ganinukn",
        "name": "end_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "u2tbatt0",
        "name": "type",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "sick leave",
            "absenteeism",
            "vacation",
            "paid vacation"
          ]
        }
      },
      {
        "system": false,
        "id": "1hs8kxy7",
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
  const collection = dao.findCollectionByNameOrId("7ccfz7yun79smy3");

  return dao.deleteCollection(collection);
})
