export async function loadData() {
  try {
    const r = await window.storage.get("escalada-kb-v3");
    return r ? JSON.parse(r.value) : null;
  } catch {
    return null;
  }
}

export async function saveData(tests, feeds) {
  try {
    await window.storage.set("escalada-kb-v3", JSON.stringify({ tests, feeds }));
  } catch {}
}
