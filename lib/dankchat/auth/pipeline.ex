defmodule Dankchat.Auth.Pipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :auth_ex,
    error_handler: Dankchat.Auth.ErrorHandler,
    module: Dankchat.Auth.Guardian

  plug Guardian.Plug.VerifySession, claims: %{"typ" => "access"}
  plug Guardian.Plug.VerifyHeader, claims: %{"typ" => "access"}
  plug Guardian.Plug.LoadResource, allow_blank: true
end
