(function(){
  const $ = id => document.getElementById(id);

  // BACKEND_URL and BRANCH_CREDENTIALS are declared in config.js,
  // which is loaded before this file - see index.html.

  function attemptLogin(){
    const userRaw = $('loginUser').value.trim();
    const pass = $('loginPass').value;
    const key = userRaw.toLowerCase();
    const errBox = $('loginError');
    const record = BRANCH_CREDENTIALS[key];

    if(!record || record.password !== pass){
      errBox.textContent = 'Incorrect username or password.';
      return;
    }
    errBox.textContent = '';

    $('loginScreen').style.display = 'none';
    $('appScreen').style.display = 'block';
    $('loggedInAs').textContent = 'Logged in as: ' + record.branch + ' (' + userRaw + ')';

    // Lock the Branch field to this login's branch so records are always
    // attributed correctly - staff can't file a requirement under another branch.
    // HO is the exception: it can file/view requirements for any branch,
    // so the Branch dropdown stays open with the full list.
    const branchSelect = $('branch');
    if(record.isHO){
      branchSelect.value = '';
      branchSelect.disabled = false;
    } else {
      branchSelect.value = record.branch;
      branchSelect.disabled = true;
    }
  }

  $('loginBtn').addEventListener('click', attemptLogin);
  $('loginPass').addEventListener('keydown', (e) => { if(e.key === 'Enter') attemptLogin(); });
  $('loginUser').addEventListener('keydown', (e) => { if(e.key === 'Enter') $('loginPass').focus(); });

  $('logoutBtn').addEventListener('click', () => {
    if(!confirm('Log out? Any unsaved requirement rows will be cleared.')) return;
    location.reload();
  });



  // Data pulled from DATA_SHEET.xlsx - one array per column name, deduplicated & sorted.
  // Field IDs map directly to the sheet's column headers:
  // Branch, Department, ITEM, CATEGORY, FIT, SUBBRAND, FABRIC, FAB_DESG,
  // SLEEVE, NECK, LENGTH, SETS, SIZE, COLOR, SUB_ITEM
  const SHEET_OPTIONS = {"branch": ["BIDAR", "BIJAPUR", "CHIKMAGALUR", "GOPALAN ARCADE", "GOPALAN SIGNATURE MALL", "HASSAN", "JAYNAGAR", "JAYNAGAR SALE POINT", "KALABURAGI", "MANTRI MALL", "MYSORE", "NEW COMMERCIAL STREET", "PHOENIX MARKETCITY MALL", "ROYAL MEENAKASHI MALL", "SHOWOFF MALLESHWARAM", "TUMKUR", "YELAHANKA"], "department": ["BOYS", "GIRLS", "MENS", "MENS BOTTOM", "WOMENS"], "items": ["BANDI", "BANDI DHOTI SET", "BANDI JODHPURI SUIT", "BANDI KURTA SET", "BANDI PRINCE SUIT", "BANDI SHIRT SET", "BELT", "BLAZER", "BLAZER  SET", "BLAZER SUIT", "BLAZER WITH DRESS", "BOXER SHORTS", "CAPRI", "CIGARETTE PANT", "CORD SET", "CORD SHORTS", "CULOTTES SET", "DHOTI", "DHOTI MIDI", "DHOTI SALWAR SET", "DRAWSTRINGS", "DRESS", "DRESS & LEGGINGS SET", "DUNGREE", "DUNGREE CAPRI", "DUNGREE SET", "DUNGREE SHORTS", "DUNGREE SKIRT", "DUPATTA", "DUPPATA & CHUDI BOTTOM SET", "DUPPATA & PATIYALA BOTTOM SET", "DUPPATA & SALWAR BOTTOM SET", "FROCK", "GHAGHRA CHOLI SET", "GOWN", "HALF SAREE", "HALF SAREE SHARARA", "INDOWESTERN SET", "JACKET", "JACKET CORD SET", "JACKET T-SHIRT SET", "JACKET WITH DRESS", "JACKET WITH JEANS", "JACKET WITH SWEAT SHIRT", "JEANS", "JEGGING", "JODHPURI BLAZER", "JODHPURI SET", "JODHPURI SUIT", "JUMP SUIT", "JUMP SUIT SHORTS", "KURTA", "KURTA DHOTI SET", "KURTA INDO SET", "KURTA PATHANI", "KURTA PATHANI SET", "KURTA PINTUK SET", "KURTA SET", "KURTA SHIRT", "KURTHI SHARARA SET", "KURTI", "KURTI & DUPPATA SET", "KURTI SET", "KURTI WITH PENCIL PANT", "LEGGINGS", "NAWABI KURTA SET", "NAWABI SET", "OPEN BANDI KURTA SET", "OPEN INDOWESTERN SET", "OPEN JACKET SET", "OPEN PRINCE SUIT", "PALAZZO", "PER WINTER T-SHIRT", "PRINCE COAT", "PRINCE SUIT", "PULLOVER", "PUNJABI CHUDI SUIT", "PUNJABI DHOTI SET", "PUNJABI GHAGHRA SUIT", "PUNJABI PALAZZO SUIT", "PUNJABI PATIYALA SUIT", "PUNJABI PLAZO SUIT", "PUNJABI SALWAR SUIT", "PUNJABI SHARARA SUIT", "SEMI BLAZER SET", "SEMI INDOWESTERN SET", "SEMI SHERWANI SET", "SHACKET", "SHERWANI SET", "SHIRT", "SHIRT AND TIE", "SHIRT WITH BOW", "SHIRT WITH T-SHIRT", "SHORTS", "SKIRT", "SKIRT CORD SET", "SLIPERS", "STOLES", "SUSPENDER", "SWEAT SHIRT", "SWEATER", "T-SHIRT", "T-SHIRT & SHORTS SET", "TIE", "TIGHTS", "TOP", "TOP & CAPRI SET", "TOP & DHOTI SET", "TOP & DUNGREE SHORT SET", "TOP & DUNGREE SKIRT SET", "TOP & PALAZZO SET", "TOP & PANT SET", "TOP & SHORT SET", "TOP & SKIRT SET", "TOP & TRACK SET", "TOP WITH DUNGREE SET", "TRACK PANT", "TRACK SUIT", "TROUSER", "WAIST COAT SHIRT SET", "WAISTCOAT", "WAISTCOAT SHIRT SET"], "category": ["CASUAL BASIC", "CASUAL DESIGNER", "ETHNIC", "ETHNIC BASIC", "ETHNIC DESIGNER", "FASHION", "FOOTWEAR", "FORMAL", "PARTY WEAR", "SPORTS WEAR"], "fit": ["BAGGY CARGO FIT", "BAGGY FIT", "BALLOON FIT", "BELL BOTTOM FIT", "BOOT CUT", "BOYFRIEND FIT", "CARGO FIT", "CARGO JOGGERS FIT", "CARGO STRAIGHT FIT", "CARROT FIT", "COMFORT FIT", "CROP FIT", "CROPPED FIT", "FLARED FIT", "GURKHA FIT", "JOGGERS FIT", "KOREAN FIT", "LOOSE FIT", "LOOSE STRAIGHT FIT", "MOM S FIT", "NARROW FIT", "OVERSIZE FIT", "PARTY WEAR", "PENCIL FIT", "POLO FIT", "REGULAR FIT", "SAILOR FIT", "SIDE SLIT", "SKINNY FIT", "SLIM FIT", "SLOUCHY FIT", "SMART FIT", "STRAIGHT FIT", "WIDE LEG"], "subBrand": ["-", "11 COME FROM", "1PLUS 1WING", "2 BE 3", "26", "2D SIGN", "33M", "7A", "888", "8I", "9 WAY", "9WAY", "A & B", "A C", "A R", "A T", "A XING YUAN", "A&J", "A&J STUDIO", "A.++", "A.D COLLECTION", "A.Q", "A.QUEEN", "AAPNA", "AAPNO", "AARDA FASHION", "AARDO", "AARION", "AARYA", "AAYT", "Aayushi", "ABANDON", "ABC ZIPPER", "ABCD", "ABOUT US", "ACCEPT", "ACMI", "ACTIVENT", "ACTIVENT SUPERIOR", "ACTUEL", "ADIDAS", "ADJ83", "ADJECTIVE VOGUE SERIES", "ADOZY", "ADW-58", "AERIES", "AEROBIK", "AFTER 8", "AHMED", "AI", "AI FASHION", "AI LI LAI FASHION", "AIBINNI", "AIDIFUSHI", "AIERO", "AIMEI", "AIMILAN", "AIR FORCE", "AIR GIRL", "AIR GIRLS", "AIR SUPPLY", "AIRWALK", "AISHANG DUO DUO", "AIVIVI", "AJC", "AJILE", "AK", "AKKARA", "AKSARA", "AL MAK", "ALA MADA", "ALAG", "ALAMODE", "ALEX", "ALFIZA", "ALICE", "ALIVE", "ALL RUGGED", "ALLEN SOLLY", "ALQN", "ALRALE", "AM", "AMABA", "AMBEY", "AMCHOOR JUNIORS", "AMEETTING", "AMELIE", "AMIN JIA", "AMSTEAD", "AMY CLOTHING", "ANARKALI", "ANGEL", "ANGEL CLOTHING", "ANGRY KIDS", "ANNA WU", "ANNSANA", "ANPUDUSEN", "ANSAR", "ANZHIXI", "AOXITE", "AP", "APRIS", "AQE", "AQR", "AQUA FIT", "ARE", "ARF", "ARHAM", "ARI GIRL", "ARMANI", "ARPAN", "ARRIBA", "ARROW", "ASST", "ASTON MULLER", "AT", "ATTENTION", "ATTITUDE", "AUDRIA", "AUTHENITIC STYLE", "AVRIL", "AVSAR", "AXE", "AYAAN", "AYWTER", "AZ", "AZARA", "B & F", "B B", "B B C", "B D K L", "B K TRADERS", "B P", "B T30", "B&S", "B+ VESTRY", "B+BASIC", "B-ARDFW", "B-ETHNIC", "B.F. MEI", "B.K", "B.P", "B.S.LU", "B.T", "B.T.J", "B.Y.Q", "B4U", "BA", "Babu", "BABY", "BABY BEAR", "BAIHE FU SHI", "BAILI", "BAISE BEAUTY", "BAISHENG", "BAIYI BAISHUM", "BAJRANG", "BAKLIWAL", "BALBINO", "BALIKA", "BANDHEJ", "Bangkok", "BANGKOK POLICE", "BANGSHIDI", "BAO LE HUA", "BAODU", "BASE-6", "BASIC", "BASIX", "BATMAN", "BB SHOP", "BBDOUBLEO", "Bbtsnh", "BC", "BE DIVINE", "BEAUTIFUL LADY", "BEAUTY", "BEBE", "BEDTIME", "BEE", "BEE BEE", "BEE HONEY", "BEER&OIL", "BEI BEI", "BEIDIFAN", "BELLACITA", "BELT HOUSE", "BELT WORLD", "BEN BEN", "BENAAZ", "BENNEVIS", "BENTO", "BEST", "BESTENY", "BETTER CHOICE", "BETTY", "BEYOND", "BI AN  FASHION", "BIEM", "BIG DOG SHOP", "BIG HOLDER", "BILANXING", "BINDI KAI LONG", "BINSHIGEDIAO", "BIT MORE BEAUTIFUL", "BK COLLECTION", "BLACK DUCK", "BLACK EYES", "BLACK STONE", "BLANK STITCH", "BLAZO", "BLMLB", "BLR", "BLU-ZON", "BLUE BELLA", "BNA", "BO HAO", "BOMEI", "BONFIER", "BONFIRE", "BOOM", "BORA BORA", "BOUBAAYA", "BOXER", "BOY", "BOYD", "BOYUAN", "BRAND", "BROTHER", "BSH DA", "Bt", "BUHOLARK", "BULE & SKY", "BUTEMGO", "BUTTER FLY", "BYKIM", "BYT", "C C", "C E T", "C I MENS BRAND", "C M", "C N C", "C T", "C.F", "C.P", "C.S", "CAI NV", "CAINV", "CAIXUAN", "CALA", "CANDICE", "CANDY", "CAPAL", "CAPEBDRON", "CAPEBPRON", "CAT MINI", "CATCH", "CATCH ME", "CATERNITY", "CATO", "CAZARO", "CELIO", "CENIUS", "CEST BONG", "CH", "CHAMPION", "CHAMUNDA", "CHAO", "CHAOAHC", "CHAOLIU CITY", "CHAORENWANGLUO", "CHAOSWOLF", "CHAOYINSU", "CHAPTERS", "CHEER FUL", "CHEERFULL", "CHEMISTRY", "CHEROKEE", "CHI TA SHOP", "CHIANNA", "CHICOREE", "CHIRAGDIN", "CHKNAK", "CHN", "Chocolate", "CHRRISTY", "CHU FEI FEI", "CHU YI", "CHUN YAN", "CHUNYI", "CI CI", "CIARA", "CITY FOX", "CIYO", "CIZOR", "CK", "CK INGWEL", "CKW", "CLASSIC", "CLASSIC FASHION TRADE", "CLASSIC LEATHER", "CLIX", "CLUB DE", "CNC", "CO2", "COCO", "COCO BUTTER", "COCO TIMES", "COLLARS", "COLLECTIVE HOMME", "COLOR FUL", "Colours", "COMFORT", "Cook", "COOKYS", "COOL BEAUTY", "COPTER", "CORAL", "CP", "CREPE MYPTLE", "CRISTONE", "CSWL", "CT", "CUSTOM", "CUTTING EDGE CLOTHING", "CYG", "CZW", "D BELL", "D E S", "D KREATIVE", "D LIKE", "D URBAN", "D Y", "D&C", "D-LIKI", "D.D. FASHION", "D.MAK", "DAFA", "DAGEGE", "DAIVIYOO", "DAKAIYA", "DALI", "DAN LHONG XIO", "DAN NI", "DANCERBY", "DANDAN", "DANIELLE", "DANMAWENSEN", "DAYANGSHAYU", "DAZO", "Deal", "DEAL JEANS", "DECKED UP", "DEDICATE", "DEEP DRESSES", "DEEZY", "DESIGN", "DESIGN INDIA", "DESS", "DESTINY", "DF", "DHW", "DI", "DI SHI YUAN", "DIA", "DICE", "DIFFUSE", "DIFUNI", "DING DING", "DINOCAIZI", "DIRC BENNY", "DIRCBENNY", "DIRE BE NNY", "DIVINE", "DIVYANK", "Diya", "DJ SHOP", "DLTS", "DNFS", "DOCA", "DOGRI", "DONYSHARK", "DOU DOU NI", "DOUDISI", "DRAGON-FLY", "DRAGONALL", "DRAMA QUEEN", "DRIZZLE", "DSW", "DU DU ROOM", "DUFENG", "DUOCAI", "DUOMI", "DUSHIQIYU", "DZIRE", "E BEAUTY", "E FASHION TREND", "E LIFE", "E T", "E.K FASHION", "EARO", "EAST", "EBONY", "ECLATA", "EDIT", "EE+", "EF", "EIGHT & EIGHT", "EKKRO", "Elfe", "ELLIE", "ENCON", "Energy", "ENIAN", "ENTER", "ES10", "ETHOS", "ETONE", "EURECA", "EUROBELT", "EVE", "EVENE", "EVINMOON", "EXES", "EXTERRITO", "F C", "F F", "F PLAY", "F W", "F Y", "F.L STUDIO", "F.L.S.Z", "F.M", "FAB STYLE", "FAFA", "FAH & FERN", "FAMEN", "FAN MEI NI", "FANG FANG", "FANG FEI", "FANMIXIYA", "FANXI", "FARFETCH", "FASHIN STYLE", "FASHION", "FASHION COLLECTION", "FASHION JEANS", "FASHION PLANET", "FASHION PLUS", "FASHION WEAR", "FDKL SHOW", "FEATHER TOUCH", "FEI PAN FASHION", "FEIFAN-ZU", "FEIYANG", "FENG DA", "FENG GUO FASHION", "FFCXLM HOMME", "FIANMIDUO", "FIAOZI", "FIARJUEL", "FILA", "FIN YUAN", "FINXIN", "FIRE", "FIRE LINE", "FIRE&ICE", "FIRKEE", "FISHEYE", "FIVE BERRY", "FLAGS", "FLAMINGO", "FLAUNT", "FLAVOUR", "FLAY 69", "FLICKER HOODS", "FLJ", "FLORIDA COAST", "FLSZ", "Fly", "FLY 69", "FLYING MACHINE", "FLYRS CLUB", "FM", "FM JEANS", "FNS", "FOCUS", "FOCUS-18", "FOIL", "FORCE", "FQKY", "FREE STYLE", "FRENCH CONNECTION", "FRENCH CUFF", "FRESH SPORTS", "FU SEN SCARF", "FULI", "FULIMEI CLOTHING", "FUPAI", "G D", "G H", "G J", "G M H", "G.C", "G.M", "GABON", "GALAXY", "GAOAIQI CERTIFICATIO", "GAOLI", "GARACIA", "GARAGE", "GAZOZ", "GAZZAL", "GB", "GEDI", "GEDIAO", "Gelato", "Geloto", "GENERATION NEXT", "GENIUS", "GENTLE", "GENUINE LEATHER", "GEZI", "GF", "GH", "GIBGAE", "GIFFT", "GILMORE OAK", "GIRAFFE", "GLACIER", "GLC", "GLOSSER GOLD", "GLOSSY GIRLS", "GO BIRDY", "GOLD MOR", "GOLD PARKO", "GOLDEN BIRD", "GONG", "GOOD LUCK", "GOOL DAIL", "GORDON", "GOTIT", "GOURIWALA", "GRACE", "GRASS", "GRAVITY", "GRC", "GREAT", "Grh", "GRISHMA", "GS", "GS-78", "GU YIJIA", "GUAIGUAI CLOTHING", "GUANG YI LIAN", "GUANHUAZE", "GUCAINI", "GUMAN", "GUO NIN", "GUO XIN JIA", "GURLZ", "GUSTO", "GZ.POCO", "H & D", "H & L", "H . Q", "H A", "H C", "H F", "H F S", "H H", "H TRIENITY", "H-TRIEVITY", "H-Z.WAHG", "H.C", "H.C KAIXING", "H.F.E", "H.W.W", "H.X.Q", "H.Y.N", "H2", "H2O", "HAIPAI", "HAN FEIER CLOTHING", "HAN HAN", "HAN MI FASHION", "HANA", "HANDLOOM VILLAGE", "HANMAI", "HANNIAO", "HAO DI LONG", "HAO JIN FUSHI", "HAOGUNLAI", "HAOYI", "HAPPY TEE", "HARDSOOA", "HARDY BOYS", "HARI OM", "HB", "HC", "HCRAYBLI", "HE JIA HUAN", "HE YING YOU KOU", "HEAD QUARTER", "HEAM SEAN", "HEBIT KIDS", "HECKTOR", "HEIXUANZI", "HENG HENG", "HENG NI JIA", "HENG TONG", "HENGCHANG", "HENRY S COTTON", "HERMAIN", "HEYI", "HING", "HJ 388", "HJB", "HK", "HKC", "HME", "HMR", "HO", "HOLLOWAY RD", "HOLLY WOOD", "Holy Fashion", "HOMME", "HON ZE SHIJIA", "HONG JIA", "HONG YAN FASHION", "HONJIE BUDOY", "HOT BASIC", "HOT ROCK", "HOT SPORTS", "HQIVQVTVG", "HS", "HSJR", "HT", "HUAQIANG", "HUAXUAN", "HUAYIFENG", "HUDA", "HUDU", "HUNAR", "HUNK", "HUNKH", "HUNTER STORY", "HYBIRD", "HYG", "HYS", "HZ", "I B", "I-VOG", "I.S.E", "I.T", "ICE MAN", "ICEMAN", "ID UOYS", "IFLO", "IJC", "IKKON", "IM", "IMAGE", "IMELDA", "IMP", "IN-THING", "INDIAN", "INDIAN BELT", "INDIAN ETHNIC", "ING ING", "ING-ING", "INSK", "INTHING", "INVICTUS", "IRON", "IT", "ITALIAN BOY", "J B", "J L WANG", "J M F", "J STUDIO", "J T", "J Y", "J&K WEAR", "J&T", "J.A", "J.D.M", "J.H.FASHION", "J.J", "J.S.R", "J.Z", "JA", "JABARI", "JACK DADDY", "JACKALBERRY", "JACKELBERRY", "JACKWINS", "Jai", "JAI AMBE", "JAI DURGA", "JALARAM", "JAMIE", "JAYALAKSHMI", "JB", "JC", "JEA", "JEANIOUS", "JEED JAD", "JHM", "JI LUO YI", "JIA JIA", "JIA JIA XING", "JIA YU MEI FASHION", "JIABAINA", "JIALI", "JIAMEI", "JIANMIDUO", "JIANOU", "JIAO MEI ZI", "JIAWMO", "JIMMY JORDAN", "JIN BIAO", "JIN DA", "JIN XIN", "JIN XIN FUSHI", "JINBAOLANGREN", "JINBEIER", "JINDOMI +", "JING", "JINMAO", "JINSE KUAICHE", "JINWEITE", "JINYANZI", "JINZBAO", "JINZIBAO", "JISAAN", "JIUDAIJIL", "JIUDIYING", "JIULI HI ZUN", "JIVI TRENDZ", "JJA", "JK2", "JL", "JMYB", "JNV", "JOCKEY", "JOHN MARATTO", "JOHN PHILIPS", "JOLLY", "JOY", "JOY N JOLLY", "JOY-N-JOLLY", "JP", "JPT", "JR.CRYSTAL", "JSA", "JT", "JUN", "JUNYA", "JV", "JYZ", "K & N", "K C", "K K", "K KAMELI", "K N", "K Y", "K.W.Y", "KA", "KABANGYI", "KAI WEN YAN", "KAIBOFU-S", "KAIWENYAN", "KAIZHELUN", "KALE WENSES", "KALISI", "KALPANA", "KAMEEZ", "KANGAROO", "KAQISHENG", "KARISHMA", "KARMA", "KARUNAJA", "KASHISH", "KATIE SETH", "KATIESETH", "KAVIS", "KAZUMI", "KB&YD", "KC", "KDO", "KE YUN", "KEREBU", "KESHAR", "KEVIN FORD", "KEZHIYUN", "KIAN NI", "KID CLASSIC", "KIDS CLASSI", "KILL WILL", "King", "KING MAKER", "KINMIN", "KITES", "KITTENS", "KIVENSL", "KIVENST", "KIWI GIRL", "KJNLAJ", "KLL", "KN", "KNK", "KNOT OUT", "KODE", "KOHINOOR", "KOKKIRI", "KONGBELIGE", "KOSZAK", "KOTHARI", "KOZZMAN", "KP", "KRISH", "KRISHI", "KS", "KT", "KUNYU", "KYK", "L & H", "L W", "L Y J", "L&L FASHION", "L.K.Y.K", "L.LADY", "L.O.X.G", "L.W", "L.Z.CHENG", "LA MADE CHI", "LA SANNA", "LADY LOOK", "LADY STYLE", "LAFER", "LAI LA", "LAIMA", "LAMBORGHINI", "LAN DUO ER", "LAN FEI", "LANGZICHENG", "LANHINU", "LANXIN", "LAPINK", "LARCOS", "LASPA", "LAXMI", "LAZARTIGUE", "LB", "LBR", "LC", "LE LE CLOTHING", "LEAF STAR", "LEE", "LEEZA", "LELE", "LEMON MINT", "LEMONMINT", "LEONS", "LESS CHEN", "Letest jeans", "LEVIS", "Levis Signature", "LEZZON", "LF", "LFTMAN", "LHTX", "LI +", "LI HUA", "LI LY", "LI PENG CLOTHING", "LI SHA BEI ER", "LIAN MEI TE", "LIANG YONG", "LIANGCAIFUSHI", "LIANGDIAN", "LIANGLI", "LIANGYING", "LIANHONG", "LIANXING", "LIFE", "LIFE STYLE", "LIFE-4", "Lifestyle", "LILI FASHION", "LINDA", "LINDA FASHION", "LIP", "LIPENG", "LIRENXUAN", "LIRER", "LISA WANG", "LISHA", "LITTLE CHICK", "LITTLE WOOD", "LIVA", "LIVAASA", "LIXING", "LIXMON OUTFITS", "LIYA", "LIYIFUSHI", "LIZZY LAZZY", "LIZZYLAZZY", "LNVX S", "LOGG", "LOGUS", "LOLI EVA", "LOLLIPOPZ", "LONG FEI", "LONG KAISHE", "LONG KAIYIKUN", "LONG LONG", "LONG LONG FUSHI", "LONG TIME", "LONGLIJIE", "LOPES", "LOTUS", "LOUIS LONDON", "LOUIS VENTO", "LOVE ANGELUS", "LOVE KIDS", "LOVE-U", "LR", "LTH", "LTX", "LUCKY", "LUCKY CHARM", "LUCKY GIRLS", "LUCY", "LULU", "LUNGKAISE", "LUOSHAGE", "LW", "LX", "LXJ", "LY", "LYNN FASHION", "LZALONG", "M +", "M B", "M G", "M H", "M R FASHION", "M Y J", "M Y X", "M&M", "M.C", "M.F", "M.M.K", "M.MODERN", "M.X.Y", "M.Y", "M.Y STUDIO", "MAAND", "MACRO LIGHT", "MAD STONE", "MAD-O-WAT", "MADSOUL", "MADU", "MAGIC S", "MAHA RANI", "MAHAVIR", "MAHEK", "MAHER", "MAHIMI", "MAITRI", "MALIANNA", "MALIANNI", "MALIDUO", "MAMTA", "MAN MAN", "MANAN", "MANANA", "Manish", "MANYEGI", "MAR MARA", "MARAVILLOSA", "MARFEEL", "MARIA MODA", "MARINA", "MARRIMO DUTTI", "MARTINWADU", "MARVELCOMICS", "MARY", "MASHIDU", "MASHIMENTU", "MATHUDI", "MAX ZONE", "MAXTEEN", "MAY BE", "MAY MAY", "MAY QUEEN", "MAYAM", "Mc", "MCM", "MD", "ME BILLA", "ME-WOW", "MECHANIC", "MEGGIE", "MEHATVA", "MEI MEI & BEST", "MEI NIN YA", "MEIDENIAD", "MEILING", "MEN VOGUE", "MENS FASHION", "MESSI TEES", "MF", "MG", "MH", "MI BO", "MI DUODUO", "MIANZHI", "MIHIKA", "MILD", "MILEY", "MILI+", "MILINNA", "MIMI", "MINA", "MINELLI", "MINI", "MIRROR", "MIRZA MNG", "MISHA", "MISHTI", "MISS", "MISS 20", "MISS ANGELA", "MISS CHOOSY", "MISS DENG", "MISS DONG", "MISS LIN", "MISS YAN", "MISSONI PERLA", "MIX", "MJ", "MK", "MKF", "MKT", "MKWL", "MLXKONG", "MM", "Mn", "MO MAY SHOP", "MODFIT", "MOLTIDA", "MOMAY", "MOMENTS", "MOMO", "MONIKA", "MONTIRA", "MORNI", "MOSSATO", "MOUNTAIN COLOURS", "MOVE ON", "MOX", "MOZAC", "MQXY", "MR", "MR FASHION", "MR.MARKE", "MR.S", "MRF", "MSS", "Mt", "MUDIS", "MUKIGO", "MUSSO", "MUST HAVE", "MUXI", "MY GIRL", "MYR", "MYRA", "MYSHA", "N-TIQUE", "NAJIB", "NALJREN", "NANCY", "NANRENHUI", "NANWAN", "NAPOLEON", "NAPOLIEN", "NARA", "NARINPORN", "NATAYA SHOP", "NATHJI", "NATION WIDE", "NATSINEE", "NATURAL", "NAUGHTY TIM", "NAV-JEEWAN", "NBJ", "NEEL & NIKKI", "NEELUFER", "NEGAMBO", "NELLA MODA", "NEPOLIAN", "NEPTUNE", "NEU", "NEW ANN", "NEW LIGHT", "Newport", "NEXT LOMANI", "NEXX", "NICE LOOK", "NICHOLAS", "NICOLE BELLA", "Nike", "NIMISH", "NINE", "NINETY NINE SHOP", "NINIJIA", "NIU NIU", "NK", "No Error", "NONG PAN SHOP", "NOOSITO", "NORTH BAY", "NOSTRUM", "NOTCH", "NP2", "NPC", "NRY", "NT", "NUMB", "Numero uno", "NUOWEIDIKE", "NURENHUA", "O &D", "O B", "O Kids", "O N", "O.L.YANYI", "OBEDIENCE", "ODDI", "OISHENGHU", "OKS BOYS", "OL", "OLIVOS", "OM", "OM NAMAH", "OM NAMO", "ON", "ONA", "ONE MINUTE", "ONE PERCENT", "ONE STAR", "ONEPLUSSIX", "Onil", "ONLY BASIC", "ONOKI", "OOR CHIN SHOP", "OORJAA", "ORCHID", "ORGANIC", "ORIGINAL", "ORSON", "OSHANNI", "OTAYA", "OU SHI YA", "OU YANG FOREIGN", "OUDIER", "OULIHAN", "OUMANKALI", "OUTDOOR", "OUZHOUZHAN", "OWES", "OXFORD", "OYO", "OZZY", "P & R", "P & S", "P&R", "P.C", "P.T", "PACIFIC", "PAGE", "PALLAVI", "PALLY FASHION", "PANTO PLUS", "PANTOLOGY", "PARI", "PARISSTYLE", "PARITA", "PARSHWA", "PAULCAPTAIN", "Pause", "PAXTON", "PAXTONE", "PE", "PEACOT", "PELICAN", "PENCIL", "PEPPERMINT", "PERFECT", "PERRY CLOTHING", "PF", "PG", "PHANKARAT", "PHAT", "PHILIPP PLEIN", "PIANO", "PIANO KIDS", "PICASSO", "PINK & VIOLET", "PINK BABY", "PINK FRILL", "PINK PANDA", "PINK WHITE", "PIPE", "PIPE APPLE", "PIT CHA", "PLEASURE", "PLUS WING", "POCO", "POE", "POOJA", "POPSIE", "Popton", "POSHAK", "POWERFUL", "PR", "PRANAY", "PREM", "PRESIDENT", "PRETTY KITTY", "PRIDE FASHION", "PRIN STORY", "PRINCIPAL", "PRO EFFECT", "PRORIDERS", "PROUD BY UP", "PT", "PUMA", "PUNJABI", "PURE CLASS", "PURE PINK", "PWC", "Q . Q", "Q.S.Y.R", "QE FRY 07", "QEE PEE", "QEE-PEE", "QF", "QIA HUANG", "QIAN & SE", "QIAN QIAN", "QIANWU", "QIANYANA", "QIAO AN SI", "QIAO JIAREN", "QIETAIZI", "QIFA", "QINGCHUAN CLOTHING", "QINGYANG CLOTHING", "QINGZHIYOU", "QIQI", "QISHANG", "QSHUFS", "QSL", "QUANJIE CLOTHING", "QUANTAM SPACE", "QUEEN", "QUICK FIRE", "QUTEE", "QYG", "QYR", "R CREATION", "R FOREST", "R K", "R M", "R N", "R- GO", "R.J.F", "R.K STUDIO", "R.R", "R.STUDIO", "R2", "RA", "RAGE", "RAJ", "Raj Apperals", "RAJKANYA", "RAJPUTANA", "RAJSHREE", "RAMNESH", "RAMP", "RANG", "RANGER", "RAW GEAR", "RAW SKIN", "RAZA TEXTILES", "RBK", "RC", "RD", "RECAP", "RED CHANNEL", "RED ME", "RED PEPPER", "REDNEX", "REEBOK", "REELS", "REGARDS", "REMIX", "RENUAR", "REPEAT", "REPUTATION", "RETTRO", "REUT", "REX", "Rey", "RF", "RHYTHEM", "RHYTHM", "RICH BOND", "RIG ANTHONY", "RING SPUN", "RITA STYLE", "RIVER ISLAND", "RIYA", "RIZZI", "RK", "RL", "RM", "RNM", "ROAMING KIDS", "ROBERTPHILLPE", "ROCK BOY", "ROCK CONCEPT", "ROMON", "RORIC FAY", "ROSSH", "ROSY BOW", "ROY TRADING", "ROYAL", "RRS", "RSG", "RU TING", "RUDRA", "RUNDOWN", "RUPZ", "RY", "RYKER", "RZOO", "S & Q", "S B", "S J F", "S L", "S P LATTY", "S P NX", "S S V", "S Y F", "S&G", "S&Q", "S.D FEIXNG", "S.D.Q", "S.O", "S.U", "S4U", "SAI", "SAI KRIPA", "SAIDEEP", "SAIMA", "SAINTS CREW", "SAKARA", "SALICE", "SASA", "SASSAS", "SAVIOUR BELTS", "SAWARIYA", "SB", "SB LONG", "SC", "SCOTT", "SEEME", "SELFIE", "SENSO", "SERA", "SEVEN & NINE", "SF", "SFS", "SFT", "SG", "sgf", "SGJ-41", "SH", "SHANYIJIU", "SHE TOUCH", "SHEETAL", "SHENG AI FASHION", "SHENG YI", "SHENGDANFOX CLOTHING", "SHENGNIFU", "SHI", "SHI JI HONG", "SHI MAN FU SHI", "SHI XIAO SHI", "SHING", "SHISHANGYISHE", "SHIVALI", "SHOW OFF", "SHOW YIKU", "SHOWOFF", "SHOWOFFFF", "SHREE GANESH", "SHREE KRISHNA", "SHREE LAXMI", "SHREE NARAYAN", "SHREE NATHJI", "SHRUTI", "SHUJINA", "SHUNHUA CLOTHING", "SHXIANGAO", "SI", "SIGNATURE", "SIITE", "SIJIFENG", "SILVER", "SIMPLE", "SIMPLY COUTARE", "SINALI", "SINGER", "SINGLE PRODUCT", "SIQI", "SIRJIA", "SISIJIA", "SISSY", "SISTER", "SISTER BABY", "SIX & SIX", "SIZZER", "SJC", "SJT", "SKC", "SKINI", "SKY", "SKY & LOVE BIRD", "SKY LEATHER", "SKYLER", "SL", "SLACK", "SLSH", "SLUSH", "SMILE", "SMILEY", "SMOKER", "SNOWDI FOX", "So", "SOFT GREY", "SOFTGEAR", "SOLAR", "SOLUS PLUS", "SOM S", "SOMS", "SONIC JERE", "SPARK", "SPEEDWAY", "SPICE", "SPILO", "SPOILT", "SPORT", "SPORTS LEISURE", "SPORTS WEAR", "SPOTINK", "SPUNK", "SPYKAR", "Spyker", "SRC", "SREGAL", "SRI GOVIND", "SRI SHIVAM", "SSS", "ST", "ST.ST", "STAR", "Star Polo", "STATUS", "STEP-IN", "STONE", "STRAWBERRY", "STREET GUYS", "STRIKE S", "STRUCTURE", "STRUCTURE N CARGO", "STRUGG", "STUDIO", "STUONER", "STURD", "STYLE", "STYLE BITES", "STYLE BY SHEZ", "STYLE INDIA", "STYLEE", "SUBA", "SUGAR CANE", "SUGAR GIRL", "SUMMER", "SUNDAY HOLIDAY", "SUNIL", "SUNKEY", "SUNNY GIRL", "SUPER DP", "SUPER DUPERS", "SUPER MAN", "SUPERMAN", "SURBHI SWATI", "SURE", "SURPRISE", "SURVIVORS", "SWAN", "SWAYAM", "SWEET", "SWEET MALIA", "SWEET&SALTY", "SWISS GIRL", "SYCLONE", "SYED WASEEM", "SYKP", "SZTORI", "T D I", "T T", "T U", "T-BEN", "T.F", "T.Z", "TAANI", "TABASSUM", "TADPOLE", "TALENT", "TANGKWA", "TANISHQ", "TC", "TDI", "Teen Club", "TEJASVEE", "TEN DESIGN", "TEN-18", "TENGE CLOTHING", "TGJ", "THANKS", "THE ADJECTIVE", "THE HIJAB", "THEORY", "THOM BROWNE", "THX GIVIVG", "TIE & DIE", "TIENDIE", "TIFFETTO", "TINA", "TING", "TINY BABY", "TINY THREADS", "TINYBABY", "TIRTH", "TIRUPATI", "TIWNS", "TMU", "TO YOU", "TOFFEE", "TOMORROW-2", "TOP DOT", "TOP ONE", "TOP SHOP", "TOP SPEED RUI", "TORBO", "TORIO", "TOUCH", "TREEP", "TRENDY", "TRENDY CULTURE", "TSI", "TU LAI JIA", "TUBENHOMME", "TUFFY", "TULSI", "TUSHIDI", "TWIAQ", "TWING", "TWINKLE", "U & M", "U LIKER", "U.ME", "U.S.C", "UCB", "UFC", "UJALA", "UNI KON", "UNICLO CLASSIC", "UNIKON", "UNION JACK", "UNIQ", "UNIQUE", "UNITED", "URBAN", "URBAN FRANK", "URBAN FRIENDS", "URBAN FUTURE", "URBAN OUTFITTERS", "URBAN TECH", "URBAN XTREME", "URBANO", "US WELL", "USC", "USHKAR S O", "UVAAM", "V Dot", "V N", "V-DOT", "V.B", "V2", "VA", "VALEN SHOP", "Van Heusen", "VANHEUSEN", "VANICH", "VANNSY", "VANSHH", "VEERA", "VEETEX", "VENUS BELT", "VESTMENT", "VESTRY", "VETEEX", "VETWERVE", "VH", "VIBES", "VICKY", "VICTORIA FASHION", "VIETARIA", "VIGARE", "VISCOSE", "Vitamins", "VOGUE DESIGN", "VOGUEAL ONE", "VOLLINS", "VOXER", "VP", "VRANDA", "VV +", "VY", "W J", "W&J", "W.D.C", "W.L.H", "WACKO", "WANG WANG", "WANLDA", "WARHORSE", "WAX MAX", "WEED", "WEEK ENDER", "WEEKENAER", "WEEKENDER", "WEI WEI JIA", "WEIDUOCHENG", "WEIHUI", "WEIYA", "WEIYAN", "WELCOME", "WELIKE FASHION", "WEN XUAN", "WESTER BASIC", "WESTERN BASIC S", "White Touch", "WITH", "WOLAIER", "WOOD TEE", "WOODS", "WOOLY", "WORLDIHAND", "Wrangler", "WSFS", "WVEBL", "X-VERSION", "X.C CHANG", "X.Y.J", "XI BEIBEI", "XIANG DA", "XIANG XIANG", "XIANXINGLU", "XIAO LA JIAO", "XIAO MEI JIA", "XIAO XIA", "XIAO XIAO", "XIAO YA", "XIAO.MONU", "XIAOFANGJIA", "XIAOMIJIA", "XIAOYUE CLOTHING", "XIN DE LE", "XIN HUI FASHION", "XIN LIANG FASHION", "XIN MEI FUSHI", "XIN MIAO FASHION", "XIN NAI", "XIN RONG", "XIN XIN", "XIN YO", "XIN ZI", "XIN-YE", "XINDI ND", "XING WONG", "XING YU", "XING YUN CAO", "XINGLONG", "XINHUDIE", "XINJIAOSE", "XINLUCHENG", "XINQI", "XINRUI", "XINYA", "XINYI", "XIU XIU FU SHI", "XIXI", "XIXI CLOTHING", "XIXI.JIA", "XK", "XNNCAA", "XPLORE", "XS", "XU XIN LONG", "XUAN XUAN", "XUE LI JIA", "XYZ", "Y B", "Y C", "Y G", "Y Y SHOP", "Y.F", "Y.H.C", "Y.L", "Y.L.Y", "Y.M", "Y.Y FASHION", "Y.Y.X", "Y.Z", "Y.Z.L", "YA CHUN", "YA JUN", "YA SHA LAN KOU", "YA YOU LU", "YAANNA", "YADIANNA", "YADIE", "YADUSHI", "YAJIA", "YALI CLOTHING", "YAN YAN", "YAN YU", "YANG GUANG", "YANG KAI DI FASHION", "YANG YANG HONG", "YANG YANGHONG", "YANG YUAN FASHION", "YANGIFUSHI", "YANWEI", "YANZIQIAOLI", "YAO YAO", "YAO YU", "YASHIWEI", "YBR", "YE", "Yellow", "YELLOW DUCK", "YELLOW KIDS", "YELO", "YEZI", "YI BA LANG", "YI BEI QI", "YI DI ER", "YI FU FASHION", "YI LAI NI DRESS", "YI LI FA", "YI LI LI", "YI LU YUAN", "YI MEI QI", "YI NUO", "YI TONG", "YI XI", "YI XIU", "YI YA", "YI YAN", "YI&JIA", "YI-G FANG", "YIBAISHUN", "YIBALANG", "YIBEIER", "YIDIER", "YIFAN", "YIJIAMI", "YIKEDA", "YIKEMEI", "YILULAI", "YIMEI", "YINGFENG", "YINMAO", "YIPINXUAN CLOTHING", "YIXIN", "YIXUAN", "YIYAN", "YIYUAN", "YIZICAI", "YIZIHUI", "YM", "YMG", "YO YO", "YOU GIRL", "YOU MEI FU SHI", "YOU TOO ME TOO", "YOU YI CHUAN", "YOU YIMEI FASHION", "YOU YOU", "YOUMI", "YOUNG", "YOUNG BEAUTIFUL", "YPCT", "YU", "YU JIAN FASHION", "YU YUAN", "YUAN SHENG", "YUAN YUAN", "YUDAN", "YUE YUE", "YUN SE ER FASHION", "YUQING CLOTHING", "YUXIYU", "YUXUAN", "YUYU.S", "YUZU FAMILY", "YY", "YY.A", "YYW", "Z PLUS", "Z.H FASHION", "Z.L", "Z.M.D", "zappi", "ZAR", "ZAYDME", "ZBRAND", "ZCFR", "ZED", "ZELENIUM", "ZENANA OUTFITTERS", "ZERO", "ZESTLINE", "ZHE CHENG", "ZHEXIBEIER", "ZHUA MEI", "ZHUO YUE FASHION", "ZI MEI LIANG", "ZI NAN CLOTHING", "ZILIYAT", "ZILU OLAN", "ZINC", "ZIP FLY", "ZIQIN", "ZIYAN CLOTHING", "ZKFS", "ZONE BLUE", "ZRF", "Zurii", "ZX", "ZY", "ZZCY", "ZZFS"], "fabric": ["4 WAY LYCRA", "ACRYLIC", "ART SILK", "BANARAS NON SILK", "CANVAS", "CHIFFON", "CHINOS", "CORDUROY", "COTS WOOL", "COTTON", "COTTON BLEND", "CREPE BLEND", "CRUSH", "DENIM", "DOBBY", "DRYFIT", "FLAT KNIT", "GEORGETTE", "HANDLOOM", "HOSIERY", "IMP", "INDIGO", "JACQUARD", "JERSEY", "JUTE", "KNIT", "KOREAN FAB", "LACE", "LEATHER", "LENIN", "LINEN", "LOOP NET", "LYCRA", "MATTY", "METAL", "MICRO", "NET", "NON LEATHER", "OXFORD", "PAPER", "PARACHUTE", "PINPOINT OXFORD", "PINUT", "POLYESTER", "POPCORN", "POWER NET", "RAW SILK", "RAYON", "ROUND NECK", "SATIN", "SCUBA", "SILK", "SIMAR", "SWEADE", "SWEADE LEATHER", "SYNTHETIC", "T R", "TEFLON", "Terri wool", "TWILL", "V-NECK", "VELVET", "VISCOSE RAYON", "WAFFLE", "WOOLEN", "WOVEN", "WRINKLE FREE"], "fabDesign": ["ABSTRACT", "BATICK", "CAMOUFLAGE", "CHECKS", "FLORAL", "MIX", "PATTA", "PLAIN", "POLKA", "PRINTED", "STRIPES", "TUXEDO"], "sleeve": ["3/4th SLEEVES", "BELL SLEEVES", "CAP SLEEVES", "CAPS SLEEVES", "COLD SHOULDER", "DOWN SHOULDER", "FULL SLEEVES", "HALF SLEEVES", "SLEEVE LESS", "SLEEVELESS"], "neck": ["BOAT NECK", "CHINESE COLLAR", "COLD SHOULDER", "COLLAR", "COWL NECK", "CROSS CUT", "CUT NECK", "DB COLLER", "DOUBLE COLLAR", "FULL BUTTON", "FULL ZIP", "HALF ZIP", "HIGH NECK", "HOODED", "KURTA NECK", "OFF SHOULDER", "ONE SHOULDER", "POLO NECK", "RACER BACK", "RESORT COLLAR", "ROUND NECK", "SB COLLER", "SINGLE BUTTON", "SMALL COLLAR", "TUXEDO", "V Neck"], "length": ["3/4 TH LENGTH", "ANKLE LENGTH", "HIGH WAIST", "LONG LENGTH", "MID WAIST", "MINI LENGTH", "REGULAR LENGTH", "SHORT LENGTH"], "sets": ["2 PCS", "3PCS", "4PCS", "5PCS"], "size": ["0", "1", "1 INC", "1.25 INC", "1.5 INC", "1.75 INC", "10", "10XL", "11", "12", "13", "14", "16", "18", "2", "20", "22", "24", "25", "25MM", "26", "28", "29", "2XL", "3", "30", "31", "32", "34", "35MM", "36", "38", "39", "3XL", "4", "40", "40MM", "42", "44", "46", "48", "4XL", "5", "50", "52", "54", "5XL", "6", "60", "65", "6XL", "7", "70", "7XL", "8", "8XL", "9", "9XL", "FREE", "FS", "L", "M", "M/L", "S", "XL", "XS", "XXL"], "color": ["AIRFORCE", "ALMOND", "ANTIQUE", "AQUA", "AQUA BLUE", "AQUA GREEN", "ARMY", "ARMY GREEN", "ASH GREY", "AZURE", "Beige", "Black", "BLACK BLUE", "BLACK WHITE", "BLACK YELLOW BLACK", "BLACK/NAVY", "Blue", "BLUE BROWN", "BLUE GREEN", "BLUE WHITE", "BLUE/BLACK", "BLUEISH MAROON", "BOTTLE GREEN", "Brown", "Burgandi", "BURGUNDY", "CADBURY", "CAMEL", "CAMOUFLAGE", "CARBON", "CARBON BLUE", "CARROT", "CEMENT", "CHARCOAL", "CHERRY", "CHIKU", "CHOCO", "CHOCOLATE", "Coffee", "COFFEE BROWN", "COMBO-3", "COPPER", "CORAL", "Cream", "CROSS GOLDEN", "CYAN", "DARK BEIGE", "DARK BLACK", "Dark Blue", "DARK BROWN", "DARK CREAM", "DARK FIROZI", "DARK GOLD", "DARK GREEN", "DARK GREY", "DARK KHAKI", "DARK MAROON", "DARK NAVY", "DARK ORANGE", "DARK PINK", "DARK PURPLE", "DARK RED", "DARK RUST/ BROWN", "DARK YELLOW", "DENIM", "DENIM BLUE", "FANCY BLUE", "FAWN", "FIROZI", "FOAN", "GAJARI", "GOLD", "GOLD 1", "GOLD 3", "GOLD MAROON", "GOLD NAVY", "GOLDEN", "Green", "GREEN BLACK", "GREEN/WHITE", "Grey", "GREY ORANGE", "ICE BLUE", "INDIGO BLUE", "INK BLUE", "IRON", "IVORY", "JAMUNI PURPLE", "Khaki", "LAVA", "LAVENDER", "LEAD", "LEMON", "LIGHT BEIGE", "LIGHT BLACK", "Light Blue", "Light Brown", "LIGHT COFFEE", "LIGHT CREAM", "LIGHT GOLD", "LIGHT GRAY", "Light Green", "Light Grey", "LIGHT KHAKI", "LIGHT MAROON", "LIGHT NAVY", "LIGHT OLIVE", "LIGHT ORANGE", "LIGHT PEACH", "LIGHT PINK", "LIGHT PISTA", "LIGHT PURPLE", "LIGHT RED", "LIGHT VOILET", "LIGHT YELLOW", "MAGENTA", "MAROON", "MEDIUM GREEN", "MEDIUM PURPLE", "MEHANDI", "MEHROON", "MELANGE  BLUE", "MELANGE BLACK", "MELANGE BROWN", "MELANGE GREY", "MELANGE PINK", "MINT", "MIX", "MULTI", "MUSTARD", "NATURAL", "NAVY", "Navy Blue", "NAVY DOT", "NAVY GREEN", "NAVY/GREY", "NAVY/RED", "NAVY/WHITE", "NAVYA", "OFF WHITE", "OLIVE", "OLIVE GREEN", "ORANGE", "ORANGUISH RUST", "PARROT GREEN", "PEACH", "PEACOCK", "PEACOCK BLUE", "PHON", "PINK", "PISTA", "PISTA GREEN", "PISTACHIO", "PRUSSIAN", "purple", "RAINBOW", "RAMA BLUE", "RAMA GREEN", "RANI", "Raw", "Red", "RED BLACK", "RED DOT", "RED MAROON", "REDISH MAROOON", "REVEL", "ROCK GREY", "ROYAL BLUE", "ROYAL BLUE 2", "RUST", "SAGE", "SAND", "SAPPHIRE BLUE", "SEA GREEN", "SHADOW", "SILKY", "Silver", "SKIN", "SKY BLUE", "STEEL BLUE", "STEEL GREY", "STONE", "STONE BLUE", "TAN", "TEAL", "TOMATO", "TROPICAL TAN", "TURKISH", "TURQUOISE", "TURQUOISE/BLUE", "URBAN GREY", "Violet", "White", "WHITE BLACK", "WHITE DOT", "WHITE/GREEN", "WHITE/NAVY", "WINE-PURPLE", "WINTER BLUE", "WOOD", "YALE BLUE", "Yellow"], "subItem": ["BALLET", "CAPE", "CAPRI", "CARDIGAN", "COWL", "CROP", "DUPPATA", "KAFTAN", "NAWABI", "OVERSIZE FIT", "PALAZZO", "PATIALASET", "PONCHO", "REGULAR FIT", "SHRUG", "SKIRT", "SLIM FIT", "SPEGHETTI", "TRENCH COAT", "TUBE", "TUNIC"]};

  function populateDropdowns(){
    Object.keys(SHEET_OPTIONS).forEach(fieldId => {
      const select = $(fieldId);
      if(!select) return;
      const frag = document.createDocumentFragment();
      SHEET_OPTIONS[fieldId].forEach(value => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = value;
        frag.appendChild(opt);
      });
      select.appendChild(frag);
    });
  }
  populateDropdowns();

  // default dates = today
  const today = new Date().toISOString().split('T')[0];
  $('reqDate').value = today;

  let rows = [];
  let counter = 0;
  // Maps a row's id to the (lightly capped) photo Blob for that row.
  // The backend's sharp pass compresses this further before it reaches Google Sheets.
  const rowPhotoFiles = new Map();

  // Safety cap only - keeps uploads well under a hosting platform's request
  // size limit before the backend's sharp pass does the real compression.
  const CAP_MAX_DIM = 1600;
  const CAP_QUALITY = 0.85;

  function capPhotoSize(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read the selected file.'));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Could not load the selected image.'));
        img.onload = () => {
          let { width, height } = img;
          if(width <= CAP_MAX_DIM && height <= CAP_MAX_DIM){
            resolve(file); // already small enough, skip re-encoding
            return;
          }
          if(width > height){ height = Math.round(height * CAP_MAX_DIM / width); width = CAP_MAX_DIM; }
          else { width = Math.round(width * CAP_MAX_DIM / height); height = CAP_MAX_DIM; }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('Could not encode the resized image.')),
            'image/jpeg',
            CAP_QUALITY
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const toggleMore = $('toggleMore');
  const morePanel = $('morePanel');
  toggleMore.addEventListener('click', () => {
    const showing = morePanel.style.display !== 'none';
    morePanel.style.display = showing ? 'none' : 'block';
    toggleMore.textContent = showing ? 'More Filters...' : 'Hide...';
  });

  function val(id){ return $(id).value.trim(); }
  function disp(v){ return v ? v : '-'; }

  function renderTable(){
    const body = $('reqTableBody');
    body.innerHTML = '';

    if(rows.length === 0){
      body.innerHTML = '<tr class="empty-row"><td colspan="21">No requirement rows added yet. Fill the filters above and click "Add" to add a row.</td></tr>';
    } else {
      rows.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${idx+1}</td>
          <td>${disp(r.branch)}</td>
          <td>${disp(r.department)}</td>
          <td>${disp(r.items)}</td>
          <td>${disp(r.category)}</td>
          <td>${disp(r.fit)}</td>
          <td>${disp(r.subItem)}</td>
          <td>${disp(r.subBrand)}</td>
          <td>${disp(r.color)}</td>
          <td>${disp(r.size)}</td>
          <td>${disp(r.fabric)}</td>
          <td>${disp(r.fabDesign)}</td>
          <td>${disp(r.sleeve)}</td>
          <td>${disp(r.neck)}</td>
          <td>${disp(r.length)}</td>
          <td>${disp(r.sets)}</td>
          <td>${disp(r.date)}</td>
          <td class="req-highlight">${r.reqQty}</td>
          <td>${disp(r.remarks)}</td>
          <td class="photo-cell">
            ${r.photo ? `<img class="thumb-photo" data-id="${r.id}" src="${r.photo}" alt="counter photo">` : ''}
            <input type="file" class="row-photo-input" data-id="${r.id}" accept="image/*" capture="environment">
          </td>
          <td><button class="del-btn" data-id="${r.id}">Remove</button></td>
        `;
        body.appendChild(tr);
      });
    }

    $('rowCountPill').textContent = 'Rows: ' + rows.length;
    const totalQty = rows.reduce((sum, r) => sum + Number(r.reqQty || 0), 0);
    $('totalQtyPill').textContent = 'Total Qty: ' + totalQty;

    body.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const row = rows.find(r => r.id === id);
        if(row && row.photo) URL.revokeObjectURL(row.photo);
        rowPhotoFiles.delete(id);
        rows = rows.filter(r => r.id !== id);
        renderTable();
      });
    });

    body.querySelectorAll('.thumb-photo').forEach(img => {
      img.addEventListener('click', () => openLightbox(img.src));
    });

    // Picking a file lightly downsizes it in the browser first (a safety
    // cap so uploads never risk hitting a hosting platform's request-size
    // limit), then previews it. The backend's sharp pass does the real,
    // tighter compression right before the photo reaches the sheet.
    body.querySelectorAll('.row-photo-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const id = Number(input.getAttribute('data-id'));
        const row = rows.find(r => r.id === id);
        if(!row) return;

        try {
          const capped = await capPhotoSize(file);
          if(row.photo) URL.revokeObjectURL(row.photo);
          rowPhotoFiles.set(id, capped);
          row.photo = URL.createObjectURL(capped);
          renderTable();
        } catch(err){
          alert('Could not process that photo: ' + err.message);
        }
      });
    });
  }

  function openLightbox(src){
    $('lightboxImg').src = src;
    $('photoLightbox').style.display = 'flex';
  }
  $('lightboxClose').addEventListener('click', () => { $('photoLightbox').style.display = 'none'; });
  $('photoLightbox').addEventListener('click', (e) => {
    if(e.target.id === 'photoLightbox') $('photoLightbox').style.display = 'none';
  });

  $('addBtn').addEventListener('click', () => {
    const branch = val('branch');
    const department = val('department');
    const items = val('items');
    const reqQty = val('reqQty');

    if(!branch || !department || !items){
      alert('Please select Branch, Department and Items before adding a requirement row.');
      return;
    }
    if(!reqQty || Number(reqQty) <= 0){
      alert('Please enter a valid Required Qty.');
      return;
    }

    counter += 1;
    rows.push({
      id: counter,
      branch, department, items,
      category: val('category'),
      fit: val('fit'),
      subItem: val('subItem'),
      subBrand: val('subBrand'),
      color: val('color'),
      size: val('size'),
      fabric: val('fabric'),
      fabDesign: val('fabDesign'),
      sleeve: val('sleeve'),
      neck: val('neck'),
      length: val('length'),
      sets: val('sets'),
      date: val('reqDate'),
      reqQty,
      remarks: val('remarks'),
      photo: null // attach via the Photo column in the table once the row is added
    });

    renderTable();
  });

  $('printBtn').addEventListener('click', () => {
    if(rows.length === 0){
      alert('There is nothing to print yet. Add at least one requirement row first.');
      return;
    }
    window.print();
  });

  $('exportBtn').addEventListener('click', () => {
    if(rows.length === 0){
      alert('There is nothing to export yet. Add at least one requirement row first.');
      return;
    }
    const headers = ['S.No','Branch','Department','Item','Category','Fit','Sub Item','SubBrand','Color','Size','Fabric','Fab Design','Sleeve','Neck','Length','Sets','Date','Req Qty','Remarks','Photo'];
    const lines = [headers.join(',')];
    rows.forEach((r, idx) => {
      const line = [
        idx+1, r.branch, r.department, r.items, r.category, r.fit, r.subItem,
        r.subBrand, r.color, r.size, r.fabric, r.fabDesign, r.sleeve, r.neck,
        r.length, r.sets, r.date, r.reqQty, r.remarks, (r.photo ? 'Attached' : '')
      ].map(v => `"${(v || '').toString().replace(/"/g,'""')}"`).join(',');
      lines.push(line);
    });
    const blob = new Blob([lines.join('\n')], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retail_stock_requirement_' + today + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  $('exitBtn').addEventListener('click', () => {
    if(!confirm('Clear all filters and requirement rows?')) return;
    const branchLocked = $('branch').disabled;
    const lockedBranch = $('branch').value;
    document.querySelectorAll('select').forEach(s => { if(s.id !== 'branch') s.value = ''; });
    $('branch').value = branchLocked ? lockedBranch : ''; // HO's branch pick clears, locked branches stay put
    $('reqQty').value = '';
    $('remarks').value = '';
    $('reqDate').value = today;
    rows.forEach(r => { if(r.photo) URL.revokeObjectURL(r.photo); });
    rowPhotoFiles.clear();
    rows = [];
    renderTable();
  });

  $('saveSheetBtn').addEventListener('click', async () => {
    if(rows.length === 0){
      alert('There is nothing to save yet. Add at least one requirement row first.');
      return;
    }

    const btn = $('saveSheetBtn');
    const originalLabel = btn.textContent;
    btn.disabled = true;

    // Rows are sent ONE AT A TIME (each with at most one photo), not all
    // batched into a single request. This keeps every upload comfortably
    // under a hosting platform's request-size limit, and means a bad row
    // doesn't block the good ones - anything that saves successfully is
    // removed from the list; anything that fails stays for you to retry.
    const total = rows.length;
    let savedCount = 0;
    const failedIds = [];

    for (let i = 0; i < rows.length; i++){
      const r = rows[i];
      btn.textContent = `Saving ${i + 1}/${total}...`;

      try {
        const formData = new FormData();
        formData.append('rows', JSON.stringify([{
          branch: r.branch, department: r.department, items: r.items,
          category: r.category, fit: r.fit, subItem: r.subItem, subBrand: r.subBrand,
          color: r.color, size: r.size, fabric: r.fabric, fabDesign: r.fabDesign,
          sleeve: r.sleeve, neck: r.neck, length: r.length, sets: r.sets,
          date: r.date, reqQty: r.reqQty, remarks: r.remarks
        }]));

        const file = rowPhotoFiles.get(r.id);
        if(file) formData.append('photo_0', file, file.name || 'photo.jpg');

        const res = await fetch(BACKEND_URL, { method: 'POST', body: formData });
        if(!res.ok) throw new Error('Backend responded with status ' + res.status);
        const result = await res.json();

        if(result.status === 'success'){
          savedCount += 1;
        } else {
          failedIds.push(r.id);
          console.error('Row failed:', r, result.message);
        }
      } catch(err){
        failedIds.push(r.id);
        console.error('Row failed:', r, err);
      }
    }

    if(savedCount > 0){
      rows.filter(r => !failedIds.includes(r.id)).forEach(r => { if(r.photo) URL.revokeObjectURL(r.photo); });
      rowPhotoFiles.forEach((file, id) => { if(!failedIds.includes(id)) rowPhotoFiles.delete(id); });
      rows = rows.filter(r => failedIds.includes(r.id));
      renderTable();
    }

    if(failedIds.length === 0){
      alert(`${savedCount} record(s) saved to Google Sheet - added to each branch's tab and to "All Branches".`);
    } else if(savedCount > 0){
      alert(`${savedCount} of ${total} saved. ${failedIds.length} row(s) failed and are still in the list below - check your connection/backend and try again.`);
    } else {
      alert(`Could not save any rows. Make sure the backend is reachable (BACKEND_URL in config.js) and try again.`);
    }

    btn.disabled = false;
    btn.textContent = originalLabel;
  });

  renderTable();
})();

