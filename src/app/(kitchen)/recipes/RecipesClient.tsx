'use client';

// src/app/(kitchen)/recipes/RecipesClient.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Recipes.module.scss';
import seedData from '@/data/recipes.json';

type Recipe = {
  id: string;
  name: string;
  category: string;
  serves: string;
  ingredients: string;
  steps: string;
  notes: string;
  created?: string;
};

type AiParsed = {
  recipes: Partial<Recipe>[];
  questions: string[];
};

type AiMessage = {
  role: 'user' | 'assistant';
  content: string | Array<Record<string, unknown>>;
};

const KEY = 'solene-kitchen-v1';
const AI_KEY = 'solene-kitchen-anthropic-key';
const SEED = seedData as Recipe[];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const lines = (s?: string) => (s || '').split('\n').filter((l) => l.trim());

function mergeLines(a: string, b: string) {
  const seen = new Set(lines(a).map((l) => l.trim().toLowerCase()));
  const extra = lines(b).filter((l) => !seen.has(l.trim().toLowerCase()));
  return [a.trim(), extra.join('\n')].filter(Boolean).join('\n');
}

const emptyForm = { name: '', category: '', serves: '', ingredients: '', steps: '', notes: '' };

export default function RecipesClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<'list' | 'detail' | 'form' | 'review'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [form, setForm] = useState(emptyForm);
  const [aiParsed, setAiParsed] = useState<AiParsed | null>(null);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const aiMessages = useRef<AiMessage[]>([]);
  const photoMode = useRef<'new' | 'more'>('new');
  const photoInput = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);

  // Load from localStorage + merge seed
  useEffect(() => {
    let stored: Recipe[] = [];
    try {
      stored = JSON.parse(localStorage.getItem(KEY) || '[]') || [];
    } catch {
      stored = [];
    }
    const haveIds = new Set(stored.map((r) => r.id));
    const haveNames = new Set(stored.map((r) => (r.name || '').trim().toLowerCase()));
    SEED.forEach((s) => {
      if (!haveIds.has(s.id) && !haveNames.has(s.name.trim().toLowerCase())) {
        stored.push({ ...s, created: s.created || new Date().toISOString() });
      }
    });
    setRecipes(stored);
    setReady(true);
  }, []);

  // Persist
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(recipes));
  }, [recipes, ready]);

  const categories = useMemo(
    () => [...new Set(recipes.map((r) => r.category).filter(Boolean))].sort(),
    [recipes]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...recipes].sort((a, b) => a.name.localeCompare(b.name));
    if (activeCategory !== 'All' && categories.includes(activeCategory)) {
      list = list.filter((r) => r.category === activeCategory);
    }
    if (q) {
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.ingredients || '').toLowerCase().includes(q) ||
          (r.category || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [recipes, search, activeCategory, categories]);

  const selected = recipes.find((r) => r.id === selectedId) || null;

  const showList = () => {
    setView('list');
    window.scrollTo(0, 0);
  };

  const openForm = (id?: string) => {
    const r = id ? recipes.find((x) => x.id === id) : null;
    setEditingId(id || null);
    setForm(
      r
        ? {
            name: r.name,
            category: r.category,
            serves: r.serves,
            ingredients: r.ingredients,
            steps: r.steps,
            notes: r.notes,
          }
        : { ...emptyForm, category: activeCategory !== 'All' ? activeCategory : '' }
    );
    setView('form');
    window.scrollTo(0, 0);
  };

  const saveRecipe = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      setRecipes((rs) => rs.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
      setSelectedId(editingId);
      setView('detail');
    } else {
      setRecipes((rs) => [...rs, { id: uid(), created: new Date().toISOString(), ...form }]);
      showList();
    }
  };

  const removeRecipe = (id: string) => {
    const r = recipes.find((x) => x.id === id);
    if (!r || !confirm(`Delete "${r.name}"? This can't be undone.`)) return;
    setRecipes((rs) => rs.filter((x) => x.id !== id));
    showList();
  };

  /* ---------- Backup / restore ---------- */

  const exportData = () => {
    const blob = new Blob([JSON.stringify(recipes, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `solene-kitchen-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data)) throw new Error();
        setRecipes((rs) => {
          const existing = new Set(rs.map((r) => r.id));
          const added = data.filter((r) => r && r.name && !existing.has(r.id));
          alert(`Restored ${added.length} recipe${added.length === 1 ? '' : 's'}.`);
          return [...rs, ...added.map((r) => ({ ...r, id: r.id || uid() }))];
        });
      } catch {
        alert("That file doesn't look like a recipe backup.");
      }
    };
    reader.readAsText(file);
  };

  /* ---------- AI photo import ---------- */

  const getKey = () => localStorage.getItem(AI_KEY) || '';
  const setKey = () => {
    const k = prompt(
      'Paste your Anthropic API key.\nIt is stored only on this device and used to read recipe photos.',
      getKey()
    );
    if (k !== null) {
      localStorage.setItem(AI_KEY, k.trim());
      alert(k.trim() ? 'Key saved.' : 'Key cleared.');
    }
  };

  const startPhotoImport = (mode: 'new' | 'more') => {
    if (!getKey()) {
      setKey();
      if (!getKey()) return;
    }
    photoMode.current = mode;
    photoInput.current?.click();
  };

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const max = 1568;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.85).split(',')[1]);
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });

  const callClaude = async (): Promise<string> => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': getKey(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 4000,
        messages: aiMessages.current,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.content
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('');
  };

  const parseAI = (text: string): AiParsed => {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('No JSON found in response.');
    const parsed = JSON.parse(m[0]);
    return { recipes: parsed.recipes || [], questions: parsed.questions || [] };
  };

  const transcribePrompt =
    () => `You are transcribing handwritten recipes from a treasured family recipe book into a recipe app.
Existing categories in the app: ${categories.join(', ') || 'none yet'} — reuse them where they fit, or create a sensible new one.
Respond with ONLY a JSON object, no other text:
{"recipes":[{"name":"","category":"","serves":"","ingredients":"","steps":"","notes":""}],"questions":["..."]}
Rules:
- A single page usually contains SEVERAL recipes, often numbered (1), 2), 3)…). Use the numbering and titles to separate them — capture every recipe on the page, even one-liners.
- The top of a page may be the tail end of the previous page's recipe (unnumbered, mid-list) — treat it as a continuation, not a new recipe.
- "ingredients" and "steps" are newline-separated strings, one item per line.
- Preserve the writer's charming phrasing (e.g. "use your instincts") in notes.
- If a recipe lists only ingredients with no method, leave "steps" empty — do not invent one.
- If handwriting is unclear, make your best guess, mark the word with [?], and add a specific question to "questions".
- The photos may be consecutive pages of the book: a recipe can start on one page and continue on the next. Join continuations into ONE recipe — never output the halves separately.
- If a recipe is clearly cut off, still include what you can read, and add a question suggesting to add the next page.
- If two ingredient columns look like batch size variants, put the smaller batch in notes.
- If nothing on the photo looks like a recipe, return {"recipes":[],"questions":["I couldn't find a recipe in this photo — could you retake it?"]}`;

  const handlePhotos = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(ev.target.files || [])].slice(0, 5);
    ev.target.value = '';
    if (!files.length) return;
    setView('review');
    setAiError(null);
    setAiBusy('Reading the page… transcribing the handwriting. This takes a few seconds.');
    window.scrollTo(0, 0);
    try {
      const images = await Promise.all(files.map(compressImage));
      const imageBlocks = images.map((d) => ({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: d },
      }));
      if (photoMode.current === 'more' && aiMessages.current.length) {
        aiMessages.current.push({
          role: 'user',
          content: [
            ...imageBlocks,
            {
              type: 'text',
              text: 'Here are more consecutive pages. Merge any continuations with the recipes you already found, add any new recipes, and respond with ONLY the same JSON format containing the full updated set.',
            },
          ],
        });
      } else {
        aiMessages.current = [
          { role: 'user', content: [...imageBlocks, { type: 'text', text: transcribePrompt() }] },
        ];
      }
      const reply = await callClaude();
      aiMessages.current.push({ role: 'assistant', content: reply });
      setAiParsed(parseAI(reply));
      setAnswers({});
    } catch (e) {
      setAiError(e instanceof Error ? e.message : String(e));
    } finally {
      setAiBusy(null);
    }
  };

  const sendAnswers = async () => {
    if (!aiParsed) return;
    const qa = aiParsed.questions
      .map((q, i) => (answers[i]?.trim() ? `Q: ${q}\nA: ${answers[i].trim()}` : null))
      .filter(Boolean);
    if (!qa.length) {
      acceptAI();
      return;
    }
    setAiBusy('Updating with your answers…');
    try {
      aiMessages.current.push({
        role: 'user',
        content: `Answers to your questions:\n\n${qa.join('\n\n')}\n\nUpdate the recipes accordingly (remove the [?] marks you can now resolve) and respond with ONLY the same JSON format. Only include remaining "questions" if something is still genuinely unclear.`,
      });
      const reply = await callClaude();
      aiMessages.current.push({ role: 'assistant', content: reply });
      setAiParsed(parseAI(reply));
      setAnswers({});
    } catch (e) {
      alert('Update failed: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setAiBusy(null);
    }
  };

  const acceptAI = () => {
    if (!aiParsed) return;
    setRecipes((rs) => {
      const next = [...rs];
      aiParsed.recipes.forEach((x) => {
        if (!x || !x.name) return;
        const existing = next.find(
          (r) => r.name.trim().toLowerCase() === x.name!.trim().toLowerCase()
        );
        if (
          existing &&
          confirm(
            `"${x.name}" is already in the book. Merge the new details into it?\n\nOK = merge · Cancel = add as a separate copy`
          )
        ) {
          existing.ingredients = mergeLines(existing.ingredients, x.ingredients || '');
          existing.steps = mergeLines(existing.steps, x.steps || '');
          existing.notes = mergeLines(existing.notes, x.notes || '');
          if (!existing.category) existing.category = x.category || '';
          if (!existing.serves) existing.serves = x.serves || '';
          return;
        }
        next.push({
          id: uid(),
          created: new Date().toISOString(),
          name: x.name!,
          category: x.category || '',
          serves: x.serves || '',
          ingredients: x.ingredients || '',
          steps: x.steps || '',
          notes: x.notes || '',
        });
      });
      return next;
    });
    showList();
  };

  /* ---------- Render ---------- */

  if (!ready) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <input
          ref={photoInput}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handlePhotos}
        />
        <input
          ref={importInput}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={importData}
        />

        {view === 'list' && (
          <>
            <header className={`${styles.header} ${styles.fadeIn}`}>
              <div className={styles.wordmark}>Solene</div>
              <div className={styles.wordmarkSub}>Kitchen</div>
              <div className={styles.wordmarkRule} />
              <p className={styles.tagline}>
                Recipes kept with care — for this generation and the next.
              </p>
            </header>

            <div className={`${styles.toolbar} ${styles.fadeIn}`}>
              <input
                type="search"
                className={styles.search}
                placeholder="Search recipes or ingredients…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className={styles.btnPrimary} onClick={() => openForm()}>
                + Add Recipe
              </button>
              <button className={styles.btnGhost} onClick={() => startPhotoImport('new')}>
                From Photo
              </button>
            </div>

            <div className={`${styles.tabs} ${styles.fadeIn}`}>
              {['All', ...categories].map((c) => (
                <button
                  key={c}
                  className={c === activeCategory ? styles.tabActive : styles.tab}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className={styles.grid}>
              {filtered.length === 0 ? (
                <div className={styles.empty}>
                  {recipes.length === 0 ? (
                    <>
                      <div className={styles.emptyBig}>The book is open.</div>
                      Add the first recipe to begin the collection.
                    </>
                  ) : (
                    <>No recipes match — try a different search.</>
                  )}
                </div>
              ) : (
                filtered.map((r) => (
                  <button
                    key={r.id}
                    className={`${styles.card} ${styles.fadeIn}`}
                    onClick={() => {
                      setSelectedId(r.id);
                      setView('detail');
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className={styles.cardCat}>{r.category || 'Uncategorised'}</div>
                    <h3>{r.name}</h3>
                    <div className={styles.cardMeta}>
                      {lines(r.ingredients).length} ingredients
                      {r.serves ? ` · Serves ${r.serves}` : ''}
                    </div>
                  </button>
                ))
              )}
            </div>

            <footer className={styles.footer}>
              <div className={styles.footerActions}>
                <button className={styles.btnGhost} onClick={exportData}>
                  Download Backup
                </button>
                <button className={styles.btnGhost} onClick={() => importInput.current?.click()}>
                  Restore Backup
                </button>
                <button className={styles.btnGhost} onClick={setKey}>
                  AI Settings
                </button>
              </div>
              <div className={styles.footerBrand}>Solene</div>
              <div className={styles.footerCount}>
                {recipes.length > 0 &&
                  `${recipes.length} recipe${recipes.length === 1 ? '' : 's'} preserved`}
              </div>
            </footer>
          </>
        )}

        {view === 'detail' && selected && (
          <>
            <button className={styles.back} onClick={showList}>
              ← All Recipes
            </button>
            <div className={`${styles.detailCard} ${styles.fadeIn}`}>
              <div className={styles.detailCat}>{selected.category || 'Uncategorised'}</div>
              <h2>{selected.name}</h2>
              {selected.serves && <div className={styles.serves}>Serves {selected.serves}</div>}
              {lines(selected.ingredients).length > 0 && (
                <>
                  <div className={styles.sectionLabel}>Ingredients</div>
                  <ul className={styles.ingList}>
                    {lines(selected.ingredients).map((i, n) => (
                      <li key={n}>{i}</li>
                    ))}
                  </ul>
                </>
              )}
              {lines(selected.steps).length > 0 && (
                <>
                  <div className={styles.sectionLabel}>Method</div>
                  <ol className={styles.steps}>
                    {lines(selected.steps).map((s, n) => (
                      <li key={n}>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {selected.notes && (
                <>
                  <div className={styles.sectionLabel}>Notes</div>
                  <div className={styles.notes}>{selected.notes}</div>
                </>
              )}
              <div className={styles.detailActions}>
                <button className={styles.btnGhost} onClick={() => openForm(selected.id)}>
                  Edit
                </button>
                <button className={styles.btnDanger} onClick={() => removeRecipe(selected.id)}>
                  Delete
                </button>
              </div>
            </div>
          </>
        )}

        {view === 'form' && (
          <>
            <button className={styles.back} onClick={showList}>
              ← Cancel
            </button>
            <div className={`${styles.formCard} ${styles.fadeIn}`}>
              <h2>{editingId ? 'Edit Recipe' : 'New Recipe'}</h2>
              <div className={styles.field}>
                <label>Recipe Name</label>
                <input
                  type="text"
                  value={form.name}
                  placeholder="e.g. Jollof Rice"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Category</label>
                  <input
                    type="text"
                    list="cat-list"
                    value={form.category}
                    placeholder="e.g. Rice, Soups, Baking"
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                  <datalist id="cat-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className={styles.field}>
                  <label>Serves</label>
                  <input
                    type="text"
                    value={form.serves}
                    placeholder="e.g. 4–6"
                    onChange={(e) => setForm({ ...form, serves: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Ingredients</label>
                <textarea
                  rows={8}
                  value={form.ingredients}
                  placeholder={'One ingredient per line\n2 cups rice\n1 onion, chopped'}
                  onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                />
                <div className={styles.hint}>One ingredient per line.</div>
              </div>
              <div className={styles.field}>
                <label>Method</label>
                <textarea
                  rows={10}
                  value={form.steps}
                  placeholder={'One step per line\nRinse the rice.\nSauté the onion until golden.'}
                  onChange={(e) => setForm({ ...form, steps: e.target.value })}
                />
                <div className={styles.hint}>
                  One step per line — numbers are added automatically.
                </div>
              </div>
              <div className={styles.field}>
                <label>Notes (optional)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  placeholder="Her tips, substitutions, memories…"
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className={styles.formActions}>
                <button className={styles.btnPrimary} onClick={saveRecipe}>
                  Save Recipe
                </button>
                <button className={styles.btnGhost} onClick={showList}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {view === 'review' && (
          <>
            <button className={styles.back} onClick={showList}>
              ← Cancel Import
            </button>
            <div className={`${styles.formCard} ${styles.fadeIn}`}>
              {aiBusy ? (
                <>
                  <h2>One moment…</h2>
                  <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>{aiBusy}</p>
                </>
              ) : aiError ? (
                <>
                  <h2>Couldn&apos;t read that</h2>
                  <p
                    style={{
                      color: 'var(--muted)',
                      fontSize: 14,
                      lineHeight: 1.7,
                      margin: '14px 0 22px',
                    }}
                  >
                    {aiError}
                  </p>
                  <button className={styles.btnGhost} onClick={showList}>
                    Back
                  </button>
                </>
              ) : aiParsed ? (
                <>
                  <h2>
                    Found {aiParsed.recipes.length} recipe
                    {aiParsed.recipes.length === 1 ? '' : 's'}
                  </h2>
                  {aiParsed.recipes.map((x, n) => (
                    <div key={n} className={styles.reviewItem}>
                      <div className={styles.cardCat}>{x.category || 'Uncategorised'}</div>
                      <div className={styles.reviewName}>{x.name}</div>
                      <div className={styles.reviewMeta}>
                        {lines(x.ingredients).length} ingredients · {lines(x.steps).length} steps
                        {x.notes ? ' · has notes' : ''}
                      </div>
                    </div>
                  ))}
                  {aiParsed.questions.length > 0 && (
                    <>
                      <div className={styles.sectionLabel}>A few things to check</div>
                      {aiParsed.questions.map((q, i) => (
                        <div key={i} className={styles.field}>
                          <label className={styles.reviewQuestion}>{q}</label>
                          <input
                            type="text"
                            placeholder="Your answer (or leave blank to keep the guess)"
                            value={answers[i] || ''}
                            onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                          />
                        </div>
                      ))}
                    </>
                  )}
                  <div className={styles.formActions} style={{ marginTop: 24 }}>
                    {aiParsed.questions.length > 0 && (
                      <button className={styles.btnPrimary} onClick={sendAnswers}>
                        Send Answers
                      </button>
                    )}
                    {aiParsed.recipes.length > 0 && (
                      <button
                        className={aiParsed.questions.length ? styles.btnGhost : styles.btnPrimary}
                        onClick={acceptAI}
                      >
                        Save {aiParsed.questions.length ? 'As-Is' : 'All'}
                      </button>
                    )}
                    <button className={styles.btnGhost} onClick={() => startPhotoImport('more')}>
                      Add More Pages
                    </button>
                    <button className={styles.btnGhost} onClick={showList}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
