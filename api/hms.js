  /**
   * Decimal to DMS conversion
   */
  convertDMS = function(coordinate, type) {
    var coords = new String();

    abscoordinate = Math.abs(coordinate)
    coordinatedegrees = Math.floor(abscoordinate);

    coordinateminutes = (abscoordinate - coordinatedegrees)/(1/60);
    tempcoordinateminutes = coordinateminutes;
    coordinateminutes = Math.floor(coordinateminutes);
    coordinateseconds = (tempcoordinateminutes - coordinateminutes)*60 //(1/60);
    coordinatesecondsint =  Math.floor(coordinateseconds);

	coordinatesecondsfrac = Math.floor((coordinateseconds-coordinatesecondsint)*10)


    if( coordinatedegrees < 10 )
      coordinatedegrees = "0" + coordinatedegrees;

    if( coordinateminutes < 10 )
      coordinateminutes = "0" + coordinateminutes;

    if( coordinatesecondsint < 10 )
      coordinatesecondsint = "0" + coordinatesecondsint;
	
	

//    coords[0] = coordinatedegrees;
//    coords[1] = coordinateminutes;
//    coords[2] = coordinateseconds;
//    coords[3] = this.getHemi(coordinate, type);

	coords = coordinatedegrees + "''" + coordinateminutes + "'" + coordinatesecondsint + "." + coordinatesecondsfrac
	coords = coords + " " + getHemi(coordinate,type);

    return coords;
  }

  /**
   * Return the hemisphere abbreviation for this coordinate.
   */
  getHemi = function(coordinate, type) {
    var coordinatehemi = "";
    if (type == 'LAT') {
      if (coordinate >= 0) {
        coordinatehemi = "N";
      }
      else {
        coordinatehemi = "S";
      }
    }
    else if (type == 'LON') {
      if (coordinate >= 0) {
        coordinatehemi = "E";
      } else {
        coordinatehemi = "W";
      }
    }

    return coordinatehemi;
  }
