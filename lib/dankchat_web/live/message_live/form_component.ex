defmodule DankchatWeb.MessageLive.FormComponent do
  use DankchatWeb, :live_component

  alias Dankchat.Chat

  @impl true
  def update(assigns, socket) do
    {:ok, socket |> reset_message}
  end

  @impl true
  def handle_event("validate", %{"message" => message_params}, socket) do
    changeset =
      socket.assigns.message
      |> Chat.change_message(message_params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  def handle_event("save", %{"message" => message_params}, socket) do
    case Chat.create_message(message_params) do
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
