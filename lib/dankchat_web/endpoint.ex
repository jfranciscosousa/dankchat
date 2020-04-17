defmodule DankchatWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :dankchat

  socket "/socket", DankchatWeb.UserSocket

  plug Plug.Static,
    at: "/",
    from: :dankchat,
    gzip: true,
    only: ~w(fonts images sounds js assets favicon.ico robots.txt)

  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Plug.Session,
    store: :cookie,
    key: "_dankchat_key",
    signing_salt: "dRUYi7Ks"

  plug DankchatWeb.Router

  def init(_key, config) do
    if config[:load_from_system_env] do
      port =
        System.get_env("PORT") ||
          raise "expected the PORT environment variable to be set"

      {:ok, Keyword.put(config, :http, [:inet6, port: port])}
    else
      {:ok, config}
    end
  end
end
