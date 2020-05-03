defmodule Dankchat.Presence do
  use Phoenix.Presence,
    otp_app: :dankchat,
    pubsub_server: Dankchat.PubSub
end
