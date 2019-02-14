# ${APP_NAME}



----
## TIPS

* Enable config file check for Visual Studio Code.

  ```json
  {
      "json.schemas": [
          {
              "fileMatch": [
                  "/conf.d/config.*.json"
              ],
              "url": "./config.schema.json"
          }
      ],
      "yaml.schemas": {
          "./config.schema.json": "/conf.d/config.*.yaml"
      }
  }
  ```
