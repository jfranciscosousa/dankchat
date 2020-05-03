defmodule Dankchat.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Dankchat.AES

  schema "users" do
    field :password, :string, virtual: true
    field :username, :string
    field :encrypted_password, :binary

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :password])
    |> validate_required([:username, :password])
    |> unique_constraint(:username)
    |> encrypt_fields
  end

  defp encrypt_fields(changeset) do
    case changeset.valid? do
      true ->
        encrypted_password = changeset.changes |> Map.get(:password) |> AES.encrypt()

        changeset
        |> put_change(:encrypted_password, encrypted_password)

      _ ->
        changeset
    end
  end
end
