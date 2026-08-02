(function() {
  if (window.__budgetPdfBtnInjected) return;
  window.__budgetPdfBtnInjected = true;

  function $(sel, el){ return (el||document).querySelector(sel); }
  function $$(sel, el){ return Array.from((el||document).querySelectorAll(sel)); }
  function formatEUR(n){
    try { return (Number(n)||0).toLocaleString('de-DE',{style:'currency',currency:'EUR'}); } catch(e){ return '0,00 €'; }
  }
  function toMonthly(b, iv){
    b = Number(b)||0;
    if (!iv || iv === 'monatlich') return b;
    if (iv === 'quartalsweise') return b/3;
    if (iv === 'halbjaehrlich') return b/6;
    if (iv === 'jaehrlich') return b/12;
    return b;
  }
  function getBudgetFixkosten(){
    try { var raw = localStorage.getItem('forderungen-budgetfixkosten-admin'); return raw ? JSON.parse(raw) : []; } catch(e){ return []; }
  }

  window.openBudgetPdf = function () {
    try {
      var entries = Array.isArray(getBudgetFixkosten()) ? getBudgetFixkosten() : [];
      var rows = entries.map(function(x,i){ return '<tr><td>'+(i+1)+'</td><td>'+(x.kategorie||'')+'</td><td class="num">'+formatEUR(x.betrag)+'</td><td class="num">'+formatEUR(toMonthly(x.betrag, x.intervall || 'monatlich'))+' / Monat</td></tr>'; }).join('');
      var html = '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><title>Budget (Fixkosten)</title><style>*{box-sizing:border-box}body{font-family:sans-serif;margin:24px;color:#0f172a}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #cbd5e1;padding:6px 8px;font-size:12px;text-align:left}th{background:#f1f5f9}td.num{text-align:right;font-variant-numeric:tabular-nums}@media print{body{margin:0}}</style></head><body><h1>Budget (Fixkosten)</h1><p>Erstellt: '+new Date().toLocaleDateString('de-DE')+'</p><table><thead><tr><th>#</th><th>Kategorie</th><th class="num">Betrag</th><th class="num">/ Monat</th></tr></thead><tbody>'+rows+'</tbody></table><script>setTimeout(function(){window.print();},300);</script></body></html>';
      // echter Datei-Download (Blob), damit du die Datei behalten / weiterleiten kannst
      var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'ForderungenApp-Budget.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      try { URL.revokeObjectURL(a.href); } catch(e){}
    } catch (e) { alert('PDF/Download fehlgeschlagen: ' + e.message); }
  };

  window.openBudgetCsv = function () {
    try {
      var entries = Array.isArray(getBudgetFixkosten()) ? getBudgetFixkosten() : [];
      var header = 'Nr;Kategorie;Betrag;/ Monat\n';
      var rows = entries.map(function(x,i){ return [(i+1), (x.kategorie||''), formatEUR(x.betrag), formatEUR(toMonthly(x.betrag, x.intervall || 'monatlich')) + ' / Monat'].join(';'); }).join('\n');
      var blob = new Blob(['﻿' + (header + rows)], { type: 'text/csv;charset=utf-8;' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'budget-fixkosten.csv';
      a.click();
    } catch (e) { alert('CSV fehlgeschlagen: ' + e.message); }
  };

  window.openBudgetExcel = function () {
    try {
      var entries = Array.isArray(getBudgetFixkosten()) ? getBudgetFixkosten() : [];
      var rows = entries.map(function(x,i){
        return '<tr><td>'+(i+1)+'</td><td>'+(x.kategorie||'')+'</td><td style="mso-number-format:\\#\\#0\\,00">'+formatEUR(x.betrag)+'</td><td style="mso-number-format:\\#\\#0\\,00">'+formatEUR(toMonthly(x.betrag, x.intervall || 'monatlich'))+' / Monat</td></tr>';
      }).join('');
      var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>table{border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:6px 8px;font-size:12px}th{background:#f1f5f9}</style></head><body><table><thead><tr><th>#</th><th>Kategorie</th><th>Betrag</th><th>/ Monat</th></tr></thead><tbody>'+rows+'</tbody></table></body></html>';
      var blob = new Blob(['﻿'+html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'budget-fixkosten.xls';
      a.click();
    } catch (e) { alert('Excel fehlgeschlagen: ' + e.message); }
  };

  window.openBudgetEmail = function () {
    try {
      var entries = Array.isArray(getBudgetFixkosten()) ? getBudgetFixkosten() : [];
      var lines = ['Forderungs- & Rechnungsmanagement - Budget (Fixkosten)', 'Erstellt: ' + new Date().toLocaleDateString('de-DE'), ''];
      lines.push('Nr;Kategorie;Betrag;/ Monat');
      entries.forEach(function(x,i){ lines.push([(i+1), (x.kategorie||''), formatEUR(x.betrag), formatEUR(toMonthly(x.betrag, x.intervall || 'monatlich')) + ' / Monat'].join(';')); });
      var body = encodeURIComponent(lines.join('\n'));
      window.location.href = 'mailto:?subject='+encodeURIComponent('Budget (Fixkosten)')+'&body='+body;
    } catch (e) { alert('E-Mail fehlgeschlagen: ' + e.message); }
  };

  window.openNebenkostenOcr = function () {
    try {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.style.cssText = 'position:fixed;opacity:0;height:0;';
      document.body.appendChild(input);
      input.addEventListener('change', function(){
        var file = input.files && input.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(){
          if (typeof window.ocrBon !== 'function') { alert('OCR-Bibliothek nicht bereit.'); return; }
          var status = document.createElement('div');
          status.style.cssText = 'position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:9999;background:#0f172a;color:#fff;padding:8px 12px;border-radius:8px;font:12px system-ui;';
          status.textContent = 'OCR laeuft...';
          document.body.appendChild(status);
          window.ocrBon(reader.result).then(function(text){
            status.textContent = 'OCR fertig.';
            setTimeout(function(){ try{document.body.removeChild(status);}catch(e){} }, 2000);
          }).catch(function(err){
            status.textContent = 'OCR fehlgeschlagen: ' + (err && err.message ? err.message : String(err));
            setTimeout(function(){ try{document.body.removeChild(status);}catch(e){} }, 4000);
          });
        };
        reader.readAsDataURL(file);
        setTimeout(function(){ try{document.body.removeChild(input);}catch(e){} }, 1000);
      });
      input.click();
    } catch (e) { alert('OCR-Start fehlgeschlagen: ' + e.message); }
  };
})();
