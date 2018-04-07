defmodule Dankchat.Chat do
  import Ecto.Query, warn: false
  alias Dankchat.Repo
  alias Dankchat.Chat.Message

  def list_messages do
    Repo.all(Message)
    |> Repo.preload(:user)
  end

  def get_message!(id), do: Repo.get!(Message, id)

  def create_message(attrs \\ %{}) do
    message = %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert!
    |> Repo.preload(:user)
  end

  def update_message(%Message{} = message, attrs) do
    message
    |> Message.changeset(attrs)
    |> Repo.update()
  end

  def delete_message(%Message{} = message) do
    Repo.delete(message)
  end

  def change_message(%Message{} = message) do
    Message.changeset(message, %{})
  end
end
