defmodule DankchatWeb.MessageLiveTest do
  use DankchatWeb.ConnCase

  import Phoenix.LiveViewTest

  alias Dankchat.Chat

  @create_attrs %{body: "some body"}
  @invalid_attrs %{body: nil}

  defp fixture(:message) do
    {:ok, message} = Chat.create_message(@create_attrs)
    message
  end

  defp create_message(_) do
    message = fixture(:message)
    %{message: message}
  end

  describe "Index" do
    setup [:create_message]

    test "lists all messages", %{conn: conn, message: message} do
      {:ok, _index_live, html} =
        live(conn, Routes.message_index_path(conn, :index))

      assert html =~ "Listing Messages"
      assert html =~ message.body
    end

    test "saves new message", %{conn: conn} do
      {:ok, index_live, _html} =
        live(conn, Routes.message_index_path(conn, :index))

      assert index_live
             |> form("#message-form", message: @invalid_attrs)
             |> render_change() =~ "can&apos;t be blank"

      html =
        index_live
        |> form("#message-form", message: @create_attrs)
        |> render_submit()
      created_message = List.last(Chat.list_messages())

      assert html =~ created_message.body
      assert html =~ NaiveDateTime.to_string(created_message.inserted_at)
    end
  end
end
