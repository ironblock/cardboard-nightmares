import { getIceServers } from "./OpenRelay";

export async function establishSession() {
  const iceServers = await getIceServers();

  console.log(iceServers);
}
