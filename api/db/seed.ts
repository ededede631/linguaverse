import { insert, count, User, Course, Chapter, Vocabulary, GrammarQuestion, ListeningMaterial, SpeakingSentence, Achievement, CommunityPost } from './database';
import bcrypt from 'bcryptjs';

export function seedDatabase() {
  if (count('users') > 0) {
    console.log('Database already seeded, skipping');
    return;
  }

  const now = new Date().toISOString();
  const hash = bcrypt.hashSync('password123', 10);

  const demoUser = insert<User>('users', {
    username: 'demo',
    email: 'demo@linguaverse.com',
    password_hash: hash,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    target_language: 'en',
    level: 'intermediate',
    daily_goal: 30,
    streak: 7,
    total_words: 156,
    total_minutes: 480,
    created_at: now,
    updated_at: now,
  });

  const sakuraUser = insert<User>('users', {
    username: 'sakura',
    email: 'sakura@linguaverse.com',
    password_hash: hash,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sakura',
    target_language: 'ja',
    level: 'beginner',
    daily_goal: 45,
    streak: 12,
    total_words: 203,
    total_minutes: 720,
    created_at: now,
    updated_at: now,
  });

  const minjunUser = insert<User>('users', {
    username: 'minjun',
    email: 'minjun@linguaverse.com',
    password_hash: hash,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minjun',
    target_language: 'ko',
    level: 'beginner',
    daily_goal: 20,
    streak: 3,
    total_words: 89,
    total_minutes: 210,
    created_at: now,
    updated_at: now,
  });

  const coursesData = [
    { language: 'en', level: 'beginner', title: '英语入门：零基础直达日常对话', description: '从最基础的音标和词汇开始，循序渐进掌握日常英语交流能力。适合完全零基础或基础薄弱的学习者。', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600' },
    { language: 'en', level: 'intermediate', title: '英语进阶：语法强化与听说提升', description: '系统学习英语语法体系，通过丰富的听说训练全面提升语言运用能力。适合有一定基础的学习者。', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600' },
    { language: 'en', level: 'advanced', title: '英语高级：商务与学术英语精通', description: '深入学习商务英语和学术写作，掌握高级词汇和复杂句式，助力职业发展。', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600' },
    { language: 'ja', level: 'beginner', title: '日语入门：五十音图与基础会话', description: '从零开始学习日语五十音图，掌握基础词汇和日常寒暄，开启日语学习之旅。', image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600' },
    { language: 'ja', level: 'intermediate', title: '日语进阶：语法体系与能力考N3', description: '系统学习日语中级语法，备战JLPT N3考试，全面提升听说读写能力。', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600' },
    { language: 'ja', level: 'advanced', title: '日语高级：商务日语与文化理解', description: '学习商务日语表达和日本商务文化，掌握敬语体系和高级词汇。', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
    { language: 'ko', level: 'beginner', title: '韩语入门：韩文字母与基础表达', description: '轻松掌握韩文字母读写，学习基础词汇和日常用语，感受韩语魅力。', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600' },
    { language: 'ko', level: 'intermediate', title: '韩语进阶：语法强化与TOPIK中级', description: '系统学习韩语中级语法，备战TOPIK中级考试，提升韩语综合能力。', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600' },
    { language: 'ko', level: 'advanced', title: '韩语高级：新闻韩语与职场应用', description: '学习高级韩语词汇和语法，听懂新闻看懂韩剧，掌握职场韩语技能。', image: 'https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?w=600' },
  ];

  const courseIds: number[] = [];
  for (const c of coursesData) {
    const course = insert<Course>('courses', { ...c, created_at: now });
    courseIds.push(course.id);
  }

  const chapterTitles = [
    '课程介绍与学习方法', '基础发音与音标', '常用问候与自我介绍', '数字与时间表达',
    '日常购物与点餐', '问路与交通出行', '兴趣爱好话题', '家庭与朋友介绍',
    '工作与职业描述', '天气与季节', '健康与运动', '旅行与度假',
    '文化差异与交流', '复习与总结测试'
  ];

  for (const courseId of courseIds) {
    for (let i = 0; i < 12; i++) {
      insert<Chapter>('chapters', {
        course_id: courseId,
        title: `第${i + 1}章 ${chapterTitles[i]}`,
        duration: 15 + Math.floor(Math.random() * 30),
        content: '',
        sort_order: i,
      });
    }
  }

  const enWords = [
    ['hello', '你好', '/həˈloʊ/', 'Hello, nice to meet you!', '你好，很高兴认识你！'],
    ['thank you', '谢谢', '/θæŋk juː/', 'Thank you for your help.', '谢谢你的帮助。'],
    ['goodbye', '再见', '/ˌɡʊdˈbaɪ/', 'Goodbye, see you tomorrow!', '再见，明天见！'],
    ['please', '请', '/pliːz/', 'Please wait a moment.', '请稍等。'],
    ['sorry', '对不起', '/ˈsɑːri/', 'I\'m sorry for being late.', '对不起我迟到了。'],
    ['water', '水', '/ˈwɔːtər/', 'Can I have some water?', '能给我一些水吗？'],
    ['book', '书', '/bʊk/', 'I\'m reading a book.', '我正在读一本书。'],
    ['friend', '朋友', '/frend/', 'She is my best friend.', '她是我最好的朋友。'],
    ['family', '家庭', '/ˈfæməli/', 'I love my family.', '我爱我的家庭。'],
    ['happy', '快乐的', '/ˈhæpi/', 'I feel very happy today.', '我今天感到非常开心。'],
    ['beautiful', '美丽的', '/ˈbjuːtɪfl/', 'What a beautiful day!', '多么美好的一天！'],
    ['learn', '学习', '/lɜːrn/', 'I want to learn English.', '我想学习英语。'],
    ['work', '工作', '/wɜːrk/', 'I work in a company.', '我在一家公司工作。'],
    ['food', '食物', '/fuːd/', 'The food is delicious.', '食物很美味。'],
    ['time', '时间', '/taɪm/', 'What time is it?', '现在几点了？'],
    ['morning', '早晨', '/ˈmɔːrnɪŋ/', 'Good morning!', '早上好！'],
    ['night', '夜晚', '/naɪt/', 'Good night, sweet dreams.', '晚安，好梦。'],
    ['music', '音乐', '/ˈmjuːzɪk/', 'I love listening to music.', '我喜欢听音乐。'],
    ['movie', '电影', '/ˈmuːvi/', 'Let\'s watch a movie tonight.', '今晚去看电影吧。'],
    ['travel', '旅行', '/ˈtrævl/', 'I want to travel around the world.', '我想环游世界。'],
  ];

  for (const w of enWords) {
    insert<Vocabulary>('vocabulary', {
      language: 'en',
      level: 'beginner',
      word: w[0],
      meaning: w[1],
      pronunciation: w[2],
      example: w[3],
      example_translation: w[4],
    });
  }

  const jaWords = [
    ['こんにちは', '你好', 'konnichiwa', 'こんにちは、はじめまして。', '你好，初次见面。'],
    ['ありがとう', '谢谢', 'arigatou', 'ありがとうございます。', '非常感谢。'],
    ['さようなら', '再见', 'sayounara', 'さようなら、また明日。', '再见，明天见。'],
    ['すみません', '对不起', 'sumimasen', 'すみません、遅れました。', '对不起，我迟到了。'],
    ['はい', '是', 'hai', 'はい、わかりました。', '是的，我明白了。'],
    ['いいえ', '不是', 'iie', 'いいえ、違います。', '不，不是的。'],
    ['水', '水', 'mizu', '水をください。', '请给我水。'],
    ['本', '书', 'hon', '本を読んでいます。', '我正在读书。'],
    ['友達', '朋友', 'tomodachi', '彼は私の友達です。', '他是我的朋友。'],
    ['家族', '家庭', 'kazoku', '家族が大好きです。', '我非常爱我的家人。'],
    ['食べ物', '食物', 'tabemono', 'この食べ物は美味しいです。', '这个食物很好吃。'],
    ['学校', '学校', 'gakkou', '学校に行きます。', '我去学校。'],
    ['仕事', '工作', 'shigoto', '仕事が終わりました。', '工作结束了。'],
    ['音楽', '音乐', 'ongaku', '音楽を聞くのが好きです。', '我喜欢听音乐。'],
    ['映画', '电影', 'eiga', '映画を見に行きましょう。', '去看电影吧。'],
    ['旅行', '旅行', 'ryokou', '日本へ旅行に行きたいです。', '我想去日本旅行。'],
    ['天気', '天气', 'tenki', '今日はいい天気ですね。', '今天天气真好。'],
    ['時間', '时间', 'jikan', '時間がありますか？', '你有时间吗？'],
    ['朝', '早晨', 'asa', 'おはようございます。', '早上好。'],
    ['夜', '夜晚', 'yoru', 'おやすみなさい。', '晚安。'],
  ];

  for (const w of jaWords) {
    insert<Vocabulary>('vocabulary', {
      language: 'ja',
      level: 'beginner',
      word: w[0],
      meaning: w[1],
      pronunciation: w[2],
      example: w[3],
      example_translation: w[4],
    });
  }

  const koWords = [
    ['안녕하세요', '你好', 'annyeonghaseyo', '안녕하세요, 만나서 반갑습니다.', '你好，很高兴见到你。'],
    ['감사합니다', '谢谢', 'gamsahamnida', '도와주셔서 감사합니다.', '感谢您的帮助。'],
    ['안녕히 가세요', '再见', 'annyeonghi gaseyo', '안녕히 가세요, 내일 봐요.', '再见，明天见。'],
    ['죄송합니다', '对不起', 'joesonghamnida', '늦어서 죄송합니다.', '对不起我迟到了。'],
    ['네', '是', 'ne', '네, 알겠습니다.', '是的，我知道了。'],
    ['아니요', '不是', 'aniyo', '아니요, 그게 아니에요.', '不，不是那样的。'],
    ['물', '水', 'mul', '물 좀 주세요.', '请给我点水。'],
    ['책', '书', 'chaek', '책을 읽고 있어요.', '我正在读书。'],
    ['친구', '朋友', 'chingu', '그는 제 친구예요.', '他是我的朋友。'],
    ['가족', '家庭', 'gajok', '가족을 사랑해요.', '我爱我的家人。'],
    ['음식', '食物', 'eumsik', '음식이 맛있어요.', '食物很好吃。'],
    ['학교', '学校', 'hakgyo', '학교에 가요.', '我去学校。'],
    ['일', '工作', 'il', '일이 끝났어요.', '工作结束了。'],
    ['음악', '音乐', 'eumak', '음악 듣는 것을 좋아해요.', '我喜欢听音乐。'],
    ['영화', '电影', 'yeonghwa', '영화 보러 가요.', '去看电影。'],
    ['여행', '旅行', 'yeohaeng', '한국에 여행 가고 싶어요.', '我想去韩国旅行。'],
    ['날씨', '天气', 'nalssi', '오늘 날씨가 좋네요.', '今天天气真好。'],
    ['시간', '时间', 'sigan', '시간 있어요?', '你有时间吗？'],
    ['아침', '早晨', 'achim', '좋은 아침이에요.', '早上好。'],
    ['밤', '夜晚', 'bam', '잘 자요.', '晚安。'],
  ];

  for (const w of koWords) {
    insert<Vocabulary>('vocabulary', {
      language: 'ko',
      level: 'beginner',
      word: w[0],
      meaning: w[1],
      pronunciation: w[2],
      example: w[3],
      example_translation: w[4],
    });
  }

  const enGrammar = [
    ['She ___ to school every day.', '["go", "goes", "going", "went"]', 1, '主语是第三人称单数she，一般现在时动词要加s/es，所以用goes。'],
    ['I have ___ apple.', '["a", "an", "the", "/"]', 1, 'apple以元音音素开头，所以用不定冠词an。'],
    ['They ___ football yesterday.', '["play", "plays", "played", "playing"]', 2, 'yesterday表示过去时间，要用一般过去时，play的过去式是played。'],
    ['This book is ___ than that one.', '["interesting", "more interesting", "most interesting", "interestinger"]', 1, 'than表示比较，interesting是多音节词，比较级用more interesting。'],
    ['___ you like some coffee?', '["Do", "Are", "Would", "Is"]', 2, 'Would you like... 是礼貌地询问对方想要什么的常用句型。'],
    ['He can ___ English very well.', '["speak", "speaks", "speaking", "spoke"]', 0, 'can是情态动词，后面要跟动词原形。'],
    ['There ___ a book on the desk.', '["is", "are", "have", "has"]', 0, 'There be句型，a book是单数，所以用is。'],
    ['What time do you usually ___ up?', '["get", "gets", "got", "getting"]', 0, '前面有助动词do，后面的动词要用原形。'],
    ['My birthday is ___ May 5th.', '["in", "on", "at", "for"]', 1, '具体的某一天要用介词on。'],
    ['I\'m hungry. I want ___ to eat.', '["something", "anything", "nothing", "everything"]', 0, '肯定句中用something表示"一些东西"。'],
  ];

  for (const q of enGrammar) {
    insert<GrammarQuestion>('grammar_questions', {
      language: 'en',
      level: 'beginner',
      question: String(q[0]),
      options: String(q[1]),
      correct_answer: q[2] as number,
      explanation: String(q[3]),
    });
  }

  const jaGrammar = [
    ['私は学生___。', '["です", "ます", "だ", "でした"]', 0, '名词谓语句的礼貌形式用です。私は学生です。我是学生。'],
    ['朝ご飯を___。', '["食べます", "食べる", "食べた", "食べて"]', 0, 'ます形是礼貌体，动词ます形作谓语。'],
    ['これは___本です。', '["私", "私の", "私に", "私と"]', 1, 'の表示所属，私の本 = 我的书。'],
    ['学校へ___行きます。', '["バスで", "バスに", "バスを", "バスの"]', 0, 'で表示交通手段，バスで行く = 坐公交去。'],
    ['昨日、映画を___。', '["見ます", "見ました", "見て", "見る"]', 1, '昨日是过去的时间，动词要用过去式ました。'],
    ['___が好きですか？', '["何", "誰", "どこ", "いつ"]', 0, '何が好きですか = 你喜欢什么？'],
    ['日本語が___わかりません。', '["よく", "すこし", "ぜんぜん", "とても"]', 2, 'ぜんぜん～ません是固定搭配，表示"完全不..."。'],
    ['毎日、日本語を___します。', '["勉強を", "勉強に", "勉強で", "勉強"]', 3, '勉強します = 学习，する动词前面接名词。'],
    ['このペンは___ですか？', '["いくら", "いくつ", "なん", "どれ"]', 0, 'いくらですか = 多少钱？询问价格。'],
    ['友達___映画を見に行きます。', '["と", "に", "を", "で"]', 0, 'と表示"和...一起"，友達と行く = 和朋友去。'],
  ];

  for (const q of jaGrammar) {
    insert<GrammarQuestion>('grammar_questions', {
      language: 'ja',
      level: 'beginner',
      question: String(q[0]),
      options: String(q[1]),
      correct_answer: q[2] as number,
      explanation: String(q[3]),
    });
  }

  const koGrammar = [
    ['저는 학생___.', '["입니다", "이에요", "예요", "이다"]', 0, '입니다是名词谓语句的正式礼貌体。학생입니다 = 是学生。'],
    ['밥을___.', '["먹어요", "먹다", "먹었어요", "먹고"]', 0, '아/어요是口语礼貌体。먹어요 = 吃。'],
    ['이것은___책이에요.', '["저", "제", "나", "내"]', 1, '제是저의的缩略，我的。제 책 = 我的书。'],
    ['학교에___가요.', '["버스로", "버스에", "버스를", "버스가"]', 0, '으로/로表示交通手段。버스로 가요 = 坐公交去。'],
    ['어제 영화를___.', '["봐요", "봤어요", "보고", "보다"]', 1, '었/았过去式。보다的过去式是봤어요。'],
    ['___를 좋아해요?', '["무엇", "누구", "어디", "언제"]', 0, '무엇을 좋아해요 = 你喜欢什么？'],
    ['한국어를___몰라요.', '["잘", "조금", "전혀", "아주"]', 2, '전혀～지 않다/몰라요 表示"完全不..."。'],
    ['매일 한국어를___해요.', '["공부를", "공부에", "공부로", "공부"]', 3, '공부하다 = 学习，공부해요是缩略形式。'],
    ['이 펜은___예요?', '["얼마", "몇", "무슨", "어느"]', 0, '얼마예요 = 多少钱？询问价格。'],
    ['친구___영화를 보러 가요.', '["와", "에", "을", "로"]', 0, '와/과表示"和...一起"。친구와 가요 = 和朋友去。'],
  ];

  for (const q of koGrammar) {
    insert<GrammarQuestion>('grammar_questions', {
      language: 'ko',
      level: 'beginner',
      question: String(q[0]),
      options: String(q[1]),
      correct_answer: q[2] as number,
      explanation: String(q[3]),
    });
  }

  const achievementsData = [
    { name: '初学者', description: '完成第一次学习', icon: 'Star', condition_type: 'minutes', condition_value: 1 },
    { name: '坚持一周', description: '连续学习7天', icon: 'Flame', condition_type: 'streak', condition_value: 7 },
    { name: '单词达人', description: '累计学习100个单词', icon: 'BookOpen', condition_type: 'words', condition_value: 100 },
    { name: '勤奋学者', description: '累计学习10小时', icon: 'Clock', condition_type: 'minutes', condition_value: 600 },
    { name: '社交蝴蝶', description: '发布第一条社区动态', icon: 'MessageCircle', condition_type: 'posts', condition_value: 1 },
    { name: '课程新星', description: '完成一门课程', icon: 'Award', condition_type: 'courses', condition_value: 1 },
    { name: '口语新星', description: '完成10次口语练习', icon: 'Mic', condition_type: 'speaking', condition_value: 10 },
    { name: '听力高手', description: '完成20篇听力训练', icon: 'Headphones', condition_type: 'listening', condition_value: 20 },
    { name: '语法大师', description: '答对100道语法题', icon: 'Lightbulb', condition_type: 'grammar', condition_value: 100 },
    { name: '月度冠军', description: '连续学习30天', icon: 'Trophy', condition_type: 'streak', condition_value: 30 },
  ];

  for (const a of achievementsData) {
    insert<Achievement>('achievements', { ...a, created_at: now });
  }

  const postsData = [
    { user_id: sakuraUser.id, content: '今天终于把五十音图全部背下来了！🎉 虽然花了一周时间，但是好有成就感，继续加油！#日语学习 #打卡' },
    { user_id: minjunUser.id, content: '韩语发音真的好有趣，收音部分刚开始有点难，但是练多了就有感觉了~ 有一起学韩语的小伙伴吗？' },
    { user_id: demoUser.id, content: '今天学了10个新英语单词，感觉词汇量在慢慢提升。推荐大家用词根词缀记忆法，真的很高效！' },
    { user_id: sakuraUser.id, content: '打卡第12天！日语语法越来越有意思了，て形和た形的变化也慢慢熟练了。坚持就是胜利💪' },
    { user_id: minjunUser.id, content: '刚刚完成了韩语入门第一阶段，开心！明天开始学习更多日常对话。' },
    { user_id: demoUser.id, content: '分享一个学习小技巧：把单词贴在家里的物品上，每天都能看到，不知不觉就记住了。' },
    { user_id: sakuraUser.id, content: '今天看了一集日本动漫，发现居然能听懂一些单词了！好有成就感，继续加油学习~' },
  ];

  for (const p of postsData) {
    insert<CommunityPost>('community_posts', {
      user_id: p.user_id,
      content: p.content,
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      created_at: now,
    });
  }

  const listeningMaterials = [
    { language: 'en', level: 'beginner', title: 'Daily Conversation: Greetings', audio_url: '', 
      transcript: 'A: Good morning! How are you today?\nB: I\'m fine, thank you. And you?\nA: I\'m great, thanks. It\'s a nice day today.\nB: Yes, it is. Are you going to work?\nA: Yes, I am. Have a good day!\nB: You too! See you later.',
      translation: 'A：早上好！你今天怎么样？\nB：我很好，谢谢。你呢？\nA：我也很好，谢谢。今天天气真好。\nB：是的。你要去上班吗？\nA：是的。祝你今天愉快！\nB：你也是！回头见。',
      duration: 60 },
    { language: 'en', level: 'beginner', title: 'At the Restaurant', audio_url: '',
      transcript: 'A: Welcome! How many people?\nB: Two, please.\nA: This way, please.\nB: Thank you.\nA: Can I take your order?\nB: Yes, I\'d like a hamburger and a cola.\nA: For here or to go?\nB: For here, please.',
      translation: 'A：欢迎光临！几位？\nB：两位。\nA：这边请。\nB：谢谢。\nA：您要点餐吗？\nB：是的，我要一个汉堡和一杯可乐。\nA：在这吃还是带走？\nB：在这吃。',
      duration: 75 },
    { language: 'ja', level: 'beginner', title: '日常会話：挨拶', audio_url: '',
      transcript: 'A：おはようございます。元気ですか？\nB：はい、元気です。あなたは？\nA：私も元気です。いい天気ですね。\nB：ええ、本当です。どこへ行きますか？\nA：学校へ行きます。いってきます。\nB：いってらっしゃい。',
      translation: 'A：早上好。你好吗？\nB：是的，我很好。你呢？\nA：我也很好。天气真好啊。\nB：是啊，真的。你要去哪里？\nA：我去学校。我走了。\nB：路上小心。',
      duration: 70 },
    { language: 'ja', level: 'beginner', title: 'レストランで', audio_url: '',
      transcript: 'A：いらっしゃいませ。何名様ですか？\nB：二人です。\nA：こちらへどうぞ。\nB：ありがとうございます。\nA：ご注文は？\nB：ラーメンをお願いします。\nA：かしこまりました。少々お待ちください。',
      translation: 'A：欢迎光临。几位？\nB：两位。\nA：这边请。\nB：谢谢。\nA：请问点什么？\nB：请给我拉面。\nA：好的，请稍等。',
      duration: 65 },
    { language: 'ko', level: 'beginner', title: '일상 대화: 인사', audio_url: '',
      transcript: 'A: 안녕하세요! 오늘 기분이 어때요?\nB: 좋아요. 당신은요?\nA: 저도 좋아요. 날씨가 정말 좋네요.\nB: 네, 그래요. 어디 가요?\nA: 학교에 가요. 가봐요!\nB: 네, 잘 다녀오세요!',
      translation: 'A：你好！今天心情怎么样？\nB：很好。你呢？\nA：我也很好。天气真好啊。\nB：是啊。你去哪里？\nA：我去学校。我走啦！\nB：好的，路上小心！',
      duration: 70 },
    { language: 'ko', level: 'beginner', title: '식당에서', audio_url: '',
      transcript: 'A: 어서 오세요. 몇 명이에요?\nB: 두 명이에요.\nA: 이쪽으로 오세요.\nB: 감사합니다.\nA: 뭐 시키시겠어요?\nB: 김밥이랑 라면 주세요.\nA: 네, 알겠습니다. 잠시만 기다리세요.',
      translation: 'A：欢迎光临。几位？\nB：两位。\nA：这边请。\nB：谢谢。\nA：您要点什么？\nB：请给我紫菜包饭和拉面。\nA：好的，请稍等。',
      duration: 65 },
  ];

  for (const m of listeningMaterials) {
    insert<ListeningMaterial>('listening_materials', m);
  }

  const speakingSentences = [
    { language: 'en', level: 'beginner', sentence: 'Hello, nice to meet you!', translation: '你好，很高兴认识你！', audio_url: '' },
    { language: 'en', level: 'beginner', sentence: 'Thank you very much for your help.', translation: '非常感谢你的帮助。', audio_url: '' },
    { language: 'en', level: 'beginner', sentence: 'I\'m sorry, I don\'t understand.', translation: '对不起，我没听懂。', audio_url: '' },
    { language: 'en', level: 'beginner', sentence: 'Could you speak more slowly?', translation: '你能说慢一点吗？', audio_url: '' },
    { language: 'en', level: 'beginner', sentence: 'I want to learn English well.', translation: '我想学好英语。', audio_url: '' },
    { language: 'en', level: 'beginner', sentence: 'What does this word mean?', translation: '这个单词是什么意思？', audio_url: '' },
    { language: 'en', level: 'beginner', sentence: 'Let\'s practice together.', translation: '我们一起练习吧。', audio_url: '' },
    { language: 'en', level: 'beginner', sentence: 'How do you say this in English?', translation: '这个用英语怎么说？', audio_url: '' },
    { language: 'ja', level: 'beginner', sentence: 'はじめまして、よろしくお願いします。', translation: '初次见面，请多关照。', audio_url: '' },
    { language: 'ja', level: 'beginner', sentence: 'ありがとうございます。', translation: '非常感谢。', audio_url: '' },
    { language: 'ja', level: 'beginner', sentence: 'すみません、わかりません。', translation: '对不起，我不明白。', audio_url: '' },
    { language: 'ja', level: 'beginner', sentence: 'もう一度ゆっくり言ってください。', translation: '请再慢一点说一遍。', audio_url: '' },
    { language: 'ja', level: 'beginner', sentence: '日本語を上手になりたいです。', translation: '我想学好日语。', audio_url: '' },
    { language: 'ja', level: 'beginner', sentence: 'この言葉はどういう意味ですか？', translation: '这个词是什么意思？', audio_url: '' },
    { language: 'ko', level: 'beginner', sentence: '안녕하세요, 만나서 반갑습니다.', translation: '你好，很高兴见到你。', audio_url: '' },
    { language: 'ko', level: 'beginner', sentence: '정말 감사합니다.', translation: '非常感谢。', audio_url: '' },
    { language: 'ko', level: 'beginner', sentence: '죄송해요, 잘 모르겠어요.', translation: '对不起，我不太懂。', audio_url: '' },
    { language: 'ko', level: 'beginner', sentence: '다시 천천히 말해 주세요.', translation: '请再慢一点说一遍。', audio_url: '' },
    { language: 'ko', level: 'beginner', sentence: '한국어를 잘 하고 싶어요.', translation: '我想学好韩语。', audio_url: '' },
    { language: 'ko', level: 'beginner', sentence: '이 단어는 무슨 뜻이에요?', translation: '这个单词是什么意思？', audio_url: '' },
  ];

  for (const s of speakingSentences) {
    insert<SpeakingSentence>('speaking_sentences', s);
  }

  console.log('Database seeded successfully');
}
