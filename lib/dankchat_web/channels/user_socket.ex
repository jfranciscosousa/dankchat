defmodule DankchatWeb.UserSocket do
  use Phoenix.Socket

  channel("room:*", DankchatWeb.RoomChannel)

  transport(:websocket, Phoenix.Transports.WebSocket, timeout: 45_000)

  def connect(%{"token" => token}, socket) do
    case Guardian.Phoenix.Socket.authenticate(socket, Dankchat.Auth.Guardian, token) do
      {:ok, authed_socket} ->
        {:ok, authed_socket}

      {:error, _} ->
        :error
    end
  end

  def connect(_params, _socket) do
    :error
  end

  def id(_socket), do: nil
end
