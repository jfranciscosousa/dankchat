defmodule Dankchat.Chat do
  @moduledoc """
  The Chat context.
  """

  import Ecto.Query, warn: false

  alias Dankchat.Chat.Message
  alias Dankchat.Repo

  def list_messages do
    Repo.all(Message) |> Repo.preload(:user)
  end

  def get_message!(id), do: Repo.get!(Message, id)

  def create_message(attrs \\ %{}) do
    case %Message{}
         |> Message.changeset(attrs)
         |> Repo.insert() do
      {:ok, message} -> {:ok, message |> Repo.preload(:user)}
      {:error, changeset} -> {:error, changeset}
    end
  end

  def update_message(%Message{} = message, attrs) do
    message
    |> Message.changeset(attrs)
    |> Repo.update()
  end

  def delete_message(%Message{} = message) do
    Repo.delete(message)
  end

  def change_message(%Message{} = message, attrs \\ %{}) do
    Message.changeset(message, attrs)
  end
end
