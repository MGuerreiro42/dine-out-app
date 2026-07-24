import type { PlaceDetails } from '@/lib/googlePlaces';
import { PLACES, photoRef } from '@/mocks/restaurants';

type MenuItem = { name: string; price: string };

const CHURRASCO_MENU: MenuItem[] = [
  { name: 'Picanha na brasa', price: 'R$ 89' },
  { name: 'Fraldinha', price: 'R$ 79' },
  { name: 'Costela no bafo', price: 'R$ 95' },
  { name: 'Buffet de saladas', price: 'incluso' },
  { name: 'Farofa & vinagrete', price: 'incluso' },
  { name: 'Sobremesa: abacaxi grelhado', price: 'R$ 18' },
];

const MEDITERRANEO_MENU: MenuItem[] = [
  { name: 'Mezze compartilhável', price: 'R$ 62' },
  { name: 'Cordeiro grelhado', price: 'R$ 98' },
  { name: 'Homus da casa', price: 'R$ 32' },
  { name: 'Pão sírio artesanal', price: 'incluso' },
];

const ITALIANA_MENU: MenuItem[] = [
  { name: 'Tagliatelle ao ragu', price: 'R$ 68' },
  { name: 'Risoto de funghi', price: 'R$ 74' },
  { name: 'Pizza margherita', price: 'R$ 56' },
];

const INDIANA_MENU: MenuItem[] = [
  { name: 'Frango tikka masala', price: 'R$ 68' },
  { name: 'Curry de cordeiro', price: 'R$ 82' },
  { name: 'Naan de alho', price: 'incluso' },
  { name: 'Samosas de legumes', price: 'R$ 28' },
  { name: 'Arroz basmati', price: 'incluso' },
];

const CHINESA_MENU: MenuItem[] = [
  { name: 'Pato laqueado', price: 'R$ 96' },
  { name: 'Yakisoba de legumes', price: 'R$ 52' },
  { name: 'Dim sum variado', price: 'R$ 46' },
  { name: 'Frango xadrez', price: 'R$ 58' },
  { name: 'Sopa wonton', price: 'R$ 32' },
];

const MENU_BY_PRIMARY_TYPE: Record<string, MenuItem[]> = {
  brazilian_restaurant: CHURRASCO_MENU,
  mediterranean_restaurant: MEDITERRANEO_MENU,
  italian_restaurant: ITALIANA_MENU,
  indian_restaurant: INDIANA_MENU,
  chinese_restaurant: CHINESA_MENU,
};

const EXTRAS_BY_ID: Record<string, { description: string; tags: string[] }> = {
  '1': { description: 'Um rodízio clássico de churrascaria com carnes selecionadas e cortes nobres, grelhados na brasa no estilo tradicional gaúcho. Ambiente descontraído com música ao vivo às sextas e sábados, ideal para famílias e grupos grandes.', tags: ['Churrasco', 'Rodízio', 'Música ao vivo'] },
  '2': { description: 'Espaço amplo para grupos, buffet completo de acompanhamentos e carnes nobres direto da brasa.', tags: ['Grupos grandes', 'Buffet completo', 'Estacionamento'] },
  '3': { description: 'Espetinhos, chope gelado e música ao vivo todo fim de semana — clima de boteco raiz.', tags: ['Música ao vivo', 'Chope gelado', 'Pet friendly'] },
  '4': { description: 'Costela de 12 horas na brasa e acompanhamentos caseiros, num salão intimista pra namorar sem pressa.', tags: ['Costela 12h', 'Ambiente intimista', 'Vinhos selecionados'] },
  '5': { description: 'Buffet rústico de churrasco com foco em família — playground pra crianças e mesas comunitárias.', tags: ['Playground infantil', 'Buffet à vontade', 'Estacionamento'] },
  '6': { description: 'Espetinhos rápidos e porções generosas pra galera que quer comer bem sem gastar muito.', tags: ['Preço justo', 'Porções grandes', 'Delivery rápido'] },
  '7': { description: 'Mezze compartilháveis e terraço iluminado à luz de velas. Cardápio inspirado na costa mediterrânea, com pratos leves e vinhos naturais selecionados a dedo.', tags: ['Terraço', 'Vegetariano-friendly', 'Romântico'] },
  '8': { description: 'Pratos frios turcos e vinhos naturais, ambiente intimista pra uma noite tranquila a dois.', tags: ['Vinhos naturais', 'Intimista', 'Sem glúten'] },
  '9': { description: 'Azeites premiados e pratos gregos simples, feitos pra ficar a tarde toda com a família reunida.', tags: ['Azeite premiado', 'Pratos para dividir', 'Kids menu'] },
  '10': { description: 'Frutos do mar grelhados e vista pro pôr do sol — clima de taverna litorânea em pleno centro.', tags: ['Frutos do mar', 'Terraço com vista', 'Grupos grandes'] },
  '11': { description: 'Mezze libanês tradicional servido em travessas generosas, ótimo pra reunir a família inteira numa mesa só.', tags: ['Mezze libanês', 'Travessas para compartilhar', 'Kids menu'] },
  '12': { description: 'Bouzouki ao vivo às quintas e sextas, taças de vinho grego e petiscos até tarde.', tags: ['Música ao vivo', 'Vinhos gregos', 'Aberto até tarde'] },
  '13': { description: 'Massas artesanais e forno a lenha, clima de trattoria — feito pra ficar a tarde toda.', tags: ['Massas artesanais', 'Forno a lenha', 'Pet friendly'] },
  '14': { description: 'Massas frescas feitas na hora e carta de vinhos italianos extensa, num salão elegante pra ocasiões especiais.', tags: ['Massa fresca', 'Carta de vinhos', 'Romântico'] },
  '15': { description: 'Pizza napolitana de forno a lenha e mesas compridas — o point de família de domingo.', tags: ['Pizza napolitana', 'Forno a lenha', 'Kids menu'] },
  '16': { description: 'Harmonizações de massas autorais com vinhos importados, num salão pequeno e charmoso.', tags: ['Harmonização de vinhos', 'Menu degustação', 'Romântico'] },
  '17': { description: 'Massas rápidas e generosas, preço justo pra quem quer sair em grupo sem complicação.', tags: ['Preço justo', 'Porções generosas', 'Grupos grandes'] },
  '18': { description: 'Cozinha toscana tradicional, ambiente aconchegante e cardápio que muda com a estação.', tags: ['Cozinha toscana', 'Cardápio sazonal', 'Kids menu'] },
  '19': { description: 'Curries aromáticos e naan feito na hora, num salão intimista com luz baixa.', tags: ['Curry autoral', 'Naan artesanal', 'Romântico'] },
  '20': { description: 'Cardápio indiano completo com opções vegetarianas de sobra — ótimo pra levar a família toda.', tags: ['Opções vegetarianas', 'Kids menu', 'Buffet aos domingos'] },
  '21': { description: 'Menu degustação indiano com harmonização de especiarias, pensado pra grupos que querem experimentar de tudo.', tags: ['Menu degustação', 'Grupos grandes', 'Ambiente elegante'] },
  '22': { description: 'Receitas de família passadas de geração em geração, servidas num salão calmo e acolhedor.', tags: ['Receitas de família', 'Ambiente acolhedor', 'Vegetariano-friendly'] },
  '23': { description: 'Forno tandoor a vista, música indiana ao vivo nos fins de semana e drinks especiais.', tags: ['Forno tandoor', 'Música ao vivo', 'Drinks autorais'] },
  '24': { description: 'Cozinha indiana contemporânea com pratos autorais e carta de coquetéis, num salão sofisticado pra um encontro especial.', tags: ['Cozinha autoral', 'Carta de coquetéis', 'Romântico'] },
  '25': { description: 'Wok rápido e porções fartas — clássico point de galera depois do trabalho.', tags: ['Porções generosas', 'Preço justo', 'Delivery rápido'] },
  '26': { description: 'Salão discreto com mesas reservadas, clima perfeito pra uma noite tranquila a dois.', tags: ['Ambiente intimista', 'Chá de cortesia', 'Romântico'] },
  '27': { description: 'Buffet ao quilo com clássicos chineses — ótimo pra almoço em família sem compromisso.', tags: ['Buffet ao quilo', 'Kids menu', 'Almoço rápido'] },
  '28': { description: 'Culinária cantonesa tradicional, mesas redondas grandes feitas pra reunir a família inteira.', tags: ['Mesas grandes', 'Culinária cantonesa', 'Kids menu'] },
  '29': { description: 'Pato laqueado é a estrela da casa, servido num salão elegante decorado com lanternas tradicionais.', tags: ['Pato laqueado', 'Ambiente elegante', 'Grupos grandes'] },
  '30': { description: 'Karaokê nos fundos e petiscos até tarde — point animado de fim de semana.', tags: ['Karaokê', 'Aberto até tarde', 'Petiscos variados'] },
};

export const PLACE_DETAILS: Record<string, PlaceDetails> = Object.fromEntries(
  PLACES.map((place) => {
    const extras = EXTRAS_BY_ID[place.id];
    const primaryPoolIndex = Number(place.photos[0].name.replace('r', ''));
    const secondaryPoolIndex = (primaryPoolIndex % 6) + 1;

    const details: PlaceDetails = {
      ...place,
      photos: [photoRef(primaryPoolIndex), photoRef(secondaryPoolIndex)],
      editorialSummary: { text: extras.description, languageCode: 'pt-BR' },
      tags: extras.tags,
      menu: MENU_BY_PRIMARY_TYPE[place.primaryType],
    };

    return [place.id, details];
  }),
);
