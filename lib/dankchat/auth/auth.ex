defmodule Dankchat.Auth do
  alias Comeonin.Bcrypt
  import Ecto.Query, warn: false
  alias Dankchat.Repo
  alias Dankchat.Auth.User

  def list_users do
    Repo.all(User)
  end

  def get_user!(id), do: Repo.get!(User, id)

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  def change_user(%User{} = user) do
    User.changeset(user, %{})
  end

  def authenticate_user(username, password) do
    query = from u in User, where: u.username == ^username
    Repo.one(query)
    |> check_password(username, password)
  end

  defp check_password(nil, username, password) do
    create_user(%{username: username, password: password})
  end

  defp check_password(user, _, password) do
    case Bcrypt.checkpw(password, user.password) do
      true -> {:ok, user}
      false -> {:error, "Incorrect username or password"}
    end
  end
end
