defmodule Dankchat.AES do
  @aad "AES256GCM"
  @block_size 16

  def encrypt(plaintext) do
    iv = :crypto.strong_rand_bytes(16)
    key = get_encryption_key()

    {ciphertext, tag} =
      :crypto.crypto_one_time_aead(
        :aes_256_gcm,
        key,
        iv,
        to_string(plaintext),
        <<>>,
        true
      )

    iv <> tag <> ciphertext
  end

  def decrypt(ciphertext) do
    <<iv::binary-16, tag::binary-16, ciphertext::binary>> = ciphertext

    :crypto.crypto_one_time_aead(
      :aes_256_gcm,
      get_encryption_key(),
      iv,
      ciphertext,
      <<>>,
      tag,
      false
    )
  end

  defp get_encryption_key do
    unencoded_key =
      Application.get_env(:dankchat, Encryption.AES)[:encryption_key]

    :base64.decode(unencoded_key)
  end
end
