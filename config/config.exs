# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :dankchat,
  ecto_repos: [Dankchat.Repo]

# Configures the endpoint
config :dankchat, DankchatWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base:
    "iBNZvUHjGu8lFKjxXDJALsuJ/lp68th6YDoyi4UuzoyLr7tlQ9yN9k5IJpq7XVNN",
  render_errors: [
    view: DankchatWeb.ErrorView,
    accepts: ~w(html json),
    layout: false
  ],
  pubsub_server: Dankchat.PubSub,
  live_view: [signing_salt: "4lefBydh"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Encryption key for our custom module
config :dankchat, Encryption.AES,
  encryption_key: "AqHj+8P7jWKJ2vDekIO44Wr78Y7FC0SDTZPKEvi9aDY="

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
