const socketCatchAsync = (fn) => {
  return async (socket, io, payload) => {
    try {
      return await fn(socket, io, payload);
    } catch (error) {
      console.log("🔌Socket error🔌", error);
    }
  };
};

export default socketCatchAsync;