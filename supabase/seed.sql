-- Optional starter component. Run after schema.sql if desired.
do $$
declare cat uuid; comp uuid; ver uuid;
begin
 select id into cat from public.categories where slug='form-input';
 insert into public.components(category_id,name,slug,description,preview_html,is_published)
 values(cat,'Glass Button','glass-button','Premium glass button with hover interaction.',
 '<div style="height:100%;display:grid;place-items:center;background:#0b0b0f"><button style="padding:14px 22px;border-radius:999px;border:1px solid #ffffff33;background:#ffffff14;color:#fff;box-shadow:0 10px 40px #0004">Glass Button</button></div>',
 true) returning id into comp;
 insert into public.component_versions(component_id,name,tech_key,price,is_free) values(comp,'HTML + CSS + JS','html-css-js',0,true) returning id into ver;
 insert into public.component_code(component_version_id,html,css,js) values(ver,'<button class="glass-btn">Glass Button</button>','.glass-btn{padding:14px 22px;border-radius:999px;border:1px solid #ffffff33;background:#ffffff14;color:white;}','');
end $$;
