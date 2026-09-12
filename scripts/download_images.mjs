import fs from 'fs';
import path from 'path';

const menuImages = [
  {
    filename: 'abc-kopi-susu.jpg',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'white-kopi.jpg',
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'nutrisari-leci.jpg',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'nutrisari-lemon-tea.jpg',
    url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'nutrisari-jeruk-nipis.jpg',
    url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'nutrisari-milky-oren.jpg',
    url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'wedank.jpg',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'amh.jpg',
    url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'mie-tanpa-telur.jpg',
    url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'mie-pake-telor.jpg',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
  },
  {
    filename: 'kerupuk.jpg',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
  },
];

const targetDir = path.resolve(process.cwd(), 'public/images/menu');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function run() {
  for (const item of menuImages) {
    const dest = path.join(targetDir, item.filename);
    try {
      console.log(`Downloading ${item.filename}...`);
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(arrayBuffer));
      console.log(`✓ Saved ${item.filename}`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.filename}:`, err.message);
    }
  }
  console.log('All menu image downloads finished!');
}

run();
