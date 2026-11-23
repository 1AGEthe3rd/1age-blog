import fs from 'node:fs';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';
const required=['index.html','application.html','blog.js','blog.css','blog-model.js','story-scene.js','publications.json','CNAME','shared/experience.css','shared/1age-logo.svg','shared/gamepad.mjs','shared/gamepad-model.mjs','shared/gamepad.css','shared/viewer.js','shared/space-concept.svg'];
for(const file of required)assert.ok(fs.existsSync(file),`Missing ${file}`);
assert.equal(fs.readFileSync('CNAME','utf8').trim(),'1age.blog');
const html=fs.readFileSync('index.html','utf8');assert.ok(html.includes('https://1age.world/?platform=blog'));assert.ok(html.includes('<iframe'));assert.ok(!html.includes('noindex'));
const application=fs.readFileSync('application.html','utf8');assert.ok(application.includes('./blog.js'));assert.ok(application.includes('https://1age.store/'));assert.ok(!application.includes('noindex'));
for(const file of required.filter(f=>/\\.(?:js|mjs)$/.test(f)))execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
const records=JSON.parse(fs.readFileSync('publications.json','utf8'));assert.ok(Array.isArray(records)&&records.length>0&&records.length<=200);const ids=new Set(records.map(r=>r.id));assert.equal(ids.size,records.length);
for(const record of records){assert.match(record.id,/^[a-z0-9-]+$/);assert.ok(record.title&&record.description&&Array.isArray(record.body));assert.ok(['procedural','image','video','gltf'].includes(record.media.kind));for(const id of record.related||[])assert.ok(ids.has(id)&&id!==record.id)}
console.log(`Blog preflight OK: ${records.length} publications, ${required.length} assets, JS syntax verified. Browser/HTTPS checks still required.`);
