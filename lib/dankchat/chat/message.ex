defmodule Dankchat.Chat.Message do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Poison.Encoder, only: [:id, :body, :user, :inserted_at]}
  schema "messages" do
    field :body, :string
    belongs_to :user, Dankchat.Auth.User

    timestamps()
  end

  def changeset(message, attrs) do
    message
    |> cast(attrs, [:body, :user_id])
    |> validate_required([:body, :user_id])
  end
end
