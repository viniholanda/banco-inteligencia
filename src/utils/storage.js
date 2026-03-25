export async function loadData() {
  try {
    const t = await window.storage.get("escalada-kb-data");
    return t ? JSON.parse(t.value) : null;
  } catch {
    return null;
  }
}

export async function saveData(tests, feeds) {
  try {
    await window.storage.set("escalada-kb-data", JSON.stringify({ tests, feeds }));
  } catch {}
}
