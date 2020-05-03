defmodule DankchatWeb.ChatLive.FormComponent do
  use DankchatWeb, :live_component

  alias Dankchat.Chat

  @impl true
  def mount(socket) do
    {:ok, socket |> reset_message}
  end

  @impl true
  def update(assigns, socket) do
    {:ok, assign(socket, :current_user, assigns.current_user)}
  end

  @impl true
  def handle_event("change", %{"message" => message_params}, socket) do
    new_message_params =
      message_params |> Map.put("user_id", socket.assigns.current_user.id)

    changeset =
      socket.assigns.message
      |> Chat.change_message(new_message_params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  def handle_event("submit", %{"message" => message_params}, socket) do
    new_message_params =
      message_params |> Map.put("user_id", socket.assigns.current_user.username)

    case Chat.create_message(new_message_params) do
      {:ok, message} ->
        DankchatWeb.Endpoint.broadcast("chat", "new_message", message)

        {:noreply, socket |> reset_message}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end

  defp reset_message(socket) do
    message = %Chat.Message{}
    changeset = Chat.change_message(message)

    socket
    |> assign(:message, message)
    |> assign(:changeset, changeset)
  end
end
