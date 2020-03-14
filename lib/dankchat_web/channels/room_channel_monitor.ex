defmodule DankchatWeb.RoomChannelMonitor do
  use GenServer

  def init(init_arg) do
    {:ok, init_arg}
  end

  def start_link do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def start do
    GenServer.cast(__MODULE__, %{})
  end

  def user_joined(username) do
    GenServer.call(__MODULE__, {:user_joined, username})
  end

  def users_in_channel do
    GenServer.call(__MODULE__, {:users_in_channel})
  end

  def user_left(username) do
    GenServer.call(__MODULE__, {:user_left, username})
  end

  def handle_call({:user_joined, username}, _from, state) do
    new_state =
      case Map.get(state, username) do
        nil ->
          Map.put(state, username, 1)

        instances ->
          Map.put(state, username, instances + 1)
      end

    {:reply, new_state, new_state}
  end

  def handle_call({:users_in_channel}, _from, state) do
    {:reply, state, state}
  end

  def handle_call({:user_left, username}, from, state) do
    new_state =
      case Map.get(state, username) do
        nil ->
          state

        instances ->
          delete(state, username, instances)
      end

    {:reply, new_state, new_state}
  end

  defp delete(state, username, 1) do
    Map.delete(state, username)
  end

  defp delete(state, username, instances) do
    Map.put(state, username, instances - 1)
  end
end
