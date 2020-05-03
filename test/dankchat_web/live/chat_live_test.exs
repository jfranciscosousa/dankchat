defmodule DankchatWeb.MessageLiveTest do
  use DankchatWeb.ConnCase

  import Phoenix.LiveViewTest
  import Dankchat.Factory

  alias Dankchat.Chat

  describe "Chat" do
    test "redirects to login if current_user_id is not set", %{conn: conn} do
      redirect_url = Routes.auth_path(conn, :new)

      assert {:error, {:live_redirect, %{to: ^redirect_url} = _}} =
               live(conn, Routes.chat_path(conn, :index))
    end

    test "lists all messages", %{conn: conn} do
      user = insert(:user)
      messages = insert_list(3, :message, user: user)

      {:ok, _view, html} =
        conn
        |> init_test_session(current_user_id: user.id)
        |> live(Routes.chat_path(conn, :index))

      for message <- messages do
        assert html =~ message.body
      end
    end

    test "lists the users", %{conn: conn} do
      user = insert(:user)
      other_user = insert(:user)
      users = [user, other_user]

      build_conn()
      |> init_test_session(current_user_id: other_user.id)
      |> live(Routes.chat_path(conn, :index))

      {:ok, _view, html} =
        conn
        |> init_test_session(current_user_id: user.id)
        |> live(Routes.chat_path(conn, :index))

      for user <- users do
        assert html =~ user.username
      end
    end

    test "saves new message", %{conn: conn} do
      user = insert(:user)

      {:ok, view, _html} =
        conn
        |> init_test_session(current_user_id: user.id)
        |> live(Routes.chat_path(conn, :index))

      view
      |> form("#message-form", message: %{body: "meme"})
      |> render_submit()

      html = render(view)
      created_message = Chat.list_messages() |> List.last()

      assert html =~ created_message.body
      assert html =~ NaiveDateTime.to_string(created_message.inserted_at)
      assert created_message.user_id == user.id
    end
  end
end
