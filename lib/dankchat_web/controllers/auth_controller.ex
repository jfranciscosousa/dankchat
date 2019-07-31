defmodule DankchatWeb.AuthController do
  use DankchatWeb, :controller

  alias Dankchat.Auth
  alias Dankchat.Auth.Guardian

  def create(conn, %{
        "session" => %{"username" => username, "password" => password}
      }) do
    case Auth.authenticate_user(username, password) do
      {:ok, user} ->
        {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user)

        conn
        |> render("index.json", user: user, jwt: jwt)

      {:error, _reason} ->
        conn
        |> put_status(401)
        |> render(DankchatWeb.ErrorView, "error.json",
          message: "Could not login"
        )
    end
  end
end
