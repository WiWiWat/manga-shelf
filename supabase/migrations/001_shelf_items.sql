-- =====================================================================
-- 001_shelf_items.sql — ตารางชั้นหนังสือ + กฎสิทธิ์
-- วิธีใช้: Supabase → SQL Editor → New query → วางทั้งไฟล์ → Run (รันครั้งเดียว)
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1) ตาราง shelf_items: มังงะ 1 เรื่องบนชั้นของผู้ใช้ 1 คน = 1 แถว
-- ---------------------------------------------------------------------
create table public.shelf_items (
  id             bigint generated always as identity primary key,
  -- เจ้าของชั้น: ผูกกับผู้ใช้ในระบบล็อกอินของ Supabase (auth.users)
  -- ถ้าลบบัญชีผู้ใช้ ชั้นหนังสือของคนนั้นจะถูกลบตามไปด้วย (on delete cascade)
  user_id        uuid not null default auth.uid()
                   references auth.users (id) on delete cascade,
  manga_id       integer not null,                     -- id มังงะบน AniList
  -- เก็บชื่อ/ปก/จำนวนตอนไว้ด้วย หน้าชั้นหนังสือจะได้ไม่ต้องเรียก AniList ทีละเรื่อง
  title          text    not null check (length(trim(title)) > 0),
  cover_url      text,
  total_chapters integer check (total_chapters > 0),   -- ว่าง = ยังไม่จบ / ไม่รู้จำนวน
  status         text    not null default 'planned'
                   check (status in ('reading', 'completed', 'planned')),
  progress       integer not null default 0 check (progress >= 0),  -- อ่านถึงตอนที่เท่าไร
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  -- ⭐ กฎกันเพิ่มซ้ำ: ผู้ใช้ 1 คน เก็บมังงะเรื่องเดียวกันได้แถวเดียว
  unique (user_id, manga_id)
);


-- ---------------------------------------------------------------------
-- 2) อัปเดต updated_at ให้เองทุกครั้งที่แก้แถว (ใช้เรียง "อัปเดตล่าสุด")
-- ---------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger shelf_items_set_updated_at
  before update on public.shelf_items
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- 3) กฎสิทธิ์ (Row Level Security)
--    เปิด RLS แล้ว = ห้ามทุกอย่างไว้ก่อน จากนั้นค่อยอนุญาตทีละเรื่อง
--    ทุกข้อ: ผู้ใช้ทำได้เฉพาะแถวที่ user_id เป็นของตัวเอง
-- ---------------------------------------------------------------------
alter table public.shelf_items enable row level security;

create policy "ดูได้เฉพาะชั้นของตัวเอง"
  on public.shelf_items for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "เพิ่มได้เฉพาะชั้นของตัวเอง"
  on public.shelf_items for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "แก้ได้เฉพาะชั้นของตัวเอง"
  on public.shelf_items for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "ลบได้เฉพาะชั้นของตัวเอง"
  on public.shelf_items for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- ให้ผู้ที่ล็อกอินแล้วเข้าถึงตารางนี้ได้ (แถวไหนได้บ้าง ตัดสินด้วยกฎข้างบน)
-- คนที่ยังไม่ล็อกอิน (anon) ไม่ได้สิทธิ์อะไรเลย
grant select, insert, update, delete on public.shelf_items to authenticated;
