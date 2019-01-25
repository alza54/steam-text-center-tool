export function find (a, b) {

  let c = [];
  let d = a.slice();

  d.sort();

  while (b > 0) {
    for (var i = d.length - 1; i >= 0; i--) {
      if (d[i] <= b || i == 0) {
        b = b - d[i];
        c.push(d[i]);
        break;
      }
    }
  }

  return c;

}
