# ${APP_NAME}



----
## TIPS

* Capture console output from winston in Visual Studio Code debug mode.

  Add `outputCapture` option for running configurations.

  ```json
  {
      "outputCapture": "std"
  }
  ```

* Enable config file check for Visual Studio Code.

  Add `json.schemas` or `yaml.schemas` options in workspace settings file.

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
