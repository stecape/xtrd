function radTOdeg(rad) {
    return rad * (180 / Math.PI);
  }
  function degTOrad(deg) {
    return deg / (180 / Math.PI);
  }
  
  export const ricalcolo = data => {
    //Stella
    var zp = data.zp;
    var as = data.as;
    var rs = data.rs;
    var al = data.al;
    var dc = data.dc;
    var xs = 0;
    var ys = 0;
    while (as >= 360) {
      as = as - 360;
    }
    while (as < 0) {
      as = as + 360;
    }
  
    //Fotocellula
    var af = data.af;
    var rf = data.rf;
    var sf = data.sf;
  
    //Bobina 1
    var rb1 = data.rb1;
    var db1 = data.db1;
  
    //Bobina 2
    var rb2 = data.rb2;
    var db2 = data.db2;
  
    if (dc === 0 && al === 2 && sf === 1) {
      //Calcolo Raggio Bobina 1 Cambio Basso
      rb1 = Math.sqrt(
        Math.pow(rs * Math.sin(degTOrad(af - as)), 2) +
          Math.pow(rf - rs * Math.cos(degTOrad(af - as)), 2)
      );
      //Calcolo Diametro Bobina 1 Cambio Basso
      db1 = rb1 * 2;
    }
  
    if (dc === 0 && al === 1 && sf === 1) {
      //Calcolo Raggio Bobina 2 Cambio Basso
      rb2 = Math.sqrt(
        Math.pow(rs * Math.sin(degTOrad(af - (as - 180))), 2) +
          Math.pow(rf - rs * Math.cos(degTOrad(af - (as - 180))), 2)
      );
      //Calcolo Diametro Bobina 2 Cambio Basso
      db2 = rb2 * 2;
    }
  
    if (dc === 1 && al === 2 && sf === 1) {
      //Calcolo Raggio Bobina 1 Cambio Alto
      rb1 = Math.sqrt(
        Math.pow(rs * Math.sin(degTOrad(as - af)), 2) +
          Math.pow(rf - rs * Math.cos(degTOrad(as - af)), 2)
      );
      //Calcolo Diametro Bobina 1 Cambio Alto
      db1 = rb1 * 2;
    }
  
    if (dc === 1 && al === 1 && sf === 1) {
      //Calcolo Raggio Bobina 2 Cambio Alto
      rb2 = Math.sqrt(
        Math.pow(rs * Math.sin(degTOrad(as - 180 - af)), 2) +
          Math.pow(rf - rs * Math.cos(degTOrad(as - 180 - af)), 2)
      );
      //Calcolo Diametro Bobina 2 Cambio Alto
      db2 = rb2 * 2;
    }
  
    //Calcolo quote per disegno
    var xb1 = rs * Math.cos(degTOrad(zp + as));
    var yb1 = rs * Math.sin(degTOrad(zp + as));
    var xb2 = rs * Math.cos(degTOrad(zp + (as - 180)));
    var yb2 = rs * Math.sin(degTOrad(zp + (as - 180)));
    var xf = rf * Math.cos(degTOrad(zp + af));
    var yf = rf * Math.sin(degTOrad(zp + af));
  
    //costruzione oggetto
    return {
      //Stella
      zp: zp,
      as: as,
      rs: rs,
      al: al,
      dc: dc,
  
      //Fotocellula
      af: af,
      rf: rf,
      sf: sf,
  
      //Bobina 1
      rb1: rb1,
      db1: db1,
      xb1: xb1,
      yb1: yb1,
  
      //Bobina 2
      rb2: rb2,
      db2: db2,
      xb2: xb2,
      yb2: yb2,
  
      //Dati supplementari per disegno
      drawing: {
        xs: xs,
        ys: ys,
        xf: xf,
        yf: yf,
        zp: zp,
        as: as,
        rs: rs,
        af: af,
        rf: rf,
        sf: sf,
        xb1: xb1,
        yb1: yb1,
        rb1: rb1,
        xb2: xb2,
        yb2: yb2,
        rb2: rb2
      }
    };
  };
  