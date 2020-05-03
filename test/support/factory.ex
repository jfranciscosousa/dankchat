defmodule Dankchat.Factory do
  use ExMachina.Ecto, repo: Dankchat.Repo

  alias Dankchat.Accounts.User
  alias Dankchat.Chat.Message

  def user_factory do
    user = %User{}

    attrs = %{
      username: sequence(:username, &"user ##{&1}"),
      password: "user password"
    }

    struct(user, User.changeset(user, attrs).changes)
  end

  def message_factory do
    %Message{
      body: "message body",
      user: build(:user)
    }
  end
end
