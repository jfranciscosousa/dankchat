defmodule DankchatWeb.AuthController do
  use DankchatWeb, :controller

  alias Dankchat.Accounts
  alias Dankchat.Accounts.User

  def new(conn, _params) do
    changeset = Accounts.change_user(%User{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{
        "user" => %{"password" => password, "username" => username}
      }) do
    case Accounts.authenticate_or_create(username, password) do
      {:ok, user} ->
        conn
        |> put_session(:current_user_id, user.id)
        |> redirect(to: Routes.chat_index_path(conn, :index))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)

      {:error} ->
        changeset = Accounts.change_user(%User{})

        conn
        |> put_flash(:error, "User combination not available")
        |> render("new.html", changeset: changeset)
    end
  end

  def delete(conn, _params) do
    conn
    |> delete_session(:current_user_id)
    |> redirect(to: Routes.auth_path(conn, :new))
  end
end
