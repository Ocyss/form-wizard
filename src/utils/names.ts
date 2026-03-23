/**
 * 姓名数据按国家分类
 */

export interface NameData {
  firstNames: Record<string, string[]>;
  lastNames: Record<string, string[]>;
  nicknames: Record<string, string[]>;
  genders: string[];
}

export const nameData: NameData = {
  firstNames: {
    US: [
      "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
      "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
      "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
      "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
      "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
      "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
      "Timothy", "Deborah", "Ronald", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon",
      "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
      "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
      "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
      "Benjamin", "Samantha", "Samuel", "Katherine", "Raymond", "Christine", "Gregory", "Debra",
      "Frank", "Rachel", "Alexander", "Carolyn", "Patrick", "Janet", "Jack", "Catherine",
      "Dennis", "Maria", "Jerry", "Heather", "Tyler", "Diane", "Aaron", "Ruth",
      "Jose", "Julie", "Adam", "Olivia", "Nathan", "Joyce", "Henry", "Virginia",
      "Zachary", "Virginia",
    ],
    UK: [
      "Oliver", "Olivia", "George", "Amelia", "Harry", "Isla", "Jack", "Ava",
      "Noah", "Mia", "William", "Lily", "James", "Sophia", "Leo", "Grace",
      "Charlie", "Scarlett", "Alexander", "Isabella", "Henry", "Jessica", "Thomas", "Evie",
      "Archie", "Ruby", "Oscar", "Chloe", "Jacob", "Phoebe", "Freddie", "Emily",
      "Ethan", "Ella", "Edward", "Charlotte", "William", "Sienna", "James", "Grace",
      "Arthur", "Freya", "George", "Harper", "Theodore", "Eva", "Benjamin", "Evelyn",
      "Lucas", "Abigail", "Mason", "Lily", "Logan", "Olivia", "Isaac", "Emma",
      "David", "Sophia", "Joseph", "Victoria", "Samuel", "Lucy", "Oscar", "Ella",
      "Felix", "Florence", "Sebastian", "Mila", "Gabriel", "Rosie", "Matthew", "Hannah",
      "Luke", "Luna", "Lewis", "Sofia", "Harvey", "Maya", "Max", "Aria",
      "Jake", "Ellie", "Rory", "Willow", "Finn", "Poppy", "Alfie", "Daisy",
      "Teddy", "Iris", "Jayden", "Rose", "Blake", "Jade", "Zachary", "Zoe",
    ],
    FR: [
      "Lucas", "Emma", "Gabriel", "Louise", "Raphaël", "Jade", "Adam", "Romain",
      "Léo", "Chloé", "Arthur", "Inès", "Louis", "Alice", "Hugo", "Rose",
      "Ethan", "Mila", "Paul", "Sarah", "Jules", "Zoé", "Nathan", "Julie",
      "Thomas", "Lisa", "Simon", "Manon", "Alexandre", "Camille", "Victor", "Léa",
      "Maxime", "Clara", "Antoine", "Anna", "Benjamin", "Emma", "Valentin", "Lou",
      "Axel", "Juliette", "Tom", "Sarah", "Samuel", "Julie", "Evan", "Lisa",
      "Quentin", "Manon", "Nicolas", "Camille", "Olivier", "Léa", "Pierrot", "Alice",
      "Matéo", "Lola", "Augustin", "Nina", "Jean", "Yvonne", "Pierre", "Marie",
      "François", "Catherine", "Philippe", "Anne", "Michel", "Sophie", "Bernard", "Isabelle",
      "Patrick", "Nathalie", "Alain", "Christine", "Christophe", "Pascale", "Stéphane", "Laurence",
      "Yves", "Monique", "Serge", "Brigitte", "Laurent", "Martine", "Thierry", "Annie",
      "Fabrice", "Nadia", "Arnaud", "Céline", "Vincent", "Vanessa", "Sébastien", "Audrey",
    ],
    DE: [
      "Lukas", "Emma", "Leon", "Hannah", "Tim", "Sofia", "Jonas", "Anna",
      "Paul", "Maria", "Marie", "Leonie", "Finn", "Sophie", "Ben", "Lena",
      "Felix", "Johanna", "Noah", "Emily", "Maximilian", "Amelie", "Elias", "Lilly",
      "Oskar", "Mia", "Lucas", "Emma", "Matteo", "Charlotte", "David", "Sofia",
      "Samuel", "Mila", "Julius", "Nele", "Philipp", "Lina", "Alexander", "Lea",
      "Daniel", "Nina", "Michael", "Sarah", "Johann", "Klara", "Christian", "Vera",
      "Florian", "Iris", "Stefan", "Petra", "Andreas", "Andrea", "Matthias", "Martina",
      "Thomas", "Tina", "Sebastian", "Sabrina", "Simon", "Sina", "Markus", "Marina",
      "Walter", "Wibke", "Klaus", "Katarina", "Heinrich", "Heidi", "Ulrich", "Ursula",
      "Gerhard", "Gertrud", "Friedrich", "Frieda", "Wolfgang", "Wanda", "Horst", "Herta",
      "Manfred", "Marta", "Heinz", "Hedwig", "Rolf", "Rosa", "Jürgen", "Jutta",
    ],
    CN: [
      "伟", "芳", "娜", "秀英", "敏", "静", "丽", "强", "磊", "军",
      "洋", "勇", "艳", "杰", "娟", "涛", "明", "超", "秀兰", "霞",
      "平", "刚", "桂英", "建华", "建国", "建军", "丽丽", "秀珍", "桂兰", "秀英",
      "婷", "欣", "颖", "雪", "梅", "兰", "燕", "红", "琴", "丹",
      "华", "鑫", "宇", "辉", "鹏", "浩", "波", "涛", "勇", "飞",
      "龙", "凤", "霞", "云", "峰", "川", "海", "山", "青", "松",
    ],
    JP: [
      "Yuki", "Sakura", "Haruto", "Hana", "Sota", "Mei", "Ren", "Yui",
      "Kaito", "Aoi", "Yuto", "Mio", "Hiro", "Saki", "Riku", "Mina",
      "Sora", "Rin", "A太郎", "花子", "一郎", "子", "健", "裕",
      "Takashi", "Ken", "Takeshi", "Akira", "Hiroshi", "Shin", "Yoshi", "Minoru",
      "Kazuo", "Tadao", "Masao", "Yasuo", "Hideo", "Tsutomu", "Susumu", "Noboru",
      "Kiyoshi", "Haru", "Shin", "Chiyo", "Tsune", "Jiro", "Shiro", "Goro",
      "Roku", "Hachi", "Kyu", "Ju", "Hiroshi", "Ken", "Takeshi", "Shin", "Akira",
    ],
    KR: [
      "민준", "서연", "도윤", "서윤", "예준", "하은", "시우", "하윤",
      "주원", "유나", "지호", "지민", "준서", "지우", "서진", "아린",
      "민재", "소율", "건우", "채원", "승우", "예은", "도현", "유진",
      "정우", "서현", "유준", "민지", "동현", "유림", "진우", "다은",
      "현우", "지원", "김", "이", "박", "최", "정", "강",
      "한", "오", "손", "조", "유", "목", " neurology", "신",
      "영", "허", "안", "남", "복", "마", "제", "구", "설",
    ],
    RU: [
      "Aleksandr", "Maria", "Dmitriy", "Anna", "Ivan", "Olga", "Aleksey", "Yekaterina",
      "Nikita", "Natalya", "Mikhail", "Tatyana", "Andrey", "Yelena", "Vladimir", "Yelena",
      "Pavel", "Svetlana", "Sergey", "Irina", "Viktor", "Mariya", "Yuri", "Olga",
      "Igor", "Natalia", "Boris", "Tatiana", "Konstantin", "Anna", "Grigory", "Vera",
      "Fedor", "Zinaida", "Vasily", "Lyudmila", "Stepan", "Raisa", "Egor", "Darya",
      "Oleg", "Katerina", "Timofey", "Polina", "Artem", "Alexandra", "Maksim", "Yaroslava",
      "Roman", "Angelina", "Anton", "Viktoria", "Evgeny", "Margarita", "Denis", "Irina",
      "Vladislav", "Oksana", "Kirill", "Svetlana", "Oskar", "Lidia", "Nikolay", "Galina",
    ],
    BR: [
      "Lucas", "Sofia", "Gabriel", "Ana", "Rafael", "Isabella", "Pedro", "Maria",
      "Guilherme", "Julia", "Felipe", "Luiza", "Carlos", "Camila", "André", "Beatriz",
      "Bruno", "Lorena", "Daniel", "Larissa", "Marcos", "Nicole", "Paulo", "Rafaela",
      "Thiago", "Gabriela", "Fernando", "Paula", "Rodrigo", "Carla", "Leonardo", "Fernanda",
      "Gustavo", "Adriana", "Ricardo", "Juliana", "Mário", "Patrícia", "Hugo", "Renata",
      "Cláudio", "Diana", "Vitor", "Vitória", "Jean", "Priscila", "Igor", "Sabrina",
      "Otávio", "Isadora", "Breno", "Bárbara", "Vinícius", "Mariana", "Enzo", "Luana",
      "Caio", "Lívia", "Arthur", "Isis", "Davi", "Helena", "Luís", "Raquel",
    ],
    IN: [
      "Aarav", "Aanya", "Vihaan", "Ananya", "Arjun", "Pari", "Ayaan", "Myra",
      "Reyansh", "Aadhya", "Krishna", "Diya", "Ishaan", "Aria", "Sai", "Priya",
      "Arnav", "Kiara", "Ayaan", "Nitya", "Karthik", "Lakshmi", "Rohan", "Meera",
      "Aditya", "Neha", "Vikram", "Priya", "Sanjay", "Kavita", "Raj", "Sunita",
      "Amit", "Rani", "Rahul", "Anita", "Suresh", "Rita", "Deepak", "Sunita",
      "Ajay", "Asha", "Vijay", "Kiran", "Sunil", "Rekha", "Gaurav", "Nisha",
      "Pankaj", "Pooja", "Sanjay", "Renu", "Anil", "Geeta", "Manoj", "Sita",
      "Ramesh", "Gita", "Suresh", "Sarla", "Mahesh", "Urmila", "Ravi", "Sarita",
    ],
    ES: [
      "Lucía", "Mateo", "Sofía", "Leo", "Valentina", "Daniel", "Mariana", "Pablo",
      "Carmen", "Ángel", "Isabella", "Javier", "María", "Miguel", "Andrea", "Carlos",
      "Ana", "Jorge", "Laura", "David", "Silvia", "Antonio", "Natalia", "Alejandro",
      "Claudia", "Fernando", "Paula", "Víctor", "Elena", "Diego", "Raquel", "Adrián",
      "Marta", "Juan", "Irene", "Sergio", "Cristina", "Óscar", "Beatriz", "Ramón",
      "Patricia", "Francisco", "Mercedes", "Alberto", "Rosa", "Luis", "Teresa", "Enrique", "Miriam",
      "Ignacio", "Jennifer", "Andrés", "Mónica", "Roberto", "Esther", "Gabriel", "Natalia",
      "Salvador", "Gloria", "Joaquín", "Lorena", "Julián", "Amanda", "Ricardo", "Andrea",
    ],
    IT: [
      "Lorenzo", "Giulia", "Francesco", "Sofia", "Alessandro", "Emma", "Mattia", "Aurora",
      "Leonardo", "Martina", "Edoardo", "Anna", "Gabriele", "Chiara", "Tommaso", "Francesca",
      "Riccardo", "Giulia", "Andrea", "Greta", "Filippo", "Alice", "Samuele", "Mia",
      "Giuseppe", "Maria", "Antonio", "Rosa", "Marco", "Laura", "Stefano", "Caterina",
      "Fabio", "Valentina", "Davide", "Silvia", "Giovanni", "Paola", "Simone", "Daniela",
      "Carlo", "Antonella", "Matteo", "Lisa", "Paolo", "Elena", "Michele", "Sara",
      "Roberto", "Claudia", "Alberto", "Giovanna", "Mario", "Anna", "Luigi", "Maria",
      "Vincenzo", "Rosaria", "Pietro", "Carla", "Francesco", "Teresa", "Salvatore", "Patrizia",
    ],
  },
  lastNames: {
    US: [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
      "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
      "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
      "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
      "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
      "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
      "Carter", "Roberts", "Turner", "Phillips", "Evans", "Parker", "Collins", "Edwards",
    ],
    UK: [
      "Smith", "Jones", "Taylor", "Brown", "Williams", "Wilson", "Johnson", "Davies",
      "Robinson", "Wright", "Thompson", "White", "Hughes", "Edwards", "Green", "Harris",
      "Wood", "Fraser", "Cameron", "Ross", "Campbell", "Stewart", "Murray", "Macdonald",
      "Robertson", "Anderson", "Scott", "Reid", "Clark", "Murray", "Hamilton", "Graham",
      "Miller", "Davies", "Wilson", "Moore", "Taylor", "Anderson", "Jackson", "Watson",
      "Martin", "Lee", "Thompson", "White", "Harris", "Clarke", "Patel", "Cooper",
      "Adams", "Thomas", "Roberts", "Walker", "Hall", "Wood", "Harris", "Clarke",
    ],
    FR: [
      "Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Pichard", "Durand",
      "Dubois", "Moreau", "Laurent", "Lefebvre", "Michel", "Garcia", "Bertrand", "Rousseau",
      "Simon", "Leroy", "Camille", "Renard", "Girard", "Bonnet", "Morel", "Fournier",
      "Dupont", "Lambert", "Rousseau", "Fontaine", "Aubert", "Vincent", "Muller", "Lefevre",
      "Faure", "Andre", "Mercier", "Bouchet", "Gilles", "Guy", "Jean", "Pierre",
      "Louis", "Jacques", "Paul", "Henry", "Charles", "François", "Marie", "Catherine",
    ],
    DE: [
      "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker",
      "Schulz", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein", "Wolf",
      "Schröder", "Neumann", "Schwarz", "Zimmermann", "Braun", "Krüger", "Hartmann", "Lange",
      "Schmitt", "Werner", "Schmitz", "Krause", "Meier", "Lehmann", "Huber", "Mayer",
      "Herrmann", "Köhler", "Walter", "König", "Fuchs", "Kaiser", "Lang", "Weiß",
      "Peters", "Jung", "Hahn", "Schubert", "Vogel", "Friedrich", "Keller", "Günther",
    ],
    CN: [
      "王", "李", "张", "刘", "陈", "杨", "黄", "赵", "周", "吴",
      "徐", "孙", "马", "朱", "胡", "郭", "何", "高", "林", "罗",
      "郑", "梁", "谢", "宋", "唐", "许", "韩", "冯", "邓", "曹",
      "彭", "曾", "萧", "蔡", "潘", "田", "董", "袁", "于", "余",
      "叶", "蒋", "杜", "苏", "魏", "程", "吕", "丁", "沈", "任",
      "姚", "卢", "傅", "钟", "姜", "崔", "谭", "廖", "范", "汪",
    ],
    JP: [
      "佐藤", "鈴木", "高橋", "田中", "渡辺", "伊藤", "山本", "中村",
      "小林", "加藤", "吉田", "山田", "松本", "井上", "木村", "林",
      "清水", "山崎", "阿部", "佐伯", "山田", "寺島", "矢吹", "今井",
      "小野", "川口", "菊地", "黒田", "武藤", "田辺", "森", "阿久津",
    ],
    KR: [
      "김", "이", "박", "최", "정", "강", "조", "吴",
      "한", "신", "임", "오", "서", "배", "전", "홍", "유", "황",
      "조", "권", "공", "양", "방", "선", "노", "도", "설", "마",
    ],
    RU: [
      "Ivanov", "Petrov", "Smirnov", "Kuznetsov", "Popov", "Vasiliev", "Sokolov", "Mikhailov",
      "Fedorov", "Morozov", "Volkov", "Alexeev", "Lebedev", "Kozlov", "Novikov", "Zaitsev",
      "Pavlov", "Semenov", "Golubev", "Vlasov", "Makarov", "Nikitin", "Orlov", "Andreev",
      "Kiselev", "Zaharov", "Matveev", "Gromov", "Frolov", "Titov", "Markov", "Kleymenov",
    ],
    BR: [
      "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira",
      "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Rocha", "Almeida",
      "Nascimento", "Araujo", "Melo", "Barbosa", "Cardoso", "Correia", "Dias", "Fernandes",
      "Freitas", "Machado", "Moreira", "Nunes", "Pinto", "Ramos", "Sales", "Souza",
    ],
    IN: [
      "Sharma", "Singh", "Kumar", "Patel", "Singh", "Khan", "Gupta", "Verma",
      "Reddy", "Rao", "Joshi", "Shah", "Mehta", "Kapoor", "Chopra", "Malhotra",
      "Kumar", "Ahmed", "Ali", "Hussain", "Qureshi", "Ansari", "Nair", "Menon",
      "Iyer", "Pillai", "Nambiar", "Bhatia", "Saxena", "Mishra", "Pandey", "Trivedi",
    ],
    ES: [
      "García", "Rodríguez", "Martínez", "Hernández", "López", "González", "Sánchez", "Ramírez",
      "Torres", "Flores", "Rivera", "Gómez", "Díaz", "Reyes", "Cruz", "Morales",
      "Ortiz", "Gutiérrez", "Chávez", "Ramos", "Vargas", "Castillo", "Jiménez", "Vega",
      "Montes", "Núñez", "Mendoza", "Ruiz", "Álvarez", "Contreras", "Velasco", "Romero",
    ],
    IT: [
      "Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci",
      "Marino", "Greco", "Bruno", "Gallo", "Conti", "Costa", "Giordano", "Mancini",
      "Rizzo", "Lombardi", "Moretti", "Barbieri", "Fontana", "Santoro", "Mariani", "Rinaldi",
      "Caruso", "Ferrara", "Gallagher", "O'Brien", "Smith", "Johnson", "Williams", "Jones",
    ],
  },
  nicknames: {
    US: [
      "CoolCat", "StarGazer", "DreamWeaver", "NightOwl", "SunShine", "ThunderBolt",
      "AquaMarine", "FireStorm", "SilverWolf", "GoldenEagle", "MysticMoon", "ShadowHunter",
      "NeonKnight", "CyberPunk", "BlueSky", "GreenLeaf", "RedDragon", "WhiteWolf",
      "BlackPanther", "IronMan", "SuperHero", "MegaMind", "TurboCharged", "HyperSpeed",
      "CosmicRay", "StarDust", "MoonBeam", "SunBurst", "StormChaser", "IceBreaker",
    ],
    UK: [
      "Bubbles", "Snuggles", "Cuddles", "Pudding", "Biscuit", "Muffin",
      "Cupcake", "Honey", "Sweetie", "Darling", "Poppy", "Daisy",
      "Rosie", "Lily", "Violet", "Buddy", "Max", "Charlie",
      "Oscar", "Jack", "Cooper", "Riley", "Bailey", "Toby",
    ],
    FR: [
      "PetitChat", "MonLapin", "MonOurson", "MaCoccinelle", "MonPanda", "MonKoala",
      "MonHérisson", "MaGirafe", "MonLion", "MaTigresse", "MonÉcureuil", "MaChouette",
      "PetitRenard", "PetiteLune", "PetitSoleil", "MonTrésor", "MonBonheur", "MonAmour",
    ],
    DE: [
      "Schneeflock", "Sonnenschein", "Knuddel", "Schnuffel", "Herzchen", "Liebling",
      "Mäuschen", "Bärchen", "Hasenchen", "Füchslein", "Wölfchen", "Vögelchen",
    ],
    CN: [
      "小可爱", "小天使", "小宝贝", "小甜心", "小星星", "小月亮",
      "小太阳", "小雪花", "小棉袄", "小吃货", "小懒虫", "小书虫",
      "开心果", "小精灵", "小天使", "萌萌", "甜甜", "豆豆",
    ],
    JP: [
      "モフモフ", "ふわふわ", "ちりちり", "まるまる", "ぷにぷに", "もこもこ",
      "ほんわか", "あったか", "きらきら", "ぴかぴか", "ふわふわ", "むープル",
    ],
    KR: [
      "아기곰", "예쁜이", "사랑이", "꽃님", "솔개", "달님",
      "별님", "햇님", "구름님", "바다님", "산님", "바람님",
    ],
    RU: [
      "Zvezdochka", "Lunny", "Solnyshko", "Medvezhonok", "Zayac", "Lisichka",
      "Sovetnik", "Russkiy", "Medved", "Volk", "Lis", "Bars",
    ],
    BR: [
      "Docinho", "Doce", "Mel", "Caramelo", "Benzinho", "Querido",
      "Amor", "Anjinho", "Princesa", "Tesouro", "Coração", "Luizinha",
    ],
    IN: [
      "Laddu", "Mithai", "Golu", "Motu", "Patlu", "Chhota",
      "Bachcha", "Pagli", "Munni", "Lali", "Pinku", "Chinku",
    ],
    ES: [
      "Cariño", "Corazón", "MiAmor", "Pulga", "Chiquito", "Peque",
      "Bonito", "Guapo", "Lindo", "Precioso", "Tesoro", "Amor",
    ],
    IT: [
      "Bello", "Carino", "Amore", "Tesoro", "Piccolo", "Dolce",
      "Cuore", "Stella", "Luna", "Sole", "Angelo", "Bambino",
    ],
  },
  genders: ["Male", "Female"],
};

/**
 * 获取指定国家的随机名字数据
 */
export function getRandomFirstName(country: string, gender: string): string {
  const names = nameData.firstNames[country] || nameData.firstNames.US;
  const filteredNames = gender === "Male"
    ? names.filter((_, i) => i % 2 === 0)
    : names.filter((_, i) => i % 2 === 1);
  return filteredNames[Math.floor(Math.random() * filteredNames.length)];
}

export function getRandomLastName(country: string): string {
  const names = nameData.lastNames[country] || nameData.lastNames.US;
  return names[Math.floor(Math.random() * names.length)];
}

export function getRandomNickname(country: string): string {
  const nicknames = nameData.nicknames[country] || nameData.nicknames.US;
  return nicknames[Math.floor(Math.random() * nicknames.length)];
}

export function getRandomGender(): string {
  return nameData.genders[Math.floor(Math.random() * nameData.genders.length)];
}

export function getCountryList(): { code: string; name: string; icon: string }[] {
  return [
    { code: "US", name: "美国", icon: "i-flag-us-4x3" },
    { code: "UK", name: "英国", icon: "i-flag-gb-4x3" },
    { code: "FR", name: "法国", icon: "i-flag-fr-4x3" },
    { code: "DE", name: "德国", icon: "i-flag-de-4x3" },
    { code: "CN", name: "中国", icon: "i-flag-cn-4x3" },
    { code: "JP", name: "日本", icon: "i-flag-jp-4x3" },
    { code: "KR", name: "韩国", icon: "i-flag-kr-4x3" },
    { code: "RU", name: "俄罗斯", icon: "i-flag-ru-4x3" },
    { code: "BR", name: "巴西", icon: "i-flag-br-4x3" },
    { code: "IN", name: "印度", icon: "i-flag-in-4x3" },
    { code: "ES", name: "西班牙", icon: "i-flag-es-4x3" },
    { code: "IT", name: "意大利", icon: "i-flag-it-4x3" },
  ];
}
