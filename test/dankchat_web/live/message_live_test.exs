defmodule DankchatWeb.MessageLiveTest do
  use DankchatWeb.ConnCase

  import Phoenix.LiveViewTest

  alias Dankchat.Chat

  defp fixture(:message) do
    {:ok, message} =
      Chat.create_message(%{body: "some body", user_id: "some user id"})

    message
  end

  defp create_message(_) do
    message = fixture(:message)

    %{message: message}
  end

  describe "Index" do
    setup [:create_message]

    test "lists all messages", %{conn: conn, message: message} do
      {:ok, _view, html} = live(conn, Routes.message_index_path(conn, :index))

      assert html =~ message.body
    end

    test "lists the users", %{conn: conn} do
      {:ok, view, html} = live(conn, Routes.message_index_path(conn, :index))

      assert html =~ view.id
    end

    test "saves new message", %{conn: conn} do
      {:ok, view, _html} = live(conn, Routes.message_index_path(conn, :index))

      view
      |> form("#message-form", message: %{body: "meme"})
      |> render_submit()

      html = render(view)
      created_message = List.last(Chat.list_messages())

      assert html =~ created_message.body
      assert html =~ NaiveDateTime.to_string(created_message.inserted_at)
      assert html =~ view.id
    end

    test "sets the user id of a message", %{conn: conn} do
      {:ok, view, _html} = live(conn, Routes.message_index_path(conn, :index))

      view
      |> form("#message-form", message: %{body: "meme"})
      |> render_submit()

      created_message = List.last(Chat.list_messages())

      assert created_message.user_id == view.id
    end
  end
end
