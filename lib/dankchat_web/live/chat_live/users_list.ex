defmodule DankchatWeb.ChatLive.UsersList do
  use DankchatWeb, :live_view

  import Ecto.Query
  alias Dankchat.Accounts
  alias Dankchat.Repo

  @topic "users"

  @impl true
  def mount(_params, %{"current_user" => current_user}, socket) do
    initial_user_ids = Dankchat.Presence.list(@topic) |> Map.keys()
    initial_users = list_users(initial_user_ids)

    Phoenix.PubSub.subscribe(Dankchat.PubSub, @topic)

    Dankchat.Presence.track(
      self(),
      @topic,
      current_user.id,
      %{}
    )

    {:ok,
     socket
     |> assign(:user_ids, initial_user_ids)
     |> assign(:users, initial_users)
     |> assign(:current_user, current_user)}
  end

  @impl true
  def handle_info(
        %{event: "presence_diff", payload: %{joins: joins, leaves: leaves}},
        socket
      ) do
    user_ids =
      MapSet.difference(
        MapSet.union(
          MapSet.new(socket.assigns.user_ids),
          MapSet.new(Map.keys(joins))
        ),
        MapSet.new(Map.keys(leaves))
      )
      |> MapSet.to_list()
      |> Enum.sort()

    users = list_users(user_ids)

    {:noreply, socket |> assign(:user_ids, user_ids) |> assign(:users, users)}
  end

  defp list_users(ids) do
    Repo.all(from(u in Accounts.User, where: u.id in ^ids))
  end
end
