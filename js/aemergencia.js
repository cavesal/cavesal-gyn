/* CaVeSal® GYN · Anticoncepción de emergencia.
   © 2026 Dr. Carlos Vera Salerno · Ley N.º 1328/1998 (Paraguay). Prohibida su copia o reproducción. */
(function (w) {
  'use strict';
  // Píldoras por toma del método de Yuzpe (2 tomas separadas por 12 horas).
  var YUZPE = {
    ee20: { n: 'EE 20 µg + LNG 100 µg', p: 5 },
    ee30: { n: 'EE 30 µg + LNG 150 µg', p: 4 },
    ee50: { n: 'EE 50 µg + LNG 250 µg', p: 2 }
  };
  var MECANISMO = [
    ['DIU de cobre', 'Impide la fecundación (efecto tóxico sobre espermatozoides y óvulo); puede actuar sobre la implantación', 'Más de 99 %'],
    ['Ulipristal 30 mg', 'Retrasa la ovulación aun con el pico de LH iniciado; cambios endometriales menores sin efecto antiimplantatorio demostrado', 'Embarazo 1,2 %'],
    ['Mifepristona 10 a 25 mg', 'Retrasa la ovulación y actúa sobre el endometrio', 'Más eficaz que LNG (Cochrane)'],
    ['Levonorgestrel 1,5 mg', 'Retrasa la ovulación solo antes del pico de LH; no impide la implantación', 'Embarazo 1,2 a 2,1 %'],
    ['Yuzpe (EE + LNG)', 'Retrasa la ovulación; efecto sobre la implantación no demostrado', 'Embarazo 3,2 % (LNG 1,1 % en el mismo ensayo)']
  ];

  function evaluar(d) {
    var h = d.horas, ops = [], avisos = [], peso = (d.imc !== null && d.imc > 26) || (d.peso !== null && d.peso > 70);
    var dentro = h !== null && h <= 120;
    if (h === null) return { ops: [], avisos: ['Cargá las horas desde la relación.'], dentro: null, yuzpe: null };
    var diuOk = !d.violacion && d.mecDiu !== 'no';
    if (diuOk && (dentro || d.ovulacion5)) ops.push({ id: 'cu', n: 'DIU de cobre', det: 'Primera opción: la más eficaz y no depende del peso. Hasta 120 horas de la relación' + (d.ovulacion5 ? ' o hasta 5 días de la ovulación estimada' : '') + '. Queda como método.' });
    if (dentro) {
      ops.push({ id: 'upa', n: 'Ulipristal 30 mg, dosis única', det: 'Hasta 120 horas. Más eficaz que LNG' + (d.inductor ? '. No usar con inductores enzimáticos' : '') + (d.inicioHormonal ? '. Esperar 5 días para iniciar el método hormonal (preservativo mientras tanto)' : '') + '.' , no: d.inductor });
      ops.push({ id: 'mife', n: 'Mifepristona 10 a 25 mg, dosis única', det: 'Hasta 120 horas. No registrada para este uso en todos los países.' });
      var lngDosis = (peso || d.inductor) ? '3 mg (doble dosis)' : '1,5 mg dosis única o 0,75 mg cada 12 horas';
      ops.push({ id: 'lng', n: 'Levonorgestrel ' + lngDosis, det: 'Hasta 72 horas; eficacia menor entre 72 y 120 horas.' + (peso ? ' IMC mayor de 26 o peso mayor de 70 kg: 3 mg.' : '') + (d.inductor ? ' Inductores enzimáticos: 3 mg.' : '') + (d.inicioHormonal ? ' Puede iniciar el método hormonal enseguida.' : '') });
      var y = YUZPE[d.aoc], yx = ' Siempre dos tomas: no hay esquema validado en una sola toma. Preferentemente dentro de 72 horas (hasta 120). Vómito dentro de 2 horas: repetir la toma. Menos eficaz y más náuseas que LNG.' + (d.inicioHormonal ? ' Puede iniciar el método hormonal enseguida, con preservativo 7 días.' : '');
      ops.push({ id: 'yuzpe', n: 'Yuzpe', det: y ? y.n + ': ' + y.p + ' píldoras y repetir ' + y.p + ' a las 12 horas (' + (2 * y.p) + ' en total), misma marca en las dos tomas. Antiemético previo.' + yx : 'Elegí el anticonceptivo disponible para calcular las píldoras.' + yx });
    }
    ops = ops.filter(function (o) { return !o.no; });
    if (!dentro && !d.ovulacion5) avisos.push('Más de 120 horas: fuera de la ventana. Test de embarazo y comenzar un método regular.');
    if (!dentro && d.ovulacion5 && !diuOk) avisos.push('Más de 120 horas y el DIU no es posible: test de embarazo y método regular.');
    if (d.violacion) avisos.push('Violación: no colocar DIU (OMS). Seguir el protocolo de violencia sexual.');
    if (d.mecDiu === 'no' && !d.violacion) avisos.push('DIU no elegible por MEC: opción oral.');
    if (peso && dentro) avisos.push('Con IMC alto la eficacia oral disminuye: preferir DIU o ulipristal.');
    avisos.push('Vómito dentro de las 3 horas: repetir la dosis.');
    avisos.push('Test de embarazo a las 3 semanas de la relación.');
    return { ops: ops, avisos: avisos, dentro: dentro, yuzpe: YUZPE[d.aoc] || null };
  }

  function render(cont, T, opts) {
    var C = w.GYN.comun, F = w.GYN.fertilidad.fila, esFull = !opts || opts.esFull !== false;
    var mec = '<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Método</th><th>Mecanismo</th><th>Eficacia</th></tr></thead><tbody>' +
      MECANISMO.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="etiqueta">El índice de Pearl no se aplica a la anticoncepción de emergencia: se informa el porcentaje de embarazos por uso. Tabla propia CaVeSal® · Basada en: OMS · FIGO/ICEC · Cochrane 2019</p>';
    var yz = '<div class="tabla-scroll"><table class="tabla"><thead><tr><th>Píldora</th><th>Por toma</th><th>Total</th></tr></thead><tbody>' +
      Object.keys(YUZPE).map(function (k) { var y = YUZPE[k]; return '<tr><td>' + y.n + '</td><td>' + y.p + '</td><td>' + (2 * y.p) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="etiqueta">Dos tomas separadas por 12 horas: dosis total de EE 200 µg + LNG 1 mg. Tabla propia CaVeSal® · Basada en: AAP 2012 · ICEC</p>';
    cont.innerHTML = '<p class="ayuda">Opciones ordenadas por eficacia según las horas desde la relación, el peso y la situación. <a href="#metodos">Métodos anticonceptivos</a> · <a href="#mec">Elegibilidad MEC</a></p>' +
      C.grupo('Datos', '<div class="grid2">' + C.campo('ae-h', 'Horas desde la relación', 'h', '1') + C.campo('ae-imc', 'IMC', 'kg/m²') + C.campo('ae-peso', 'Peso', 'kg') +
        C.sel('ae-diu', [['', 'DIU elegible (MEC 1 o 2)'], ['no', 'DIU no elegible (MEC 3 o 4)']], 'DIU') +
        C.sel('ae-aoc', [['', 'Yuzpe: elegir píldora'], ['ee20', 'EE 20 µg + LNG 100 µg'], ['ee30', 'EE 30 µg + LNG 150 µg'], ['ee50', 'EE 50 µg + LNG 250 µg']], 'Píldora disponible') + '</div>' +
        C.chk('ae-ov', 'Dentro de los 5 días de la ovulación estimada') + C.chk('ae-vio', 'Violación') + C.chk('ae-ind', 'Usa inductores enzimáticos') + C.chk('ae-ini', 'Quiere iniciar un método hormonal')) +
      '<div id="ae-o" class="resultados" aria-live="polite"></div>' +
      F('Mecanismo y eficacia', mec, '', 'neutro') + F('Yuzpe: píldoras por toma', yz, '', 'neutro') +
      '<p class="etiqueta">Algoritmo propio CaVeSal® · Basado en: OMS 2021 · FIGO/ICEC · FSRH 2017 (actualización 2022) · Cochrane 2019 · Cochrane mifepristona</p>' +
      '<p class="orientativa">' + T.app.orientativa + '</p>';
    var L = C.lector(cont);
    function act() {
      var r = evaluar({ horas: L.n('ae-h'), imc: L.n('ae-imc'), peso: L.n('ae-peso'), mecDiu: L.v('ae-diu'), aoc: L.v('ae-aoc'), ovulacion5: L.c('ae-ov'), violacion: L.c('ae-vio'), inductor: L.c('ae-ind'), inicioHormonal: L.c('ae-ini') });
      var h = [];
      if (!esFull) h.push(opts.bloqueo('Conducta de anticoncepción de emergencia en la versión completa'));
      else {
        if (r.ops.length) h.push(F('Sugerencia', '<ol>' + r.ops.map(function (o) { return '<li><strong>' + o.n + '</strong><br>' + o.det + '</li>'; }).join('') + '</ol>', 'Ordenadas por eficacia. Sugerencia CaVeSal®.', 'verde'));
        h.push(F('Aviso', C.ul(r.avisos), '', r.dentro === false ? 'rojo' : 'ambar'));
      }
      cont.querySelector('#ae-o').innerHTML = h.join('');
    }
    cont.addEventListener('input', act);
    cont.addEventListener('change', act);
    act();
  }

  w.GYN = w.GYN || {};
  w.GYN.aemergencia = { evaluar: evaluar, render: render, YUZPE: YUZPE };
})(window);
