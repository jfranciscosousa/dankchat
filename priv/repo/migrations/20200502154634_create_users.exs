defmodule Dankchat.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :username, :string, null: false
      add :encrypted_password, :binary, null: false

      timestamps()
    end


    create unique_index(:users, :username)
  end
end
