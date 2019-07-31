defmodule DankchatWeb.AuthView do
  use DankchatWeb, :view

  def render("index.json", %{user: user, jwt: jwt}) do
    %{
      status: :ok,
      token: jwt,
      username: user.username,
      message:
        "You are successfully logged in! Add this token to authorization header to make authorized requests."
    }
  end
end
