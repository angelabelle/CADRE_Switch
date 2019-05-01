var canvas = document.getElementById('canvas'),
      peopleDistance = document.getElementById('peopleDistance'),
      carDistance = document.getElementById('carDistance'),
      aIDistance = document.getElementById('AIDistance'),
      ctx = canvas.getContext('2d'),
      width = canvas.width = window.innerWidth * 0.475,
      height = canvas.height = window.innerHeight *0.8,
      route = Route.createRandom({
        width: width,
        height: height,
        count: 15
      }),
      people = new peopleController({
        ctx: ctx,
        width: width,
        height: height,
        route: route
      }),
      car = new Self_Driving_Cars_Controller({
        ctx: ctx,
        width: width,
        height: height,
        route: route
      }),
      aI = new AIController({
        ctx: ctx,
        width: width,
        height: height,
        route: route
      });

  var myVar = setInterval(function() {run()}, 0);

  function run(){
  	//draw background;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = 'rgb(0,0,0)';//'rgb(32, 36, 45)';
    ctx.fill();

    //draw points
    var points = route.points,
        point,
        i = 0,
        max = points.length;
    //color points
      ctx.strokeStyle = 'rgb(244, 254, 255)';
      ctx.lineWidth = 20;
    for (; i < max; i++) {

      point = points[i];
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    people
        .update()
        .drawRoute();
    car
        .update()
        .drawRoute();
    aI
        .update()
        .drawRoute();

    peopleDistance.innerHTML = people.foundShortestRoute.distance.toString();
    carDistance.innerHTML = car.foundShortestRoute.distance.toString();
    if (aI.colony.globalBest !== null) {
      aIDistance.innerHTML = aI.colony.globalBest.tour.updateDistance().toString();
    }
  
  }