defmodule Dankchat.Repo do
  use Ecto.Repo,
    otp_app: :dankchat,
    adapter: Ecto.Adapters.Postgres
end
