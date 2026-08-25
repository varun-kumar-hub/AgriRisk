-- Migration 003: Add language preference column to profiles table
alter table profiles 
  add column if not exists language varchar(5) default 'en' check (language in ('en', 'ta', 'te', 'kn', 'hi'));
