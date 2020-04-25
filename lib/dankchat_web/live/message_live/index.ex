defmodule DankchatWeb.MessageLive.Index do
  use DankchatWeb, :live_view

  alias Dankchat.Chat

  @topic "chat"

  @impl true
  def mount(_params, _session, socket) do
    Phoenix.PubSub.subscribe(Dankchat.PubSub, @topic)

    {:ok,
     socket
     |> assign(:current_user, socket.id)
     |> assign(:messages, Chat.list_messages())}
  end

  @impl true
  def handle_info(%{event: "new_message", payload: message}, socket) do
    new_messages = Enum.concat(socket.assigns.messages, [message])

    {:noreply, assign(socket, :messages, new_messages)}
  end
end
