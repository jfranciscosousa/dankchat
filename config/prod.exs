use Mix.Config

config :dankchat, DankchatWeb.Endpoint,
  url: [host: "dank-chat.herokuapp.com", port: 80],
  cache_static_manifest: "priv/static/cache_manifest.json"

config :logger, level: :info

import_config "prod.secret.exs"
