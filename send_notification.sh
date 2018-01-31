#!/bin/bash

curl -H "Content-Type: application/json" -X POST \
  -d '{ "notification": { "title": "Ahoy!", "body": "Call me Ishmael", "icon": "/teacher.png" } }' \
  http://localhost:3000/example/notify
