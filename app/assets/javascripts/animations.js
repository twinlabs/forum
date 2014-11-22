$.Velocity.RegisterEffect("forum.slideFromLeft", {
  defaultDuration: 800,
  calls: [
    [{
      translateX: [0, -500],
      opacity: [1, 0]
    }]
  ]
});

$.Velocity.RegisterEffect("forum.fadeIn", {
  defaultduration: 500,
  calls: [
    [{
      opacity: [1, 0]
    }]
  ]
});
