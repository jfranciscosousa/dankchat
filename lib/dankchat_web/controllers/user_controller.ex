defmodule DankchatWeb.UserController do
  use DankchatWeb, :controller

  alias Dankchat.Accounts
  alias Dankchat.Accounts.User
  alias DankchatWeb.ChatLive
  alias Phoenix.LiveView.Controller

  def new(conn, _params) do
    changeset = Accounts.change_user(%User{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{
        "user" =>
          %{"password" => password, "username" => username} = user_params
      }) do
    case Accounts.authenticate_or_create(username, password) do
      {:ok, user} ->
        conn
        |> put_session(:current_user_id, user.id)
        |> redirect(to: Routes.chat_index_path(conn, :index))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)

      {:error} ->
        {:noreply, put_flash(conn, :error, "User combination not available")}
    end
  end
end
