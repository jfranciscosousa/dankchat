defmodule DankchatWeb.AuthControllerTest do
  use DankchatWeb.ConnCase

  alias Dankchat.Accounts

  @create_attrs %{username: "some username", password: "some password"}
  @invalid_attrs %{username: nil, password: nil}

  def fixture(:user) do
    {:ok, user} = Accounts.create_user(@create_attrs)
    user
  end

  describe "auth #new" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.auth_path(conn, :new))

      assert html_response(conn, 200) =~ "Username"
      assert html_response(conn, 200) =~ "Password"
    end
  end

  describe "auth #create" do
    test "redirects to chat when user created", %{conn: conn} do
      conn = post(conn, Routes.auth_path(conn, :create), user: @create_attrs)

      assert redirected_to(conn) == Routes.chat_index_path(conn, :index)
    end

    test "redirects to chat when user logged in succesfully", %{conn: conn} do
      create_user("")
      conn = post(conn, Routes.auth_path(conn, :create), user: @create_attrs)

      assert redirected_to(conn) == Routes.chat_index_path(conn, :index)
    end

    test "renders errors when login is wrong", %{conn: conn} do
      create_user("")
      conn = post(conn, Routes.auth_path(conn, :create), user:  %{username: @create_attrs.username, password: "wrong password"})

      assert html_response(conn, 200) =~ "User combination not available"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.auth_path(conn, :create), user: @invalid_attrs)

      assert html_response(conn, 200) =~ "can&#39;t be blank"
    end
  end

  describe "delete user" do
    setup [:create_user]

    test "deletes chosen user", %{conn: conn} do
      conn = delete(conn, Routes.auth_path(conn, :delete))

      assert redirected_to(conn) == Routes.auth_path(conn, :new)
      refute get_session(conn, :current_user_id)
    end
  end

  defp create_user(_) do
    user = fixture(:user)
    %{user: user}
  end
end
