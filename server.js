const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const products = [
  {
    id: 1,
    name: 'Costume Parisien',
    category: 'Costumes',
    price: 420,
    image: 'carrousel (1).jpeg',
    badge: 'Nouveau',
    desc: 'Une coupe structurée et un tissu noble pour une silhouette élégante en toute occasion.'
  },
  {
    id: 2,
    name: 'Veste Atelier',
    category: 'Vestes',
    price: 260,
    image: 'vestes/veste (1).jpeg',
    badge: '',
    desc: 'Une veste contemporaine aux finitions soignées, pensée pour traverser les saisons.'
  },
  {
    id: 3,
    name: 'Chemise Blanche',
    category: 'Chemises',
    price: 95,
    image: 'CHEMISE/chemise (1).jpeg',
    badge: '',
    desc: 'Une chemise essentielle en coton doux, taillée pour une allure nette et naturelle.'
  },
  {
    id: 4,
    name: 'Mocassins DLT',
    category: 'Accessoires',
    price: 180,
    image: 'ACCESSOIRES/accessoire (1).jpeg',
    badge: 'Bestseller',
    desc: 'Des mocassins en cuir qui ajoutent une note intemporelle à chaque tenue.'
  },
  {
    id: 5,
    name: 'Pantalon Signature',
    category: 'PANTALON',
    price: 155,
    image: 'PANTALON/pantalon (1).jpeg',
    badge: '',
    desc: 'Une ligne précise et confortable, conçue pour accompagner les journées les plus longues.'
  },
  {
    id: 6,
    name: 'Cravate Soie',
    category: 'Accessoires',
    price: 48,
    image: 'ACCESSOIRES/accessoire (2).jpeg',
    badge: '',
    desc: 'Une cravate en soie aux motifs discrets pour signer une tenue avec distinction.'
  },
  {
    id: 7,
    name: 'Manteau Héritage',
    category: 'Vestes',
    price: 380,
    image: 'vestes/veste (2).jpeg',
    badge: '',
    desc: 'Un manteau chaud et raffiné inspiré du vestiaire parisien traditionnel.'
  },
  {
    id: 8,
    name: 'Pull Mérinos',
    category: 'Chemises',
    price: 130,
    image: 'CHEMISE/chemise (2).jpeg',
    badge: 'Nouveau',
    desc: 'Une maille fine en mérinos pour une allure sobre, confortable et durable.'
  },
  {
    id: 9,
    name: 'Robe Nuit Paris',
    category: 'Robes de soirée',
    price: 290,
    image: 'carrousel (9).jpeg',
    badge: 'Édition femme',
    desc: 'Une robe de soirée fluide et élégante pour les silhouettes qui aiment briller.'
  },
  {
    id: 10,
    name: 'Robe Mariage Ivoire',
    category: 'Mariage',
    price: 520,
    image: 'MARIAGE/mariage (1).jpeg',
    badge: 'Mariage',
    desc: 'Une création délicate pensée pour accompagner les instants les plus précieux.'
  },
  {
    id: 11,
    name: 'Ensemble Cérémonie',
    category: 'Mariage',
    price: 340,
    image: 'MARIAGE/mariage (2).jpeg',
    badge: '',
    desc: 'Une tenue de cérémonie raffinée pour homme ou femme, dans des matières nobles.'
  }
];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === '/api/products' && req.method === 'GET') {
    sendJson(res, 200, { products });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  let filePath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  filePath = decodeURIComponent(filePath);

  const safePath = path.normalize(filePath).replace(/^([.][.][\/\\])+/, '');
  const absolutePath = path.resolve(ROOT, '.' + safePath);

  if (!absolutePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(absolutePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(absolutePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Internal server error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`DLT Boutique running on http://localhost:${PORT}`);
});
