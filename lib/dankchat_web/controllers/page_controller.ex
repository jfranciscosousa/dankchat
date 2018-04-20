defmodule DankchatWeb.PageController do
  use DankchatWeb, :controller

  def index(conn, _) do
    conn
    |> render("index.html")
  end
end
