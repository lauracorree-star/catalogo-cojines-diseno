export const WHATSAPP_NUMBER = '573162685572';

export const CATEGORIES = [
  {
    id: 'all',
    name: 'Toda la Colección',
    shortName: 'Todos',
    subtitle: '25 diseños exclusivos listos para transformar tu hogar',
    badge: '25 diseños',
  },
  {
    id: 'nav',
    name: 'Navidad Clásica',
    shortName: '🎄 Navidad',
    subtitle: 'Clásicos festivos, villas navideñas, pinos y muñecos de jengibre',
    badge: '8 diseños',
  },
  {
    id: 'gatos',
    name: 'Colección Gatos',
    shortName: '🐱 Gatos',
    subtitle: 'Ilustraciones en acuarela y texturas con personalidad única',
    badge: '8 diseños',
  },
  {
    id: 'disney',
    name: 'Disney & Stitch',
    shortName: '✨ Disney & Stitch',
    subtitle: 'La magia de Mickey, Minnie y Stitch para grandes y pequeños',
    badge: '4 diseños',
  },
  {
    id: 'deco',
    name: 'Decorativa & Lino',
    shortName: '🛋️ Decorativa y Lino',
    subtitle: 'Minimalismo cálido, lino tejido 30×50 cm y acentos en rojo profundo',
    badge: '5 diseños',
  },
  {
    id: 'doble-faz',
    name: 'Diseños Doble Faz',
    shortName: '🔄 Doble Faz',
    subtitle: 'Estampados por ambas caras para lucir desde cualquier ángulo',
    badge: '11 diseños',
  },
];

// Inventario completo V3 (25 productos) con booleano explícito isDF para filtrado infalible
export const PRODUCTS = [
  // Navidad (nav)
  {
    id: 1,
    n: 'Árbol Rojo',
    p: 20000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'Arbol_rojo.jpeg',
    c: 'nav',
    desc: 'Diseño festivo con árbol navideño en tonos cálidos y detalles rojos que resaltan en sofás claros o grises. Estampado por ambas caras.',
  },
  {
    id: 2,
    n: 'Bolas de Navidad',
    p: 20000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'Bolas_de_navidad.jpeg',
    c: 'nav',
    desc: 'Composición elegante de esferas navideñas tradicionales con acabado nítido de doble faz y tacto suave.',
  },
  {
    id: 6,
    n: 'Copo de Nieve',
    p: 20000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'copo_de_nieve.jpeg',
    c: 'nav',
    desc: 'Motivo invernal de copos de nieve sobre fondo cálido, ideal para combinar con tonos vino y verde pino. Diseño doble faz.',
  },
  {
    id: 15,
    n: 'Jengibre 1',
    p: 15000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Jengibre_1.jpeg',
    c: 'nav',
    desc: 'Dulce diseño navideño estilo Gingerbread Bakery que aporta ternura y calidez a cualquier rincón de tu sala.',
  },
  {
    id: 16,
    n: 'Jengibre 2',
    p: 15000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Jengibre_2.jpeg',
    c: 'nav',
    desc: 'Segunda variación de galletas de jengibre y bastones de caramelo, perfecta para hacer juego en pareja con Jengibre 1.',
  },
  {
    id: 19,
    n: 'Papá Noel 1',
    p: 15000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Papa_noel_1.jpeg',
    c: 'nav',
    desc: 'Ilustración artística de Papá Noel en acabado tipo acuarela de trazos suaves y colores vibrantes.',
  },
  {
    id: 20,
    n: 'Papá Noel 2',
    p: 15000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Papa_noel_2.jpeg',
    c: 'nav',
    desc: 'Retrato clásico navideño de Santa Claus en técnica acuarela para dar un toque tradicional y acogedor.',
  },
  {
    id: 21,
    n: 'Pinos 3D',
    p: 50000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'No',
    isDF: false,
    st: 2,
    img: 'Pinos_3d.jpeg',
    c: 'nav',
    limited: true,
    desc: 'Pieza protagonista de edición especial con relieve visual de pinos navideños. El acento de lujo ideal para el centro de tu sofá.',
  },

  // Gatos (gatos)
  {
    id: 7,
    n: 'Gato Gris',
    p: 25000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Gato_gris.jpeg',
    c: 'gatos',
    desc: 'Tierno gatito gris atigrado con bufanda navideña roja y copos de nieve en estilo acuarela.',
  },
  {
    id: 8,
    n: 'Gato Naranja',
    p: 25000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Gato_Naranja.jpeg',
    c: 'gatos',
    desc: 'Gato naranja festivo lleno de carisma y calidez, imprescindible para los amantes de los felinos.',
  },
  {
    id: 9,
    n: 'Gato Negro 1',
    p: 25000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'Gato_negro_1.jpeg',
    c: 'gatos',
    desc: 'Gato negro curioso jugando con esferas navideñas y gorro de Santa. Estampado doble faz de alta definición.',
  },
  {
    id: 10,
    n: 'Gato Negro 2',
    p: 25000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'Gato_negro_2.jpeg',
    c: 'gatos',
    desc: 'Diseño exclusivo de gato negro navideño en acabado acuarela con estampado por ambas caras (doble faz).',
  },
  {
    id: 11,
    n: 'Gato Negro 3',
    p: 25000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Gato_negro_3.jpeg',
    c: 'gatos',
    desc: 'Expresivo gato negro de ojos azules intensos y gorro tejido rojo sobre fondo texturizado.',
  },
  {
    id: 12,
    n: 'Gato Negro 4',
    p: 25000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'Gato_negro_4.jpeg',
    c: 'gatos',
    desc: 'Escena nocturna junto al árbol iluminado y regalos con gato negro de corbatín rojo. Doble faz.',
  },
  {
    id: 13,
    n: 'Gato Negro 5',
    p: 25000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'Gato_negro_5.jpeg',
    c: 'gatos',
    desc: 'Gato negro con bufanda roja frente al pino de Navidad y regalos. Estampado en ambas caras.',
  },
  {
    id: 14,
    n: 'Gato Ojos Azules',
    p: 25000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Gato_Ojos_azul.jpeg',
    c: 'gatos',
    desc: 'Mirada hipnótica en tonos zafiro con motivos navideños, una pieza que roba todas las miradas en la sala.',
  },

  // Disney & Stitch (disney)
  {
    id: 17,
    n: 'Mickey Clásico',
    p: 40000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'Mickey_1.jpeg',
    c: 'disney',
    desc: 'El icónico Mickey Mouse con gorro navideño sobre fondo crema. Doble faz con colores vibrantes.',
  },
  {
    id: 18,
    n: 'Mickey & Minnie',
    p: 40000,
    s: '30 × 50 cm',
    m: 'Lino',
    e: 'Tejido',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Micky_minnie.jpeg',
    c: 'disney',
    desc: 'Cojín rectangular lumbar en lino tejido estilo nórdico con Mickey y Minnie navideños. Textura premium.',
  },
  {
    id: 24,
    n: 'Stitch 1',
    p: 40000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'sticht_1.jpeg',
    c: 'disney',
    desc: 'Stitch en versión navideña llena de color y alegría. Diseño doble faz ideal para camas o salas familiares.',
  },
  {
    id: 25,
    n: 'Stitch 2',
    p: 40000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'Sí',
    isDF: true,
    st: 1,
    img: 'sticht_2.jpeg',
    c: 'disney',
    desc: 'Segunda edición de Stitch navideño en doble faz, perfecta para combinar con Stitch 1 o regalar.',
  },

  // Decorativa y nuevos diseños (deco)
  {
    id: 3,
    n: 'Ciervo',
    p: 15000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Acuarela',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'Ciervo.jpeg',
    c: 'deco',
    desc: 'Ilustración nórdica de ciervo invernal con astas decoradas, ideal para ambientes elegantes y serenos.',
  },
  {
    id: 4,
    n: 'Contraste Blanco',
    p: 25000,
    s: '30 × 50 cm',
    m: 'Lino',
    e: 'Tejido',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'contraste_blanco.jpeg',
    c: 'deco',
    desc: 'Funda rectangular lumbar en lino tejido color crema con pinos, ciervo y copos bordados en rojo vino.',
  },
  {
    id: 5,
    n: 'Contraste Rojo',
    p: 25000,
    s: '30 × 50 cm',
    m: 'Lino',
    e: 'Tejido',
    df: 'No',
    isDF: false,
    st: 1,
    img: 'contraste_rojo.jpeg',
    c: 'deco',
    desc: 'Funda rectangular 30×50 cm en lino tejido rojo festivo con motivos blancos en contraste para el centro del sofá.',
  },
  {
    id: 22,
    n: 'Rojo Sólido 1',
    p: 15000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'No',
    isDF: false,
    st: 4,
    img: 'rojo_1.jpeg',
    c: 'deco',
    desc: 'Base unicolor en rojo navideño intenso que equilibra los diseños estampados. ¡4 unidades disponibles para armar tu set!',
  },
  {
    id: 23,
    n: 'Rojo Sólido 2',
    p: 20000,
    s: '45 × 45 cm',
    m: 'Poliéster',
    e: 'Estampado 2D',
    df: 'Por confirmar',
    isDF: false,
    st: 1,
    img: 'Rojo_2.jpeg',
    c: 'deco',
    desc: 'Tono rojo profundo con sutil acabado festivo para dar contraste y volumen a tus cojines decorativos.',
  },
];

export const AMBIENTACIONES = [
  {
    id: 'amb-1',
    img: 'v3_amb_1.jpg',
    title: 'Sala Principal · Mezcla Festiva',
    caption: 'Combinación de Gato Gris, Mickey Clásico y Gato Negro 5 con bases en tonos vino y verde pino.',
    category: 'all',
  },
  {
    id: 'amb-2',
    img: 'amb_6.jpg',
    title: 'Set Familiar · Lino 30×50 + Cuadrados 45×45',
    caption: 'Contraste Blanco y Mickey & Minnie en lino acompañados de la colección de Gatos.',
    category: 'disney',
  },
  {
    id: 'amb-3',
    img: 'amb_7.jpg',
    title: 'Rincón Cálido · Acuarela & Tradición',
    caption: 'Papá Noel, Jengibre y Gato Negro 3 resaltando sobre sofá beige.',
    category: 'nav',
  },
  {
    id: 'amb-4',
    img: 'amb_8.jpg',
    title: 'Equilibrio Nórdico · Texturas & Ciervo',
    caption: 'Funda Ciervo y Jengibre combinadas con rojo intenso y mantas tejidas.',
    category: 'deco',
  },
  {
    id: 'amb-5',
    img: 'v3_amb_3.jpg',
    title: 'Inspiración Navidad Clásica',
    caption: 'Diseños navideños que transforman tu sala en segundos.',
    category: 'nav',
  },
  {
    id: 'amb-6',
    img: 'v3_amb_4.jpg',
    title: 'Especial Amantes de los Gatos',
    caption: 'Acuarelas exclusivas que dan vida y ternura a tus espacios.',
    category: 'gatos',
  },
];

export const formatCOP = (amount) => '$' + Number(amount).toLocaleString('es-CO');

export function calculateOrder(cart, products = PRODUCTS, zona = 'novaterra') {
  let units = 0;
  let sub = 0;
  const items = [];

  for (const id of Object.keys(cart)) {
    const qty = cart[id];
    if (qty > 0) {
      const product = products.find((x) => x.id === Number(id));
      if (product) {
        units += qty;
        sub += product.p * qty;
        items.push({ ...product, qty, lineTotal: product.p * qty });
      }
    }
  }

  const rate = units >= 5 ? 0.15 : units >= 3 ? 0.1 : 0;
  const discount = Math.round(sub * rate);
  const envio = units === 0 ? 0 : zona === 'novaterra' ? 0 : units > 3 ? 0 : 5000;
  const total = sub - discount + envio;

  let nextGoalText = '';
  let progressPercent = 0;
  let badgeState = 'none';

  if (units === 0) {
    nextGoalText = '🎁 Agrega 3 fundas para ganar 10% DTO o 5+ para 15% DTO + Envío Gratis';
    progressPercent = 0;
  } else if (units < 3) {
    const missing = 3 - units;
    nextGoalText = `🔥 ¡Te ${missing === 1 ? 'falta solo 1 funda' : `faltan ${missing} fundas`} para desbloquear 10% DE DESCUENTO!`;
    progressPercent = Math.round((units / 5) * 100);
    badgeState = 'almost-10';
  } else if (units === 3) {
    nextGoalText =
      zona === 'mosquera'
        ? '🎉 ¡Ya tienes 10% DTO! Agrega 1 funda más para ENVÍO GRATIS en Mosquera (o 2 para 15% DTO)'
        : '🎉 ¡Ya tienes 10% DTO + Envío Gratis! Agrega 2 fundas más para subir al 15% DTO';
    progressPercent = 65;
    badgeState = 'unlocked-10';
  } else if (units === 4) {
    nextGoalText = '✨ ¡Ya tienes 10% DTO + Envío Gratis! Agrega solo 1 funda más para el 15% DE DESCUENTO';
    progressPercent = 85;
    badgeState = 'unlocked-10-free';
  } else {
    nextGoalText = '🏆 ¡Felicidades! Desbloqueaste el MÁXIMO AHORRO: 15% DTO + Entrega Gratis';
    progressPercent = 100;
    badgeState = 'unlocked-15';
  }

  return {
    items,
    units,
    sub,
    rate,
    discount,
    envio,
    total,
    nextGoalText,
    progressPercent,
    badgeState,
  };
}
