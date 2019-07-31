[
  import_deps: [:ecto, :phoenix],
  inputs: [
    "*.{.ex,exs}",
    "mix.exs",
    "priv/*/seeds.exs",
    "{config,lib,test}/**/*.{ex,exs}",
    "apps/*/mix.exs",
    "apps/*/{config,lib,test,priv}/**/*.{ex,exs}"
  ],
  line_length: 80,
  locals_without_parens: [
    # elixir
    defstruct: :*,
    defmodule: :*,
    send: :*,
    spawn: :*,

    # ecto
    create: :*,
    drop: :*,
    remove: :*,
    field: :*,
    schema: :*,
    add: :*,
    rename: :*,

    # vex
    validates: :*,

    # plug
    plug: :*,

    # phoenix
    pipe_through: :*,
    forward: :*,
    get: :*,
    post: :*,
    patch: :*,
    put: :*,
    delete: :*,
    resources: :*,
    pipeline: :*,
    scope: :*,
    socket: :*,
    adapter: :*,
    arg: :*,
    resolve: :*,
    import_types: :*
  ]
]
