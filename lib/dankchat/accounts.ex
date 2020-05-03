defmodule Dankchat.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Dankchat.AES
  alias Dankchat.Repo
  alias Dankchat.Accounts.User

  def list_users do
    Repo.all(User)
  end

  def get_user!(id), do: Repo.get!(User, id)

  def get_user(id), do: Repo.get(User, id)

  def create_user(attr) do
    %User{}
    |> User.changeset(attr)
    |> Repo.insert()
  end

  def authenticate_or_create(nil, password) do
    create_user(%{username: nil, password: password})
  end

  def authenticate_or_create(username, password) do
    case Repo.get_by(User, username: username) do
      nil ->
        create_user(%{username: username, password: password})

      user ->
        authenticate(user, password)
    end
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  defp authenticate(user, password) do
    if AES.decrypt(user.encrypted_password) == password do
      {:ok, user}
    else
      {:error}
    end
  end
end
