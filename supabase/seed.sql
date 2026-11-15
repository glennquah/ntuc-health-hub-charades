-- Original sample prompts; no participant records or production content.
insert into public.topics (name, description, instructions) values
  ('Everyday Life', 'Familiar activities to act out together.', 'Act out the prompt without saying the word.');
insert into public.words (topic_id, translations)
select id, prompt from public.topics cross join (values
  ('{"English":"Drinking tea","Chinese":"喝茶"}'::jsonb),
  ('{"English":"Taking a walk","Chinese":"散步"}'::jsonb),
  ('{"English":"Cooking rice","Chinese":"煮饭"}'::jsonb)
) as prompts(prompt) where name = 'Everyday Life';
