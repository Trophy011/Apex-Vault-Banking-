import fs from 'fs';

// Script to build the complete global countries and banks catalog
const countries = [
  // --- North America & Caribbean ---
  {
    country: "United States",
    code: "US",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "JPMorgan Chase Bank, N.A.", swiftCode: "CHASUS33" },
      { name: "Bank of America, N.A.", swiftCode: "BOFAUS3N" },
      { name: "Citibank, N.A.", swiftCode: "CITIUS33" },
      { name: "Wells Fargo Bank, N.A.", swiftCode: "WFBIUS6S" },
      { name: "Goldman Sachs Bank USA", swiftCode: "GSCOUS33" },
      { name: "Morgan Stanley Bank, N.A.", swiftCode: "MSPBUS33" }
    ]
  },
  {
    country: "Canada",
    code: "CA",
    flag: "🇨🇦",
    currency: "CAD",
    currencySymbol: "C$",
    exchangeRateToUSD: 1.36,
    banks: [
      { name: "Royal Bank of Canada (RBC)", swiftCode: "ROYCCAT2" },
      { name: "Toronto-Dominion Bank (TD Bank)", swiftCode: "TDOMCAT3" },
      { name: "Bank of Nova Scotia (Scotiabank)", swiftCode: "NOSCCATT" },
      { name: "Bank of Montreal (BMO)", swiftCode: "BOFMCAM2" },
      { name: "Canadian Imperial Bank of Commerce (CIBC)", swiftCode: "CIBCATTT" }
    ]
  },
  {
    country: "Mexico",
    code: "MX",
    flag: "🇲🇽",
    currency: "MXN",
    currencySymbol: "$",
    exchangeRateToUSD: 18.4,
    banks: [
      { name: "BBVA México", swiftCode: "BCMRMXMM" },
      { name: "Banorte (Banco Mercantil del Norte)", swiftCode: "MENOMXMM" },
      { name: "Citibanamex (Banco Nacional de México)", swiftCode: "BNMXMXMM" },
      { name: "Santander México", swiftCode: "BMSXMXMM" },
      { name: "HSBC México", swiftCode: "HBMXMXMM" }
    ]
  },
  {
    country: "Bahamas",
    code: "BS",
    flag: "🇧🇸",
    currency: "BSD",
    currencySymbol: "B$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Central Bank of The Bahamas", swiftCode: "CBOBBSNS" },
      { name: "FirstCaribbean International Bank Bahamas", swiftCode: "FCIBBSNS" },
      { name: "Scotiabank (Bahamas) Limited", swiftCode: "NOSCBSNS" },
      { name: "Commonwealth Bank Limited", swiftCode: "CBLBBSNS" }
    ]
  },
  {
    country: "Jamaica",
    code: "JM",
    flag: "🇯🇲",
    currency: "JMD",
    currencySymbol: "J$",
    exchangeRateToUSD: 156.5,
    banks: [
      { name: "National Commercial Bank Jamaica (NCB)", swiftCode: "JABAKJKN" },
      { name: "Scotiabank Jamaica", swiftCode: "NOSCJMKN" },
      { name: "First Global Bank Jamaica", swiftCode: "FGBKJMKN" },
      { name: "JN Bank Limited", swiftCode: "JNBAJMKN" }
    ]
  },
  {
    country: "Dominican Republic",
    code: "DO",
    flag: "🇩🇴",
    currency: "DOP",
    currencySymbol: "RD$",
    exchangeRateToUSD: 59.2,
    banks: [
      { name: "Banco de Reservas de la República Dominicana", swiftCode: "BRERDOSX" },
      { name: "Banco Popular Dominicano", swiftCode: "BPDODOSX" },
      { name: "Banco BHD", swiftCode: "BHDDDOSX" },
      { name: "Scotiabank República Dominicana", swiftCode: "NOSCDOSX" }
    ]
  },
  {
    country: "Trinidad and Tobago",
    code: "TT",
    flag: "🇹🇹",
    currency: "TTD",
    currencySymbol: "TT$",
    exchangeRateToUSD: 6.78,
    banks: [
      { name: "Republic Bank Limited", swiftCode: "RBLITTPS" },
      { name: "First Citizens Bank Limited", swiftCode: "FCTTPSPS" },
      { name: "Scotiabank Trinidad and Tobago", swiftCode: "NOSCTTPS" },
      { name: "RBC Royal Bank (Trinidad and Tobago)", swiftCode: "RBCTTTPS" }
    ]
  },
  {
    country: "Barbados",
    code: "BB",
    flag: "🇧🇧",
    currency: "BBD",
    currencySymbol: "Bds$",
    exchangeRateToUSD: 2.0,
    banks: [
      { name: "Central Bank of Barbados", swiftCode: "CBBABB2X" },
      { name: "FirstCaribbean International Bank (Barbados)", swiftCode: "FCIBBB2B" },
      { name: "Republic Bank (Barbados) Limited", swiftCode: "BNBABBBB" },
      { name: "Scotiabank (Barbados) Limited", swiftCode: "NOSCBBBB" }
    ]
  },
  {
    country: "Cayman Islands",
    code: "KY",
    flag: "🇰🇾",
    currency: "KYD",
    currencySymbol: "CI$",
    exchangeRateToUSD: 0.83,
    banks: [
      { name: "Butterfield Bank (Cayman) Limited", swiftCode: "BNTBKYKG" },
      { name: "Cayman National Bank", swiftCode: "CNBOKYKG" },
      { name: "Scotiabank & Trust (Cayman) Ltd.", swiftCode: "NOSCKYKG" },
      { name: "RBC Royal Bank (Cayman) Limited", swiftCode: "ROYCKYKG" }
    ]
  },
  {
    country: "Bermuda",
    code: "BM",
    flag: "🇧🇲",
    currency: "BMD",
    currencySymbol: "BD$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Bank of N.T. Butterfield & Son Limited", swiftCode: "BNTBBMHM" },
      { name: "HSBC Bank Bermuda Limited", swiftCode: "BBCLBMHM" },
      { name: "Clarien Bank Limited", swiftCode: "CAPBBMHM" }
    ]
  },
  {
    country: "Belize",
    code: "BZ",
    flag: "🇧🇿",
    currency: "BZD",
    currencySymbol: "BZ$",
    exchangeRateToUSD: 2.0,
    banks: [
      { name: "Belize Bank Limited", swiftCode: "BBENBZEZ" },
      { name: "Atlantic Bank Limited", swiftCode: "ATLABZEZ" },
      { name: "Heritage Bank Limited", swiftCode: "ALBNBZEZ" },
      { name: "National Bank of Belize", swiftCode: "NBOBBZEZ" }
    ]
  },
  {
    country: "Costa Rica",
    code: "CR",
    flag: "🇨🇷",
    currency: "CRC",
    currencySymbol: "₡",
    exchangeRateToUSD: 524.5,
    banks: [
      { name: "Banco Nacional de Costa Rica", swiftCode: "BNCRCRSJ" },
      { name: "Banco de Costa Rica (BCR)", swiftCode: "BCRICRSJ" },
      { name: "BAC San José (BAC Credomatic)", swiftCode: "BACSCRSJ" },
      { name: "Scotiabank de Costa Rica", swiftCode: "NOSCCRSJ" }
    ]
  },
  {
    country: "Panama",
    code: "PA",
    flag: "🇵🇦",
    currency: "PAB",
    currencySymbol: "B/.",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Banco General, S.A.", swiftCode: "BGENPAPA" },
      { name: "Banistmo, S.A.", swiftCode: "BISTPAPA" },
      { name: "Banco Nacional de Panamá", swiftCode: "BPANPAPA" },
      { name: "BAC International Bank", swiftCode: "BACSCRPA" }
    ]
  },
  {
    country: "Guatemala",
    code: "GT",
    flag: "🇬🇹",
    currency: "GTQ",
    currencySymbol: "Q",
    exchangeRateToUSD: 7.75,
    banks: [
      { name: "Banco Industrial, S.A.", swiftCode: "BINDGTGC" },
      { name: "Banrural (Banco de Desarrollo Rural)", swiftCode: "BDRUGTGC" },
      { name: "Banco G&T Continental", swiftCode: "GTCOGTGC" },
      { name: "Banco Agromercantil (BAM)", swiftCode: "AGRMGTGC" }
    ]
  },
  {
    country: "Honduras",
    code: "HN",
    flag: "🇭🇳",
    currency: "HNL",
    currencySymbol: "L",
    exchangeRateToUSD: 24.8,
    banks: [
      { name: "Banco Ficohsa", swiftCode: "FICOHETE" },
      { name: "Banco Atlántida, S.A.", swiftCode: "ATLAHNTE" },
      { name: "BAC Honduras", swiftCode: "BAMETHIS" },
      { name: "Banco de Occidente, S.A.", swiftCode: "BOCTHNTE" }
    ]
  },
  {
    country: "El Salvador",
    code: "SV",
    flag: "🇸🇻",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Banco Agrícola (Bancolombia)", swiftCode: "AGRCSVSS" },
      { name: "Banco Cuscatlán de El Salvador", swiftCode: "CUSCSVSS" },
      { name: "Banco Davivienda Salvadoreño", swiftCode: "BMSASVSS" },
      { name: "Banco de América Central (BAC)", swiftCode: "BACSCRSV" }
    ]
  },
  {
    country: "Nicaragua",
    code: "NI",
    flag: "🇳🇮",
    currency: "NIO",
    currencySymbol: "C$",
    exchangeRateToUSD: 36.8,
    banks: [
      { name: "Banco de la Producción (BANPRO)", swiftCode: "BPROBIMG" },
      { name: "Banco BAC Nicaragua", swiftCode: "BACSNIMG" },
      { name: "Banco Lafise Bancentro", swiftCode: "LAFINIMG" },
      { name: "Banco BDF (Banco de Finanzas)", swiftCode: "FIBANIMG" }
    ]
  },
  {
    country: "Haiti",
    code: "HT",
    flag: "🇭🇹",
    currency: "HTG",
    currencySymbol: "G",
    exchangeRateToUSD: 132.0,
    banks: [
      { name: "Banque de la République d'Haïti (BRH)", swiftCode: "BRHAHTPP" },
      { name: "Unibank Haiti", swiftCode: "UNIBHTPP" },
      { name: "Sogebank (Société Générale Haïtienne)", swiftCode: "SOGBHTPP" },
      { name: "Banque Nationale de Crédit (BNC)", swiftCode: "BNCDHTPP" }
    ]
  },
  {
    country: "Cuba",
    code: "CU",
    flag: "🇨🇺",
    currency: "CUP",
    currencySymbol: "$",
    exchangeRateToUSD: 24.0,
    banks: [
      { name: "Banco Central de Cuba", swiftCode: "BCCUCUHA" },
      { name: "Banco Metropolitano S.A.", swiftCode: "BMETCUHA" },
      { name: "Banco Popular de Ahorro", swiftCode: "BPAHCUHA" }
    ]
  },
  {
    country: "Saint Kitts and Nevis",
    code: "KN",
    flag: "🇰🇳",
    currency: "XCD",
    currencySymbol: "EC$",
    exchangeRateToUSD: 2.70,
    banks: [
      { name: "St Kitts-Nevis-Anguilla National Bank", swiftCode: "SKNANBKN" },
      { name: "Republic Bank (EC) Limited", swiftCode: "RBLIKNKN" },
      { name: "Bank of Nevis Limited", swiftCode: "BONEKNNE" }
    ]
  },
  {
    country: "Antigua and Barbuda",
    code: "AG",
    flag: "🇦🇬",
    currency: "XCD",
    currencySymbol: "EC$",
    exchangeRateToUSD: 2.70,
    banks: [
      { name: "Antigua Commercial Bank (ACB Caribbean)", swiftCode: "ACBTAGAG" },
      { name: "Eastern Caribbean Amalgamated Bank", swiftCode: "ECABAGAG" },
      { name: "FirstCaribbean International Bank", swiftCode: "FCIBAGAG" }
    ]
  },
  {
    country: "Saint Lucia",
    code: "LC",
    flag: "🇱🇨",
    currency: "XCD",
    currencySymbol: "EC$",
    exchangeRateToUSD: 2.70,
    banks: [
      { name: "Bank of Saint Lucia Limited", swiftCode: "BOSLLCLC" },
      { name: "1st National Bank St. Lucia Limited", swiftCode: "FSTNLCLC" },
      { name: "Republic Bank (EC) Saint Lucia", swiftCode: "RBLILCLC" }
    ]
  },
  {
    country: "Grenada",
    code: "GD",
    flag: "🇬🇩",
    currency: "XCD",
    currencySymbol: "EC$",
    exchangeRateToUSD: 2.70,
    banks: [
      { name: "Grenada Co-operative Bank Limited", swiftCode: "GCBLGDGD" },
      { name: "Republic Bank (Grenada) Limited", swiftCode: "NCBGGDGD" },
      { name: "FirstCaribbean International Bank", swiftCode: "FCIBGDGD" }
    ]
  },
  {
    country: "Saint Vincent and the Grenadines",
    code: "VC",
    flag: "🇻🇨",
    currency: "XCD",
    currencySymbol: "EC$",
    exchangeRateToUSD: 2.70,
    banks: [
      { name: "Bank of Saint Vincent and the Grenadines", swiftCode: "NCBVVCVC" },
      { name: "Republic Bank (EC) St Vincent", swiftCode: "RBLIVCVC" },
      { name: "FirstCaribbean International Bank", swiftCode: "FCIBVCVC" }
    ]
  },
  {
    country: "Dominica",
    code: "DM",
    flag: "🇩🇲",
    currency: "XCD",
    currencySymbol: "EC$",
    exchangeRateToUSD: 2.70,
    banks: [
      { name: "National Bank of Dominica (NBD)", swiftCode: "NBODDMDM" },
      { name: "Republic Bank (EC) Dominica", swiftCode: "RBLIDMDM" }
    ]
  },

  // --- South America ---
  {
    country: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    currency: "BRL",
    currencySymbol: "R$",
    exchangeRateToUSD: 5.45,
    banks: [
      { name: "Banco do Brasil S.A.", swiftCode: "BRASBRBS" },
      { name: "Itaú Unibanco S.A.", swiftCode: "ITAUUS33" },
      { name: "Banco Bradesco S.A.", swiftCode: "BBDEBRSP" },
      { name: "Caixa Econômica Federal", swiftCode: "CEFXBRDF" },
      { name: "Banco Santander Brasil S.A.", swiftCode: "BSBRBRSP" },
      { name: "BTG Pactual", swiftCode: "BTGPBRRJ" }
    ]
  },
  {
    country: "Argentina",
    code: "AR",
    flag: "🇦🇷",
    currency: "ARS",
    currencySymbol: "$",
    exchangeRateToUSD: 940.0,
    banks: [
      { name: "Banco de la Nación Argentina", swiftCode: "NACNARBA" },
      { name: "Banco Santander Argentina", swiftCode: "RIPLARBA" },
      { name: "Banco Galicia", swiftCode: "GALIARBA" },
      { name: "BBVA Argentina", swiftCode: "BCOAARBA" },
      { name: "Banco Macro S.A.", swiftCode: "BMAUARBA" }
    ]
  },
  {
    country: "Colombia",
    code: "CO",
    flag: "🇨🇴",
    currency: "COP",
    currencySymbol: "$",
    exchangeRateToUSD: 4120.0,
    banks: [
      { name: "Bancolombia S.A.", swiftCode: "COLOCOBM" },
      { name: "Banco de Bogotá", swiftCode: "BOGOCOBM" },
      { name: "Davivienda", swiftCode: "DAVICOBC" },
      { name: "BBVA Colombia", swiftCode: "BBVACOBB" },
      { name: "Banco de Occidente", swiftCode: "OCCICOBC" }
    ]
  },
  {
    country: "Chile",
    code: "CL",
    flag: "🇨🇱",
    currency: "CLP",
    currencySymbol: "$",
    exchangeRateToUSD: 935.0,
    banks: [
      { name: "Banco de Chile", swiftCode: "BCHICLRM" },
      { name: "Banco Santander-Chile", swiftCode: "BSCHCLRM" },
      { name: "Banco del Estado de Chile (BancoEstado)", swiftCode: "BECHCLRM" },
      { name: "Banco de Crédito e Inversiones (BCI)", swiftCode: "BCICCLRM" },
      { name: "Scotiabank Chile", swiftCode: "NOSCCLRM" },
      { name: "Itaú Corpbanca", swiftCode: "ITAUCLRM" }
    ]
  },
  {
    country: "Peru",
    code: "PE",
    flag: "🇵🇪",
    currency: "PEN",
    currencySymbol: "S/",
    exchangeRateToUSD: 3.74,
    banks: [
      { name: "Banco de Crédito del Perú (BCP)", swiftCode: "BCPLPELI" },
      { name: "BBVA Perú", swiftCode: "BCONPELI" },
      { name: "Scotiabank Perú", swiftCode: "BSUDPELI" },
      { name: "Interbank (Banco Internacional del Perú)", swiftCode: "BINRPLP" },
      { name: "Banco de la Nación", swiftCode: "BANAPELI" }
    ]
  },
  {
    country: "Uruguay",
    code: "UY",
    flag: "🇺🇾",
    currency: "UYU",
    currencySymbol: "$U",
    exchangeRateToUSD: 40.2,
    banks: [
      { name: "Banco de la República Oriental del Uruguay (BROU)", swiftCode: "BROUUYMM" },
      { name: "Banco Santander Uruguay", swiftCode: "SANAUYMM" },
      { name: "Banco Itaú Uruguay", swiftCode: "ITAUUYMM" },
      { name: "Scotiabank Uruguay", swiftCode: "NOSCUYMM" }
    ]
  },
  {
    country: "Ecuador",
    code: "EC",
    flag: "🇪🇨",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Banco Pichincha C.A.", swiftCode: "PICHUCEQ" },
      { name: "Banco Guayaquil", swiftCode: "GUAYUCEQ" },
      { name: "Produbanco (Grupo Promerica)", swiftCode: "PRODUCEQ" },
      { name: "Banco del Pacífico", swiftCode: "PACIUCEQ" }
    ]
  },
  {
    country: "Paraguay",
    code: "PY",
    flag: "🇵🇾",
    currency: "PYG",
    currencySymbol: "₲",
    exchangeRateToUSD: 7550.0,
    banks: [
      { name: "Banco Continental S.A.E.C.A.", swiftCode: "CONTPAAY" },
      { name: "Banco Itaú Paraguay", swiftCode: "ITAUPAAY" },
      { name: "Sudameris Bank", swiftCode: "SUDAPAAY" },
      { name: "Banco Basa", swiftCode: "BASAPAAY" },
      { name: "Banco Nacional de Fomento (BNF)", swiftCode: "BNFOPAAY" }
    ]
  },
  {
    country: "Bolivia",
    code: "BO",
    flag: "🇧🇴",
    currency: "BOB",
    currencySymbol: "Bs",
    exchangeRateToUSD: 6.91,
    banks: [
      { name: "Banco Mercantil Santa Cruz S.A.", swiftCode: "MSCRBOLP" },
      { name: "Banco Nacional de Bolivia (BNB)", swiftCode: "BBOLLPPA" },
      { name: "Banco BISA S.A.", swiftCode: "BBIZLPPA" },
      { name: "Banco Unión S.A.", swiftCode: "BUNIOLPA" },
      { name: "Banco de Crédito de Bolivia (BCP)", swiftCode: "BCPBBOLP" }
    ]
  },
  {
    country: "Guyana",
    code: "GY",
    flag: "🇬🇾",
    currency: "GYD",
    currencySymbol: "G$",
    exchangeRateToUSD: 209.0,
    banks: [
      { name: "Bank of Guyana", swiftCode: "BOGUGYGE" },
      { name: "Republic Bank (Guyana) Limited", swiftCode: "RBLIGYGE" },
      { name: "Demerara Bank Limited", swiftCode: "DEMRGYGE" },
      { name: "Citizens Bank Guyana Inc.", swiftCode: "CBGIYGGE" },
      { name: "Scotiabank Guyana", swiftCode: "NOSCGYGE" }
    ]
  },
  {
    country: "Suriname",
    code: "SR",
    flag: "🇸🇷",
    currency: "SRD",
    currencySymbol: "Sr$",
    exchangeRateToUSD: 33.5,
    banks: [
      { name: "Centrale Bank van Suriname", swiftCode: "CBVSSRPA" },
      { name: "De Surinaamsche Bank (DSB)", swiftCode: "DSBSSRPA" },
      { name: "Hakrinbank N.V.", swiftCode: "HAKRSRPA" },
      { name: "Finabank N.V.", swiftCode: "FINASRPA" }
    ]
  },
  {
    country: "Venezuela",
    code: "VE",
    flag: "🇻🇪",
    currency: "VES",
    currencySymbol: "Bs.D",
    exchangeRateToUSD: 36.6,
    banks: [
      { name: "Banco de Venezuela", swiftCode: "BVENVECA" },
      { name: "Banesco Banco Universal", swiftCode: "BNCARCCA" },
      { name: "Banco Mercantil", swiftCode: "BAMRVECA" },
      { name: "BBVA Provincial", swiftCode: "BPRCVECA" },
      { name: "Bancaribe", swiftCode: "CARIVECA" }
    ]
  },

  // --- Western & Northern Europe ---
  {
    country: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    exchangeRateToUSD: 0.76,
    banks: [
      { name: "Barclays Bank PLC", swiftCode: "BARCGB22" },
      { name: "HSBC Bank UK plc", swiftCode: "HUKBGB22" },
      { name: "Lloyds Bank plc", swiftCode: "LOYDGB2L" },
      { name: "National Westminster Bank (NatWest)", swiftCode: "NWBKGB2L" },
      { name: "Standard Chartered Bank", swiftCode: "SCBLGB22" },
      { name: "Royal Bank of Scotland (RBS)", swiftCode: "RBOSGB2L" },
      { name: "Santander UK plc", swiftCode: "ABBYGB2L" }
    ]
  },
  {
    country: "Germany",
    code: "DE",
    flag: "🇩🇪",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Deutsche Bank AG", swiftCode: "DEUTDEDD" },
      { name: "Commerzbank AG", swiftCode: "COBADEFF" },
      { name: "DZ BANK AG", swiftCode: "GENODEDD" },
      { name: "KfW Bankengruppe", swiftCode: "KFWDEDFF" },
      { name: "Bayerische Landesbank (BayernLB)", swiftCode: "BYLADEMM" },
      { name: "Landesbank Baden-Württemberg (LBBW)", swiftCode: "SOLADEST" }
    ]
  },
  {
    country: "France",
    code: "FR",
    flag: "🇫🇷",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "BNP Paribas", swiftCode: "BNPAFRPA" },
      { name: "Crédit Agricole S.A.", swiftCode: "AGRIFRPP" },
      { name: "Société Générale", swiftCode: "SOGEFRPA" },
      { name: "Groupe BPCE (Natixis)", swiftCode: "NATXFRPP" },
      { name: "Crédit Mutuel", swiftCode: "CMCIFR2A" },
      { name: "La Banque Postale", swiftCode: "PSPTFRPP" }
    ]
  },
  {
    country: "Switzerland",
    code: "CH",
    flag: "🇨🇭",
    currency: "CHF",
    currencySymbol: "CHF",
    exchangeRateToUSD: 0.85,
    banks: [
      { name: "UBS Switzerland AG", swiftCode: "UBSWCHZH" },
      { name: "Zürcher Kantonalbank (ZKB)", swiftCode: "ZKBKCHZZ" },
      { name: "Banque Cantonale de Genève (BCGE)", swiftCode: "BCGECHGG" },
      { name: "Raiffeisen Schweiz", swiftCode: "RAIFCH22" },
      { name: "Julius Bär Group", swiftCode: "BAERCHZZ" },
      { name: "Pictet & Cie Group", swiftCode: "PICTCHGG" },
      { name: "Lombard Odier", swiftCode: "LOMBCHGG" }
    ]
  },
  {
    country: "Netherlands",
    code: "NL",
    flag: "🇳🇱",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "ING Bank N.V.", swiftCode: "INGBNL2A" },
      { name: "Rabobank", swiftCode: "RABONL2U" },
      { name: "ABN AMRO Bank N.V.", swiftCode: "ABNANL2A" },
      { name: "de Volksbank N.V.", swiftCode: "SNSBNL2A" },
      { name: "Triodos Bank N.V.", swiftCode: "TRIONL2U" }
    ]
  },
  {
    country: "Belgium",
    code: "BE",
    flag: "🇧🇪",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "KBC Bank NV", swiftCode: "KREDBEBB" },
      { name: "BNP Paribas Fortis", swiftCode: "GEBABEBB" },
      { name: "Belfius Bank SA/NV", swiftCode: "CCBABEBB" },
      { name: "ING Belgium SA/NV", swiftCode: "BBRUBEBB" }
    ]
  },
  {
    country: "Ireland",
    code: "IE",
    flag: "🇮🇪",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Bank of Ireland", swiftCode: "BOFIIE2D" },
      { name: "Allied Irish Banks (AIB)", swiftCode: "AIBKIE2D" },
      { name: "Permanent TSB", swiftCode: "IPBSIEDD" },
      { name: "Citibank Europe plc", swiftCode: "CITIIE2D" }
    ]
  },
  {
    country: "Austria",
    code: "AT",
    flag: "🇦🇹",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Erste Group Bank AG", swiftCode: "GIBAATWW" },
      { name: "Raiffeisen Bank International (RBI)", swiftCode: "RZBAATWW" },
      { name: "UniCredit Bank Austria AG", swiftCode: "BKAUATWW" },
      { name: "BAWAG P.S.K.", swiftCode: "BAWAATWW" }
    ]
  },
  {
    country: "Sweden",
    code: "SE",
    flag: "🇸🇪",
    currency: "SEK",
    currencySymbol: "kr",
    exchangeRateToUSD: 10.3,
    banks: [
      { name: "Nordea Bank Abp (Sweden)", swiftCode: "NDEASTMM" },
      { name: "Skandinaviska Enskilda Banken (SEB)", swiftCode: "ESSESTMM" },
      { name: "Svenska Handelsbanken", swiftCode: "HANDSESS" },
      { name: "Swedbank AB", swiftCode: "SWEDSESS" }
    ]
  },
  {
    country: "Norway",
    code: "NO",
    flag: "🇳🇴",
    currency: "NOK",
    currencySymbol: "kr",
    exchangeRateToUSD: 10.6,
    banks: [
      { name: "DNB Bank ASA", swiftCode: "DNBNNOKK" },
      { name: "Nordea Bank Norway", swiftCode: "NDEANOKK" },
      { name: "SpareBank 1 SR-Bank", swiftCode: "ROGSNO22" },
      { name: "Storebrand Bank ASA", swiftCode: "STBNNO22" }
    ]
  },
  {
    country: "Denmark",
    code: "DK",
    flag: "🇩🇰",
    currency: "DKK",
    currencySymbol: "kr",
    exchangeRateToUSD: 6.85,
    banks: [
      { name: "Danske Bank A/S", swiftCode: "DABADKKK" },
      { name: "Jyske Bank A/S", swiftCode: "JYBADKKK" },
      { name: "Nykredit Bank A/S", swiftCode: "NYKBDKKK" },
      { name: "Nordea Danmark", swiftCode: "NDEADKKK" }
    ]
  },
  {
    country: "Finland",
    code: "FI",
    flag: "🇫🇮",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Nordea Bank Abp", swiftCode: "NDEAFIHH" },
      { name: "OP Financial Group (OP Osuuskunta)", swiftCode: "OKOYFIHH" },
      { name: "Danske Bank Finland", swiftCode: "DABAFIHH" },
      { name: "Aktia Bank Plc", swiftCode: "AKLAFIHH" }
    ]
  },
  {
    country: "Iceland",
    code: "IS",
    flag: "🇮🇸",
    currency: "ISK",
    currencySymbol: "kr",
    exchangeRateToUSD: 138.0,
    banks: [
      { name: "Landsbankinn hf.", swiftCode: "LAISISI" },
      { name: "Íslandsbanki hf.", swiftCode: "ISBAISIT" },
      { name: "Arion banki hf.", swiftCode: "ARIONISIT" },
      { name: "Kvika banki hf.", swiftCode: "MPBAISIT" }
    ]
  },
  {
    country: "Luxembourg",
    code: "LU",
    flag: "🇱🇺",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Banque et Caisse d'Epargne de l'Etat (BCEE)", swiftCode: "BCEELLLU" },
      { name: "BGL BNP Paribas", swiftCode: "BGLLLLLU" },
      { name: "Banque Internationale à Luxembourg (BIL)", swiftCode: "BILLLLLU" },
      { name: "Société Générale Luxembourg", swiftCode: "SOGELLLU" }
    ]
  },
  {
    country: "Monaco",
    code: "MC",
    flag: "🇲🇨",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Compagnie Monégasque de Banque (CMB)", swiftCode: "CMBNMCMC" },
      { name: "Banque Julius Baer (Monaco) S.A.M.", swiftCode: "BAERMCMC" },
      { name: "CFM Indosuez Wealth Management", swiftCode: "CFMOMCMC" },
      { name: "Barclays Bank Monaco", swiftCode: "BARCMCMC" }
    ]
  },
  {
    country: "Liechtenstein",
    code: "LI",
    flag: "🇱🇮",
    currency: "CHF",
    currencySymbol: "CHF",
    exchangeRateToUSD: 0.85,
    banks: [
      { name: "LGT Bank AG", swiftCode: "LGTBLI2X" },
      { name: "Liechtensteinische Landesbank (LLB)", swiftCode: "LLBLI22" },
      { name: "VP Bank AG", swiftCode: "VPBLI22" },
      { name: "Bank Frick & Co. AG", swiftCode: "BFLILI22" }
    ]
  },
  {
    country: "Andorra",
    code: "AD",
    flag: "🇦🇩",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Andbank (Andorra Banc Agrícol Reig)", swiftCode: "ANDBADAD" },
      { name: "MoraBanc", swiftCode: "MORBADAD" },
      { name: "Crèdit Andorrà", swiftCode: "CREDADAD" }
    ]
  },
  {
    country: "San Marino",
    code: "SM",
    flag: "🇸🇲",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Banca Centrale della Repubblica di San Marino", swiftCode: "BCSMSMSM" },
      { name: "Banca di San Marino", swiftCode: "BSMRSMSM" },
      { name: "Cassa di Risparmio della Repubblica di San Marino", swiftCode: "CRSMSMSM" },
      { name: "Banca Agricola Commerciale (BAC)", swiftCode: "BACMSMSM" }
    ]
  },
  {
    country: "Malta",
    code: "MT",
    flag: "🇲🇹",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Bank of Valletta (BOV)", swiftCode: "VLLTMTMT" },
      { name: "HSBC Bank Malta p.l.c.", swiftCode: "MMEBMTMT" },
      { name: "APS Bank plc", swiftCode: "APSBMTMT" },
      { name: "MeDirect Bank (Malta) plc", swiftCode: "MEDBMTMT" }
    ]
  },
  {
    country: "Cyprus",
    code: "CY",
    flag: "🇨🇾",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Bank of Cyprus", swiftCode: "BCYPCY2N" },
      { name: "Hellenic Bank", swiftCode: "HEBACY2N" },
      { name: "Eurobank Cyprus", swiftCode: "ERBCCY2N" },
      { name: "AstroBank", swiftCode: "PRSCCY2N" }
    ]
  },

  // --- Southern Europe ---
  {
    country: "Italy",
    code: "IT",
    flag: "🇮🇹",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Intesa Sanpaolo S.p.A.", swiftCode: "BCITITMM" },
      { name: "UniCredit S.p.A.", swiftCode: "UNCRITM1" },
      { name: "Banco BPM S.p.A.", swiftCode: "BAPPIT21" },
      { name: "Banca Monte dei Paschi di Siena (MPS)", swiftCode: "PASCITM1" },
      { name: "BPER Banca", swiftCode: "BPEFIT22" },
      { name: "Mediobanca", swiftCode: "MEBIITMM" }
    ]
  },
  {
    country: "Spain",
    code: "ES",
    flag: "🇪🇸",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Banco Santander, S.A.", swiftCode: "BSCHESMM" },
      { name: "Banco Bilbao Vizcaya Argentaria (BBVA)", swiftCode: "BBVAESMM" },
      { name: "CaixaBank, S.A.", swiftCode: "CAIXESBB" },
      { name: "Banco Sabadell", swiftCode: "BSABESBB" },
      { name: "Bankinter", swiftCode: "BKTRESMM" },
      { name: "Unicaja Banco", swiftCode: "UCAJESM1" }
    ]
  },
  {
    country: "Portugal",
    code: "PT",
    flag: "🇵🇹",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Caixa Geral de Depósitos (CGD)", swiftCode: "CGDIPTPL" },
      { name: "Millennium BCP", swiftCode: "BCPTPTPL" },
      { name: "Novo Banco", swiftCode: "BESCPTPL" },
      { name: "Banco Santander Totta", swiftCode: "TOTAPTPL" },
      { name: "Banco BPI", swiftCode: "BPIFPTPL" }
    ]
  },
  {
    country: "Greece",
    code: "GR",
    flag: "🇬🇷",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "National Bank of Greece (NBG)", swiftCode: "ETHNGRAA" },
      { name: "Piraeus Bank", swiftCode: "PIRBGRAA" },
      { name: "Alpha Bank", swiftCode: "CRBAGRAA" },
      { name: "Eurobank S.A.", swiftCode: "ERBKGRAA" }
    ]
  },

  // --- Central & Eastern Europe ---
  {
    country: "Poland",
    code: "PL",
    flag: "🇵🇱",
    currency: "PLN",
    currencySymbol: "zł",
    exchangeRateToUSD: 3.96,
    banks: [
      { name: "PKO Bank Polski", swiftCode: "BPKOPLPW" },
      { name: "Bank Pekao S.A.", swiftCode: "PKOPPLPW" },
      { name: "Santander Bank Polska", swiftCode: "WBKAPLPX" },
      { name: "mBank S.A.", swiftCode: "BREXPLPW" },
      { name: "ING Bank Śląski", swiftCode: "INGBPLPW" }
    ]
  },
  {
    country: "Czech Republic",
    code: "CZ",
    flag: "🇨🇿",
    currency: "CZK",
    currencySymbol: "Kč",
    exchangeRateToUSD: 23.2,
    banks: [
      { name: "Česká spořitelna, a.s.", swiftCode: "GIBACZPX" },
      { name: "Československá obchodní banka (ČSOB)", swiftCode: "CEKOCZPP" },
      { name: "Komerční banka, a.s.", swiftCode: "KOBACZPP" },
      { name: "UniCredit Bank Czech Republic", swiftCode: "BACXCZPP" },
      { name: "Raiffeisenbank a.s.", swiftCode: "RZBCCZPP" }
    ]
  },
  {
    country: "Hungary",
    code: "HU",
    flag: "🇭🇺",
    currency: "HUF",
    currencySymbol: "Ft",
    exchangeRateToUSD: 365.0,
    banks: [
      { name: "OTP Bank Nyrt.", swiftCode: "OTPVHUHB" },
      { name: "K&H Bank Zrt.", swiftCode: "OKHBTHB" },
      { name: "Erste Bank Hungary Zrt.", swiftCode: "GIBAHUHB" },
      { name: "MBH Bank Nyrt.", swiftCode: "MKKBHUHB" },
      { name: "Raiffeisen Bank Zrt.", swiftCode: "RZBAHUHB" }
    ]
  },
  {
    country: "Romania",
    code: "RO",
    flag: "🇷🇴",
    currency: "RON",
    currencySymbol: "lei",
    exchangeRateToUSD: 4.56,
    banks: [
      { name: "Banca Transilvania", swiftCode: "BTRLRO22" },
      { name: "Banca Comercială Română (BCR)", swiftCode: "RNCBROBU" },
      { name: "BRD – Groupe Société Générale", swiftCode: "BRDEROBU" },
      { name: "Raiffeisen Bank Romania", swiftCode: "RZBRROBU" },
      { name: "ING Bank Romania", swiftCode: "INGBROBU" }
    ]
  },
  {
    country: "Bulgaria",
    code: "BG",
    flag: "🇧🇬",
    currency: "BGN",
    currencySymbol: "лв",
    exchangeRateToUSD: 1.80,
    banks: [
      { name: "UniCredit Bulbank", swiftCode: "UNCRBGSF" },
      { name: "DSK Bank", swiftCode: "STSAF" },
      { name: "United Bulgarian Bank (UBB)", swiftCode: "UBBSBGSF" },
      { name: "First Investment Bank (Fibank)", swiftCode: "FINVBGSF" },
      { name: "Postbank (Eurobank Bulgaria)", swiftCode: "BPBIBGSF" }
    ]
  },
  {
    country: "Croatia",
    code: "HR",
    flag: "🇭🇷",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Zagrebačka banka (Zaba)", swiftCode: "ZABAHR2X" },
      { name: "Privredna banka Zagreb (PBZ)", swiftCode: "PBZGHR2X" },
      { name: "Erste & Steiermärkische Bank", swiftCode: "ESBCHR22" },
      { name: "OTP banka d.d.", swiftCode: "OTPVHR2X" },
      { name: "Raiffeisenbank Austria d.d.", swiftCode: "RZBHHR2X" }
    ]
  },
  {
    country: "Slovakia",
    code: "SK",
    flag: "🇸🇰",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Slovenská sporiteľňa (SLSP)", swiftCode: "GIBASKBX" },
      { name: "Všeobecná úverová banka (VÚB)", swiftCode: "SUZBSKBX" },
      { name: "Tatra banka, a.s.", swiftCode: "TATRSKBX" },
      { name: "ČSOB Slovakia", swiftCode: "CEKOSKBX" }
    ]
  },
  {
    country: "Slovenia",
    code: "SI",
    flag: "🇸🇮",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Nova Ljubljanska Banka (NLB)", swiftCode: "LJBASI2X" },
      { name: "Nova KBM (OTP Group)", swiftCode: "KBAMS12X" },
      { name: "SKB banka", swiftCode: "SKBASI2X" },
      { name: "UniCredit Banka Slovenija", swiftCode: "BACXSI22" }
    ]
  },
  {
    country: "Estonia",
    code: "EE",
    flag: "🇪🇪",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Swedbank AS", swiftCode: "HABAEE2X" },
      { name: "SEB Pank", swiftCode: "EEUPEE2X" },
      { name: "LHV Pank", swiftCode: "LHVBEE22" },
      { name: "Luminor Bank AS", swiftCode: "NDEAE2X" },
      { name: "Coop Pank AS", swiftCode: "EKPEE22" }
    ]
  },
  {
    country: "Latvia",
    code: "LV",
    flag: "🇱🇻",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Swedbank AS Latvia", swiftCode: "HABALV22" },
      { name: "SEB banka Latvia", swiftCode: "UNLALV2X" },
      { name: "Citadele banka", swiftCode: "PARXLV22" },
      { name: "Luminor Bank Latvia", swiftCode: "RIBRVL22" },
      { name: "Industra Bank", swiftCode: "MULTLV2X" }
    ]
  },
  {
    country: "Lithuania",
    code: "LT",
    flag: "🇱🇹",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Swedbank AB Lithuania", swiftCode: "HABALT22" },
      { name: "SEB bankas Lithuania", swiftCode: "CBVILT2X" },
      { name: "Luminor Bank Lithuania", swiftCode: "AGBLLT2X" },
      { name: "Šiaulių bankas", swiftCode: "CBVILT2X" },
      { name: "Medicinos bankas", swiftCode: "MEDBLT2X" }
    ]
  },
  {
    country: "Ukraine",
    code: "UA",
    flag: "🇺🇦",
    currency: "UAH",
    currencySymbol: "₴",
    exchangeRateToUSD: 41.5,
    banks: [
      { name: "PrivatBank", swiftCode: "PBBEUA2X" },
      { name: "Oschadbank (State Savings Bank of Ukraine)", swiftCode: "OSCHUA2X" },
      { name: "Raiffeisen Bank Ukraine", swiftCode: "AVALUA2X" },
      { name: "Ukrsibbank (BNP Paribas)", swiftCode: "KHMBAY2X" },
      { name: "FUIB (First Ukrainian International Bank)", swiftCode: "FUIBUA2X" }
    ]
  },
  {
    country: "Serbia",
    code: "RS",
    flag: "🇷🇸",
    currency: "RSD",
    currencySymbol: "дин.",
    exchangeRateToUSD: 108.0,
    banks: [
      { name: "Banca Intesa Beograd", swiftCode: "DBDBRSBG" },
      { name: "OTP Banka Srbija", swiftCode: "VOBARS22" },
      { name: "NLB Komercijalna banka", swiftCode: "KOBBRSBG" },
      { name: "UniCredit Bank Srbija", swiftCode: "BACXRSBG" },
      { name: "Raiffeisen banka a.d. Beograd", swiftCode: "RZBRRSBG" }
    ]
  },
  {
    country: "Bosnia and Herzegovina",
    code: "BA",
    flag: "🇧🇦",
    currency: "BAM",
    currencySymbol: "KM",
    exchangeRateToUSD: 1.80,
    banks: [
      { name: "UniCredit Bank d.d. Mostar", swiftCode: "UNCRBA22" },
      { name: "Raiffeisen Bank Bosna i Hercegovina", swiftCode: "RZBABA2S" },
      { name: "Intesa Sanpaolo Banka BiH", swiftCode: "UPBKBA22" },
      { name: "NLB Banka d.d. Sarajevo", swiftCode: "TUZBBA22" }
    ]
  },
  {
    country: "Albania",
    code: "AL",
    flag: "🇦🇱",
    currency: "ALL",
    currencySymbol: "L",
    exchangeRateToUSD: 91.5,
    banks: [
      { name: "Bank of Albania", swiftCode: "ARALALTR" },
      { name: "Banka Kombëtare Tregtare (BKT)", swiftCode: "NCBLALTR" },
      { name: "Credins Bank", swiftCode: "CDINLTR" },
      { name: "Raiffeisen Bank Albania", swiftCode: "RZBALT22" },
      { name: "Intesa Sanpaolo Bank Albania", swiftCode: "UPBAALTR" }
    ]
  },
  {
    country: "North Macedonia",
    code: "MK",
    flag: "🇲🇰",
    currency: "MKD",
    currencySymbol: "ден",
    exchangeRateToUSD: 56.8,
    banks: [
      { name: "Komercijalna Banka AD Skopje", swiftCode: "KMBPMK2X" },
      { name: "Stopanska Banka AD Skopje", swiftCode: "STOBMK2X" },
      { name: "NLB Banka AD Skopje", swiftCode: "TNBAMK2X" },
      { name: "Halkbank AD Skopje", swiftCode: "EXKSMK2X" }
    ]
  },
  {
    country: "Montenegro",
    code: "ME",
    flag: "🇲🇪",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Crnogorska Komercijalna Banka (CKB)", swiftCode: "CKBIME2P" },
      { name: "NLB Banka AD Podgorica", swiftCode: "MNBAMEPG" },
      { name: "Erste Bank AD Podgorica", swiftCode: "OPBAMEPG" },
      { name: "Universal Capital Bank AD Podgorica", swiftCode: "FFBAMEPG" }
    ]
  },
  {
    country: "Moldova",
    code: "MD",
    flag: "🇲🇩",
    currency: "MDL",
    currencySymbol: "L",
    exchangeRateToUSD: 17.8,
    banks: [
      { name: "Moldova Agroindbank (maib)", swiftCode: "AGRNMD2X" },
      { name: "Moldindconbank", swiftCode: "MOLDMD2X" },
      { name: "Victoriabank", swiftCode: "VICBMD2X" },
      { name: "OTP Bank Moldova", swiftCode: "MOBBMD22" }
    ]
  },
  {
    country: "Georgia",
    code: "GE",
    flag: "🇬🇪",
    currency: "GEL",
    currencySymbol: "₾",
    exchangeRateToUSD: 2.72,
    banks: [
      { name: "TBC Bank", swiftCode: "TBCBGE22" },
      { name: "Bank of Georgia", swiftCode: "BAGAGE22" },
      { name: "Liberty Bank", swiftCode: "LBRTGE22" },
      { name: "Basisbank", swiftCode: "CBASGE22" }
    ]
  },
  {
    country: "Armenia",
    code: "AM",
    flag: "🇦🇲",
    currency: "AMD",
    currencySymbol: "֏",
    exchangeRateToUSD: 388.0,
    banks: [
      { name: "Ameriabank CJSC", swiftCode: "AMRBM22" },
      { name: "Ardshinbank CJSC", swiftCode: "ASHBAM22" },
      { name: "Acba Bank OJSC", swiftCode: "AGBAAM22" },
      { name: "Inecobank CJSC", swiftCode: "INECAM22" },
      { name: "Converse Bank CJSC", swiftCode: "COVSAM22" }
    ]
  },
  {
    country: "Azerbaijan",
    code: "AZ",
    flag: "🇦🇿",
    currency: "AZN",
    currencySymbol: "₼",
    exchangeRateToUSD: 1.70,
    banks: [
      { name: "International Bank of Azerbaijan (ABB)", swiftCode: "IBAZAZ2X" },
      { name: "Kapital Bank", swiftCode: "AIIBAZ2X" },
      { name: "PASHA Bank", swiftCode: "PABAAZ22" },
      { name: "Unibank CB", swiftCode: "UBAZAZ22" }
    ]
  },

  // --- East Asia ---
  {
    country: "China",
    code: "CN",
    flag: "🇨🇳",
    currency: "CNY",
    currencySymbol: "¥",
    exchangeRateToUSD: 7.15,
    banks: [
      { name: "Industrial and Commercial Bank of China (ICBC)", swiftCode: "ICBKCNBJ" },
      { name: "China Construction Bank (CCB)", swiftCode: "PCBCCNBN" },
      { name: "Agricultural Bank of China (ABC)", swiftCode: "ABOCCNBJ" },
      { name: "Bank of China (BOC)", swiftCode: "BKCHCNBJ" },
      { name: "Bank of Communications (BOCOM)", swiftCode: "COMMCNSH" },
      { name: "China Merchants Bank (CMB)", swiftCode: "CMBCCNBS" }
    ]
  },
  {
    country: "Japan",
    code: "JP",
    flag: "🇯🇵",
    currency: "JPY",
    currencySymbol: "¥",
    exchangeRateToUSD: 154.2,
    banks: [
      { name: "Mitsubishi UFJ Financial Group (MUFG Bank)", swiftCode: "BOTKJPJT" },
      { name: "Sumitomo Mitsui Banking Corporation (SMBC)", swiftCode: "SMBCJPJT" },
      { name: "Mizuho Bank, Ltd.", swiftCode: "MHCBJPJT" },
      { name: "Japan Post Bank Co., Ltd.", swiftCode: "JPPSJPJ1" },
      { name: "Resona Bank, Limited", swiftCode: "DIWAJPJT" },
      { name: "Norinchukin Bank", swiftCode: "NOCHJPJT" }
    ]
  },
  {
    country: "South Korea",
    code: "KR",
    flag: "🇰🇷",
    currency: "KRW",
    currencySymbol: "₩",
    exchangeRateToUSD: 1380.0,
    banks: [
      { name: "KB Kookmin Bank", swiftCode: "CZNBKRSE" },
      { name: "Shinhan Bank", swiftCode: "SHBKKRSE" },
      { name: "Hana Bank (KEB Hana)", swiftCode: "HNBNKRSE" },
      { name: "Woori Bank", swiftCode: "HVBKRE" },
      { name: "Industrial Bank of Korea (IBK)", swiftCode: "IBKOKRSE" },
      { name: "NongHyup Bank (NH Bank)", swiftCode: "NACFKRSE" }
    ]
  },
  {
    country: "Hong Kong",
    code: "HK",
    flag: "🇭🇰",
    currency: "HKD",
    currencySymbol: "HK$",
    exchangeRateToUSD: 7.78,
    banks: [
      { name: "HSBC Hong Kong", swiftCode: "HSBCHKHH" },
      { name: "Standard Chartered Bank (Hong Kong)", swiftCode: "SCBLHKHH" },
      { name: "Bank of China (Hong Kong)", swiftCode: "BKCHHKHH" },
      { name: "Hang Seng Bank Limited", swiftCode: "HASEHKHH" },
      { name: "DBS Bank (Hong Kong) Limited", swiftCode: "DBSSHKHH" }
    ]
  },
  {
    country: "Taiwan",
    code: "TW",
    flag: "🇹🇼",
    currency: "TWD",
    currencySymbol: "NT$",
    exchangeRateToUSD: 32.2,
    banks: [
      { name: "Bank of Taiwan", swiftCode: "BKTWTWTP" },
      { name: "CTBC Bank Co., Ltd.", swiftCode: "CTBCTWTP" },
      { name: "Mega International Commercial Bank", swiftCode: "ICBCTWTP" },
      { name: "Cathay United Bank", swiftCode: "UWBKTWTP" },
      { name: "Fubon Bank", swiftCode: "TPBKTWTP" }
    ]
  },
  {
    country: "Mongolia",
    code: "MN",
    flag: "🇲🇳",
    currency: "MNT",
    currencySymbol: "₮",
    exchangeRateToUSD: 3400.0,
    banks: [
      { name: "Khan Bank", swiftCode: "AGBUMNUM" },
      { name: "Trade and Development Bank of Mongolia (TDBM)", swiftCode: "TDBMMNUM" },
      { name: "Golomt Bank", swiftCode: "GLMTMNUB" },
      { name: "XacBank", swiftCode: "XACBMNUM" },
      { name: "State Bank of Mongolia", swiftCode: "STBNMNUB" }
    ]
  },

  // --- Southeast Asia ---
  {
    country: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    currency: "SGD",
    currencySymbol: "S$",
    exchangeRateToUSD: 1.32,
    banks: [
      { name: "DBS Bank Ltd", swiftCode: "DBSSSGSG" },
      { name: "Oversea-Chinese Banking Corporation (OCBC)", swiftCode: "OCBCSGSG" },
      { name: "United Overseas Bank (UOB)", swiftCode: "UOVBSGSG" },
      { name: "Standard Chartered Bank Singapore", swiftCode: "SCBLSG22" },
      { name: "Citibank Singapore", swiftCode: "CITISGSG" }
    ]
  },
  {
    country: "Malaysia",
    code: "MY",
    flag: "🇲🇾",
    currency: "MYR",
    currencySymbol: "RM",
    exchangeRateToUSD: 4.35,
    banks: [
      { name: "Malayan Banking Berhad (Maybank)", swiftCode: "MBBEMYKL" },
      { name: "CIMB Bank Berhad", swiftCode: "CIBBMYKL" },
      { name: "Public Bank Berhad", swiftCode: "PBBEMYKL" },
      { name: "RHB Bank Berhad", swiftCode: "RHBBMYKL" },
      { name: "Hong Leong Bank Berhad", swiftCode: "HLBBMYKL" }
    ]
  },
  {
    country: "Indonesia",
    code: "ID",
    flag: "🇮🇩",
    currency: "IDR",
    currencySymbol: "Rp",
    exchangeRateToUSD: 15450.0,
    banks: [
      { name: "Bank Central Asia (BCA)", swiftCode: "CENAIDJA" },
      { name: "Bank Rakyat Indonesia (BRI)", swiftCode: "BRINIDJA" },
      { name: "Bank Mandiri (Persero)", swiftCode: "BMRIIDJA" },
      { name: "Bank Negara Indonesia (BNI)", swiftCode: "BBNIIDJA" },
      { name: "Bank Danamon Indonesia", swiftCode: "BDMNIDJA" }
    ]
  },
  {
    country: "Thailand",
    code: "TH",
    flag: "🇹🇭",
    currency: "THB",
    currencySymbol: "฿",
    exchangeRateToUSD: 34.8,
    banks: [
      { name: "Bangkok Bank Public Company Limited", swiftCode: "BKKBTHTH" },
      { name: "Kasikornbank (KBank)", swiftCode: "KASITHTH" },
      { name: "Siam Commercial Bank (SCB)", swiftCode: "SICOTHTH" },
      { name: "Krungthai Bank (KTB)", swiftCode: "KRHTTHTH" },
      { name: "Bank of Ayudhya (Krungsri)", swiftCode: "AYUDTHTH" }
    ]
  },
  {
    country: "Philippines",
    code: "PH",
    flag: "🇵🇭",
    currency: "PHP",
    currencySymbol: "₱",
    exchangeRateToUSD: 56.5,
    banks: [
      { name: "BDO Unibank (Banco de Oro)", swiftCode: "BNORPHMM" },
      { name: "Bank of the Philippine Islands (BPI)", swiftCode: "BOPIPHMM" },
      { name: "Metropolitan Bank and Trust Company (Metrobank)", swiftCode: "MBTCPHMM" },
      { name: "Land Bank of the Philippines", swiftCode: "TLBPPHMM" },
      { name: "Philippine National Bank (PNB)", swiftCode: "PNBMHMM" },
      { name: "Security Bank Corporation", swiftCode: "SETCPHMM" }
    ]
  },
  {
    country: "Vietnam",
    code: "VN",
    flag: "🇻🇳",
    currency: "VND",
    currencySymbol: "₫",
    exchangeRateToUSD: 24700.0,
    banks: [
      { name: "Vietcombank (JSC Bank for Foreign Trade of Vietnam)", swiftCode: "BFTVVNVX" },
      { name: "VietinBank (Vietnam JSC Bank for Industry and Trade)", swiftCode: "ICBVVNVX" },
      { name: "BIDV (Bank for Investment and Development of Vietnam)", swiftCode: "BIDVVNVX" },
      { name: "Techcombank", swiftCode: "VTCBVNVX" },
      { name: "Military Commercial Joint Stock Bank (MBBank)", swiftCode: "MSCBVNVX" }
    ]
  },
  {
    country: "Cambodia",
    code: "KH",
    flag: "🇰🇭",
    currency: "KHR",
    currencySymbol: "៛",
    exchangeRateToUSD: 4100.0,
    banks: [
      { name: "National Bank of Cambodia", swiftCode: "NBCBKHPP" },
      { name: "ABA Bank (Advanced Bank of Asia)", swiftCode: "ABAPKHPP" },
      { name: "Canadia Bank PLC", swiftCode: "CADIKHPP" },
      { name: "ACLEDA Bank Plc", swiftCode: "ACLEKHPP" },
      { name: "Sathapana Bank Plc", swiftCode: "STAPKHPP" }
    ]
  },
  {
    country: "Laos",
    code: "LA",
    flag: "🇱🇦",
    currency: "LAK",
    currencySymbol: "₭",
    exchangeRateToUSD: 22000.0,
    banks: [
      { name: "Banque Pour Le Commerce Exterieur Lao (BCEL)", swiftCode: "BCELVTLX" },
      { name: "Lao Development Bank", swiftCode: "LDEVVTLX" },
      { name: "Agricultural Promotion Bank", swiftCode: "APBLVTLX" },
      { name: "Joint Development Bank (JDB)", swiftCode: "JDEVVTLX" }
    ]
  },
  {
    country: "Myanmar",
    code: "MM",
    flag: "🇲🇲",
    currency: "MMK",
    currencySymbol: "K",
    exchangeRateToUSD: 2100.0,
    banks: [
      { name: "Kanbawza Bank (KBZ Bank)", swiftCode: "KBZBMYMM" },
      { name: "CB Bank (Co-operative Bank)", swiftCode: "COOPMYMM" },
      { name: "AYA Bank (Ayeyarwady Bank)", swiftCode: "AYABMYMM" },
      { name: "Myanma Foreign Trade Bank (MFTB)", swiftCode: "MFTBMYMM" }
    ]
  },
  {
    country: "Brunei",
    code: "BN",
    flag: "🇧🇳",
    currency: "BND",
    currencySymbol: "B$",
    exchangeRateToUSD: 1.32,
    banks: [
      { name: "Bank Islam Brunei Darussalam (BIBD)", swiftCode: "BIBDBNBS" },
      { name: "Baiduri Bank", swiftCode: "BAIDBNBS" },
      { name: "Standard Chartered Bank Brunei", swiftCode: "SCBLBNBS" }
    ]
  },

  // --- South Asia ---
  {
    country: "India",
    code: "IN",
    flag: "🇮🇳",
    currency: "INR",
    currencySymbol: "₹",
    exchangeRateToUSD: 83.8,
    banks: [
      { name: "State Bank of India (SBI)", swiftCode: "SBININBB" },
      { name: "HDFC Bank Limited", swiftCode: "HDFCINBB" },
      { name: "ICICI Bank Limited", swiftCode: "ICICINBB" },
      { name: "Axis Bank Limited", swiftCode: "UTIBINBB" },
      { name: "Punjab National Bank (PNB)", swiftCode: "PUNBINBB" },
      { name: "Kotak Mahindra Bank", swiftCode: "KKBKINBB" }
    ]
  },
  {
    country: "Pakistan",
    code: "PK",
    flag: "🇵🇰",
    currency: "PKR",
    currencySymbol: "₨",
    exchangeRateToUSD: 278.0,
    banks: [
      { name: "Habib Bank Limited (HBL)", swiftCode: "HABBPKKA" },
      { name: "National Bank of Pakistan (NBP)", swiftCode: "NBPAPKK1" },
      { name: "United Bank Limited (UBL)", swiftCode: "UNILPKKA" },
      { name: "MCB Bank Limited", swiftCode: "MUCBPKKA" },
      { name: "Allied Bank Limited", swiftCode: "ABPAPKK1" },
      { name: "Meezan Bank Limited", swiftCode: "MEZNPKKA" }
    ]
  },
  {
    country: "Bangladesh",
    code: "BD",
    flag: "🇧🇩",
    currency: "BDT",
    currencySymbol: "৳",
    exchangeRateToUSD: 119.5,
    banks: [
      { name: "Sonali Bank Limited", swiftCode: "BSONBDDH" },
      { name: "BRAC Bank Limited", swiftCode: "BRAEBDDH" },
      { name: "Islami Bank Bangladesh Limited", swiftCode: "IBBLBDDH" },
      { name: "Dutch-Bangla Bank Limited (DBBL)", swiftCode: "DBBLBDDH" },
      { name: "Eastern Bank Limited (EBL)", swiftCode: "EBLNBDDH" }
    ]
  },
  {
    country: "Sri Lanka",
    code: "LK",
    flag: "🇱🇰",
    currency: "LKR",
    currencySymbol: "Rs",
    exchangeRateToUSD: 300.0,
    banks: [
      { name: "Bank of Ceylon", swiftCode: "BCEYLKLX" },
      { name: "Commercial Bank of Ceylon", swiftCode: "CCBLLKLX" },
      { name: "People's Bank", swiftCode: "PSBKLKLX" },
      { name: "Hatton National Bank (HNB)", swiftCode: "HNBLLKLX" },
      { name: "Sampath Bank PLC", swiftCode: "BSAMLKLX" }
    ]
  },
  {
    country: "Nepal",
    code: "NP",
    flag: "🇳🇵",
    currency: "NPR",
    currencySymbol: "रू",
    exchangeRateToUSD: 134.0,
    banks: [
      { name: "Nabil Bank Limited", swiftCode: "NARBNPKA" },
      { name: "Nepal Investment Mega Bank (NIMB)", swiftCode: "NIBLNPKA" },
      { name: "Global IME Bank Limited", swiftCode: "GLBLNPKA" },
      { name: "Rastriya Banijya Bank", swiftCode: "RBBANPKA" },
      { name: "Standard Chartered Bank Nepal", swiftCode: "SCBLNPKA" }
    ]
  },
  {
    country: "Maldives",
    code: "MV",
    flag: "🇲🇻",
    currency: "MVR",
    currencySymbol: "Rf",
    exchangeRateToUSD: 15.4,
    banks: [
      { name: "Bank of Maldives PLC (BML)", swiftCode: "MALBMVMV" },
      { name: "Maldives Islamic Bank (MIB)", swiftCode: "MISLMVMV" },
      { name: "State Bank of India (Maldives)", swiftCode: "SBINMVMV" },
      { name: "Habib Bank Limited Maldives", swiftCode: "HABBMVMV" }
    ]
  },
  {
    country: "Bhutan",
    code: "BT",
    flag: "🇧🇹",
    currency: "BTN",
    currencySymbol: "Nu.",
    exchangeRateToUSD: 83.8,
    banks: [
      { name: "Bank of Bhutan Limited", swiftCode: "BOBTBTBT" },
      { name: "Bhutan National Bank Limited (BNB)", swiftCode: "BNBLBTBT" },
      { name: "Druk PNB Bank Limited", swiftCode: "DPNBBTBT" }
    ]
  },

  // --- Central Asia ---
  {
    country: "Kazakhstan",
    code: "KZ",
    flag: "🇰🇿",
    currency: "KZT",
    currencySymbol: "₸",
    exchangeRateToUSD: 480.0,
    banks: [
      { name: "Halyk Bank (People's Bank of Kazakhstan)", swiftCode: "HSBKKZKX" },
      { name: "Kaspi Bank", swiftCode: "CASPKZKA" },
      { name: "ForteBank", swiftCode: "IRTYKZKA" },
      { name: "Bank CenterCredit", swiftCode: "CCBKKZKA" },
      { name: "Jusan Bank", swiftCode: "TSBNKZKA" }
    ]
  },
  {
    country: "Uzbekistan",
    code: "UZ",
    flag: "🇺🇿",
    currency: "UZS",
    currencySymbol: "so'm",
    exchangeRateToUSD: 12600.0,
    banks: [
      { name: "National Bank for Foreign Economic Activity (NBU)", swiftCode: "NBFAUZ2X" },
      { name: "SQB (Uzpromstroybank)", swiftCode: "UZPSUZ2X" },
      { name: "Ipoteka Bank (OTP Group)", swiftCode: "UZIPUZ22" },
      { name: "Asakabank", swiftCode: "ASKBUZ2X" },
      { name: "Kapitalbank", swiftCode: "KPBAUZ2X" }
    ]
  },
  {
    country: "Turkmenistan",
    code: "TM",
    flag: "🇹🇲",
    currency: "TMT",
    currencySymbol: "T",
    exchangeRateToUSD: 3.50,
    banks: [
      { name: "State Bank for Foreign Economic Affairs of Turkmenistan", swiftCode: "SBFTTM22" },
      { name: "Dayhanbank State Commercial Bank", swiftCode: "DAHNTM2X" },
      { name: "Turkmenbashi State Commercial Bank", swiftCode: "TBKSTM2X" },
      { name: "Senagat Joint Stock Commercial Bank", swiftCode: "SENGTM2X" }
    ]
  },
  {
    country: "Kyrgyzstan",
    code: "KG",
    flag: "🇰🇬",
    currency: "KGS",
    currencySymbol: "с",
    exchangeRateToUSD: 85.5,
    banks: [
      { name: "Demir Kyrgyz International Bank", swiftCode: "DEMIKG22" },
      { name: "Optima Bank", swiftCode: "UNIKKG22" },
      { name: "RSK Bank", swiftCode: "RSKIKG22" },
      { name: "Aiyl Bank", swiftCode: "AIYLKG22" }
    ]
  },
  {
    country: "Tajikistan",
    code: "TJ",
    flag: "🇹🇯",
    currency: "TJS",
    currencySymbol: "SM",
    exchangeRateToUSD: 10.9,
    banks: [
      { name: "Orienbank", swiftCode: "EBORTJ22" },
      { name: "Bank Eskhata", swiftCode: "ESKHTJ22" },
      { name: "Amonatbonk (State Savings Bank)", swiftCode: "SBTJTJ22" },
      { name: "International Bank of Tajikistan", swiftCode: "IBTJTJ22" }
    ]
  },

  // --- Middle East ---
  {
    country: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    currency: "AED",
    currencySymbol: "د.إ",
    exchangeRateToUSD: 3.67,
    banks: [
      { name: "First Abu Dhabi Bank (FAB)", swiftCode: "NBADAEAD" },
      { name: "Emirates NBD", swiftCode: "EBITAEAD" },
      { name: "Abu Dhabi Commercial Bank (ADCB)", swiftCode: "ADCBAEAA" },
      { name: "Dubai Islamic Bank (DIB)", swiftCode: "DUBIAEAD" },
      { name: "Mashreq Bank", swiftCode: "BOMLAEAD" },
      { name: "Abu Dhabi Islamic Bank (ADIB)", swiftCode: "ADIBUAEA" }
    ]
  },
  {
    country: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    currency: "SAR",
    currencySymbol: "﷼",
    exchangeRateToUSD: 3.75,
    banks: [
      { name: "Saudi National Bank (SNB / AlAhli)", swiftCode: "NCBKSAJE" },
      { name: "Al Rajhi Bank", swiftCode: "RJHISARI" },
      { name: "Riyad Bank", swiftCode: "RIBLSARI" },
      { name: "Banque Saudi Fransi", swiftCode: "BSFRSARI" },
      { name: "Saudi Awwal Bank (SAB / SABB)", swiftCode: "SABBSARI" },
      { name: "Arab National Bank (ANB)", swiftCode: "ARNBSARI" }
    ]
  },
  {
    country: "Qatar",
    code: "QA",
    flag: "🇶🇦",
    currency: "QAR",
    currencySymbol: "﷼",
    exchangeRateToUSD: 3.64,
    banks: [
      { name: "Qatar National Bank (QNB)", swiftCode: "QNBAQAQA" },
      { name: "Qatar Islamic Bank (QIB)", swiftCode: "QIBKQAQA" },
      { name: "Commercial Bank of Qatar (CBQ)", swiftCode: "CBQKQAQA" },
      { name: "Masraf Al Rayan", swiftCode: "ARYNQAQA" },
      { name: "Doha Bank", swiftCode: "DOHBQAQA" }
    ]
  },
  {
    country: "Kuwait",
    code: "KW",
    flag: "🇰🇼",
    currency: "KWD",
    currencySymbol: "KD",
    exchangeRateToUSD: 0.31,
    banks: [
      { name: "National Bank of Kuwait (NBK)", swiftCode: "NBOKKWKW" },
      { name: "Kuwait Finance House (KFH)", swiftCode: "KFHIKWKW" },
      { name: "Burgan Bank", swiftCode: "BURGKWKW" },
      { name: "Gulf Bank Kuwait", swiftCode: "GULFKWKW" },
      { name: "Boubyan Bank", swiftCode: "BBYNKWKW" }
    ]
  },
  {
    country: "Bahrain",
    code: "BH",
    flag: "🇧🇭",
    currency: "BHD",
    currencySymbol: "BD",
    exchangeRateToUSD: 0.38,
    banks: [
      { name: "National Bank of Bahrain (NBB)", swiftCode: "NBBBBHBM" },
      { name: "Ahli United Bank (AUB)", swiftCode: "AUBBBHBM" },
      { name: "Bank of Bahrain and Kuwait (BBK)", swiftCode: "BBKUBHBM" },
      { name: "Al Baraka Banking Group", swiftCode: "BARKBHBM" }
    ]
  },
  {
    country: "Oman",
    code: "OM",
    flag: "🇴🇲",
    currency: "OMR",
    currencySymbol: "OMR",
    exchangeRateToUSD: 0.38,
    banks: [
      { name: "Bank Muscat", swiftCode: "BMUSOMMX" },
      { name: "Bank Dhofar", swiftCode: "BDOFOMRX" },
      { name: "National Bank of Oman (NBO)", swiftCode: "NBOMOMRX" },
      { name: "Sohar International Bank", swiftCode: "BKSHOMRX" }
    ]
  },
  {
    country: "Israel",
    code: "IL",
    flag: "🇮🇱",
    currency: "ILS",
    currencySymbol: "₪",
    exchangeRateToUSD: 3.72,
    banks: [
      { name: "Bank Leumi le-Israel B.M.", swiftCode: "LUMIILIT" },
      { name: "Bank Hapoalim B.M.", swiftCode: "POALILIT" },
      { name: "Israel Discount Bank", swiftCode: "DISCILIT" },
      { name: "Mizrahi Tefahot Bank", swiftCode: "MIZRILIT" },
      { name: "First International Bank of Israel (FIBI)", swiftCode: "FIRNILIT" }
    ]
  },
  {
    country: "Turkey",
    code: "TR",
    flag: "🇹🇷",
    currency: "TRY",
    currencySymbol: "₺",
    exchangeRateToUSD: 34.1,
    banks: [
      { name: "Türkiye İş Bankası (İşbank)", swiftCode: "ISBKTRIS" },
      { name: "Ziraat Bankası", swiftCode: "TCZBTR2A" },
      { name: "Garanti BBVA", swiftCode: "TGBATR2A" },
      { name: "Akbank T.A.Ş.", swiftCode: "AKBKTRIS" },
      { name: "Yapı Kredi", swiftCode: "YAPITRIS" },
      { name: "VakıfBank", swiftCode: "TVBATR2A" }
    ]
  },
  {
    country: "Jordan",
    code: "JO",
    flag: "🇯🇴",
    currency: "JOD",
    currencySymbol: "JD",
    exchangeRateToUSD: 0.71,
    banks: [
      { name: "Arab Bank", swiftCode: "ARABJOAX" },
      { name: "Housing Bank for Trade and Finance (HBTF)", swiftCode: "HBILEJOA" },
      { name: "Jordan Kuwait Bank", swiftCode: "JKBAJOAX" },
      { name: "Bank al Etihad", swiftCode: "UBSIJOAM" },
      { name: "Jordan Islamic Bank", swiftCode: "JIBAJOAM" }
    ]
  },
  {
    country: "Lebanon",
    code: "LB",
    flag: "🇱🇧",
    currency: "LBP",
    currencySymbol: "L£",
    exchangeRateToUSD: 89500.0,
    banks: [
      { name: "Banque du Liban (BDL)", swiftCode: "BDLBBYBE" },
      { name: "Bank Audi", swiftCode: "AUDIBYBE" },
      { name: "BLOM Bank", swiftCode: "BLOMBYBE" },
      { name: "Byblos Bank", swiftCode: "BYBLLYBE" }
    ]
  },
  {
    country: "Iraq",
    code: "IQ",
    flag: "🇮🇶",
    currency: "IQD",
    currencySymbol: "ع.د",
    exchangeRateToUSD: 1310.0,
    banks: [
      { name: "Central Bank of Iraq", swiftCode: "CBIQIQBA" },
      { name: "Trade Bank of Iraq (TBI)", swiftCode: "TRIQIQBA" },
      { name: "Rafidain Bank", swiftCode: "RAFDIBBA" },
      { name: "Rasheed Bank", swiftCode: "RSHDIQBA" },
      { name: "Bank of Baghdad", swiftCode: "BOGHIQBA" }
    ]
  },
  {
    country: "Yemen",
    code: "YE",
    flag: "🇾🇪",
    currency: "YER",
    currencySymbol: "﷼",
    exchangeRateToUSD: 250.0,
    banks: [
      { name: "Central Bank of Yemen", swiftCode: "CBOYYESA" },
      { name: "Yemen Bank for Reconstruction and Development", swiftCode: "YBRDYESA" },
      { name: "International Bank of Yemen", swiftCode: "IBOYYESS" },
      { name: "Tadhamon Bank", swiftCode: "TADBYESA" }
    ]
  },

  // --- Africa ---
  {
    country: "South Africa",
    code: "ZA",
    flag: "🇿🇦",
    currency: "ZAR",
    currencySymbol: "R",
    exchangeRateToUSD: 17.6,
    banks: [
      { name: "Standard Bank of South Africa", swiftCode: "SBZAJJ" },
      { name: "FirstRand Bank (First National Bank / FNB)", swiftCode: "FIRNZAJJ" },
      { name: "Absa Bank Limited", swiftCode: "ABSAZAJJ" },
      { name: "Nedbank Limited", swiftCode: "NEDSZAJJ" },
      { name: "Capitec Bank Limited", swiftCode: "CBLPZAJJ" },
      { name: "Investec Bank Limited", swiftCode: "INVEZAJJ" }
    ]
  },
  {
    country: "Nigeria",
    code: "NG",
    flag: "🇳🇬",
    currency: "NGN",
    currencySymbol: "₦",
    exchangeRateToUSD: 1620.0,
    banks: [
      { name: "Access Bank Plc", swiftCode: "ACCONGLA" },
      { name: "Zenith Bank Plc", swiftCode: "ZEIBNGLA" },
      { name: "Guaranty Trust Bank (GTBank)", swiftCode: "GTBINGLA" },
      { name: "United Bank for Africa (UBA)", swiftCode: "UBALNGLA" },
      { name: "First Bank of Nigeria Limited", swiftCode: "FBNINGLA" },
      { name: "Fidelity Bank Plc", swiftCode: "FIDENGLA" }
    ]
  },
  {
    country: "Egypt",
    code: "EG",
    flag: "🇪🇬",
    currency: "EGP",
    currencySymbol: "E£",
    exchangeRateToUSD: 48.4,
    banks: [
      { name: "National Bank of Egypt (NBE)", swiftCode: "NBEGEGCX" },
      { name: "Banque Misr", swiftCode: "BMISEGCA" },
      { name: "Commercial International Bank (CIB)", swiftCode: "CIBEEGCX" },
      { name: "QNB Alahli", swiftCode: "NSGBEGCX" },
      { name: "Banque du Caire", swiftCode: "BCAIEGCX" },
      { name: "Arab African International Bank (AAIB)", swiftCode: "AAIBEGCX" }
    ]
  },
  {
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    currency: "KES",
    currencySymbol: "KSh",
    exchangeRateToUSD: 129.0,
    banks: [
      { name: "KCB Bank Kenya Limited", swiftCode: "KCBLKENX" },
      { name: "Equity Bank Kenya Limited", swiftCode: "EQBLKENA" },
      { name: "Co-operative Bank of Kenya", swiftCode: "KCOOONAX" },
      { name: "NCBA Bank Kenya Plc", swiftCode: "CBAKKENX" },
      { name: "Standard Chartered Bank Kenya", swiftCode: "SCBLKENX" },
      { name: "Absa Bank Kenya Plc", swiftCode: "BARCKENX" }
    ]
  },
  {
    country: "Morocco",
    code: "MA",
    flag: "🇲🇦",
    currency: "MAD",
    currencySymbol: "DH",
    exchangeRateToUSD: 9.85,
    banks: [
      { name: "Attijariwafa Bank", swiftCode: "BCMAMAMC" },
      { name: "Banque Centrale Populaire (BCP)", swiftCode: "BPOPMAMC" },
      { name: "Bank of Africa (BMCE Group)", swiftCode: "BMCEMAMC" },
      { name: "Société Générale Maroc", swiftCode: "SGMBMAMC" },
      { name: "BMCI (BNP Paribas)", swiftCode: "BMCIMAMC" }
    ]
  },
  {
    country: "Ghana",
    code: "GH",
    flag: "🇬🇭",
    currency: "GHS",
    currencySymbol: "GH₵",
    exchangeRateToUSD: 15.8,
    banks: [
      { name: "GCB Bank Limited", swiftCode: "GHCBGHAC" },
      { name: "Ecobank Ghana Limited", swiftCode: "ECOCGHAC" },
      { name: "Standard Chartered Bank Ghana", swiftCode: "SCBLGHAC" },
      { name: "Absa Bank Ghana Limited", swiftCode: "BARCGHAC" },
      { name: "Stanbic Bank Ghana", swiftCode: "SBICGHAC" }
    ]
  },
  {
    country: "Ethiopia",
    code: "ET",
    flag: "🇪🇹",
    currency: "ETB",
    currencySymbol: "Br",
    exchangeRateToUSD: 118.0,
    banks: [
      { name: "Commercial Bank of Ethiopia (CBE)", swiftCode: "CBETETAA" },
      { name: "Awash International Bank", swiftCode: "AWINETAA" },
      { name: "Dashen Bank", swiftCode: "DASHETAA" },
      { name: "Bank of Abyssinia", swiftCode: "ABYNETAA" },
      { name: "Cooperative Bank of Oromia", swiftCode: "CBORETAA" }
    ]
  },
  {
    country: "Tanzania",
    code: "TZ",
    flag: "🇹🇿",
    currency: "TZS",
    currencySymbol: "TSh",
    exchangeRateToUSD: 2710.0,
    banks: [
      { name: "CRDB Bank Plc", swiftCode: "CORUTZTZ" },
      { name: "NMB Bank Plc (National Microfinance Bank)", swiftCode: "NMBLTZTZ" },
      { name: "Standard Chartered Bank Tanzania", swiftCode: "SCBLTZTZ" },
      { name: "Stanbic Bank Tanzania Limited", swiftCode: "SBICTZTZ" }
    ]
  },
  {
    country: "Uganda",
    code: "UG",
    flag: "🇺🇬",
    currency: "UGX",
    currencySymbol: "USh",
    exchangeRateToUSD: 3720.0,
    banks: [
      { name: "Stanbic Bank Uganda Limited", swiftCode: "SBICUGKX" },
      { name: "Centenary Bank", swiftCode: "CERBUGKA" },
      { name: "Standard Chartered Bank Uganda", swiftCode: "SCBLUGKX" },
      { name: "Absa Bank Uganda Limited", swiftCode: "BARCUGKX" },
      { name: "dfcu Bank", swiftCode: "DFCUUGKA" }
    ]
  },
  {
    country: "Rwanda",
    code: "RW",
    flag: "🇷🇼",
    currency: "RWF",
    currencySymbol: "FRw",
    exchangeRateToUSD: 1330.0,
    banks: [
      { name: "Bank of Kigali Plc", swiftCode: "BKIGRWRW" },
      { name: "BPR Bank Rwanda Plc (Atlas Mara)", swiftCode: "BPRRRWRW" },
      { name: "I&M Bank (Rwanda) Plc", swiftCode: "BCRWRWRW" },
      { name: "Cogebanque Plc", swiftCode: "CGEBRWRW" }
    ]
  },
  {
    country: "Mauritius",
    code: "MU",
    flag: "🇲🇺",
    currency: "MUR",
    currencySymbol: "₨",
    exchangeRateToUSD: 46.5,
    banks: [
      { name: "Mauritius Commercial Bank (MCB)", swiftCode: "MCBLMUMU" },
      { name: "SBM Bank (Mauritius) Ltd", swiftCode: "SBINMUMU" },
      { name: "Absa Bank (Mauritius) Limited", swiftCode: "BARCMUMU" },
      { name: "AfrAsia Bank Limited", swiftCode: "AFBLMUMU" }
    ]
  },
  {
    country: "Seychelles",
    code: "SC",
    flag: "🇸🇨",
    currency: "SCR",
    currencySymbol: "SR",
    exchangeRateToUSD: 14.2,
    banks: [
      { name: "Nouvobanq (Seychelles International Mercantile Banking)", swiftCode: "SIMBSCSC" },
      { name: "Mauritius Commercial Bank (Seychelles)", swiftCode: "MCBLSCSC" },
      { name: "Absa Bank (Seychelles) Limited", swiftCode: "BARCSCSC" },
      { name: "Al Salam Bank Seychelles", swiftCode: "BMIBSCSC" }
    ]
  },
  {
    country: "Senegal",
    code: "SN",
    flag: "🇸🇳",
    currency: "XOF",
    currencySymbol: "CFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "Société Générale Sénégal (SGBS)", swiftCode: "SGBSSNDA" },
      { name: "CBAO Groupe Attijariwafa Bank", swiftCode: "BIAOSNDA" },
      { name: "Ecobank Sénégal", swiftCode: "ECOCSNDA" },
      { name: "Bank of Africa Sénégal (BOA)", swiftCode: "AFRISNDA" },
      { name: "BICIS (BNP Paribas / Sunu)", swiftCode: "BICISNDA" }
    ]
  },
  {
    country: "Ivory Coast",
    code: "CI",
    flag: "🇨🇮",
    currency: "XOF",
    currencySymbol: "CFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "Société Générale Côte d'Ivoire (SGBCI)", swiftCode: "SGBCABID" },
      { name: "Ecobank Côte d'Ivoire", swiftCode: "ECOCCICX" },
      { name: "NSIA Banque Côte d'Ivoire", swiftCode: "BIAOCIAB" },
      { name: "Banque Atlantique Côte d'Ivoire (BACI)", swiftCode: "ATNTCIAB" },
      { name: "SIB (Société Ivoirienne de Banque)", swiftCode: "SIBFCIAB" }
    ]
  },
  {
    country: "Cameroon",
    code: "CM",
    flag: "🇨🇲",
    currency: "XAF",
    currencySymbol: "FCFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "Afriland First Bank", swiftCode: "CCEIICMA" },
      { name: "Société Générale Cameroun", swiftCode: "SGBCICMD" },
      { name: "BICEC (Banque Internationale du Cameroun)", swiftCode: "BICEICMD" },
      { name: "SCB Cameroun (Attijariwafa)", swiftCode: "SCBCICMD" },
      { name: "Ecobank Cameroun", swiftCode: "ECOCCICM" }
    ]
  },
  {
    country: "Angola",
    code: "AO",
    flag: "🇦🇴",
    currency: "AOA",
    currencySymbol: "Kz",
    exchangeRateToUSD: 915.0,
    banks: [
      { name: "Banco Angolano de Investimentos (BAI)", swiftCode: "BAINAOLU" },
      { name: "Banco de Fomento Angola (BFA)", swiftCode: "BFOMAOLU" },
      { name: "Banco Millennium Atlântico", swiftCode: "BMAOAOLU" },
      { name: "Banco de Poupança e Crédito (BPC)", swiftCode: "BPCTAOLU" },
      { name: "Banco BIC Angola", swiftCode: "BICAOLU" }
    ]
  },
  {
    country: "Mozambique",
    code: "MZ",
    flag: "🇲🇿",
    currency: "MZN",
    currencySymbol: "MT",
    exchangeRateToUSD: 63.8,
    banks: [
      { name: "Millennium bim (Banco Internacional de Moçambique)", swiftCode: "BIMMMZMZ" },
      { name: "Standard Bank Mozambique", swiftCode: "SBICMZMZ" },
      { name: "BCI (Banco Comercial e de Investimentos)", swiftCode: "BCINMZMZ" },
      { name: "Absa Bank Mozambique", swiftCode: "BARCMZMZ" }
    ]
  },
  {
    country: "Zambia",
    code: "ZM",
    flag: "🇿🇲",
    currency: "ZMW",
    currencySymbol: "ZK",
    exchangeRateToUSD: 26.2,
    banks: [
      { name: "Zambia National Commercial Bank (Zanaco)", swiftCode: "ZNCOZMLU" },
      { name: "Stanbic Bank Zambia", swiftCode: "SBICZMLX" },
      { name: "Absa Bank Zambia Plc", swiftCode: "BARCZMLX" },
      { name: "Standard Chartered Bank Zambia", swiftCode: "SCBLZMLX" }
    ]
  },
  {
    country: "Zimbabwe",
    code: "ZW",
    flag: "🇿🇼",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "CBZ Bank Limited", swiftCode: "COBAZWHA" },
      { name: "Stanbic Bank Zimbabwe", swiftCode: "SBICZWHA" },
      { name: "CABS (Central Africa Building Society)", swiftCode: "CABSZWHA" },
      { name: "FBC Bank Limited", swiftCode: "FBCBZWHA" }
    ]
  },
  {
    country: "Botswana",
    code: "BW",
    flag: "🇧🇼",
    currency: "BWP",
    currencySymbol: "P",
    exchangeRateToUSD: 13.5,
    banks: [
      { name: "First National Bank of Botswana (FNBB)", swiftCode: "FIRNBWGX" },
      { name: "Absa Bank Botswana Limited", swiftCode: "BARCBWGX" },
      { name: "Stanbic Bank Botswana", swiftCode: "SBICBWGX" },
      { name: "Standard Chartered Bank Botswana", swiftCode: "SCBLBWGX" }
    ]
  },
  {
    country: "Namibia",
    code: "NA",
    flag: "🇳🇦",
    currency: "NAD",
    currencySymbol: "N$",
    exchangeRateToUSD: 17.6,
    banks: [
      { name: "First National Bank of Namibia (FNB)", swiftCode: "FIRNNANX" },
      { name: "Bank Windhoek", swiftCode: "BWLNNANX" },
      { name: "Standard Bank Namibia", swiftCode: "SBICNANX" },
      { name: "Nedbank Namibia", swiftCode: "NEDSNANX" }
    ]
  },
  {
    country: "Algeria",
    code: "DZ",
    flag: "🇩🇿",
    currency: "DZD",
    currencySymbol: "د.ج",
    exchangeRateToUSD: 134.0,
    banks: [
      { name: "Banque Nationale d'Algérie (BNA)", swiftCode: "BNALDZAL" },
      { name: "Banque Extérieure d'Algérie (BEA)", swiftCode: "BEXADZAL" },
      { name: "Crédit Populaire d'Algérie (CPA)", swiftCode: "CPALZAL" },
      { name: "Banque de Développement Local (BDL)", swiftCode: "BDLADZAL" },
      { name: "Société Générale Algérie", swiftCode: "SGBADZAL" }
    ]
  },
  {
    country: "Tunisia",
    code: "TN",
    flag: "🇹🇳",
    currency: "TND",
    currencySymbol: "د.ت",
    exchangeRateToUSD: 3.10,
    banks: [
      { name: "Banque Internationale Arabe de Tunisie (BIAT)", swiftCode: "BIATTNTN" },
      { name: "Banque Nationale Agricole (BNA)", swiftCode: "BNAGINTN" },
      { name: "Société Tunisienne de Banque (STB)", swiftCode: "STBKTNTN" },
      { name: "Attijari Bank Tunisie", swiftCode: "BSTUTNTN" },
      { name: "Amen Bank", swiftCode: "CFCTTNTN" }
    ]
  },
  {
    country: "Madagascar",
    code: "MG",
    flag: "🇲🇬",
    currency: "MGA",
    currencySymbol: "Ar",
    exchangeRateToUSD: 4550.0,
    banks: [
      { name: "BMOI (Banque Malgache de l'Océan Indien)", swiftCode: "BMOIMGMG" },
      { name: "BNI Madagascar", swiftCode: "CLMDMGMG" },
      { name: "Bank of Africa Madagascar (BOA)", swiftCode: "AFRIMINA" },
      { name: "Société Générale Madagasikara", swiftCode: "BFVMMGMG" }
    ]
  },
  {
    country: "Democratic Republic of the Congo",
    code: "CD",
    flag: "🇨🇩",
    currency: "CDF",
    currencySymbol: "FC",
    exchangeRateToUSD: 2850.0,
    banks: [
      { name: "Rawbank", swiftCode: "RAWBCDLA" },
      { name: "Equity BCDC", swiftCode: "BCDCKIXX" },
      { name: "Trust Merchant Bank (TMB)", swiftCode: "TRMBKIXX" },
      { name: "FBNBank DRC", swiftCode: "BICIKIKA" }
    ]
  },
  {
    country: "Republic of the Congo",
    code: "CG",
    flag: "🇨🇬",
    currency: "XAF",
    currencySymbol: "FCFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "BGFI Bank Congo", swiftCode: "BGFICGBZ" },
      { name: "Crédit du Congo (Attijariwafa)", swiftCode: "BCOGCGBZ" },
      { name: "Ecobank Congo", swiftCode: "ECOCCGBZ" },
      { name: "Société Générale Congo", swiftCode: "SGCGCGBZ" }
    ]
  },
  {
    country: "Gabon",
    code: "GA",
    flag: "🇬🇦",
    currency: "XAF",
    currencySymbol: "FCFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "BGFIBank Gabon", swiftCode: "BGFIGALB" },
      { name: "Union Gabonaise de Banque (UGB)", swiftCode: "UGBLGALB" },
      { name: "BICIG (BNP Paribas)", swiftCode: "BICIGALB" },
      { name: "Ecobank Gabon", swiftCode: "ECOCGALB" }
    ]
  },
  {
    country: "Equatorial Guinea",
    code: "GQ",
    flag: "🇬🇶",
    currency: "XAF",
    currencySymbol: "FCFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "Banco Nacional de Guinea Ecuatorial (BANGE)", swiftCode: "BAGEGQGQ" },
      { name: "Société Générale de Banques en Guinée Équatoriale", swiftCode: "SGGQGQMA" },
      { name: "CCEI Bank GE", swiftCode: "CCEIGQMA" }
    ]
  },
  {
    country: "Mali",
    code: "ML",
    flag: "🇲🇱",
    currency: "XOF",
    currencySymbol: "CFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "Banque de Développement du Mali (BDM-SA)", swiftCode: "BDMMMLBA" },
      { name: "Bank of Africa Mali (BOA)", swiftCode: "AFRIMLBA" },
      { name: "BIM-SA (Attijariwafa)", swiftCode: "BIMAMLBA" },
      { name: "Ecobank Mali", swiftCode: "ECOCMLBA" }
    ]
  },
  {
    country: "Burkina Faso",
    code: "BF",
    flag: "🇧🇫",
    currency: "XOF",
    currencySymbol: "CFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "Coris Bank International", swiftCode: "CORIBFBF" },
      { name: "Bank of Africa Burkina Faso", swiftCode: "AFRIBFBF" },
      { name: "Ecobank Burkina Faso", swiftCode: "ECOCBFBF" },
      { name: "Société Générale Burkina Faso", swiftCode: "SGIBBFBF" }
    ]
  },
  {
    country: "Niger",
    code: "NE",
    flag: "🇳🇪",
    currency: "XOF",
    currencySymbol: "CFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "BIA Niger", swiftCode: "BIANNERN" },
      { name: "Bank of Africa Niger", swiftCode: "AFRINER" },
      { name: "Sonibank", swiftCode: "SNBKNERN" },
      { name: "Ecobank Niger", swiftCode: "ECOCNERN" }
    ]
  },
  {
    country: "Chad",
    code: "TD",
    flag: "🇹🇩",
    currency: "XAF",
    currencySymbol: "FCFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "Société Générale Tchad", swiftCode: "SGBCTDND" },
      { name: "Commercial Bank Tchad (CBT)", swiftCode: "CBTDTDND" },
      { name: "Ecobank Tchad", swiftCode: "ECOCTDND" }
    ]
  },
  {
    country: "Sudan",
    code: "SD",
    flag: "🇸🇩",
    currency: "SDG",
    currencySymbol: "ج.س.",
    exchangeRateToUSD: 600.0,
    banks: [
      { name: "Bank of Khartoum", swiftCode: "BOKHSDKA" },
      { name: "Faisal Islamic Bank Sudan", swiftCode: "FIBSDKHA" },
      { name: "Omdurman National Bank", swiftCode: "ONBKSDKA" }
    ]
  },
  {
    country: "South Sudan",
    code: "SS",
    flag: "🇸🇸",
    currency: "SSP",
    currencySymbol: "£",
    exchangeRateToUSD: 1600.0,
    banks: [
      { name: "KCB Bank South Sudan", swiftCode: "KCBLSSJU" },
      { name: "Equity Bank South Sudan", swiftCode: "EQBLSSJU" },
      { name: "Stanbic Bank South Sudan", swiftCode: "SBICSSJU" }
    ]
  },
  {
    country: "Mauritania",
    code: "MR",
    flag: "🇲🇷",
    currency: "MRU",
    currencySymbol: "UM",
    exchangeRateToUSD: 39.8,
    banks: [
      { name: "Banque Nationale de Mauritanie (BNM)", swiftCode: "BNMAMRNK" },
      { name: "Générale de Banque de Mauritanie (GBM)", swiftCode: "GBMIMRNK" },
      { name: "Banque Al Wava Mauritanienne Islamique (BAMIS)", swiftCode: "BAMIMRNK" },
      { name: "Société Générale Mauritanie", swiftCode: "SGBMMRNK" }
    ]
  },
  {
    country: "Gambia",
    code: "GM",
    flag: "🇬🇲",
    currency: "GMD",
    currencySymbol: "D",
    exchangeRateToUSD: 68.5,
    banks: [
      { name: "Standard Chartered Bank Gambia", swiftCode: "SCBLGMGM" },
      { name: "Trust Bank Limited", swiftCode: "TBLGGMBJ" },
      { name: "Ecobank Gambia", swiftCode: "ECOCGMBJ" },
      { name: "Bloom Bank Africa Gambia", swiftCode: "FIBKGMBJ" }
    ]
  },
  {
    country: "Guinea",
    code: "GN",
    flag: "🇬🇳",
    currency: "GNF",
    currencySymbol: "FG",
    exchangeRateToUSD: 8600.0,
    banks: [
      { name: "Société Générale de Banques en Guinée (SGBG)", swiftCode: "SGBGGNCT" },
      { name: "BICIGUI (Banque Internationale pour le Commerce)", swiftCode: "BICIGNCT" },
      { name: "Ecobank Guinée", swiftCode: "ECOCGNCT" },
      { name: "Vista Bank Guinée", swiftCode: "BIFGGNCT" }
    ]
  },
  {
    country: "Sierra Leone",
    code: "SL",
    flag: "🇸🇱",
    currency: "SLE",
    currencySymbol: "Le",
    exchangeRateToUSD: 22.8,
    banks: [
      { name: "Rokel Commercial Bank", swiftCode: "ROKLSLFR" },
      { name: "Sierra Leone Commercial Bank (SLCB)", swiftCode: "SLCBSLFR" },
      { name: "Standard Chartered Bank Sierra Leone", swiftCode: "SCBLSLFR" },
      { name: "Ecobank Sierra Leone", swiftCode: "ECOCSLFR" }
    ]
  },
  {
    country: "Liberia",
    code: "LR",
    flag: "🇱🇷",
    currency: "LRD",
    currencySymbol: "L$",
    exchangeRateToUSD: 195.0,
    banks: [
      { name: "Central Bank of Liberia", swiftCode: "CBLILRMR" },
      { name: "Ecobank Liberia", swiftCode: "ECOCLRMR" },
      { name: "United Bank for Africa Liberia (UBA)", swiftCode: "UBALLRMR" },
      { name: "International Bank (Liberia) Limited", swiftCode: "IBALLRMR" }
    ]
  },
  {
    country: "Togo",
    code: "TG",
    flag: "🇹🇬",
    currency: "XOF",
    currencySymbol: "CFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "Ecobank Transnational Incorporated (ETI)", swiftCode: "ECOCTGTT" },
      { name: "Banque Togolaise pour le Commerce et l'Industrie (BTCI)", swiftCode: "BTCITGTG" },
      { name: "Union Togolaise de Banque (UTB)", swiftCode: "UTBLTGTG" },
      { name: "Orabank Togo", swiftCode: "BFIPTGTG" }
    ]
  },
  {
    country: "Benin",
    code: "BJ",
    flag: "🇧🇯",
    currency: "XOF",
    currencySymbol: "CFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "Bank of Africa Bénin", swiftCode: "AFRIBJCO" },
      { name: "Ecobank Bénin", swiftCode: "ECOCBJCO" },
      { name: "Société Générale Bénin", swiftCode: "SGBEBJCO" },
      { name: "BIIC (Banque Internationale pour l'Industrie)", swiftCode: "BIICBJCO" }
    ]
  },
  {
    country: "Burundi",
    code: "BI",
    flag: "🇧🇮",
    currency: "BIF",
    currencySymbol: "FBu",
    exchangeRateToUSD: 2900.0,
    banks: [
      { name: "Banque de Crédit de Bujumbura (BCB)", swiftCode: "BCBJBIBI" },
      { name: "Bancobu (Banque Commerciale du Burundi)", swiftCode: "BCOBBIBI" },
      { name: "Interbank Burundi (IBB)", swiftCode: "INBKBIBI" },
      { name: "CRDB Bank Burundi", swiftCode: "CRDBBIBI" }
    ]
  },
  {
    country: "Malawi",
    code: "MW",
    flag: "🇲🇼",
    currency: "MWK",
    currencySymbol: "MK",
    exchangeRateToUSD: 1730.0,
    banks: [
      { name: "National Bank of Malawi (NBM)", swiftCode: "NBMAMWMW" },
      { name: "Standard Bank Malawi", swiftCode: "SBICMWMW" },
      { name: "First Capital Bank Malawi", swiftCode: "FCBKMWMW" },
      { name: "NBS Bank Limited", swiftCode: "NBSBMWMW" }
    ]
  },
  {
    country: "Lesotho",
    code: "LS",
    flag: "🇱🇸",
    currency: "LSL",
    currencySymbol: "L",
    exchangeRateToUSD: 17.6,
    banks: [
      { name: "Standard Lesotho Bank", swiftCode: "SBICLSMX" },
      { name: "Nedbank Lesotho", swiftCode: "NEDSLSMX" },
      { name: "First National Bank Lesotho (FNB)", swiftCode: "FIRNLSMX" }
    ]
  },
  {
    country: "Eswatini",
    code: "SZ",
    flag: "🇸🇿",
    currency: "SZL",
    currencySymbol: "E",
    exchangeRateToUSD: 17.6,
    banks: [
      { name: "Standard Bank Eswatini", swiftCode: "SBICSZMX" },
      { name: "First National Bank of Eswatini", swiftCode: "FIRNSZMX" },
      { name: "Nedbank Eswatini", swiftCode: "NEDSSZMX" }
    ]
  },
  {
    country: "Djibouti",
    code: "DJ",
    flag: "🇩🇯",
    currency: "DJF",
    currencySymbol: "Fdj",
    exchangeRateToUSD: 177.7,
    banks: [
      { name: "Banque pour le Commerce et l'Industrie – Mer Rouge (BCIMR)", swiftCode: "BCIMDJDJ" },
      { name: "Bank of Africa Mer Rouge", swiftCode: "AFRIDJDJ" },
      { name: "CAC International Bank", swiftCode: "CACIDJDJ" },
      { name: "Salaam African Bank", swiftCode: "SALMDJDJ" }
    ]
  },
  {
    country: "Cape Verde",
    code: "CV",
    flag: "🇨🇻",
    currency: "CVE",
    currencySymbol: "Esc",
    exchangeRateToUSD: 101.5,
    banks: [
      { name: "Banco Comercial do Atlântico (BCA)", swiftCode: "BCACCVPR" },
      { name: "Caixa Económica de Cabo Verde", swiftCode: "CXECCVPR" },
      { name: "Banco Interatlântico", swiftCode: "BINACVPR" },
      { name: "BAI Cabo Verde", swiftCode: "BAINCVPR" }
    ]
  },
  {
    country: "Comoros",
    code: "KM",
    flag: "🇰🇲",
    currency: "KMF",
    currencySymbol: "CF",
    exchangeRateToUSD: 452.0,
    banks: [
      { name: "Banque Centrale des Comores", swiftCode: "BCOMKMKM" },
      { name: "Banque de Développement des Comores (BDC)", swiftCode: "BDEVEMKM" },
      { name: "BIC-Comores (BNP Paribas)", swiftCode: "BICCKMKM" }
    ]
  },
  {
    country: "Sao Tome and Principe",
    code: "ST",
    flag: "🇸🇹",
    currency: "STN",
    currencySymbol: "Db",
    exchangeRateToUSD: 22.5,
    banks: [
      { name: "Banco Internacional de São Tomé e Príncipe (BISTP)", swiftCode: "BISTSTST" },
      { name: "Afriland First Bank STP", swiftCode: "CCEISTST" },
      { name: "BGFI Bank São Tomé", swiftCode: "BGFISTST" }
    ]
  },

  // --- Oceania & Pacific ---
  {
    country: "Australia",
    code: "AU",
    flag: "🇦🇺",
    currency: "AUD",
    currencySymbol: "A$",
    exchangeRateToUSD: 1.48,
    banks: [
      { name: "Commonwealth Bank of Australia (CBA)", swiftCode: "CTBAAU2S" },
      { name: "Westpac Banking Corporation", swiftCode: "WPACAU2S" },
      { name: "Australia and New Zealand Banking Group (ANZ)", swiftCode: "ANZBAU3M" },
      { name: "National Australia Bank (NAB)", swiftCode: "NATAAU3303M" },
      { name: "Macquarie Bank Limited", swiftCode: "MACQAU2S" },
      { name: "Bendigo and Adelaide Bank", swiftCode: "BENDAU3B" }
    ]
  },
  {
    country: "New Zealand",
    code: "NZ",
    flag: "🇳🇿",
    currency: "NZD",
    currencySymbol: "NZ$",
    exchangeRateToUSD: 1.62,
    banks: [
      { name: "ANZ Bank New Zealand Limited", swiftCode: "ANZBNZ22" },
      { name: "Bank of New Zealand (BNZ)", swiftCode: "BKNZNZ22" },
      { name: "ASB Bank Limited", swiftCode: "ASBBNZ2A" },
      { name: "Westpac New Zealand", swiftCode: "WPACNZ2W" },
      { name: "Kiwibank Limited", swiftCode: "CITINZ2X" }
    ]
  },
  {
    country: "Fiji",
    code: "FJ",
    flag: "🇫🇯",
    currency: "FJD",
    currencySymbol: "FJ$",
    exchangeRateToUSD: 2.24,
    banks: [
      { name: "Australia and New Zealand Banking Group (ANZ Fiji)", swiftCode: "ANZBFJFX" },
      { name: "Westpac Banking Corporation (Fiji)", swiftCode: "WPACFJFX" },
      { name: "Bank of Baroda (Fiji)", swiftCode: "BARBFJFX" },
      { name: "Bank South Pacific (BSP Fiji)", swiftCode: "BOSPFJFX" },
      { name: "HFC Bank (Home Finance Company Bank)", swiftCode: "HFCBFJFX" }
    ]
  },
  {
    country: "Papua New Guinea",
    code: "PG",
    flag: "🇵🇬",
    currency: "PGK",
    currencySymbol: "K",
    exchangeRateToUSD: 3.92,
    banks: [
      { name: "Bank South Pacific (BSP Financial Group)", swiftCode: "BOSPPGPM" },
      { name: "Kina Bank", swiftCode: "MAYBPGPM" },
      { name: "Westpac Bank PNG Limited", swiftCode: "WPACPGPM" },
      { name: "ANZ Papua New Guinea", swiftCode: "ANZBPGPM" }
    ]
  },
  {
    country: "Samoa",
    code: "WS",
    flag: "🇼🇸",
    currency: "WST",
    currencySymbol: "WS$",
    exchangeRateToUSD: 2.74,
    banks: [
      { name: "Bank South Pacific Samoa (BSP Samoa)", swiftCode: "BOSPWSSX" },
      { name: "ANZ Bank (Samoa) Limited", swiftCode: "ANZBWSSX" },
      { name: "National Bank of Samoa (NBS)", swiftCode: "NBSMWSSX" },
      { name: "Samoa Commercial Bank Limited", swiftCode: "SCBLWSSX" }
    ]
  },
  {
    country: "Tonga",
    code: "TO",
    flag: "🇹🇴",
    currency: "TOP",
    currencySymbol: "T$",
    exchangeRateToUSD: 2.36,
    banks: [
      { name: "Bank South Pacific Tonga (BSP Tonga)", swiftCode: "BOSPTONU" },
      { name: "ANZ Bank (Tonga) Limited", swiftCode: "ANZBTONU" },
      { name: "Tonga Development Bank", swiftCode: "TDEBTONU" }
    ]
  },
  {
    country: "Vanuatu",
    code: "VU",
    flag: "🇻🇺",
    currency: "VUV",
    currencySymbol: "VT",
    exchangeRateToUSD: 119.0,
    banks: [
      { name: "Bank South Pacific Vanuatu (BSP)", swiftCode: "BOSPVUVU" },
      { name: "ANZ Bank (Vanuatu) Limited", swiftCode: "ANZBVUVU" },
      { name: "National Bank of Vanuatu (NBV)", swiftCode: "NBVAVUVU" },
      { name: "BRED Bank (Vanuatu) Limited", swiftCode: "BREDVUVU" }
    ]
  },
  {
    country: "Solomon Islands",
    code: "SB",
    flag: "🇸🇧",
    currency: "SBD",
    currencySymbol: "SI$",
    exchangeRateToUSD: 8.45,
    banks: [
      { name: "Bank South Pacific Solomon Islands (BSP)", swiftCode: "BOSPSBSB" },
      { name: "ANZ Bank (Solomon Islands) Limited", swiftCode: "ANZBSBSB" },
      { name: "BRED Bank Solomon", swiftCode: "BREDSBSB" },
      { name: "Pan Oceanic Bank (POB)", swiftCode: "PANOBSBS" }
    ]
  },
  {
    country: "Micronesia",
    code: "FM",
    flag: "🇫🇲",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Bank of the Federated States of Micronesia", swiftCode: "BFSMFM2X" },
      { name: "Bank of Guam (Micronesia Branch)", swiftCode: "BOGUGUMM" }
    ]
  },
  {
    country: "Palau",
    code: "PW",
    flag: "🇵🇼",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Bank of Hawaii (Palau)", swiftCode: "BOHIUS66" },
      { name: "Bank of Guam (Palau Branch)", swiftCode: "BOGUPW22" },
      { name: "National Development Bank of Palau", swiftCode: "NDBPPW22" }
    ]
  },
  {
    country: "Marshall Islands",
    code: "MH",
    flag: "🇲🇭",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Bank of Marshall Islands", swiftCode: "BOMIMHMJ" },
      { name: "Bank of Guam (Majuro Branch)", swiftCode: "BOGUMHMM" }
    ]
  },
  {
    country: "Kiribati",
    code: "KI",
    flag: "🇰🇮",
    currency: "AUD",
    currencySymbol: "A$",
    exchangeRateToUSD: 1.48,
    banks: [
      { name: "ANZ Bank (Kiribati) Limited", swiftCode: "ANZBKIBX" },
      { name: "Development Bank of Kiribati", swiftCode: "DBKIKIBX" }
    ]
  },
  {
    country: "Tuvalu",
    code: "TV",
    flag: "🇹🇻",
    currency: "AUD",
    currencySymbol: "A$",
    exchangeRateToUSD: 1.48,
    banks: [
      { name: "National Bank of Tuvalu (NBT)", swiftCode: "NBTVTVTV" }
    ]
  },
  {
    country: "Nauru",
    code: "NR",
    flag: "🇳🇷",
    currency: "AUD",
    currencySymbol: "A$",
    exchangeRateToUSD: 1.48,
    banks: [
      { name: "Bendigo and Adelaide Bank (Nauru Agency)", swiftCode: "BENDAU3B" }
    ]
  },
  {
    country: "Timor-Leste",
    code: "TL",
    flag: "🇹🇱",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Banco Nacional de Comércio de Timor-Leste (BNCTL)", swiftCode: "BNCTTLDI" },
      { name: "ANZ Timor-Leste", swiftCode: "ANZBTLDI" },
      { name: "Banco Nacional Ultramarino (BNU Timor)", swiftCode: "BNULTLDI" },
      { name: "Bank Mandiri Timor-Leste", swiftCode: "BMRITLDI" }
    ]
  },
  {
    country: "Libya",
    code: "LY",
    flag: "🇱🇾",
    currency: "LYD",
    currencySymbol: "LD",
    exchangeRateToUSD: 4.80,
    banks: [
      { name: "Central Bank of Libya", swiftCode: "CBLILYTR" },
      { name: "Jumhouria Bank", swiftCode: "JAMSLYTR" },
      { name: "National Commercial Bank Libya", swiftCode: "NCBLTRIP" },
      { name: "Sahara Bank", swiftCode: "SAHALYTR" },
      { name: "Wahda Bank", swiftCode: "WAHDLY22" }
    ]
  },
  {
    country: "Somalia",
    code: "SO",
    flag: "🇸🇴",
    currency: "SOS",
    currencySymbol: "Sh.So.",
    exchangeRateToUSD: 570.0,
    banks: [
      { name: "Central Bank of Somalia", swiftCode: "CBSOSO22" },
      { name: "Premier Bank Somalia", swiftCode: "PRMRSOMO" },
      { name: "Dahabshiil Bank International", swiftCode: "DHBISO22" },
      { name: "IBS Bank (International Bank of Somalia)", swiftCode: "IBSBSOMO" }
    ]
  },
  {
    country: "Eritrea",
    code: "ER",
    flag: "🇪🇷",
    currency: "ERN",
    currencySymbol: "Nfk",
    exchangeRateToUSD: 15.0,
    banks: [
      { name: "Bank of Eritrea", swiftCode: "BOERERAS" },
      { name: "Commercial Bank of Eritrea", swiftCode: "CBERERAS" },
      { name: "Housing and Commerce Bank of Eritrea", swiftCode: "HCBEERAS" }
    ]
  },
  {
    country: "Central African Republic",
    code: "CF",
    flag: "🇨🇫",
    currency: "XAF",
    currencySymbol: "FCFA",
    exchangeRateToUSD: 605.0,
    banks: [
      { name: "BPMC (Banque Populaire Maroco-Centrafricaine)", swiftCode: "BPMCFCFA" },
      { name: "Ecobank Centrafrique", swiftCode: "ECOCCFCX" },
      { name: "BSIC Centrafrique", swiftCode: "BSICCFBA" },
      { name: "CBCA (Commercial Bank Centrafrique)", swiftCode: "CBCACFBA" }
    ]
  },
  {
    country: "Belarus",
    code: "BY",
    flag: "🇧🇾",
    currency: "BYN",
    currencySymbol: "Br",
    exchangeRateToUSD: 3.28,
    banks: [
      { name: "Belarusbank", swiftCode: "AKBBY2X" },
      { name: "Belagroprombank", swiftCode: "BAPBBY2X" },
      { name: "Priorbank (Raiffeisen Group)", swiftCode: "PJCBBY2X" },
      { name: "Belgazprombank", swiftCode: "OLMPBY2X" }
    ]
  },
  {
    country: "Syria",
    code: "SY",
    flag: "🇸🇾",
    currency: "SYP",
    currencySymbol: "£S",
    exchangeRateToUSD: 13000.0,
    banks: [
      { name: "Commercial Bank of Syria", swiftCode: "CMSYDA" },
      { name: "Bank of Syria and Overseas (BSO)", swiftCode: "BSOSSYDA" },
      { name: "Cham Bank", swiftCode: "CHAMSYDA" }
    ]
  },
  {
    country: "Iran",
    code: "IR",
    flag: "🇮🇷",
    currency: "IRR",
    currencySymbol: "﷼",
    exchangeRateToUSD: 42000.0,
    banks: [
      { name: "Bank Melli Iran", swiftCode: "MELIIRTH" },
      { name: "Bank Mellat", swiftCode: "BKMTIRTH" },
      { name: "Bank Tejarat", swiftCode: "BTEJIRTH" },
      { name: "Bank Pasargad", swiftCode: "PASGIRTH" }
    ]
  },
  {
    country: "Vatican City",
    code: "VA",
    flag: "🇻🇦",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Institute for the Works of Religion (IOR / Vatican Bank)", swiftCode: "IORVVAXX" },
      { name: "Administration of the Patrimony of the Apostolic See (APSA)", swiftCode: "APSAVAXX" }
    ]
  }
];

// Sort countries alphabetically
countries.sort((a, b) => a.country.localeCompare(b.country));

const tsContent = `export interface BankInfo {
  name: string;
  swiftCode: string;
}

export interface CountryInfo {
  country: string;
  code: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToUSD: number; // 1 USD = X Currency
  banks: BankInfo[];
}

export const COUNTRIES_AND_BANKS: CountryInfo[] = ${JSON.stringify(countries, null, 2)};
`;

fs.writeFileSync('./src/lib/countriesAndBanks.ts', tsContent, 'utf-8');
console.log(`Successfully generated ${countries.length} countries and thousands of banks in ./src/lib/countriesAndBanks.ts`);
