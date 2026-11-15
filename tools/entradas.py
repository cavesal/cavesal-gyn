#!/usr/bin/env python3
"""CaVeSal® GYN · genera demo/index.html y full/index.html desde index.html.
Correr después de cada cambio en index.html:  python3 tools/entradas.py
Misma lógica que CaVeSal® Emergencias: /demo/ siempre Demo, /full/ pide la clave al entrar."""
import json, re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
base = (R / 'index.html').read_text(encoding='utf-8')
ENT = {
  'demo': dict(title='Modo Demo — CaVeSal® GYN', og='CaVeSal® DEMO · GYN Calculadora gineco-endocrinológica',
    desc='Probá gratis CaVeSal® GYN: escala MRS, día de ovulación, Calculadora de THM, POP-Q, IMC, ficha de la paciente, casos de ejemplo y simulador.',
    name='CaVeSal® GYN Demo', short='GYN Demo'),
  'full': dict(title='CaVeSal® GYN · Versión completa', og='CaVeSal® GYN · Calculadora gineco-endocrinológica (versión completa)',
    desc='Versión completa de CaVeSal® GYN: fertilidad e inducción, preconcepcional, SOMP, climaterio y THM, anticoncepción, masa anexial, cuello MSPBS/ASCCP, endometriosis, suelo pélvico, cáncer hereditario y oncología FIGO.',
    name='CaVeSal® GYN', short='CaVeSal GYN'),
}
def rel(m):
    a, v = m.group(1), m.group(2)
    if re.match(r'(https?:|/|#|mailto:|data:|\.\./)', v): return m.group(0)
    if v == 'manifest.json': return m.group(0)
    return '%s="../%s"' % (a, v)
for k, e in ENT.items():
    h = re.sub(r'\b(src|href)="([^"]*)"', rel, base)
    h = re.sub(r'<title>.*?</title>', '<title>%s</title>' % e['title'], h, count=1)
    h = re.sub(r'(<meta name="description" content=")[^"]*', r'\g<1>' + e['desc'], h, count=1)
    for p in ('og:title', 'twitter:title'):
        h = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*' % p, r'\g<1>' + e['og'], h, count=1)
    for p in ('og:description', 'twitter:description'):
        h = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*' % p, r'\g<1>' + e['desc'], h, count=1)
    h = h.replace('content="https://cavesal.app/cavesal-gyn/"', 'content="https://cavesal.app/cavesal-gyn/%s/"' % k)
    h = h.replace('<link rel="stylesheet"', '<script>window.GYN_ENTRADA="%s";window.GYN_RAIZ="../";</script>\n<link rel="stylesheet"' % k, 1)
    h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- Generado por tools/entradas.py desde index.html. No editar a mano. -->', 1)
    d = R / k; d.mkdir(exist_ok=True)
    (d / 'index.html').write_text(h, encoding='utf-8')
    man = json.loads((R / 'manifest.json').read_text(encoding='utf-8'))
    man.update(name=e['name'], short_name=e['short'], id='./', start_url='./', scope='../')
    for i in man['icons']: i['src'] = '../' + i['src']
    (d / 'manifest.json').write_text(json.dumps(man, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('ok demo/ full/')
