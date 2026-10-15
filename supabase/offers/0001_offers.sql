-- Oferty dla klientów (strony /oferta/<slug>) w bazie workshift-crm.
-- Osobny schemat `offers`: Prisma CRM zarządza tylko `public`, więc nie widzi tych tabel.
-- Dostęp wyłącznie przez klucz secret (rola service_role) z funkcji Vercel w workshift-landing.
-- anon / authenticated: brak grantów, RLS włączone bez polityk (druga warstwa na wypadek pomyłki).
-- Stosowane przez Supabase MCP apply_migration (nazwa: offers_0001_init).

create schema if not exists offers;
revoke all on schema offers from public, anon, authenticated;
grant usage on schema offers to service_role;

create table offers.offer (
    id            uuid primary key default gen_random_uuid(),
    slug          text not null unique check (slug ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
    deal_id       text references public.deal(id) on delete set null,
    title         text not null,
    content       jsonb not null,
    status        text not null default 'draft' check (status in ('draft', 'active', 'revoked')),
    password_hash text,
    token_hash    text unique,
    access_epoch  integer not null default 0,
    expires_at    timestamptz,
    pdf_path      text,
    is_test       boolean not null default false,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);
create index offer_deal_id_idx on offers.offer (deal_id);

comment on column offers.offer.content is 'Ten sam kształt co api/_data/offers/<slug>.js w workshift-landing';
comment on column offers.offer.password_hash is 'scrypt$N$r$p$salt$hash; null = logowanie hasłem wyłączone';
comment on column offers.offer.token_hash is 'sha256 (hex) tokenu z linku ?k=; null = link wyłączony';
comment on column offers.offer.access_epoch is '+1 unieważnia wszystkie wydane cookie';

create table offers.offer_event (
    id          bigint generated always as identity primary key,
    offer_id    uuid not null references offers.offer(id) on delete cascade,
    kind        text not null check (kind in ('unlock_password', 'unlock_token', 'view', 'pdf')),
    occurred_at timestamptz not null default now(),
    ip_hash     text,
    country     text,
    user_agent  text
);
create index offer_event_offer_idx on offers.offer_event (offer_id, occurred_at desc);

create table offers.auth_failure (
    id          bigint generated always as identity primary key,
    slug        text not null,
    ip_hash     text not null,
    occurred_at timestamptz not null default now()
);
create index auth_failure_slug_idx on offers.auth_failure (slug, occurred_at desc);

alter table offers.offer        enable row level security;
alter table offers.offer_event  enable row level security;
alter table offers.auth_failure enable row level security;

create function offers.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
    new.updated_at := now();
    return new;
end;
$$;
create trigger offer_touch_updated_at before update on offers.offer
    for each row execute function offers.touch_updated_at();

-- Rate limit hasła. 'locked' gdy w 15 min >= 8 porażek z jednego ip_hash dla sluga
-- albo >= 40 porażek dla sluga łącznie. Przy okazji sprząta wpisy starsze niż 24 h.
create function offers.auth_gate(p_slug text, p_ip_hash text) returns text
language plpgsql set search_path = '' as $$
declare
    per_ip   integer;
    per_slug integer;
begin
    delete from offers.auth_failure where occurred_at < now() - interval '24 hours';
    select count(*) filter (where ip_hash = p_ip_hash), count(*)
      into per_ip, per_slug
      from offers.auth_failure
     where slug = p_slug and occurred_at > now() - interval '15 minutes';
    if per_ip >= 8 or per_slug >= 40 then
        return 'locked';
    end if;
    return 'ok';
end;
$$;

create function offers.record_failure(p_slug text, p_ip_hash text) returns void
language sql set search_path = '' as $$
    insert into offers.auth_failure (slug, ip_hash) values (p_slug, p_ip_hash);
$$;

-- Licznik otwarć dla banera na stronie oferty.
create function offers.view_stats(p_offer_id uuid)
returns table (count bigint, first timestamptz, last timestamptz)
language sql stable set search_path = '' as $$
    select count(*), min(occurred_at), max(occurred_at)
      from offers.offer_event
     where offer_id = p_offer_id and kind = 'view';
$$;

revoke all on all tables in schema offers from public, anon, authenticated;
revoke all on all sequences in schema offers from public, anon, authenticated;
revoke all on all functions in schema offers from public, anon, authenticated;
grant select, insert, update, delete on all tables in schema offers to service_role;
grant usage, select on all sequences in schema offers to service_role;
grant execute on all functions in schema offers to service_role;

alter default privileges in schema offers revoke all on tables from public, anon, authenticated;
alter default privileges in schema offers revoke all on sequences from public, anon, authenticated;
alter default privileges in schema offers revoke all on functions from public, anon, authenticated;

-- Prywatny bucket na PDF ofert. Brak polityk na storage.objects dla tego bucketu,
-- więc pliki czyta tylko service_role; klient dostaje signed URL na 5 minut.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('offer-pdfs', 'offer-pdfs', false, 20971520, array['application/pdf'])
on conflict (id) do nothing;
