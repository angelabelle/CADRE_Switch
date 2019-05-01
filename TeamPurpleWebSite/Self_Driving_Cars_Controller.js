var Self_Driving_Cars_Controller = (function() {
  function distance(p1, p2) {
    return euclidean(p1.x-p2.x, p1.y-p2.y);
  }
  function euclidean(dx, dy) {
    return Math.sqrt(dx*dx + dy*dy);
  }
  function Self_Driving_Cars_Controller(settings) {
    settings = settings || {};

    var self = this,
      defaults = Self_Driving_Cars_Controller.defaults,
      _settings = {},
      i;
    for (i in defaults) if (defaults.hasOwnProperty(i)) {
      _settings[i] = settings.hasOwnProperty(i) ? settings[i] : defaults[i];
    }
    this.settings = settings = _settings;
    this.day = 0;
    this.ticks = 0;
    this.foundShortestRoute = null;
    this.distances = null;
    this.mh = new idea.MetaHeuristic({
      count: settings.count,
      initType: function() {
        return new Newman(self.settings.route);
      },
      filter: function(left, right, prev) {
        var leftDistance = distance(prev, left),
          rightDistance = distance(prev, right);

        return leftDistance < rightDistance ? left : right;
      },
      sort: function() {
        this.collection.sort(function(a, b) {
          return a.route.distance - b.route.distance;
        });
      }
    });
  }

  Self_Driving_Cars_Controller.prototype = {
    render: function(drawBackground) {
      if (drawBackground) {
        this.drawBackground()
      }
      return this
        .drawPoints()
        .drawRoute();
    },
    drawBackground: function() {
      var settings = this.settings,
        ctx = settings.ctx;

      ctx.clearRect(0, 0, settings.width, settings.height);
      ctx.beginPath();
      ctx.rect(0, 0, settings.width, settings.height);
      ctx.fillStyle = 'rgb(32, 36, 45)';
      ctx.fill();

      return this;
    },
    drawPoints: function() {
      var settings = this.settings,
        points = settings.route.points,
        point,
        ctx = settings.ctx,
        i = 0,
        max = points.length;

      ctx.strokeStyle = 'rgb(255, 45, 3)';
      for (; i < max; i++) {
        point = points[i];
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
      }
      return this;
    },
    drawRoute: function() {
      if (this.foundShortestRoute === null) return this;
      var settings = this.settings,
        points = this.foundShortestRoute.points,
        point = points,
        ctx = settings.ctx,
        i = 0,
        max = points.length,
        lastPoint = points[max - 1];

      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgb(52, 59, 87)';

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      for (;i < max; i++) {
        point = points[i];
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
      return this;
    },
    update: function() {
      var self = this;

      this.mh
        .live(function(salesman) {
          if (self.foundShortestRoute === null) {
            self.foundShortestRoute = salesman.route.clone();
          }
          if (salesman.route.distance < self.foundShortestRoute.distance) {
            self.foundShortestRoute = salesman.route.clone();
          }
        })
        .learn();

      return this;
    }
  };

  Self_Driving_Cars_Controller.defaults = {
    ctx: null,
    count: 30,
    route: null,
    width: 1,
    height: 1
  };

  return Self_Driving_Cars_Controller;
})();