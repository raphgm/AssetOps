import os from "os";
import cp from "child_process";
import net from "net";
import dns from "dns";

export interface NetworkInterfaceInfo {
  name: string;
  ip: string;
  netmask: string;
  cidr: string;
  subnet: string;
}

export interface DiscoveredHost {
  ip: string;
  hostname: string;
  mac: string;
  vendor: string;
  model: string;
  typeCode: string;
  ports: number[];
  responseLatencyMs: number;
  lastSeen: string;
  isRealHost: boolean;
}

// Common IEEE OUI manufacturer mappings
const OUI_VENDORS: Record<string, { vendor: string; model: string; typeCode: string }> = {
  "74:24:9f": { vendor: "Linksys / Cisco", model: "Gateway Router", typeCode: "RTR" },
  "00:1a:a1": { vendor: "Cisco Systems", model: "Catalyst 2960X", typeCode: "SWT" },
  "00:00:0c": { vendor: "Cisco Systems", model: "Core Router", typeCode: "RTR" },
  "48:8f:5a": { vendor: "MikroTik", model: "Cloud Core Router", typeCode: "RTR" },
  "74:83:c2": { vendor: "Ubiquiti", model: "UniFi Access Point", typeCode: "APT" },
  "80:2a:a8": { vendor: "Ubiquiti", model: "UniFi Dream Machine", typeCode: "RTR" },
  "f8:bc:12": { vendor: "Dell Technologies", model: "PowerEdge Server", typeCode: "SRV" },
  "d8:5e:d3": { vendor: "Dell Technologies", model: "OptiPlex Workstation", typeCode: "DT" },
  "3c:d9:2b": { vendor: "HP Inc", model: "LaserJet Enterprise", typeCode: "PRN" },
  "00:c0:b7": { vendor: "Schneider / APC", model: "Smart-UPS SNMP", typeCode: "UPS" },
  "f4:d4:88": { vendor: "Apple Inc", model: "MacBook Pro / Studio", typeCode: "LAP" },
  "3c:22:fb": { vendor: "Apple Inc", model: "Apple Device", typeCode: "DT" },
  "ac:bc:32": { vendor: "Apple Inc", model: "Apple Silicon Node", typeCode: "DT" },
  "4a:ba:09": { vendor: "Apple Inc", model: "Apple Network Device", typeCode: "LAP" },
  "4a:ba:9": { vendor: "Apple Inc", model: "Apple Network Device", typeCode: "LAP" },
  "bc:24:11": { vendor: "Samsung", model: "Smart Terminal", typeCode: "DT" },
  "00:26:73": { vendor: "Ricoh", model: "Aficio Network Printer", typeCode: "PRN" },
  "b8:27:eb": { vendor: "Raspberry Pi", model: "IoT Edge Gateway", typeCode: "SRV" },
  "dc:a6:32": { vendor: "Raspberry Pi", model: "Model 4B Compute", typeCode: "SRV" },
};

export function getLocalInterfaces(): NetworkInterfaceInfo[] {
  const result: NetworkInterfaceInfo[] = [];
  const ifaces = os.networkInterfaces();

  for (const [name, nets] of Object.entries(ifaces)) {
    if (!nets) continue;
    for (const net of nets) {
      if (!net.internal && net.family === "IPv4") {
        // Calculate subnet base: e.g. 192.168.1.139 & 255.255.255.0 -> 192.168.1.0/24
        const ipParts = net.address.split(".").map(Number);
        const maskParts = net.netmask.split(".").map(Number);
        const subnetParts = ipParts.map((p, i) => p & maskParts[i]);
        const subnet = `${subnetParts.join(".")}/24`;

        result.push({
          name,
          ip: net.address,
          netmask: net.netmask,
          cidr: `${net.address}/24`,
          subnet,
        });
      }
    }
  }

  return result;
}

export function getSystemArpTable(): { ip: string; mac: string }[] {
  try {
    const raw = cp.execSync("arp -a", { encoding: "utf8", timeout: 2500 });
    const entries: { ip: string; mac: string }[] = [];
    const regex = /\((\d+\.\d+\.\d+\.\d+)\)\s+at\s+([0-9a-fA-F:]+)/g;
    let match;

    while ((match = regex.exec(raw)) !== null) {
      const ip = match[1];
      const mac = match[2].toLowerCase();
      // Filter out broadcast, multicast, link-local
      if (
        !ip.startsWith("224.") &&
        !ip.startsWith("239.") &&
        !ip.startsWith("169.254.") &&
        !ip.endsWith(".255") &&
        mac !== "(incomplete)"
      ) {
        entries.push({ ip, mac });
      }
    }
    return entries;
  } catch {
    return [];
  }
}

export function probeTcpPort(ip: string, port: number, timeoutMs = 250): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    socket.setTimeout(timeoutMs);

    socket.on("connect", () => {
      settled = true;
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.on("error", () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(false);
      }
    });

    try {
      socket.connect(port, ip);
    } catch {
      resolve(false);
    }
  });
}

export async function reverseDns(ip: string): Promise<string> {
  try {
    const hostnames = await dns.promises.reverse(ip);
    return hostnames[0] || `${ip}.local`;
  } catch {
    return `${ip}.local`;
  }
}

export function identifyVendor(mac: string) {
  const norm = mac.toLowerCase();
  for (const [prefix, info] of Object.entries(OUI_VENDORS)) {
    if (norm.startsWith(prefix)) {
      return info;
    }
  }

  // Fallback defaults
  return {
    vendor: "Enterprise Network Hardware",
    model: "Standard Host Device",
    typeCode: "NET",
  };
}

export async function scanRealHost(ip: string, mac = "00:00:00:00:00:00"): Promise<DiscoveredHost> {
  const t0 = performance.now();
  const commonPorts = [80, 443, 22, 53, 631, 8080, 161, 3000];
  const openPorts: number[] = [];

  // Probe ports concurrently
  const portChecks = await Promise.all(
    commonPorts.map(async (p) => {
      const open = await probeTcpPort(ip, p, 300);
      return { port: p, open };
    })
  );

  for (const { port, open } of portChecks) {
    if (open) openPorts.push(port);
  }

  const latency = Math.max(0.8, Math.round((performance.now() - t0) * 10) / 10);
  const hostname = await reverseDns(ip);
  const vendorInfo = identifyVendor(mac);

  // If port 80/443/53 are open and it is .1, it is almost certainly a gateway router
  let typeCode = vendorInfo.typeCode;
  let model = vendorInfo.model;
  let vendor = vendorInfo.vendor;

  if (ip.endsWith(".1")) {
    typeCode = "RTR";
    model = "Default Gateway / Router";
  } else if (openPorts.includes(631)) {
    typeCode = "PRN";
    model = "Network Printer";
  } else if (openPorts.includes(3000) || openPorts.includes(8080)) {
    typeCode = "SRV";
    model = "Application Server Node";
  }

  return {
    ip,
    hostname,
    mac,
    vendor,
    model,
    typeCode,
    ports: openPorts,
    responseLatencyMs: latency,
    lastSeen: new Date().toISOString(),
    isRealHost: true,
  };
}
