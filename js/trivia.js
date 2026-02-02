// Digscord Trivia — 3 modes, 50 questions each, with explanations, timer, and local leaderboard
const totalQuestions = parseInt(document.getElementById("question-count").value);
const allQuestions = {
  easy: [
    { question: "Which ancient civilization built the pyramids at Giza?", choices: ["Mesopotamia", "Phoenicia", "Egypt", "Persia"], answer: 2, explanation: "Egyptians built pyramids as monumental tombs for pharaohs." },
    { question: "What is a common stone used for ancient arrowheads?", choices: ["Marble", "Obsidian", "Granite", "Basalt"], answer: 1, explanation: "Obsidian fractures to create razor-sharp edges." },
    { question: "What do archaeologists primarily study?", choices: ["Planets", "Ancient material culture", "Modern art", "Weather"], answer: 1, explanation: "Archaeology studies past human life through artifacts and sites." },
    { question: "Which tool is essential for careful excavation?", choices: ["Jackhammer", "Trowel", "Chainsaw", "Sledgehammer"], answer: 1, explanation: "The trowel allows controlled soil removal around artifacts." },
    { question: "What is pottery made from?", choices: ["Clay", "Sand", "Limestone", "Charcoal"], answer: 0, explanation: "Pottery is formed from clay and fired to harden." },
    { question: "Which material is organic and decays faster?", choices: ["Bone", "Ceramic", "Stone", "Metal"], answer: 0, explanation: "Bone is organic and more susceptible to decay than ceramic or stone." },
    { question: "A site where artifacts are found is called a…", choices: ["Gallery", "Dig site", "Forge", "Market"], answer: 1, explanation: "Excavations happen at archaeological dig sites." },
    { question: "Radiocarbon dating measures decay of…", choices: ["C-14", "O-2", "H-2", "N-2"], answer: 0, explanation: "C-14 (carbon-14) decay dates organic materials." },
    { question: "Which structure is famously in Rome?", choices: ["Colosseum", "Stonehenge", "Machu Picchu", "Angkor Wat"], answer: 0, explanation: "The Colosseum is an iconic Roman amphitheater." },
    { question: "Stonehenge is located in…", choices: ["France", "Wales", "England", "Scotland"], answer: 2, explanation: "Stonehenge stands on Salisbury Plain in England." },
    { question: "The Inca built…", choices: ["The Parthenon", "Machu Picchu", "Petra", "Chichen Itza"], answer: 1, explanation: "Machu Picchu is an Inca citadel in Peru." },
    { question: "Artifacts are…", choices: ["Natural rocks", "Human-made objects", "Animal fossils only", "Atmospheric data"], answer: 1, explanation: "Artifacts are portable, human-made items from the past." },
    { question: "Hieroglyphs belong to…", choices: ["Greek", "Egyptian", "Chinese", "Runic"], answer: 1, explanation: "Hieroglyphs are the formal writing system of ancient Egypt." },
    { question: "Terracotta is…", choices: ["Wood carving", "Baked clay", "Iron casting", "Glass blowing"], answer: 1, explanation: "Terracotta objects are made of fired clay." },
    { question: "The Rosetta Stone helped decode…", choices: ["Linear B", "Sanskrit", "Egyptian hieroglyphs", "Cuneiform"], answer: 2, explanation: "Its trilingual text enabled understanding of hieroglyphs." },
    { question: "A mosaic uses small pieces of…", choices: ["Paper", "Textile", "Stone or glass", "Leather"], answer: 2, explanation: "Mosaics are patterns formed with tesserae (stone/glass)." },
    { question: "A burial mound is called a…", choices: ["Menhir", "Dolmen", "Tumulus", "Stela"], answer: 2, explanation: "A tumulus is an earthen burial mound." },
    { question: "The Aztecs lived in…", choices: ["Egypt", "Mesoamerica", "China", "Scandinavia"], answer: 1, explanation: "Aztecs were a Mesoamerican civilization centered in Mexico." },
    { question: "The Parthenon honors…", choices: ["Athena", "Zeus", "Apollo", "Poseidon"], answer: 0, explanation: "Athena, patron goddess of Athens, is honored at the Parthenon." },
    { question: "Which is a writing system of Mesopotamia?", choices: ["Runes", "Cuneiform", "Kana", "Alphabet"], answer: 1, explanation: "Cuneiform on clay tablets recorded early texts." },
    { question: "A spear point made of stone is a…", choices: ["Fibula", "Point", "Pendant", "Coin"], answer: 1, explanation: "Stone points were hafted onto shafts as weapon tips." },
    { question: "An amphora was used to store…", choices: ["Scrolls", "Liquids/grains", "Jewels", "Coins"], answer: 1, explanation: "Amphorae stored wine, oil, and dry goods." },
    { question: "The Maya are known for…", choices: ["Ice palaces", "Pyramids and calendars", "Caves only", "Floating markets"], answer: 1, explanation: "Maya achievements include stepped pyramids and calendrics." },
    { question: "A kiln is used to…", choices: ["Weave cloth", "Fire pottery", "Smelt coins", "Press olives"], answer: 1, explanation: "Kilns reach high temperatures to harden ceramics." },
    { question: "Which metal was common in Bronze Age tools?", choices: ["Tin", "Lead", "Gold", "Silver"], answer: 0, explanation: "Bronze is copper alloyed with tin." },
    { question: "Petroglyphs are…", choices: ["Paintings on canvas", "Rock carvings", "Iron engravings", "Paper etchings"], answer: 1, explanation: "Petroglyphs are images carved into rock surfaces." },
    { question: "Papyrus was used for…", choices: ["Food", "Writing material", "Armor", "Fuel"], answer: 1, explanation: "Papyrus sheets served as writing media in Egypt." },
    { question: "Which is a famous ancient city carved in rock?", choices: ["Petra", "Cairo", "Rome", "Athens"], answer: 0, explanation: "Petra in Jordan features rock-cut architecture." },
    { question: "A rune stone is associated with…", choices: ["Romans", "Vikings", "Persians", "Egyptians"], answer: 1, explanation: "Runestones record texts in runic script of Norse culture." },
    { question: "A mummy is a body…", choices: ["Burned", "Frozen", "Embalmed", "Petrified"], answer: 2, explanation: "Embalming preserves bodies; mummies were common in Egypt." },
    { question: "Which empire built aqueducts?", choices: ["Mongol", "Roman", "Inca", "Ottoman"], answer: 1, explanation: "Romans engineered aqueducts to supply water to cities." },
    { question: "A coin hoard is typically…", choices: ["Under water", "Buried", "Hung on trees", "Baked"], answer: 1, explanation: "Hoarded coins are often buried for safekeeping." },
    { question: "The Great Wall is in…", choices: ["India", "China", "Turkey", "Iran"], answer: 1, explanation: "China’s Great Wall spans thousands of kilometers." },
    { question: "A sarcophagus is a…", choices: ["Helmet", "Coffin", "Shield", "Sword"], answer: 1, explanation: "Sarcophagi are stone coffins used in burials." },
    { question: "Terraces for farming are found in…", choices: ["Deserts", "Mountain slopes", "Ice sheets", "Tundra"], answer: 1, explanation: "Terrace agriculture adapts to steep terrain." },
    { question: "The Sphinx is near…", choices: ["Luxor", "Giza", "Alexandria", "Aswan"], answer: 1, explanation: "The Great Sphinx lies on the Giza Plateau." },
    { question: "Celtic metalwork often used…", choices: ["Concrete", "Bronze", "Plastic", "Aluminum"], answer: 1, explanation: "Bronze and iron were prominent in Celtic artifacts." },
    { question: "An atlatl is a…", choices: ["Shield", "Spear-thrower", "Helmet", "Knife"], answer: 1, explanation: "An atlatl extends leverage to launch spears." },
    { question: "Neolithic means…", choices: ["New Stone Age", "Metal Age", "Ice Age", "Forest Age"], answer: 0, explanation: "Neolithic marks farming and polished stone tools." },
    { question: "A fresco is painted on…", choices: ["Dry bark", "Wet plaster", "Glass", "Metal"], answer: 1, explanation: "Fresco technique applies pigment to wet plaster walls." },
    { question: "Which is an ancient script of India?", choices: ["Kana", "Devanagari", "Hebrew", "Hangul"], answer: 1, explanation: "Devanagari is a historic and modern script of India." },
    { question: "The Indus Valley is in modern…", choices: ["Chile", "Pakistan/India", "Japan", "Morocco"], answer: 1, explanation: "Harappan sites span present-day Pakistan and India." },
    { question: "Ziggurats were built by…", choices: ["Greeks", "Mesopotamians", "Chinese", "Vikings"], answer: 1, explanation: "Stepped ziggurats rose in Mesopotamian cities." },
    { question: "A fibula in archaeology is…", choices: ["Bone", "Brooch", "Vessel", "Tool"], answer: 1, explanation: "Fibulae are brooches for fastening garments." },
    { question: "Pictographs are…", choices: ["Sound signs", "Picture symbols", "Numbers only", "Math icons"], answer: 1, explanation: "Pictographs represent objects using pictures." },
    { question: "A tell (tel) is…", choices: ["Marble tower", "Artificial mound", "Ice cave", "Salt dome"], answer: 1, explanation: "A tell accumulates layers of occupation debris." },
    { question: "Midden refers to…", choices: ["Palace", "Trash heap", "Temple", "Workshop"], answer: 1, explanation: "Middens are refuse deposits revealing daily life." },
    { question: "The Olmec are known for…", choices: ["Gold masks", "Colossal heads", "Blue glass", "Iron swords"], answer: 1, explanation: "Olmec made massive basalt heads in Mesoamerica." },
    { question: "Roman roads were famed for…", choices: ["Random paths", "Durability and planning", "Wood planks", "Glass tiles"], answer: 1, explanation: "Engineered layers made roads durable and straight." },
    { question: "A cist burial uses…", choices: ["Wood box", "Stone-lined grave", "Clay urn", "Metal vault"], answer: 1, explanation: "Cists are small stone-built grave chambers." },
    { question: "Chichen Itza belongs to…", choices: ["Egypt", "Maya", "Rome", "China"], answer: 1, explanation: "Chichen Itza is a major Maya site in Yucatán." },
    { question: "Which is a Greek pottery style?", choices: ["Blue and white", "Black-figure", "Plastic glaze", "Steel burnish"], answer: 1, explanation: "Black-figure pottery featured silhouetted figures." },
    { question: "A stela is typically…", choices: ["A woven mat", "An inscribed standing stone", "A bronze coin", "A wooden door"], answer: 1, explanation: "Stelae commemorate or mark events with inscriptions." }
  ],
  normal: [
    { question: "Clovis points are associated with which period?", choices: ["Neolithic", "Paleoindian", "Bronze Age", "Iron Age"], answer: 1, explanation: "Clovis points date to Paleoindian hunter-gatherers." },
    { question: "The Mississippian culture is centered in the…", choices: ["Southwest US", "Southeast US", "Pacific NW", "Great Basin"], answer: 1, explanation: "Mississippian mound centers flourished in the Southeast." },
    { question: "Linear B deciphers which Bronze Age civilization’s language?", choices: ["Hittites", "Mycenaeans", "Minoans", "Phoenicians"], answer: 1, explanation: "Linear B records Mycenaean Greek administrative texts." },
    { question: "Hopewell artifacts frequently use which metal?", choices: ["Bronze", "Copper", "Iron", "Lead"], answer: 1, explanation: "Copper was used in ceremonial Hopewell artifacts." },
    { question: "Chaco Canyon is notable for…", choices: ["Ice cities", "Great Houses and roads", "Marble palaces", "Terracotta towers"], answer: 1, explanation: "Ancestral Puebloans built monumental great houses and roads." },
    { question: "Thermoluminescence dating applies to…", choices: ["Bone", "Ceramics", "Textiles", "Glass only"], answer: 1, explanation: "It estimates firing/last heating of ceramics and sediments." },
    { question: "A faunal assemblage informs on…", choices: ["Politics", "Animal use/diet", "Astronomy", "Metallurgy"], answer: 1, explanation: "Faunal remains reveal diet, domestication, and environment." },
    { question: "The Antikythera mechanism is a(n)…", choices: ["Sword", "Analog computer", "Helmet", "Oil lamp"], answer: 1, explanation: "It modeled astronomical cycles with gears." },
    { question: "Uruk period marks emergence of…", choices: ["Rome", "Early cities in Mesopotamia", "Han China", "Norse states"], answer: 1, explanation: "Uruk saw urbanism, writing, and bureaucracy in Sumer." },
    { question: "Pollen analysis (palynology) reveals…", choices: ["Star maps", "Past vegetation", "Ocean currents", "Metal ratios"], answer: 1, explanation: "Fossil pollen reconstructs past environments and land use." },
    { question: "Tell el-Amarna letters document…", choices: ["Greek myths", "Diplomacy in the Late Bronze Age", "Roman law", "Chinese rites"], answer: 1, explanation: "Clay tablets record international diplomacy in cuneiform." },
    { question: "Göbekli Tepe is significant for…", choices: ["Bronze factories", "Early monumental ritual architecture", "Imperial palaces", "Medieval forts"], answer: 1, explanation: "c. 9600–8200 BCE site with massive T-pillars." },
    { question: "The Lapita culture is associated with…", choices: ["Andes", "Pacific migration and pottery", "Baltic", "Sahara"], answer: 1, explanation: "Lapita pottery tracks Austronesian expansion across the Pacific." },
    { question: "Dendrochronology dates…", choices: ["Sea shells", "Tree rings", "Clay tablets", "Iron nails"], answer: 1, explanation: "Matching ring patterns produces calendar dates." },
    { question: "Nazca lines are…", choices: ["Underground caves", "Geoglyphs in Peru", "Bronze inscriptions", "Ship timbers"], answer: 1, explanation: "Large ground drawings visible from the air." },
    { question: "A ground stone tool was typically used for…", choices: ["Throwing", "Grinding/processing", "Decoration only", "Surgery"], answer: 1, explanation: "Grinding stones processed grains and pigments." },
    { question: "Çatalhöyük is a…", choices: ["Roman fort", "Neolithic mega-site", "Medieval abbey", "Bronze foundry"], answer: 1, explanation: "Dense housing and rich art characterize this Neolithic site." },
    { question: "Bactrian camels aided…", choices: ["Desert irrigation", "Silk Road caravans", "Viking raids", "Roman navy"], answer: 1, explanation: "They were vital for Silk Road transport across deserts." },
    { question: "The Uluburun shipwreck carried…", choices: ["Coal", "Late Bronze Age prestige goods", "Steel", "Paper"], answer: 1, explanation: "Cargo included copper, tin, glass, ivory, and luxury items." },
    { question: "The Sumerians wrote on…", choices: ["Papyrus", "Clay tablets", "Silk", "Leather"], answer: 1, explanation: "Clay tablets impressed with cuneiform signs." },
    { question: "A bevel-rim bowl is typical of…", choices: ["Roman villas", "Uruk-period Mesopotamia", "Han China", "Maya temples"], answer: 1, explanation: "Mass-produced bowls linked to early urban provisioning." },
    { question: "Acheulean handaxes date to…", choices: ["20th century", "Lower Paleolithic", "Medieval", "Iron Age"], answer: 1, explanation: "Bifacial stone tools used by Homo erectus and others." },
    { question: "Tell sites form by…", choices: ["Earthquakes only", "Accumulated occupation debris", "Volcanoes", "Ice retreat"], answer: 1, explanation: "Long-term habitation creates stratified mounds." },
    { question: "Obsidian sourcing identifies…", choices: ["Ship routes", "Exchange networks", "Weather", "DNA"], answer: 1, explanation: "Geochemical fingerprints trace material movement." },
    { question: "Roman Vindolanda tablets record…", choices: ["Astronomy", "Daily letters and lists", "Greek epics", "Tax laws only"], answer: 1, explanation: "Ink-written wooden tablets near Hadrian’s Wall." },
    { question: "The Natufian culture is associated with…", choices: ["Nomadic camel riders", "Epipaleolithic sedentism", "Bronze metallurgy", "Medieval guilds"], answer: 1, explanation: "Early semi-sedentary foragers in the Levant." },
    { question: "Stratigraphy is the study of…", choices: ["Language", "Layered deposits", "Metals", "Stars"], answer: 1, explanation: "Layer sequences help interpret chronological relationships." },
    { question: "The Paracas textiles are famed for…", choices: ["Metal threads", "Complex Andean weaving", "Plastic fibers", "Chain mail"], answer: 1, explanation: "Exquisite preservation and intricate designs." },
    { question: "Shell middens are rich in…", choices: ["Gold", "Calcium carbonates and diet data", "Oil", "Iron"], answer: 1, explanation: "Reveal coastal subsistence and environmental records." },
    { question: "A wattle-and-daub wall uses…", choices: ["Steel beams", "Weaving and mud plaster", "Marble sheets", "Glass tiles"], answer: 1, explanation: "Interwoven sticks plastered with clay/mud." },
    { question: "The Beaker phenomenon involves…", choices: ["Steam engines", "Distinctive pottery and mobility", "Paper mills", "Plaster art"], answer: 1, explanation: "Bell Beaker pottery and isotopic mobility evidence." },
    { question: "Ethnoarchaeology compares…", choices: ["Stars", "Modern practices to past remains", "Pure theory", "Fiction"], answer: 1, explanation: "Observations of living cultures inform archaeological interpretation." },
    { question: "The Shroud of Turin studies center on…", choices: ["Stone age art", "Textile and image formation", "Bronze casting", "Runes"], answer: 1, explanation: "Material analysis and historical context are debated." },
    { question: "A quern is used to…", choices: ["Melt ice", "Grind grain", "Catch fish", "Weave cloth"], answer: 1, explanation: "Hand-operated grinding stones process cereals." },
    { question: "Moche pottery is known for…", choices: ["Minimalism", "Stirrup spouts and figural scenes", "Glass glazes", "Tin plates"], answer: 1, explanation: "Distinctive stirrup-spout vessels and narrative art." },
    { question: "Harappa is part of…", choices: ["Maya world", "Indus Civilization", "Roman Empire", "Norse lands"], answer: 1, explanation: "Major urban center in the Indus Valley." },
    { question: "Kurgans are…", choices: ["Stone towers", "Burial mounds in Eurasia", "Wood palisades", "Clay pits"], answer: 1, explanation: "Barrow-like mounds associated with steppe cultures." },
    { question: "A loom weight indicates…", choices: ["Carving", "Textile production", "Metal casting", "Hunting"], answer: 1, explanation: "Evidence of weaving at domestic contexts." },
    { question: "The Vinča symbols are…", choices: ["Modern emojis", "Early symbolic signs", "Arabic numerals", "Hangul"], answer: 1, explanation: "Controversial early signs from the Balkans." },
    { question: "An ossuary holds…", choices: ["Water", "Bones", "Coins", "Wheat"], answer: 1, explanation: "Containers for human skeletal remains." },
    { question: "Phoenician power centered on…", choices: ["Horse archers", "Maritime trade and colonies", "Ice roads", "Camel cavalry"], answer: 1, explanation: "Seafaring merchants founded colonies like Carthage." },
    { question: "Lapidary work involves…", choices: ["Glass blowing", "Stone carving/polishing", "Wood bending", "Leather tanning"], answer: 1, explanation: "Crafting gemstones and stone ornaments." },
    { question: "A cuniculus in archaeology often means…", choices: ["Sky tower", "Underground passage/tunnel", "River dam", "Plaster chute"], answer: 1, explanation: "Subterranean channels in ancient engineering." },
    { question: "Elaborate Mycenaean masks include…", choices: ["Iron masks", "Gold funerary masks", "Clay helmets", "Glass visors"], answer: 1, explanation: "Gold death masks like the ‘Mask of Agamemnon’." },
    { question: "Triremes are…", choices: ["Horse carts", "Oared warships", "Bronze kilns", "Stone barges"], answer: 1, explanation: "Three-banked oared vessels of classical navies." },
    { question: "Levallois technique is…", choices: ["Pottery glaze", "Prepared core stone flaking", "Iron bloom", "Textile dye"], answer: 1, explanation: "Middle Paleolithic method for predictable flakes." },
    { question: "Tiwanaku is located near…", choices: ["Nile Delta", "Lake Titicaca", "Rhine", "Yangtze"], answer: 1, explanation: "High-altitude Andean center near Lake Titicaca." },
    { question: "Ground-penetrating radar detects…", choices: ["Planet cores", "Subsurface features by reflections", "DNA strands", "Atmospheric CO2"], answer: 1, explanation: "GPR identifies buried structures and stratigraphy contrasts." },
    { question: "Strontium isotope analysis informs on…", choices: ["Color", "Mobility and provenance", "Weapon sharpness", "DNA sequences"], answer: 1, explanation: "Sr ratios track childhood geology and migration." }
  ],
  hard: [
    { question: "Harris Matrix is used to…", choices: ["Model economies", "Sequence stratigraphic units", "Analyze DNA", "Fire pottery"], answer: 1, explanation: "It diagrams context relationships in stratigraphy." },
    { question: "Holocene onset is roughly…", choices: ["100 ka", "11.7 ka BP", "2 ka", "50 ka"], answer: 1, explanation: "Holocene begins ~11,700 years before present." },
    { question: "Pazyryk burials are known for…", choices: ["Gold ships", "Frozen kurgans preserving textiles and tattoos", "Bronze skyscrapers", "Glass palaces"], answer: 1, explanation: "Permafrost preserved organic materials remarkably." },
    { question: "Rosette microblade technology is linked to…", choices: ["Ice carving", "Composite tools with standardized blades", "Roman mosaics", "Bronze studs"], answer: 1, explanation: "Serial microblade production for hafting." },
    { question: "Varves method dates…", choices: ["Tree rings", "Annual lake sediments", "Ice cores only", "Soot layers"], answer: 1, explanation: "Varves are seasonal laminae in lakes." },
    { question: "Use-wear analysis on tools identifies…", choices: ["Ownership", "Function via micro-polish/edge damage", "Trade routes only", "Magnetism"], answer: 1, explanation: "Microscopic traces reveal contact materials and motions." },
    { question: "Combe Grenal sequence documents…", choices: ["Neolithic farming", "Middle Paleolithic stratigraphy", "Roman trade", "Maya dynasties"], answer: 1, explanation: "Deep stratified deposits of Mousterian industries." },
    { question: "Taphonomy studies…", choices: ["Burial laws", "Processes from death to discovery", "Metal phases", "Language drift"], answer: 1, explanation: "It examines post-depositional transformations of remains." },
    { question: "The ‘Sea Peoples’ are discussed in…", choices: ["Han annals", "Late Bronze Age Mediterranean sources", "Norse sagas", "Toltec codices"], answer: 1, explanation: "They appear in Egyptian inscriptions and regional disruptions." },
    { question: "Scapula divination is common in…", choices: ["Modern Europe", "East Asian oracle bone traditions", "Antarctica", "Sahara"], answer: 1, explanation: "Shang dynasty oracle bones include scapula divination." },
    { question: "Petrification of organic material creates…", choices: ["Clay", "Fossils with mineral replacement", "Ice", "Resin"], answer: 1, explanation: "Minerals replace tissues preserving morphology." },
    { question: "Tephrochronology correlates layers using…", choices: ["Wind roses", "Volcanic ash fingerprints", "Mollusk shells", "Sand color"], answer: 1, explanation: "Geochemical signatures tie deposits to eruptions." },
    { question: "Obsidian hydration dating depends primarily on…", choices: ["UV exposure", "Hydration rind thickness", "Magnetic declination", "Protein residues"], answer: 2, explanation: "Hydration layers grow over time, indicating age." },
    { question: "Thermal alteration of lithics indicates…", choices: ["Sun bleaching", "Heat treatment for better flaking", "Water soaking", "Ice polishing"], answer: 2, explanation: "Heat treatment improves knappability of some cherts." },
    { question: "Seriation orders assemblages by…", choices: ["GPS only", "Changing style frequencies", "Metal content", "Site size"], answer: 2, explanation: "Frequency seriation charts stylistic change over time." },
    { question: "A ‘tell’ across Levant/Iraq is often…", choices: ["Natural dune", "Anthropogenic mound", "Glacier", "Salt dome"], answer: 2, explanation: "Human occupation layers build mounds over millennia." },
    { question: "Arsenical copper precedes widespread…", choices: ["Tin bronze", "Wrought iron", "Stainless steel", "Lead glass"], answer: 2, explanation: "Early alloys often used arsenic before tin bronze dominance." },
    { question: "Microliths are characteristic of…", choices: ["Medieval knights", "Mesolithic toolkits", "Roman legionaries", "Bronze elites"], answer: 2, explanation: "Small backed blades used in composite tools." },
    { question: "Iron bloom emerges from…", choices: ["Glass kiln", "Bloomery furnace", "Potter’s wheel", "Salt pan"], answer: 2, explanation: "Spongy mass of iron from bloomery smelting." },
    { question: "Metate and mano function to…", choices: ["Cut wood", "Grind grains/seeds", "Forge bronze", "Press olives"], answer: 2, explanation: "Grinding platforms and handstones for food processing." },
    { question: "Faunal calcaneus helps in…", choices: ["Astronomy", "Species ID and butchery analysis", "Ceramic flow", "Runic grammar"], answer: 2, explanation: "Foot bones show processing marks and species differences." },
    { question: "Neutron activation analysis (NAA) helps…", choices: ["Color films", "Source materials via elemental composition", "Cut wood", "Melt ice"], answer: 2, explanation: "Trace element fingerprints identify provenance." },
    { question: "AMS radiocarbon differs from conventional by…", choices: ["Counting atoms directly", "Wet chemistry only", "Bone dissolution alone", "Neutron activation"], answer: 0, explanation: "Accelerator Mass Spectrometry counts 14C atoms." },
    { question: "Varves method dates…", choices: ["Annual lake sediments", "Tree rings", "Ice cores only", "Soot layers"], answer: 0, explanation: "Varves are seasonal laminae in lakes." },
    { question: "Chalcolithic refers to…", choices: ["Copper-Stone transitional period", "Pure stone age", "Iron dominance", "Glass age"], answer: 0, explanation: "Copper use emerges alongside stone technologies." },
    { question: "Star Carr is…", choices: ["Mesolithic wetland site in England", "Roman villa", "Inca fort", "Bronze foundry"], answer: 0, explanation: "Exceptional organic preservation from waterlogged contexts." },
    { question: "Refitting study does what?", choices: ["Reassembles broken artifacts", "Stains ceramics", "Measures pollen", "Weighs bones"], answer: 0, explanation: "Rejoining fragments reconstructs object histories and knapping." },
    { question: "Chaîne opératoire records…", choices: ["Operational sequence of production", "Ownership", "Calories", "Altitude"], answer: 0, explanation: "Stepwise reconstruction of manufacturing processes." },
    { question: "Lapis lazuli in Bronze Age artifacts suggests…", choices: ["Afghanistan trade networks", "Local UK source", "Amazon quarries", "Iceland mines"], answer: 0, explanation: "Primary sources in Badakhshan linked via long-distance trade." },
    { question: "GPR survey detects…", choices: ["Subsurface features by wave reflections", "Planetary cores", "DNA strands", "Atmospheric CO2"], answer: 0, explanation: "GPR identifies buried structures and stratigraphy contrasts." },
    { question: "Beringia model proposes…", choices: ["Land bridge peopling of the Americas", "African origin of maize", "Roman conquest of China", "Viking colonization of Australia"], answer: 0, explanation: "Migration via Bering land bridge during glacial periods." },
    { question: "Copper smelting requires…", choices: ["Ore roasting and reducing atmosphere", "Cold water", "Alkaline baths", "Pure iron"], answer: 0, explanation: "Roasted ore and charcoal reduce copper compounds to metal." },
    { question: "Kerbs around Neolithic monuments serve…", choices: ["Structural/ritual boundary", "Water pipes", "Sewers", "Steam vents"], answer: 0, explanation: "Stone kerbs define mounds and manage erosion." },
    { question: "Osteological paradox addresses…", choices: ["Bias in skeletal samples and disease visibility", "Perfect health", "DNA errors", "Metal fatigue"], answer: 0, explanation: "Survivorship and frailty complicate health inferences." },
    { question: "Bitumen in archaeology is used for…", choices: ["Adhesive and waterproofing", "Food spice", "Jewelry polish", "Grain dye"], answer: 0, explanation: "Natural asphalt seals vessels and hafts tools." },
    { question: "Which isotope fraction is central to radiocarbon dating corrections?", choices: ["δ18O", "δ13C", "δ34S", "δ15N"], answer: 3, explanation: "δ13C normalizes isotopic fractionation in 14C dating." },
    { question: "Göbekli Tepe is significant for…", choices: ["Bronze factories", "Early monumental ritual architecture", "Imperial palaces", "Medieval forts"], answer: 3, explanation: "c. 9600–8200 BCE site with massive T-pillars." },
    { question: "Dendrochronology dates…", choices: ["Sea shells", "Tree rings", "Clay tablets", "Iron nails"], answer: 3, explanation: "Matching ring patterns produces calendar dates." },
    { question: "Nazca lines are…", choices: ["Underground caves", "Geoglyphs in Peru", "Bronze inscriptions", "Ship timbers"], answer: 3, explanation: "Large ground drawings visible from the air." },
    { question: "Çatalhöyük is a…", choices: ["Roman fort", "Neolithic mega-site", "Medieval abbey", "Bronze foundry"], answer: 3, explanation: "Dense housing and rich art characterize this Neolithic site." },
    { question: "The Lapita culture is associated with…", choices: ["Andes", "Pacific migration and pottery", "Baltic", "Sahara"], answer: 3, explanation: "Lapita pottery tracks Austronesian expansion." },
    { question: "The Antikythera mechanism is a(n)…", choices: ["Sword", "Analog computer", "Helmet", "Oil lamp"], answer: 3, explanation: "It modeled astronomical cycles with gears." },
    { question: "Tell el-Amarna letters document…", choices: ["Greek myths", "Diplomacy in the Late Bronze Age", "Roman law", "Chinese rites"], answer: 3, explanation: "Clay tablets record international diplomacy." },
    { question: "Uruk period marks emergence of…", choices: ["Rome", "Early cities in Mesopotamia", "Han China", "Norse states"], answer: 3, explanation: "Uruk saw urbanism, writing, and bureaucracy." },
    { question: "Pollen analysis reveals…", choices: ["Star maps", "Past vegetation", "Ocean currents", "Metal ratios"], answer: 3, explanation: "Fossil pollen reconstructs past environments." }
  ]  
};

// State
let selectedLevel = "easy";
let questions = [];
let current = 0;
let score = 0;
let startTime = null;
let timerInterval = null;

function startQuiz() {
  // 1. Get selected difficulty
  const selectedDifficulty = document.querySelector(".level-btn.active").dataset.level;

  // 2. Get number of questions the user selected
  const totalQuestions = parseInt(document.getElementById("question-count").value);

  // 3. Load all questions for that difficulty
  questions = [...allQuestions[selectedDifficulty]];

  // 4. Shuffle the questions
  questions = questions.sort(() => Math.random() - 0.5);

  // 5. Slice the list to the selected amount (THIS IS STEP 2)
  questions = questions.slice(0, totalQuestions);

  // 6. Reset quiz state
  currentQuestionIndex = 0;
  score = 0;

  // 7. Load the first question
  loadQuestion();
}

// DOM elements
const questionText = document.getElementById("question-text");
const choicesBox = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const resetBtn = document.getElementById("reset-btn");
const scoreDisplay = document.getElementById("score-display");
const progressDisplay = document.getElementById("progress-display");
const timerDisplay = document.getElementById("timer-display");

// Difficulty selection
document.querySelectorAll(".level-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedLevel = btn.dataset.level;
    document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderLeaderboard(selectedLevel); // show relevant leaderboard
  });
});

// Start quiz
document.getElementById("start-btn").addEventListener("click", () => {
  questions = [...allQuestions[selectedLevel]]; // use full set (50 items)
  current = 0;
  score = 0;
  feedback.textContent = "";
  showQuestion();
  startTimer();
  nextBtn.style.display = "none";
  resetBtn.style.display = "inline-block";
});

// Show question
function showQuestion() {
  const q = questions[current];
  if (!q) return endQuiz();
  questionText.textContent = q.question;
  progressDisplay.textContent = `Question ${current + 1} / ${questions.length}`;
  scoreDisplay.textContent = `Score: ${score}`;
  choicesBox.innerHTML = "";
  feedback.textContent = "";

  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.addEventListener("click", () => selectAnswer(idx));
    choicesBox.appendChild(btn);
  });
}

// Select answer
function selectAnswer(idx) {
  const q = questions[current];
  const buttons = Array.from(document.querySelectorAll(".choice-btn"));
  buttons.forEach(b => (b.disabled = true));

  if (idx === q.answer) {
    buttons[idx].classList.add("correct");
    feedback.textContent = "Correct!";
    score++;
  } else {
    buttons[idx].classList.add("wrong");
    buttons[q.answer].classList.add("correct");
    feedback.textContent = `Not quite. Correct: ${q.choices[q.answer]} — ${q.explanation}`;
  }

  nextBtn.style.display = "inline-block";
  nextBtn.onclick = () => {
    current++;
    nextBtn.style.display = "none";
    showQuestion();
  };
}

// End quiz
function endQuiz() {
  stopTimer();
  const totalSeconds = getElapsedSeconds();
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  questionText.textContent = `Finished! You scored ${score}/${questions.length}. Time: ${mins}m ${secs}s`;
  choicesBox.innerHTML = "";
  feedback.textContent = "";
  nextBtn.style.display = "none";

  saveRecord(selectedLevel, score, totalSeconds);
  renderLeaderboard(selectedLevel);
}

// Reset quiz
resetBtn.addEventListener("click", () => {
  stopTimer();
  timerDisplay.textContent = "Time: 0s";
  questionText.textContent = "Choose a difficulty and press Start.";
  choicesBox.innerHTML = "";
  feedback.textContent = "";
  progressDisplay.textContent = "";
  scoreDisplay.textContent = "";
  nextBtn.style.display = "none";
  resetBtn.style.display = "none";
});

// Timer
function startTimer() {
  startTime = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerDisplay.textContent = `Time: ${getElapsedSeconds()}s`;
  }, 200);
}
function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}
function getElapsedSeconds() {
  if (!startTime) return 0;
  return Math.floor((Date.now() - startTime) / 1000);
}

// Leaderboard persistence
function saveRecord(level, score, time) {
  const records = JSON.parse(localStorage.getItem("triviaRecords") || "{}");
  if (!records[level]) records[level] = [];
  records[level].push({ score, time, date: new Date().toLocaleString() });
  records[level].sort((a,b) => b.score - a.score || a.time - b.time);
  records[level] = records[level].slice(0,5); // keep top 5
  localStorage.setItem("triviaRecords", JSON.stringify(records));
}

function renderLeaderboard(level) {
  const records = JSON.parse(localStorage.getItem("triviaRecords") || "{}");
  const existing = document.getElementById("leaderboard-box");
  if (existing) existing.remove();

  const box = document.createElement("div");
  box.id = "leaderboard-box";
  box.style.marginTop = "0.75rem";
  box.style.background = "var(--tea-green)";
  box.style.padding = "0.75rem";
  box.style.borderRadius = "8px";

  const title = document.createElement("h4");
  title.textContent = `Top Scores — ${capitalize(level)}`;
  title.style.margin = "0 0 0.5rem 0";
  box.appendChild(title);

  const list = document.createElement("ul");
  list.style.listStyle = "none";
  list.style.padding = "0";

  if (records[level] && records[level].length) {
    records[level].forEach(r => {
      const li = document.createElement("li");
      li.textContent = `${r.score}/50 in ${r.time}s (${r.date})`;
      list.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No records yet. Be the first!";
    list.appendChild(li);
  }

  box.appendChild(list);
  // Attach under HUD
  const hud = document.getElementById("hud");
  hud.parentNode.insertBefore(box, hud.nextSibling);
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
