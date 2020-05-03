defmodule DankchatWeb.AuthControllerTest do
  use DankchatWeb.ConnCase

  alias Dankchat.Accounts

  @create_attrs %{password: "some password", username: "some username"}
  @invalid_attrs %{password: nil, username: nil}

  def fixture(:user) do
    {:ok, user} = Accounts.create_user(@create_attrs)
    user
  end

  describe "auth #new" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.auth_path(conn, :new))
      assert html_response(conn, 200) =~ "New User"
    end
  end

  describe "auth #create" do
    test "redirects to show when user created", %{conn: conn} do
      conn = post(conn, Routes.auth_path(conn, :create), user: @create_attrs)

      assert redirected_to(conn) == Routes.chat_index_path(conn, :index)
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.auth_path(conn, :create), user: @invalid_attrs)
      assert html_response(conn, 200) =~ "New User"
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
