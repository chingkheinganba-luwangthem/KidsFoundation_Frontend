const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const logoPath = path.join(__dirname, '../public/images/logo.png');
  if (!fs.existsSync(logoPath)) {
    console.error('Logo not found at:', logoPath);
    process.exit(1);
  }

  // Focus directly on the circular emblem so the circle is prominent and large (~92% of the canvas)
  const cropW = 1900;
  const cropH = 1783;
  const canvasSize = 1900;
  const padTop = Math.floor((canvasSize - cropH) / 2); // 58px
  const padBottom = canvasSize - cropH - padTop;      // 59px

  const masterSquare = await sharp(logoPath)
    .extract({ left: 0, top: 0, width: cropW, height: cropH })
    .extend({
      top: padTop,
      bottom: padBottom,
      left: 0,
      right: 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  // Generate PNG sizes
  const icon512 = await sharp(masterSquare).resize(512, 512).png().toBuffer();
  const icon180 = await sharp(masterSquare).resize(180, 180).png().toBuffer();
  const icon48 = await sharp(masterSquare).resize(48, 48).png().toBuffer();
  const icon32 = await sharp(masterSquare).resize(32, 32).png().toBuffer();
  const icon16 = await sharp(masterSquare).resize(16, 16).png().toBuffer();

  // Save active icons
  fs.writeFileSync(path.join(__dirname, '../public/icon.png'), icon512);
  fs.writeFileSync(path.join(__dirname, '../public/apple-icon.png'), icon180);
  fs.writeFileSync(path.join(__dirname, '../src/app/icon.png'), icon512);
  fs.writeFileSync(path.join(__dirname, '../src/app/apple-icon.png'), icon180);

  // Build multi-resolution ICO (16x16, 32x32, 48x48)
  const icoImages = [
    { width: 16, height: 16, buffer: icon16 },
    { width: 32, height: 32, buffer: icon32 },
    { width: 48, height: 48, buffer: icon48 },
  ];

  const headerLen = 6;
  const dirEntryLen = 16;
  let offset = headerLen + dirEntryLen * icoImages.length;

  const header = Buffer.alloc(headerLen);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(icoImages.length, 4); // count

  const entries = [];
  for (const img of icoImages) {
    const entry = Buffer.alloc(dirEntryLen);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);

    offset += img.buffer.length;
    entries.push(entry);
  }

  const icoBuffer = Buffer.concat([
    header,
    ...entries,
    ...icoImages.map(img => img.buffer)
  ]);

  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, '../src/app/favicon.ico'), icoBuffer);

  // Remove and delete unused duplicate / legacy icons
  const unusedFiles = [
    '../public/icon-512.png',
    '../public/icon-192.png',
    '../public/favicon.png',
    '../public/b8ed519991ab7927143ff3077d08e83150cfcf85 (1).png',
    '../public/test-served-primary.jpg',
    '../public/variant_2150.png',
    '../public/variant_2000.png',
    '../public/variant_1900.png',
    '../public/test_circular_favicon.png',
    '../public/test_ico_32.png',
  ];

  for (const rel of unusedFiles) {
    const target = path.join(__dirname, rel);
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
      console.log('Deleted unused:', path.basename(target));
    }
  }

  console.log('✅ Generated clean active favicons and removed unused files!');
}

generate().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
