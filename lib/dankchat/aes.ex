defmodule Dankchat.AES do
  @aad "AES256GCM"

  def encrypt(plaintext) do
    iv = :crypto.strong_rand_bytes(16)
    key = get_encryption_key()

    {ciphertext, tag} =
      :crypto.block_encrypt(
        :aes_256_gcm,
        key,
        iv,
        {@aad, to_string(plaintext), 16}
      )

    iv <> tag <> ciphertext
  end

  def decrypt(ciphertext) do
    <<iv::binary-16, tag::binary-16, ciphertext::binary>> = ciphertext

    :crypto.block_decrypt(
      :aes_256_gcm,
      get_encryption_key(),
      iv,
      {@aad, ciphertext, tag}
    )
  end

  defp get_encryption_key do
    unencoded_key =
      Application.get_env(:dankchat, Encryption.AES)[:encryption_key]

    :base64.decode(unencoded_key)
  end
end
