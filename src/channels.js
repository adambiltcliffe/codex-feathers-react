module.exports = function(app) {
  if (typeof app.channel !== "function") {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on("connection", connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel("anonymous").join(connection);
  });

  app.on("login", (authResult, { connection }) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      const user = connection.user;

      // The connection is no longer anonymous, remove it
      app.channel("anonymous").leave(connection);

      // Add it to the authenticated user channel
      app.channel("authenticated").join(connection);

      // Channels can be named anything and joined on any condition

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(channel));

      // Easily organize users by email and userid for things like messaging
      app.channel(`userIds/${user._id}`).join(connection);
    }
  });

  // game service needs to publish created, patched and removed

  app.service("games").publish("created", (data, context) => {
    return app.channel("authenticated");
  });

  app.service("games").publish("patched", (data, context) => {
    return app.channel("authenticated");
  });

  app.service("games").publish("removed", (data, context) => {
    return app.channel("authenticated");
  });

  // steps service needs to publish created and personalise per user

  app.service("steps").publish("created", (data, context) => {
    const chans = [];
    Object.entries(context.result.newInfos).map(([k, v]) => {
      if (k != "observer") {
        chans.push(
          app.channel(`userIds/${k}`).send({ ...context.dispatch, newInfo: v })
        );
      }
    });
    chans.push(
      app.channel("authenticated").send({
        ...context.dispatch,
        newInfo: context.result.newInfos["observer"]
      })
    );
    return chans;
  });
};
