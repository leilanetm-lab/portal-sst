const quimicos = [

    { id: 1, nome: "1,1,2-Tricloroetano (Tricloreto de vinila)" },

    { id: 2, nome: "1,2 Dicloroetano (Dicloreto de etileno)" },

    { id: 3, nome: "1,2-Dicloroetano" },

    { id: 4, nome: "1,3-Butadieno" },

    { id: 5, nome: "1,4 Dioxana" },

    { id: 6, nome: "1,4-Dioxano" },

    { id: 7, nome: "1-Hexeno" },

    { id: 8, nome: "2 Metoxietanol" },

    { id: 9, nome: "2-Butoxi-Etanol" },

    { id: 10, nome: "2-Etoxietanol (cellosolve ou Éter monoetílico do etileno glicol)" },

    { id: 11, nome: "2-Metil naftaleno" },

    { id: 12, nome: "Acetaldeído" },

    { id: 13, nome: "Acetato de 2-butoxietila" },

    { id: 14, nome: "Acetato de 2-etoxi etila (Acetato de cellosolve ou Acetato de éter monoetílico de etileno glicol)" },

    { id: 15, nome: "Acetato de etila" },

    { id: 16, nome: "Acetato de Isopentila" },

    { id: 17, nome: "Acetato de metila" },

    { id: 18, nome: "Acetato de n-butila" },

    { id: 19, nome: "Acetato de pentila" },

    { id: 20, nome: "Acetato de vinila" },

    { id: 21, nome: "Acetileno" },

    { id: 22, nome: "Acetona (propanona)" },

    { id: 23, nome: "Acetonitrila" },

    { id: 24, nome: "Ácido Acético" },

    { id: 25, nome: "Ácido acrílico" },

    { id: 26, nome: "Ácido Amino-1-Hidroxi Naftol-2-Sulfônico-4." },

    { id: 27, nome: "Ácido Bórico (Borato)" },

    { id: 28, nome: "Ácido Clorídrico" },

    { id: 29, nome: "Acido Dodecilbenzeno Sulfonico" },

    { id: 30, nome: "Ácido fluorídrico" },

    { id: 31, nome: "Ácido Fluossilícico" },

    { id: 32, nome: "Ácido fosfórico" },

    { id: 33, nome: "Ácido nítrico" },

    { id: 34, nome: "Ácido Oxálico anidro" },

    { id: 35, nome: "Ácido sulfúrico" },

    { id: 36, nome: "Acrilato de etila" },

    { id: 37, nome: "Acrilato de metila" },

    { id: 38, nome: "Acrilato de n-butila" },

    { id: 39, nome: "Acrilonitrila (cianeto de vinila)" },

    { id: 40, nome: "Alcatrão de hulha, produtos voláteis como aerossóis solúveis em benzeno." },

    { id: 41, nome: "Álcool etílico (etanol)" },

    { id: 42, nome: "Álcool isopropílico (isopropanol ou 2-propanol)" },

    { id: 43, nome: "Álcool Isotridecilico" },

    { id: 44, nome: "Álcool Laurilico" },

    { id: 45, nome: "Álcool metílico (metanol)" },

    { id: 46, nome: "Álcool n-butílico (n-butanol)" },

    { id: 47, nome: "Álcool sec-butílico (sec-butanol)" },

    { id: 48, nome: "Alumínio metal e compostos insolúveis" },

    { id: 49, nome: "Amianto/Asbestos" },

    { id: 50, nome: "Amido" },

    { id: 51, nome: "Amônia (gás amoníaco)" },

    { id: 52, nome: "Anidro sulfuroso (dióxido de enxofre)" },

    { id: 53, nome: "Arsênio e seus compostos (arsênico)" },

    { id: 54, nome: "Asfalto (betume), fumos" },

    { id: 55, nome: "Azida de Sódio" },

    { id: 56, nome: "Bário e compostos solúveis" },

    { id: 57, nome: "Benzeno e seus compostos tóxicos" },

    { id: 58, nome: "Butenos, todos os isômeros" },

    { id: 59, nome: "Cádmio e seus compostos tóxicos" },

    { id: 60, nome: "Carvão mineral e seus derivados (Pó de carvão - antrative)" },

    { id: 61, nome: "Carvão mineral e seus derivados (Pó de carvão - betuminoso)" },

    { id: 62, nome: "Celulose" },

    { id: 63, nome: "Chumbo e seus compostos tóxicos" },

    { id: 64, nome: "Ciclohexano" },

    { id: 65, nome: "Cimento portland" },

    { id: 66, nome: "Cloreto de amônio - fumos" },

    { id: 67, nome: "Cloreto de etila (cloroetano)" },

    { id: 68, nome: "Cloreto de fenila (clorobenzeno)" },

    { id: 69, nome: "Cloreto de polivinila (PVC (policloreto de vinila))" },

    { id: 70, nome: "Cloreto de vinila (cloroetílico)" },

    { id: 71, nome: "Cloro e seus composto tóxicos" },

    { id: 72, nome: "Clorodifluormetano (freon 22)" },

    { id: 73, nome: "Clorofórmio (Triclorometano)" },

    { id: 74, nome: "Cobre" },

    { id: 75, nome: "Cresol, todos os isômeros" },

    { id: 76, nome: "Cromato de chumbo" },

    { id: 77, nome: "Cromo e seus compostos tóxicos (inclui metal e compostos de Cr III, compostos de Cr VI solúveis em água e compostos de Cr VI insolúveis)" },

    { id: 78, nome: "Diacetona Alcool" },

    { id: 79, nome: "Dibutilftalato (ftalato de dibutila)" },

    { id: 80, nome: "Diclorofluormetano (freon 12)" },

    { id: 81, nome: "Diclorometano (Cloreto de metileno)" },

    { id: 82, nome: "Diclorotetrafluoretano (freon 114)" },

    { id: 83, nome: "Dietanolamina" },

    { id: 84, nome: "Dietilenoglicol" },

    { id: 85, nome: "Dietilftalato (ftalato de dietila)" },

    { id: 86, nome: "Dimetilformamida" },

    { id: 87, nome: "Dinitrotolueno" },

    { id: 88, nome: "Dióxido de carbono (gás carbônico)" },

    { id: 89, nome: "Dióxido de Nitrogênio" },

    { id: 90, nome: "Dioxido de silicio" },

    { id: 91, nome: "Estanho - compostos inorgânicos e óxido, exceto hidreto de estanho" },

    { id: 92, nome: "Estanho - metal" },

    { id: 93, nome: "Estanho e seus compostos orgânicos" },

    { id: 94, nome: "Estireno (vinibenzeno)" },

    { id: 95, nome: "Etalonamina" },

    { id: 96, nome: "Etano" },

    { id: 97, nome: "Éter Butílico do trietileno glicol" },

    { id: 98, nome: "Éter de Petróleo" },

    { id: 99, nome: "Éter etil terc-butílico" },

    { id: 100, nome: "Éter Etílico" },

    { id: 101, nome: "Éter monobutílico de dietileno glicol" },

    { id: 102, nome: "Etilbenzeno (estilbenzeno)" },

    { id: 103, nome: "Etileno" },

    { id: 104, nome: "Etilenoglicol" },

    { id: 105, nome: "Fenol" },

    { id: 106, nome: "Fenotiazine" },

    { id: 107, nome: "Ferro, óxido (Fe2O3)" },

    { id: 108, nome: "Fibras Vítreas Sintéticas - Fibras de lã de rocha" },

    { id: 109, nome: "Fibras Vítreas Sintéticas - Fibras de lã de vidro" },

    { id: 110, nome: "Fibras Vítreas Sintéticas - Fibras de vidro de filamento contínuo" },

    { id: 111, nome: "Fluortriclorometano (triclorofluormetano ou freon 11)" },

    { id: 112, nome: "Formaldeído (formol ou Aldeído fórmico)" },

    { id: 113, nome: "Formiato de etila" },

    { id: 114, nome: "Fosfina (fosfamina)" },

    { id: 115, nome: "Fósforo e seus compostos tóxicos" },

    { id: 116, nome: "Ftalato de di(2-etilhexila)" },

    { id: 117, nome: "Fumos metálicos" },

    { id: 118, nome: "Gasolina" },

    { id: 119, nome: "Hexano, outros isômeros que não o n-Hexano" },

    { id: 120, nome: "Hidroquinona" },

    { id: 121, nome: "Hidroxi etano sulfonato de sódio" },

    { id: 122, nome: "Hidróxido de cálcio - Cal" },

    { id: 123, nome: "Hidróxido de Potássio" },

    { id: 124, nome: "Hidróxido de sódio - Soda Cáustica" },

    { id: 125, nome: "Hydroxybutyl Vinyl Ether" },

    { id: 126, nome: "Iodo e Iodetos" },

    { id: 127, nome: "Madeira, poeiras - Cedro Vermelho do Oeste" },

    { id: 128, nome: "Madeira, poeiras - Todas as outras espécies" },

    { id: 129, nome: "Manganês e seus compostos, fumos" },

    { id: 130, nome: "Manganês e seus compostos, poeira" },

    { id: 131, nome: "Mercúrio e seus compostos" },

    { id: 132, nome: "Metabisulfito de sódio" },

    { id: 133, nome: "Metacrilato de metila" },

    { id: 134, nome: "Metil etil cetona (MEK) (Butanona)" },

    { id: 135, nome: "Metil isobutil cetona" },

    { id: 136, nome: "Metil mercaptana (metanotiol)" },

    { id: 137, nome: "Metil n-amil cetona" },

    { id: 138, nome: "Metildiglicol" },

    { id: 139, nome: "Metiltriglicol" },

    { id: 140, nome: "Molibdénio" },

    { id: 141, nome: "Monolaurato de sorbitano" },

    { id: 142, nome: "Monóxido de carbono" },

    { id: 143, nome: "Morfolina" },

    { id: 144, nome: "n-Butano" },

    { id: 145, nome: "n-Hexano" },

    { id: 146, nome: "Naftaleno" },

    { id: 147, nome: "Negro de fumo" },

    { id: 148, nome: "Níquel e seus compostos tóxicos (inclui níquel carbonila e níquel tetracarbonila)" },

    { id: 149, nome: "Nitrato de Chumbo" },

    { id: 150, nome: "Nonano" },

    { id: 151, nome: "Nonilfenol" },

    { id: 152, nome: "o-Diclorobenzeno" },

    { id: 153, nome: "Óleo de Mamona" },

    { id: 154, nome: "Óleo de palmiste refinado" },

    { id: 155, nome: "Óleo mineral, excluídos os fluídos de trabalho com metais - Puro, alta e severamente refinado" },

    { id: 156, nome: "Óxido de cálcio" },

    { id: 157, nome: "Óxido de Etileno" },

    { id: 158, nome: "Óxido de zinco" },

    { id: 159, nome: "Ozônio - Trabalho moderado" },

    { id: 160, nome: "p-Diclorobenzeno" },

    { id: 161, nome: "Parafina, cera (fumos)" },

    { id: 162, nome: "Particulados (PNOS) - não respiráveis" },

    { id: 163, nome: "Particulados (PNOS) - respiráveis" },

    { id: 164, nome: "Pentano, outros Isômeros" },

    { id: 165, nome: "Pentoxido de Vanádio" },

    { id: 166, nome: "Percloroetileno (Tetracloroetileno)" },

    { id: 167, nome: "Peróxido de hidrogênio" },

    { id: 168, nome: "Petróleo e seus derivados, exceto óleo diesel, gasolina, querosene e nafta" },

    { id: 169, nome: "Piridina" },

    { id: 170, nome: "Poeira de grãos – Trigo" },

    { id: 171, nome: "Polietileno glicol" },

    { id: 172, nome: "Prata e seus compostos - metal, poeira e fumos" },

    { id: 173, nome: "Produtos Domissanitários" },

    { id: 174, nome: "Propileno" },

    { id: 175, nome: "Sacarose - açucar" },

    { id: 176, nome: "Sílica livre (sílica livre cristalizada) - DC3" },

    { id: 177, nome: "Sílica livre (sílica livre cristalizada) - poeira respirável" },

    { id: 178, nome: "Sílica livre (sílica livre cristalizada) - poeira total" },

    { id: 179, nome: "Soda Cáustica em escamas" },

    { id: 180, nome: "Sulfato de cálcio (gesso)" },

    { id: 181, nome: "Sulfeto de hidrogênio (Gás sulfídrico)" },

    { id: 182, nome: "Tetracloreto de carbono" },

    { id: 183, nome: "Tetracloroetano (1,1,2,2-Tetracloroetano)" },

    { id: 184, nome: "Tetrahidrofurano" },

    { id: 185, nome: "Tintas e solventes orgânicos" },

    { id: 186, nome: "Tolueno (toluol)" },

    { id: 187, nome: "Tricloreto de fósforo" },

    { id: 188, nome: "Tricloroetileno" },

    { id: 189, nome: "Trietanolamina" },

    { id: 190, nome: "Trietilenoglicol" },

    { id: 191, nome: "Trimetil benzeno (mistura de isômeros)" },

    { id: 192, nome: "Xileno (xilol)" },

    { id: 193, nome: "Zircônio e compostos" },

    { id: 194, nome: "Ácido N- Fosfonometiliminodiacético" },

    { id: 195, nome: "Ácido Clorídrico" },

    { id: 196, nome: "Ácido Fosforoso" },

    { id: 197, nome: "Ácido Iminodiacético Dissódico" },

    { id: 198, nome: "Ácido peracético" },

    { id: 199, nome: "Acroleína" },

    { id: 200, nome: "Aguarrás mineral" },

    { id: 201, nome: "Álcalis cáusticos" },

    { id: 202, nome: "Álcool isobutílico (isobutanol)" },

    { id: 203, nome: "Álcool n-propílico (n-propanol)" },

    { id: 204, nome: "Antraceno" },

    { id: 205, nome: "Argônio" },

    { id: 206, nome: "Benzo[a]antraceno" },

    { id: 207, nome: "breu" },

    { id: 208, nome: "Cloreto de zinco, fumos" },

    { id: 209, nome: "Cobalto e seus compostos inorgânicos" },

    { id: 210, nome: "Destilação do alcatrão de hulha" },

    { id: 211, nome: "GLP (gás liquefeito do petróleo)" },

    { id: 212, nome: "Hidrogênio" },

    { id: 213, nome: "Hormônios sexuais femininos (apenas para homens)" },

    { id: 214, nome: "Isopropil benzeno (cumeno)" },

    { id: 215, nome: "Metano" },

    { id: 216, nome: "N-(Fosfonometil) glicina - Glifosato" },

    { id: 217, nome: "n-propano (propano)" },

    { id: 218, nome: "Óleo diesel" },

    { id: 219, nome: "Persulfatos, como persulfato" },

    { id: 220, nome: "Prata e seus compostos - compostos solúveis" },

    { id: 221, nome: "Querosene combustível de avião, como vapor de hidrocarbonetos totais" },

    { id: 222, nome: "Resina de vareta (eletrodo arame) de solda, produtos da decomposição térmica (breu)" },

    { id: 223, nome: "Silicato de cálcio, sintético não fibroso" },

    { id: 224, nome: "Silicatos"}

];

export default quimicos;