defmodule DankchatWeb.AuthControllerTest do
  use DankchatWeb.ConnCase

  import Dankchat.Factory

  describe "auth #new" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.auth_path(conn, :new))

      assert html_response(conn, 200) =~ "Username"
      assert html_response(conn, 200) =~ "Password"
    end
  end

  describe "auth #create" do
    test "redirects to chat when user created", %{conn: conn} do
      user_params = params_for(:user_prams)
      conn = post(conn, Routes.auth_path(conn, :create), user: user_params)

      assert redirected_to(conn) == Routes.chat_path(conn, :index)
    end

    test "redirects to chat when user logged in succesfully", %{conn: conn} do
      user = insert(:user)

      conn =
        post(conn, Routes.auth_path(conn, :create),
          user: %{username: user.username, password: "foobar"}
        )

      assert redirected_to(conn) == Routes.chat_path(conn, :index)
    end

    test "renders errors when login is wrong", %{conn: conn} do
      user = insert(:user)

      conn =
        post(conn, Routes.auth_path(conn, :create),
          user: %{username: user.username, password: "wrong password"}
        )

      assert html_response(conn, 200) =~ "User combination not available"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn =
        post(conn, Routes.auth_path(conn, :create),
          user: %{username: nil, password: nil}
        )

      assert html_response(conn, 200) =~ "can&#39;t be blank"
    end
  end

  describe "delete user" do
    test "deletes chosen user", %{conn: conn} do
      user = insert(:user)

      conn =
        conn
        |> init_test_session(current_user_id: user.id)
        |> delete(Routes.auth_path(conn, :delete))

      assert redirected_to(conn) == Routes.auth_path(conn, :new)
      refute get_session(conn, :current_user_id)
    end
  end
end
