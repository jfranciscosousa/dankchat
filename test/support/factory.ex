defmodule Dankchat.Factory do
  use ExMachina.Ecto, repo: Dankchat.Repo

  alias Dankchat.Accounts.User
  alias Dankchat.Chat.Message

  def user_factory do
    %User{
      username: sequence(:username, &"user_#{&1}"),
      encrypted_password: Dankchat.AES.encrypt("foobar")
    }
  end

  def user_prams_factory do
    %{
      username: sequence(:username, &"user_prams_#{&1}"),
      password: "foobar"
    }
  end

  def message_factory do
    %Message{
      body: "message body",
      user: build(:user)
    }
  end
end
