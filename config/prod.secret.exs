# In this file, we load production configuration and secrets
# from environment variables. You can also hardcode secrets,
# although such is generally not recommended and you have to
# remember to add this file to your .gitignore.
use Mix.Config

database_url =
  System.get_env("DATABASE_URL") ||
    raise """
    environment variable DATABASE_URL is missing.
    For example: ecto://USER:PASS@HOST/DATABASE
    """

config :dankchat, Dankchat.Repo,
  # ssl: true,
  url: database_url,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

config :dankchat, DankchatWeb.Endpoint,
  http: [
    port: String.to_integer(System.get_env("PORT") || "4000"),
    transport_options: [socket_opts: [:inet6]]
  ],
  secret_key_base: secret_key_base

encryption_key =
  System.get_env("ENCRYPTION_KEY") ||
    raise """
    environment variable ENCRYPTION_KEY is missing.
    You can generate one by running this on iex:
    :crypto.strong_rand_bytes(32) |> :base64.encode
    """

if String.length(encryption_key) != 44 do
  raise """
    ENCRYPTION_KEY must be exactly 44 characters long!
  """
end

config :dankchat, Encryption.AES, encryption_key: encryption_key
