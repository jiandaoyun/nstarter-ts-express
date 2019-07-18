// @see https://github.com/AlloyTeam/eslint-config-alloy#typescript
module.exports = {
    extends: [
        "eslint-config-alloy/typescript",
    ],
    plugins: [
        "import"
    ],
    env: {
        browser: false,
        node: true,
        es6: true
    },
    globals: {
        "console": false,
        "exports": false,
        "module": false,
        "require": false,
        "process": false
    },
    rules: {
        "accessor-pairs": ["off"],
        "arrow-body-style": ["warn", "as-needed"],
        "curly": ["error", "all"],
        "default-case": ["error"],
        "eol-last": ["warn", "always"],
        "function-paren-newline": ["off"],
        "implicit-arrow-linebreak": ["off"],
        "linebreak-style": ["error", "unix"],
        "max-nested-callbacks": ["error", { max: 5 }],
        "no-useless-call": ["off"],
        "object-shorthand": ["error", "always"],
        "one-var": ["off"],
        "prefer-arrow-callback": ["error", { "allowNamedFunctions": true }],
        "prefer-const": ["error"],
        "prefer-numeric-literals": ["error"],
        "spaced-comment": [
            "error", "always", {
                "exceptions": [
                    "#alt",
                    "#endalt"
                ],
                "markers": [
                    "#",
                    "#module",
                    "#endmodule",
                ]
            }
        ],
        "template-curly-spacing": ["warn", "always"],
        "yoda": ["off"],

        // typescript-eslint
        "@typescript-eslint/ban-types": ["error", {
            "types": {
                "Object": {
                    "message": "Use '{}' instead",
                    "fixWith": "{}"
                },
                "String": {
                    "message": "Use 'string' instead",
                    "fixWith": "string"
                },
                "Number": {
                    "message": "Use 'number' instead",
                    "fixWith": "number"
                },
                "Boolean": {
                    "message": "Use 'boolean' instead",
                    "fixWith": "boolean"
                }
            }
        }],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                accessibility: "explicit",
                overrides: {
                    constructors: "no-public",
                }
            }
        ],
        "@typescript-eslint/indent": ["off"],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                },
                "overrides": {
                    "typeLiteral": {
                        "multiline": {
                            "delimiter": "comma",
                            "requireLast": false
                        },
                        "singleline": {
                            "delimiter": "comma",
                            "requireLast": false
                        }
                    }
                }
            }
        ],
        "@typescript-eslint/member-ordering": [
            "warn",
            {
                default: [
                    // Fields
                    "static-field",
                    "instance-field",

                    // Constructors
                    "public-constructor",
                    "protected-constructor",
                    "private-constructor",

                    // Methods
                    "private-static-method",
                    "protected-static-method",
                    "public-static-method",
                ]
            }
        ],
        "@typescript-eslint/no-empty-interface": ["off"],
        "@typescript-eslint/no-object-literal-type-assertion": ["error", {
            allowAsParameter: true
        }],
        "@typescript-eslint/no-require-imports": ["error"],
        "@typescript-eslint/prefer-function-type": ["off"],
        "@typescript-eslint/semi": ["error"],

        // import
        "import/no-default-export": ["error"],
        "import/no-unused-modules": ["error"]
    }
};
