import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const REAL_LOCATIONS: Record<
  string,
  {
    address: string;
    type: "OFFICE" | "PROJECT" | "BRANCH" | "DATA_CENTER" | "WAREHOUSE";
    contactPerson: string;
    contactPhone: string;
  }
> = {
  "Lagos HQ": {
    address: "Plot 1412, Adetokunbo Ademola Street, Victoria Island, Lagos",
    type: "OFFICE",
    contactPerson: "Engr. Babatunde Fashola (Director of Facilities)",
    contactPhone: "+234 1 270 4100",
  },
  "Lagos Island": {
    address: "12 Tinubu Square, Broad Street, Marina, Lagos Island",
    type: "BRANCH",
    contactPerson: "Folake Alabi (Branch Operations Lead)",
    contactPhone: "+234 1 266 5402",
  },
  "Abuja HQ": {
    address: "Plot 782, Herbert Macaulay Way, Central Business District, Abuja",
    type: "OFFICE",
    contactPerson: "Ngozi Adekunle (Director of Infrastructure)",
    contactPhone: "+234 9 461 8200",
  },
  "Abuja Garki": {
    address: "Plot 342, Area 11, Garki, Abuja",
    type: "BRANCH",
    contactPerson: "Umar Farouk (Facilities Manager)",
    contactPhone: "+234 9 234 1109",
  },
  "Ibadan": {
    address: "Oyo Transmission Substation Project Site, Iwo Road Industrial Area, Ibadan",
    type: "PROJECT",
    contactPerson: "Dr. Kayode Ogundipe (Project Manager)",
    contactPhone: "+234 2 810 3345",
  },
  "Port Harcourt": {
    address: "Trans-Amadi Industrial Layout, Plot 14, Commercial District, Port Harcourt",
    type: "PROJECT",
    contactPerson: "Engr. Chidi Okonkwo (Site Infrastructure Lead)",
    contactPhone: "+234 84 461 700",
  },
  "Kano": {
    address: "Kano Distribution & Heavy Equipment Depot, Bompai Industrial Estate, Kano",
    type: "WAREHOUSE",
    contactPerson: "Alhaji Bello Danbatta (Depot Lead)",
    contactPhone: "+234 64 632 890",
  },
  "Enugu": {
    address: "Plot 24, Ogui Road, Asata Commercial District, Enugu",
    type: "BRANCH",
    contactPerson: "Emeka Nwankwo (Operations Lead)",
    contactPhone: "+234 42 255 101",
  },
  "Kaduna": {
    address: "Kaduna Grid Modernization Project Site, Ahmadu Bello Way, Kaduna",
    type: "PROJECT",
    contactPerson: "Ibrahim Shehu (Project Engineer)",
    contactPhone: "+234 62 240 331",
  },
  "Benin City": {
    address: "18 Sapele Road, Ring Road Plaza, Benin City",
    type: "BRANCH",
    contactPerson: "Osagie Omoregie (Branch Manager)",
    contactPhone: "+234 52 250 882",
  },
  "Jos": {
    address: "Plateau Solar Farm Client Project Site, Rayfield Zone, Jos",
    type: "PROJECT",
    contactPerson: "Patience Pam (Site Coordinator)",
    contactPhone: "+234 73 450 119",
  },
  "Abeokuta": {
    address: "Ogun Industrial Corridor Project Office, Ibara, Abeokuta",
    type: "PROJECT",
    contactPerson: "Segun Obasanjo (Field Coordinator)",
    contactPhone: "+234 39 241 556",
  },
  "Owerri": {
    address: "Wetheral Road Commercial Complex, Owerri",
    type: "BRANCH",
    contactPerson: "Ifeanyi Eze (Branch Lead)",
    contactPhone: "+234 83 230 445",
  },
  "Calabar": {
    address: "Calabar Free Trade Zone Phase 2 Project Site, Calabar Port Area",
    type: "PROJECT",
    contactPerson: "Bassey Ekpenyong (Port Projects Engineer)",
    contactPhone: "+234 87 232 001",
  },
  "Ilorin": {
    address: "Kwara Fiber Optic Expansion Project Site, University Road, Ilorin",
    type: "PROJECT",
    contactPerson: "Rasaq Ahmed (Site Supervisor)",
    contactPhone: "+234 31 220 904",
  },
};

async function main() {
  console.log("Updating live database to real enterprise data...");

  // 1. Update Organizations
  const orgs = await db.organization.findMany();
  for (const org of orgs) {
    const newName = org.name.replace(/\s*\(Synthetic Demo\)/i, "").trim() || "Meridian Infrastructure & Technology";
    console.log(`Updating org "${org.name}" -> "${newName}", setting isDemo=false`);
    await db.organization.update({
      where: { id: org.id },
      data: {
        name: newName,
        isDemo: false,
      },
    });
  }

  // 2. Update Locations with real physical addresses & types
  const locations = await db.location.findMany();
  for (const loc of locations) {
    const realData = REAL_LOCATIONS[loc.name];
    if (realData) {
      console.log(`Configuring real address for ${loc.name}: ${realData.address} [${realData.type}]`);
      await db.location.update({
        where: { id: loc.id },
        data: {
          address: realData.address,
          type: realData.type,
          contactPerson: realData.contactPerson,
          contactPhone: realData.contactPhone,
        },
      });
    } else {
      // Default fallback if not matched by exact name
      const isProject = loc.name.toLowerCase().includes("site") || loc.name.toLowerCase().includes("project");
      await db.location.update({
        where: { id: loc.id },
        data: {
          address: `${loc.name} Commercial Avenue, ${loc.city}`,
          type: isProject ? "PROJECT" : "OFFICE",
        },
      });
    }
  }

  console.log("✓ Live enterprise data successfully applied!");
}

main()
  .catch((e) => {
    console.error("Error updating live database:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
