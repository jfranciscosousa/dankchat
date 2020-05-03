defmodule DankchatWeb.MessageLiveTest do
  use DankchatWeb.ConnCase

  import Phoenix.LiveViewTest

  alias Dankchat.Chat
  alias Dankchat.Accounts

  defp create_user(_) do
    user = fixture(:user)

    %{user: user}
  end

  defp create_message(_) do
    message = fixture(:message)

    %{message: message}
  end

  defp fixture(:user) do
    {:ok, user} =
      Accounts.create_user(%{username: "username", password: "password"})

    user
  end

  defp fixture(:message) do
    {:ok, message} =
      Chat.create_message(%{body: "some body", user_id: "some user id"})

    message
  end

  describe "Index" do
    setup [:create_message, :create_user]

    test "redirects to login if current_user_id is not set", %{conn: conn} do
      redirect_url = Routes.auth_path(conn, :new)

      assert {:error, {:live_redirect, %{to: ^redirect_url} = _}} =
               live(conn, Routes.chat_index_path(conn, :index))
    end

    test "lists all messages", %{conn: conn, message: message, user: user} do
      {:ok, _view, html} =
        conn
        |> init_test_session(current_user_id: user.id)
        |> live(Routes.chat_index_path(conn, :index))

      assert html =~ message.body
    end

    test "lists the users", %{conn: conn, user: user} do
      {:ok, _view, html} =
        conn
        |> init_test_session(current_user_id: user.id)
        |> live(Routes.chat_index_path(conn, :index))

      assert html =~ user.username
    end

    test "saves new message", %{conn: conn, user: user} do
      {:ok, view, _html} =
        conn
        |> init_test_session(current_user_id: user.id)
        |> live(Routes.chat_index_path(conn, :index))

      view
      |> form("#message-form", message: %{body: "meme"})
      |> render_submit()

      html = render(view)
      created_message = List.last(Chat.list_messages())

      assert html =~ created_message.body
      assert html =~ NaiveDateTime.to_string(created_message.inserted_at)
    end

    test "sets the user id of a message", %{conn: conn, user: user} do
      {:ok, view, _html} =
        conn
        |> init_test_session(current_user_id: user.id)
        |> live(Routes.chat_index_path(conn, :index))

      view
      |> form("#message-form", message: %{body: "meme"})
      |> render_submit()

      created_message = List.last(Chat.list_messages())

      assert created_message.user_id == user.username
    end
  end
end
