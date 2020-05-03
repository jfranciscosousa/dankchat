defmodule Dankchat.AccountsTest do
  use Dankchat.DataCase

  alias Dankchat.AES
  alias Dankchat.Accounts

  describe "users" do
    alias Dankchat.Accounts.User

    @valid_attrs %{password: "some password", username: "some username"}
    @update_attrs %{
      password: "some updated password",
      username: "some updated username"
    }
    @invalid_attrs %{password: nil, username: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Accounts.create_user()

      Map.put(user, :password, nil)
    end

    test "list_users/0 returns all users" do
      user = user_fixture()

      assert Accounts.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()

      assert Accounts.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = Accounts.create_user(@valid_attrs)

      assert user.username == @valid_attrs.username
      assert AES.decrypt(user.encrypted_password) == @valid_attrs.password
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Accounts.create_user(@invalid_attrs)
    end

    test "authenticate_or_create/2 creates a user if it does not exist" do
      assert {:ok, %User{} = user} = Accounts.authenticate_or_create(@valid_attrs.username, @valid_attrs.password)

      assert user.username == @valid_attrs.username
      assert AES.decrypt(user.encrypted_password) == @valid_attrs.password
    end

    test "authenticate_or_create/2 if the user exists, authenticates with a correct password" do
      Accounts.authenticate_or_create(@valid_attrs.username, @valid_attrs.password)
      assert {:ok, %User{} = user} = Accounts.authenticate_or_create(@valid_attrs.username, @valid_attrs.password)

      assert user.username == @valid_attrs.username
      assert AES.decrypt(user.encrypted_password) == @valid_attrs.password
    end

    test "authenticate_or_create/2 if the user exists it returns nil with a wrong password" do
      Accounts.authenticate_or_create(@valid_attrs.username, @valid_attrs.password)
      assert {:error} = Accounts.authenticate_or_create(@valid_attrs.username, "wrong_password")
    end

    test "authenticate_or_create/2 with invalid data returns error changeset" do
      assert {:error,  %Ecto.Changeset{}} = Accounts.authenticate_or_create(@invalid_attrs.username, @invalid_attrs.password)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()

      assert {:ok, %User{} = user} = Accounts.update_user(user, @update_attrs)
      assert user.username == @update_attrs.username
      assert AES.decrypt(user.encrypted_password) == @update_attrs.password
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()

      assert {:error, %Ecto.Changeset{}} =
               Accounts.update_user(user, @invalid_attrs)
      assert Accounts.get_user!(user.id) == user
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()

      assert {:ok, %User{}} = Accounts.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Accounts.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Accounts.change_user(user)
    end
  end
end
