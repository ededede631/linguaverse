(function () {
  "use strict";

  const VERSION = "20260702e";
  const STORE_KEY = "linguaverse_learning_state_v2";
  const CONTEXT_KEY = "linguaverseCourseContext";
  const FILTER_KEY = "linguaverseCourseLanguageFilter";
  const toastId = "linguaverse-toast";
  const modalId = "linguaverse-modal";
  const langCode = { 英语: "en-US", 日语: "ja-JP", 韩语: "ko-KR" };

  const packs = {
    英语: {
      初级: {
        words: [["hello", "/həˈloʊ/", "你好", "Hello, nice to meet you."], ["family", "/ˈfæməli/", "家庭", "My family is very warm."], ["school", "/skuːl/", "学校", "The school is near my home."], ["teacher", "/ˈtiːtʃər/", "老师", "Our teacher speaks clearly."], ["time", "/taɪm/", "时间", "What time is it now?"], ["friend", "/frend/", "朋友", "She is my best friend."], ["book", "/bʊk/", "书", "I read a book every day."], ["water", "/ˈwɔːtər/", "水", "Please give me some water."], ["food", "/fuːd/", "食物", "The food is delicious."], ["morning", "/ˈmɔːrnɪŋ/", "早晨", "Good morning!"], ["evening", "/ˈiːvnɪŋ/", "傍晚", "Good evening!"], ["name", "/neɪm/", "名字", "My name is Tom."], ["student", "/ˈstuːdnt/", "学生", "I am a student."], ["happy", "/ˈhæpi/", "开心的", "I am very happy today."], ["big", "/bɪɡ/", "大的", "This is a big city."], ["small", "/smɔːl/", "小的", "I have a small cat."], ["good", "/ɡʊd/", "好的", "That's a good idea."], ["new", "/nuː/", "新的", "I bought a new phone."], ["work", "/wɜːrk/", "工作", "I go to work by bus."], ["study", "/ˈstʌdi/", "学习", "I study English every day."]],
        grammar: [["Be 动词", "am/is/are 随主语变化。", "She is a teacher.", "选择正确形式：She ___ a teacher.", ["is", "am", "are", "be"]], ["一般现在时", "表达习惯、事实或经常发生的动作。", "He studies English every day.", "选择正确形式：He ___ English.", ["studies", "study", "studying", "studied"]], ["冠词", "a/an 表泛指，the 表特指。", "I have a book.", "选择正确冠词：___ apple", ["an", "a", "the", "不填"]], ["人称代词", "主格作主语，宾格作宾语。", "I love her.", "选择正确形式：___ am a student.", ["I", "Me", "My", "Mine"]], ["物主代词", "形容词性后接名词，名词性单独用。", "This is my book.", "选择正确形式：This is ___ pen.", ["my", "I", "me", "mine"]], ["介词 in/on/at", "in 大时间/大地点，on 具体某天，at 点时间/小地点。", "I get up at 7.", "选择正确介词：I was born ___ 1990.", ["in", "on", "at", "for"]], ["祈使句", "动词原形开头，表示命令或请求。", "Please open the door.", "选择正确形式：___ quiet, please.", ["Be", "Is", "Are", "Being"]], ["名词复数", "一般加 s，以 s/x/ch/sh 结尾加 es。", "I have two books.", "选择正确形式：There are three ___.", ["boxes", "boxs", "box", "boxies"]]],
        speaking: [["Hello, my name is Li Ming. Nice to meet you.", "你好，我叫李明。很高兴认识你。", "name is 可自然连读。"], ["Could you speak more slowly, please?", "请你说慢一点好吗？", "Could you 用升调更礼貌。"], ["Good morning! How are you today?", "早上好！你今天怎么样？", "How are you 语调自然。"], ["Thank you very much for your help.", "非常感谢你的帮助。", "Thank you 咬舌音要清楚。"], ["See you tomorrow. Have a nice day!", "明天见，祝你愉快！", "See you 连读更自然。"], ["Excuse me, where is the restroom?", "打扰一下，洗手间在哪？", "Excuse me 升调表示礼貌。"], ["I'm sorry, I don't understand.", "对不起，我没听懂。", "don't 略读 t 音。"]],
        listening: [["Daily greeting", "Good morning. My name is Anna. I study English every day.", "早上好。我叫安娜。我每天学习英语。"], ["Asking time", "Excuse me, what time is the meeting? It starts at half past nine.", "不好意思，会议几点？九点半开始。"], ["At the restaurant", "I would like a sandwich and a cup of tea, please.", "我想要一个三明治和一杯茶。"], ["Introducing yourself", "Hi, I'm Tom. I'm from China. I work in a school.", "你好，我是汤姆。我来自中国。我在学校工作。"], ["Asking for directions", "Excuse me, how do I get to the train station? Go straight and turn left.", "打扰一下，去火车站怎么走？直走然后左转。"], ["On the phone", "Hello, may I speak to Lisa? Sorry, she's not here right now.", "你好，我找莉萨。不好意思，她现在不在。"]]
      },
      中级: {
        words: [["practice", "/ˈpræktɪs/", "练习", "Practice makes progress."], ["travel", "/ˈtrævl/", "旅行", "We plan to travel next month."], ["restaurant", "/ˈrestərɑːnt/", "餐厅", "The restaurant is busy."], ["meeting", "/ˈmiːtɪŋ/", "会议", "The meeting starts at nine."], ["opinion", "/əˈpɪnjən/", "观点", "What is your opinion?"], ["experience", "/ɪkˈspɪriəns/", "经验", "She has ten years of experience."], ["environment", "/ɪnˈvaɪrənmənt/", "环境", "We should protect the environment."], ["opportunity", "/ˌɑːpərˈtuːnəti/", "机会", "This is a great opportunity."], ["culture", "/ˈkʌltʃər/", "文化", "I love Japanese culture."], ["decision", "/dɪˈsɪʒn/", "决定", "It's a difficult decision."], ["important", "/ɪmˈpɔːrtnt/", "重要的", "This is very important."], ["difficult", "/ˈdɪfɪkəlt/", "困难的", "The question is difficult."], ["different", "/ˈdɪfrənt/", "不同的", "They have different ideas."], ["beautiful", "/ˈbjuːtɪfl/", "美丽的", "What a beautiful day!"], ["successful", "/səkˈsesfl/", "成功的", "He is a successful businessman."], ["improve", "/ɪmˈpruːv/", "提升", "I want to improve my English."], ["achieve", "/əˈtʃiːv/", "实现", "You can achieve your dream."], ["suggest", "/səˈdʒest/", "建议", "I suggest you try again."], ["explain", "/ɪkˈspleɪn/", "解释", "Can you explain this word?"], ["describe", "/dɪˈskraɪb/", "描述", "Describe your hometown."]],
        grammar: [["一般过去时", "表达过去发生并结束的动作。", "I visited Beijing last year.", "选择正确形式：I ___ a movie yesterday.", ["watched", "watch", "watches", "watching"]], ["一般将来时", "will 或 be going to 表达未来计划。", "We will meet tomorrow.", "选择正确形式：They ___ travel next week.", ["will", "are", "did", "was"]], ["比较级", "比较两者时用比较级。", "This book is easier than that one.", "选择正确形式：English is ___ than before.", ["easier", "easy", "easiest", "more easy"]], ["现在进行时", "be + doing 表示正在进行的动作。", "She is reading a book.", "选择正确形式：Look! It ___.", ["is raining", "rains", "rained", "rain"]], ["现在完成时", "have/has + 过去分词，表示过去动作对现在的影响。", "I have lived here for 5 years.", "选择正确形式：I ___ this movie already.", ["have seen", "see", "saw", "will see"]], ["情态动词 can/must/should", "can 表能力，must 表必须，should 表建议。", "You should study harder.", "选择正确形式：___ I use your phone?", ["May", "Must", "Should", "Would"]], ["宾语从句", "用陈述语序，注意时态一致。", "I think that he is right.", "选择正确形式：Do you know ___?", ["where he lives", "where does he live", "where he live", "where is he"]], ["被动语态", "be + 过去分词，强调动作承受者。", "The book was written by him.", "选择正确形式：The letter ___ yesterday.", ["was written", "wrote", "is written", "writes"]], ["条件状语从句", "if 引导，主将从现。", "If it rains, we will stay home.", "选择正确形式：If you ___ hard, you will pass.", ["study", "will study", "studied", "studies"]], ["不定式 to do", "表目的或计划。", "I want to learn English.", "选择正确形式：She decided ___ a new job.", ["to take", "take", "taking", "took"]]],
        speaking: [["In my opinion, daily practice is very important.", "在我看来，每日练习非常重要。", "opinion 重音在第二音节。"], ["I would like to order a cup of coffee.", "我想点一杯咖啡。", "would like to 读得连贯。"], ["Could you please explain this grammar point again?", "你能再解释一下这个语法点吗？", "Could you 更礼貌。"], ["I've been studying English for three years.", "我学英语已经三年了。", "have been 连读。"], ["What do you think about this idea?", "你觉得这个想法怎么样？", "think about 连读。"], ["I'm looking forward to meeting you in person.", "我期待与你见面。", "looking forward to 后面跟动名词。"], ["If I have time, I'll definitely come.", "如果有时间我一定来。", "if 从句用现在时。"]],
        listening: [["Restaurant order", "I would like a sandwich and a cup of tea, please.", "我想要一个三明治和一杯茶。"], ["Travel plan", "We are going to visit the museum tomorrow morning.", "我们明天早上打算参观博物馆。"], ["Business meeting", "The meeting will start at 10 o'clock. Please be on time.", "会议十点开始，请准时。"], ["Job interview", "I have three years of experience in marketing.", "我有三年市场工作经验。"], ["Discussing culture", "I'm really interested in traditional Chinese culture.", "我对中国传统文化很感兴趣。"], ["Making suggestions", "Why don't we try the new restaurant downtown?", "我们为什么不试试市中心的新餐厅呢？"]]
      },
      高级: {
        words: [["presentation", "/ˌprezənˈteɪʃən/", "演示", "He gave a presentation."], ["discussion", "/dɪˈskʌʃən/", "讨论", "The discussion was helpful."], ["translate", "/trænzˈleɪt/", "翻译", "Translate the sentence naturally."], ["summary", "/ˈsʌməri/", "总结", "Write a short summary."], ["evidence", "/ˈevɪdəns/", "证据", "Give evidence for your opinion."], ["negotiation", "/nɪˌɡoʊʃiˈeɪʃn/", "谈判", "The negotiation lasted all day."], ["comprehensive", "/ˌkɑːmprɪˈhensɪv/", "全面的", "This is a comprehensive report."], ["consequence", "/ˈkɑːnsɪkwens/", "后果", "Consider the consequences."], ["phenomenon", "/fəˈnɑːmɪnən/", "现象", "This is a natural phenomenon."], ["sophisticated", "/səˈfɪstɪkeɪtɪd/", "复杂精密的", "It's a sophisticated system."], ["ambiguous", "/æmˈbɪɡjuəs/", "模糊的", "The statement is ambiguous."], ["inevitable", "/ɪnˈevɪtəbl/", "不可避免的", "Change is inevitable."], ["substantial", "/səbˈstænʃl/", "大量的", "There's a substantial difference."], ["controversial", "/ˌkɑːntrəˈvɜːrʃl/", "有争议的", "It's a controversial topic."], ["perspective", "/pərˈspektɪv/", "视角", "From my perspective..."], ["accommodate", "/əˈkɑːmədeɪt/", "容纳/适应", "The hotel can accommodate 200 guests."], ["demonstrate", "/ˈdemənstreɪt/", "展示/证明", "Let me demonstrate how it works."], ["acknowledge", "/əkˈnɑːlɪdʒ/", "承认", "He acknowledged his mistake."], ["nevertheless", "/ˌnevərðəˈles/", "然而", "It was raining; nevertheless, we went out."], ["hypothetical", "/ˌhaɪpəˈθetɪkl/", "假设的", "This is a hypothetical situation."]],
        grammar: [["定语从句", "用 who/which/that 修饰名词。", "This is the book that I bought.", "选择正确关系词：The man ___ called is my teacher.", ["who", "what", "where", "when"]], ["虚拟语气", "表达假设或与事实相反的情况。", "If I were you, I would try again.", "选择正确形式：If I ___ you, I would apologize.", ["were", "am", "was", "be"]], ["名词性从句", "主语/宾语/表语/同位语从句，用陈述语序。", "What he said is true.", "选择正确形式：___ he said surprised everyone.", ["What", "That", "Which", "How"]], ["状语从句", "时间、原因、条件、让步等从句。", "Although it was late, he kept working.", "选择正确形式：___ it was raining, we went out.", ["Although", "Because", "If", "Since"]], ["倒装句", "否定词开头/only 开头/so 开头用倒装。", "Never have I seen such a thing.", "选择正确形式：Only then ___ the truth.", ["did I realize", "I realized", "I did realize", "realized I"]], ["非谓语动词", "to do / doing / done 不作谓语。", "Walking in the park is relaxing.", "选择正确形式：___ from the hill, the city looks beautiful.", ["Seen", "Seeing", "To see", "Saw"]], ["主谓一致", "主语和谓语在人称和数上保持一致。", "Neither of them is right.", "选择正确形式：Each of the students ___ a book.", ["has", "have", "having", "to have"]], ["强调句", "It is/was + 被强调部分 + that/who...", "It was yesterday that I met him.", "选择正确形式：It ___ in the park that I saw her.", ["was", "is", "were", "are"]], ["省略与替代", "so/do/did 等替代前文内容。", "I like coffee. So do I.", "选择正确形式：I can swim. ___ .", ["So can I", "So I can", "Neither can I", "I can so"]]],
        speaking: [["I will give a short presentation about language learning.", "我会做一个关于语言学习的简短演示。", "presentation 重音在第三音节。"], ["From my perspective, fluency comes from consistent practice.", "从我的角度看，流利来自持续练习。", "perspective 重音靠后。"], ["Nevertheless, I think we should give it another try.", "不过，我认为我们应该再试一次。", "nevertheless 是正式转折。"], ["It's important to acknowledge different perspectives.", "承认不同的视角很重要。", "acknowledge 重音在第二音节。"], ["To put it simply, the project was a great success.", "简单来说，这个项目非常成功。", "To put it simply 是常用过渡。"], ["There's substantial evidence to support this theory.", "有大量证据支持这个理论。", "substantial 重音在第二音节。"], ["Could you elaborate on that point?", "你能详细说说那一点吗？", "elaborate on 详细阐述。"]],
        listening: [["Presentation", "Today I will talk about my language learning experience.", "今天我将谈谈我的语言学习经验。"], ["Culture", "Language is not only words and grammar. It also shows culture.", "语言不只是词汇和语法，它也体现文化。"], ["Business negotiation", "We need to reach an agreement before the end of this month.", "我们需要在本月底前达成协议。"], ["Academic discussion", "The research provides substantial evidence for the hypothesis.", "这项研究为假设提供了大量证据。"], ["Interview", "Could you tell me about a challenging situation you overcame?", "能说说你克服过的一个有挑战性的情况吗？"], ["Debate", "Nevertheless, there are still many factors we need to consider.", "然而，仍有许多因素需要我们考虑。"]]
      }
    },
    日语: {
      初级: {
        words: [["こんにちは", "konnichiwa", "你好", "こんにちは、田中です。"], ["ありがとう", "arigatou", "谢谢", "ありがとうございます。"], ["家族", "kazoku", "家庭", "私の家族は四人です。"], ["学校", "gakkou", "学校", "学校へ行きます。"], ["先生", "sensei", "老师", "田中先生は優しいです。"]],
        grammar: [["です／ます体", "礼貌体，日常和正式场合使用。", "私は学生です。", "选择正确形式：私は日本人___。", ["です", "だ", "である", "でした"]], ["助词「は」", "提示句子主题，读作 wa。", "私は学生です。", "选择正确助词：私___田中です。", ["は", "が", "を", "に"]], ["助词「を」", "标记动作的直接对象。", "本を読みます。", "选择正确助词：日本語___勉強します。", ["を", "は", "が", "に"]]],
        speaking: [["こんにちは、私は李明です。はじめまして。", "你好，我叫李明。初次见面。", "はじめまして 要完整读出。"], ["もう少しゆっくり話してください。", "请再说慢一点。", "ゆっくり 的促音停顿要清楚。"]],
        listening: [["朝の挨拶", "おはようございます。私は田中です。", "早上好。我是田中。"], ["時間を尋ねる", "すみません、今何時ですか。九時半です。", "不好意思，现在几点？九点半。"]]
      },
      中级: {
        words: [["質問", "shitsumon", "问题", "質問があります。"], ["答え", "kotae", "答案", "答えを教えてください。"], ["聞く", "kiku", "听", "音楽を聞きます。"], ["話す", "hanasu", "说", "日本語を話します。"], ["旅行", "ryokou", "旅行", "京都へ旅行しました。"]],
        grammar: [["动词て形", "连接动作、请求或表示状态。", "食べて、寝ます。", "选择正确形式：行___ください。", ["って", "くて", "きて", "いて"]], ["动词た形", "表示过去或完成。", "昨日、映画を見た。", "选择正确形式：食べ___。", ["た", "て", "る", "ない"]], ["可能态", "表示能力或可能性。", "日本語が話せます。", "选择正确形式：漢字が読___。", ["めます", "みます", "まれます", "みたい"]]],
        speaking: [["コーヒーを一杯、お願いします。", "请给我一杯咖啡。", "お願いします 礼貌结尾。"], ["この文法をもう一度説明してください。", "请再解释一下这个语法点。", "説明 读作せつめい。"]],
        listening: [["レストランで", "サンドイッチと紅茶をお願いします。", "请给我三明治和红茶。"], ["旅行の計画", "明日の朝、博物館へ行く予定です。", "明天早上打算去博物馆。"]]
      },
      高级: {
        words: [["敬語", "keigo", "敬语", "敬語は大切です。"], ["発表", "happyou", "发表", "発表の準備をします。"], ["議論", "giron", "讨论", "議論を交わしましょう。"], ["翻訳", "honyaku", "翻译", "この文章を翻訳してください。"], ["経験", "keiken", "经验", "私の経験を話します。"]],
        grammar: [["尊敬语", "抬高对方或第三方动作。", "先生がいらっしゃいます。", "选择正确表达：先生が___。", ["いらっしゃいます", "参ります", "行く", "来る"]], ["谦让语", "降低自己的动作以表示尊敬。", "私が伺います。", "选择正确表达：私が___。", ["伺います", "いらっしゃいます", "来ます", "来られます"]]],
        speaking: [["明日、短い発表をします。", "我明天会做一个简短演示。", "発表 读作はっぴょう。"], ["本日はお時間をいただき、ありがとうございます。", "感谢您今天抽出时间。", "商务敬语要放慢。"]],
        listening: [["発表", "今日は私の語学学習の経験について話します。", "今天我将谈谈我的语言学习经验。"], ["文化", "言語は単語と文法だけではありません。文化も表しています。", "语言不只是词汇和语法，它也体现文化。"]]
      }
    },
    韩语: {
      初级: {
        words: [["안녕하세요", "annyeonghaseyo", "你好", "안녕하세요, 저는 민수입니다."], ["감사합니다", "gamsahamnida", "谢谢", "도와주셔서 감사합니다."], ["가족", "gajok", "家庭", "우리 가족은 네 명입니다."], ["학교", "hakgyo", "学校", "학교에 갑니다."], ["선생님", "seonsaengnim", "老师", "선생님은 친절하십니다."]],
        grammar: [["은/는 主题助词", "은 用于辅音结尾，는 用于元音结尾。", "저는 학생입니다.", "选择正确形式：그 사람___ 선생님입니다。", ["은", "는", "이", "가"]], ["이/가 主语助词", "이 用于辅音结尾，가 用于元音结尾。", "제가 하겠습니다.", "选择正确形式：누가 ___ 왔어요?", ["가", "이", "은", "는"]], ["을/를 宾语助词", "标记动作对象。", "책을 읽습니다.", "选择正确助词：한국어___ 공부합니다。", ["를", "을", "이", "가"]]],
        speaking: [["안녕하세요, 저는 이밍입니다. 처음 뵙겠습니다.", "你好，我叫李明。初次见面。", "처음 뵙겠습니다 要读得恭敬。"], ["조금 더 천천히 말씀해 주세요.", "请你说慢一点。", "천천히 的节奏要均匀。"]],
        listening: [["아침 인사", "안녕하세요. 저는 김민수입니다.", "你好。我是金敏秀。"], ["시간 묻기", "실례합니다, 지금 몇 시입니까?", "不好意思，现在几点？"]]
      },
      中级: {
        words: [["질문", "jilmun", "问题", "질문이 있습니다."], ["답", "dap", "答案", "답을 알려주세요."], ["듣다", "deutda", "听", "음악을 듣습니다."], ["말하다", "malhada", "说", "한국어를 말합니다."], ["여행", "yeohaeng", "旅行", "서울에 여행했습니다."]],
        grammar: [["过去时 -았/었어요", "词干以ㅏ/ㅗ结尾用 -았어요，其余用 -었어요。", "어제 영화를 봤어요.", "选择正确形式：어제 밥을 먹___。", ["었어요", "았어요", "어요", "아요"]], ["将来时 -(으)ㄹ 거예요", "表示未来计划或推测。", "내일 만날 거예요.", "选择正确形式：다음 주에 여행___。", ["할 거예요", "했어요", "해요", "하다"]], ["进行时 -고 있어요", "表示动作正在进行。", "지금 공부하고 있어요.", "选择正确形式：지금 노래를 듣___。", ["고 있어요", "었어요", "아요", "을 거예요"]]],
        speaking: [["커피 한 잔 주세요.", "请给我一杯咖啡。", "주세요 是礼貌请求。"], ["이 문법을 다시 설명해 주세요.", "请再解释一下这个语法点。", "설명해 读得连贯。"]],
        listening: [["식당에서", "샌드위치와 차 한 잔 주세요.", "请给我三明治和一杯茶。"], ["여행 계획", "내일 아침, 박물관에 갈 예정입니다.", "明天早上打算去博物馆。"]]
      },
      高级: {
        words: [["경어", "gyeongeo", "敬语", "경어는 중요합니다."], ["발표", "balpyo", "发表", "발표 준비를 합니다."], ["토론", "toron", "讨论", "토론을 나눕시다."], ["번역", "beonyeok", "翻译", "이 글을 번역해 주세요."], ["경험", "gyeongheom", "经验", "제 경험을 말씀드리겠습니다."]],
        grammar: [["敬语 -시-", "用于抬高主语。", "선생님께서 오십니다.", "选择正确形式：선생님이 가___。", ["십니다", "습니다", "아요", "었어요"]], ["间接引语", "다고 하다 表示转述。", "그는 바쁘다고 했어요.", "选择正确形式：비가 온___ 했어요。", ["다고", "라고", "고", "에게"]]],
        speaking: [["내일 짧은 발표를 하겠습니다.", "我明天会做一个简短演示。", "하겠습니다 是正式表达。"], ["오늘 시간 내 주셔서 감사합니다.", "感谢您今天抽出时间。", "商务敬语要放慢。"]],
        listening: [["발표", "오늘은 제 언어 학습 경험에 대해 말씀드리겠습니다.", "今天我将谈谈我的语言学习经验。"], ["문화", "언어는 단어와 문법만이 아닙니다. 문화도 보여줍니다.", "语言不只是词汇和语法，它也体现文化。"]]
      }
    }
  };

  const spellChars = {
    日语: { 初级: ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ"], 中级: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ"], 高级: ["日", "月", "山", "田", "人", "水", "火", "木", "金", "土"] },
    韩语: { 初级: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅎ"], 中级: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ", "ㅐ", "ㅔ", "ㅚ", "ㅟ"], 高级: ["각", "난", "달", "물", "학", "한", "글", "말", "집", "책"] },
    英语: { 初级: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), 中级: "abcdefghijklmnopqrstuvwxyz".split(""), 高级: ["th", "sh", "ch", "ph", "tion", "sion", "ough", "able", "ment", "ness"] }
  };

  const videoMap = [
    [/日语.*(五十音|平假名|片假名|入门)/, "BV1Yi4y147FG", "日语零基础入门：五十音、假名、基础词汇与语法"],
    [/日语.*(中级|て形|た形|可能|比较|旅行|购物)/, "BV1Yq4y1B7Mx", "新标准日本语中级：语法与场景会话"],
    [/日语.*(高级|敬语|被动|使役|商务|翻译)/, "BV1KK41167mH", "新标日高级课程：N1与商务日语综合讲解"],
    [/韩语|韩文|한글/, "BV12PoCYEE5n", "韩语全套教程：发音、语法、会话与进阶表达"],
    [/英语.*(字母|发音|26)/, "BV11F411X7d7", "零基础英语26个字母与发音入门"],
    [/英语.*(语法|be动词|现在时|过去时|将来时|冠词|介词|从句|被动|虚拟)/, "BV1YQj76JE3Z", "零基础英语语法系统课程"],
    [/英语|English/, "BV1kC4VeNEHk", "新概念英语第一册零基础入门"]
  ];

  const scenarioPacks = {
    英语: {
      "日常交流": {
        words: [["greeting", "/ˈɡriːtɪŋ/", "问候", "Greetings are important."], ["introduce", "/ˌɪntrəˈdjuːs/", "介绍", "Let me introduce myself."], ["weather", "/ˈweðər/", "天气", "The weather is nice today."], ["hobby", "/ˈhɑːbi/", "爱好", "What's your hobby?"], ["family", "/ˈfæməli/", "家庭", "I have a big family."], ["food", "/fuːd/", "食物", "I love spicy food."], ["shopping", "/ˈʃɑːpɪŋ/", "购物", "Let's go shopping."], ["transport", "/ˈtrænspɔːrt/", "交通", "Public transport is convenient."], ["health", "/helθ/", "健康", "Health is important."], ["appointment", "/əˈpɔɪntmənt/", "预约", "I have an appointment."]],
        dialogues: [["At the café", "A: What would you like to order?\nB: I'll have a coffee and a sandwich, please.\nA: Anything else?\nB: No, that's all. Thank you.", "在咖啡馆：点单基本句型"]]
      },
      "旅游出行": {
        words: [["airport", "/ˈerpɔːrt/", "机场", "We arrived at the airport."], ["hotel", "/hoʊˈtel/", "酒店", "I booked a hotel room."], ["ticket", "/ˈtɪkɪt/", "票", "I bought a ticket."], ["passport", "/ˈpæspɔːrt/", "护照", "Don't forget your passport."], ["luggage", "/ˈlʌɡɪdʒ/", "行李", "My luggage is heavy."], ["direction", "/dəˈrekʃn/", "方向", "Can you give me directions?"], ["restaurant", "/ˈrestərɑːnt/", "餐厅", "Let's find a restaurant."], ["currency", "/ˈkɜːrənsi/", "货币", "What's the local currency?"], ["sightseeing", "/ˈsaɪtsiːɪŋ/", "观光", "We went sightseeing."], ["souvenir", "/ˌsuːvəˈnɪr/", "纪念品", "I bought some souvenirs."]],
        dialogues: [["At the airport", "A: Where is the check-in counter?\nB: It's on the second floor, Gate B.\nA: Thank you very much.\nB: You're welcome. Have a nice flight!", "机场问路：楼层与登机口表达"]]
      },
      "商务职场": {
        words: [["meeting", "/ˈmiːtɪŋ/", "会议", "We have a meeting at 9."], ["deadline", "/ˈdedlaɪn/", "截止日期", "The deadline is Friday."], ["colleague", "/ˈkɑːliːɡ/", "同事", "She's my colleague."], ["presentation", "/ˌpriːzenˈteɪʃn/", "演示", "I gave a presentation."], ["negotiation", "/nɪˌɡoʊʃiˈeɪʃn/", "谈判", "The negotiation went well."], ["contract", "/ˈkɑːntrækt/", "合同", "Please sign the contract."], ["client", "/ˈklaɪənt/", "客户", "The client is happy."], ["report", "/rɪˈpɔːrt/", "报告", "I wrote a report."], ["project", "/ˈprɑːdʒekt/", "项目", "The project is on schedule."], ["interview", "/ˈɪntərvjuː/", "面试", "I have an interview."]],
        dialogues: [["In a meeting", "A: Let's start with the project update.\nB: Sure. We're ahead of schedule.\nA: Great. What about the client feedback?\nB: Very positive overall.", "商务会议：进度汇报与反馈"]]
      }
    },
    日语: {
      "日常交流": {
        words: [["挨拶", "aisatsu", "问候", "朝の挨拶をする。"], ["自己紹介", "jikoshoukai", "自我介绍", "自己紹介をします。"], ["天気", "tenki", "天气", "今日はいい天気ですね。"], ["趣味", "shumi", "爱好", "趣味は読書です。"], ["家族", "kazoku", "家庭", "家族は四人です。"], ["食べ物", "tabemono", "食物", "日本食が好きです。"], ["買い物", "kaimono", "购物", "買い物に行きます。"], ["交通", "koutsuu", "交通", "電車で通勤します。"], ["健康", "kenkou", "健康", "健康に気をつける。"], ["約束", "yakusoku", "约定", "約束を守る。"]],
        dialogues: [["喫茶店で", "A: ご注文は？\nB: コーヒーとサンドイッチをお願いします。\nA: かしこまりました。\nB: よろしくお願いします。", "咖啡馆点单基本句型"]]
      },
      "旅游出行": {
        words: [["空港", "kuukou", "机场", "空港に着きました。"], ["ホテル", "hoteru", "酒店", "ホテルを予約しました。"], ["切符", "kippu", "票", "新幹線の切符を買う。"], ["パスポート", "pasupooto", "护照", "パスポートを忘れないで。"], ["荷物", "nimotsu", "行李", "荷物が重いです。"], ["道順", "michijun", "路线", "道順を教えてください。"], ["レストラン", "resutoran", "餐厅", "レストランを探しています。"], ["通貨", "tsuuka", "货币", "現地の通貨は何ですか？"], ["観光", "kankou", "观光", "京都を観光します。"], ["お土産", "omiyage", "纪念品", "お土産を買いました。"]],
        dialogues: [["駅で", "A: すみません、東京駅はどう行きますか？\nB: 山手線に乗ってください。\nA: ありがとうございます。\nB: いいえ、どういたしまして。", "车站问路：乘坐线路表达"]]
      },
      "商务职场": {
        words: [["会議", "kaigi", "会议", "会議があります。"], ["締め切り", "shimekiri", "截止日期", "締め切りは金曜日です。"], ["同僚", "douryou", "同事", "同僚と話します。"], ["プレゼン", "puresen", "演示", "プレゼンをする。"], ["交渉", "koushou", "谈判", "交渉が上手です。"], ["契約", "keiyaku", "合同", "契約を結ぶ。"], ["取引先", "torihikisaki", "客户", "取引先に挨拶する。"], ["報告", "houkoku", "报告", "上司に報告する。"], ["プロジェクト", "purojekuto", "项目", "プロジェクトが進行中です。"], ["面接", "mensetsu", "面试", "面接を受ける。"]],
        dialogues: [["会議で", "A: プロジェクトの進捗をお願いします。\nB: はい、順調に進んでいます。\nA: クライアントの反応は？\nB: 概ね好評です。", "商务会议：进度汇报"]]
      }
    },
    韩语: {
      "日常交流": {
        words: [["인사", "insa", "问候", "아침 인사를 드려요."], ["자기소개", "jagisogae", "自我介绍", "자기소개를 할게요."], ["날씨", "nalssi", "天气", "오늘 날씨가 좋네요."], ["취미", "chwimi", "爱好", "취미가 뭐예요?"], ["가족", "gajok", "家庭", "가족이 네 명이에요."], ["음식", "eumsik", "食物", "한국 음식을 좋아해요."], ["쇼핑", "syoping", "购物", "쇼핑하러 가요."], ["교통", "gyotong", "交通", "지하철로 다녀요."], ["건강", "geongang", "健康", "건강에 좋아요."], ["약속", "yaksok", "约定", "약속을 지켜요."]],
        dialogues: [["카페에서", "A: 뭐 드릴까요?\nB: 커피랑 샌드위치 주세요.\nA: 네, 알겠습니다.\nB: 감사합니다.", "咖啡馆点单基本句型"]]
      },
      "旅游出行": {
        words: [["공항", "gonghang", "机场", "공항에 도착했어요."], ["호텔", "hotel", "酒店", "호텔을 예약했어요."], ["표", "pyo", "票", "기차표를 샀어요."], ["여권", "yeogwon", "护照", "여권 잊지 마세요."], ["짐", "jim", "行李", "짐이 무거워요."], ["길찾기", "gilchatgi", "找路", "길을 가르쳐 주세요."], ["식당", "sikdang", "餐厅", "식당을 찾고 있어요."], ["화폐", "hwapye", "货币", "현지 화폐가 뭐예요?"], ["관광", "gwangwang", "观光", "서울을 관광해요."], ["기념품", "ginyeompum", "纪念品", "기념품을 샀어요."]],
        dialogues: [["지하철역에서", "A: 실례합니다, 서울역 어떻게 가요?\nB: 2호선 타세요.\nA: 감사합니다.\nB: 아니에요.", "地铁站问路：乘坐线路表达"]]
      },
      "商务职场": {
        words: [["회의", "hoeui", "会议", "회의가 있어요."], ["마감일", "magamir", "截止日期", "마감일이 금요일이에요."], ["동료", "dongnyo", "同事", "동료랑 이야기해요."], ["발표", "balpyo", "演示", "발표를 해요."], ["협상", "hyeopsang", "谈判", "협상이 잘 됐어요."], ["계약", "gyeyak", "合同", "계약을 맺어요."], ["거래처", "georaecheo", "客户", "거래처에 인사드려요."], ["보고", "bogo", "报告", "상사에게 보고해요."], ["프로젝트", "peurojekteu", "项目", "프로젝트가 진행 중이에요."], ["면접", "myeonjeop", "面试", "면접을 봐요."]],
        dialogues: [["회의에서", "A: 프로젝트 진행 상황 보고해 주세요.\nB: 네, 순조롭게 진행되고 있습니다.\nA: 클라이언트 반응은 어때요?\nB: 대체로 좋습니다.", "商务会议：进度汇报"]]
      }
    }
  };

  const badges = [
    { id: "first_learn", name: "初次学习", desc: "完成第一次学习", cond: s => (s.progress && Object.keys(s.progress).length > 0) },
    { id: "streak_3", name: "坚持三天", desc: "连续打卡 3 天", cond: s => (s.checkins || []).length >= 3 },
    { id: "streak_7", name: "坚持一周", desc: "连续打卡 7 天", cond: s => (s.checkins || []).length >= 7 },
    { id: "vocab_10", name: "词汇新星", desc: "生词本达到 10 个", cond: s => (s.vocab || []).length >= 10 },
    { id: "grammar_5", name: "语法达人", desc: "完成 5 道语法题", cond: s => (s.quiz || []).filter(q => q.ok).length >= 5 },
    { id: "spelling_10", name: "书写练习", desc: "在拼写页练习 10 个字符", cond: s => (s.spellingCount || 0) >= 10 },
    { id: "all_modules", name: "全模块探索", desc: "使用过全部 5 个学习模块", cond: s => (s.usedModules || []).length >= 5 }
  ];

  const reviewSchedule = [1, 2, 4, 7, 15];
  const GUIDE_KEY = "linguaverse_guide_shown";
  const SCORE_KEY = "linguaverse_score";

  injectStyles();
  registerSW();
  ready(() => {
    normalizeSpellingRoute();
    patchAll();
    showGuide();
    window.addEventListener("hashchange", () => { normalizeSpellingRoute(); setTimeout(patchAll, 120); });
    new MutationObserver(debounce(patchAll, 120)).observe(document.body, { childList: true, subtree: true });
    setInterval(patchAll, 1200);
    setTimeout(checkBadges, 2000);
  });

  function normalizeSpellingRoute() {
    if ((location.hash || "").includes("/learn/spelling")) {
      location.replace(`${location.pathname}${location.search}#/learn/listening?module=spelling`);
    }
  }

  function patchAll() {
    cleanCopy();
    patchHome();
    patchCourseFilter();
    patchChapter();
    patchLearnModule();
    patchFooter();
    patchVideos();
    patchDashboard();
    bindButtons();
  }

  function ctx() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(CONTEXT_KEY) || "{}"); } catch (_) {}
    const hash = location.hash || "";
    const isLearnRoute = /#\/learn\//.test(hash);
    const isChapterRoute = /#\/courses\/\d+\/chapter\/\d+/.test(hash);
    const isCourseRoute = /#\/courses\/?/.test(hash);

    // 1. 优先从 h1/h2 标题中检测（标题最准确）
    const headings = Array.from(document.querySelectorAll("h1,h2,h3")).map(x => x.textContent.trim()).filter(x => x.length > 0 && x.length < 80);
    const headingText = headings.join(" | ");

    // 2. 统计各语言在标题中的命中次数
    let langFromHeading = "";
    const headingScores = { 英语: 0, 日语: 0, 韩语: 0 };
    if (/英语|English|🇬🇧|🇺🇸/.test(headingText)) headingScores.英语 += 3;
    if (/日语|日本|🇯🇵|平假名|片假名|五十音|漢字/.test(headingText)) headingScores.日语 += 3;
    if (/韩语|韩文|한글|🇰🇷|收音|韩文字母/.test(headingText)) headingScores.韩语 += 3;
    const maxHeadingScore = Math.max(...Object.values(headingScores));
    if (maxHeadingScore > 0) {
      langFromHeading = Object.keys(headingScores).find(k => headingScores[k] === maxHeadingScore) || "";
    }

    // 3. 学习模块路由：优先用 saved context
    let language = "";
    if (isLearnRoute) {
      language = saved.language || "英语";
    }
    // 4. 章节路由：优先用标题，其次用 saved
    else if (isChapterRoute) {
      language = langFromHeading || saved.language || "英语";
    }
    // 5. 课程列表页：从筛选或标题判断
    else if (isCourseRoute) {
      const filterLang = localStorage.getItem(FILTER_KEY) || "";
      language = filterLang || langFromHeading || saved.language || "英语";
    }
    // 6. 其他页面：综合判断
    else {
      // 全文本检测，但用计数而非简单匹配
      const fullText = `${headingText} ${document.body.innerText || ""}`;
      const scores = { 英语: 0, 日语: 0, 韩语: 0 };
      // 用更明确的关键词来计数
      const enKeywords = ["英语", "English", "单词", "语法", "口语", "听力", "拼写"];
      const jpKeywords = ["日语", "日本", "平假名", "片假名", "五十音", "です", "ます", "漢字", "仮名"];
      const krKeywords = ["韩语", "韩文", "한글", "收音", "韩文字母", "습니다", "ㅇㅁㄴㄷㄹ"];
      enKeywords.forEach(k => { if (fullText.includes(k)) scores.英语++; });
      jpKeywords.forEach(k => { if (fullText.includes(k)) scores.日语++; });
      krKeywords.forEach(k => { if (fullText.includes(k)) scores.韩语++; });
      // 标题命中权重更高
      scores[langFromHeading] = (scores[langFromHeading] || 0) + 5;
      const maxScore = Math.max(...Object.values(scores));
      if (maxScore > 0) {
        language = Object.keys(scores).find(k => scores[k] === maxScore) || saved.language || "英语";
      } else {
        language = saved.language || "英语";
      }
    }

    // 级别检测
    let level = saved.level || "初级";
    const levelText = `${headingText} ${hash}`;
    if (/高级|精通|N1|商务/.test(levelText)) level = "高级";
    else if (/中级|进阶|N2|N3/.test(levelText)) level = "中级";

    const courseTitle = headings.find(x => /英语|日语|韩语|第\s*\d+\s*章/.test(x)) || `${language}${level}课程`;
    const c = { language, level, courseTitle };

    // 只在有明确依据时才更新 saved context，避免误判覆盖
    if (langFromHeading || isLearnRoute || isChapterRoute) {
      try { localStorage.setItem(CONTEXT_KEY, JSON.stringify(c)); } catch (_) {}
    }
    return c;
  }

  function pack(c) {
    return packs[c.language]?.[c.level] || packs[c.language]?.初级 || packs.英语.初级;
  }

  function getState() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (_) { return {}; }
  }

  function setState(fn) {
    const s = getState();
    s.progress ||= {};
    s.vocab ||= [];
    s.quiz ||= [];
    s.checkins ||= [];
    fn(s);
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
    document.getElementById("lv-dashboard")?.remove();
    patchDashboard();
  }

  function cleanCopy() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      let v = n.nodeValue.replaceAll("静态演示版", "正式学习版").replaceAll("演示数据", "学习数据").replaceAll("Demo", "学习版").replaceAll("demo", "学习版");
      v = v.replaceAll("趣味互动学习模块", "阶段化学习工具").replaceAll("（以下为演示评价）", "学习者反馈").replaceAll("和百万小伙伴一起学习", "和学习伙伴一起交流");
      v = v.replaceAll("配合艾宾浩斯复习曲线，效率提升好多。", "配合生词本和错题复盘，复习更方便。");
      if (/^\s*(1\.2万\+|8千\+|6千\+)\s*学习者\s*$/.test(v) || /^\s*系统化\s*学习者\s*$/.test(v)) v = "系统化学习路径";
      else v = v.replaceAll("1.2万+", "系统化").replaceAll("8千+", "系统化").replaceAll("6千+", "系统化");
      if (v !== n.nodeValue) n.nodeValue = v;
    });
  }

  function patchHome() {
    if (!/^#\/?$/.test(location.hash || "#/")) return;
    document.querySelectorAll("h1,h2,h3").forEach(h => {
      if (/四大互动学习模块/.test(h.textContent)) {
        const section = h.closest("section") || h.parentElement?.parentElement;
        if (section) section.style.display = "none";
      }
    });
    const root = document.querySelector("main") || document.body;
    Array.from(document.querySelectorAll("section,div")).forEach(el => {
      const t = el.innerText || "";
      if (t.includes("3万+") && t.includes("满意度") && t.length < 500) el.style.display = "none";
      if (t.includes("今日学习目标") && t.includes("累计单词") && t.length < 500) el.style.display = "none";
    });
    document.querySelectorAll("p,span,div").forEach(el => {
      const t = (el.textContent || "").trim();
      if (/^(1\.2万\+|8千\+|6千\+)\s*学习者$/.test(t)) el.textContent = "系统化学习路径";
      if (/^系统化\s*学习者$/.test(t)) el.textContent = "系统化学习路径";
      if (/^(3万\+|10万\+|98%)$/.test(t)) el.closest("section,div")?.setAttribute("data-lv-hide-stat", "1");
    });
    document.querySelectorAll("[data-lv-hide-stat='1']").forEach(el => {
      const t = el.innerText || "";
      if (t.includes("注册用户") || t.includes("满意度") || t.includes("学习时长")) el.style.display = "none";
    });
    if (!document.getElementById("lv-position-panel")) {
      root.insertAdjacentHTML("afterbegin", `<section id="lv-position-panel" class="lv-panel lv-hero"><div><span class="lv-chip">能力补强</span><h2>已从展示页升级为轻量学习工具</h2><p>新增本地学习记录、生词本、错题复盘、打卡、章节闭环、触屏手写、移动端优化、离线缓存、隐私与版权说明。账号云同步、AI发音评分、客服、ICP备案和正版内容库仍需要后端与正式运营资质。</p><div class="lv-flow"><span class="lv-chip" style="background:#ecfeff;color:#0369a1">英语 / 日语 / 韩语</span><span class="lv-chip" style="background:#fef3c7;color:#92400e">初级 / 中级 / 高级</span><span class="lv-chip" style="background:#dcfce7;color:#166534">5 大学习模块</span><span class="lv-chip" style="background:#fce7f3;color:#9d174d">离线可用</span></div></div><div style="display:flex;flex-direction:column;gap:10px;white-space:nowrap"><button class="lv-primary" data-lv-open="roadmap">查看升级边界</button><button class="lv-ghost" data-lv-open="help">使用教程</button><button class="lv-ghost" data-lv-open="access">访问帮助</button><button class="lv-ghost" data-lv-open="about">关于本站</button></div></section>`);
    }
    document.querySelectorAll("a,button").forEach(el => {
      if (el.dataset.lvLangEntry) return;
      const text = el.textContent || "";
      const lang = /英语|English|🇬🇧|🇺🇸/.test(text) ? "英语" : /日语|日本|🇯🇵/.test(text) ? "日语" : /韩语|韩国|🇰🇷/.test(text) ? "韩语" : "";
      if (!lang) return;
      el.dataset.lvLangEntry = lang;
      el.addEventListener("click", e => {
        if (!/课程|英语|日语|韩语|English|日本|韩国/.test(text)) return;
        e.preventDefault();
        localStorage.setItem(FILTER_KEY, lang);
        location.hash = "#/courses";
        toast(`已自动筛选${lang}课程。`);
      }, true);
    });
  }

  function patchCourseFilter() {
    if (!/^#\/courses\/?$/.test(location.hash || "")) return;
    const lang = localStorage.getItem(FILTER_KEY) || "";
    if (!lang) return;
    if (!document.getElementById("lv-filter-banner")) {
      const h = Array.from(document.querySelectorAll("h1,h2")).find(x => /课程/.test(x.textContent));
      h?.insertAdjacentHTML("afterend", `<div id="lv-filter-banner" class="lv-panel">当前筛选：${lang}课程 <button class="lv-ghost" data-lv-clear-filter="1">查看全部</button></div>`);
    }
    document.querySelectorAll("article,a,.rounded-2xl,.rounded-3xl").forEach(card => {
      const t = card.innerText || "";
      if (t.length > 900 || !/(英语|日语|韩语|🇬🇧|🇯🇵|🇰🇷)/.test(t)) return;
      const l = /韩语|🇰🇷/.test(t) ? "韩语" : /日语|🇯🇵/.test(t) ? "日语" : /英语|🇬🇧/.test(t) ? "英语" : "";
      if (l && l !== lang) card.style.display = "none";
    });
  }

  function patchChapter() {
    if (!/#\/courses\/\d+\/chapter\/\d+/.test(location.hash)) return;
    const c = ctx(), d = pack(c);
    const root = Array.from(document.querySelectorAll(".container,main,section")).find(x => /学习内容|课后练习|知识点/.test(x.innerText || "")) || document.querySelector("main");
    if (!root || root.dataset.lvChapter === VERSION) return;
    root.dataset.lvChapter = VERSION;
    const knowledge = buildKnowledge(c, root.innerText || "");
    fixCounts(root, knowledge.length, d.words.length, d.grammar.length);

    // 修复原始页面课文内容可能的排版问题
    const textEls = root.querySelectorAll("p,div,span");
    textEls.forEach(el => {
      if (el.children.length === 0 && el.textContent.length > 50) {
        el.style.whiteSpace = "normal";
        el.style.wordBreak = "break-word";
        el.style.lineHeight = "1.9";
      }
    });

    root.insertAdjacentHTML("beforeend", `<div id="lv-learning-loop" class="lv-panel"><h3>完整学习闭环</h3><div class="lv-flow"><span>预习</span><span>学习</span><span>练习</span><span>测试</span><span>复习</span></div><div class="lv-grid two"><div><h4>知识点（${knowledge.length}个）</h4>${knowledge.map(x => `<p><b>${esc(x[0])}</b>：${esc(x[1])}</p>`).join("")}</div><div><h4>重点词汇（${d.words.length}个）</h4>${d.words.map(w => wordRow(w, c.language)).join("")}</div></div><h4>练习题（${d.grammar.length}道）</h4>${d.grammar.map((g, i) => question(g, i)).join("")}<div class="lv-actions"><button class="lv-primary" data-lv-complete="chapter">标记本章完成</button><button class="lv-ghost" data-lv-open="review">打开复盘</button></div></div>`);
  }

  function fixCounts(root, k, v, e) {
    root.querySelectorAll("p,span,div,h3,h4").forEach(n => {
      const p = n.parentElement?.innerText || "", txt = n.textContent.trim();
      if (/^\d+\s*个$/.test(txt) && /知识点/.test(p)) n.textContent = `${k} 个`;
      if (/^\d+\s*个$/.test(txt) && /重点词汇/.test(p)) n.textContent = `${v} 个`;
      if (/^\d+\s*道$/.test(txt) && /练习题/.test(p)) n.textContent = `${e} 道`;
      if (/共\s*\d+\s*道/.test(txt)) n.textContent = txt.replace(/共\s*\d+\s*道/, `共 ${e} 道`);
    });
  }

  function buildKnowledge(c, text) {
    if (c.language === "英语") return /字母|发音/.test(text) ? [["元音与辅音", "区分 A/E/I/O/U 与常见辅音发音。"], ["清浊辅音", "用声带振动区分 /p/ 与 /b/。"], ["拼读规律", "用字母组合识别常见读音。"]] : [["句子主干", "先找主语和谓语。"], ["时态标志", "通过时间状语判断时态。"], ["错误复盘", "将错题加入复习清单。"]];
    if (c.language === "日语") return /五十音|平假名|片假名/.test(text) ? [["假名笔顺", "按正确笔顺书写假名。"], ["清音浊音", "掌握か/が、た/だ等差异。"], ["长音促音", "长音拉长一拍，促音停顿一拍。"]] : [["助词功能", "判断は、が、を、に、で的作用。"], ["动词变形", "按一类、二类、三类动词分类变形。"], ["敬体与简体", "按场景选择礼貌程度。"]];
    return [["韩文字母结构", "按初声、中声、终声组合。"], ["收音规则", "掌握七个代表收音。"], ["助词选择", "根据前一音节有无收音选 은/는、이/가。"]];
  }

  function patchLearnModule() {
    const h = location.hash || "";
    const module = h.includes("module=spelling") || h.includes("/learn/spelling") ? "spelling" : h.includes("/learn/vocabulary") ? "vocabulary" : h.includes("/learn/grammar") ? "grammar" : h.includes("/learn/speaking") ? "speaking" : h.includes("/learn/listening") ? "listening" : "";
    if (!module) return;
    const c = ctx(), d = pack(c);
    const root = Array.from(document.querySelectorAll(".container,main")).find(x => /单词记忆|语法练习|口语跟读|听力训练|拼写/.test(x.innerText || "")) || document.querySelector("main") || document.body;
    if (root.dataset.lvModule === `${VERSION}-${module}-${c.language}-${c.level}`) return;
    root.dataset.lvModule = `${VERSION}-${module}-${c.language}-${c.level}`;
    root.className = "container mx-auto py-10 max-w-5xl";
    const names = { vocabulary: "单词记忆", grammar: "语法练习", speaking: "口语跟读", listening: "听力训练", spelling: "拼写练习" };
    root.innerHTML = `<div class="lv-module-head"><span class="lv-chip">${c.language} · ${c.level}</span><h1>${names[module]}</h1><p>内容已按语种和阶段区分，并会写入本地学习记录。</p>${moduleSwitcher(c)}</div>${moduleNav(module)}${renderModule(module, c, d)}<div class="lv-panel" style="margin-top:20px"><h3>更多学习工具</h3><div class="lv-flow"><button class="lv-ghost" data-lv-action="pronounce-test">🎤 发音评测</button><button class="lv-ghost" data-lv-open="scenario">🌍 场景化学习</button><button class="lv-ghost" data-lv-action="review-words">📖 间隔复习</button><button class="lv-ghost" data-lv-open="badges">🏆 勋章墙</button></div></div>`;
    if (module === "spelling") initCanvas(c);
    markUsedModule(module);
  }

  function moduleNav(active) {
    return [["vocabulary", "单词记忆"], ["grammar", "语法练习"], ["speaking", "口语跟读"], ["listening", "听力训练"], ["spelling", "拼写练习"]].map(([k, n], i) => {
      const href = k === "spelling" ? "#/learn/listening?module=spelling" : `#/learn/${k}`;
      return i === 0 ? `<div class="lv-tabs"><a class="${active === k ? "active" : ""}" href="${href}">${n}</a>` : `<a class="${active === k ? "active" : ""}" href="${href}">${n}</a>${i === 4 ? "</div>" : ""}`;
    }).join("");
  }

  function moduleSwitcher(c) {
    return `<div class="lv-switcher"><label>语种 <select data-lv-set-language><option ${c.language === "英语" ? "selected" : ""}>英语</option><option ${c.language === "日语" ? "selected" : ""}>日语</option><option ${c.language === "韩语" ? "selected" : ""}>韩语</option></select></label><label>阶段 <select data-lv-set-level><option ${c.level === "初级" ? "selected" : ""}>初级</option><option ${c.level === "中级" ? "selected" : ""}>中级</option><option ${c.level === "高级" ? "selected" : ""}>高级</option></select></label></div>`;
  }

  function renderModule(module, c, d) {
    if (module === "vocabulary") return `<div class="lv-grid two">${d.words.map(w => `<div class="lv-card">${wordRow(w, c.language)}<button class="lv-primary" data-lv-speak="${esc(w[0])}" data-lv-lang="${c.language}">人声朗读</button><button class="lv-ghost" data-lv-vocab="${esc(w.join("|"))}">加入生词本</button></div>`).join("")}</div>`;
    if (module === "grammar") {
      const mcqs = d.grammar.map((g, i) => question(g, i)).join("");
      const fillBlanks = buildFillBlanks(d);
      const listenWrite = buildListenWrite(d);
      return `<div class="lv-tabs" style="margin-bottom:14px"><a class="active" data-lv-qtype="mcq">选择题</a><a data-lv-qtype="fill">填空题</a><a data-lv-qtype="listen">听写题</a></div><div id="lv-q-mcq" class="lv-list">${mcqs}</div><div id="lv-q-fill" class="lv-list" style="display:none">${fillBlanks}</div><div id="lv-q-listen" class="lv-list" style="display:none">${listenWrite}</div>`;
    }
    if (module === "speaking") return `<div class="lv-list">${d.speaking.map((s, i) => `<div class="lv-card"><h3>${i + 1}. ${esc(s[0])}</h3><p>${esc(s[1])}</p><p class="lv-tip">发音提示：${esc(s[2])}</p><button class="lv-primary" data-lv-speak="${esc(s[0])}" data-lv-lang="${c.language}">播放原音</button><button class="lv-ghost" data-lv-action="pronounce-test">发音评测</button><button class="lv-ghost" data-lv-complete="speaking">标记跟读完成</button></div>`).join("")}</div>`;
    if (module === "listening") return `<div class="lv-list">${d.listening.map((l, i) => `<div class="lv-card"><h3>${i + 1}. ${esc(l[0])}</h3><p class="lv-example">${esc(l[1])}</p><p>${esc(l[2])}</p><button class="lv-primary" data-lv-speak="${esc(l[1])}" data-lv-lang="${c.language}">播放听力</button><button class="lv-ghost" data-lv-open="review">听后复盘</button></div>`).join("")}</div>`;
    return `<div class="lv-card"><div class="lv-spell-layout"><div><h2 id="lv-spell-char"></h2><p id="lv-spell-tip"></p><div class="lv-canvas-wrap"><canvas id="lv-canvas" width="320" height="320"></canvas></div><div class="lv-actions"><button class="lv-primary" id="lv-clear-canvas">清除</button><button class="lv-ghost" id="lv-prev-char">上一个</button><button class="lv-ghost" id="lv-next-char">下一个</button><button class="lv-ghost" id="lv-speak-char">播放发音</button></div></div><div><h3>字符选择</h3><div id="lv-char-grid" class="lv-char-grid"></div></div></div></div>`;
  }

  function buildFillBlanks(d) {
    const sentences = d.grammar.map(g => g[2]);
    const words = d.words.map(w => w[0]);
    const blanks = sentences.slice(0, 5).map((s, i) => {
      const answer = words[i % words.length];
      const display = s.replace(answer, "_____");
      return `<div class="lv-card"><p><b>${i + 1}. ${esc(display)}</b></p><input type="text" placeholder="输入答案…" data-lv-fill="${esc(answer)}" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:12px;margin-top:8px;box-sizing:border-box"><button class="lv-primary" data-lv-check-fill="${esc(answer)}" style="margin-top:8px">提交答案</button></div>`;
    }).join("");
    return blanks || "<p>暂无填空题。</p>";
  }

  function buildListenWrite(d) {
    const items = d.words.slice(0, 5);
    return items.map((w, i) => `<div class="lv-card"><p><b>${i + 1}. 听写练习</b></p><p class="lv-tip">点击播放，写下你听到的单词，然后提交验证。</p><button class="lv-primary" data-lv-speak="${esc(w[0])}" data-lv-lang="${ctx().language}">🔊 播放</button><input type="text" placeholder="写下你听到的…" data-lv-dictation="${esc(w[0])}" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:12px;margin-top:8px;box-sizing:border-box"><button class="lv-ghost" data-lv-check-dictation="${esc(w[0])}" style="margin-top:8px">验证</button></div>`).join("");
  }

  function wordRow(w) {
    return `<div class="lv-word"><div><b>${esc(w[0])}</b><span>${esc(w[1])}</span></div><p>${esc(w[2])}</p><p class="lv-example">${esc(w[3])}</p></div>`;
  }

  function question(g, i) {
    return `<div class="lv-question"><b>${i + 1}. ${esc(g[3])}</b><div>${g[4].map(o => `<button data-lv-answer="${esc(g[4][0])}" data-lv-choice="${esc(o)}">${esc(o)}</button>`).join("")}</div></div>`;
  }

  function initCanvas(c) {
    const canvas = document.getElementById("lv-canvas");
    if (!canvas) return;
    const chars = spellChars[c.language]?.[c.level] || spellChars[c.language]?.初级 || spellChars.英语.初级;
    let index = 0, drawing = false;
    const grid = document.getElementById("lv-char-grid");
    const ctx2 = canvas.getContext("2d");
    grid.innerHTML = chars.map((ch, i) => `<button data-i="${i}">${esc(ch)}</button>`).join("");
    function clear(withGuide = true) {
      ctx2.clearRect(0, 0, 320, 320);
      ctx2.fillStyle = "#f8fafc"; ctx2.fillRect(0, 0, 320, 320);
      ctx2.strokeStyle = "#dbeafe"; ctx2.beginPath(); ctx2.moveTo(160, 0); ctx2.lineTo(160, 320); ctx2.moveTo(0, 160); ctx2.lineTo(320, 160); ctx2.stroke();
      if (withGuide) { ctx2.fillStyle = "rgba(124,58,237,.16)"; ctx2.font = "180px sans-serif"; ctx2.textAlign = "center"; ctx2.textBaseline = "middle"; ctx2.fillText(chars[index], 160, 170); }
    }
    function show() {
      document.getElementById("lv-spell-char").textContent = chars[index];
      document.getElementById("lv-spell-tip").textContent = `${c.language}${c.level}字符书写：支持触屏和鼠标，先临摹参考，再清除独立书写。`;
      grid.querySelectorAll("button").forEach((b, i) => b.classList.toggle("active", i === index));
      clear();
    }
    function pos(e) { const r = canvas.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; return { x: (p.clientX - r.left) * 320 / r.width, y: (p.clientY - r.top) * 320 / r.height }; }
    function start(e) { e.preventDefault(); drawing = true; const p = pos(e); ctx2.beginPath(); ctx2.moveTo(p.x, p.y); }
    function move(e) { if (!drawing) return; e.preventDefault(); const p = pos(e); ctx2.strokeStyle = "#111827"; ctx2.lineWidth = 4; ctx2.lineCap = "round"; ctx2.lineJoin = "round"; ctx2.lineTo(p.x, p.y); ctx2.stroke(); }
    function end() { drawing = false; ctx2.beginPath(); }
    canvas.addEventListener("mousedown", start); canvas.addEventListener("mousemove", move); canvas.addEventListener("mouseup", end); canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", start, { passive: false }); canvas.addEventListener("touchmove", move, { passive: false }); canvas.addEventListener("touchend", end);
    document.getElementById("lv-clear-canvas").onclick = () => clear(false);
    document.getElementById("lv-prev-char").onclick = () => { index = (index - 1 + chars.length) % chars.length; show(); };
    document.getElementById("lv-next-char").onclick = () => { index = (index + 1) % chars.length; show(); setState(s => { s.spellingCount = (s.spellingCount || 0) + 1; }); addScore(1, "书写练习"); };
    document.getElementById("lv-speak-char").onclick = () => speak(chars[index], c.language);
    grid.onclick = e => { const b = e.target.closest("button"); if (b) { index = Number(b.dataset.i); show(); } };
    show();
  }

  function patchFooter() {
    const entries = { 用户协议: "terms", 隐私政策: "privacy", 版权声明: "copyright", 帮助中心: "help", 联系我们: "contact", 公司介绍: "about" };
    document.querySelectorAll("li,a,button,[data-lv-open]").forEach(el => {
      if (el.dataset.lvBound) return;
      const t = (el.textContent || "").trim();
      const type = el.dataset.lvOpen || entries[t];
      if (!type) return;
      el.dataset.lvBound = "1";
      el.style.cursor = "pointer";
      el.addEventListener("click", e => { e.preventDefault(); openInfo(type); }, true);
    });
  }

  function patchVideos() {
    document.querySelectorAll("iframe").forEach(frame => {
      const src = frame.src || frame.getAttribute("src") || "";
      if (!/youtube|youtu\.be|about:blank/.test(src)) return;
      const text = `${ctx().language} ${ctx().level} ${document.body.innerText || ""}`;
      const found = videoMap.find(([re]) => re.test(text)) || videoMap[videoMap.length - 1];
      const box = frame.parentElement;
      if (!box || box.dataset.lvVideo) return;
      box.dataset.lvVideo = "1";
      frame.remove();
      box.innerHTML = `<iframe class="lv-bili" src="https://player.bilibili.com/player.html?bvid=${found[1]}&autoplay=0&page=1&high_quality=1" allowfullscreen="allowfullscreen" scrolling="no" title="${esc(found[2])}"></iframe><p class="lv-video-note">已替换为国内可访问的 B 站公开播放器：${esc(found[2])}</p>`;
    });
  }

  // patchDashboard 定义在文件后部（增强版）

  function bindButtons() {
    document.querySelectorAll("[data-lv-speak]").forEach(b => bind(b, "speak", () => speak(b.dataset.lvSpeak, b.dataset.lvLang)));
    document.querySelectorAll("[data-lv-vocab]").forEach(b => bind(b, "vocab", () => addVocab(b.dataset.lvVocab)));
    document.querySelectorAll("[data-lv-complete]").forEach(b => bind(b, "complete", () => complete(b.dataset.lvComplete)));
    document.querySelectorAll("[data-lv-choice]").forEach(b => bind(b, "choice", () => answer(b)));
    document.querySelectorAll("[data-lv-checkin]").forEach(b => bind(b, "check", checkin));
    document.querySelectorAll("[data-lv-clear-filter]").forEach(b => bind(b, "clear", () => { localStorage.removeItem(FILTER_KEY); location.reload(); }));
    document.querySelectorAll("[data-lv-set-language],[data-lv-set-level]").forEach(sel => bind(sel, "switch", () => {
      const current = ctx();
      const language = document.querySelector("[data-lv-set-language]")?.value || current.language;
      const level = document.querySelector("[data-lv-set-level]")?.value || current.level;
      localStorage.setItem(CONTEXT_KEY, JSON.stringify({ ...current, language, level, courseTitle: `${language}${level}课程` }));
      document.querySelector(".container,main")?.removeAttribute("data-lv-module");
      patchLearnModule();
    }));
    document.querySelectorAll("[data-lv-action]").forEach(b => bind(b, "action", () => handleAction(b.dataset.lvAction)));
    document.querySelectorAll("[data-lv-qtype]").forEach(tab => bind(tab, "qtype", () => {
      const type = tab.dataset.lvQtype;
      document.querySelectorAll("[data-lv-qtype]").forEach(t => t.classList.toggle("active", t.dataset.lvQtype === type));
      ["mcq", "fill", "listen"].forEach(t => {
        const el = document.getElementById(`lv-q-${t}`);
        if (el) el.style.display = t === type ? "" : "none";
      });
    }));
    document.querySelectorAll("[data-lv-check-fill]").forEach(btn => bind(btn, "fillCheck", () => {
      const answer = btn.dataset.lvCheckFill;
      const input = btn.parentElement?.querySelector("input");
      if (!input) return;
      const val = input.value.trim().toLowerCase();
      const ok = val === answer.toLowerCase();
      input.style.borderColor = ok ? "#22c55e" : "#ef4444";
      toast(ok ? "回答正确！" : `答错了，正确答案：${answer}`);
      if (ok) addScore(3, "填空练习");
      setState(s => s.quiz.push({ time: new Date().toISOString(), ok, question: `填空题：${answer}` }));
    }));
    document.querySelectorAll("[data-lv-check-dictation]").forEach(btn => bind(btn, "dictCheck", () => {
      const answer = btn.dataset.lvCheckDictation;
      const input = btn.parentElement?.querySelector("input");
      if (!input) return;
      const val = input.value.trim().toLowerCase();
      const ok = val === answer.toLowerCase();
      input.style.borderColor = ok ? "#22c55e" : "#ef4444";
      toast(ok ? "听写正确！" : `正确答案：${answer}`);
      if (ok) addScore(5, "听写练习");
      setState(s => s.quiz.push({ time: new Date().toISOString(), ok, question: `听写：${answer}` }));
    }));
  }

  function handleAction(action) {
    if (action === "checkin") checkin();
    else if (action === "review-words") showReviewWords();
    else if (action === "pronounce-test") startPronounceTest();
  }

  function bind(el, name, fn) {
    const key = `lv${name}Bound`;
    if (el.dataset[key]) return;
    el.dataset[key] = "1";
    el.addEventListener("click", fn);
    if (el.tagName === "SELECT") el.addEventListener("change", fn);
  }

  function speak(text, language) {
    if (!window.speechSynthesis) return toast("当前浏览器不支持语音朗读。");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode[language] || langCode[ctx().language] || "en-US";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  }

  function addVocab(raw) {
    setState(s => {
      s.vocab ||= [];
      const parts = raw.split("|");
      const word = parts[0] || raw;
      if (!s.vocab.find(v => (typeof v === "string" ? v : v.word) === word)) {
        s.vocab.push({ word: raw, lang: ctx().language, addedAt: new Date().toISOString().slice(0, 10) });
      }
    });
    addScore(2, "加入生词本");
  }

  function complete(type) {
    setState(s => { s.progress[`${location.hash || "home"}:${type}`] = { time: new Date().toISOString(), context: ctx() }; });
    addScore(10, "完成学习");
    toast("已记录学习进度。本版本为本地保存，跨设备云同步需要后端。");
  }

  function answer(btn) {
    const ok = btn.dataset.lvChoice === btn.dataset.lvAnswer;
    btn.classList.add(ok ? "ok" : "bad");
    setState(s => s.quiz.push({ time: new Date().toISOString(), ok, question: btn.closest(".lv-question")?.innerText || "" }));
    if (ok) addScore(5, "答对题目");
    toast(ok ? "回答正确，已计入复盘。" : `答错了，正确答案：${btn.dataset.lvAnswer}。已加入错题复盘。`);
  }

  function checkin() {
    const today = new Date().toISOString().slice(0, 10);
    setState(s => { if (!s.checkins.includes(today)) s.checkins.push(today); });
    addScore(20, "每日打卡");
    toast("今日已打卡。连续打卡统计已保存到本地。");
  }

  function openInfo(type) {
    const s = getState();
    const wrong = (s.quiz || []).filter(x => !x.ok).slice(-5);
    const earned = s.badges || [];
    const c = ctx();
    const scenarios = scenarioPacks[c.language] || scenarioPacks.英语;
    let content = "<p>内容正在完善。</p>";

    if (type === "scenario") {
      const names = Object.keys(scenarios);
      content = `<p><b>${c.language}场景化学习</b> · 贴近生活实用表达</p><div class="lv-tabs" style="margin:12px 0">${names.map((n, i) => `<a class="${i === 0 ? "active" : ""}" data-lv-scenario="${esc(n)}">${esc(n)}</a>`).join("")}</div><div id="lv-scenario-body"></div>`;
      setTimeout(() => {
        const body = document.getElementById("lv-scenario-body");
        const tabs = document.querySelectorAll("[data-lv-scenario]");
        function show(name) {
          const sc = scenarios[name];
          if (!sc || !body) return;
          body.innerHTML = `<h4 style="margin:0 0 10px">核心词汇（${sc.words.length}个）</h4><div class="lv-grid two" style="gap:10px">${sc.words.map(w => `<div class="lv-card" style="padding:12px;margin:0">${wordRow(w)}</div>`).join("")}</div><h4 style="margin:16px 0 10px">情景对话</h4>${sc.dialogues.map(d => `<div class="lv-card" style="padding:14px;margin:0 0 10px"><b>${esc(d[0])}</b><pre style="white-space:pre-wrap;font-family:inherit;margin:8px 0;line-height:1.9;background:#f8fafc;padding:10px;border-radius:10px">${esc(d[1])}</pre><p style="color:#64748b;font-size:13px;margin:0">💡 ${esc(d[2])}</p></div>`).join("")}`;
          tabs.forEach(t => t.classList.toggle("active", t.dataset.lvScenario === name));
        }
        tabs.forEach(t => t.addEventListener("click", () => show(t.dataset.lvScenario)));
        show(names[0]);
      }, 50);
    } else {
      const contents = {
      roadmap: "<p><b>已实现能力（静态站点可落地）：</b></p><ul><li>本地学习记录、生词本、错题复盘、打卡日历、积分勋章系统</li><li>章节闭环学习：视频 + 知识点 + 重点词汇 + 练习</li><li>日语 / 韩语拼写触屏手写练习</li><li>单词记忆、语法练习、口语跟读、听力训练、拼写练习 5 大模块</li><li>英语 / 日语 / 韩语 × 初级 / 中级 / 高级，共 9 套内容</li><li>场景化学习：日常交流、旅游出行、商务职场</li><li>移动端适配、离线缓存、隐私与版权说明</li><li>学习数据导出/导入、间隔复习提醒</li><li>Web Speech 发音评测（基础版）</li></ul><p><b>仍需后端才能真正解决（能力边界）：</b></p><ul><li>账号登录与云端多端同步</li><li>专业客服与工单系统</li><li>AI 发音实时评分（精确评分需后端 AI）</li><li>正版海量内容库与教研团队</li><li>ICP 备案、教育资质、等保与内容风控</li></ul>",
      privacy: "<p>当前版本仅使用浏览器 <code>localStorage</code> 在你的设备本地保存学习记录、生词、错题和打卡数据，不上传任何服务器。</p><p>清除浏览器数据或更换设备会导致记录丢失，请定期导出或截图保存重要内容。</p><p>正式运营版本需要：账号体系、加密传输、完整隐私政策、数据导出与注销机制。</p>",
      terms: "<p>本平台当前为轻量学习辅助网站，不承诺等同于多邻国、扇贝、每日英语听力等成熟商业平台的内容深度与服务质量。</p><p>请结合教材、老师或权威资源进行长期系统学习。本站内容仅供参考，不构成任何考试或职业承诺。</p>",
      copyright: "<p>站内课程文本为自编学习材料，用于个人学习辅助。</p><p>外部视频通过 B 站公开播放器嵌入展示，本站不下载、不搬运、不重新分发视频内容。若视频方限制播放或下架，页面会显示替代说明。</p><p>如任何内容侵犯了你的权益，请通过仓库 Issues 联系，我们会及时处理。</p>",
      help: "<p><b>推荐学习流程：</b></p><ol><li>在首页选择目标语言（英语 / 日语 / 韩语）</li><li>进入课程中心，按初/中/高级选择对应课程</li><li>从第 1 章开始，先看视频讲解，再读知识点和重点词汇</li><li>完成章节配套练习，做错的题自动加入错题复盘</li><li>进入相关学习模块（单词记忆 / 语法 / 口语 / 听力 / 拼写）做专项训练</li><li>每天打卡，次日复习生词本和错题</li></ol><p><b>常见问题：</b></p><ul><li>页面空白或样式错乱 → 按 <code>Ctrl + Shift + R</code> 强制刷新，清理浏览器缓存</li><li>视频无法播放 → 可能是 B 站区域限制或视频下架，可点击视频链接到 B 站查看</li><li>学习记录丢失 → 检查是否清理了浏览器数据或使用了隐身模式</li><li>拼写页手写不灵敏 → 请用手指或触控笔在画布区域书写</li><li>发音评测不可用 → 需要 Chrome/Edge 浏览器并授权麦克风权限</li></ul>",
      contact: "<p>当前没有 7×24 客服系统。问题反馈请通过 GitHub 仓库 Issues 提交。</p><p>正式运营版本需要接入：工单系统、监控告警、故障响应机制、在线客服。</p>",
      about: "<p><b>LinguaVerse</b> 是一个轻量多语言学习工具站点，支持英语、日语、韩语三种语言，按初 / 中 / 高级分级。</p><p>站点从纯展示页面升级为带本地学习记录的实用工具，包含单词记忆、语法练习、口语跟读、听力训练、拼写手写 5 大学习模块。</p><p>所有数据保存在浏览器本地，离线可用（需先访问过一次）。</p>",
      access: "<p><b>访问方式：</b></p><ul><li>主站：GitHub Pages（全球访问，国内部分网络可能较慢）</li><li>备用：可将仓库 Fork 后部署到国内静态托管（如 Vercel 国内节点、Cloudflare Pages、Gitee Pages）以获得更快访问速度</li></ul><p><b>如果打开空白或加载失败：</b></p><ol><li>检查网络是否能正常访问 GitHub</li><li>按 <code>Ctrl + Shift + Delete</code> 清理浏览器缓存和 Cookie</li><li>关闭广告拦截 / 代理 / VPN 后重试</li><li>尝试使用 Chrome / Edge / Firefox 最新版本</li><li>确认地址为 <code>https://ededede631.github.io/linguaverse/</code>（注意末尾 /linguaverse/ 二级路径）</li></ol><p><b>字体与乱码：</b>页面已配置多级中文字体降级（苹方 / 微软雅黑 / 黑体 / 思源黑体 / 文泉驿微米黑），一般不会乱码；如仍显示异常，请检查系统是否安装了中文字体。</p>",
      review: `${wrong.length ? wrong.map(x => `<p>${esc(x.question).slice(0, 180)}</p>`).join("") : "<p>暂无错题。完成语法练习后会自动记录。</p>"}<p><b>生词数：</b>${(s.vocab || []).length} 个；<b>完成项：</b>${Object.keys(s.progress || {}).length} 项。</p><p style="margin-top:12px"><button class="lv-primary" onclick="window.__lvExport && window.__lvExport()">导出学习数据</button> <button class="lv-ghost" onclick="window.__lvImport && window.__lvImport()">导入数据</button></p>`,
      badges: `<p><b>我的勋章（${earned.length} / ${badges.length}）</b></p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:12px">${badges.map(b => {
        const got = earned.includes(b.id);
        return `<div style="padding:14px;border-radius:14px;background:${got ? '#fef3c7' : '#f1f5f9'};text-align:center;border:2px solid ${got ? '#f59e0b' : '#e2e8f0'};opacity:${got ? 1 : 0.6}"><div style="font-size:32px;margin-bottom:6px">${got ? '🏆' : '🔒'}</div><b style="display:block;color:${got ? '#92400e' : '#64748b'}">${esc(b.name)}</b><p style="font-size:12px;color:#64748b;margin:4px 0 0">${esc(b.desc)}</p></div>`;
      }).join("")}</div>`
    };
    content = contents[type] || content;
    }
    const titles = { review: "学习复盘", badges: "勋章墙", scenario: "场景化学习", roadmap: "升级边界", help: "使用教程", access: "访问帮助", about: "关于本站", privacy: "隐私政策", terms: "用户协议", copyright: "版权声明", contact: "联系我们" };
    modal(titles[type] || "说明", content);
  }

  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => navigator.serviceWorker.register("/linguaverse/sw.js?v=" + VERSION).catch(() => {}));
  }

  function showReviewWords() {
    const s = getState();
    const vocab = s.vocab || [];
    if (!vocab.length) { toast("生词本还是空的，先去添加一些单词吧！"); return; }
    const today = new Date().toISOString().slice(0, 10);
    const due = vocab.filter(item => {
      const raw = typeof item === "string" ? item : item.word;
      const added = item.addedAt || today;
      const days = Math.floor((new Date(today) - new Date(added)) / 86400000);
      return reviewSchedule.some(d => d === days) || days > 15 || days === 0;
    });
    const items = due.length ? due : vocab.slice(0, 5);
    const html = `<p><b>今日复习（${items.length} 个）</b> · 间隔复习：第 ${reviewSchedule.join("、")} 天</p><div style="display:grid;gap:10px;margin-top:10px">${items.map((item, i) => {
      const raw = typeof item === "string" ? item : item.word;
      const parts = raw.split("|");
      const word = parts[0] || raw;
      const meaning = parts[2] || "";
      return `<div class="lv-card" style="padding:12px;margin:0"><b>${esc(word)}</b>${parts[1] ? ` <span style="color:#7c3aed">${esc(parts[1])}</span>` : ''}${meaning ? ` <p style="margin:4px 0 0;color:#475569">${esc(meaning)}</p>` : ''}<div style="margin-top:8px"><button class="lv-primary" data-lv-speak="${esc(word)}" data-lv-lang="${ctx().language}" style="padding:6px 12px;font-size:13px">朗读</button> <button class="lv-ghost" onclick="this.parentElement.parentElement.querySelector('p').style.display=this.parentElement.parentElement.querySelector('p').style.display==='none'?'block':'none'" style="padding:6px 12px;font-size:13px">显示/隐藏释义</button></div></div>`;
    }).join("")}</div><p style="margin-top:12px;color:#64748b;font-size:13px">提示：先遮住释义回忆，再点击显示验证。坚持复习记忆更牢固！</p>`;
    modal("间隔复习", html);
    setTimeout(bindButtons, 50);
  }

  let recognizeInstance = null;
  function startPronounceTest() {
    const c = ctx();
    const d = pack(c);
    const words = d.words || [];
    if (!words.length) { toast("暂无单词可供练习"); return; }
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast("当前浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器。");
      return;
    }
    const target = words[Math.floor(Math.random() * words.length)];
    const word = target[0];
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    try {
      if (recognizeInstance) { try { recognizeInstance.stop(); } catch (_) {} }
      const rec = new SR();
      rec.lang = langCode[c.language] || "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      let finished = false;
      const html = `<p><b>发音评测（基础版）</b></p><p>目标单词：<span style="font-size:24px;font-weight:700;color:#7c3aed">${esc(word)}</span> <button class="lv-ghost" data-lv-speak="${esc(word)}" data-lv-lang="${c.language}" style="padding:4px 10px;font-size:13px">听原音</button></p><p style="color:#64748b">点击下方按钮开始录音，读出这个单词，系统会对比识别结果。</p><p id="lv-pron-status" style="text-align:center;padding:20px;background:#f8fafc;border-radius:12px">准备就绪，点击「开始录音」</p><div style="display:flex;gap:10px;justify-content:center;margin-top:12px"><button class="lv-primary" id="lv-pron-start">开始录音</button> <button class="lv-ghost" id="lv-pron-next">换一个</button></div><p style="font-size:12px;color:#94a3b8;margin-top:10px">基础版基于浏览器 Web Speech API，识别准确度受环境和浏览器影响，仅供参考。精确评分需后端 AI 引擎。</p>`;
      modal("发音评测", html);
      setTimeout(() => {
        bindButtons();
        const startBtn = document.getElementById("lv-pron-start");
        const nextBtn = document.getElementById("lv-pron-next");
        const statusEl = document.getElementById("lv-pron-status");
        if (startBtn) startBtn.onclick = () => {
          if (finished) return;
          statusEl.textContent = "正在听，请朗读…";
          statusEl.style.background = "#fef3c7";
          try {
            rec.start();
          } catch (e) {
            statusEl.textContent = "启动失败，请检查麦克风权限。";
            statusEl.style.background = "#fee2e2";
          }
        };
        if (nextBtn) nextBtn.onclick = () => {
          try { rec.stop(); } catch (_) {}
          startPronounceTest();
        };
        rec.onresult = (e) => {
          finished = true;
          const results = Array.from(e.results[0]).map(r => r.transcript.trim().toLowerCase());
          const targetLower = word.toLowerCase();
          let bestScore = 0;
          let bestMatch = "";
          results.forEach(r => {
            const rLower = r.toLowerCase();
            let common = 0;
            const targetChars = new Set(targetLower);
            for (const ch of rLower) if (targetChars.has(ch)) common++;
            const score = Math.round(common / Math.max(targetLower.length, rLower.length) * 100);
            if (score > bestScore) { bestScore = score; bestMatch = r; }
            if (rLower === targetLower) bestScore = 100;
          });
          let level = "继续加油", color = "#fee2e2";
          if (bestScore >= 90) { level = "非常棒！"; color = "#dcfce7"; }
          else if (bestScore >= 70) { level = "还不错"; color = "#fef3c7"; }
          else if (bestScore >= 50) { level = "再试试"; color = "#ffedd5"; }
          statusEl.innerHTML = `<b>${level}</b><br>识别结果：${esc(bestMatch)}<br>相似度约：${bestScore}%`;
          statusEl.style.background = color;
          if (bestScore >= 70) addScore(5, "发音练习");
        };
        rec.onerror = (e) => {
          finished = true;
          statusEl.textContent = "识别出错：" + (e.error || "未知错误");
          statusEl.style.background = "#fee2e2";
        };
        rec.onend = () => {
          if (!finished) {
            statusEl.textContent = "录音结束，未检测到语音。";
            statusEl.style.background = "#fee2e2";
          }
        };
        recognizeInstance = rec;
      }, 50);
    } catch (e) {
      toast("语音识别初始化失败：" + e.message);
    }
  }

  function injectStyles() {
    if (document.getElementById("lv-styles")) return;
    const st = document.createElement("style");
    st.id = "lv-styles";
    st.textContent = `
      html{font-family:"PingFang SC","Microsoft YaHei","Hiragino Sans GB","Noto Sans CJK SC","Source Han Sans CN","WenQuanYi Micro Hei",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}body{font-family:"PingFang SC","Microsoft YaHei","Hiragino Sans GB","Noto Sans CJK SC","Source Han Sans CN","WenQuanYi Micro Hei",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}.lv-word b,.lv-char-grid button,select,button,input{font-family:inherit}
      html{scroll-behavior:smooth}body{overflow-x:hidden;line-height:1.8;word-break:break-word;word-wrap:break-word}img,video,iframe{max-width:100%}.container{padding-left:16px!important;padding-right:16px!important}
      p,span,div,li{line-height:1.8;word-break:break-word}h1,h2,h3,h4,h5,h6{line-height:1.5}
      /* 修复章节页课文内容排版 */
      .lv-chapter-content p,.lv-chapter-content div,.lv-chapter-content span{white-space:normal!important;word-break:break-word!important;line-height:1.9!important}
      /* 修复原始页面可能的文字挤压 */
      main p, main div, section p, section div{white-space:normal;word-break:break-word}
      .trae-browser-inspect-overlay,.trae-browser-inspect-comment-card-container,.trae-browser-inspect-drop-indicator{display:none!important;pointer-events:none!important;opacity:0!important}.lv-panel,.lv-card{border:1px solid rgba(124,58,237,.14);background:#fff;border-radius:22px;padding:18px;box-shadow:0 10px 30px rgba(15,23,42,.06);margin:16px 0}.lv-hero{display:flex;justify-content:space-between;gap:18px;align-items:center;background:linear-gradient(135deg,#f5f3ff,#ecfeff)}.lv-chip{display:inline-flex;background:#ede9fe;color:#6d28d9;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:700}.lv-primary,.lv-ghost,.lv-question button,.lv-tabs a,#lv-dashboard button,.lv-char-grid button{border-radius:14px;border:1px solid #ddd;padding:9px 12px;cursor:pointer;font-weight:700}.lv-primary{background:#7c3aed;color:white;border-color:#7c3aed}.lv-ghost{background:white;color:#334155}.lv-switcher{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}.lv-switcher label{font-weight:700;color:#334155}.lv-switcher select{margin-left:6px;border:1px solid #ddd;border-radius:12px;padding:7px 10px;background:white}.lv-grid{display:grid;gap:14px}.lv-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.lv-list{display:grid;gap:14px}.lv-word b{font-size:22px;display:block}.lv-word span{color:#7c3aed}.lv-example{color:#475569;background:#f8fafc;border-radius:12px;padding:10px}.lv-tip{color:#0369a1;background:#ecfeff;border-radius:12px;padding:10px}.lv-tabs{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.lv-tabs a{background:white;color:#334155;text-decoration:none}.lv-tabs a.active{background:#7c3aed;color:white}.lv-flow{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.lv-flow span{background:#f1f5f9;border-radius:999px;padding:8px 12px;font-weight:700}.lv-question div{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.lv-question button.ok{background:#dcfce7;border-color:#22c55e}.lv-question button.bad{background:#fee2e2;border-color:#ef4444}.lv-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.lv-bili{width:100%;height:100%;min-height:320px;border:0}.lv-video-note{font-size:13px;color:#64748b}.lv-module-head h1{font-size:34px;margin:8px 0}.lv-spell-layout{display:grid;grid-template-columns:1fr 260px;gap:18px}.lv-canvas-wrap{width:320px;height:320px;max-width:100%;background:#f8fafc;border:1px solid #dbeafe;border-radius:18px;overflow:hidden}.lv-canvas-wrap canvas{width:100%;height:100%;touch-action:none}.lv-char-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.lv-char-grid button.active{background:#7c3aed;color:white}#lv-dashboard{position:fixed;right:18px;bottom:18px;z-index:99997}#lv-dashboard-toggle{background:#7c3aed;color:white;border:0;box-shadow:0 10px 30px rgba(124,58,237,.35)}#lv-dashboard-panel{display:none;width:260px;background:white;border:1px solid #e2e8f0;border-radius:18px;padding:14px;margin-top:10px;box-shadow:0 20px 60px rgba(15,23,42,.18)}#lv-dashboard.open #lv-dashboard-panel{display:block}#${toastId}{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:99999;background:#111827;color:white;border-radius:999px;padding:11px 16px;opacity:0;transition:.2s;max-width:calc(100vw - 32px)}#${toastId}.show{opacity:1}#${modalId}{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:99998;display:none;place-items:center;padding:20px}#${modalId}.show{display:grid}.lv-modal-card{background:white;border-radius:22px;max-width:620px;width:100%;box-shadow:0 24px 80px rgba(15,23,42,.3);overflow:hidden}.lv-modal-head{display:flex;justify-content:space-between;gap:10px;padding:16px 20px;border-bottom:1px solid #e2e8f0}.lv-modal-body{padding:20px;line-height:1.8}.lv-modal-head button{border:0;background:#7c3aed;color:white;border-radius:999px;padding:8px 14px;cursor:pointer}
      @media(max-width:760px){.lv-hero{display:block}.lv-grid.two,.lv-spell-layout{grid-template-columns:1fr}.lv-module-head h1{font-size:28px}.lv-tabs{overflow-x:auto;flex-wrap:nowrap;padding-bottom:6px}.lv-tabs a{white-space:nowrap}.lv-canvas-wrap{width:280px;height:280px}.lv-bili{min-height:220px}#lv-dashboard{right:10px;bottom:10px}#lv-dashboard-panel{width:calc(100vw - 32px)}}`;
    document.head.appendChild(st);
  }

  function toast(msg) {
    let t = document.getElementById(toastId);
    if (!t) { t = document.createElement("div"); t.id = toastId; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function modal(title, html) {
    let m = document.getElementById(modalId);
    if (!m) { m = document.createElement("div"); m.id = modalId; m.onclick = e => { if (e.target === m) m.classList.remove("show"); }; document.body.appendChild(m); }
    m.innerHTML = `<div class="lv-modal-card"><div class="lv-modal-head"><h3>${esc(title)}</h3><button id="lv-modal-close">关闭</button></div><div class="lv-modal-body">${html}</div></div>`;
    m.classList.add("show"); document.getElementById("lv-modal-close").onclick = () => m.classList.remove("show");
  }

  function showGuide() {
    if (localStorage.getItem(GUIDE_KEY)) return;
    const html = `
      <p><b>欢迎来到 LinguaVerse！</b></p>
      <p>这是一个轻量多语言学习工具，所有学习数据保存在你的浏览器本地，不上传服务器。</p>
      <p><b>快速开始：</b></p>
      <ol>
        <li>从首页选择你想学习的语言（英语 / 日语 / 韩语）</li>
        <li>选择对应的初 / 中 / 高级课程，点击开始学习</li>
        <li>每章包含视频、知识点、重点词汇和配套练习</li>
        <li>使用 5 大学习模块专项训练：单词记忆、语法练习、口语跟读、听力训练、拼写手写</li>
        <li>点击右下角「学习记录」查看进度、生词本和错题复盘</li>
      </ol>
      <p><b>小贴士：</b>学习记录自动保存到本地，清理浏览器数据会丢失，建议定期导出备份。</p>
      <p style="text-align:right"><button class="lv-primary" id="lv-guide-ok">我知道了</button></p>`;
    modal("新手引导", html);
    setTimeout(() => {
      const btn = document.getElementById("lv-guide-ok");
      if (btn) btn.onclick = () => { localStorage.setItem(GUIDE_KEY, "1"); document.getElementById(modalId)?.classList.remove("show"); };
    }, 100);
  }

  function getScore() {
    return parseInt(localStorage.getItem(SCORE_KEY) || "0", 10);
  }
  function addScore(points, reason) {
    const s = getScore() + points;
    localStorage.setItem(SCORE_KEY, String(s));
    toast(`+${points} 积分 · ${reason}`);
    checkBadges();
  }

  function checkBadges() {
    const s = getState();
    const earned = s.badges || [];
    const newly = [];
    badges.forEach(b => {
      if (earned.includes(b.id)) return;
      try { if (b.cond(s)) { earned.push(b.id); newly.push(b); } } catch (_) {}
    });
    if (newly.length) {
      s.badges = earned;
      try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (_) {}
      toast(`🎉 获得新勋章：${newly.map(x => x.name).join("、")}`);
    }
  }

  function exportData() {
    const s = getState();
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      progress: s.progress || {},
      vocab: s.vocab || [],
      quiz: s.quiz || [],
      checkins: s.checkins || [],
      badges: s.badges || [],
      score: getScore(),
      spellingCount: s.spellingCount || 0,
      usedModules: s.usedModules || []
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linguaverse-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
    toast("数据已导出，请保存好备份文件。");
  }

  function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          const s = getState();
          if (data.progress) s.progress = { ...s.progress, ...data.progress };
          if (data.vocab) s.vocab = data.vocab;
          if (data.quiz) s.quiz = data.quiz;
          if (data.checkins) s.checkins = data.checkins;
          if (data.badges) s.badges = data.badges;
          if (data.spellingCount) s.spellingCount = data.spellingCount;
          if (data.usedModules) s.usedModules = data.usedModules;
          if (data.score) localStorage.setItem(SCORE_KEY, String(data.score));
          localStorage.setItem(STORE_KEY, JSON.stringify(s));
          toast("数据导入成功！");
          document.getElementById("lv-dashboard")?.remove();
          patchDashboard();
        } catch (e) {
          toast("导入失败：文件格式不正确。");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function getReviewWords() {
    const s = getState();
    const vocab = s.vocab || [];
    const today = new Date().toISOString().slice(0, 10);
    return vocab.filter(item => {
      if (!item.addedAt) return true;
      const days = Math.floor((new Date(today) - new Date(item.addedAt)) / 86400000);
      return reviewSchedule.some(d => d === days || days > 15);
    });
  }

  function addToVocab(word, lang) {
    setState(s => {
      s.vocab ||= [];
      if (s.vocab.find(v => v.word === word)) return;
      s.vocab.push({ word, lang, addedAt: new Date().toISOString().slice(0, 10) });
    });
    addScore(2, "加入生词本");
  }

  function markUsedModule(mod) {
    setState(s => {
      s.usedModules ||= [];
      if (!s.usedModules.includes(mod)) s.usedModules.push(mod);
    });
  }

  function speakText(text, lang) {
    if (!("speechSynthesis" in window)) { toast("当前浏览器不支持语音合成"); return; }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = langCode[lang] || "zh-CN";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (_) {}
  }

  function patchDashboard() {
    if (document.getElementById("lv-dashboard")) return;
    const wrap = document.createElement("div");
    wrap.id = "lv-dashboard";
    const s = getState();
    const wrong = (s.quiz || []).filter(q => !q.ok).length;
    const score = getScore();
    const streak = (s.checkins || []).length;
    const earned = (s.badges || []).length;
    wrap.innerHTML = `
      <button id="lv-dashboard-toggle">学习记录</button>
      <div id="lv-dashboard-panel">
        <p style="margin:4px 0"><b>积分：</b>${score} 分</p>
        <p style="margin:4px 0"><b>打卡：</b>${streak} 天</p>
        <p style="margin:4px 0"><b>生词：</b>${(s.vocab || []).length} 个</p>
        <p style="margin:4px 0"><b>错题：</b>${wrong} 道</p>
        <p style="margin:4px 0"><b>勋章：</b>${earned} / ${badges.length}</p>
        <div style="display:grid;gap:8px;margin-top:10px">
          <button data-lv-open="review">错题复盘</button>
          <button data-lv-open="badges">勋章墙</button>
          <button onclick="window.__lvExport && window.__lvExport()">导出数据</button>
          <button onclick="window.__lvImport && window.__lvImport()">导入数据</button>
          <button data-lv-action="checkin">今日打卡</button>
          <button data-lv-action="review-words">今日复习</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    document.getElementById("lv-dashboard-toggle").onclick = () => wrap.classList.toggle("open");
    window.__lvExport = exportData;
    window.__lvImport = importData;
  }

  function renderFallback() {
    const root = document.getElementById("root");
    if (!root || root.children.length) return;
    document.getElementById("lv-loading")?.classList.add("hidden");
    const fb = document.getElementById("lv-fallback");
    if (fb) { fb.classList.add("show"); return; }
    root.innerHTML = `
      <div style="max-width:560px;margin:60px auto;padding:24px;background:white;border-radius:18px;box-shadow:0 20px 60px rgba(15,23,42,.1);text-align:center;line-height:1.9">
        <h2 style="color:#b91c1c;margin:0 0 8px">页面加载失败</h2>
        <p style="color:#475569;margin:8px 0">React 主包未能成功渲染，可能是网络、缓存或浏览器兼容问题。</p>
        <div style="text-align:left;background:#f8fafc;border-radius:12px;padding:14px;margin:16px 0">
          <b style="color:#0f172a">请尝试：</b>
          <ol style="margin:8px 0 0 20px;padding:0">
            <li>按 <code>Ctrl + Shift + R</code> 强制刷新</li>
            <li>清理浏览器缓存和 Cookie</li>
            <li>关闭广告拦截、代理或 VPN 后重试</li>
            <li>确认地址为 <code>https://ededede631.github.io/linguaverse/</code></li>
            <li>使用 Chrome / Edge / Firefox 最新版本</li>
          </ol>
        </div>
        <p style="margin:0"><a class="lv-primary" style="display:inline-block;padding:10px 20px;border-radius:12px;background:#7c3aed;color:white;text-decoration:none;font-weight:700" href="/linguaverse/">重新加载</a></p>
      </div>`;
  }

  function ready(fn) { document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn, { once: true }) : fn(); }
  function debounce(fn, delay) { let t = 0; return () => { clearTimeout(t); t = setTimeout(fn, delay); }; }
  function esc(v) { return String(v ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[s])); }
})();
