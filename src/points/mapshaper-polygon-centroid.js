/* @requires mapshaper-shape-geom */

// Get the centroid of the largest ring of a polygon
// TODO: Include holes in the calculation
// TODO: Add option to find centroid of all rings, not just the largest
geom.getShapeCentroid = function(shp, arcs) {
  var maxPath = geom.getMaxPath(shp, arcs);
  return maxPath ? geom.getPathCentroid(maxPath, arcs) : null;
};

geom.getPathCentroid = function(ids, arcs) {
  var iter = arcs.getShapeIter(ids),
      sum = 0,
      sumX = 0,
      sumY = 0,
      dx, dy, ax, ay, bx, by, tmp, area;
  if (!iter.hasNext()) return null;
  // reduce effect of fp errors by shifting shape origin to 0,0 (issue #304)
  ax = 0;
  ay = 0;
  dx = -iter.x;
  dy = -iter.y;
  while (iter.hasNext()) {
    bx = ax;
    by = ay;
    ax = iter.x + dx;
    ay = iter.y + dy;
    tmp = bx * ay - by * ax;
    sum += tmp;
    sumX += tmp * (bx + ax);
    sumY += tmp * (by + ay);
  }
  area = sum / 2;
  if (area === 0) {
    return geom.getAvgPathXY(ids, arcs);
  } else return {
    x: sumX / (6 * area) - dx,
    y: sumY / (6 * area) - dy
  };
};
