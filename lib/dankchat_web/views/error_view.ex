defmodule DankchatWeb.ErrorView do
  use DankchatWeb, :view

  def template_not_found(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end

  def render("error.json", %{message: message}) do
    %{
      status: :error,
      message: message
    }
  end
end
