(function () {
  "use strict";

  const VERSION = "20260702g";
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
  // 章节知识点数据：按语言 × 主题
  const chapterKnowledge = {
  "日语": {
    "kana": [["平假名", "日语的表音文字，共 46 个清音，用于书写和标注读音。", "あいうえお かきくけこ"], ["片假名", "主要用于书写外来语和拟声词。", "アイウエオ カキクケコ"], ["清音与浊音", "浊音在清音右上角加两点，半浊音加小圈。", "か→が、さ→ざ、た→だ、は→ば/ぱ"], ["长音", "长音将前一个假名的元音拉长一拍。", "おかあさん（おかーさん）"], ["促音", "っ 表示停顿一拍，出现在か/さ/た/ぱ行前。", "がっこう（学校）"], ["拗音", "い段假名 + や/ゆ/よ 合成一个音节。", "きゃ、きゅ、きょ"]],
    "te_form": [["て形的作用", "连接动作、表示请求、表示状态、てから 表先后。", "朝ご飯を食べて、学校へ行きます。"], ["一类动词て形变化", "い音便：き→いて、ぎ→いで；つ音便：つ/う/る→って；ん音便：ぬ/ぶ/む→んで。", "書く→書いて、泳ぐ→泳いで、待つ→待って"], ["二类动词て形变化", "直接去掉 る 加 て。", "食べる→食べて、見る→見て"], ["三类动词て形变化", "する→して、くる→きて。", "勉強する→勉強して、来る→来て"], ["てください", "表示请求，意为「请做…」。", "ここに名前を書いてください。"], ["ています", "表示正在进行的动作或状态。", "今、本を読んでいます。"]],
    "ta_form": [["た形的作用", "表示过去、完了，た形变化规则与て形一致，把て换成た。", "昨日、映画を見た。"], ["一类动词た形变化", "き→いた、ぎ→いだ、つ/う/る→った、ぬ/ぶ/む→んだ、す→した。", "書く→書いた、泳ぐ→泳いだ"], ["二类动词た形变化", "去掉る加た。", "食べる→食べた、見る→見た"], ["三类动词た形变化", "する→した、くる→きた。", "勉強する→勉強した"], ["たことがある", "表示曾经有过某种经历。", "日本に行ったことがあります。"], ["たり…たりする", "列举动作或状态，意为「又…又…」。", "日曜日は掃除したり、洗濯したりします。"]],
    "masu_form": [["ます形", "动词礼貌体，用于正式场合和对长辈、陌生人说话。", "私は学生です。"], ["一类动词ます形", "把词尾う段假名改为い段假名，再加ます。", "書く→書きます、読む→読みます"], ["二类动词ます形", "去掉る加ます。", "食べる→食べます、見る→見ます"], ["三类动词ます形", "する→します、くる→きます。", "勉強する→勉強します"], ["ません", "ます的否定形。", "今日は行きません。"], ["ました / ませんでした", "ます的过去式/过去否定式。", "昨日行きました。"]],
    "particles": [["は（主题助词）", "提示句子主题，读作 wa。", "私は学生です。"], ["が（主格助词）", "强调主语、能力、好恶、愿望的对象。", "猫が好きです。"], ["を（宾格助词）", "标记动作的直接对象。", "本を読みます。"], ["に（时间/地点/对象）", "表示时间点、目的地、动作对象。", "朝 7 時に起きます。"], ["で（场所/手段/原因）", "表示动作发生场所、工具手段、原因。", "電車で学校へ行きます。"], ["と（共同/引用）", "表示和谁一起做什么，或引用内容。", "友達と映画を見ます。"]],
    "verbs": [["动词分类", "日语动词分一类（五段）、二类（一段）、三类（カ变/サ变）。", "書く（一类）、食べる（二类）、する（三类）"], ["一类动词", "词尾在う段，变形时词尾在あ/い/う/え/お五段变化。", "書く、読む、話す、待つ、泳ぐ"], ["二类动词", "词尾是る，倒数第二个假名在い段或え段。", "食べる、見る、起きる、寝る"], ["三类动词", "包括カ变动词「来る」和サ变动词「する」。", "来る、する、勉強する"], ["动词基本形", "字典形、原形，用于简体句和某些语法结构。", "書く、食べる、する"], ["动词ない形", "动词否定形，一类变あ段+ない，二类去る+ない。", "書かない、食べない、しない"]],
    "adjectives": [["い形容词", "以い结尾，可直接修饰名词，可变形。", "高い、安い、美味しい、大きい"], ["い形容词过去式", "把い变成かった。", "高い→高かった"], ["い形容词否定形", "把い变成くない。", "高い→高くない"], ["な形容词", "以だ/な结尾，词干+な修饰名词。", "静かだ、便利だ、きれいだ"], ["な形容词过去式", "把だ变成だった。", "静かだ→静かだった"], ["な形容词否定形", "把だ变成ではない。", "静かだ→静かではない"]],
    "keigo": [["敬语分类", "尊敬语（抬高对方）、谦让语（降低自己）、丁宁语（礼貌）。", "尊敬語・謙譲語・丁寧語"], ["尊敬语", "对长辈、上级、陌生人的动作使用尊敬语。", "先生がいらっしゃいます。"], ["谦让语", "对自己或己方的动作使用谦让语以表敬意。", "私が伺います。"], ["丁宁语", "です/ます体，日常礼貌表达。", "私は学生です。"], ["特殊尊敬语", "いる/行く/来る→いらっしゃる、言う→おっしゃる、食べる→召し上がる。", "先生は何とおっしゃいましたか。"], ["特殊谦让语", "行く/来る→参る、言う→申す、食べる→いただく、見る→拝見する。", "明日参ります。"]],
    "general": [["学习方法", "每天坚持 30 分钟，听说读写全面练习，及时复习。", "毎日 30 分、日本語を勉強します。"], ["助词重点", "掌握は/が/を/に/で/と/から/まで等核心助词用法。", "私は学校で日本語を勉強します。"], ["动词变形", "熟练掌握ます形/て形/た形/ない形等常用变形。", "書きます・書いて・書いた・書かない"]]
  },
  "韩语": {
    "hangul": [["韩文字母构成", "韩文由初声（辅音）、中声（元音）、终声（收音）组成。", "한 = ㅎ + ㅏ + ㄴ"], ["基本辅音", "14 个基本辅音：ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ。", "ㄱ(기역)、ㄴ(니은)、ㄷ(디귿)"], ["基本元音", "10 个基本元音：ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ。", "ㅏ(아)、ㅑ(야)、ㅓ(어)"], ["收音规则", "27 个收音实际发音只有 7 个代表音：ㄱㄴㄷㄹㅁㅂㅇ。", "맛 = 마ːㄷ"], ["连音现象", "收音遇到后面元音时，收音移到后面音节。", "한국어 → 한구거"], ["韩文书写顺序", "从左到右，从上到下，先辅音后元音。", "가: ㄱ → ㅏ"]],
    "particles": [["은/는（主题助词）", "은 用于辅音结尾，는 用于元音结尾，提示主题。", "저는 학생입니다."], ["이/가（主语助词）", "이 用于辅音结尾，가 用于元音结尾，强调主语。", "날씨가 좋아요."], ["을/를（宾语助词）", "을 用于辅音结尾，를 用于元音结尾，标记宾语。", "책을 읽습니다."], ["에（时间/地点）", "表示时间点、存在地点、目的地。", "학교에 갑니다."], ["에서（动作场所/来自）", "表示动作发生的场所、出发点。", "도서관에서 공부합니다."], ["와/과（和）", "와 用于元音结尾，과 用于辅音结尾，表示「和」。", "친구와 영화를 봅니다."]],
    "verbs": [["动词基本形", "韩语动词和形容词都以 다 结尾，称为基本形（字典形）。", "가다、먹다、공부하다"], ["动词词干", "去掉 다 剩下的部分叫词干，各种变化都在词干上进行。", "가다 → 가-, 먹다 → 먹-"], ["하다 动词", "名词 + 하다 构成动词，非常常见。", "공부하다、일하다、말하다"], ["이다", "判断动词，「是…」，接在名词后。", "학생입니다."], ["形容词", "韩语形容词也以 다 结尾，用法类似动词。", "예쁘다、크다、작다"], ["冠词形", "动词/形容词修饰名词时的形式，现在时+는，过去时+ㄴ/은。", "가는 사람、예쁜 꽃"]],
    "tenses": [["现在时", "动词词干 + ㅂ니다/습니다 或 아요/어요。", "저는 학생입니다. / 가요."], ["过去时", "词干元音以ㅏ/ㅗ结尾用았어요，其余用었어요。", "어제 학교에 갔어요."], ["将来时", "词干 + (으)ㄹ 거예요 或 겠습니다。", "내일 만날 거예요."], ["现在进行时", "고 있다 表示「正在…」。", "지금 공부하고 있어요."], ["完成时", "아/어 있다 表示动作完成后的状态持续。", "문이 열려 있어요."], ["过去完成时", "았/었었어요 表示过去已经完成的动作。", "어제 3 시에 숙제를 했었어요."]],
    "honorific": [["敬语시", "在动词词干后加 시/으시，表示对主语的尊敬。", "선생님께서 가십니다."], ["尊敬阶", "ㅂ니다/습니다 格式体尊敬阶，用于正式场合。", "안녕하십니까?"], ["准敬阶", "아요/어요 非格式体敬语，日常最常用。", "안녕하세요."], ["敬语词汇", "部分动词有特殊敬语形式：먹다→드시다、자다→주무시다。", "할아버지께서 식사하십니다."], ["谦称词汇", "降低自己的表达：저（我）、저희（我们）。", "저는 학생입니다."], ["终结词尾阶称", "根据对象不同选择：尊敬阶、准敬阶、平阶、基本阶。", "갑니다 / 가요 / 가 / 간다"]],
    "general": [["韩文特点", "拼音文字，表音准确，学会字母就能读所有韩文。", "한글은 과학적인 글자입니다."], ["助词系统", "韩语靠助词标记句子成分，助词非常重要。", "저는 학교에서 한국어를 공부합니다."], ["敬语文化", "韩语敬语发达，根据对象年龄、地位选择不同表达。", "안녕하세요 / 안녕"]]
  },
  "英语": {
    "phonics": [["26个字母", "英语有26个字母，5个元音（A/E/I/O/U），21个辅音。", "A B C D E F G..."], ["元音发音", "元音字母在单词中有长音和短音两种基本发音。", "cake（长音）、cat（短音）"], ["辅音发音", "辅音发音相对稳定，注意清浊辅音的区别。", "pen（清）、ben（浊）"], ["常见字母组合", "th、sh、ch、ph、tion 等组合有固定发音。", "think、sheep、chair"], ["重音规则", "双音节词名词重音在第一音节，动词在第二。", "record（名）/ re'cord（动）"], ["拼读技巧", "看到生词时，先划分音节，再按规则拼读。", "hap-py，to-mor-row"]],
    "nouns": [["名词分类", "可数名词和不可数名词；个体名词、集体名词、物质名词、抽象名词。", "book（可数）、water（不可数）"], ["名词复数", "一般加s，以s/x/ch/sh结尾加es，辅音+y变y为i加es。", "books、boxes、studies"], ["不规则复数", "man→men、woman→women、child→children、tooth→teeth。", "men、women、children"], ["名词所有格", "有生命的加 's，无生命的用 of。", "Tom's book、the door of the room"], ["主谓一致", "主语和谓语在人称和数上保持一致。", "He is a student. / They are students."], ["不可数名词", "不能直接加a/an，用量词表示数量。", "a cup of tea、two pieces of bread"]],
    "verbs": [["动词分类", "实义动词、系动词、助动词、情态动词。", "run（实义）、be（系动）、do（助动）、can（情态）"], ["及物与不及物", "及物动词后可直接加宾语，不及物需加介词。", "read a book / look at the picture"], ["动词第三人称单数", "一般现在时，第三人称单数动词加s/es。", "He works hard."], ["动词ing形式", "用于进行时和作动名词/现在分词。", "reading、writing、swimming"], ["过去式与过去分词", "规则动词加ed，不规则动词需特殊记忆。", "worked（规则）、went/gone（不规则）"], ["短语动词", "动词+介词/副词构成的固定搭配，意思往往不等于字面。", "look up（查阅）、give up（放弃）"]],
    "tenses": [["一般现在时", "表示习惯、事实、真理。动词原形，三单加s。", "She gets up at 7 every day."], ["一般过去时", "表示过去发生并结束的动作。动词过去式。", "I visited Beijing last year."], ["一般将来时", "will + 动词原形 或 be going to + 动词原形。", "We will meet tomorrow."], ["现在进行时", "am/is/are + doing，表示正在进行的动作。", "She is reading a book."], ["现在完成时", "have/has + 过去分词，表示过去动作对现在的影响。", "I have lived here for 5 years."], ["过去进行时", "was/were + doing，表示过去某时正在进行。", "I was reading when he came."]],
    "grammar": [["句子结构", "基本句型：主语+谓语；主谓宾；主系表；主谓双宾；主谓宾补。", "I love you. / She is happy."], ["陈述句与疑问句", "陈述句语序：主语+谓语。疑问句：助动词提前。", "Do you like English?"], ["祈使句", "动词原形开头，表示命令、请求、建议。", "Please open the door."], ["感叹句", "What + 名词 或 How + 形容词/副词 开头。", "What a beautiful day! / How fast he runs!"], ["There be 句型", "表示「某地有某物」，be动词和后面的名词一致。", "There is a book on the desk."], ["it的用法", "指代时间、天气、距离，或作形式主语/宾语。", "It is raining. / It is important to study."]],
    "articles": [["不定冠词a/an", "a用于辅音音素开头，an用于元音音素开头，表泛指「一个」。", "a book、an apple"], ["定冠词the", "表特指，双方都知道的人或物，或上文提到过的。", "the book on the desk"], ["零冠词", "复数名词泛指、不可数名词泛指、学科、球类、三餐前等。", "I like cats. / I have lunch at 12."], ["a/an的选择", "看发音不是看字母：an hour（h不发音），a university（j音）。", "an hour、a university"], ["the的特殊用法", "用于独一无二的事物、最高级、序数词、乐器前。", "the sun、the tallest、play the piano"], ["冠词使用规律", "可数名词单数不能裸用，必须加冠词或其他限定词。", "a book / the book / my book"]],
    "prepositions": [["时间介词in/on/at", "in 大时间（年/月/季节/上下午）；on 具体某天；at 点时间。", "in July、on Monday、at 8 o'clock"], ["地点介词in/on/at", "in 大地点/内部；on 表面；at 小地点/点位置。", "in Beijing、on the table、at the door"], ["方式介词by/with/in", "by 交通方式/手段；with 具体工具；in 语言/材料。", "by bus、with a pen、in English"], ["方位介词", "in front of、behind、beside、between、among、near。", "The cat is behind the door."], ["时间介词for/since", "for + 时间段；since + 时间点，都用于完成时。", "for 3 years / since 2020"], ["介词固定搭配", "动词/形容词/名词和介词的固定搭配需积累。", "look at、good at、interest in"]],
    "clauses": [["宾语从句", "在及物动词后作宾语，用陈述语序，注意时态一致。", "I know that he is right."], ["定语从句", "修饰名词或代词的从句，用 who/which/that 等引导。", "This is the book that I bought."], ["状语从句", "时间、原因、条件、让步、目的、结果等从句。", "If it rains, we will stay home."], ["名词性从句", "主语从句、宾语从句、表语从句、同位语从句。", "What he said is true."], ["引导词选择", "根据先行词是人/物，以及在从句中作什么成分来选。", "who（人/主）、which（物）、that（人/物）"], ["时态一致", "主句过去时，从句用相应的过去时态；客观真理用一般现在时。", "He said the earth goes around the sun."]],
    "conversation": [["问候与介绍", "初次见面的基本表达：问候、自我介绍、告别。", "Hello! My name is Tom. Nice to meet you."], ["询问与请求", "礼貌地提问和请求帮助。", "Could you help me, please?"], ["购物与点餐", "在商店和餐厅的常用表达。", "I'd like a cup of coffee, please."], ["问路与指路", "询问方向和给别人指路。", "Excuse me, how do I get to the station?"], ["打电话", "电话用语的特殊表达。", "Hello, may I speak to Lisa?"], ["表达观点", "同意、反对、建议等表达。", "I think... / In my opinion..."]],
    "general": [["英语学习方法", "听说读写全面发展，每天坚持，多输入多输出。", "Practice makes perfect."], ["词汇积累", "在语境中记单词，通过阅读扩大词汇量。", "Read more, learn more."], ["语法框架", "掌握时态、语态、从句三大核心语法体系。", "Grammar is the skeleton of language."]]
  }
};

  // 章节词汇数据：按语言 × 主题
  const chapterWords = {
  "日语": {
    "te_form": [["書く", "かく", "写", "手紙を書きます。"], ["読む", "よむ", "读", "本を読みます。"], ["食べる", "たべる", "吃", "ご飯を食べます。"], ["見る", "みる", "看", "テレビを見ます。"], ["行く", "いく", "去", "学校へ行きます。"], ["来る", "くる", "来", "友達が来ます。"], ["する", "する", "做", "勉強をします。"], ["待つ", "まつ", "等", "バスを待ちます。"], ["話す", "はなす", "说话", "日本語を話します。"], ["泳ぐ", "およぐ", "游泳", "プールで泳ぎます。"]],
    "kana": [["あ", "a", "啊", "あいうえお"], ["か", "ka", "卡", "かきくけこ"], ["さ", "sa", "撒", "さしすせそ"], ["た", "ta", "他", "たちつてと"], ["な", "na", "那", "なにぬねの"], ["は", "ha", "哈", "はひふへほ"], ["ま", "ma", "妈", "まみむめも"], ["や", "ya", "呀", "やゆよ"], ["ら", "ra", "拉", "らりるれろ"], ["わ", "wa", "哇", "わをん"]],
    "particles": [["私", "わたし", "我", "私は学生です。"], ["あなた", "あなた", "你", "あなたは誰ですか。"], ["学生", "がくせい", "学生", "私は学生です。"], ["学校", "がっこう", "学校", "学校へ行きます。"], ["本", "ほん", "书", "本を読みます。"], ["先生", "せんせい", "老师", "先生が来ます。"], ["友達", "ともだち", "朋友", "友達と遊びます。"], ["電車", "でんしゃ", "电车", "電車で行きます。"], ["時間", "じかん", "时间", "時間があります。"], ["今日", "きょう", "今天", "今日は月曜日です。"]],
    "verbs": [["書く", "かく", "写", "字を書きます。"], ["読む", "よむ", "读", "新聞を読みます。"], ["食べる", "たべる", "吃", "朝ご飯を食べます。"], ["飲む", "のむ", "喝", "水を飲みます。"], ["行く", "いく", "去", "会社へ行きます。"], ["来る", "くる", "来", "明日来ます。"], ["帰る", "かえる", "回", "家に帰ります。"], ["働く", "はたらく", "工作", "会社で働きます。"], ["勉強する", "べんきょうする", "学习", "日本語を勉強します。"], ["話す", "はなす", "说话", "日本語を話します。"]]
  },
  "韩语": {
    "hangul": [["ㄱ", "giyeok", "g/k", "기역"], ["ㄴ", "nieun", "n", "니은"], ["ㄷ", "digeut", "d/t", "디귿"], ["ㅁ", "mieum", "m", "미음"], ["ㅂ", "bieup", "b/p", "비읍"], ["ㅅ", "siot", "s", "시옷"], ["ㅇ", "ieung", "无/ng", "이응"], ["ㅈ", "jieut", "j", "지읒"], ["ㅎ", "hieut", "h", "히읗"], ["ㅏ", "a", "啊", "아"]],
    "particles": [["나", "na", "我（平语）", "나는 학생이야."], ["저", "jeo", "我（敬语）", "저는 학생입니다."], ["너", "neo", "你（平语）", "너는 누구야?"], ["학교", "hakgyo", "学校", "학교에 가요."], ["책", "chaek", "书", "책을 읽어요."], ["선생님", "seonsaengnim", "老师", "선생님께서 오세요."], ["친구", "chingu", "朋友", "친구와 만나요."], ["지하철", "jihacheol", "地铁", "지하철로 가요."], ["시간", "sigan", "时间", "시간이 있어요."], ["오늘", "oneul", "今天", "오늘은 월요일이에요."]],
    "verbs": [["가다", "gada", "去", "학교에 가요."], ["오다", "oda", "来", "집에 와요."], ["먹다", "meokda", "吃", "밥을 먹어요."], ["마시다", "masida", "喝", "물을 마셔요."], ["읽다", "ilkda", "读", "책을 읽어요."], ["쓰다", "sseuda", "写", "편지를 써요."], ["공부하다", "gongbuhada", "学习", "한국어를 공부해요."], ["일하다", "ilhada", "工作", "회사에서 일해요."], ["만나다", "mannada", "见面", "친구를 만나요."], ["말하다", "malhada", "说话", "한국어를 말해요."]],
    "tenses": [["가다", "gada", "去", "학교에 가요."], ["오다", "oda", "来", "집에 왔어요."], ["먹다", "meokda", "吃", "밥을 먹을 거예요."], ["읽다", "ilkda", "读", "책을 읽고 있어요."], ["공부하다", "gongbuhada", "学习", "한국어를 공부했어요."], ["만나다", "mannada", "见面", "내일 만날 거예요."], ["하다", "hada", "做", "뭐 해요?"], ["있다", "itda", "有/在", "친구가 있어요."], ["없다", "eopda", "没有/不在", "시간이 없어요."], ["좋다", "jota", "好", "날씨가 좋아요."]]
  },
  "英语": {
    "phonics": [["apple", "/ˈæpl/", "苹果", "I eat an apple every day."], ["book", "/bʊk/", "书", "I read a book."], ["cat", "/kæt/", "猫", "The cat is black."], ["dog", "/dɔːɡ/", "狗", "I have a dog."], ["egg", "/eɡ/", "鸡蛋", "I eat an egg for breakfast."], ["fish", "/fɪʃ/", "鱼", "The fish is swimming."], ["girl", "/ɡɜːrl/", "女孩", "The girl is happy."], ["house", "/haʊs/", "房子", "This is my house."], ["ice", "/aɪs/", "冰", "Ice is cold."], ["jump", "/dʒʌmp/", "跳", "The boy can jump high."]],
    "nouns": [["student", "/ˈstuːdnt/", "学生", "He is a student."], ["teacher", "/ˈtiːtʃər/", "老师", "Our teacher is kind."], ["school", "/skuːl/", "学校", "I go to school by bus."], ["book", "/bʊk/", "书", "This book is interesting."], ["friend", "/frend/", "朋友", "She is my best friend."], ["family", "/ˈfæməli/", "家庭", "My family is big."], ["city", "/ˈsɪti/", "城市", "Beijing is a big city."], ["water", "/ˈwɔːtər/", "水", "Please give me some water."], ["time", "/taɪm/", "时间", "What time is it?"], ["money", "/ˈmʌni/", "钱", "I don't have much money."]],
    "verbs": [["work", "/wɜːrk/", "工作", "I work in a company."], ["study", "/ˈstʌdi/", "学习", "I study English every day."], ["eat", "/iːt/", "吃", "I eat breakfast at 7."], ["drink", "/drɪŋk/", "喝", "I drink coffee every morning."], ["read", "/riːd/", "读", "I read books every night."], ["write", "/raɪt/", "写", "Please write your name here."], ["speak", "/spiːk/", "说", "She speaks three languages."], ["listen", "/ˈlɪsn/", "听", "Listen to me carefully."], ["watch", "/wɑːtʃ/", "看", "I watch TV in the evening."], ["play", "/pleɪ/", "玩/打", "I play basketball on weekends."]],
    "tenses": [["work", "/wɜːrk/", "工作", "I work every day."], ["study", "/ˈstʌdi/", "学习", "She studied English yesterday."], ["go", "/ɡoʊ/", "去", "I will go to Beijing tomorrow."], ["read", "/riːd/", "读", "I am reading a book now."], ["live", "/lɪv/", "居住", "I have lived here for 5 years."], ["eat", "/iːt/", "吃", "I was eating when he called."], ["see", "/siː/", "看见", "I saw a movie last night."], ["do", "/duː/", "做", "I have done my homework."], ["have", "/hæv/", "有", "She has a beautiful dress."], ["make", "/meɪk/", "制作", "I made a cake yesterday."]],
    "grammar": [["sentence", "/ˈsentəns/", "句子", "This is a simple sentence."], ["subject", "/ˈsʌbdʒɪkt/", "主语", "The subject does the action."], ["verb", "/vɜːrb/", "动词", "Verbs show action or state."], ["object", "/ˈɑːbdʒɪkt/", "宾语", "The object receives the action."], ["tense", "/tens/", "时态", "Tense shows when the action happens."], ["noun", "/naʊn/", "名词", "Nouns name people, places, things."], ["adjective", "/ˈædʒɪktɪv/", "形容词", "Adjectives describe nouns."], ["adverb", "/ˈædvɜːrb/", "副词", "Adverbs modify verbs or adjectives."], ["preposition", "/ˌprepəˈzɪʃn/", "介词", "Prepositions show relationships."], ["conjunction", "/kənˈdʒʌŋkʃn/", "连词", "Conjunctions connect words or clauses."]]
  }
};

  // 章节练习题数据：按语言 × 主题
  const chapterQuestions = {
  "日语": {
    "te_form": [["て形变化", "書く 的て形是？", "書いて", ["書いて", "書て", "書って", "書きて"]], ["て形变化", "食べる 的て形是？", "食べて", ["食べて", "食って", "食いて", "食べって"]], ["て形变化", "する 的て形是？", "して", ["して", "すて", "せて", "しって"]], ["てください", "请在这里写名字。_____ください。", "書いて", ["書いて", "書く", "書か", "書き"]], ["ています", "我正在看书。本を_____います。", "読んで", ["読んで", "読み", "読む", "読みて"]], ["来る变形", "来る 的て形是？", "来て", ["来て", "きて", "くって", "こいて"]]],
    "particles": [["は", "私___学生です。", "は", ["は", "が", "を", "に"]], ["が", "猫___好きです。", "が", ["が", "は", "を", "で"]], ["を", "毎日日本語___勉強します。", "を", ["を", "は", "が", "に"]], ["に", "朝7時___起きます。", "に", ["に", "で", "を", "へ"]], ["で", "電車___学校へ行きます。", "で", ["で", "に", "を", "へ"]], ["と", "友達___映画を見ます。", "と", ["と", "を", "に", "で"]]],
    "verbs": [["动词分类", "書く 属于哪类动词？", "一类动词", ["一类动词", "二类动词", "三类动词", "形容词"]], ["动词分类", "食べる 属于哪类动词？", "二类动词", ["二类动词", "一类动词", "三类动词", "名词"]], ["动词分类", "する 属于哪类动词？", "三类动词", ["三类动词", "一类动词", "二类动词", "副词"]], ["ます形", "書く 的ます形是？", "書きます", ["書きます", "書ます", "書ってます", "書いてます"]], ["ない形", "行く 的否定形是？", "行かない", ["行かない", "行ない", "行くない", "行きない"]], ["た形", "食べる 的过去式是？", "食べた", ["食べた", "食った", "食べった", "食いた"]]]
  },
  "韩语": {
    "hangul": [["韩文字母", "韩文有多少个基本字母？", "24个", ["24个", "26个", "40个", "51个"]], ["辅音", "以下哪个是辅音？", "ㄱ", ["ㄱ", "ㅏ", "ㅑ", "ㅓ"]], ["元音", "以下哪个是元音？", "ㅏ", ["ㅏ", "ㄱ", "ㄴ", "ㅁ"]], ["收音", "한 的收音是？", "ㄴ", ["ㄴ", "ㅎ", "ㅏ", "没有收音"]], ["连音", "한국어 实际读成？", "한구거", ["한구거", "한국어", "항국어", "한구거"]], ["韩文特点", "韩文是什么类型的文字？", "拼音文字", ["拼音文字", "象形文字", "表意文字", "楔形文字"]]],
    "particles": [["은/는", "저___학생입니다.", "는", ["는", "은", "이", "가"]], ["이/가", "날씨___좋아요.", "가", ["가", "이", "은", "는"]], ["을/를", "책___읽어요.", "을", ["을", "를", "이", "가"]], ["에", "학교___가요.", "에", ["에", "에서", "을", "를"]], ["에서", "도서관___공부해요.", "에서", ["에서", "에", "을", "를"]], ["와/과", "친구___영화를 봐요.", "와", ["와", "과", "이", "가"]]],
    "tenses": [["现在时", "가다 的敬语现在时是？", "가요", ["가요", "갔어요", "갈 거예요", "가고 있어요"]], ["过去时", "가다 的过去式是？", "갔어요", ["갔어요", "가요", "갈 거예요", "가고 있어요"]], ["将来时", "만나다 的将来式是？", "만날 거예요", ["만날 거예요", "만나요", "만났어요", "만나고 있어요"]], ["进行时", "공부하다 进行时是？", "공부하고 있어요", ["공부하고 있어요", "공부해요", "공부했어요", "공부할 거예요"]], ["하다动词", "공부하다 的现在时敬语是？", "공부해요", ["공부해요", "공부하다", "공부했어요", "공부할 거예요"]], ["이다", "학생___입니다. 空格填什么？", "이", ["이", "가", "은", "는"]]]
  },
  "英语": {
    "phonics": [["元音数量", "英语有多少个元音字母？", "5个", ["5个", "21个", "26个", "20个"]], ["字母发音", "字母 A 的发音是？", "/eɪ/", ["/eɪ/", "/æ/", "/ɑː/", "/ə/"]], ["清浊辅音", "以下哪个是清辅音？", "/p/", ["/p/", "/b/", "/d/", "/g/"]], ["字母组合", "th 在 think 中的发音是？", "/θ/", ["/θ/", "/ð/", "/t/", "/s/"]], ["长音规则", "cake 中 a 发长音的原因是？", "末尾有不发音的e", ["末尾有不发音的e", "a在词首", "a是元音", "k是辅音"]], ["拼读法", "看到生词首先应该？", "划分音节", ["查字典", "划分音节", "直接读", "问老师"]]],
    "nouns": [["名词复数", "book 的复数是？", "books", ["books", "bookes", "book", "bookies"]], ["名词复数", "box 的复数是？", "boxes", ["boxes", "boxs", "box", "boxies"]], ["名词复数", "man 的复数是？", "men", ["men", "mans", "manes", "mens"]], ["不可数名词", "以下哪个是不可数名词？", "water", ["water", "book", "student", "apple"]], ["所有格", "Tom 的书 怎么说？", "Tom's book", ["Tom's book", "Toms book", "Tom book", "book Tom"]], ["主谓一致", "He ___ a student.", "is", ["is", "are", "am", "be"]]],
    "verbs": [["三单形式", "He ___ English every day.", "studies", ["studies", "study", "studying", "studied"]], ["过去式", "I ___ a movie yesterday.", "watched", ["watched", "watch", "watches", "watching"]], ["ing形式", "She is ___ a book.", "reading", ["reading", "read", "reads", "readed"]], ["动词分类", "be 动词属于？", "系动词", ["系动词", "实义动词", "助动词", "情态动词"]], ["短语动词", "give up 的意思是？", "放弃", ["放弃", "给", "向上", "屈服"]], ["情态动词", "I ___ swim. 表示能力", "can", ["can", "may", "must", "should"]]],
    "tenses": [["一般现在时", "She ___ up at 7 every day.", "gets", ["gets", "get", "got", "getting"]], ["一般过去时", "I ___ Beijing last year.", "visited", ["visited", "visit", "visits", "visiting"]], ["一般将来时", "We ___ meet tomorrow.", "will", ["will", "are", "did", "were"]], ["现在进行时", "Look! It ___.", "is raining", ["is raining", "rains", "rained", "rain"]], ["现在完成时", "I ___ here for 5 years.", "have lived", ["have lived", "live", "lived", "will live"]], ["过去进行时", "I ___ when he came.", "was reading", ["was reading", "read", "am reading", "reads"]]],
    "articles": [["不定冠词", "I have ___ apple.", "an", ["an", "a", "the", "不填"]], ["定冠词", "___ book on the desk is mine.", "The", ["The", "A", "An", "不填"]], ["零冠词", "I have ___ lunch at 12.", "不填", ["不填", "a", "an", "the"]], ["the用法", "___ sun rises in the east.", "The", ["The", "A", "An", "不填"]], ["a/an选择", "___ university student", "A", ["A", "An", "The", "不填"]], ["冠词规律", "可数名词单数前必须加？", "冠词或限定词", ["冠词或限定词", "the", "a", "形容词"]]],
    "prepositions": [["时间介词", "I was born ___ 1990.", "in", ["in", "on", "at", "for"]], ["时间介词", "The meeting is ___ Monday.", "on", ["on", "in", "at", "to"]], ["时间介词", "I get up ___ 7 o'clock.", "at", ["at", "in", "on", "for"]], ["地点介词", "I live ___ Beijing.", "in", ["in", "on", "at", "to"]], ["方式介词", "I go to school ___ bus.", "by", ["by", "on", "in", "with"]], ["介词搭配", "I am good ___ English.", "at", ["at", "in", "on", "for"]]]
  }
};

  // 章节对话数据：按语言 × 主题
  const chapterDialogues = {
  "日语": {
    "te_form": {
      "title": "在教室：请求与说明",
      "text": "A: すみません、この漢字の読み方を教えてください。\nB: はい、これは「かき」と読みます。\nA: 書き方も教えていただけますか？\nB: ええ、こうやって書きます。見ていてください。\nA: わかりました。何度も練習しておきます。\nB: 大丈夫ですよ。毎日練習していれば、上手になりますよ。",
      "note": "てください（请求）、ています（进行）、ておく（事先做）都是て形的重要用法。"
    },
    "particles": {
      "title": "自我介绍",
      "text": "A: はじめまして、田中です。東京から来ました。\nB: はじめまして、キムです。韓国から来ました。\nA: キムさんは何を勉強していますか。\nB: 日本語を勉強しています。大学で日本文学を専攻しています。\nA: すごいですね。私は会社で働いています。\nB: どんな仕事をしていますか。\nA: エンジニアです。コンピューターの仕事をしています。",
      "note": "注意助词的使用：は提示主题、が强调主语、を标记宾语、で表示场所/手段。"
    },
    "general": {
      "title": "日常问候",
      "text": "A: おはようございます。今日もいい天気ですね。\nB: おはようございます。本当ですね。\nA: 今日はどこかへ行きますか。\nB: ええ、図書館へ勉強に行きます。\nA: そうですか。頑張ってください。\nB: ありがとうございます。",
      "note": "です/ます体是日语最基本的礼貌体，日常交流中广泛使用。"
    }
  },
  "韩语": {
    "hangul": {
      "title": "学习韩文",
      "text": "A: 안녕하세요. 한국어를 배우고 있어요.\nB: 반가워요. 한글은 배우기 쉬워요.\nA: 네, 글자는 과학적이네요.\nB: 맞아요. 발음만 알면 다 읽을 수 있어요.\nA: 그런데 받침이 조금 어려워요.\nB: 괜찮아요. 연습하면 금방 익숙해져요.\nA: 열심히 공부할게요!\nB: 화이팅!",
      "note": "韩文是表音文字，学会字母发音就能读出所有韩文，非常科学。"
    },
    "particles": {
      "title": "自我介绍",
      "text": "A: 안녕하세요. 저는 왕명입니다.\nB: 안녕하세요. 저는 김민수예요.\nA: 중국에서 왔어요. 한국어를 배우고 있어요.\nB: 그래요? 잘하시네요!\nA: 아니에요, 아직 많이 부족해요.\nB: 걱정 마세요. 곧 잘하게 될 거예요.\nA: 감사합니다. 친하게 지내요!",
      "note": "注意은/는、이/가、을/를 的选择：前一音节是否收音决定用哪个。"
    },
    "general": {
      "title": "日常问候",
      "text": "A: 안녕하세요! 오늘 날씨가 좋네요.\nB: 네, 정말 좋아요.\nA: 오늘 뭐 할 거예요?\nB: 도서관에 공부하러 갈 거예요.\nA: 그래요? 열심히 하세요!\nB: 네, 감사합니다!",
      "note": "아요/어요 是韩语日常最常用的准敬阶，礼貌又亲切。"
    }
  },
  "英语": {
    "phonics": {
      "title": "英语课堂",
      "text": "A: Good morning, class! Today we'll learn about phonics.\nB: Good morning, teacher!\nA: Let's start with the letter A. A says /æ/ like in apple.\nB: A-A-apple!\nA: Great! Now B says /b/ like in book.\nB: B-B-book!\nA: Excellent. Practice reading these words with your partner.\nB: OK, we will. Thank you, teacher!",
      "note": "自然拼读法（Phonics）是英语入门的关键，掌握发音规则就能读出大部分单词。"
    },
    "tenses": {
      "title": "谈论周末计划",
      "text": "A: Hi! What are you going to do this weekend?\nB: I'm going to visit my grandparents. What about you?\nA: I will go hiking with my friends.\nB: That sounds fun! Did you go hiking last weekend too?\nA: No, I stayed home and studied for the test.\nB: I see. Well, have a great weekend!\nA: You too! See you on Monday.",
      "note": "注意时态的使用：一般将来时表计划、一般过去时表过去的事、现在进行时表安排。"
    },
    "conversation": {
      "title": "咖啡馆点单",
      "text": "A: Good afternoon! What can I get for you?\nB: Hi, I'd like a cup of coffee, please.\nA: Sure. Would you like hot or iced?\nB: Hot, please. And could I get a sandwich too?\nA: Of course. Anything else?\nB: No, that's all. How much is it?\nA: That'll be 8 dollars.\nB: Here you go. Thank you!\nA: You're welcome. Enjoy your meal!",
      "note": "点餐常用句型：I'd like... / Could I have... / Anything else?"
    },
    "general": {
      "title": "初次见面",
      "text": "A: Hello! My name is Tom. Nice to meet you.\nB: Hi Tom, I'm Anna. Nice to meet you too.\nA: Where are you from, Anna?\nB: I'm from Canada. What about you?\nA: I'm from China. I'm studying English here.\nB: That's great! Your English is very good.\nA: Thank you! I'm still learning.\nB: Well, keep practicing. You're doing great!",
      "note": "初次见面基本句型：自我介绍、询问国籍、表达赞美。"
    }
  }
};


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
    // 找到章节主容器
    const allRoots = Array.from(document.querySelectorAll(".container,main,section"));
    let root = allRoots.find(x => /学习内容|课后练习|知识点|课文|词汇|语法/.test(x.innerText || ""));
    if (!root) root = document.querySelector("main") || document.body;
    if (root.dataset.lvChapter === VERSION) return;
    root.dataset.lvChapter = VERSION;

    // 获取章节标题
    const chapterTitle = getChapterTitle();
    const chapterNum = getChapterNumber();
    const topic = detectChapterTopic(chapterTitle, c);

    // 生成匹配的内容
    const content = buildChapterContent(chapterTitle, chapterNum, topic, c, d);

    // 完全替换原始内容，而不是追加
    root.className = "container mx-auto py-10 max-w-5xl";
    root.innerHTML = content;
  }

  function getChapterTitle() {
    const headings = Array.from(document.querySelectorAll("h1,h2,h3"));
    const chapterHeading = headings.find(h => /第\s*\d+\s*章|动词|名词|形容词|助词|语法|发音|词汇|会话|听力|阅读|写作|五十音|平假名|片假名|敬语|时态|句型/.test(h.textContent));
    if (chapterHeading) return chapterHeading.textContent.trim();
    const pageTitle = document.title || "";
    if (pageTitle) return pageTitle;
    return "本章学习";
  }

  function getChapterNumber() {
    const m = location.hash.match(/chapter\/(\d+)/);
    return m ? parseInt(m[1], 10) : 1;
  }

  function detectChapterTopic(title, c) {
    const t = title || "";
    if (c.language === "日语") {
      if (/五十音|平假名|片假名|假名|发音|入门/.test(t)) return "kana";
      if (/て形|te形|てください/.test(t)) return "te_form";
      if (/た形|过去|ta形/.test(t)) return "ta_form";
      if (/ます|です|敬体|礼貌体/.test(t)) return "masu_form";
      if (/助词|は|が|を|に|で|と|から|まで/.test(t)) return "particles";
      if (/动词|一类|二类|三类|五段|一段|カ変|サ変/.test(t)) return "verbs";
      if (/形容词|い形容詞|な形容詞/.test(t)) return "adjectives";
      if (/可能|被动|使役|授受/.test(t)) return "advanced_verbs";
      if (/敬语|尊敬|谦让|丁寧/.test(t)) return "keigo";
      if (/旅行|购物|买い物|料理|学校|仕事|职场|日常|会话/.test(t)) return "conversation";
      return "general";
    }
    if (c.language === "韩语") {
      if (/发音|字母|한글|收音|元音|辅音/.test(t)) return "hangul";
      if (/助词|은|는|이|가|을|를|에|에서/.test(t)) return "particles";
      if (/动词|形容词|하다|이다/.test(t)) return "verbs";
      if (/时态|过去|将来|现在|았|었|을/.test(t)) return "tenses";
      if (/敬语|시|尊敬|습니다/.test(t)) return "honorific";
      if (/日常|会话|旅游|购物|学校|职场/.test(t)) return "conversation";
      return "general";
    }
    if (/字母|发音|音标|phonics/.test(t)) return "phonics";
    if (/名词|noun/.test(t)) return "nouns";
    if (/动词|verb/.test(t)) return "verbs";
    if (/形容词|adjective/.test(t)) return "adjectives";
    if (/副词|adverb/.test(t)) return "adverbs";
    if (/时态|tense|现在时|过去时|将来时|进行时|完成时/.test(t)) return "tenses";
    if (/语法|grammar|句子|句型/.test(t)) return "grammar";
    if (/冠词|a|an|the/.test(t)) return "articles";
    if (/介词|preposition|in|on|at/.test(t)) return "prepositions";
    if (/从句|clause|定语|状语|宾语/.test(t)) return "clauses";
    if (/日常|会话|旅游|购物|学校|职场|商务/.test(t)) return "conversation";
    return "general";
  }

  function buildChapterContent(title, num, topic, c, d) {
    const video = findVideo(title, c);
    const knowledge = buildTopicKnowledge(topic, c);
    const words = buildTopicWords(topic, c, d);
    const questions = buildTopicQuestions(topic, c, d);
    const dialogue = buildTopicDialogue(topic, c);

    return `
      <div class="lv-module-head">
        <span class="lv-chip">${c.language} · ${c.level}</span>
        <h1>第 ${num} 章：${esc(title)}</h1>
        <p>本章学习目标：掌握核心知识点，配套词汇与练习，形成完整学习闭环。</p>
      </div>

      <div class="lv-flow">
        <span>📖 预习</span>
        <span>🎬 学习</span>
        <span>📝 练习</span>
        <span>✅ 测试</span>
        <span>🔄 复习</span>
      </div>

      <div class="lv-panel">
        <h3>🎬 视频讲解</h3>
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:14px;background:#000">
          <iframe style="position:absolute;top:0;left:0;width:100%;height:100%"
            src="https://player.bilibili.com/player.html?bvid=${video.bvid}&autoplay=0&page=1&high_quality=1"
            allowfullscreen scrolling="no" title="${esc(video.title)}"></iframe>
        </div>
        <p class="lv-video-note" style="margin-top:8px">视频来源：B 站公开课程 - ${esc(video.title)}</p>
      </div>

      <div class="lv-grid two">
        <div class="lv-panel">
          <h3>📚 知识点（${knowledge.length} 个）</h3>
          ${knowledge.map((k, i) => `<div style="padding:10px 0;border-bottom:1px solid #f1f5f9"><b>${i + 1}. ${esc(k[0])}</b><p style="margin:4px 0 0;color:#475569">${esc(k[1])}</p><p class="lv-example" style="margin-top:6px">${esc(k[2] || "")}</p></div>`).join("")}
        </div>

        <div class="lv-panel">
          <h3>📖 重点词汇（${words.length} 个）</h3>
          ${words.map(w => wordRow(w, c.language)).join("")}
        </div>
      </div>

      ${dialogue ? `
      <div class="lv-panel">
        <h3>💬 情景对话</h3>
        <p class="lv-tip"><b>场景：</b>${esc(dialogue.title)}</p>
        <pre style="white-space:pre-wrap;font-family:inherit;line-height:2;background:#f8fafc;padding:14px;border-radius:12px;margin:10px 0">${esc(dialogue.text)}</pre>
        <p style="color:#64748b;font-size:14px">💡 ${esc(dialogue.note)}</p>
      </div>` : ""}

      <div class="lv-panel">
        <h3>✏️ 练习题（${questions.length} 道）</h3>
        <div class="lv-tabs" style="margin-bottom:14px">
          <a class="active" data-lv-qtype="mcq">选择题</a>
          <a data-lv-qtype="fill">填空题</a>
          <a data-lv-qtype="listen">听写题</a>
        </div>
        <div id="lv-q-mcq" class="lv-list">
          ${questions.map((q, i) => question(q, i)).join("")}
        </div>
        <div id="lv-q-fill" class="lv-list" style="display:none">
          ${buildFillFromTopic(words, knowledge)}
        </div>
        <div id="lv-q-listen" class="lv-list" style="display:none">
          ${buildListenFromTopic(words, c)}
        </div>
      </div>

      <div class="lv-actions" style="margin-top:16px">
        <button class="lv-primary" data-lv-complete="chapter">✅ 标记本章完成</button>
        <button class="lv-ghost" data-lv-open="review">📝 错题复盘</button>
        <button class="lv-ghost" data-lv-action="review-words">🔄 间隔复习</button>
        <button class="lv-ghost" data-lv-open="badges">🏆 我的勋章</button>
      </div>
    `;
  }

  function findVideo(title, c) {
    const text = `${c.language} ${c.level} ${title}`;
    const found = videoMap.find(([re]) => re.test(text)) || videoMap[videoMap.length - 1];
    return { bvid: found[1], title: found[2] };
  }

  function buildTopicKnowledge(topic, c) {
    const k = chapterKnowledge[c.language]?.[topic] || chapterKnowledge[c.language]?.general || [];
    return k;
  }

  function buildTopicWords(topic, c, d) {
    const topicWords = chapterWords[c.language]?.[topic];
    if (topicWords && topicWords.length) return topicWords;
    return d.words.slice(0, 10);
  }

  function buildTopicQuestions(topic, c, d) {
    const topicQs = chapterQuestions[c.language]?.[topic];
    if (topicQs && topicQs.length) return topicQs;
    return d.grammar.slice(0, 6);
  }

  function buildTopicDialogue(topic, c) {
    return chapterDialogues[c.language]?.[topic] || chapterDialogues[c.language]?.general || null;
  }

  function buildFillFromTopic(words, knowledge) {
    return words.slice(0, 5).map((w, i) => {
      const answer = w[0];
      const sentence = w[3] || w[2];
      const display = sentence.replace(answer, "_____");
      return `<div class="lv-card" style="padding:14px">
        <p><b>${i + 1}. ${esc(display)}</b></p>
        <input type="text" placeholder="输入答案…" data-lv-fill="${esc(answer)}"
          style="width:100%;padding:10px;border:1px solid #ddd;border-radius:12px;margin-top:8px;box-sizing:border-box">
        <button class="lv-primary" data-lv-check-fill="${esc(answer)}" style="margin-top:8px">提交答案</button>
      </div>`;
    }).join("");
  }

  function buildListenFromTopic(words, c) {
    return words.slice(0, 5).map((w, i) => `<div class="lv-card" style="padding:14px">
      <p><b>${i + 1}. 听写练习</b></p>
      <p class="lv-tip">点击播放，写下你听到的单词，然后提交验证。</p>
      <button class="lv-primary" data-lv-speak="${esc(w[0])}" data-lv-lang="${c.language}">🔊 播放</button>
      <input type="text" placeholder="写下你听到的…" data-lv-dictation="${esc(w[0])}"
        style="width:100%;padding:10px;border:1px solid #ddd;border-radius:12px;margin-top:8px;box-sizing:border-box">
      <button class="lv-ghost" data-lv-check-dictation="${esc(w[0])}" style="margin-top:8px">验证</button>
    </div>`).join("");
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
