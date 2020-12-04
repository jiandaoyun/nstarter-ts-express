import { SchemaManager } from 'nstarter-entity';

export const schemaManager = SchemaManager.Initialize();
schemaManager.loadSchemaDefinition('./resources/entities.schema.json');
