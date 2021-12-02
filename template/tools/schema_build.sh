#
# Copyright (c) 2015-2021, FineX, All Rights Reserved.
# @author vista
# @date 2021/8/17
#

BASEDIR=$(dirname "$0")
REPO_ROOT=$(dirname "${BASEDIR}")

ENTITY_DIR="${REPO_ROOT}/src/entities"
SCHEMA_DIR="${REPO_ROOT}/resources"

SCHEMA_FILE = "${SCHEMA_DIR}/entities.schema.json"
SCHEMA_HASH_FILE="${SCHEMA_FILE}.sha1sum"

# generate model schema for api docs.
function generate_entities_schema() {
    mkdir -p "$SCHEMA_DIR"
    entities_glob="${ENTITY_DIR}"/**/*.ts
    entities_hash=$(shasum ${entities_glob} | shasum | awk '{print $1}')
    # only re-generate schema files if source code changed.
    if [ ! -f "${SCHEMA_HASH_FILE}" ] ||
        [ "$(head -n 1 "${SCHEMA_HASH_FILE}")" != "${entities_hash}" ]; then
        echo 'entity files have been modified, re-generate json-schema files...'
        "${REPO_ROOT}/node_modules/.bin/typescript-json-schema" \
            "${entities_glob}" \
            "*" \
            --out "${SCHEMA_FILE}" \
            --required \
            --excludePrivate \
            --ignoreErrors \
            --noExtraProps
        echo "${entities_hash}" >"${SCHEMA_HASH_FILE}"
    fi
}

generate_entities_schema
