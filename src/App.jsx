import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Check,
  Plus,
  Minus,
  Trash2,
  Search,
  ZoomIn,
  X,
  Truck,
  ShieldCheck,
  MessageCircle,
  Gift,
  SlidersHorizontal,
  ArrowRight,
  Star,
  MapPin,
  Eye,
} from 'lucide-react';
import {
  PRODUCTS,
  CATEGORIES,
  AMBIENTACIONES,
  WHATSAPP_NUMBER,
  formatCOP,
  calculateOrder,
} from './data/products';

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('catalogo_cojines_cart_v3');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyDoubleSided, setOnlyDoubleSided] = useState(false);
  const [onlyLinen, setOnlyLinen] = useState(false);
  const [onlyBudget, setOnlyBudget] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [zona, setZona] = useState('novaterra');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedAmb, setSelectedAmb] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('catalogo_cojines_cart_v3', JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const addItem = (id) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    const currentQty = cart[id] || 0;
    if (currentQty >= product.st) {
      showToast(
        `¡Atención! Solo ${product.st === 1 ? 'queda 1 unidad disponible' : `quedan ${product.st} unidades`} de "${product.n}".`
      );
      return;
    }
    const nextQty = currentQty + 1;
    setCart((prev) => ({ ...prev, [id]: nextQty }));
    showToast(`✓ Agregaste "${product.n}" a tu pedido`);
  };

  const subItem = (id) => {
    setCart((prev) => {
      const currentQty = (prev[id] || 0) - 1;
      const copy = { ...prev };
      if (currentQty <= 0) {
        delete copy[id];
      } else {
        copy[id] = currentQty;
      }
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
    showToast('Pedido vaciado');
  };

  const toggleDoubleSidedFilter = () => {
    const nextVal = !onlyDoubleSided;
    setOnlyDoubleSided(nextVal);
    if (nextVal && activeCategory === 'deco') {
      // 'deco' has 0 double-sided items, switch to 'all' so user sees the 11 double-sided items
      setActiveCategory('all');
    }
    if (nextVal && onlyLinen) {
      // Linen 30x50 items are single-sided, untoggle linen so results aren't empty
      setOnlyLinen(false);
    }
    showToast(
      nextVal
        ? '🔄 Filtrando: Solo fundas Doble Faz'
        : 'Mostrando fundas de una y doble faz'
    );
  };

  const order = useMemo(() => calculateOrder(cart, PRODUCTS, zona), [cart, zona]);

  const isDoubleSidedActive =
    onlyDoubleSided || activeCategory === 'doble-faz' || sortBy === 'only-df';

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (activeCategory !== 'all' && activeCategory !== 'doble-faz' && p.c !== activeCategory) {
        return false;
      }
      if (isDoubleSidedActive && !p.isDF) return false;
      if (onlyLinen && p.m !== 'Lino') return false;
      if (onlyBudget && p.p > 15000) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.n.toLowerCase().includes(q);
        const matchMat = p.m.toLowerCase().includes(q);
        const matchStyle = p.e.toLowerCase().includes(q);
        const matchSize = p.s.toLowerCase().includes(q);
        const matchDF =
          (q.includes('doble') && p.isDF) || (q.includes('una faz') && !p.isDF);
        if (!matchName && !matchMat && !matchStyle && !matchSize && !matchDF) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.p - b.p;
      if (sortBy === 'price-desc') return b.p - a.p;
      if (sortBy === 'double-sided') return (b.isDF ? 1 : 0) - (a.isDF ? 1 : 0);
      return 0;
    });
  }, [activeCategory, isDoubleSidedActive, onlyLinen, onlyBudget, searchQuery, sortBy]);

  const upsellProducts = useMemo(() => {
    return PRODUCTS.filter((p) => (cart[p.id] || 0) < p.st).slice(0, 3);
  }, [cart]);

  const whatsappOrderUrl = useMemo(() => {
    if (order.units === 0) {
      const defaultMsg =
        '¡Hola! 🎄 Vi el catálogo digital de la Colección de Fundas Navideñas y me gustaría recibir asesoría.';
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMsg)}`;
    }

    let msg = '¡Hola! 🎄 Quiero realizar el siguiente pedido de fundas del catálogo:\n\n';
    order.items.forEach((item) => {
      msg += `• ${item.qty}x *${item.n}* (${item.s} · ${item.m}) — ${formatCOP(item.lineTotal)}\n`;
    });

    msg += `\n📦 *Total unidades:* ${order.units} funda${order.units > 1 ? 's' : ''}`;
    msg += `\n💵 *Subtotal:* ${formatCOP(order.sub)}`;
    if (order.discount > 0) {
      msg += `\n🎁 *Descuento Kit (${Math.round(order.rate * 100)}% DTO):* −${formatCOP(order.discount)}`;
    }
    const zonaLabel = zona === 'novaterra' ? 'Novaterra' : 'Mosquera';
    msg += `\n🚚 *Entrega (${zonaLabel}):* ${order.envio === 0 ? 'GRATIS' : formatCOP(order.envio)}`;
    msg += `\n✨ *TOTAL A PAGAR: ${formatCOP(order.total)}*\n`;

    if (customerName.trim()) {
      msg += `\n👤 *Cliente:* ${customerName.trim()}`;
    }
    if (customerAddress.trim()) {
      msg += `\n📍 *Conjunto / Dirección:* ${customerAddress.trim()}`;
    }

    msg += '\n\n¿Me confirman disponibilidad y medios de pago para coordinar la entrega? ¡Gracias!';
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, [order, zona, customerName, customerAddress]);

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setOnlyDoubleSided(false);
    setOnlyLinen(false);
    setOnlyBudget(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-charcoal pb-24 md:pb-0">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] bg-evergreen text-snowfall px-5 py-2.5 rounded-full shadow-2xl border border-gold flex items-center gap-2 text-xs sm:text-sm font-semibold animate-bounce">
          <Sparkles className="w-4 h-4 text-gold shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sticky Top Gamified Discount Progress Bar */}
      <div className="sticky top-0 z-50 bg-wine text-snowfall border-b border-gold/30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs sm:text-sm">
            <p className="font-medium text-center sm:text-left tracking-wide flex items-center gap-1.5">
              <span>{order.nextGoalText}</span>
            </p>
            <div className="flex items-center gap-3 w-full sm:w-56">
              <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-gold/30">
                <div
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                  style={{ width: `${order.progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-gold-light whitespace-nowrap">
                {order.units}/5 uds
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar (Includes Top WhatsApp CTA + Cart Button) */}
        <header className="bg-[#2b2320]/95 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <a href="#" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-snickerdoodle flex items-center justify-center text-wine font-serif font-bold text-lg shadow-inner">
                C
              </div>
              <div>
                <span className="font-serif text-base sm:text-lg font-bold text-gold-light tracking-wide block leading-none">
                  Colección de Fundas
                </span>
                <span className="text-[10px] uppercase tracking-[2.5px] text-snickerdoodle block mt-0.5">
                  Edición Hogar & Navidad
                </span>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-semibold text-snowfall/80">
              <a href="#catalogo" className="hover:text-gold-light transition-colors">
                Catálogo (25)
              </a>
              <a href="#promociones" className="hover:text-gold-light transition-colors">
                Kits de Ahorro
              </a>
              <a href="#inspiracion" className="hover:text-gold-light transition-colors">
                Inspiración Sala
              </a>
              <a href="#garantia" className="hover:text-gold-light transition-colors">
                Envíos & Garantía
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Top Header WhatsApp Direct Button */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25d366] hover:brightness-110 text-white font-bold px-3.5 py-2 rounded-full text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02] active:scale-95"
                title="Escribir o enviar pedido por WhatsApp"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">
                  {order.units > 0 ? 'Pedir por WhatsApp' : 'WhatsApp'}
                </span>
              </a>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-wine font-bold px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Tu Pedido</span>
                <span className="bg-wine text-gold-light px-2 py-0.5 rounded-full text-xs font-extrabold">
                  {order.units}
                </span>
                {order.units > 0 && (
                  <span className="hidden xl:inline font-extrabold border-l border-wine/20 pl-2">
                    {formatCOP(order.total)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ============ HERO SECTION ============ */}
      <section className="bg-festive-berry text-snowfall relative overflow-hidden py-10 sm:py-16 lg:py-20 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-gold/40 text-gold-light text-xs uppercase tracking-[2.5px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Temporada Navideña · Stock Limitado
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight">
              Transforma tu sala en segundos con{' '}
              <span className="italic font-normal text-gold-light">calidez y estilo</span>
            </h1>

            <p className="text-snowfall/90 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Fundas decorativas exclusivas en <strong>Poliéster suave (45×45 cm)</strong> y{' '}
              <strong>Lino tejido premium (30×50 cm)</strong>. Desde clásicos navideños hasta gatos en
              acuarela y colección Disney & Stitch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl mx-auto lg:mx-0 text-left">
              <div className="bg-black/25 backdrop-blur-sm border border-gold/25 rounded-2xl p-3.5 flex items-start gap-3">
                <Gift className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-gold-light uppercase tracking-wider">
                    Kits de Ahorro
                  </div>
                  <p className="text-xs text-snowfall/85 mt-0.5">
                    3+ fundas: <strong>10% DTO</strong> · 5+ fundas: <strong>15% DTO</strong>
                  </p>
                </div>
              </div>

              <div className="bg-black/25 backdrop-blur-sm border border-gold/25 rounded-2xl p-3.5 flex items-start gap-3">
                <Truck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-gold-light uppercase tracking-wider">
                    Entrega Local
                  </div>
                  <p className="text-xs text-snowfall/85 mt-0.5">
                    <strong>Gratis en Novaterra</strong> y gratis en Mosquera desde 4 uds
                  </p>
                </div>
              </div>

              <div className="bg-black/25 backdrop-blur-sm border border-gold/25 rounded-2xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-gold-light uppercase tracking-wider">
                    Compra Segura
                  </div>
                  <p className="text-xs text-snowfall/85 mt-0.5">
                    Cambios dentro de <strong>7 días</strong> si no es lo que esperabas
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-wine font-extrabold px-7 py-3.5 rounded-full text-sm sm:text-base shadow-xl transition-transform hover:-translate-y-0.5"
              >
                Ver los 25 Diseños
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25d366] hover:brightness-110 text-white font-bold px-6 py-3.5 rounded-full text-sm sm:text-base shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Asesoría por WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-3xl overflow-hidden border-4 sm:border-8 border-white/95 shadow-[0_25px_60px_rgba(0,0,0,0.55)] relative group">
                <img
                  src="/images/v3_amb_1.jpg"
                  alt="Sala decorada con colección de fundas navideñas"
                  className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 text-white">
                  <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15">
                    <span className="text-[10px] uppercase tracking-widest text-gold-light block font-semibold">
                      Ambientación Real
                    </span>
                    <span className="text-xs sm:text-sm font-medium">
                      Mezcla de Gato Gris, Mickey Clásico y Pino
                    </span>
                  </div>
                  <div className="bg-gold text-wine font-extrabold px-3.5 py-2 rounded-2xl text-xs sm:text-sm shadow-lg shrink-0">
                    Desde $15.000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ INTERACTIVE KITS & PROMO BANNER ============ */}
      <section id="promociones" className="bg-festive-cream py-10 sm:py-12 border-b border-kraft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[3px] font-bold text-berry block">
                Promociones Automáticas en tu Carrito
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine mt-1">
                Arma tu Kit a tu gusto y ahorra hasta 15%
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted max-w-md">
              Combina cualquier categoría, tamaño o textura. El descuento se aplica automáticamente al
              agregar 3 o más fundas a tu pedido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div
              className={`rounded-2xl p-5 sm:p-6 border-2 transition-all relative overflow-hidden ${
                order.units >= 3 && order.units < 5
                  ? 'bg-wine text-snowfall border-gold shadow-xl scale-[1.01]'
                  : 'bg-white text-charcoal border-kraft hover:border-gold shadow-sm'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className={`font-serif text-3xl sm:text-4xl font-bold ${
                    order.units >= 3 && order.units < 5 ? 'text-gold-light' : 'text-berry'
                  }`}
                >
                  10% DTO
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-kraft text-wine">
                  3 a 4 Fundas
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold mt-2">Kit Trío Navideño</h3>
              <p className="text-xs sm:text-sm opacity-85 mt-1 leading-relaxed">
                Combina diseños diferentes o repite tu favorito. Ideal para renovar tu sofá de 2 o 3
                puestos.
              </p>
              {order.units >= 3 && order.units < 5 && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold-light bg-white/10 px-3 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5" /> ¡Descuento activo en tu pedido!
                </div>
              )}
            </div>

            <div
              className={`rounded-2xl p-5 sm:p-6 border-2 transition-all relative overflow-hidden ${
                order.units >= 5
                  ? 'bg-evergreen text-snowfall border-gold shadow-xl scale-[1.01]'
                  : 'bg-gradient-to-br from-wine to-santa text-snowfall border-gold shadow-lg'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-gold-light">
                  15% DTO
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold text-wine">
                  ★ Más Elegido · 5+ Fundas
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold mt-2 text-white">
                Kit Sala Completa + Envío Gratis
              </h3>
              <p className="text-xs sm:text-sm text-snowfall/90 mt-1 leading-relaxed">
                El máximo descuento disponible + <strong>Entrega GRATIS</strong> tanto en Novaterra como
                en todo Mosquera.
              </p>
              {order.units >= 5 && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold-light bg-black/30 px-3 py-1 rounded-full border border-gold/40">
                  <Check className="w-3.5 h-3.5" /> ¡Máximo beneficio desbloqueado!
                </div>
              )}
            </div>

            <div className="rounded-2xl p-5 sm:p-6 border-2 border-kraft bg-white text-charcoal hover:border-gold transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-evergreen">
                    Mix Sala
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-evergreen/10 text-evergreen">
                    Tip de Diseño
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold mt-2 text-wine">
                  Mezcla Lino 30×50 + Cuadrados 45×45
                </h3>
                <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                  Las fundas rectangulares de lino tejido cuentan igual dentro de tu kit. Colócalas al
                  centro del sofá para un look de revista.
                </p>
              </div>
              <button
                onClick={() => {
                  setOnlyLinen(true);
                  setOnlyDoubleSided(false);
                  setActiveCategory('all');
                  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-3 text-xs font-bold text-berry hover:text-wine inline-flex items-center gap-1 group"
              >
                Ver fundas de Lino 30×50 cm
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAIN CATALOG SECTION ============ */}
      <main id="catalogo" className="flex-1 py-10 sm:py-14 max-w-7xl w-full mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-[3px] font-bold text-berry">
              Inventario en Tiempo Real
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine mt-1">
              Explora la Colección
            </h2>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar gato, Stitch, doble faz..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-snickerdoodle/60 rounded-full text-xs sm:text-sm focus:outline-none focus:border-berry shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white border border-snickerdoodle/60 rounded-full px-3.5 py-2 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-berry shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-medium text-charcoal focus:outline-none cursor-pointer"
                aria-label="Ordenar o filtrar productos"
              >
                <option value="featured">Orden: Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="only-df">Filtrar: Solo Doble Faz (11)</option>
                <option value="double-sided">Orden: Primero Doble Faz</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sticky Category Tabs + Quick Attribute Filters */}
        <div className="sticky top-[104px] z-30 bg-paper/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-4 sm:rounded-2xl border-y sm:border border-kraft shadow-sm mb-6 space-y-2.5">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => {
              const active =
                activeCategory === cat.id ||
                (cat.id === 'doble-faz' && isDoubleSidedActive && activeCategory === 'all');
              const count =
                cat.id === 'all'
                  ? PRODUCTS.length
                  : cat.id === 'doble-faz'
                  ? PRODUCTS.filter((p) => p.isDF).length
                  : PRODUCTS.filter((p) => p.c === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'doble-faz') {
                      if (activeCategory === 'doble-faz' || onlyDoubleSided) {
                        setActiveCategory('all');
                        setOnlyDoubleSided(false);
                        if (sortBy === 'only-df') setSortBy('featured');
                      } else {
                        setActiveCategory('doble-faz');
                        setOnlyDoubleSided(true);
                        setOnlyLinen(false);
                      }
                    } else {
                      setActiveCategory(cat.id);
                      if (cat.id === 'deco' && onlyDoubleSided) {
                        setOnlyDoubleSided(false);
                      }
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-wine text-gold-light shadow-md scale-[1.02]'
                      : 'bg-white text-charcoal hover:bg-kraft/60 border border-kraft'
                  }`}
                >
                  <span>{cat.shortName}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      active ? 'bg-gold/25 text-gold-light' : 'bg-kraft text-wine'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Attribute Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-kraft/60 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted font-medium mr-1 hidden sm:inline">Filtros rápidos:</span>
              <button
                onClick={toggleDoubleSidedFilter}
                className={`px-3 py-1 rounded-full font-semibold border transition-colors ${
                  isDoubleSidedActive
                    ? 'bg-wine text-gold-light border-wine shadow-xs'
                    : 'bg-white text-charcoal border-kraft hover:border-snickerdoodle'
                }`}
              >
                {isDoubleSidedActive ? '✓ ' : '🔄 '}Solo Doble Faz (11)
              </button>
              <button
                onClick={() => {
                  const next = !onlyLinen;
                  setOnlyLinen(next);
                  if (next) {
                    setOnlyDoubleSided(false);
                    if (activeCategory === 'doble-faz') setActiveCategory('all');
                    if (sortBy === 'only-df') setSortBy('featured');
                  }
                }}
                className={`px-3 py-1 rounded-full font-semibold border transition-colors ${
                  onlyLinen
                    ? 'bg-wine text-gold-light border-wine shadow-xs'
                    : 'bg-white text-charcoal border-kraft hover:border-snickerdoodle'
                }`}
              >
                {onlyLinen ? '✓ ' : '🌾 '}Lino Tejido 30×50 cm (3)
              </button>
              <button
                onClick={() => setOnlyBudget(!onlyBudget)}
                className={`px-3 py-1 rounded-full font-semibold border transition-colors ${
                  onlyBudget
                    ? 'bg-wine text-gold-light border-wine shadow-xs'
                    : 'bg-white text-charcoal border-kraft hover:border-snickerdoodle'
                }`}
              >
                {onlyBudget ? '✓ ' : '🏷️ '}Ofertas $15.000 (6)
              </button>
              {(activeCategory !== 'all' ||
                isDoubleSidedActive ||
                onlyLinen ||
                onlyBudget ||
                searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="px-2.5 py-1 text-berry font-bold hover:underline"
                >
                  ✕ Limpiar filtros
                </button>
              )}
            </div>

            <span className="text-muted font-medium">
              Mostrando <strong>{filteredProducts.length}</strong> de {PRODUCTS.length} diseños
            </span>
          </div>
        </div>

        {/* Active Doble Faz Filter Banner */}
        {isDoubleSidedActive && (
          <div className="mb-6 bg-wine/10 border border-wine/25 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-wine">
            <div className="flex items-center gap-2 font-semibold">
              <span>🔄</span>
              <span>
                Filtro activo: Mostrando <strong>{filteredProducts.length} diseños Doble Faz</strong>{' '}
                (estampados por ambas caras).
              </span>
            </div>
            <button
              onClick={() => {
                setOnlyDoubleSided(false);
                if (activeCategory === 'doble-faz') setActiveCategory('all');
                if (sortBy === 'only-df') setSortBy('featured');
              }}
              className="text-xs font-bold bg-wine text-gold-light px-3 py-1 rounded-full hover:bg-berry transition-colors"
            >
              Quitar filtro Doble Faz ✕
            </button>
          </div>
        )}

        {/* Empty Filter State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-kraft max-w-lg mx-auto my-8 shadow-sm">
            <p className="font-serif text-2xl text-wine font-bold">
              No encontramos fundas con esa combinación de filtros
            </p>
            <p className="text-sm text-muted mt-2">
              Restablece los filtros para explorar los 25 diseños disponibles.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 bg-wine text-gold-light font-bold px-6 py-2.5 rounded-full text-sm hover:bg-berry transition-colors"
            >
              Ver toda la colección (25)
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => {
              const inCartQty = cart[product.id] || 0;
              const isMaxStock = inCartQty >= product.st;
              const activeRate = order.rate;

              return (
                <article
                  key={product.id}
                  className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                    inCartQty > 0
                      ? 'border-2 border-berry shadow-[0_14px_34px_rgba(161,11,11,0.14)]'
                      : 'border-kraft/80 shadow-[0_8px_24px_rgba(42,37,35,0.08)] hover:shadow-[0_18px_38px_rgba(42,37,35,0.16)] hover:-translate-y-1'
                  }`}
                >
                  <div>
                    <div
                      onClick={() => setSelectedProduct(product)}
                      className="relative aspect-square w-full bg-kraft/30 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={`/images/${product.img}`}
                        alt={product.n}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        {product.limited && (
                          <span className="bg-berry text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-gold text-gold" /> Edición Especial
                          </span>
                        )}
                        {product.st === 1 ? (
                          <span className="bg-[#fff3cd] text-[#7a3e00] border border-[#f5c26b] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            🔥 ¡Última disponible!
                          </span>
                        ) : (
                          <span className="bg-gold-light text-wine text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            Quedan {product.st} uds
                          </span>
                        )}
                      </div>

                      {/* Double-Sided or Linen Badge */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                        {product.isDF && (
                          <span className="bg-wine/90 backdrop-blur-sm text-gold-light text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            🔄 Doble Faz
                          </span>
                        )}
                        {product.m === 'Lino' && (
                          <span className="bg-evergreen/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            🌾 Lino 30×50
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:bg-wine transition-all">
                        <ZoomIn className="w-3.5 h-3.5" />
                        Ampliar
                      </div>

                      {inCartQty > 0 && (
                        <div className="absolute bottom-3 left-3 bg-evergreen text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-gold-light" />
                          En tu pedido: {inCartQty}
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={() => setSelectedProduct(product)}
                          className="font-serif text-lg sm:text-xl font-bold text-wine hover:text-berry cursor-pointer leading-tight"
                        >
                          {product.n}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-kraft/70 text-wine">
                          {product.s}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-kraft/70 text-wine">
                          {product.m}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-kraft/70 text-wine">
                          {product.e}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            product.isDF
                              ? 'bg-gold-light text-wine'
                              : 'bg-paper border border-kraft text-muted'
                          }`}
                        >
                          {product.isDF
                            ? '✓ Doble faz'
                            : product.df === 'Por confirmar'
                            ? 'Faz por confirmar'
                            : 'Una faz'}
                        </span>
                      </div>

                      <p className="text-xs text-muted mt-2.5 line-clamp-2 leading-relaxed">
                        {product.desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-kraft/50 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg sm:text-xl font-extrabold text-berry">
                          {formatCOP(product.p)}
                        </span>
                      </div>
                      {activeRate > 0 ? (
                        <span className="text-[11px] font-bold text-evergreen block">
                          Con tu kit ({Math.round(activeRate * 100)}%):{' '}
                          {formatCOP(Math.round(product.p * (1 - activeRate)))}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted block">
                          {formatCOP(Math.round(product.p * 0.85))} c/u en Kit x5
                        </span>
                      )}
                    </div>

                    {inCartQty === 0 ? (
                      <button
                        onClick={() => addItem(product.id)}
                        className="bg-wine hover:bg-berry text-white font-bold px-4 py-2.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-kraft/70 rounded-full p-1 border border-gold">
                        <button
                          onClick={() => subItem(product.id)}
                          className="w-7 h-7 rounded-full bg-white text-wine hover:bg-berry hover:text-white flex items-center justify-center font-bold transition-colors shadow-sm"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs sm:text-sm font-extrabold text-wine min-w-[20px] text-center">
                          {inCartQty}
                        </span>
                        <button
                          onClick={() => addItem(product.id)}
                          disabled={isMaxStock}
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold transition-colors shadow-sm ${
                            isMaxStock
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-wine text-white hover:bg-berry'
                          }`}
                          title={isMaxStock ? `Stock máximo (${product.st})` : 'Agregar otra unidad'}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* ============ INSPIRACIÓN / AMBIENTACIÓN LOOKBOOK ============ */}
      <section id="inspiracion" className="bg-festive-evergreen text-snowfall py-14 sm:py-16 border-t border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[3px] font-bold text-gold-light">
              Ideas de Decoración Real
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
              Inspírate: Cómo combinar tus fundas
            </h2>
            <p className="text-sm sm:text-base text-snowfall/85 mt-2">
              Haz clic en cualquier fotografía para ver en pantalla completa cómo lucen nuestras
              colecciones combinadas en diferentes estilos de sala.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AMBIENTACIONES.map((amb) => (
              <figure
                key={amb.id}
                onClick={() => setSelectedAmb(amb)}
                className="group relative rounded-2xl overflow-hidden border-2 border-gold/30 bg-black/30 cursor-pointer shadow-xl"
              >
                <img
                  src={`/images/${amb.img}`}
                  alt={amb.title}
                  loading="lazy"
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-gold-light font-bold bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      Ambientación de Referencia
                    </span>
                    <span className="w-8 h-8 rounded-full bg-gold text-wine flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                  <figcaption className="font-serif text-lg font-bold text-white mt-2">
                    {amb.title}
                  </figcaption>
                  <p className="text-xs text-snowfall/85 mt-1">{amb.caption}</p>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US & GUARANTEE SECTION ============ */}
      <section id="garantia" className="bg-festive-kraft py-12 sm:py-16 border-t border-snickerdoodle/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[3px] font-bold text-berry">
              Más que cojines, son una experiencia
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine mt-1">
              Compra con total confianza
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-berry">
              <div className="w-11 h-11 rounded-2xl bg-berry/10 text-berry flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-wine">Diseños Exclusivos</h3>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Piezas originales en acuarela, estampado 2D de alta definición y lino tejido que no
                encontrarás en tiendas de cadena.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-evergreen">
              <div className="w-11 h-11 rounded-2xl bg-evergreen/10 text-evergreen flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-wine">
                Entrega en Novaterra y Mosquera
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                <strong>Entrega 100% GRATIS en todos los conjuntos de Novaterra.</strong> En el resto de
                Mosquera cuesta solo $5.000 o es <strong>GRATIS llevando 4 o más fundas</strong>.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-gold">
              <div className="w-11 h-11 rounded-2xl bg-gold/20 text-wine flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-wine">Garantía de 7 Días</h3>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Si al recibir tu funda sientes que no es lo que esperabas o quieres cambiarla por otro
                diseño disponible, realizamos el cambio dentro de los primeros 7 días.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#201917] text-snowfall py-10 border-t border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="font-serif text-xl font-bold text-gold-light">
              Colección de Fundas Navideñas
            </div>
            <p className="text-xs text-snowfall/70 mt-1">
              Entregas en Novaterra y Mosquera · Atención personalizada por WhatsApp (+57 316 268 5572)
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gold hover:bg-gold-light text-wine font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm transition-colors"
            >
              Revisar mi Pedido ({order.units})
            </button>
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25d366] hover:brightness-110 text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm inline-flex items-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {/* ============ PERMANENT FLOATING WHATSAPP BUTTON ============ */}
      <a
        href={whatsappOrderUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-4 z-50 bg-[#25d366] hover:bg-[#20bd5a] text-white font-extrabold px-4 py-3 rounded-full shadow-[0_10px_28px_rgba(37,211,102,0.45)] border-2 border-white flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 ${
          order.units > 0 ? 'bottom-20 md:bottom-6' : 'bottom-5 md:bottom-6'
        }`}
        aria-label="Contactar o hacer pedido por WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25d366] shrink-0" />
        <span className="text-xs sm:text-sm tracking-wide">
          {order.units > 0
            ? `Pedir por WhatsApp (${order.units}) · ${formatCOP(order.total)}`
            : '¿Dudas? Escríbenos'}
        </span>
      </a>

      {/* ============ MOBILE STICKY BOTTOM CHECKOUT BAR ============ */}
      {order.units > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#2b2320]/95 backdrop-blur-md border-t border-gold/40 p-3 shadow-[0_-10px_25px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div onClick={() => setIsCartOpen(true)} className="cursor-pointer">
              <div className="flex items-center gap-1.5">
                <span className="bg-gold text-wine text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {order.units} {order.units === 1 ? 'funda' : 'fundas'}
                </span>
                {order.rate > 0 && (
                  <span className="text-[11px] font-bold text-gold-light">
                    ({Math.round(order.rate * 100)}% DTO)
                  </span>
                )}
              </div>
              <div className="font-serif text-lg font-bold text-white leading-tight mt-0.5">
                Total: {formatCOP(order.total)}
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gold text-wine font-extrabold px-5 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Ver Resumen
            </button>
          </div>
        </div>
      )}

      {/* ============ SLIDE-OVER CART DRAWER ============ */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative z-10 w-full max-w-md bg-paper text-charcoal h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="bg-wine text-snowfall p-4 sm:p-5 border-b border-gold/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  <h2 className="font-serif text-xl font-bold text-gold-light">
                    Tu Pedido ({order.units})
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-snowfall transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 bg-black/30 rounded-xl p-2.5 border border-gold/25">
                <p className="text-xs text-gold-light font-medium">{order.nextGoalText}</p>
                <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: `${order.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {order.items.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-kraft/60 text-wine mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 opacity-60" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-wine">
                    Tu pedido está vacío
                  </h3>
                  <p className="text-xs sm:text-sm text-muted max-w-xs mx-auto">
                    Explora los diseños y usa el botón <strong>"Agregar"</strong> para armar tu kit con
                    10% o 15% de descuento.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 inline-block bg-wine text-gold-light font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Diseños seleccionados</span>
                      <button
                        onClick={clearCart}
                        className="text-berry hover:underline font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Vaciar todo
                      </button>
                    </div>

                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-kraft shadow-xs"
                      >
                        <img
                          src={`/images/${item.img}`}
                          alt={item.n}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-kraft"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-bold text-wine text-sm truncate">
                            {item.n}
                          </h4>
                          <p className="text-[11px] text-muted">
                            {item.s} · {item.m}
                          </p>
                          <div className="text-xs font-bold text-berry mt-1">
                            {formatCOP(item.p)} c/u
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center gap-1.5 bg-kraft/50 rounded-full p-1">
                            <button
                              onClick={() => subItem(item.id)}
                              className="w-6 h-6 rounded-full bg-white text-wine flex items-center justify-center font-bold text-xs shadow-xs"
                            >
                              −
                            </button>
                            <span className="text-xs font-extrabold text-wine px-1">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => addItem(item.id)}
                              disabled={item.qty >= item.st}
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                                item.qty >= item.st
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-wine text-white'
                              }`}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs font-extrabold text-charcoal">
                            {formatCOP(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.units < 5 && upsellProducts.length > 0 && (
                    <div className="bg-kraft/45 rounded-2xl p-3.5 border border-gold/50">
                      <p className="text-xs font-bold text-wine mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-berry" />
                        {order.units < 3
                          ? `Agrega ${3 - order.units} más para activar 10% DTO:`
                          : `Agrega ${5 - order.units} más para subir al 15% DTO:`}
                      </p>
                      <div className="space-y-2">
                        {upsellProducts.map((up) => (
                          <div
                            key={up.id}
                            className="flex items-center justify-between bg-white/90 p-2 rounded-xl text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={`/images/${up.img}`}
                                alt={up.n}
                                className="w-9 h-9 rounded-lg object-cover shrink-0"
                              />
                              <div className="truncate">
                                <div className="font-bold text-wine truncate">{up.n}</div>
                                <div className="text-[11px] text-berry font-semibold">
                                  {formatCOP(up.p)}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => addItem(up.id)}
                              className="bg-wine hover:bg-berry text-white font-bold px-3 py-1.5 rounded-full text-[11px] shrink-0"
                            >
                              + Agregar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl p-4 border border-kraft space-y-3">
                    <h4 className="font-serif font-bold text-wine text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-berry" />
                      Datos de Entrega
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Zona de entrega
                      </label>
                      <select
                        value={zona}
                        onChange={(e) => setZona(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-snickerdoodle bg-paper text-xs sm:text-sm font-medium focus:outline-none focus:border-berry"
                      >
                        <option value="novaterra">
                          Novaterra (Todos los conjuntos) — Envío GRATIS
                        </option>
                        <option value="mosquera">
                          Mosquera (Otros sectores) —{' '}
                          {order.units > 3 ? '¡Envío GRATIS!' : '$5.000 (Gratis en 4+ uds)'}
                        </option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Tu nombre (opcional)"
                        className="w-full px-3 py-2 rounded-xl border border-kraft text-xs sm:text-sm focus:outline-none focus:border-berry"
                      />
                      <input
                        type="text"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Conjunto / Torre / Apto o Dirección (opcional)"
                        className="w-full px-3 py-2 rounded-xl border border-kraft text-xs sm:text-sm focus:outline-none focus:border-berry"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {order.items.length > 0 && (
              <div className="bg-white p-4 sm:p-5 border-t border-kraft shadow-[0_-10px_25px_rgba(0,0,0,0.06)] space-y-3">
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between text-muted">
                    <span>
                      Subtotal ({order.units} {order.units === 1 ? 'funda' : 'fundas'})
                    </span>
                    <span className="font-semibold text-charcoal">{formatCOP(order.sub)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-evergreen font-bold">
                      <span>Descuento Kit ({Math.round(order.rate * 100)}% DTO)</span>
                      <span>−{formatCOP(order.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted">
                    <span>Entrega ({zona === 'novaterra' ? 'Novaterra' : 'Mosquera'})</span>
                    <span className="font-semibold text-evergreen">
                      {order.envio === 0 ? 'GRATIS' : formatCOP(order.envio)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t-2 border-gold text-wine">
                    <span className="font-serif text-lg font-bold">Total a Pagar</span>
                    <span className="font-serif text-2xl font-extrabold text-berry">
                      {formatCOP(order.total)}
                    </span>
                  </div>
                </div>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25d366] hover:brightness-105 text-white font-extrabold py-3.5 px-6 rounded-full text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar Pedido por WhatsApp
                </a>
                <p className="text-[11px] text-center text-muted">
                  Pago seguro al coordinar por WhatsApp · Garantía de cambio de 7 días
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ PRODUCT LIGHTBOX / DETAIL MODAL ============ */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />
          <div className="relative z-10 bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gold/40 grid md:grid-cols-2 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-wine flex items-center justify-center transition-colors"
              aria-label="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-kraft/30 aspect-square w-full">
              <img
                src={`/images/${selectedProduct.img}`}
                alt={selectedProduct.n}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-7 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedProduct.limited && (
                    <span className="bg-berry text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                      ⭐ Edición Especial
                    </span>
                  )}
                  <span className="bg-gold-light text-wine text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {selectedProduct.st === 1
                      ? '🔥 ¡Última unidad disponible!'
                      : `${selectedProduct.st} unidades disponibles`}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-wine">
                  {selectedProduct.n}
                </h3>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-berry">
                    {formatCOP(selectedProduct.p)}
                  </span>
                  <span className="text-xs text-evergreen font-bold">
                    ({formatCOP(Math.round(selectedProduct.p * 0.85))} c/u en Kit x5)
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted mt-3 leading-relaxed">
                  {selectedProduct.desc}
                </p>

                <div className="mt-4 bg-paper rounded-2xl p-3.5 border border-kraft space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-kraft/60">
                    <span className="text-muted">Dimensiones:</span>
                    <span className="font-bold text-charcoal">{selectedProduct.s}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-kraft/60">
                    <span className="text-muted">Material:</span>
                    <span className="font-bold text-charcoal">{selectedProduct.m}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-kraft/60">
                    <span className="text-muted">Acabado / Arte:</span>
                    <span className="font-bold text-charcoal">{selectedProduct.e}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted">Estampado Doble Faz:</span>
                    <span className="font-bold text-wine">{selectedProduct.df}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => addItem(selectedProduct.id)}
                  disabled={(cart[selectedProduct.id] || 0) >= selectedProduct.st}
                  className={`w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    (cart[selectedProduct.id] || 0) >= selectedProduct.st
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-wine hover:bg-berry text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  {(cart[selectedProduct.id] || 0) >= selectedProduct.st
                    ? `En tu pedido (${cart[selectedProduct.id]}) · Stock máximo`
                    : (cart[selectedProduct.id] || 0) > 0
                    ? `Agregar otra (${cart[selectedProduct.id]} en tu pedido)`
                    : 'Agregar a mi pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ AMBIENTACIÓN LIGHTBOX MODAL ============ */}
      {selectedAmb && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedAmb(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />
          <div className="relative z-10 max-w-4xl w-full bg-[#201917] rounded-3xl overflow-hidden shadow-2xl border border-gold/40">
            <button
              onClick={() => setSelectedAmb(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-berry flex items-center justify-center"
              aria-label="Cerrar imagen"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={`/images/${selectedAmb.img}`}
              alt={selectedAmb.title}
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            <div className="p-5 text-snowfall flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-gold-light">
                  {selectedAmb.title}
                </h3>
                <p className="text-xs sm:text-sm text-snowfall/80 mt-0.5">{selectedAmb.caption}</p>
              </div>
              <button
                onClick={() => {
                  if (selectedAmb.category !== 'all') {
                    setActiveCategory(selectedAmb.category);
                  }
                  setSelectedAmb(null);
                  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gold text-wine font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm shrink-0"
              >
                Ver estos diseños
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
