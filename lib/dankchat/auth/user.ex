defmodule Dankchat.Auth.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Comeonin.Bcrypt

  @derive {Poison.Encoder, only: [:username]}
  schema "users" do
    field :username, :string
    field :password, :string
    has_many(:messages, Dankchat.Chat.Message)

    timestamps()
  end

  def changeset(%Dankchat.Auth.User{} = user, attrs) do
    user
    |> cast(attrs, [:username, :password])
    |> validate_required([:username, :password])
    |> put_pass_hash()
  end

  defp put_pass_hash(
         %Ecto.Changeset{valid?: true, changes: %{password: password}} =
           changeset
       ) do
    change(changeset, password: Bcrypt.hashpwsalt(password))
  end

  defp put_pass_hash(changeset), do: changeset
end
