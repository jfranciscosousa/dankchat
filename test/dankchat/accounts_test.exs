defmodule Dankchat.AccountsTest do
  use Dankchat.DataCase

  import Dankchat.Factory
  alias Dankchat.AES
  alias Dankchat.Accounts

  describe "users" do
    alias Dankchat.Accounts.User

    test "list_users/0 returns all users" do
      users = insert_list(3, :user)

      assert Accounts.list_users() == users
    end

    test "get_user!/1 returns the user with given id" do
      user = insert(:user)

      assert Accounts.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      params = params_for(:user_prams)

      assert {:ok, %User{} = user} = Accounts.create_user(params)

      assert user.username == params.username
      assert AES.decrypt(user.encrypted_password) == params.password
    end

    test "create_user/1 with invalid data returns error changeset" do
      params = params_for(:user_prams, username: "bad name with spaces")

      assert {:error, %Ecto.Changeset{}} = Accounts.create_user(params)
    end

    test "authenticate_or_create/2 creates a user if it does not exist" do
      %{username: username, password: password} = params_for(:user_prams)

      assert {:ok, %User{} = user} =
               Accounts.authenticate_or_create(username, password)

      assert user.username == username
      assert AES.decrypt(user.encrypted_password) == password
    end

    test "authenticate_or_create/2 if the user exists, authenticates with a correct password" do
      %{username: username, password: password} = params_for(:user_prams)
      Accounts.authenticate_or_create(username,password)

      assert {:ok, %User{} = user} = Accounts.authenticate_or_create(username,password)

      assert user.username == username
      assert AES.decrypt(user.encrypted_password) == password
    end

    test "authenticate_or_create/2 if the user exists it returns nil with a wrong password" do
      %{username: username, password: password} = params_for(:user_prams)
      Accounts.authenticate_or_create(username,password)

      assert {:error} = Accounts.authenticate_or_create(username,"wrong_password")
    end

    test "authenticate_or_create/2 with invalid data returns error changeset" do
      %{username: username, password: password} = params_for(:user_prams, username: "bad name with spaces")

      assert {:error, %Ecto.Changeset{}} = Accounts.authenticate_or_create(username,password)
    end

    test "update_user/2 with valid data updates the user" do
      user = insert(:user)
      params = params_for(:user_prams)

      assert {:ok, %User{} = user} = Accounts.update_user(user, params)

      assert user.username == params.username
      assert AES.decrypt(user.encrypted_password) == params.password
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = insert(:user)
      params = params_for(:user_prams, username: "bad name with spaces")

      assert {:error, %Ecto.Changeset{}} = Accounts.update_user(user, params)

      assert Accounts.get_user!(user.id) == user
    end

    test "delete_user/1 deletes the user" do
      user = insert(:user)

      assert {:ok, %User{}} = Accounts.delete_user(user)

      assert_raise Ecto.NoResultsError, fn -> Accounts.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = insert(:user)

      assert %Ecto.Changeset{} = Accounts.change_user(user)
    end
  end
end
