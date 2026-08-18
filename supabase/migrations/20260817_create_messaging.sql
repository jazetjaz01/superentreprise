-- Messagerie texte entre acheteurs et vendeurs, rattachée à une annonce.
-- Un acheteur n'a qu'une seule conversation par annonce (pas un nouveau
-- fil à chaque message).

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  annonce_id uuid not null references annonces(id) on delete cascade,
  buyer_id uuid not null references profiles(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (annonce_id, buyer_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists conversations_buyer_id_idx on conversations (buyer_id);
create index if not exists conversations_seller_id_idx on conversations (seller_id);
create index if not exists messages_conversation_id_created_at_idx
  on messages (conversation_id, created_at);

alter table conversations enable row level security;
alter table messages enable row level security;

create policy "Participants peuvent voir leurs conversations"
  on conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Un acheteur peut démarrer une conversation"
  on conversations for insert
  with check (auth.uid() = buyer_id);

create policy "Participants peuvent voir les messages de leurs conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "Participants peuvent envoyer des messages"
  on messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "Un participant peut marquer les messages reçus comme lus"
  on messages for update
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );
