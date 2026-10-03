/**
 * Resilient, high-definition SVG & visual asset representations
 * for Brazilian craftsmanship (Ceramics, Weaving/Macramé, Embroidery, Amigurumi, Raw materials).
 */

export const craftPlaceholders: Record<string, string> = {
  amigurumi_girafa: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_ami" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#F7EFE8"/>
          <stop offset="100%" stop-color="#EEDAC9"/>
        </linearGradient>
        <linearGradient id="giraffe_yarn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E6953B"/>
          <stop offset="100%" stop-color="#C26D1E"/>
        </linearGradient>
        <pattern id="stitch" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M2,5 L8,5 M5,2 L5,8" stroke="#ffffff" stroke-width="0.7" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_ami)"/>
      <circle cx="250" cy="180" r="140" fill="#E8D2C0" opacity="0.4"/>
      <!-- Soft tabletop shadow -->
      <ellipse cx="250" cy="340" rx="130" ry="22" fill="#3D291D" opacity="0.12"/>
      <!-- Legs -->
      <rect x="200" y="270" width="34" height="65" rx="14" fill="url(#giraffe_yarn)"/>
      <rect x="266" y="270" width="34" height="65" rx="14" fill="url(#giraffe_yarn)"/>
      <!-- Body -->
      <ellipse cx="250" cy="245" rx="68" ry="60" fill="url(#giraffe_yarn)"/>
      <ellipse cx="250" cy="245" rx="68" ry="60" fill="url(#stitch)"/>
      <!-- Spots -->
      <circle cx="225" cy="235" r="12" fill="#8E3E19"/>
      <circle cx="270" cy="250" r="14" fill="#8E3E19"/>
      <circle cx="245" cy="270" r="10" fill="#8E3E19"/>
      <!-- Neck -->
      <rect x="228" y="125" width="44" height="95" rx="12" fill="url(#giraffe_yarn)"/>
      <rect x="228" y="125" width="44" height="95" rx="12" fill="url(#stitch)"/>
      <!-- Head -->
      <ellipse cx="250" cy="115" rx="52" ry="42" fill="url(#giraffe_yarn)"/>
      <ellipse cx="250" cy="115" rx="52" ry="42" fill="url(#stitch)"/>
      <!-- Snout -->
      <ellipse cx="250" cy="130" rx="30" ry="22" fill="#F4D9B8"/>
      <circle cx="240" cy="130" r="3" fill="#6A4023"/>
      <circle cx="260" cy="130" r="3" fill="#6A4023"/>
      <!-- Eyes with crocheted shine -->
      <circle cx="230" cy="105" r="5" fill="#241B15"/>
      <circle cx="231" cy="103" r="1.5" fill="#ffffff"/>
      <circle cx="270" cy="105" r="5" fill="#241B15"/>
      <circle cx="271" cy="103" r="1.5" fill="#ffffff"/>
      <!-- Horns (Ossicones) -->
      <path d="M232,75 L232,95" stroke="#C26D1E" stroke-width="7" stroke-linecap="round"/>
      <circle cx="232" cy="72" r="7" fill="#8E3E19"/>
      <path d="M268,75 L268,95" stroke="#C26D1E" stroke-width="7" stroke-linecap="round"/>
      <circle cx="268" cy="72" r="7" fill="#8E3E19"/>
      <!-- Ears -->
      <path d="M205,100 C190,90 200,75 212,88 Z" fill="url(#giraffe_yarn)"/>
      <path d="M295,100 C310,90 300,75 288,88 Z" fill="url(#giraffe_yarn)"/>
      <!-- Cute handmade textile ribbon tag -->
      <rect x="238" y="172" width="24" height="12" rx="3" fill="#8E3E19"/>
      <text x="250" y="180" font-size="7" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">ARTENÓS</text>
    </svg>
  `)}`,

  ceramica_vaso: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F9F6F0"/>
          <stop offset="100%" stop-color="#EBE3D3"/>
        </linearGradient>
        <linearGradient id="terracotta_grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#A64B24"/>
          <stop offset="40%" stop-color="#D37143"/>
          <stop offset="85%" stop-color="#8E3E19"/>
          <stop offset="100%" stop-color="#69290B"/>
        </linearGradient>
        <filter id="clay_noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" numOctaves="3"/>
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0"/>
          <feComposite in2="SourceGraphic" in="gl" operator="in"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_pot)"/>
      <!-- Shadow -->
      <ellipse cx="250" cy="345" rx="110" ry="20" fill="#362518" opacity="0.15"/>
      <!-- Sculptural minimalist vase shape -->
      <path d="M 215,80 
               C 220,110 232,130 220,165 
               C 180,215 170,270 205,325 
               C 215,340 285,340 295,325 
               C 330,270 320,215 280,165 
               C 268,130 280,110 285,80 
               Z" fill="url(#terracotta_grad)"/>
      <!-- Lip of the vase -->
      <ellipse cx="250" cy="80" rx="35" ry="10" fill="#69290B"/>
      <ellipse cx="250" cy="80" rx="28" ry="7" fill="#3D1806"/>
      <!-- Subtle artisan hand ribbed grooves -->
      <path d="M 195,230 Q 250,248 305,230" stroke="#FFE3D4" stroke-width="2.5" opacity="0.3" fill="none"/>
      <path d="M 188,260 Q 250,280 312,260" stroke="#FFE3D4" stroke-width="2.5" opacity="0.3" fill="none"/>
      <path d="M 194,290 Q 250,308 306,290" stroke="#FFE3D4" stroke-width="2" opacity="0.25" fill="none"/>
      <!-- Dried floral branch protruding -->
      <path d="M 250,75 Q 260,30 290,15" stroke="#7A5636" stroke-width="2.5" fill="none"/>
      <circle cx="292" cy="14" r="5" fill="#DDBB90"/>
      <circle cx="282" cy="24" r="4" fill="#C89D6C"/>
      <circle cx="270" cy="38" r="4.5" fill="#DDBB90"/>
    </svg>
  `)}`,

  bordado_bastidor: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_emb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FAF7F2"/>
          <stop offset="100%" stop-color="#EDE2D0"/>
        </linearGradient>
        <radialGradient id="linen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FBF8F3"/>
          <stop offset="90%" stop-color="#EAE0D0"/>
          <stop offset="100%" stop-color="#DAC7B0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_emb)"/>
      <!-- Shadow of hoop -->
      <ellipse cx="250" cy="350" rx="140" ry="25" fill="#423023" opacity="0.12"/>
      <!-- Outer Wooden Hoop -->
      <circle cx="250" cy="200" r="145" fill="#BA8553" stroke="#8E5B2E" stroke-width="5"/>
      <circle cx="250" cy="200" r="138" fill="url(#linen)"/>
      <circle cx="250" cy="200" r="138" fill="none" stroke="#D1BEA5" stroke-width="2" stroke-dasharray="3,3"/>
      <!-- Brass Screw Mechanism Top -->
      <rect x="242" y="44" width="16" height="18" fill="#D4AF37" rx="2"/>
      <rect x="238" y="40" width="24" height="6" fill="#ECCB65" rx="1"/>
      <line x1="250" y1="40" x2="250" y2="60" stroke="#9A7B1C" stroke-width="2"/>
      <!-- Embroidered Brazilian Florals -->
      <!-- Stem -->
      <path d="M 250,290 Q 230,230 250,160 Q 265,120 250,110" stroke="#2B6B48" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <!-- Leaves -->
      <path d="M 242,240 C 210,230 215,215 240,225 Z" fill="#3D8B60"/>
      <path d="M 252,210 C 285,200 280,185 250,195 Z" fill="#4FA273"/>
      <path d="M 245,170 C 220,160 225,145 248,155 Z" fill="#3D8B60"/>
      <!-- Central Rose/Marigold -->
      <circle cx="250" cy="115" r="28" fill="#C94A29"/>
      <circle cx="250" cy="115" r="22" fill="#E26543"/>
      <circle cx="250" cy="115" r="16" fill="#F48A69"/>
      <circle cx="250" cy="115" r="9" fill="#F8C158"/>
      <!-- French Knots (Pontos Cheios) -->
      <circle cx="205" cy="140" r="6" fill="#E8B837"/>
      <circle cx="195" cy="155" r="5" fill="#E8B837"/>
      <circle cx="215" cy="155" r="4.5" fill="#D99B26"/>
      <circle cx="295" cy="145" r="6" fill="#935787"/>
      <circle cx="305" cy="160" r="5" fill="#B071A2"/>
      <circle cx="285" cy="160" r="4.5" fill="#935787"/>
    </svg>
  `)}`,

  painel_macrame: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_mac" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F7F3EC"/>
          <stop offset="100%" stop-color="#EDE5D7"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_mac)"/>
      <!-- Wall Driftwood branch -->
      <path d="M 60,65 Q 250,55 440,70" stroke="#7A5230" stroke-width="14" stroke-linecap="round"/>
      <!-- Hanging Cord -->
      <path d="M 120,60 L 250,20 L 380,63" stroke="#D1C3B2" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Macramé cords forming Chevron diamond pattern -->
      <!-- Tier 1 -->
      <path d="M 100,72 L 250,170 L 400,72" stroke="#EAE0D2" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M 115,72 L 250,185 L 385,72" stroke="#DFD4C4" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M 130,72 L 250,200 L 370,72" stroke="#CFC2AF" stroke-width="6" stroke-linecap="round" fill="none"/>
      <!-- Diamond knots -->
      <polygon points="250,180 280,215 250,250 220,215" fill="#DFD4C4" stroke="#B8A790" stroke-width="3"/>
      <polygon points="250,240 285,280 250,320 215,280" fill="#EAE0D2" stroke="#B8A790" stroke-width="3"/>
      <!-- Fringes and tassels -->
      <line x1="160" y1="120" x2="160" y2="340" stroke="#D9CDBE" stroke-width="3"/>
      <line x1="180" y1="135" x2="180" y2="360" stroke="#E6DDD0" stroke-width="3.5"/>
      <line x1="200" y1="150" x2="200" y2="380" stroke="#DFD5C5" stroke-width="3"/>
      <line x1="220" y1="210" x2="220" y2="390" stroke="#EAE0D2" stroke-width="3.5"/>
      <line x1="250" y1="320" x2="250" y2="400" stroke="#FAF7F2" stroke-width="4"/>
      <line x1="280" y1="210" x2="280" y2="390" stroke="#EAE0D2" stroke-width="3.5"/>
      <line x1="300" y1="150" x2="300" y2="380" stroke="#DFD5C5" stroke-width="3"/>
      <line x1="320" y1="135" x2="320" y2="360" stroke="#E6DDD0" stroke-width="3.5"/>
      <line x1="340" y1="120" x2="340" y2="340" stroke="#D9CDBE" stroke-width="3"/>
      <!-- Wooden beads -->
      <circle cx="160" cy="180" r="7" fill="#A86F3E"/>
      <circle cx="340" cy="180" r="7" fill="#A86F3E"/>
      <circle cx="250" cy="215" r="9" fill="#8C582B"/>
    </svg>
  `)}`,

  fornecedor_barbante: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_sup" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#EAF2ED"/>
          <stop offset="100%" stop-color="#D7E8DC"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_sup)"/>
      <ellipse cx="250" cy="340" rx="140" ry="25" fill="#1C3827" opacity="0.15"/>
      <!-- Cone 1 (Terracotta) -->
      <path d="M 120,310 L 150,150 L 190,150 L 220,310 Z" fill="#9C441E"/>
      <ellipse cx="170" cy="150" rx="20" ry="8" fill="#BD5C2F"/>
      <!-- Cone 2 (Forest Olive Green) -->
      <path d="M 200,320 L 230,120 L 270,120 L 300,320 Z" fill="#20583A"/>
      <ellipse cx="250" cy="120" rx="20" ry="8" fill="#317D54"/>
      <!-- Cone 3 (Cru Natural Linen) -->
      <path d="M 280,310 L 310,160 L 350,160 L 380,310 Z" fill="#D3C3AD"/>
      <ellipse cx="330" cy="160" rx="20" ry="8" fill="#E8DDD0"/>
      <!-- Yarn wraps -->
      <line x1="205" y1="240" x2="295" y2="240" stroke="#48976C" stroke-width="2" opacity="0.4"/>
      <line x1="208" y1="260" x2="292" y2="260" stroke="#48976C" stroke-width="2" opacity="0.4"/>
      <line x1="125" y1="240" x2="215" y2="240" stroke="#D37143" stroke-width="2" opacity="0.4"/>
      <line x1="285" y1="240" x2="375" y2="240" stroke="#F5EDE4" stroke-width="2" opacity="0.5"/>
    </svg>
  `)}`,

  fornecedor_argila: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#F5EEE6"/>
      <ellipse cx="250" cy="330" rx="130" ry="24" fill="#3D291D" opacity="0.15"/>
      <!-- Block of moist pottery clay with natural burlap texture -->
      <polygon points="140,160 300,130 380,180 220,210" fill="#9E5B32"/>
      <polygon points="140,160 220,210 220,320 140,270" fill="#804420"/>
      <polygon points="220,210 380,180 380,290 220,320" fill="#693414"/>
      <!-- Stamp on clay: ARGILA PURA ARTENÓS -->
      <ellipse cx="295" cy="245" rx="35" ry="18" fill="#54280E" opacity="0.6"/>
      <text x="295" y="249" font-size="8" font-family="sans-serif" font-weight="bold" fill="#B8754E" text-anchor="middle">100% ORGÂNICA</text>
    </svg>
  `)}`,

  artisan_maria: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#EBDDCF"/>
      <circle cx="150" cy="115" r="55" fill="#8C5338"/>
      <!-- Hair with natural curly bun -->
      <circle cx="150" cy="85" r="50" fill="#3B261D"/>
      <circle cx="150" cy="45" r="28" fill="#3B261D"/>
      <!-- Face -->
      <ellipse cx="150" cy="120" rx="42" ry="46" fill="#9E6246"/>
      <!-- Cheerful smile -->
      <path d="M 135,138 Q 150,152 165,138" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- Warm eyes -->
      <path d="M 130,115 Q 137,110 144,115" stroke="#331A10" stroke-width="3" fill="none"/>
      <path d="M 156,115 Q 163,110 170,115" stroke="#331A10" stroke-width="3" fill="none"/>
      <!-- Ceramic statement earring -->
      <circle cx="106" cy="125" r="8" fill="#C94A29"/>
      <circle cx="194" cy="125" r="8" fill="#C94A29"/>
      <!-- Linen artisan apron -->
      <path d="M 80,300 L 95,200 L 150,225 L 205,200 L 220,300 Z" fill="#8E3E19"/>
      <path d="M 95,200 L 150,225 L 205,200 L 210,185 L 90,185 Z" fill="#F4EAE0"/>
    </svg>
  `)}`,

  artisan_clara: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#E3DFD5"/>
      <!-- Hair -->
      <ellipse cx="150" cy="120" rx="55" ry="60" fill="#4A3427"/>
      <!-- Face -->
      <ellipse cx="150" cy="125" rx="40" ry="44" fill="#C49175"/>
      <path d="M 137,144 Q 150,154 163,144" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <circle cx="137" cy="122" r="3.5" fill="#3D291F"/>
      <circle cx="163" cy="122" r="3.5" fill="#3D291F"/>
      <!-- Pottery apron -->
      <path d="M 85,300 L 105,195 L 195,195 L 215,300 Z" fill="#1A543E"/>
    </svg>
  `)}`,

  artisan_teresa: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#EFE8DD"/>
      <!-- Silver hair bun -->
      <circle cx="150" cy="75" r="48" fill="#B3B1AD"/>
      <ellipse cx="150" cy="125" rx="42" ry="46" fill="#B8866E"/>
      <path d="M 136,145 Q 150,156 164,145" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <!-- Glasses for embroidery -->
      <circle cx="136" cy="120" r="10" stroke="#7A5230" stroke-width="2" fill="none"/>
      <circle cx="164" cy="120" r="10" stroke="#7A5230" stroke-width="2" fill="none"/>
      <line x1="146" y1="120" x2="154" y2="120" stroke="#7A5230" stroke-width="2"/>
      <!-- Embroidered blouse -->
      <path d="M 80,300 L 100,195 L 200,195 L 220,300 Z" fill="#FDFBF7"/>
      <circle cx="150" cy="235" r="6" fill="#8E3E19"/>
    </svg>
  `)}`,
};
