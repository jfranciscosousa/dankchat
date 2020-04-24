defmodule DankchatWeb.MessageLive.UsersList do
  use DankchatWeb, :live_view

  @topic "users"

  @impl true
  def mount(_params, %{"current_user" => current_user}, socket) do
    initial_users = Dankchat.Presence.list(@topic) |> Map.keys()

    Phoenix.PubSub.subscribe(Dankchat.PubSub, @topic)

    Dankchat.Presence.track(
      self(),
      @topic,
      current_user,
      %{}
    )

    {:ok,
     socket
     |> assign(:users, initial_users)
     |> assign(:current_user, current_user)}
  end

  @impl true
  def handle_info(
        %{event: "presence_diff", payload: %{joins: joins, leaves: leaves}},
        socket
      ) do
    users =
      MapSet.difference(
        MapSet.union(
          MapSet.new(socket.assigns.users),
          MapSet.new(Map.keys(joins))
        ),
        MapSet.new(Map.keys(leaves))
      )
      |> MapSet.to_list()
      |> Enum.sort()

    {:noreply, assign(socket, :users, users)}
  end
end
