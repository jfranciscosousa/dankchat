defmodule DankchatWeb.UserLive.Index do
  use DankchatWeb, :live_view

  alias Dankchat.Accounts
  alias Dankchat.Accounts.User

  @impl true
  def mount(_params, _session, socket) do
    user = %User{}
    changeset = Accounts.change_user(user)

    {:ok,
     socket
     |> assign(:user, user)
     |> assign(:changeset, changeset)}
  end

  @impl true
  def handle_event("validate", %{"user" => user_params}, socket) do
    changeset =
      socket.assigns.user
      |> Accounts.change_user(user_params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  def handle_event("save", %{"user" => user_params}, socket) do
    save_user(socket, user_params)
  end

  defp save_user(socket, %{"password" => password, "username" => username}) do
    case Accounts.authenticate_or_create(username, password) do
      {:ok, _user} ->
        {:noreply,
         socket
         |> put_flash(:info, "User created successfully")
         |> push_redirect(to: "/chat")}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, changeset: changeset)}

      {:error} ->
        {:noreply, put_flash(socket, :error, "User combination not available")}
    end
  end
end
