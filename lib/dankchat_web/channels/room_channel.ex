defmodule DankchatWeb.RoomChannel do
  use Phoenix.Channel
  alias DankchatWeb.RoomChannelMonitor

  def join("room:lobby", _message, socket) do
    current_user = Guardian.Phoenix.Socket.current_resource(socket).username
    users = RoomChannelMonitor.user_joined(current_user)

    send self(), {:after_join, users}

    {:ok, socket}
  end

  def terminate(_reason, socket) do
    current_user = Guardian.Phoenix.Socket.current_resource(socket).username
    users = RoomChannelMonitor.user_left(current_user)

    lobby_update(socket, users)

    :ok
  end

  def handle_info({:after_join, users}, socket) do
    lobby_update(socket, users)

    {:noreply, socket}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    current_user = Guardian.Phoenix.Socket.current_resource(socket)

    message = Dankchat.Chat.create_message(%{body: body, user_id: current_user.id})

    broadcast! socket, "new_msg", message

    {:noreply, socket}
  end

  defp lobby_update(socket, users) do
    broadcast! socket, "lobby_update", %{ users: MapSet.to_list(users), messages: Dankchat.Chat.list_messages }
  end
end