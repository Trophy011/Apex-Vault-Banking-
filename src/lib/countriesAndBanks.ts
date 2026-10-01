export interface BankInfo {
  name: string;
  swiftCode: string;
}

export interface CountryInfo {
  country: string;
  code: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToUSD: number; // 1 USD = X Currency
  banks: BankInfo[];
}

export const COUNTRIES_AND_BANKS: CountryInfo[] = [
  // --- North America & Caribbean ---
  {
    country: "United States",
    code: "US",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "JPMorgan Chase Bank, N.A.", swiftCode: "CHASUS33" },
      { name: "Bank of America, N.A.", swiftCode: "BOFAUS3N" },
      { name: "Citibank, N.A.", swiftCode: "CITIUS33" },
      { name: "Wells Fargo Bank, N.A.", swiftCode: "WFBIUS6S" },
      { name: "Goldman Sachs Bank USA", swiftCode: "GSCOUS33" },
      { name: "Morgan Stanley Private Bank", swiftCode: "MSPBUS33" }
    ]
  },
  {
    country: "Canada",
    code: "CA",
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
    country: "Cayman Islands",
    code: "KY",
    currency: "KYD",
    currencySymbol: "CI$",
    exchangeRateToUSD: 0.83,
    banks: [
      { name: "Butterfield Bank (Cayman) Limited", swiftCode: "BNTBKYKG" },
      { name: "Cayman National Bank", swiftCode: "CNBOKYKG" },
      { name: "Scotiabank & Trust (Cayman)", swiftCode: "NOSCKYKG" },
      { name: "CIBC FirstCaribbean Cayman", swiftCode: "FCIBKYKG" }
    ]
  },
  {
    country: "Panama",
    code: "PA",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Banco General Panama", swiftCode: "BGENPAPA" },
      { name: "Banistmo", swiftCode: "PRPAPAPA" },
      { name: "Banco Nacional de Panamá", swiftCode: "BNPAPAPA" },
      { name: "BAC Credomatic Panama", swiftCode: "BACCPAPA" }
    ]
  },
  {
    country: "Costa Rica",
    code: "CR",
    currency: "CRC",
    currencySymbol: "₡",
    exchangeRateToUSD: 518.0,
    banks: [
      { name: "Banco Nacional de Costa Rica", swiftCode: "BNCRCRSJ" },
      { name: "Banco de Costa Rica (BCR)", swiftCode: "BCRACRSJ" },
      { name: "BAC San José", swiftCode: "BACSCRSJ" },
      { name: "Scotiabank Costa Rica", swiftCode: "NOSCCRSJ" }
    ]
  },

  // --- Western & Central Europe ---
  {
    country: "United Kingdom",
    code: "GB",
    currency: "GBP",
    currencySymbol: "£",
    exchangeRateToUSD: 0.78,
    banks: [
      { name: "HSBC UK Bank plc", swiftCode: "HBUKGB4B" },
      { name: "Barclays Bank UK PLC", swiftCode: "BARCGB22" },
      { name: "NatWest (National Westminster Bank)", swiftCode: "NWBKGB2L" },
      { name: "Lloyds Bank plc", swiftCode: "LOYDGB2L" },
      { name: "Standard Chartered Bank UK", swiftCode: "SCBLGB2L" },
      { name: "Santander UK plc", swiftCode: "ABBYGB2L" },
      { name: "Metro Bank PLC", swiftCode: "MYMBGB2L" }
    ]
  },
  {
    country: "Switzerland",
    code: "CH",
    currency: "CHF",
    currencySymbol: "CHF",
    exchangeRateToUSD: 0.89,
    banks: [
      { name: "UBS Switzerland AG", swiftCode: "UBSWCHZH" },
      { name: "Credit Suisse (Schweiz) AG", swiftCode: "CRESCHZZ" },
      { name: "Julius Baer Group", swiftCode: "BAERCHZZ" },
      { name: "Pictet & Cie Group", swiftCode: "PICTCHGG" },
      { name: "Banque Cantonale de Genève", swiftCode: "BCGECHGG" },
      { name: "Vontobel Holding AG", swiftCode: "VONTCHZZ" }
    ]
  },
  {
    country: "Germany",
    code: "DE",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Deutsche Bank AG", swiftCode: "DEUTDEDD" },
      { name: "Commerzbank AG", swiftCode: "COBADEFF" },
      { name: "KfW Bankengruppe", swiftCode: "KFWDEDFF" },
      { name: "DZ Bank AG", swiftCode: "GENODEDF" },
      { name: "BayernLB (Bayerische Landesbank)", swiftCode: "BYLADEMM" },
      { name: "Landesbank Baden-Württemberg (LBBW)", swiftCode: "SOLADEST" }
    ]
  },
  {
    country: "France",
    code: "FR",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "BNP Paribas S.A.", swiftCode: "BNPAFRPP" },
      { name: "Crédit Agricole S.A.", swiftCode: "AGRIFRPP" },
      { name: "Société Générale S.A.", swiftCode: "SOGEFRPP" },
      { name: "Groupe BPCE (Natixis)", swiftCode: "NATXFRPP" },
      { name: "Crédit Mutuel Alliance Fédérale", swiftCode: "CMCEFR2A" }
    ]
  },
  {
    country: "Netherlands",
    code: "NL",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "ING Bank N.V.", swiftCode: "INGBNL2A" },
      { name: "Rabobank", swiftCode: "RABONL2U" },
      { name: "ABN AMRO Bank N.V.", swiftCode: "ABNANL2A" },
      { name: "de Volksbank N.V.", swiftCode: "VOBANL2U" }
    ]
  },
  {
    country: "Belgium",
    code: "BE",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "KBC Bank NV", swiftCode: "KREDGEBB" },
      { name: "BNP Paribas Fortis", swiftCode: "GEBABEBB" },
      { name: "Belfius Bank & Insurance", swiftCode: "GKCCBEBB" },
      { name: "ING Belgium SA/NV", swiftCode: "BBRUBEBB" }
    ]
  },
  {
    country: "Ireland",
    code: "IE",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Bank of Ireland", swiftCode: "BOFIIE2D" },
      { name: "Allied Irish Banks (AIB)", swiftCode: "AIBKIE2D" },
      { name: "Permanent TSB", swiftCode: "PTSBIE2D" },
      { name: "Citibank Europe plc", swiftCode: "CITIIE2X" }
    ]
  },
  {
    country: "Austria",
    code: "AT",
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
    country: "Luxembourg",
    code: "LU",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Banque et Caisse d'Epargne de l'Etat (BCEE / Spuerkeess)", swiftCode: "BCEELULL" },
      { name: "BGL BNP Paribas", swiftCode: "BGLILULL" },
      { name: "Banque Internationale à Luxembourg (BIL)", swiftCode: "BILLLULL" },
      { name: "Société Générale Luxembourg", swiftCode: "SOGELULL" }
    ]
  },
  {
    country: "Monaco",
    code: "MC",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Compagnie Monégasque de Banque (CMB)", swiftCode: "CMONMCMC" },
      { name: "Barclays Bank Monaco", swiftCode: "BARCMCMC" },
      { name: "CFM Indosuez Wealth Management", swiftCode: "CFMAMCMC" },
      { name: "Société Générale Monaco", swiftCode: "SGBLMCMC" }
    ]
  },

  // --- Southern Europe ---
  {
    country: "Spain",
    code: "ES",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Banco Santander, S.A.", swiftCode: "BSCHESMM" },
      { name: "Banco Bilbao Vizcaya Argentaria (BBVA)", swiftCode: "BBVAESMM" },
      { name: "CaixaBank, S.A.", swiftCode: "CAIXESBB" },
      { name: "Banco Sabadell", swiftCode: "BSABESBB" },
      { name: "Bankinter", swiftCode: "BKTRESMM" }
    ]
  },
  {
    country: "Italy",
    code: "IT",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Intesa Sanpaolo S.p.A.", swiftCode: "BCITITMM" },
      { name: "UniCredit S.p.A.", swiftCode: "UNCRITM1" },
      { name: "Banco BPM S.p.A.", swiftCode: "BAPOIT22" },
      { name: "BPER Banca", swiftCode: "BPEFIT22" },
      { name: "Mediobanca", swiftCode: "MEBITMM1" }
    ]
  },
  {
    country: "Portugal",
    code: "PT",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Caixa Geral de Depósitos (CGD)", swiftCode: "CGDIPTPL" },
      { name: "Banco Comercial Português (Millennium bcp)", swiftCode: "BCOMPTPL" },
      { name: "Novo Banco", swiftCode: "BESCPTPL" },
      { name: "Banco Santander Totta", swiftCode: "TOTAPTPL" },
      { name: "Banco BPI", swiftCode: "BPIFPTPL" }
    ]
  },
  {
    country: "Greece",
    code: "GR",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "National Bank of Greece (NBG)", swiftCode: "ETHNGRAA" },
      { name: "Piraeus Bank", swiftCode: "PIRBGRAA" },
      { name: "Eurobank S.A.", swiftCode: "EFGBGRAA" },
      { name: "Alpha Bank", swiftCode: "CRBAGRAA" }
    ]
  },
  {
    country: "Cyprus",
    code: "CY",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Bank of Cyprus", swiftCode: "BCYPCY2N" },
      { name: "Hellenic Bank Public Company", swiftCode: "HEBACY2N" },
      { name: "Eurobank Cyprus Ltd", swiftCode: "EBCYCY2N" },
      { name: "AstroBank Limited", swiftCode: "PIRBCY2N" }
    ]
  },
  {
    country: "Malta",
    code: "MT",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Bank of Valletta (BOV)", swiftCode: "BOVMMTMT" },
      { name: "HSBC Bank Malta p.l.c.", swiftCode: "MMEBMTMT" },
      { name: "APS Bank plc", swiftCode: "APSBMTMT" },
      { name: "MeDirect Bank (Malta) plc", swiftCode: "MDBKMTMT" }
    ]
  },

  // --- Northern Europe ---
  {
    country: "Sweden",
    code: "SE",
    currency: "SEK",
    currencySymbol: "kr",
    exchangeRateToUSD: 10.45,
    banks: [
      { name: "Swedbank AB", swiftCode: "SWEDSEDF" },
      { name: "Skandinaviska Enskilda Banken (SEB)", swiftCode: "ESSEESSX" },
      { name: "Handelsbanken (Svenska Handelsbanken)", swiftCode: "HANDSESS" },
      { name: "Nordea Bank Abp Sweden", swiftCode: "NDEASTOCK" }
    ]
  },
  {
    country: "Norway",
    code: "NO",
    currency: "NOK",
    currencySymbol: "kr",
    exchangeRateToUSD: 10.6,
    banks: [
      { name: "DNB Bank ASA", swiftCode: "DNBNNOKK" },
      { name: "Nordea Bank Abp Norway", swiftCode: "NDEANOKK" },
      { name: "SpareBank 1 SR-Bank", swiftCode: "ROGBNO22" },
      { name: "Handelsbanken Norway", swiftCode: "HANDNO22" }
    ]
  },
  {
    country: "Denmark",
    code: "DK",
    currency: "DKK",
    currencySymbol: "kr",
    exchangeRateToUSD: 6.85,
    banks: [
      { name: "Danske Bank A/S", swiftCode: "DABADKKK" },
      { name: "Jyske Bank A/S", swiftCode: "JYBADK22" },
      { name: "Nykredit Bank A/S", swiftCode: "NYKBDK22" },
      { name: "Sydbank A/S", swiftCode: "SYBKDK22" }
    ]
  },
  {
    country: "Finland",
    code: "FI",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToUSD: 0.92,
    banks: [
      { name: "Nordea Bank Abp", swiftCode: "NDEAFIHH" },
      { name: "OP Financial Group (OP Osuuskunta)", swiftCode: "OKOYFIHH" },
      { name: "Danske Bank Finland", swiftCode: "DABAFIHH" },
      { name: "Aktia Bank Plc", swiftCode: "AKTIHE22" }
    ]
  },
  {
    country: "Poland",
    code: "PL",
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

  // --- Asia & Oceania ---
  {
    country: "Japan",
    code: "JP",
    currency: "JPY",
    currencySymbol: "¥",
    exchangeRateToUSD: 153.2,
    banks: [
      { name: "MUFG Bank, Ltd. (Mitsubishi)", swiftCode: "BOTKJPJT" },
      { name: "Sumitomo Mitsui Banking Corp (SMBC)", swiftCode: "SMBCJPJT" },
      { name: "Mizuho Bank, Ltd.", swiftCode: "MHCBJPJT" },
      { name: "Japan Post Bank Co., Ltd.", swiftCode: "JPPSJPJ1" },
      { name: "Resona Bank, Limited", swiftCode: "DIWJJPJT" }
    ]
  },
  {
    country: "China",
    code: "CN",
    currency: "CNY",
    currencySymbol: "¥",
    exchangeRateToUSD: 7.23,
    banks: [
      { name: "Industrial and Commercial Bank of China (ICBC)", swiftCode: "ICBKCNBJ" },
      { name: "China Construction Bank (CCB)", swiftCode: "PCBCBJBJ" },
      { name: "Agricultural Bank of China (ABC)", swiftCode: "ABOCCNBJ" },
      { name: "Bank of China (BOC)", swiftCode: "BKCHCNBJ" },
      { name: "Bank of Communications (BOCOM)", swiftCode: "COMMCNSH" }
    ]
  },
  {
    country: "Hong Kong",
    code: "HK",
    currency: "HKD",
    currencySymbol: "HK$",
    exchangeRateToUSD: 7.82,
    banks: [
      { name: "HSBC Hong Kong", swiftCode: "HSBCHKHH" },
      { name: "Bank of China (Hong Kong)", swiftCode: "BKCHHKHH" },
      { name: "Standard Chartered Bank (Hong Kong)", swiftCode: "SCBLHKHH" },
      { name: "Hang Seng Bank Limited", swiftCode: "HASEHKHH" }
    ]
  },
  {
    country: "Singapore",
    code: "SG",
    currency: "SGD",
    currencySymbol: "S$",
    exchangeRateToUSD: 1.34,
    banks: [
      { name: "DBS Bank Ltd", swiftCode: "DBSSSGSG" },
      { name: "Oversea-Chinese Banking Corp (OCBC)", swiftCode: "OCBCSGSG" },
      { name: "United Overseas Bank (UOB)", swiftCode: "UOVBSGSG" },
      { name: "Standard Chartered Bank (Singapore)", swiftCode: "SCBLSGSG" }
    ]
  },
  {
    country: "Australia",
    code: "AU",
    currency: "AUD",
    currencySymbol: "A$",
    exchangeRateToUSD: 1.52,
    banks: [
      { name: "Commonwealth Bank of Australia (CBA)", swiftCode: "CTBAAU2S" },
      { name: "Australia and New Zealand Banking Group (ANZ)", swiftCode: "ANZBAU3M" },
      { name: "Westpac Banking Corporation", swiftCode: "WPACAU2S" },
      { name: "National Australia Bank (NAB)", swiftCode: "NATAAU33" },
      { name: "Macquarie Bank Limited", swiftCode: "MACQAU2S" }
    ]
  },
  {
    country: "New Zealand",
    code: "NZ",
    currency: "NZD",
    currencySymbol: "NZ$",
    exchangeRateToUSD: 1.64,
    banks: [
      { name: "ANZ Bank New Zealand", swiftCode: "ANZBNZ22" },
      { name: "ASB Bank Limited", swiftCode: "ASBBNZ2A" },
      { name: "Bank of New Zealand (BNZ)", swiftCode: "BKNZNZ22" },
      { name: "Westpac New Zealand", swiftCode: "WPACNZ2W" },
      { name: "Kiwibank Limited", swiftCode: "KIWINZ2X" }
    ]
  },
  {
    country: "South Korea",
    code: "KR",
    currency: "KRW",
    currencySymbol: "₩",
    exchangeRateToUSD: 1375.0,
    banks: [
      { name: "KB Kookmin Bank", swiftCode: "CZNBKRSE" },
      { name: "Shinhan Bank", swiftCode: "SHBKKRSE" },
      { name: "Hana Bank (KEB Hana)", swiftCode: "HNBNKRSE" },
      { name: "Woori Bank", swiftCode: "HVBKSEUL" },
      { name: "Industrial Bank of Korea (IBK)", swiftCode: "IBKOSEUL" }
    ]
  },
  {
    country: "India",
    code: "IN",
    currency: "INR",
    currencySymbol: "₹",
    exchangeRateToUSD: 83.5,
    banks: [
      { name: "State Bank of India (SBI)", swiftCode: "SBININBB" },
      { name: "HDFC Bank Limited", swiftCode: "HDFCINBB" },
      { name: "ICICI Bank Limited", swiftCode: "ICICINBB" },
      { name: "Axis Bank Limited", swiftCode: "UTIBINBB" },
      { name: "Punjab National Bank (PNB)", swiftCode: "PUNBINBB" }
    ]
  },
  {
    country: "United Arab Emirates",
    code: "AE",
    currency: "AED",
    currencySymbol: "AED",
    exchangeRateToUSD: 3.67,
    banks: [
      { name: "Emirates NBD Bank PJSC", swiftCode: "EBILAEAD" },
      { name: "First Abu Dhabi Bank (FAB)", swiftCode: "NBADAEAD" },
      { name: "Abu Dhabi Commercial Bank (ADCB)", swiftCode: "ADCBAEAA" },
      { name: "Dubai Islamic Bank (DIB)", swiftCode: "DUBIAEAD" },
      { name: "Mashreq Bank PSC", swiftCode: "BOMLAEAD" }
    ]
  },
  {
    country: "Saudi Arabia",
    code: "SA",
    currency: "SAR",
    currencySymbol: "SAR",
    exchangeRateToUSD: 3.75,
    banks: [
      { name: "Saudi National Bank (SNB)", swiftCode: "NCBKSARJ" },
      { name: "Al Rajhi Banking & Investment Corp", swiftCode: "RJHISARI" },
      { name: "Riyad Bank", swiftCode: "RIBLSARI" },
      { name: "Saudi British Bank (SABB / Alawwal)", swiftCode: "SABBSARI" }
    ]
  },
  {
    country: "Qatar",
    code: "QA",
    currency: "QAR",
    currencySymbol: "QR",
    exchangeRateToUSD: 3.64,
    banks: [
      { name: "Qatar National Bank (QNB)", swiftCode: "QNBAQAQA" },
      { name: "Qatar Islamic Bank (QIB)", swiftCode: "QISBQAQA" },
      { name: "Commercial Bank of Qatar", swiftCode: "CBQAQAQA" },
      { name: "Doha Bank", swiftCode: "DHBKQAQA" }
    ]
  },
  {
    country: "Kuwait",
    code: "KW",
    currency: "KWD",
    currencySymbol: "KD",
    exchangeRateToUSD: 0.31,
    banks: [
      { name: "National Bank of Kuwait (NBK)", swiftCode: "NBKWKWKW" },
      { name: "Kuwait Finance House (KFH)", swiftCode: "KFHIKWKW" },
      { name: "Gulf Bank", swiftCode: "GULFKWKW" },
      { name: "Burgan Bank", swiftCode: "BURGKWKW" }
    ]
  },
  {
    country: "Bahrain",
    code: "BH",
    currency: "BHD",
    currencySymbol: "BD",
    exchangeRateToUSD: 0.38,
    banks: [
      { name: "National Bank of Bahrain (NBB)", swiftCode: "NBOBBHBM" },
      { name: "Bank of Bahrain and Kuwait (BBK)", swiftCode: "BBKUBHBM" },
      { name: "Ahli United Bank (AUB)", swiftCode: "AUBBBHBM" },
      { name: "Al Baraka Islamic Bank", swiftCode: "BARKBHBM" }
    ]
  },
  {
    country: "Oman",
    code: "OM",
    currency: "OMR",
    currencySymbol: "OMR",
    exchangeRateToUSD: 0.385,
    banks: [
      { name: "Bank Muscat", swiftCode: "BMUSOMMX" },
      { name: "Bank Dhofar", swiftCode: "BKDHOMMX" },
      { name: "National Bank of Oman (NBO)", swiftCode: "NBONOMMX" },
      { name: "Oman Arab Bank", swiftCode: "OABKOMMX" }
    ]
  },
  {
    country: "Israel",
    code: "IL",
    currency: "ILS",
    currencySymbol: "₪",
    exchangeRateToUSD: 3.72,
    banks: [
      { name: "Bank Leumi le-Israel", swiftCode: "LUMIILTL" },
      { name: "Bank Hapoalim B.M.", swiftCode: "POALILIT" },
      { name: "Israel Discount Bank", swiftCode: "DISCILIT" },
      { name: "Mizrahi Tefahot Bank", swiftCode: "MIZRILIT" }
    ]
  },
  {
    country: "Turkey",
    code: "TR",
    currency: "TRY",
    currencySymbol: "₺",
    exchangeRateToUSD: 33.1,
    banks: [
      { name: "Ziraat Bankası", swiftCode: "TCZBTR2A" },
      { name: "Türkiye İş Bankası (İşbank)", swiftCode: "ISBKTRIS" },
      { name: "Garanti BBVA", swiftCode: "TGBATR2A" },
      { name: "Akbank T.A.Ş.", swiftCode: "AKBKTRIS" },
      { name: "Yapı Kredi Bankası", swiftCode: "YAPITRTR" }
    ]
  },
  {
    country: "Malaysia",
    code: "MY",
    currency: "MYR",
    currencySymbol: "RM",
    exchangeRateToUSD: 4.71,
    banks: [
      { name: "Malayan Banking Berhad (Maybank)", swiftCode: "MBBEMYKL" },
      { name: "CIMB Bank Berhad", swiftCode: "CIBBMYKL" },
      { name: "Public Bank Berhad", swiftCode: "PBBEMYKL" },
      { name: "RHB Bank Berhad", swiftCode: "RHBBMYKL" }
    ]
  },
  {
    country: "Indonesia",
    code: "ID",
    currency: "IDR",
    currencySymbol: "Rp",
    exchangeRateToUSD: 16100.0,
    banks: [
      { name: "Bank Mandiri (Persero) Tbk", swiftCode: "BMRIIDJA" },
      { name: "Bank Rakyat Indonesia (BRI)", swiftCode: "BRINIDJA" },
      { name: "Bank Central Asia (BCA)", swiftCode: "CENAIDJA" },
      { name: "Bank Negara Indonesia (BNI)", swiftCode: "BNINIDJA" }
    ]
  },
  {
    country: "Thailand",
    code: "TH",
    currency: "THB",
    currencySymbol: "฿",
    exchangeRateToUSD: 36.6,
    banks: [
      { name: "Bangkok Bank Public Company", swiftCode: "BKKPTHBK" },
      { name: "Kasikornbank (KBank)", swiftCode: "KASITHBK" },
      { name: "Siam Commercial Bank (SCB)", swiftCode: "SICOTHBK" },
      { name: "Krungthai Bank", swiftCode: "KRNGTHBK" }
    ]
  },
  {
    country: "Philippines",
    code: "PH",
    currency: "PHP",
    currencySymbol: "₱",
    exchangeRateToUSD: 58.5,
    banks: [
      { name: "BDO Unibank (Banco de Oro)", swiftCode: "BNORPHMM" },
      { name: "Bank of the Philippine Islands (BPI)", swiftCode: "BOPIPHMM" },
      { name: "Metropolitan Bank and Trust (Metrobank)", swiftCode: "MBTCPHMM" },
      { name: "Land Bank of the Philippines", swiftCode: "TLBIPHMM" }
    ]
  },
  {
    country: "Vietnam",
    code: "VN",
    currency: "VND",
    currencySymbol: "₫",
    exchangeRateToUSD: 25400.0,
    banks: [
      { name: "Vietcombank (Bank for Foreign Trade)", swiftCode: "BFTVVNVX" },
      { name: "VietinBank (Industrial & Commercial Bank)", swiftCode: "ICBVVNVX" },
      { name: "BIDV (Investment and Development Bank)", swiftCode: "BIDVVNVX" },
      { name: "Agribank", swiftCode: "VBAAVNVX" }
    ]
  },

  // --- Africa ---
  {
    country: "South Africa",
    code: "ZA",
    currency: "ZAR",
    currencySymbol: "R",
    exchangeRateToUSD: 18.25,
    banks: [
      { name: "Standard Bank of South Africa", swiftCode: "SBZAZAJJ" },
      { name: "FirstRand Bank Limited (FNB)", swiftCode: "FIRNZAJJ" },
      { name: "Absa Bank Limited", swiftCode: "ABSAZAJJ" },
      { name: "Nedbank Limited", swiftCode: "NEDBZAJJ" },
      { name: "Capitec Bank Limited", swiftCode: "CAPIZAJJ" }
    ]
  },
  {
    country: "Nigeria",
    code: "NG",
    currency: "NGN",
    currencySymbol: "₦",
    exchangeRateToUSD: 1480.0,
    banks: [
      { name: "Zenith Bank PLC", swiftCode: "ZEIBNGLA" },
      { name: "Access Bank Plc", swiftCode: "ACBENGLA" },
      { name: "Guaranty Trust Bank (GTBank)", swiftCode: "GTBINGLA" },
      { name: "First Bank of Nigeria Limited", swiftCode: "FBNINGLA" },
      { name: "United Bank for Africa (UBA)", swiftCode: "UNAFNGLA" }
    ]
  },
  {
    country: "Egypt",
    code: "EG",
    currency: "EGP",
    currencySymbol: "E£",
    exchangeRateToUSD: 48.3,
    banks: [
      { name: "National Bank of Egypt (NBE)", swiftCode: "NBEGEGCX" },
      { name: "Banque Misr", swiftCode: "BMISEGCA" },
      { name: "Commercial International Bank (CIB)", swiftCode: "CIBEEGCX" },
      { name: "QNB Alahli", swiftCode: "QNBAEGCX" }
    ]
  },
  {
    country: "Kenya",
    code: "KE",
    currency: "KES",
    currencySymbol: "KSh",
    exchangeRateToUSD: 129.5,
    banks: [
      { name: "KCB Bank Kenya Limited", swiftCode: "KCBLKENX" },
      { name: "Equity Bank Kenya", swiftCode: "EQBLKENA" },
      { name: "Co-operative Bank of Kenya", swiftCode: "KCOOOKEN" },
      { name: "Absa Bank Kenya", swiftCode: "BARCKENX" }
    ]
  },
  {
    country: "Ghana",
    code: "GH",
    currency: "GHS",
    currencySymbol: "GH₵",
    exchangeRateToUSD: 15.3,
    banks: [
      { name: "GCB Bank PLC", swiftCode: "GCBLGHAC" },
      { name: "Ecobank Ghana", swiftCode: "ECOCGHAC" },
      { name: "Standard Chartered Bank Ghana", swiftCode: "SCBLGHAC" },
      { name: "Absa Bank Ghana", swiftCode: "BARCGHAC" }
    ]
  },
  {
    country: "Morocco",
    code: "MA",
    currency: "MAD",
    currencySymbol: "DH",
    exchangeRateToUSD: 9.85,
    banks: [
      { name: "Attijariwafa Bank", swiftCode: "BCMAMAMC" },
      { name: "Banque Centrale Populaire (BCP)", swiftCode: "BPOPMAAX" },
      { name: "Bank of Africa (BMCE Group)", swiftCode: "BMCEMAMC" },
      { name: "Société Générale Maroc", swiftCode: "SGMBMAMC" }
    ]
  },
  {
    country: "Mauritius",
    code: "MU",
    currency: "MUR",
    currencySymbol: "Rs",
    exchangeRateToUSD: 46.2,
    banks: [
      { name: "Mauritius Commercial Bank (MCB)", swiftCode: "MCBLMUMU" },
      { name: "SBM Bank (Mauritius) Ltd", swiftCode: "SBMMMUMU" },
      { name: "Absa Bank (Mauritius) Limited", swiftCode: "BARCMUMU" },
      { name: "HSBC Mauritius", swiftCode: "HSBCMUMU" }
    ]
  },
  {
    country: "Rwanda",
    code: "RW",
    currency: "RWF",
    currencySymbol: "FRw",
    exchangeRateToUSD: 1320.0,
    banks: [
      { name: "Bank of Kigali (BK)", swiftCode: "BKIGRWRW" },
      { name: "BPR Bank Rwanda Plc", swiftCode: "BPRRRWRW" },
      { name: "I&M Bank (Rwanda) PLC", swiftCode: "BCRRRWRW" },
      { name: "Equity Bank Rwanda", swiftCode: "EQBLRWRW" }
    ]
  },

  // --- South America ---
  {
    country: "Brazil",
    code: "BR",
    currency: "BRL",
    currencySymbol: "R$",
    exchangeRateToUSD: 5.45,
    banks: [
      { name: "Itaú Unibanco S.A.", swiftCode: "ITAUFRPP" },
      { name: "Banco do Brasil S.A.", swiftCode: "BRASBRR2" },
      { name: "Banco Bradesco S.A.", swiftCode: "BBDEBRSP" },
      { name: "Banco Santander Brasil", swiftCode: "BSBRBRSP" },
      { name: "Caixa Econômica Federal", swiftCode: "CEFXBRDF" }
    ]
  },
  {
    country: "Argentina",
    code: "AR",
    currency: "ARS",
    currencySymbol: "$",
    exchangeRateToUSD: 940.0,
    banks: [
      { name: "Banco de la Nación Argentina", swiftCode: "NACNARBA" },
      { name: "Banco Santander Argentina", swiftCode: "RIONARBA" },
      { name: "Banco Galicia", swiftCode: "GALIARBA" },
      { name: "BBVA Argentina", swiftCode: "FRANARBA" },
      { name: "Banco Macro", swiftCode: "BMAUARBA" }
    ]
  },
  {
    country: "Chile",
    code: "CL",
    currency: "CLP",
    currencySymbol: "$",
    exchangeRateToUSD: 930.0,
    banks: [
      { name: "Banco de Chile", swiftCode: "BCHICLRM" },
      { name: "Banco Santander-Chile", swiftCode: "BSCHCLRM" },
      { name: "Banco Estado", swiftCode: "BECHCLRM" },
      { name: "Banco BCI (Crédito e Inversiones)", swiftCode: "BCICCLRM" }
    ]
  },
  {
    country: "Colombia",
    code: "CO",
    currency: "COP",
    currencySymbol: "$",
    exchangeRateToUSD: 4120.0,
    banks: [
      { name: "Bancolombia S.A.", swiftCode: "COLOBOM1" },
      { name: "Banco de Bogotá", swiftCode: "BBOOCOBM" },
      { name: "Davivienda", swiftCode: "DAVIEOBM" },
      { name: "BBVA Colombia", swiftCode: "BBVACOBB" }
    ]
  },
  {
    country: "Peru",
    code: "PE",
    currency: "PEN",
    currencySymbol: "S/",
    exchangeRateToUSD: 3.75,
    banks: [
      { name: "Banco de Crédito del Perú (BCP)", swiftCode: "BCPLPEPL" },
      { name: "BBVA Perú", swiftCode: "BCMPEPL" },
      { name: "Scotiabank Perú", swiftCode: "BSUDPEPL" },
      { name: "Interbank (Banco Internacional del Perú)", swiftCode: "BINSPEPL" }
    ]
  },
  {
    country: "Uruguay",
    code: "UY",
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
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToUSD: 1.0,
    banks: [
      { name: "Banco Pichincha C.A.", swiftCode: "PICHUCEQ" },
      { name: "Banco Guayaquil", swiftCode: "GUAYUCEQ" },
      { name: "Produbanco (Grupo Promerica)", swiftCode: "PRODUCEQ" },
      { name: "Banco del Pacífico", swiftCode: "PACIUCEQ" }
    ]
  }
];
