export function calcSuccessRate(tests, filterFn) {
  const subset = filterFn ? tests.filter(filterFn) : tests;
  if (!subset.length) return { rate: 0, total: 0, sucesso: 0, parcial: 0, fracasso: 0 };
  const sucesso  = subset.filter((t) => t.resultadoTipo === "Sucesso").length;
  const parcial  = subset.filter((t) => t.resultadoTipo === "Parcial").length;
  const fracasso = subset.filter((t) => t.resultadoTipo === "Fracasso").length;
  return { rate: Math.round(sucesso / subset.length * 100), total: subset.length, sucesso, parcial, fracasso };
}

export function calcFeedbackSuccess(feeds, filterFn) {
  const subset = filterFn ? feeds.filter(filterFn) : feeds;
  if (!subset.length) return { rate: 0, total: 0, ok: 0 };
  const ok = subset.filter((f) => f.funcionou === "Sim").length;
  return { rate: Math.round(ok / subset.length * 100), total: subset.length, ok };
}
