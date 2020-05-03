defmodule Dankchat.Chat.Message do
  use Ecto.Schema
  import Ecto.Changeset
  alias Dankchat.Accounts.User

  schema "messages" do
    field :body, :string
    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(message, attrs) do
    message
    |> cast(attrs, [:body, :user_id])
    |> validate_required([:body, :user_id])
    |> foreign_key_constraint(:user_id)
  end
end
