const files = [
 { name: 'weekend.heic', type: 'image', size: 3.2, source: 'iPhone', art: 'landscape', label: '' },
 { name: 'the-big-idea.pdf', type: 'document', size: 8.4, source: 'Gmail', art: 'document', label: 'PDF' },
 { name: 'golden-hour.jpg', type: 'image', size: 2.1, source: 'Downloads', art: 'landscape sunset', label: '' },
 { name: 'good-vibes.mp3', type: 'music', size: 6.8, source: 'Music', art: 'music', label: '♫' },
 { name: 'coastal-walk.jpg', type: 'image', size: 4.7, source: 'iPhone', art: 'landscape ocean', label: '' },
 { name: 'project-notes.pdf', type: 'document', size: 1.2, source: 'Documents', art: 'document', label: 'PDF' },
 { name: 'MacEx-source.zip', type: 'archive', size: 12.6, source: 'GitHub', art: 'archive', label: 'ZIP' },
 { name: 'design-guide.pdf', type: 'document', size: 7.3, source: 'GitHub', art: 'document', label: 'PDF' },
];
const grid = document.querySelector('#demo-files');
const search = document.querySelector('#demo-search');
const dialog = document.querySelector('#preview-dialog');
let category = 'all';
let lastPreviewButton;
function artFor(file) {
 const art = document.createElement('div'); art.className = `file-art ${file.art}`;
 if (file.label) art.textContent = file.label;
 else art.append(document.createElement('span'));
 art.setAttribute('aria-hidden', 'true'); return art;
}
function preview(file, button) {
 lastPreviewButton = button;
 document.querySelector('#preview-content').replaceChildren(artFor(file));
 document.querySelector('#preview-title').textContent = file.name;
 document.querySelector('#preview-meta').textContent = `${file.size} MB · ${file.source} · Sample file`;
 dialog.showModal();
}
function matches(file, query) {
 const q = query.trim().toLowerCase();
 if (!q) return true;
 if (/^pdfs?\s+over\s+5\s*mb$/.test(q)) return file.label === 'PDF' && file.size > 5;
 if (/^images?$/.test(q)) return file.type === 'image';
 if (/^(from )?github$/.test(q)) return file.source === 'GitHub';
 return `${file.name} ${file.type} ${file.source}`.toLowerCase().includes(q);
}
function render() {
 const selected = files.filter(f => (category === 'all' || f.type === category) && matches(f, search.value));
 grid.replaceChildren();
 selected.forEach((file, index) => {
  const button = document.createElement('button'); button.className = 'sample-file'; button.style.animationDelay = `${index * 35}ms`;
  button.setAttribute('aria-label', `Preview ${file.name}`);
  const name = document.createElement('span'); name.className = 'file-name'; name.textContent = file.name;
  const meta = document.createElement('span'); meta.className = 'file-meta'; meta.textContent = `${file.size} MB · ${file.source}`;
  button.append(artFor(file), name, meta); button.addEventListener('click', () => preview(file, button)); grid.append(button);
 });
 if (!selected.length) { const empty = document.createElement('p'); empty.className='empty'; empty.textContent='No sample files found. Try a category or reset the demo.'; grid.append(empty); }
 document.querySelector('#result-count').textContent = `${selected.length} ${selected.length === 1 ? 'item' : 'items'}, a little more organized.`;
}
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
 category = button.dataset.category;
 document.querySelectorAll('[data-category]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
 document.querySelector('#library-title').textContent = {all:'All your files',image:'Your images',document:'Your documents',music:'Your music',archive:'Your archives'}[category];
 search.value = ''; render();
}));
search.addEventListener('input', render);
document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
 document.querySelector('[data-category="all"]').click(); search.value = button.dataset.query; render();
}));
document.querySelector('#reset-demo').addEventListener('click', () => document.querySelector('[data-category="all"]').click());
document.querySelector('#view-toggle').addEventListener('click', event => {
 const list = grid.classList.toggle('list'); event.currentTarget.setAttribute('aria-pressed', String(list)); event.currentTarget.setAttribute('aria-label', `Switch to ${list ? 'grid' : 'list'} view`); event.currentTarget.textContent = list ? '⊞' : '☷';
});
document.querySelector('#close-preview').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => lastPreviewButton?.focus());
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if(dialog.open) dialog.close(); search.focus(); search.scrollIntoView({block:'center', behavior: document.documentElement.classList.contains('motion-paused') ? 'instant' : 'smooth'}); } });
let reviewed = false;
document.querySelector('#cleanup-demo').addEventListener('click', event => {
 reviewed = !reviewed; event.currentTarget.textContent = reviewed ? 'Reset' : 'Review';
 document.querySelector('#duplicate-row').style.opacity = reviewed ? '.6' : '1';
 document.querySelector('#cleanup-feedback').textContent = reviewed ? 'Demo: duplicate reviewed. In MacEx, you select what goes to Trash.' : 'You’re in control. Nothing disappears on its own.';
});
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduceMotion.matches;
const motionButton = document.querySelector('#motion-toggle');
function setMotion() { document.documentElement.classList.toggle('motion-paused', paused); motionButton.textContent=paused ? 'Resume motion' : 'Pause motion'; motionButton.setAttribute('aria-pressed',String(paused)); }
motionButton.addEventListener('click', () => { paused = !paused; setMotion(); });
reduceMotion.addEventListener('change', event => { paused = event.matches; setMotion(); });
setMotion();
if ('IntersectionObserver' in window) {
 document.documentElement.classList.add('js-motion');
 const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold: .06});
 document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
render();
