class ExpenseClassifier:
    def __init__(self):
        self.categories = {
            'an uong': ['cafe', 'ca phe', 'matcha', 'tra', 'nuoc', 'an com', 'uong nuoc', 'nha hang', 'quan an', 'food', 'drink', 'banh mi', 'tra sua',"pho","an pho","uong pho","mon pho","quan pho",
                    "bun cha","an bun cha","uong bun cha","mon bun cha","quan bun cha",
                    "bun bo hue","an bun bo hue","uong bun bo hue","mon bun bo hue","quan bun bo hue",
                    "com tam","an com tam","uong com tam","mon com tam","quan com tam",
                    "banh cuon","an banh cuon","uong banh cuon","mon banh cuon","quan banh cuon",
                    "banh xeo","an banh xeo","uong banh xeo","mon banh xeo","quan banh xeo",
                    "goi cuon","an goi cuon","uong goi cuon","mon goi cuon","quan goi cuon",
                    "cha gio","an cha gio","uong cha gio","mon cha gio","quan cha gio",
                    "banh canh","an banh canh","uong banh canh","mon banh canh","quan banh canh",
                    "hu tieu","an hu tieu","uong hu tieu","mon hu tieu","quan hu tieu",
                    "banh da cua","an banh da cua","uong banh da cua","mon banh da cua","quan banh da cua",
                    "mien ga","an mien ga","uong mien ga","mon mien ga","quan mien ga",
                    "mien luon","an mien luon","uong mien luon","mon mien luon","quan mien luon",
                    "banh mi","an banh mi","uong banh mi","mon banh mi","quan banh mi",
                    "banh bao","an banh bao","uong banh bao","mon banh bao","quan banh bao",
                    "xoi gac","an xoi gac","uong xoi gac","mon xoi gac","quan xoi gac",
                    "xoi dau xanh","an xoi dau xanh","uong xoi dau xanh","mon xoi dau xanh","quan xoi dau xanh",
                    "che ba mau","an che ba mau","uong che ba mau","mon che ba mau","quan che ba mau",
                    "che khuc bach","an che khuc bach","uong che khuc bach","mon che khuc bach","quan che khuc bach",
                    "che troi nuoc","an che troi nuoc","uong che troi nuoc","mon che troi nuoc","quan che troi nuoc",
                    "banh trang tron","an banh trang tron","uong banh trang tron","mon banh trang tron","quan banh trang tron",
                    "banh trang nuong","an banh trang nuong","uong banh trang nuong","mon banh trang nuong","quan banh trang nuong",
                    "banh duc","an banh duc","uong banh duc","mon banh duc","quan banh duc",
                    "banh tet","an banh tet","uong banh tet","mon banh tet","quan banh tet",
                    "banh chung","an banh chung","uong banh chung","mon banh chung","quan banh chung",
                    "banh khot","an banh khot","uong banh khot","mon banh khot","quan banh khot",
                    "banh it","an banh it","uong banh it","mon banh it","quan banh it",
                    "banh beo","an banh beo","uong banh beo","mon banh beo","quan banh beo",
                    "banh ram it","an banh ram it","uong banh ram it","mon banh ram it","quan banh ram it",
                    "pizza","an pizza","uong pizza","mon pizza","quan pizza",
                    "spaghetti","an spaghetti","uong spaghetti","mon spaghetti","quan spaghetti",
                    "pasta","an pasta","uong pasta","mon pasta","quan pasta",
                    "sushi","an sushi","uong sushi","mon sushi","quan sushi",
                    "ramen","an ramen","uong ramen","mon ramen","quan ramen",
                    "udon","an udon","uong udon","mon udon","quan udon",
                    "tempura","an tempura","uong tempura","mon tempura","quan tempura",
                    "takoyaki","an takoyaki","uong takoyaki","mon takoyaki","quan takoyaki",
                    "steak","an steak","uong steak","mon steak","quan steak",
                    "hamburger","an hamburger","uong hamburger","mon hamburger","quan hamburger",
                    "sandwich","an sandwich","uong sandwich","mon sandwich","quan sandwich",
                    "taco","an taco","uong taco","mon taco","quan taco",
                    "burrito","an burrito","uong burrito","mon burrito","quan burrito",
                    "kebab","an kebab","uong kebab","mon kebab","quan kebab",
                    "dimsum","an dimsum","uong dimsum","mon dimsum","quan dimsum",
                    "hotdog","an hotdog","uong hotdog","mon hotdog","quan hotdog",
                    "fried chicken","an fried chicken","uong fried chicken","mon fried chicken","quan fried chicken",
                    "doner","an doner","uong doner","mon doner","quan doner",
                    "shawarma","an shawarma","uong shawarma","mon shawarma","quan shawarma",
                    "falafel","an falafel","uong falafel","mon falafel","quan falafel", "banh"],
            'di lai': ['xang xe', 'grab', 'taxi', 'xe bus', 'xe may', 'tau', 'may bay', 'motor', 'oto'],
            'hoc tap': ['mua sach', 'khoa hoc', 'hoc phi', 'van phong pham', 'course', 'truong hoc', 'lop hoc'],
            'giai tri': ['xem phim', 'choi game', 'du lich', 'karaoke', 'bar', 'club', 'cinema'],
            'hoa don': ['tien dien', 'tien nuoc', 'internet', 'dien thoai', 'thue nha', 'wifi'],
            'khac': []
        }
    
    def classify(self, description):
        # Chuyen ve khong dau va lowercase
        description = self._remove_accents(description.lower())
        
        for category, keywords in self.categories.items():
            for keyword in keywords:
                if keyword in description:
                    return category
        return 'khac'
    
    def _remove_accents(self, text):
        # Bo dau tieng Viet don gian
        replacements = {
            'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
            'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
            'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
            'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
            'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
            'đ': 'd'
        }
        
        for accented, plain in replacements.items():
            text = text.replace(accented, plain)
        
        return text