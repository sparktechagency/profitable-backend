// const { default: status } = require("http-status");
// const { EnumSocketEvent } = require("../util/enum");

export const emitError = ( socket, statusCode = 500, message = "Internal sever error", disconnect ) => {
  socket.emit("socket_error", { status: statusCode, message });

  if (disconnect) {
    socket.disconnect(true);
    console.log("disconnected because of error");
  }

  throw new Error(message);
};


