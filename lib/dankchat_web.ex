defmodule DankchatWeb do
  def controller do
    quote do
      use Phoenix.Controller, namespace: DankchatWeb
      import Plug.Conn
      import DankchatWeb.Router.Helpers
      import DankchatWeb.Gettext
    end
  end

  def view do
    quote do
      use Phoenix.View, root: "lib/dankchat_web/templates",
                        namespace: DankchatWeb

      import Phoenix.Controller, only: [get_flash: 2, view_module: 1]

      use Phoenix.HTML

      import DankchatWeb.Router.Helpers
      import DankchatWeb.ErrorHelpers
      import DankchatWeb.Gettext
    end
  end

  def router do
    quote do
      use Phoenix.Router
      import Plug.Conn
      import Phoenix.Controller
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
      import DankchatWeb.Gettext
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
