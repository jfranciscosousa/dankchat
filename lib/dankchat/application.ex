defmodule Dankchat.Application do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec

    children = [
      supervisor(Dankchat.Repo, []),
      supervisor(DankchatWeb.Endpoint, []),
      worker(DankchatWeb.RoomChannelMonitor, [])
    ]

    opts = [strategy: :one_for_one, name: Dankchat.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    DankchatWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
