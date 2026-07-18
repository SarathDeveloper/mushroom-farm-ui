import "dotenv/config";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const FOLDER = "mushroom-farm/products";
const PUBLIC_DIR = path.resolve(process.cwd(), "public");

function isCloudinarySrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:"))
    return false;
  if (src.includes("res.cloudinary.com")) return true;
  if (!/^https?:\/\//i.test(src)) return true;
  return false;
}

function toCloudinaryPublicId(src: string): string {
  if (!src.includes("res.cloudinary.com")) return src;
  try {
    const pathname = new URL(src).pathname;
    const match = pathname.match(/\/upload\/(?:(?:[^/]+\/)*?v\d+\/)?(.+)$/);
    if (!match?.[1]) return src;
    return match[1].replace(/\.[a-z0-9]+$/i, "");
  } catch {
    return src;
  }
}

function derivePublicId(localPath: string): string {
  const basename = path.basename(localPath, path.extname(localPath));
  return `${FOLDER}/${basename}`;
}

async function uploadImage(
  src: string,
  slug: string,
  index: number
): Promise<string> {
  if (isCloudinarySrc(src)) {
    return toCloudinaryPublicId(src);
  }

  if (src.startsWith("/")) {
    const filePath = path.join(PUBLIC_DIR, src);
    if (!fs.existsSync(filePath)) {
      console.warn(`  [SKIP] File not found: ${filePath}`);
      return "";
    }
    const publicId = derivePublicId(src);
    console.log(`  Uploading local: ${src} → ${publicId}`);
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });
    return result.public_id;
  }

  if (/^https?:\/\//i.test(src)) {
    const publicId = `${FOLDER}/${slug}-${index}`;
    console.log(`  Uploading remote: ${src.substring(0, 60)}... → ${publicId}`);
    try {
      const result = await cloudinary.uploader.upload(src, {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      });
      return result.public_id;
    } catch (err: any) {
      console.warn(`  [SKIP] Remote upload failed (${err.http_code || err.message}): ${src.substring(0, 80)}`);
      return "";
    }
  }

  return src;
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, images: true },
  });

  console.log(`Found ${products.length} products to process.\n`);

  const results: Record<string, string[]> = {};

  for (const product of products) {
    console.log(`[${product.slug}]`);
    const newImages: string[] = [];

    for (let i = 0; i < product.images.length; i++) {
      const src = product.images[i];
      const publicId = await uploadImage(src, product.slug, i);
      if (publicId) {
        newImages.push(publicId);
      }
    }

    if (newImages.length === 0) {
      console.log(`  WARNING: No images resolved, skipping DB update.\n`);
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { images: newImages },
    });

    results[product.slug] = newImages;
    console.log(`  Updated DB: [${newImages.join(", ")}]\n`);
  }

  console.log("\n=== MIGRATION COMPLETE ===");
  console.log("Public IDs for seed data:\n");
  console.log(JSON.stringify(results, null, 2));
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
