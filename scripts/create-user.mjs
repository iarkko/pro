import { randomBytes, scrypt as scryptCallback } from "crypto";
import { promisify } from "util";
import { PrismaClient } from "@prisma/client";

const scrypt = promisify(scryptCallback);
const prisma = new PrismaClient();

const roles = {
  owner: {
    canRead: true,
    canCreate: true,
    canDelete: true,
  },
  creator: {
    canRead: true,
    canCreate: true,
    canDelete: false,
  },
  deleter: {
    canRead: true,
    canCreate: false,
    canDelete: true,
  },
  reader: {
    canRead: true,
    canCreate: false,
    canDelete: false,
  },
};

async function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString("base64url")}`;
}

function usage() {
  console.log(
    "Usage: npm run user:create -- <email> <password> [owner|creator|deleter|reader] [name]"
  );
}

const [, , rawEmail, password, role = "reader", ...nameParts] = process.argv;
const email = rawEmail?.trim().toLowerCase();
const permissions = roles[role];

if (!email || !password || !permissions) {
  usage();
  process.exit(1);
}

try {
  const passwordHash = await hashPassword(password);
  const name = nameParts.join(" ") || null;

  const user = await prisma.authUser.upsert({
    where: {
      email,
    },
    create: {
      email,
      name,
      passwordHash,
      role,
      ...permissions,
    },
    update: {
      name: name ?? undefined,
      passwordHash,
      role,
      ...permissions,
    },
    select: {
      email: true,
      role: true,
      canRead: true,
      canCreate: true,
      canDelete: true,
    },
  });

  console.log("User is ready:");
  console.log(user);
} finally {
  await prisma.$disconnect();
}
