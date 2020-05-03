defmodule Dankchat.ChatTest do
  use Dankchat.DataCase

  import Dankchat.Factory
  alias Dankchat.Chat

  describe "messages" do
    alias Dankchat.Chat.Message

    test "list_messages/0 returns all messages" do
      messages = insert_list(3, :message)

      assert Chat.list_messages()
             |> Enum.map(fn message -> Map.delete(message, :user) end) ==
               messages
               |> Enum.map(fn message -> Map.delete(message, :user) end)
    end

    test "get_message!/1 returns the message with given id" do
      message = insert(:message)

      returned_message = Chat.get_message!(message.id)

      assert message.body == returned_message.body
      assert message.user_id == returned_message.user_id
    end

    test "create_message/1 with valid data creates a message" do
      message_params = params_with_assocs(:message)

      assert {:ok, %Message{} = message} = Chat.create_message(message_params)

      assert message.body == message_params.body
      assert message.user_id == message_params.user_id
    end

    test "create_message/1 with invalid data returns error changeset" do
      message_params = params_with_assocs(:message, body: nil)

      assert {:error, %Ecto.Changeset{}} = Chat.create_message(message_params)
    end

    test "update_message/2 with valid data updates the message" do
      message = insert(:message)
      message_params = params_with_assocs(:message)

      assert {:ok, %Message{} = message} =
               Chat.update_message(message, message_params)

      assert message.body == message_params.body
      assert message.user_id == message_params.user_id
    end

    test "update_message/2 with invalid data returns error changeset" do
      message = insert(:message)
      message_params = %{body: nil}

      assert {:error, %Ecto.Changeset{}} =
               Chat.update_message(message, message_params)

      returned_message = Chat.get_message!(message.id)

      assert message.body == returned_message.body
      assert message.user_id == returned_message.user_id
    end

    test "delete_message/1 deletes the message" do
      message = insert(:message)

      assert {:ok, %Message{}} = Chat.delete_message(message)
      assert_raise Ecto.NoResultsError, fn -> Chat.get_message!(message.id) end
    end

    test "change_message/1 returns a message changeset" do
      message = insert(:message)

      assert %Ecto.Changeset{} = Chat.change_message(message)
    end
  end
end
