# nstarter-ts-express

An Expressjs project template with Typescript for `nstarter`.

This is a backend oriented project template based on MVCS architecture.

## Directory layout

```
.
├── template/                   # Template project root.
│   ├── conf.d/                 # Project config file directory.
│   ├── public/                 # Public resources for Web GUI.
│   │   ├── js/                 # Scripts for browsers to use.
│   │   └── css/                # Style sheets.
│   ├── resources/              # Project service resource directory.
│   │   │── grpc/               # GRPC proto files.
│   │   └── i18n/               # Internationalization textual data.
│   ├── src/                    # Project source code directory.
│   │   ├── components/         # System core components.
│   │   ├── config/             # Configuration loader.
│   │   ├── constants/          # Shared project constants.
│   │   ├── errors/             # Shared error declaration.
│   │   ├── models/             # Database data structure model.
│   │   ├── services/           # Database access methods called by controllers.
│   │   ├── controllers/        # Methods to encapsulate business logic.
│   │   ├── routes/             # Express request routes.
│   │   │   └── middlewares/    # Middleware extensions for Express.
│   │   ├── utils/              # Shared project utility methods.
│   │   ├── plugins/            # Plugin
│   │   │   ├── cron_job/       # Cron jobs.
│   │   │   └── rpc/            # GRPC server services & client methods.
│   │   ├── types/              # Typescript type extensions.
│   │   └── app.ts              # Main app file.
│   ├── test/                   # Automated tests.
│   ├── temp/                   # Temporary directory.
│   ├── tools/                  # Project utilities for maintenance.
│   ├── views/                  # View template files for Express.
│   ├── config.schema.json      # Project configuration check schema for IDE integrate.
│   ├── pm2.json                # PM2 process manger config file for starting server.
│   ├── tsconfig.json           # Typescript options for template project.
│   ├── tslint.json             # Tslint config for Typescript linting.
│   ├── package.json            # Npm configuration for project with dependencies and tools.
│   ├── LICENSE                 # Project license template.
│   └── README.md               # Project readme template.
├── package.json                # Npm release opitons for template project.
├── module.conf.yml             # Template module description file for nstarter.
└── README.md
```

## Templating

For details to create `nstarter` template, please read more about [templating](../nstarter/doc/templating.md).


## License

[MIT](./LICENSE)

----

Made on 🌍 with 💓.
