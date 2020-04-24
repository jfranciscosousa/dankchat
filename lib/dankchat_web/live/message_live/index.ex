defmodule DankchatWeb.MessageLive.Index do
  use DankchatWeb, :live_view

  alias Dankchat.Chat
  alias Dankchat.Chat.Message
  alias DankchatWeb.MessageLive

  @topic "chat"

  @impl true
  def mount(_params, _session, socket) do
    Phoenix.PubSub.subscribe(Dankchat.PubSub, @topic)

    {:ok, assign(socket, :messages, fetch_messages())}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Listing Messages")
    |> assign(:message, %Message{})
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    message = Chat.get_message!(id)
    {:ok, _} = Chat.delete_message(message)

    {:noreply, assign(socket, :messages, fetch_messages())}
  end

  @impl true
  def handle_info(%{event: "new_message", payload: message}, socket) do
    new_messages = Enum.concat(socket.assigns.messages, [message])

    {:noreply, assign(socket, :messages, new_messages)}
  end

  defp fetch_messages do
    Chat.list_messages()
  end
end
