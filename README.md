# ${APP_NAME}



----
## TIPS

* Enable config file validation for WebStorm.

  Add `.idea/jsonSchemas.xml` configuration.

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project version="4">
  <component name="JsonSchemaMappingsProjectConfiguration">
      <state>
      <map>
          <entry key="config">
          <value>
              <SchemaInfo>
              <option name="name" value="config" />
              <option name="relativePathToSchema" value="config.schema.json" />
              <option name="schemaVersion" value="JSON schema version 7" />
              <option name="patterns">
                  <list>
                  <Item>
                      <option name="pattern" value="true" />
                      <option name="path" value="conf.d/config.*.json" />
                      <option name="mappingKind" value="Pattern" />
                  </Item>
                  <Item>
                      <option name="pattern" value="true" />
                      <option name="path" value="conf.d/config.*.yaml" />
                      <option name="mappingKind" value="Pattern" />
                  </Item>
                  </list>
              </option>
              </SchemaInfo>
          </value>
          </entry>
      </map>
      </state>
  </component>
  </project>
  ```

* Capture console output from winston in Visual Studio Code debug mode.

  Add `outputCapture` option for running configurations.

  ```json
  {
      "outputCapture": "std"
  }
  ```

* Enable config file validation for Visual Studio Code.

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

----

Made on 🌍 with 💓.
