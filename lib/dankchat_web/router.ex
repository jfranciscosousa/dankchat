defmodule DankchatWeb.Router do
  use DankchatWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  pipeline :auth do
    plug(Dankchat.Auth.Pipeline)
  end

  pipeline :ensure_auth do
    plug(Guardian.Plug.EnsureAuthenticated)
  end

  scope "/api", DankchatWeb do
    pipe_through([:api, :auth])

    post("/auth", AuthController, :create)
  end

  scope "/", DankchatWeb do
    pipe_through(:browser)

    get("/", PageController, :index)
  end
end
