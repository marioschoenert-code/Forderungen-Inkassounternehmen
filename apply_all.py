import io
p = r"D:\Forderungsapp/apk-build/_clean/assets/app.js"
s = io.open(p, 'r', encoding='utf-8').read()

def bal(t):
    d = 0
    for c in t:
        if c == '(': d += 1
        elif c == ')': d -= 1
    return d

print("initial depth:", bal(s))

# ---- FIX 1: clear input value in BOTH handlers (file has typo 'bubbles') ----
old1 = "if (!f) return; document.getElementById('bon-input').files = e.target.files; document.getElementById('bon-input').dispatchEvent(new Event('change', { bubbles: true })); }"
new1 = "if (!f) return; document.getElementById('bon-input').value = ''; document.getElementById('bon-input').files = e.target.files; document.getElementById('bon-input').dispatchEvent(new Event('change', { bubbles: true })); }"
print("fix1 matches:", s.count(old1))
s = s.replace(old1, new1)
print("after fix1 depth:", bal(s))

# ---- FIX 2: save handler resets bonImg + clears input ----
old2 = "setBonForm({ betrag: '', shop: '', datum: new Date().toISOString().slice(0,10), kat: 'Einkauf' });\n    },"
new2 = "setBonForm({ betrag: '', shop: '', datum: new Date().toISOString().slice(0,10), kat: 'Einkauf' });\n      setBonImg('');\n      const bi = document.getElementById('bon-input'); if (bi) bi.value = '';\n    },"
print("fix2 present:", old2 in s)
s = s.replace(old2, new2)
print("after fix2 depth:", bal(s))

# ---- FIX 3: saved-receipt list. ----
# Anchor: the form's save button close + the ', view === ...' separator.
# Exact bytes (4 closing parens after the emoji string): 'Beleg speichern")))), view === 'vergleich' &&
anchor = 'Beleg speichern")))), view === \'vergleich\' && /*#__PURE__*/React.createElement("div", {'
print("fix3 anchor present:", anchor in s)

if anchor in s:
    # Mirror the edit-form pattern: 'X && (React.createElement("div", {...}, ..., map(...))), /*#__PURE__*/React.createElement("div", {'
    # The edit-form block ended with ')))), /*#__PURE__*/React.createElement("div", {' (5 closes).
    block = (
        'Beleg speichern")), einkauf.length > 0 && /*#__PURE__*/React.createElement("div", {\n'
        '    className: "mt-4 space-y-2"\n'
        '  }, /*#__PURE__*/React.createElement("p", {\n'
        '    className: "text-sm font-medium text-slate-100"\n'
        '  }, "Gespeicherte Belege (" + einkauf.length + ")"), einkauf.slice().reverse().map(b => /*#__PURE__*/React.createElement("div", {\n'
        '    key: b.id,\n'
        '    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3 flex gap-3 items-center"\n'
        '  }, b.img && /*#__PURE__*/React.createElement("img", {\n'
        '    src: b.img,\n'
        '    alt: "Beleg",\n'
        '    className: "w-16 h-16 object-cover rounded-lg border border-slate-600 shrink-0"\n'
        '  }), /*#__PURE__*/React.createElement("div", {\n'
        '    className: "flex-1 min-w-0"\n'
        '  }, /*#__PURE__*/React.createElement("p", {\n'
        '    className: "text-sm font-medium text-slate-100"\n'
        '  }, formatEUR(b.betrag) + " · " + (b.name || \'Beleg\')), /*#__PURE__*/React.createElement("p", {\n'
        '    className: "text-xs text-slate-100"\n'
        '  }, (b.datum || \'\') + " · " + (b.kat || \'Einkauf\')), /*#__PURE__*/React.createElement("button", {\n'
        '    onClick: () => persistEinkauf(einkauf.filter(x => x.id !== b.id)),\n'
        '    className: "text-slate-100 p-1 shrink-0"\n'
        '  }, /*#__PURE__*/React.createElement(TrashIcon, {\n'
        '    size: 15\n'
        '  })))), /*#__PURE__*/React.createElement("div", {'
    )
    s = s.replace(anchor, block, 1)
    print("after fix3 depth:", bal(s))

io.open(p, 'w', encoding='utf-8').write(s)
print("written. final depth:", bal(s))
