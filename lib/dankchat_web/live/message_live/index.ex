defmodule DankchatWeb.MessageLive.Index do
  use DankchatWeb, :live_view

  alias Dankchat.Chat
  alias Dankchat.Chat.Message

  @topic "chat"

  @impl true
  def mount(_params, _session, socket) do
    Phoenix.PubSub.subscribe(Dankchat.PubSub, @topic)

    {:ok, assign(socket, :messages, fetch_messages())}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Message")
    |> assign(:message, Chat.get_message!(id))
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New Message")
    |> assign(:message, %Message{})
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

  def handle_info(%{event: "new_message", payload: message}, socket) do
    new_messages = Enum.concat(socket.assigns.messages, [message])

    {:noreply, assign(socket, :messages, new_messages)}
  end

  defp fetch_messages do
    Chat.list_messages()
  end
end
