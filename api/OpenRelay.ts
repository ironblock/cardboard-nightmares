export const getIceServers = async () =>
  (await fetch("/api/v1/openrelay/ice")).json();
