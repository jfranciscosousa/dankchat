defmodule DankchatWeb.ChatLive.Index do
  use DankchatWeb, :live_view

  alias Dankchat.Chat
  alias Dankchat.Accounts

  @topic "chat"

  @impl true
  def mount(_params, %{"current_user_id" => current_user_id} = session, socket) do
    case Accounts.get_user(current_user_id) do
      nil ->
        {:ok, push_redirect(socket, to: "/")}

      current_user ->
        Phoenix.PubSub.subscribe(Dankchat.PubSub, @topic)

        {:ok,
         socket
         |> assign(:current_user, current_user)
         |> assign(:messages, fetch_messages())}
    end
  end

  @impl true
  def mount(_params, _session, socket) do
    {:ok, push_redirect(socket, to: "/")}
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
