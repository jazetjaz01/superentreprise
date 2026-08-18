-- Permettre à l'auteur d'un message de le supprimer.

create policy "Un participant peut supprimer ses propres messages"
  on messages for delete
  using (sender_id = auth.uid());
