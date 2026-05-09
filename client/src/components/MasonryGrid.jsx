import { useState } from "react";
import ImageCard from "./ImageCard";

// ...fakeImages con i nuovi campi...
const fakeImages = [
  {
    id: 1,
    url: "https://picsum.photos/seed/starrynight/600/800",
    title: "La Notte Stellata",
    author: "vangogh_fan",
    caption:
      "Uno dei dipinti più iconici di Van Gogh, realizzato nel 1889 durante il suo soggiorno all'ospedale psichiatrico di Saint-Rémy-de-Provence. I vortici nel cielo trasmettono un'energia quasi cosmica.",
    source: "https://www.moma.org/collection/works/79802",
    views: 84320,
    loves: 5210,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 2,
    url: "https://picsum.photos/seed/monalisa/600/900",
    title: "Mona Lisa",
    author: "louvre_official",
    caption:
      "Il sorriso enigmatico di Lisa Gherardini immortalato da Leonardo da Vinci tra il 1503 e il 1519. La tecnica dello sfumato dissolve i contorni creando una profondità senza precedenti.",
    source: "https://www.louvre.fr/en/explore/the-palace/mona-lisa",
    views: 312000,
    loves: 21400,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 3,
    url: "https://picsum.photos/seed/scream/500/700",
    title: "L'Urlo",
    author: "munch_archive",
    caption:
      "Edvard Munch dipinse L'Urlo nel 1893 come espressione dell'angoscia esistenziale moderna. La figura distorta e il cielo rosso sangue ne fanno uno dei simboli dell'arte espressionista.",
    source: "https://www.nasjonalmuseet.no/en/collection/object/NG.M.00939",
    views: 47800,
    loves: 3890,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 4,
    url: "https://picsum.photos/seed/girlpearl/600/750",
    title: "Ragazza con l'Orecchino di Perla",
    author: "vermeer_studio",
    caption:
      "Realizzato attorno al 1665 da Johannes Vermeer, questo ritratto tronie cattura una figura anonima con uno sguardo di intensa presenza. L'orecchino di perla è in realtà probabilmente di vetro.",
    source:
      "https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring/",
    views: 61200,
    loves: 4720,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 5,
    url: "https://picsum.photos/seed/sistine/800/500",
    title: "La Creazione di Adamo",
    author: "michelangelo_study",
    caption:
      "Il frammento più celebre della Cappella Sistina, dipinto da Michelangelo tra il 1508 e il 1512. Il dito di Dio quasi tocca quello di Adamo in uno spazio carico di potenza spirituale.",
    source:
      "https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/cappella-sistina.html",
    views: 128000,
    loves: 9870,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 6,
    url: "https://picsum.photos/seed/waterlilies/800/550",
    title: "Ninfee",
    author: "monet_impressions",
    caption:
      "Claude Monet dedicò gli ultimi trent'anni della sua vita a dipingere le ninfee del suo giardino a Giverny. La serie completa comprende 250 opere che esplorano luce, riflessi e tempo.",
    source: "https://www.musee-orsay.fr/en/artworks/water-lilies-52-85",
    views: 39400,
    loves: 2980,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 7,
    url: "https://picsum.photos/seed/ophelia/600/800",
    title: "Ofelia",
    author: "millais_preraffaelliti",
    caption:
      "John Everett Millais dipinse questa opera tra il 1851 e il 1852. La modella Elizabeth Siddal posò per mesi in una vasca d'acqua fredda, contraendo una grave polmonite. La vegetazione è dipinta con una precisione botanica ossessiva.",
    source: "https://www.tate.org.uk/art/artworks/millais-ophelia-n01506",
    views: 58400,
    loves: 4760,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 8,
    url: "https://picsum.photos/seed/twofridas/600/750",
    title: "Le Due Frida",
    author: "kahlo_colors",
    caption:
      "Frida Kahlo dipinse questo doppio autoritratto nel 1939, anno del suo divorzio da Diego Rivera. I cuori esposti e i vasi sanguigni collegati narrano identità, dolore e dualità culturale.",
    source: "https://mam.org.mx/en/coleccion/frida-kahlo-las-dos-fridas/",
    views: 52100,
    loves: 4410,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 9,
    url: "https://picsum.photos/seed/persistence/700/500",
    title: "La Persistenza della Memoria",
    author: "dali_surreal",
    caption:
      "Salvador Dalí dipinse questo capolavoro surrealista nel 1931 in soli tre ore. Gli orologi molli che colano sono diventati l'immagine per eccellenza del surrealismo e della relatività del tempo.",
    source: "https://www.moma.org/collection/works/79018",
    views: 68900,
    loves: 5830,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 10,
    url: "https://picsum.photos/seed/klimtadele/600/850",
    title: "Ritratto di Adele Bloch-Bauer I",
    author: "klimt_golden",
    caption:
      "Gustav Klimt realizzò questo straordinario ritratto tra il 1903 e il 1907 usando foglia d'oro vera. L'opera è oggi al Neue Galerie di New York, dopo una disputa legale durata decenni.",
    source: "https://www.neuegalerie.org/content/portrait-adele-bloch-bauer-i",
    views: 44700,
    loves: 3670,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 11,
    url: "https://picsum.photos/seed/birthvenus/700/900",
    title: "La Nascita di Venere",
    author: "botticelli_archive",
    caption:
      "Sandro Botticelli dipinse questa tavola attorno al 1484-1486. Venere emerge dalle acque su una conchiglia, simbolo di bellezza ideale e neoplatonismo fiorentino del Rinascimento.",
    source: "https://www.uffizi.it/opere/nascita-di-venere",
    views: 95300,
    loves: 7120,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 12,
    url: "https://picsum.photos/seed/nightwatch/900/700",
    title: "La Ronda di Notte",
    author: "rembrandt_light",
    caption:
      "Rembrandt van Rijn completò questa monumentale tela nel 1642. L'uso drammatico del chiaroscuro e la composizione dinamica — inusuale per i ritratti di gruppo dell'epoca — la resero immediatamente controversa.",
    source: "https://www.rijksmuseum.nl/en/collection/SK-C-5",
    views: 56800,
    loves: 4230,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 13,
    url: "https://picsum.photos/seed/greattwave/800/600",
    title: "La Grande Onda di Kanagawa",
    author: "hokusai_prints",
    caption:
      'Katsushika Hokusai creò questa xilografia attorno al 1831, parte della serie "Trentasei vedute del Monte Fuji". Il Fuji sullo sfondo è minuscolo rispetto all\'onda — un contrasto deliberato tra eterno e momentaneo.',
    source: "https://www.metmuseum.org/art/collection/search/36491",
    views: 112000,
    loves: 8940,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 14,
    url: "https://picsum.photos/seed/sistinemadon/600/800",
    title: "Madonna Sistina",
    author: "raffaello_divine",
    caption:
      "Raffaello Sanzio dipinse questa pala d'altare nel 1512 per la chiesa di San Sisto a Piacenza. I due angioletti pensierosi in basso sono diventati forse le immagini più riprodotte dell'intera storia dell'arte.",
    source:
      "https://www.skd.museum/en/museums-institutions/gemaeldegalerie-alte-meister/collection/",
    views: 34200,
    loves: 2760,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 15,
    url: "https://picsum.photos/seed/arnolfini/600/800",
    title: "Ritratto dei Coniugi Arnolfini",
    author: "vaneyck_masters",
    caption:
      'Jan van Eyck firmò questo ritratto nel 1434 in modo insolito: "Johannes de Eyck fuit hic", quasi un testimone legale. Lo specchio convesso sullo sfondo riflette due figure aggiuntive ancora non identificate.',
    source:
      "https://www.nationalgallery.org.uk/paintings/jan-van-eyck-the-arnolfini-portrait",
    views: 28900,
    loves: 2340,    
  },
  {
    id: 16,
    url: "https://picsum.photos/seed/libertyleading/800/650",
    title: "La Libertà che Guida il Popolo",
    author: "delacroix_romantic",
    caption:
      "Eugène Delacroix dipinse questa tela nel 1830 in risposta alla Rivoluzione di Luglio. La figura allegorica della Libertà con il tricolore francese è diventata simbolo universale di libertà e resistenza.",
    source:
      "https://www.louvre.fr/en/explore/the-palace/liberty-leading-the-people",
    views: 61500,
    loves: 4890,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 17,
    url: "https://picsum.photos/seed/danceat/700/600",
    title: "Ballo al Moulin de la Galette",
    author: "renoir_impressions",
    caption:
      "Pierre-Auguste Renoir dipinse questa grande tela en plein air nel 1876. Le chiazze di luce filtrate tra gli alberi e la vivacità della folla catturano l'essenza della Parigi della Belle Époque.",
    source:
      "https://www.musee-orsay.fr/en/artworks/dance-at-le-moulin-de-la-galette-127",
    views: 41300,
    loves: 3180,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 18,
    url: "https://picsum.photos/seed/composit8/600/700",
    title: "Composizione VIII",
    author: "kandinsky_abstract",
    caption:
      'Wassily Kandinsky dipinse questa opera nel 1923 al Bauhaus. Le forme geometriche — cerchi, triangoli, linee — sono trattate come elementi musicali visivi in quello che lui chiamava "contrappunto pittorico".',
    source: "https://www.guggenheim.org/artwork/1924",
    views: 23800,
    loves: 1920,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 19,
    url: "https://picsum.photos/seed/sunflowers/600/750",
    title: "I Girasoli",
    author: "vangogh_yellow",
    caption:
      'Van Gogh dipinse questa serie di nature morte nel 1888 e 1889 ad Arles, destinandole ad arredare la sua "Casa Gialla". Il giallo vibrante e la texture materica della pittura ne fanno un trionfo del colore puro.',
    source:
      "https://www.nationalgallery.org.uk/paintings/vincent-van-gogh-sunflowers",
    views: 77600,
    loves: 6340,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
  {
    id: 20,
    url: "https://picsum.photos/seed/lasmeninas/700/900",
    title: "Las Meninas",
    author: "velazquez_royal",
    caption:
      "Diego Velázquez completò questo capolavoro nel 1656. Il pittore si autoritrae mentre dipinge i re riflessi nello specchio — un gioco di sguardi, specchi e ambiguità che sfida ogni interpretazione semplice.",
    source:
      "https://www.museodelprado.es/en/the-collection/art-work/las-meninas/9fdc7800-9ade-48b0-ab8b-edee94ea877f",
    views: 88400,
    loves: 7010,
    avatar: "https://picsum.photos/seed/user_luca/40/40",
  },
];

export default function MasonryGrid({ onSpark } ) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loved, setLoved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openModal = (image) => {
    setSelectedImage(image);
    setLoved(false);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Griglia */}
      <div className="p-4 columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-x-3">
        {fakeImages.map((image) => (
          <div
            key={image.id}
            className="mb-3 break-inside-avoid cursor-pointer"
            onClick={() => openModal(image)}
          >
            <ImageCard image={image} onSpark={onSpark} />
          </div>
        ))}
      </div>

      {/* Modale */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-neutral-900 rounded-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Colonna sinistra: immagine ── */}
            <div className="md:w-1/2 bg-black flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-full object-contain max-h-[92vh]"
              />
            </div>

            {/* ── Colonna destra: info ── */}
            <div className="md:w-1/2 p-6 flex flex-col gap-5 overflow-y-auto">
              {/* Header: autore + chiudi + menu */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">
                    @{selectedImage.author}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Menu "..." */}
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="text-neutral-400 hover:text-white text-xl px-2 py-1 rounded-lg hover:bg-neutral-800 transition"
                    >
                      •••
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-1 w-52 bg-neutral-800 rounded-xl shadow-lg z-10 overflow-hidden text-sm">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedImage.source);
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-white transition flex items-center gap-2"
                        >
                          🔗 Condividi spark
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-neutral-300 transition flex items-center gap-2"
                        >
                          👤 Vedi profilo di @{selectedImage.author}
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-700 text-red-400 transition flex items-center gap-2"
                        >
                          🚩 Segnala contenuto
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Chiudi */}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-neutral-400 hover:text-white text-xl px-2 py-1 rounded-lg hover:bg-neutral-800 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Titolo */}
              <h2 className="text-white text-xl font-bold">
                {selectedImage.title}
              </h2>

              {/* Caption */}
              {selectedImage.caption && (
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {selectedImage.caption}
                </p>
              )}

              {/* Source */}
              {selectedImage.source && (
                <div className="text-sm">
                  <span className="text-neutral-500 font-medium uppercase tracking-wider text-xs">
                    Source
                  </span>
                  <a
                    href={selectedImage.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-yellow-400 hover:text-yellow-300 truncate mt-1 transition"
                  >
                    {selectedImage.source}
                  </a>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-neutral-700" />

              {/* Stats: views + loves */}
              <div className="flex gap-6 text-sm text-neutral-400">
                <span>
                  👁This spark has been seen{" "}
                  <strong className="text-white">
                    {selectedImage.views?.toLocaleString()}
                  </strong>{" "}
                  times
                </span>
                <span>
                  ✦{" "}
                  <strong className="text-white">
                    {loved ? selectedImage.loves + 1 : selectedImage.loves}
                  </strong>{" "}
                  are Loving it
                </span>
              </div>

              {/* Pulsante I'm loving it */}
              <button
                onClick={() => setLoved(!loved)}
                className={`mt-auto px-6 py-3 rounded-full font-semibold text-sm transition
                  ${
                    loved
                      ? "bg-yellow-400 text-black scale-95"
                      : "bg-white text-black hover:bg-yellow-400"
                  }`}
              >
                {loved ? "✦ I'm loving it!" : "✦ Love it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}