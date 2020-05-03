defmodule Dankchat.Repo.Migrations.AddCaseInsensitiveUsername do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION citext", "DROP EXTENSION citext"

    alter table(:users) do
      modify :username, :citext
    end
  end
end
