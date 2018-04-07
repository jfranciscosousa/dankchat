defmodule DankchatWeb.RoomChannelMonitor do
  use GenServer

  def start_link() do
   GenServer.start_link(__MODULE__, MapSet.new, name: __MODULE__)
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
    new_state = case MapSet.member?(state, username) do
      false -> MapSet.put(state, username)
      true ->
    end

    {:reply, new_state, new_state}
  end

  def handle_call({:users_in_channel}, _from, state) do
    {:reply, state, state}
  end

  def handle_call({:user_left, username}, _from, state) do
    new_state = MapSet.delete(state, username)

    {:reply, new_state, new_state }
  end
end
