defmodule Dankchat.Presence do
  use Phoenix.Presence,
    otp_app: :my_app,
    pubsub_server: Dankchat.PubSub
end
