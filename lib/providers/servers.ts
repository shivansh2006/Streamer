// lib/providers/servers.ts

export const TEST_SERVERS = [
  { name: "Server1", url: "https://server1.example.com" },
  { name: "Server2", url: "https://server2.example.com" },
];

export function getServerList() {
  return TEST_SERVERS;
}
