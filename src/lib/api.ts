const STORAGE_KEYS = {
  USERS: 'lv_users',
  CURRENT_USER: 'lv_current_user',
  PROGRESS: 'lv_progress',
  POSTS: 'lv_posts',
  ACHIEVEMENTS: 'lv_achievements',
  ENROLLMENTS: 'lv_enrollments',
};

const mockCourses = [
  {
    id: 1,
    title: '英语零基础入门',
    language: 'en',
    level: 'beginner',
    description: '从零开始学习英语基础',
    totalChapters: 12,
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
    overview: '本课程专为英语零基础学习者设计，从26个英文字母开始，通过生动有趣的教学方法，带领学员逐步掌握英语基础知识。课程涵盖日常词汇、基本语法、简单句型等，帮助学习者建立扎实的英语基础，为后续学习打下坚实基础。',
    learningObjectives: [
      '掌握26个英文字母的发音和书写',
      '学习100+日常生活常用词汇',
      '掌握基础英语语法概念',
      '能够进行简单的日常问候和对话',
      '建立英语学习的自信心'
    ],
    courseFeatures: [
      '趣味字母学习法',
      '情景式单词记忆',
      '基础语法图表化讲解'
    ],
    suitableFor: [
      '英语零基础学习者',
      '想重新系统学习英语的成年人',
      '准备学习其他外语但需要先掌握英语的人',
      '对英语文化感兴趣的学习者'
    ],
    chapters: [
      { id: 1, title: '英文字母与发音基础', description: '学习26个英文字母的发音和书写', duration: 15, completed: false, keyPoints: ['26个字母的名称音', '字母的基本发音规则', '字母的书写规范', '字母在单词中的常见发音'], vocabulary: ['A, B, C (字母名称)', 'cat, dog, egg (示例单词)', 'apple, book, cup (简单单词)'], exercises: ['字母辨认练习', '字母书写练习', '字母发音跟读'] },
      { id: 2, title: '基础单词：日常用语', description: '掌握最常用的日常英语单词', duration: 20, completed: false, keyPoints: ['问候语词汇', '告别语词汇', '感谢与道歉用语', '基本社交词汇'], vocabulary: ['hello, hi (你好)', 'goodbye, bye (再见)', 'thank you, thanks (谢谢)', 'sorry, excuse me (对不起)'], exercises: ['单词配对练习', '图片识单词练习', '单词拼写测验'] },
      { id: 3, title: '数字与时间表达', description: '学习数字和时间的基本表达方式', duration: 15, completed: false, keyPoints: ['1-100数字表达', '基数词与序数词', '时间表达法', '日期表达方式'], vocabulary: ['one, two, three (数字)', 'morning, afternoon, evening (时间)', 'today, tomorrow, yesterday (日期)'], exercises: ['数字听力练习', '时间表达口语练习', '数字排序游戏'] },
      { id: 4, title: '颜色与形状词汇', description: '认识各种颜色和形状的英文词汇', duration: 10, completed: false, keyPoints: ['基本颜色词汇', '常见形状词汇', '颜色与形状的描述', '颜色在日常表达中的应用'], vocabulary: ['red, blue, green (颜色)', 'circle, square, triangle (形状)', 'big, small, round (描述)'], exercises: ['颜色配对练习', '形状辨认游戏', '颜色形状综合练习'] },
      { id: 5, title: '家庭成员称呼', description: '学习家庭成员的英文称呼', duration: 15, completed: false, keyPoints: ['直系亲属称呼', 'extended家庭成员称呼', '所有格的使用', '家庭关系的描述'], vocabulary: ['mother, father (父母)', 'brother, sister (兄弟姐妹)', 'grandparents, cousins (祖父母和表亲)'], exercises: ['家庭成员单词记忆', '家庭关系描述练习', '家庭树绘制作业'] },
      { id: 6, title: '基础句型结构', description: '掌握英语基本句型结构', duration: 20, completed: false, keyPoints: ['主谓宾基本句型', '肯定句与否定句', '一般疑问句结构', '特殊疑问词的使用'], vocabulary: ['I am, You are (主系表)', 'I like, She eats (主谓宾)', 'What, Where, Who (疑问词)'], exercises: ['句型转换练习', '造句练习', '句子改错练习'] },
      { id: 7, title: 'Be动词的用法', description: '学习be动词在各种句型中的使用', duration: 25, completed: false, keyPoints: ['be动词的形式(am/is/are)', 'be动词的肯定句', 'be动词的否定句', 'be动词的一般疑问句'], vocabulary: ['I am tall (我很高)', 'He is a student (他是学生)', 'They are happy (他们很开心)'], exercises: ['be动词填空练习', '肯定句转否定句', '一般疑问句回答练习'] },
      { id: 8, title: '一般现在时', description: '掌握一般现在时的用法', duration: 30, completed: false, keyPoints: ['一般现在时的构成', '第三人称单数变化', '频度副词的使用', '习惯性动作的表达'], vocabulary: ['always, usually, often (频度副词)', 'works, lives, likes (第三人称)', 'every day, sometimes (时间状语)'], exercises: ['时态填空练习', '第三人称单数变形练习', '短文改写练习'] },
      { id: 9, title: '冠词a/an/the', description: '学习不定冠词和定冠词的用法', duration: 20, completed: false, keyPoints: ['a和an的基本用法', '元音音素开头的单词', 'the的特指用法', '零冠词的情况'], vocabulary: ['a book, an apple (不定冠词)', 'the sun, the sky (定冠词)', 'school, bed (零冠词)'], exercises: ['冠词选择练习', '冠词填空练习', '短文冠词纠错'] },
      { id: 10, title: '基础介词用法', description: '掌握常用介词的基本用法', duration: 25, completed: false, keyPoints: ['时间介词(in/on/at)', '地点介词(in/on/at/to)', '方位介词(above, below, between)', '介词短语的使用'], vocabulary: ['in the morning, on Monday (时间)', 'in the room, on the table (地点)', 'in front of, behind (方位)'], exercises: ['介词选择练习', '介词填空练习', '介词短语造句'] },
      { id: 11, title: '简单问答句型', description: '学习基础问答句型的构成', duration: 30, completed: false, keyPoints: ['Yes/No问句', 'What/Where/Who问句', 'How many/How much问句', '简短回答的表达'], vocabulary: ['Is it...? Yes, it is / No, it isn\'t', 'What is...? / Where is...?', 'How many...? / How much...?'], exercises: ['问答配对练习', '情景对话练习', '问卷调查练习'] },
      { id: 12, title: '日常对话练习', description: '综合运用所学知识进行日常对话', duration: 35, completed: false, keyPoints: ['自我介绍表达', '购物场景对话', '问路指路表达', '电话礼仪用语'], vocabulary: ['My name is..., I am from... (自我介绍)', 'How much is...? / Can I help you? (购物)', 'Where is...? / Go straight... (问路)'], exercises: ['角色扮演练习', '情景对话测试', '综合口语表达'] },
    ],
  },
  {
    id: 2,
    title: '英语中级进阶',
    language: 'en',
    level: 'intermediate',
    description: '提升英语听说读写能力',
    totalChapters: 12,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    overview: '本课程面向具备基础英语知识的学员，深入学习各种时态、从句和非谓语动词等中级语法知识。通过丰富的例句和练习，帮助学员提升英语综合运用能力，能够进行较为复杂的口语和书面表达。',
    learningObjectives: [
      '熟练掌握过去时、将来时、进行时等时态',
      '学会使用比较级和最高级',
      '理解并运用条件句和被动语态',
      '掌握定语从句和状语从句的基本用法',
      '提升阅读理解和写作能力'
    ],
    courseFeatures: [
      '系统时态讲解',
      '从句结构图解',
      '写作技巧训练'
    ],
    suitableFor: [
      '已掌握基础英语的学习者',
      '需要提升语法系统性的学习者',
      '准备参加英语考试的学习者',
      '希望提高商务英语基础的学习者'
    ],
    chapters: [
      { id: 1, title: '一般过去时详解', description: '深入学习和掌握一般过去时的用法', duration: 30, completed: false, keyPoints: ['一般过去时的构成规则', '动词过去式的不规则变化', '过去时间状语的使用', '过去时在叙述中的应用'], vocabulary: ['yesterday, last week, ago (过去时间)', 'walked, visited, had (过去式)', 'was, were (be动词过去式)'], exercises: ['动词过去式变形练习', '短文时态转换', '过去时阅读理解'] },
      { id: 2, title: '一般将来时表达', description: '学习将来时态的多种表达方式', duration: 25, completed: false, keyPoints: ['will和be going to的区别', '将来时的肯定否定疑问句', '各种将来时间表达', '意图与预测的表达'], vocabulary: ['will, shall (将来助动词)', 'be going to (计划打算)', 'tomorrow, next week, soon (将来时间)'], exercises: ['will与be going to选择练习', '将来时句型转换', '将来时写作练习'] },
      { id: 3, title: '进行时态运用', description: '掌握现在进行时和过去进行时', duration: 30, completed: false, keyPoints: ['现在进行时的构成和使用', '过去进行时的构成和使用', '进行时态的特殊用法', '进行时与一般时的对比'], vocabulary: ['is/am/are + v-ing (现在进行)', 'was/were + v-ing (过去进行)', 'right now, at the moment (时间状语)'], exercises: ['进行时填空练习', '时态对比练习', '情景描述练习'] },
      { id: 4, title: '比较级与最高级', description: '学习形容词的比较级和最高级用法', duration: 25, completed: false, keyPoints: ['比较级和最高级的构成规则', 'more...than, the most...结构', 'as...as原级比较', '比较级和最高级的不规则变化'], vocabulary: ['taller, more beautiful (比较级)', 'the tallest, the most beautiful (最高级)', 'better, worse, more (不规则)'], exercises: ['比较级变形练习', '比较句型转换', '综合比较练习'] },
      { id: 5, title: '被动语态基础', description: '理解和运用被动语态的基本结构', duration: 35, completed: false, keyPoints: ['被动语态的构成规则', '各种时态的被动语态', 'by短语的使用', '主动语态转被动语态'], vocabulary: ['is/are + p.p. (现在被动)', 'was/were + p.p. (过去被动)', 'by + 施动者 (施动者)'], exercises: ['被动语态转换练习', '不同时态被动语态练习', '被动语态写作练习'] },
      { id: 6, title: '条件句If用法', description: '掌握各种条件句的使用方法', duration: 30, completed: false, keyPoints: ['第一类条件句(真实条件)', '第二类条件句(虚拟现在)', '第三类条件句(虚拟过去)', '条件句的时态搭配'], vocabulary: ['if + present, will... (第一类)', 'if + past, would... (第二类)', 'if + had p.p., would have... (第三类)'], exercises: ['条件句类型识别', '条件句造句练习', '混合条件句练习'] },
      { id: 7, title: '定语从句入门', description: '学习定语从句的基本结构', duration: 35, completed: false, keyPoints: ['定语从句的概念和作用', '关系代词who/whom/which/that', '关系副词when/where/why', '限制性定语从句'], vocabulary: ['who (指人主语)', 'whom (指人宾语)', 'which/that (指物)'], exercises: ['关系代词选择练习', '合并句子练习', '定语从句识别练习'] },
      { id: 8, title: '名词性从句', description: '掌握主语从句、宾语从句等', duration: 30, completed: false, keyPoints: ['主语从句的概念', '宾语从句的用法', '表语从句的结构', 'that与whether/if的区别'], vocabulary: ['that (无意义连词)', 'whether, if (是否)', 'what, which, who (疑问)'], exercises: ['从句识别练习', '名词性从句转换', '从句写作练习'] },
      { id: 9, title: '状语从句', description: '学习时间、地点、原因状语从句', duration: 35, completed: false, keyPoints: ['时间状语从句(when, while, after)', '地点状语从句(where, wherever)', '原因状语从句(because, since, as)', '让步状语从句(although, though)'], vocabulary: ['when, while, before, after (时间)', 'because, since, as (原因)', 'although, even though (让步)'], exercises: ['状语从句连接词选择', '状语从句转换练习', '复合句写作练习'] },
      { id: 10, title: '非谓语动词基础', description: '理解不定式、动名词和分词', duration: 40, completed: false, keyPoints: ['不定式的用法', '动名词的用法', '现在分词与过去分词', '非谓语动词在句中的作用'], vocabulary: ['to + v (不定式)', 'v-ing (动名词)', 'v-ing, v-ed (分词)'], exercises: ['非谓语动词形式练习', '不定式与动名词选择', '非谓语动词改写练习'] },
      { id: 11, title: '间接引语', description: '学习直接引语转间接引语的方法', duration: 30, completed: false, keyPoints: ['直接引语转间接引语规则', '时态的倒退规则', '人称变化规则', '时间地点状语的变化'], vocabulary: ['said, told (引语动词)', 'that (无意义连词)', 'yesterday, the day before (时间变化)'], exercises: ['直接引语转间接引语练习', '时态倒退练习', '引语转换综合练习'] },
      { id: 12, title: '中级写作技巧', description: '提升英语写作能力', duration: 45, completed: false, keyPoints: ['段落写作结构', '主题句的写法', '衔接词的使用', '常见写作错误纠正'], vocabulary: ['first, second, finally (顺序)', 'however, therefore, moreover (衔接)', 'in conclusion, in summary (总结)'], exercises: ['段落写作练习', '文章结构分析', '写作修改练习'] },
    ],
  },
  {
    id: 3,
    title: '英语高级精通',
    language: 'en',
    level: 'advanced',
    description: '高级英语表达与文化',
    totalChapters: 12,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
    overview: '本课程专为希望精通英语的学习者设计，深入学习虚拟语气、倒装句、独立主格等高级语法结构，同时涵盖学术写作、商务英语、演讲技巧等专业领域，帮助学员达到接近母语者的英语水平。',
    learningObjectives: [
      '掌握虚拟语气的各种用法',
      '熟练运用倒装和强调句型',
      '能够阅读和撰写学术论文',
      '掌握商务英语的专业表达',
      '具备公众演讲和辩论能力'
    ],
    courseFeatures: [
      '高级语法深度解析',
      '学术写作训练',
      '商务场景实战'
    ],
    suitableFor: [
      '英语水平较高的学习者',
      '准备留学或学术研究的学习者',
      '需要使用专业英语的工作者',
      '希望提升语言层次的高端学习者'
    ],
    chapters: [
      { id: 1, title: '虚拟语气详解', description: '掌握虚拟语气的各种用法', duration: 40, completed: false, keyPoints: ['现在虚拟语气的用法', '过去虚拟语气的用法', '将来虚拟语气的用法', '虚拟语气在条件句中的应用'], vocabulary: ['if + were, would + v (现在)', 'if + had p.p., would have p.p. (过去)', 'if + should + v, would + v (将来)'], exercises: ['虚拟语气填空练习', '虚拟条件句改写', '虚拟语气综合练习'] },
      { id: 2, title: '倒装结构', description: '学习完全倒装和部分倒装', duration: 35, completed: false, keyPoints: ['完全倒装的规则', '部分倒装的规则', '否定词开头的倒装', '虚拟语气中的倒装'], vocabulary: ['here comes, there goes (完全倒装)', 'only, never, seldom (部分倒装)', 'had I known, were he to (省略if)'], exercises: ['倒装句识别练习', '倒装句转换练习', '倒装句写作练习'] },
      { id: 3, title: '强调句型', description: '掌握强调句的结构和用法', duration: 30, completed: false, keyPoints: ['It is...that强调句', '强调句的时态变化', '强调句与定语从句的区别', '其他强调表达方式'], vocabulary: ['It is...that (强调句型)', 'do/does/did + v (强调谓语)', 'very, even, just (强调词)'], exercises: ['强调句转换练习', '强调句识别练习', '强调句写作练习'] },
      { id: 4, title: '独立主格结构', description: '学习独立主格的构成和功能', duration: 40, completed: false, keyPoints: ['独立主格的概念', '名词+分词结构', 'with + 宾语 + 宾补', '独立主格在写作中的应用'], vocabulary: ['weather permitting (独立主格)', 'the work done (名词+过去分词)', 'with the meeting over (with结构)'], exercises: ['独立主格识别练习', '独立主格改写练习', '独立主格写作应用'] },
      { id: 5, title: '复杂定语从句', description: '深入理解复杂定语从句', duration: 45, completed: false, keyPoints: ['非限制性定语从句', 'as/which引导的非限制性从句', '介词+关系代词结构', '定语从句的省略'], vocabulary: ['which, who (非限制性)', 'the same...as, such...as', 'in which, on which (介词+关系代词)'], exercises: ['限制性与非限制性从句辨别', '定语从句省略练习', '复杂定语从句写作'] },
      { id: 6, title: '高级非谓语动词', description: '掌握非谓语动词的高级用法', duration: 50, completed: false, keyPoints: ['不定式的完成式和进行式', '动名词的复合结构', '垂悬分词结构', '非谓语动词的时态意义'], vocabulary: ['to have done, to be doing (不定式高级)', 'his coming, obj + v-ing (动名词复合)', 'generally speaking (垂悬分词)'], exercises: ['非谓语动词高级形式练习', '动名词复合结构练习', '非谓语动词综合应用'] },
      { id: 7, title: '学术写作规范', description: '学习学术英语写作规范', duration: 55, completed: false, keyPoints: ['学术论文结构', '引用和参考文献格式', '学术词汇的使用', '避免plagiarism的方法'], vocabulary: ['however, moreover, consequently (学术衔接)', 'suggest, indicate, demonstrate (学术动词)', 'significant, sufficient, relevant (学术形容词)'], exercises: ['学术段落写作', '引用格式练习', '学术文章分析'] },
      { id: 8, title: '商务英语表达', description: '掌握商务英语的专业表达', duration: 50, completed: false, keyPoints: ['商务会议用语', '商务邮件写作', '谈判和协商表达', '商务礼仪用语'], vocabulary: ['I would like to propose... (商务提议)', 'Please find attached... (邮件开场)', 'We believe that... (商务表达)'], exercises: ['商务邮件写作', '会议对话模拟', '商务谈判练习'] },
      { id: 9, title: '演讲与辩论技巧', description: '提升演讲和辩论能力', duration: 60, completed: false, keyPoints: ['演讲结构设计', '开场和结尾技巧', '辩论逻辑构建', '反驳与应答策略'], vocabulary: ['Ladies and gentlemen... (开场)', 'In conclusion... (结尾)', 'I beg to differ... (反驳)'], exercises: ['演讲稿写作', '演讲模拟练习', '辩论实战演练'] },
      { id: 10, title: '英美文化差异', description: '了解英美文化的异同', duration: 45, completed: false, keyPoints: ['英语与美语的词汇差异', '文化习俗差异', '社交礼仪差异', '商务文化差异'], vocabulary: ['lift/elevator, rubbish/trash (词汇差异)', 'Mind your p\'s and q\'s (礼仪)', 'football/soccer (文化差异)'], exercises: ['英美英语辨别练习', '文化差异分析', '跨文化交际练习'] },
      { id: 11, title: '文学作品赏析', description: '分析和欣赏英语文学作品', duration: 55, completed: false, keyPoints: ['文学分析基本方法', '修辞手法识别', '作品主题探讨', '文学评论写作'], vocabulary: ['metaphor, simile, personification (修辞)', 'theme, motif, symbolism (文学术语)', 'irony, allegory, satire (文学手法)'], exercises: ['文学作品阅读分析', '修辞手法识别练习', '文学评论写作'] },
      { id: 12, title: '高级翻译技巧', description: '掌握翻译的高级技巧和策略', duration: 60, completed: false, keyPoints: ['英汉语言差异对比', '长难句翻译策略', '文化负载词的翻译', '翻译中的增译与省译'], vocabulary: ['信、达、雅 (翻译标准)', '四字格 (汉语特色)', 'translationese (翻译腔)'], exercises: ['英译汉练习', '汉译英练习', '翻译作品评析'] },
    ],
  },
  {
    id: 4,
    title: '日语零基础入门',
    language: 'ja',
    level: 'beginner',
    description: '从五十音开始学日语',
    totalChapters: 12,
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&fit=crop',
    overview: '本课程从日语零基础开始，带领学员系统学习五十音图（平假名和片假名）、基础词汇、基础助词和基本句型。课程采用循序渐进的方式，通过情景对话和实际应用，帮助学员快速入门日语。',
    learningObjectives: [
      '熟练掌握五十音图（平假名和片假名）',
      '学习100+基础日语词汇',
      '掌握基础助词は/が/を/に/で等的用法',
      '能够进行简单的自我介绍和日常问候',
      '了解日语的基本句型结构'
    ],
    courseFeatures: [
      '五十音图趣味记忆法',
      '情景式教学',
      '发音语调训练'
    ],
    suitableFor: [
      '日语零基础学习者',
      '对日本文化感兴趣的学习者',
      '准备赴日旅游或工作的学习者',
      '想系统学习日语发音的学习者'
    ],
    chapters: [
      {
        id: 1,
        title: '日语概览与五十音图',
        description: '了解日语特点，学习五十音图基础',
        duration: 30,
        completed: false,
        keyPoints: ['日语的文字系统构成', '五十音图的整体结构', '清音的分类', '学习方法与技巧'],
        vocabulary: ['あ行, い行, う行 (元音行)', '清音, 濁音, 半濁音 (音的分类)', '五十音図 (五十音图)'],
        content: `日语是一种独特的语言，拥有三种主要的文字系统：平假名、片假名和汉字。

【平假名】
平假名是日语中最基础的文字，用于表示日语的发音。每个平假名代表一个音节（假名）。平假名的字形圆润柔和，源自中国汉字的草书。

【片假名】
片假名与平假名一一对应，主要用于书写外来语、外国人名地名、拟声词等。片假名的字形较为方正硬朗。

【汉字】
日语中使用大量汉字（称为" kanji "），这些汉字通常表示事物的名称或动作的含义。一个汉字往往有多种读音。

【五十音图】
五十音图是日语假名的发音表，按元音和辅音的组合排列而成。它由5个元音（あいうえお）和9个辅音行（かきくけこ、さしすせそ等）组成，共45个清音假名，加上拨音ん共46个基本假名。

学习建议：
1. 先记住あ行五个元音的发音
2. 按行记忆，每天学习2-3行
3. 结合单词来记忆，效果更好
4. 多听多写，加深印象`,
        lessonWords: [
          { word: 'あ', pronunciation: 'a', translation: '啊（元音）', example: 'あめ（雨）' },
          { word: 'い', pronunciation: 'i', translation: '衣（元音）', example: 'いぬ（犬）' },
          { word: 'う', pronunciation: 'u', translation: '乌（元音）', example: 'うみ（海）' },
          { word: 'え', pronunciation: 'e', translation: '诶（元音）', example: 'えき（駅）' },
          { word: 'お', pronunciation: 'o', translation: '哦（元音）', example: 'おかね（お金）' },
          { word: '五十音図', pronunciation: 'gojuuonzu', translation: '五十音图', example: '五十音図を覚えます。' },
          { word: '平仮名', pronunciation: 'hiragana', translation: '平假名', example: '平仮名を勉強します。' },
          { word: '片仮名', pronunciation: 'katakana', translation: '片假名', example: '片仮名も勉強します。' }
        ],
        lessonGrammar: [
          {
            title: '日语的音节结构',
            explanation: '日语是一种音节语言，每个假名代表一个音节。日语的音节结构简单，主要由"辅音+元音"构成。五个元音あいうえお是日语发音的基础。',
            examples: ['あ（a）- 元音', 'か（ka）- 辅音k + 元音a', 'さ（sa）- 辅音s + 元音a']
          }
        ],
        lessonDialogue: {
          title: '初次见面的问候',
          transcript: `A：はじめまして。
B：はじめまして。
A：日本語を勉強します。
B：がんばってください。`,
          translation: `A：初次见面。
B：初次见面。
A：我学习日语。
B：请加油。`
        },
        exercises: [
          {
            question: '日语中表示元音的五个假名是哪一个选项？',
            options: ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと'],
            correctAnswer: 'あいうえお',
            explanation: 'あいうえお是日语的五个元音，也是五十音图的第一行。其他选项分别是か行、さ行、た行的假名。'
          },
          {
            question: '以下哪种文字主要用于书写外来语？',
            options: ['平假名', '片假名', '汉字', '罗马字'],
            correctAnswer: '片假名',
            explanation: '片假名主要用于书写外来语、外国人名和地名、拟声词等。平假名用于日语固有词汇和语法助词，汉字表示含义。'
          },
          {
            question: '五十音图中一共有多少个基本清音假名？',
            options: ['5个', '45个', '50个', '100个'],
            correctAnswer: '45个',
            explanation: '五十音图由5个元音和9行辅音组成，共45个清音假名，加上拨音ん后共46个基本假名。虽然叫"五十音"，但实际只有45个清音。'
          }
        ]
      },
      {
        id: 2,
        title: '平假名学习（あ行〜な行）',
        description: '学习あ行到な行的平假名',
        duration: 25,
        completed: false,
        keyPoints: ['あ行元音的发音', 'か行、さ行、た行、な行的发音', '平假名的书写笔顺', '单词音节划分'],
        vocabulary: ['あ, い, う, え, お (あ行)', 'な, に, ぬ, ね, の (な行)', 'あめ (雨), うみ (海), あいだ (間)'],
        content: `今天我们学习あ行到な行的平假名，共5行25个假名。

【あ行（元音行）】
あ（a）：开口音，类似汉语"啊"
い（i）：舌面前音，类似汉语"衣"
う（u）：圆唇音，类似汉语"乌"，但嘴型不要太圆
え（e）：类似汉语"诶"
お（o）：圆唇音，类似汉语"哦"

【か行（k + 元音）】
か（ka）き（ki）く（ku）け（ke）こ（ko）
发音时气流冲破阻碍，发出k音后接元音。

【さ行（s + 元音）】
さ（sa）し（shi）す（su）せ（se）そ（so）
注意：し读作shi（西），す的发音介于su和si之间。

【た行（t + 元音）】
た（ta）ち（chi）つ（tsu）て（te）と（to）
注意：ち读作chi（七），つ读作tsu（次）。

【な行（n + 元音）】
な（na）に（ni）ぬ（nu）ね（ne）の（no）
鼻音n加上元音。

书写注意：
1. 每个假名都有固定的笔顺，按笔顺书写更容易记住
2. 平假名整体圆润流畅
3. 可以边写边读，加深记忆`,
        lessonWords: [
          { word: 'あめ', pronunciation: 'ame', translation: '雨', example: 'あめが降ります。' },
          { word: 'いぬ', pronunciation: 'inu', translation: '狗', example: 'いぬがいます。' },
          { word: 'うみ', pronunciation: 'umi', translation: '海', example: 'うみに行きます。' },
          { word: 'えき', pronunciation: 'eki', translation: '车站', example: 'えきで待ちます。' },
          { word: 'おかね', pronunciation: 'okane', translation: '钱', example: 'おかねを持っています。' },
          { word: 'かさ', pronunciation: 'kasa', translation: '伞', example: 'かさをさします。' },
          { word: 'さくら', pronunciation: 'sakura', translation: '樱花', example: 'さくらがきれいです。' },
          { word: 'たまご', pronunciation: 'tamago', translation: '鸡蛋', example: 'たまごを食べます。' },
          { word: 'なまえ', pronunciation: 'namae', translation: '名字', example: 'おなまえは？' }
        ],
        lessonGrammar: [
          {
            title: '日语的词调（高低起伏）',
            explanation: '日语的单词有高低起伏的音调。一个词中，高音部分和低音部分有明显区别。初学者可以先模仿标准发音，逐渐体会词调的变化。',
            examples: ['あめ（雨）：低高型', 'さくら（桜）：高低低型', 'たまご（卵）：低高低型']
          }
        ],
        lessonDialogue: {
          title: '在学校',
          transcript: `A：おはようございます。
B：おはようございます。
A：きょうはなにをしますか。
B：にほんごをべんきょうします。`,
          translation: `A：早上好。
B：早上好。
A：今天做什么？
B：学日语。`
        },
        exercises: [
          {
            question: '假名「き」的读音是？',
            options: ['ka', 'ki', 'ku', 'ke'],
            correctAnswer: 'ki',
            explanation: 'き是か行的第二个假名，读作ki。か行假名：か(ka)、き(ki)、く(ku)、け(ke)、こ(ko)。'
          },
          {
            question: '单词「あめ」的意思是？',
            options: ['海', '雨', '狗', '车站'],
            correctAnswer: '雨',
            explanation: 'あめ（雨）是"雨"的意思。海是うみ（umi），狗是いぬ（inu），车站是えき（eki）。'
          },
          {
            question: 'さ行的第二个假名し的发音是？',
            options: ['sa', 'shi', 'su', 'se'],
            correctAnswer: 'shi',
            explanation: 'し读作shi（类似于汉语"西"），而不是si。这是さ行的特殊发音，需要特别注意。'
          }
        ]
      },
      {
        id: 3,
        title: '平假名学习（は行〜わ行）',
        description: '学习は行到わ行的平假名',
        duration: 25,
        completed: false,
        keyPoints: ['は行的发音特点', 'ま行和や行的发音', 'ら行和わ行的发音', '拨音ん的发音规则'],
        vocabulary: ['は, ひ, ふ, へ, ほ (は行)', 'ま, み, む, め, も (ま行)', 'わ, を, ん (特殊假名)'],
        content: `继续学习后半部分的平假名：は行到わ行，以及特殊假名ん。

【は行（h + 元音）】
は（ha）ひ（hi）ふ（fu）へ（he）ほ（ho）
注意：ふ的发音接近fu，但更轻，上下唇不接触。

【ま行（m + 元音）】
ま（ma）み（mi）む（mu）め（me）も（mo）
鼻音m加上元音，发音比较容易掌握。

【や行（y + 元音）】
や（ya）ゆ（yu）よ（yo）
や行只有三个假名：や、ゆ、よ。い和え在现代日语中与あ行的い和え发音相同，所以省略了。

【ら行（r + 元音）】
ら（ra）り（ri）る（ru）れ（re）ろ（ro）
注意：日语的r发音与汉语的r和l都不同，舌尖轻弹上齿龈。

【わ行（w + 元音）】
わ（wa）を（wo）
现代日语中わ行只剩わ和を两个假名。を主要用作助词，读作o。

【拨音ん】
ん（n）是特殊的假名，叫做"拨音"，不能单独使用，必须跟在其他假名后面，表示鼻音。

总结：现在我们学完了所有46个基本平假名，要多写多读多练哦！`,
        lessonWords: [
          { word: 'はな', pronunciation: 'hana', translation: '花/鼻子', example: 'はながきれいです。' },
          { word: 'ひと', pronunciation: 'hito', translation: '人', example: 'ひとがおおいです。' },
          { word: 'ふく', pronunciation: 'fuku', translation: '衣服', example: 'ふくをきます。' },
          { word: 'まち', pronunciation: 'machi', translation: '城市', example: 'まちに住んでいます。' },
          { word: 'やま', pronunciation: 'yama', translation: '山', example: 'やまにのぼります。' },
          { word: 'ゆき', pronunciation: 'yuki', translation: '雪', example: 'ゆきが降ります。' },
          { word: 'りんご', pronunciation: 'ringo', translation: '苹果', example: 'りんごを食べます。' },
          { word: 'わたし', pronunciation: 'watashi', translation: '我', example: 'わたしは学生です。' }
        ],
        lessonGrammar: [
          {
            title: '拨音ん的使用',
            explanation: '拨音ん是日语中唯一的辅音假名，不能单独使用，必须接在其他假名后面。它的发音会根据后面的音发生变化，有时发n，有时发m或ng。',
            examples: ['さん（san）- 三', 'まんが（manga）- 漫画', 'てんき（tenki）- 天气']
          }
        ],
        lessonDialogue: {
          title: '自我介绍',
          transcript: `A：はじめまして。
B：はじめまして。
A：わたしはまりです。
B：わたしはけんじです。
A：よろしくおねがいします。
B：こちらこそ。`,
          translation: `A：初次见面。
B：初次见面。
A：我是麻里。
B：我是健二。
A：请多关照。
B：彼此彼此。`
        },
        exercises: [
          {
            question: '假名「ふ」的发音接近以下哪个？',
            options: ['hu', 'fu', 'bu', 'pu'],
            correctAnswer: 'fu',
            explanation: 'ふ的发音接近fu，但比汉语的"夫"更轻，上下唇不要完全闭合。は行假名：は(ha)、ひ(hi)、ふ(fu)、へ(he)、ほ(ho)。'
          },
          {
            question: '单词「わたし」的意思是？',
            options: ['你', '我', '他', '她'],
            correctAnswer: '我',
            explanation: 'わたし（私）是日语中最常用的第一人称代词"我"，男女通用，比较礼貌。'
          },
          {
            question: '关于拨音ん，以下说法正确的是？',
            options: ['可以单独使用', '不能单独使用，要跟在其他假名后面', '只发n音，没有变化', '是元音假名'],
            correctAnswer: '不能单独使用，要跟在其他假名后面',
            explanation: '拨音ん不能单独使用，必须接在其他假名后面。它的发音会根据后面的音发生变化（n、m、ng等）。'
          }
        ]
      },
      {
        id: 4,
        title: '片假名学习（基本音）',
        description: '掌握片假名的基本发音',
        duration: 30,
        completed: false,
        keyPoints: ['片假名与平假名的对应', '片假名的使用场景', '外来语片假名记忆法', '片假名书写练习'],
        vocabulary: ['ア, イ, ウ, エ, オ (片假名元音)', 'カ, キ, ク, ケ, コ (片假名ka行)', 'コーヒー, テレビ, パン (外来语)'],
        content: `片假名是日语的另一种假名系统，与平假名一一对应。

【片假名的特点】
1. 字形方正、硬朗，有棱有角
2. 与平假名发音完全相同，只是写法不同
3. 主要用于：外来语、外国人名地名、拟声词、强调的词语

【片假名使用场景】
• 外来语：コーヒー（咖啡）、テレビ（电视）
• 外国人名：トム（汤姆）、マリア（玛丽亚）
• 外国地名：アメリカ（美国）、ロンドン（伦敦）
• 拟声词：ドキドキ（心跳）、キラキラ（闪闪发光）
• 动物叫声：ワンワン（汪汪）、ニャーニャー（喵喵）

【长音符号】
片假名的长音用"ー"表示，而不是像平假名那样用あいうえお。
例如：コーヒー（ko-hi-）、テーブル（te-buru）

【学习建议】
1. 与平假名对照着学，加深印象
2. 多记外来语单词，顺便记片假名
3. 写的时候注意片假名的直线和棱角
4. 每天复习，避免混淆

アイウエオ、カキクケコ、サシスセソ、タチツテト、ナニヌネノ
ハヒフヘホ、マミムメモ、ヤユヨ、ラリルレロ、ワヲン`,
        lessonWords: [
          { word: 'コーヒー', pronunciation: 'ko-hi-', translation: '咖啡', example: 'コーヒーを飲みます。' },
          { word: 'テレビ', pronunciation: 'terebi', translation: '电视', example: 'テレビを見ます。' },
          { word: 'パン', pronunciation: 'pan', translation: '面包', example: 'パンを食べます。' },
          { word: 'アメリカ', pronunciation: 'amerika', translation: '美国', example: 'アメリカに行きます。' },
          { word: 'スーパー', pronunciation: 'su-pa-', translation: '超市', example: 'スーパーで買い物します。' },
          { word: 'レストラン', pronunciation: 'resutoran', translation: '餐厅', example: 'レストランでご飯を食べます。' },
          { word: 'バス', pronunciation: 'basu', translation: '公交车', example: 'バスで行きます。' },
          { word: 'ホテル', pronunciation: 'hoteru', translation: '酒店', example: 'ホテルに泊まります。' }
        ],
        lessonGrammar: [
          {
            title: '片假名长音的表示方法',
            explanation: '片假名的长音使用长音符号"ー"来表示，横写时写横线，竖写时写竖线。这是片假名与平假名的一个重要区别。',
            examples: ['コーヒー（咖啡）', 'テーブル（桌子）', 'スーパー（超市）']
          }
        ],
        lessonDialogue: {
          title: '在餐厅',
          transcript: `A：すみません。
B：はい。
A：コーヒーをください。
B：かしこまりました。
A：パンもおねがいします。
B：はい、わかりました。`,
          translation: `A：不好意思。
B：好的。
A：请给我咖啡。
B：明白了。
A：面包也麻烦了。
B：好的，知道了。`
        },
        exercises: [
          {
            question: '片假名「カ」对应的平假名是？',
            options: ['か', 'き', 'く', 'け'],
            correctAnswer: 'か',
            explanation: 'カ是片假名か行的第一个假名，对应的平假名是か（ka）。片假名和平假名发音完全相同，只是写法不同。'
          },
          {
            question: '单词「テレビ」的意思是？',
            options: ['电视', '收音机', '冰箱', '洗衣机'],
            correctAnswer: '电视',
            explanation: 'テレビ（terebi）是外来语，来自英语"television"的简化形式，意思是"电视"。'
          },
          {
            question: '片假名的长音用什么符号表示？',
            options: ['あいうえお', 'ー（长音符号）', 'っ（促音）', 'ん（拨音）'],
            correctAnswer: 'ー（长音符号）',
            explanation: '片假名的长音用长音符号"ー"表示，而平假名的长音用あいうえお来表示。这是两者的重要区别之一。'
          }
        ]
      },
      {
        id: 5,
        title: '基础词汇：日常问候',
        description: '学习常用的日常问候语',
        duration: 20,
        completed: false,
        keyPoints: ['基本问候语', '寒暄语的使用时机场合', '应答方式', '敬语基础概念'],
        vocabulary: ['おはよう, こんにちは, こんばんは (问候)', 'ありがとう, すみません (感谢道歉)', 'さようなら, また明日 (告别)'],
        content: `问候语是日语学习的第一步，不同时间使用不同的问候表达。

【早上的问候】
おはようございます（ohayou gozaimasu）- 早上好（礼貌）
おはよう（ohayou）- 早上好（随便，对朋友家人）
使用时间：早上到中午11点左右

【白天的问候】
こんにちは（konnichiwa）- 你好/下午好
使用时间：白天，大约11点到下午5-6点
注意：は在这里读作wa，不是ha

【晚上的问候】
こんばんは（konbanwa）- 晚上好
使用时间：晚上，天黑之后
注意：は在这里也读作wa

【感谢表达】
ありがとうございます（arigatou gozaimasu）- 谢谢（礼貌）
ありがとう（arigatou）- 谢谢（随便）
どうもありがとうございます - 非常感谢

【道歉表达】
すみません（sumimasen）- 对不起/劳驾/不好意思
すみません是个非常有用的词，除了道歉，还可以用来打招呼、引起注意、表示感谢等。

【告别表达】
さようなら（sayounara）- 再见（正式，长时间分别）
また明日（mata ashita）- 明天见
またね（matane）- 拜拜（随便）
おやすみなさい（oyasuminasai）- 晚安（睡前）

【初次见面】
はじめまして（hajimemashite）- 初次见面
どうぞよろしくお願いします（douzo yoroshiku onegaishimasu）- 请多关照
こちらこそ（kochirakoso）- 彼此彼此`,
        lessonWords: [
          { word: 'おはよう', pronunciation: 'ohayou', translation: '早上好', example: 'おはようございます！' },
          { word: 'こんにちは', pronunciation: 'konnichiwa', translation: '你好', example: 'こんにちは、元気ですか？' },
          { word: 'こんばんは', pronunciation: 'konbanwa', translation: '晚上好', example: 'こんばんは、お疲れ様です。' },
          { word: 'ありがとう', pronunciation: 'arigatou', translation: '谢谢', example: 'どうもありがとう！' },
          { word: 'すみません', pronunciation: 'sumimasen', translation: '对不起/劳驾', example: 'すみません、駅はどこですか？' },
          { word: 'さようなら', pronunciation: 'sayounara', translation: '再见', example: 'さようなら、また来週。' },
          { word: 'はじめまして', pronunciation: 'hajimemashite', translation: '初次见面', example: 'はじめまして、よろしく。' },
          { word: 'おやすみ', pronunciation: 'oyasumi', translation: '晚安', example: 'おやすみなさい。' }
        ],
        lessonGrammar: [
          {
            title: '日语的礼貌体（です/ます体）',
            explanation: '日语根据说话对象的不同，有不同的礼貌程度。です/ます体是最基本的礼貌表达方式，对陌生人、长辈、上级等使用。对朋友家人可以用简体。',
            examples: ['ありがとう（随便）→ ありがとうございます（礼貌）', 'おはよう（随便）→ おはようございます（礼貌）', 'おやすみ（随便）→ おやすみなさい（礼貌）']
          }
        ],
        lessonDialogue: {
          title: '早晨在学校',
          transcript: `A：おはようございます！
B：おはようございます！
A：きょうもいいてんきですね。
B：そうですね。
A：じゃあ、またあとで。
B：はい、また。`,
          translation: `A：早上好！
B：早上好！
A：今天也是好天气呢。
B：是啊。
A：那回头见。
B：嗯，回头见。`
        },
        exercises: [
          {
            question: '早上遇到老师，应该说什么？',
            options: ['こんばんは', 'おはようございます', 'こんにちは', 'おやすみなさい'],
            correctAnswer: 'おはようございます',
            explanation: '早上问候用"おはようございます"（早上好）。对老师要使用礼貌形式。こんばんは是晚上好，こんにちは是白天好，おやすみなさい是晚安。'
          },
          {
            question: '「こんにちは」中的「は」读作什么？',
            options: ['ha', 'wa', 'ba', 'pa'],
            correctAnswer: 'wa',
            explanation: '当は作为助词使用时，读作wa而不是ha。こんにちは中的は是助词，所以读作wa。同样的还有こんばんは中的は也读作wa。'
          },
          {
            question: '「すみません」不可以用于以下哪种情况？',
            options: ['道歉', '引起注意', '表示感谢', '说晚安'],
            correctAnswer: '说晚安',
            explanation: 'すみません是一个非常多功能的词，可以用于道歉、引起注意、甚至表示轻微的感谢。但不能用来道晚安，晚安要说おやすみなさい。'
          }
        ]
      },
      {
        id: 6,
        title: '数字与时间表达',
        description: '掌握日语数字和时间表达',
        duration: 25,
        completed: false,
        keyPoints: ['1-10的数字', '量词的种类和使用', '时间表达法', '日期和星期表达'],
        vocabulary: ['いち, に, さん, し, ご (数字)', 'ひとつ, ふたつ, みっつ (量词)', 'きょう, あした, きのう (时间)'],
        content: `数字是日语学习的重要部分，让我们从基础开始。

【基本数字（音读）】
1 いち（ichi）
2 に（ni）
3 さん（san）
4 し/よん（shi/yon）- 两种读法
5 ご（go）
6 ろく（roku）
7 しち/なな（shichi/nana）- 两种读法
8 はち（hachi）
9 く/きゅう（ku/kyuu）- 两种读法
10 じゅう（juu）

【训读数字（和语数字）】
日语还有一套传统的数字读法，叫"训读"，经常和量词一起使用：
1つ ひとつ（hitotsu）- 一个
2つ ふたつ（futatsu）- 两个
3つ みっつ（mittsu）- 三个
4つ よっつ（yottsu）- 四个
5つ いつつ（itsutsu）- 五个

【时间表达】
〜時（じ）- ...点
〜分（ふん/ぷん）- ...分
何時（なんじ）- 几点
何分（なんぷん）- 几分

例子：
3時 さんじ - 三点
5時半 ごじはん - 五点半
10時15分 じゅうじじゅうごふん - 十点十五分

【日期表达】
今日 きょう - 今天
明日 あした - 明天
昨日 きのう - 昨天
毎日 まいにち - 每天

【星期】
月曜日 げつようび - 星期一
火曜日 かようび - 星期二
水曜日 すいようび - 星期三
木曜日 もくようび - 星期四
金曜日 きんようび - 星期五
土曜日 どようび - 星期六
日曜日 にちようび - 星期日
何曜日 なんようび - 星期几`,
        lessonWords: [
          { word: 'いち', pronunciation: 'ichi', translation: '一', example: 'りんごが一つあります。' },
          { word: 'に', pronunciation: 'ni', translation: '二', example: 'にさつの本' },
          { word: 'さん', pronunciation: 'san', translation: '三', example: 'さん人います。' },
          { word: 'じゅう', pronunciation: 'juu', translation: '十', example: 'じゅう分待ちます。' },
          { word: '時', pronunciation: 'ji', translation: '点（时间）', example: '今何時ですか？' },
          { word: '今日', pronunciation: 'kyou', translation: '今天', example: '今日は月曜日です。' },
          { word: '明日', pronunciation: 'ashita', translation: '明天', example: '明日行きます。' },
          { word: '毎日', pronunciation: 'mainichi', translation: '每天', example: '毎日勉強します。' }
        ],
        lessonGrammar: [
          {
            title: '数字的音读和训读',
            explanation: '日语的数字有两种读法：音读（来自汉语的发音）和训读（日本固有的读法）。音读用于数数、时间、年龄等；训读经常用于数东西（和量词つ一起用）。',
            examples: ['音读：いち、に、さん、し、ご', '训读：ひとつ、ふたつ、みっつ、よっつ、いつつ', '4和7有两种音读：し/よん、しち/なな']
          }
        ],
        lessonDialogue: {
          title: '问时间',
          transcript: `A：すみません、今何時ですか？
B：今さんじです。
A：そうですか。ありがとうございます。
B：いいえ。
A：何時に学校が終わりますか。
B：ごじ半です。`,
          translation: `A：不好意思，现在几点？
B：现在三点。
A：这样啊，谢谢。
B：不客气。
A：几点放学？
B：五点半。`
        },
        exercises: [
          {
            question: '数字"4"的音读是什么？',
            options: ['さん', 'し/よん', 'ご', 'ろく'],
            correctAnswer: 'し/よん',
            explanation: '数字4有两种音读：し和よん。两种都可以使用，但有时候为了避免谐音忌讳，会用よん（比如4楼读作よんかい）。'
          },
          {
            question: '「今日」的意思是？',
            options: ['昨天', '今天', '明天', '每天'],
            correctAnswer: '今天',
            explanation: '今日（きょう）是"今天"的意思。昨天是昨日（きのう），明天是明日（あした），每天是毎日（まいにち）。'
          },
          {
            question: '「3時半」是什么意思？',
            options: ['3点整', '3点15分', '3点半', '3点45分'],
            correctAnswer: '3点半',
            explanation: '「半（はん）」表示"半"，也就是30分钟。3時半就是3点30分，即三点半。'
          }
        ]
      },
      {
        id: 7,
        title: '家庭成员称呼',
        description: '学习家庭成员的日语称呼',
        duration: 20,
        completed: false,
        keyPoints: ['家庭成员的称呼', '自称和他称', '家族关系的表达', '敬语与谦逊语的区别'],
        vocabulary: ['ちち, はは, きょうだい (直系)', 'そふ, そば, おじ, おば (亲戚)', 'かぞく, こども, せんせい (他人称呼)'],
        content: `学习家庭成员的称呼，要注意"自己家的人"和"别人家的人"说法不同。

【自己的家人（对外说时）】
父 ちち（chichi）- 父亲
母 はは（haha）- 母亲
兄 あに（ani）- 哥哥
姉 あね（ane）- 姐姐
弟 おとうと（otouto）- 弟弟
妹 いもうと（imouto）- 妹妹
祖父 そふ（sofu）- 祖父
祖母 そば（sobo）- 祖母

【称呼别人的家人（或当面叫自己家人）】
お父さん おとうさん（otousan）- 爸爸/您父亲
お母さん おかあさん（okaasan）- 妈妈/您母亲
お兄さん おにいさん（oniisan）- 哥哥/您哥哥
お姉さん おねえさん（oneesan）- 姐姐/您姐姐
弟さん おとうとさん（otoutosan）- 您弟弟
妹さん いもうとさん（imoutosan）- 您妹妹
おじいさん（ojiisan）- 爷爷/您祖父
おばあさん（obaasan）- 奶奶/您祖母

【其他家庭成员】
家族 かぞく（kazoku）- 家人，家族
子供 こども（kodomo）- 孩子
兄弟 きょうだい（kyoudai）- 兄弟姐妹
親 おや（oya）- 父母
一人っ子 ひとりっこ（hitorikko）- 独生子女

【使用规则】
1. 提到自己的家人时，用普通形式（ちち、はは等）
2. 称呼对方的家人时，加さん表示尊敬
3. 直接称呼自己的父母时，也用お父さん、お母さん`,
        lessonWords: [
          { word: '父', pronunciation: 'chichi', translation: '父亲（自谦）', example: '父は会社員です。' },
          { word: '母', pronunciation: 'haha', translation: '母亲（自谦）', example: '母は専業主婦です。' },
          { word: 'お父さん', pronunciation: 'otousan', translation: '爸爸/您父亲', example: 'お父さんはお元気ですか？' },
          { word: 'お母さん', pronunciation: 'okaasan', translation: '妈妈/您母亲', example: 'お母さんが料理します。' },
          { word: '兄', pronunciation: 'ani', translation: '哥哥（自谦）', example: '兄は大学生です。' },
          { word: '姉', pronunciation: 'ane', translation: '姐姐（自谦）', example: '姉は結婚しています。' },
          { word: '家族', pronunciation: 'kazoku', translation: '家人', example: '家族は何人ですか？' },
          { word: '子供', pronunciation: 'kodomo', translation: '孩子', example: '子供が公園で遊びます。' }
        ],
        lessonGrammar: [
          {
            title: '敬语之内外之分',
            explanation: '日语敬语的重要原则是"内外有别"。说到自己内部的人（家人、自己公司的人）时，用谦逊的说法；说到外部的人（对方的家人、客户）时，用尊敬的说法。',
            examples: ['我父亲：ちち（自谦）', '您父亲：お父さん（尊敬）', '我母亲：はは（自谦）', '您母亲：お母さん（尊敬）']
          }
        ],
        lessonDialogue: {
          title: '聊家庭',
          transcript: `A：家族は何人ですか。
B：四人です。
A：どんな家族ですか。
B：ちちとははとあねとわたしです。
A：お姉さんは何歳ですか。
B：二十二歳です。`,
          translation: `A：你家有几口人？
B：四口人。
A：什么家人？
B：爸爸、妈妈、姐姐和我。
A：你姐姐多大了？
B：22岁。`
        },
        exercises: [
          {
            question: '对外人说起自己的父亲，应该怎么称呼？',
            options: ['お父さん', 'ちち', 'おじさん', 'おじいさん'],
            correctAnswer: 'ちち',
            explanation: '对外人说起自己的家人时，要用谦逊的说法。父亲用ちち，母亲用はは。お父さん用于称呼对方的父亲或直接叫自己的爸爸。'
          },
          {
            question: '「お姉さん」的意思是？',
            options: ['妹妹', '姐姐/您姐姐', '妈妈', '奶奶'],
            correctAnswer: '姐姐/您姐姐',
            explanation: 'お姉さん有两个意思：一是直接称呼自己的姐姐，二是尊称对方的姐姐。说自己的姐姐（对外）时用姉（あね）。'
          },
          {
            question: '「家族」的读音是？',
            options: ['かぞく', 'かそく', 'がぞく', 'がそく'],
            correctAnswer: 'かぞく',
            explanation: '家族读作かぞく（kazoku），意思是"家人、家族"。注意第二个假名是浊音ぞ（zo），不是そ（so）。'
          }
        ]
      },
      {
        id: 8,
        title: '基础助词：は/が/を',
        description: '学习基础助词的用法',
        duration: 30,
        completed: false,
        keyPoints: ['は的主题提示功能', 'が的主语强调功能', 'を的宾语标记功能', 'は和が的使用区别'],
        vocabulary: ['topic + は + predicate (は)', 'subject + が + verb (が)', 'object + を + verb (を)'],
        content: `助词是日语语法的灵魂，它们附在名词后面，表示名词在句子中的作用。

【は（读作wa）- 主题提示助词】
は的作用是提示句子的主题，告诉对方"我接下来要说的是关于这个的"。
は可以提示主语，也可以提示其他成分。

句型：〜は〜です
例子：
• わたしは学生です。（我是学生。）
• きょうは月曜日です。（今天是星期一。）
• 日本語は難しいです。（日语很难。）

【が - 主格助词】
が表示句子的主语，强调动作或状态的主体。

句型：〜が〜
例子：
• 雨が降ります。（下雨。）
• 花がきれいです。（花很漂亮。）
• 誰が来ますか。（谁来？）

【を（读作o）- 宾格助词】
を放在宾语后面，表示动作的直接对象。
注意：を在这里读作o，不是wo。

句型：〜を〜动词
例子：
• ご飯を食べます。（吃饭。）
• テレビを見ます。（看电视。）
• 本を読みます。（读书。）

【は和が的区别】
这是日语初学者的一大难点，简单记住：
1. は：主题，已知的信息，强调后面的内容
2. が：主语，新的信息，强调前面的主体

对比：
• わたしは学生です。（我呢，是学生。- 回答"你是做什么的"）
• わたしが学生です。（我才是学生。- 回答"谁是学生"）`,
        lessonWords: [
          { word: 'は', pronunciation: 'wa', translation: '（主题助词）', example: 'わたしは学生です。' },
          { word: 'が', pronunciation: 'ga', translation: '（主格助词）', example: '花がきれいです。' },
          { word: 'を', pronunciation: 'o', translation: '（宾格助词）', example: 'ご飯を食べます。' },
          { word: '学生', pronunciation: 'gakusei', translation: '学生', example: '私は学生です。' },
          { word: '食べる', pronunciation: 'taberu', translation: '吃', example: 'パンを食べます。' },
          { word: '見る', pronunciation: 'miru', translation: '看', example: 'テレビを見ます。' },
          { word: '読む', pronunciation: 'yomu', translation: '读', example: '本を読みます。' },
          { word: '雨', pronunciation: 'ame', translation: '雨', example: '雨が降ります。' }
        ],
        lessonGrammar: [
          {
            title: '日语的基本语序：SOV',
            explanation: '日语的基本语序是"主语-宾语-动词"（SOV），也就是动词放在句子最后。这和汉语的"主语-动词-宾语"（SVO）不同。助词的作用就是标记各个成分，所以即使语序变化，意思也不会变。',
            examples: ['私はパンを食べます。（我吃面包。）', 'パンを私は食べます。（面包我吃。- 强调面包）', '两句意思基本一样，只是侧重点不同。']
          }
        ],
        lessonDialogue: {
          title: '在食堂',
          transcript: `A：きょうはなにを食べますか。
B：ラーメンを食べます。
A：どこのラーメンですか。
B：あのみせのラーメンです。
A：おいしいですか。
B：とてもおいしいです。`,
          translation: `A：今天吃什么？
B：吃拉面。
A：哪里的拉面？
B：那家店的拉面。
A：好吃吗？
B：非常好吃。`
        },
        exercises: [
          {
            question: '「を」作为助词时读作什么？',
            options: ['wo', 'o', 'wa', 'ga'],
            correctAnswer: 'o',
            explanation: 'を作为宾格助词时读作o，而不是wo。同样的，は作为主题助词时读作wa而不是ha。'
          },
          {
            question: '以下哪个句子是正确的？',
            options: ['私は学生をです。', '私が学生はです。', '私は学生です。', '私を学生です。'],
            correctAnswer: '私は学生です。',
            explanation: '正确的句型是「〜は〜です」，意思是"…是…"。は提示主题，です表示判断"是"。'
          },
          {
            question: '「ご飯を食べます」中，「を」的作用是？',
            options: ['提示主题', '表示主语', '表示宾语', '表示方向'],
            correctAnswer: '表示宾语',
            explanation: 'を是宾格助词，放在宾语后面，表示动作的直接对象。ご飯（饭）是食べます（吃）这个动作的对象。'
          }
        ]
      },
      {
        id: 9,
        title: '基础助词：に/で/へ',
        description: '继续学习其他基础助词',
        duration: 25,
        completed: false,
        keyPoints: ['に的存在地点和方向', 'で的活动场所', 'へ的方向提示', 'に/で/へ的对比使用'],
        vocabulary: ['に: 存在的地点, 方向目的地', 'で: 活动的场所, 工具手段', 'へ: 去的方向, 收到的影响'],
        content: `继续学习表示地点和方向的助词：に、で、へ。

【に - 存在的地点/时间点/目的地】
に的用法很多，最基础的有：
1. 存在的地点：在…（表示事物存在的位置）
2. 时间点：在…（表示具体的时间点）
3. 目的地：去/来…（表示动作的目的地）

存在句型：〜に〜があります/います
（在…有…）
例子：
• 部屋に机があります。（房间里有桌子。）
• 公園に人がいます。（公园里有人。）
• 学校に行きます。（去学校。）
• 九時に行きます。（九点去。）

【で - 活动场所/工具手段】
で的主要用法：
1. 活动场所：在…（表示动作发生的场所）
2. 工具手段：用…（表示做某事用的工具或方式）
3. 范围：在…之内（表示时间或空间范围）

例子：
• 学校で勉強します。（在学校学习。）
• レストランでご飯を食べます。（在餐厅吃饭。）
• 日本語で話します。（用日语说话。）
• バスで行きます。（坐公交去。）

【へ - 方向】
へ（读作e）表示移动的方向，"向…方向"。
へ和に在表示目的地时意思很接近，へ更侧重"方向"，に更侧重"到达点"。

例子：
• 学校へ行きます。（去学校。）
• 家へ帰ります。（回家。）
• 東京へ来ました。（来东京了。）

【に和で的区别（地点）】
• に：存在的地点（静态）- 桌子在房间里
• で：动作发生的场所（动态）- 在房间里学习

对比：
• 部屋に机があります。（房间里有桌子。- 静态存在）
• 部屋で勉強します。（在房间里学习。- 动态动作）`,
        lessonWords: [
          { word: 'に', pronunciation: 'ni', translation: '在/到（地点时间）', example: '学校に行きます。' },
          { word: 'で', pronunciation: 'de', translation: '在/用（场所工具）', example: '学校で勉強します。' },
          { word: 'へ', pronunciation: 'e', translation: '向（方向）', example: '学校へ行きます。' },
          { word: '学校', pronunciation: 'gakkou', translation: '学校', example: '学校で勉強します。' },
          { word: '公園', pronunciation: 'kouen', translation: '公园', example: '公園で遊びます。' },
          { word: '家', pronunciation: 'ie/uchi', translation: '家', example: '家に帰ります。' },
          { word: '勉強する', pronunciation: 'benkyou suru', translation: '学习', example: '日本語を勉強します。' },
          { word: 'あります', pronunciation: 'arimasu', translation: '有（物）', example: '本があります。' }
        ],
        lessonGrammar: [
          {
            title: 'あります和います的区别',
            explanation: 'あります和います都表示"有"，但使用对象不同：あります用于无生命的东西（物品、植物等），います用于有生命的东西（人、动物等）。',
            examples: ['本があります。（有书。- 无生命）', '犬がいます。（有狗。- 有生命）', '人がいます。（有人。- 有生命）']
          }
        ],
        lessonDialogue: {
          title: '周末去哪',
          transcript: `A：しゅうまつはどこへ行きますか。
B：こうえんへ行きます。
A：こうえんでなにをしますか。
B：ともだちとサッカーをします。
A：いいですね。
B：いっしょにどうですか。`,
          translation: `A：周末去哪？
B：去公园。
A：在公园做什么？
B：和朋友踢足球。
A：真好啊。
B：一起怎么样？`
        },
        exercises: [
          {
            question: '「学校で勉強します」中，「で」表示什么？',
            options: ['存在的地点', '动作发生的场所', '工具手段', '方向'],
            correctAnswer: '动作发生的场所',
            explanation: 'で在这里表示动作发生的场所，"在学校学习"。如果是存在的地点要用に，比如「学校に学生がいます」（学校里有学生）。'
          },
          {
            question: '助词「へ」的读音是？',
            options: ['he', 'e', 'be', 'pe'],
            correctAnswer: 'e',
            explanation: 'へ作为方向助词时读作e，而不是he。这是日语中假名在不同场景下读音变化的又一个例子。'
          },
          {
            question: '以下哪个句子是正确的？',
            options: ['部屋で机があります。', '部屋に机があります。', '部屋を机があります。', '部屋へ机があります。'],
            correctAnswer: '部屋に机があります。',
            explanation: '表示"在某地有某物"（存在）时，地点后面用助词に，而不是で。で用于表示动作发生的场所。'
          }
        ]
      },
      {
        id: 10,
        title: '基础句型结构',
        description: '掌握日语基本句型',
        duration: 35,
        completed: false,
        keyPoints: ['主语+は+宾语+を+动词', '名词谓语句', '形容词谓语句', '动词分类基础'],
        vocabulary: ['私は日本語を勉強します (主宾谓)', '私は学生です (名词谓语句)', '花が美しいです (形容词谓语句)'],
        content: `日语的句子结构和汉语有很大不同，让我们系统学习一下。

【日语句子的基本结构】
日语的基本语序是：主语 → 宾语 → 动词（SOV）
也就是说，动词总是在句子的最后面。

汉语：我 吃 饭。（SVO）
日语：私は ご飯を 食べます。（SOV）

因为有助词标记成分，所以语序相对灵活，但动词始终在最后。

【名词谓语句（判断句）】
句型：〜は〜です
意思：…是…

例子：
• 私は学生です。（我是学生。）
• これは本です。（这是书。）
• 今日は月曜日です。（今天是星期一。）

否定形式：〜は〜ではありません
意思：…不是…

例子：
• 私は学生ではありません。（我不是学生。）
• これは本ではありません。（这不是书。）

【形容词谓语句】
形容词可以直接作谓语，不需要动词。
い形容词：词尾是い的形容词
句型：〜は〜いです

例子：
• 花がきれいです。（花很漂亮。）
• この本は面白いです。（这本书很有趣。）
• 天気がいいです。（天气很好。）

な形容词：词干+な的形容词（修饰名词时加な）
句型：〜は〜なです

例子：
• この町は静かです。（这个城市很安静。）
• 彼は有名です。（他很有名。）

【动词ます形】
ます形是动词的礼貌形式，表示对听话者的尊敬。
动词分类：
1. 一类动词（五段动词）：词尾在う段
2. 二类动词（一段动词）：词尾是る，且る前面是い段或え段
3. 三类动词（カ变/サ变）：する、来る

ます形变换规则（基本）：
• 一类：う段 → い段 + ます（例：飲む→飲みます）
• 二类：る → ます（例：食べる→食べます）
• 三类：する→します、来る→きます`,
        lessonWords: [
          { word: 'です', pronunciation: 'desu', translation: '是（判断助动词）', example: '私は学生です。' },
          { word: 'ます', pronunciation: 'masu', translation: '（动词礼貌体）', example: '食べます。' },
          { word: '学生', pronunciation: 'gakusei', translation: '学生', example: '学生です。' },
          { word: 'きれい', pronunciation: 'kirei', translation: '漂亮的', example: '花がきれいです。' },
          { word: '面白い', pronunciation: 'omoshiroi', translation: '有趣的', example: '本が面白いです。' },
          { word: '静か', pronunciation: 'shizuka', translation: '安静的', example: '図書館は静かです。' },
          { word: '有名', pronunciation: 'yuumei', translation: '有名的', example: '彼は有名です。' },
          { word: '飲む', pronunciation: 'nomu', translation: '喝', example: '水を飲みます。' }
        ],
        lessonGrammar: [
          {
            title: '日语句子的特点',
            explanation: '日语句子有几个显著特点：1. 动词在句末；2. 有助词标记句子成分；3. 主语常常省略（如果从上下文能推断出来）；4. 有发达的敬语系统。',
            examples: ['（私は）日本語を勉強します。- 主语可以省略', '（あなたは）学生ですか。- 主语可以省略', '省略主语让句子更自然。']
          }
        ],
        lessonDialogue: {
          title: '兴趣爱好',
          transcript: `A：しゅみはなんですか。
B：おんがくをきくことです。
A：どんなおんがくがすきですか。
B：ジャズがすきです。
A：わたしもジャズがすきです。
B：いいですね！`,
          translation: `A：你的爱好是什么？
B：听音乐。
A：喜欢什么音乐？
B：喜欢爵士乐。
A：我也喜欢爵士乐。
B：真好啊！`
        },
        exercises: [
          {
            question: '日语的基本语序是？',
            options: ['主语-动词-宾语（SVO）', '主语-宾语-动词（SOV）', '动词-主语-宾语（VSO）', '宾语-动词-主语（OVS）'],
            correctAnswer: '主语-宾语-动词（SOV）',
            explanation: '日语的基本语序是SOV（主语-宾语-动词），动词在句子最后。汉语是SVO（主语-动词-宾语）。这是两种语言最显著的差异之一。'
          },
          {
            question: '「私は学生ではありません」的意思是？',
            options: ['我是学生', '我不是学生', '学生是我', '学生不是我'],
            correctAnswer: '我不是学生',
            explanation: 'ではありません是です的否定形式，表示"不是"。〜は〜です是"…是…"，〜は〜ではありません是"…不是…"。'
          },
          {
            question: '「する」的ます形是？',
            options: ['します', 'すます', 'するます', 'さします'],
            correctAnswer: 'します',
            explanation: 'する是三类动词（サ变活用动词），ます形是します。这是不规则变化，需要单独记忆。来る（くる）也是三类动词，ます形是きます。'
          }
        ]
      },
      {
        id: 11,
        title: '形容词的用法',
        description: '学习い形容词和な形容词',
        duration: 30,
        completed: false,
        keyPoints: ['い形容词的特征', 'な形容词的特征', '形容词的现在时和过去时', '形容词的名词化'],
        vocabulary: ['大きい, 小さい, 新しい (い形容)', '静かな, 好きな, 有名な (な形容)', 'おいしさ, 大きさ (名词化)'],
        content: `日语的形容词分为两类：い形容词和な形容词。它们的用法不同，需要注意区分。

【い形容词（イ形容词）】
特征：词尾是「い」
修饰名词时：直接加名词（不需要加な）
作谓语时：词尾加です

常见的い形容词：
• 大きい（おおきい）- 大的
• 小さい（ちいさい）- 小的
• 新しい（あたらしい）- 新的
• 古い（ふるい）- 旧的
• 高い（たかい）- 高的/贵的
• 安い（やすい）- 便宜的
• おいしい - 好吃的
• 面白い（おもしろい）- 有趣的
• きれい - 漂亮的（特殊！虽然以い结尾，但是な形容词）

例子：
• 大きい犬（おおきいいぬ）- 大狗
• この本は面白いです。（这本书很有趣。）

【な形容词（ナ形容词）】
特征：词尾不是い（或者看起来是い但实际不是，如きれい）
修饰名词时：词干+な+名词
作谓语时：词干+です

常见的な形容词：
• 静か（しずか）- 安静的
• 好き（すき）- 喜欢的
• 嫌い（きらい）- 讨厌的
• 有名（ゆうめい）- 有名的
• 元気（げんき）- 健康的/有精神的
• 便利（べんり）- 方便的
• きれい - 漂亮的/干净的

例子：
• 静かな図書館（しずかなとしょかん）- 安静的图书馆
• この町は静かです。（这个城市很安静。）

【形容词的过去式】
い形容词：い → かったです
• 面白い → 面白かったです
• おいしい → おいしかったです

な形容词：〜でした
• 静か → 静かでした
• 有名 → 有名でした

【形容词的否定形】
い形容词：い → くないです
• 面白い → 面白くないです

な形容词：〜ではありません
• 静か → 静かではありません`,
        lessonWords: [
          { word: '大きい', pronunciation: 'ookii', translation: '大的', example: '大きい犬です。' },
          { word: '小さい', pronunciation: 'chiisai', translation: '小的', example: '小さい猫です。' },
          { word: '新しい', pronunciation: 'atarashii', translation: '新的', example: '新しい本です。' },
          { word: 'おいしい', pronunciation: 'oishii', translation: '好吃的', example: 'このりんごはおいしいです。' },
          { word: '静か', pronunciation: 'shizuka', translation: '安静的', example: '静かな部屋です。' },
          { word: '好き', pronunciation: 'suki', translation: '喜欢的', example: '音楽が好きです。' },
          { word: '有名', pronunciation: 'yuumei', translation: '有名的', example: '有名な人です。' },
          { word: '元気', pronunciation: 'genki', translation: '健康的', example: 'お元気ですか。' }
        ],
        lessonGrammar: [
          {
            title: 'い形容词和な形容词的区分方法',
            explanation: 'い形容词和な形容词的主要区别是修饰名词的方式不同。い形容词直接加名词，な形容词需要加な。大部分以い结尾的是い形容词，但也有例外，如きれい、嫌い是な形容词。',
            examples: ['い形容词：大きい車（直接加名词）', 'な形容词：静かな車（加な再加名词）', '记住特殊的：きれい、嫌い、元気是な形容词']
          }
        ],
        lessonDialogue: {
          title: '聊食物',
          transcript: `A：日本食はどうですか。
B：とてもおいしいです。
A：どんなものが好きですか。
B：おすしが好きです。
A：わたしも好きです。
B：今度いっしょに食べましょう。`,
          translation: `A：日本料理怎么样？
B：非常好吃。
A：喜欢什么？
B：喜欢寿司。
A：我也喜欢。
B：下次一起吃吧。`
        },
        exercises: [
          {
            question: '以下哪个是な形容词？',
            options: ['大きい', '小さい', '静か', '面白い'],
            correctAnswer: '静か',
            explanation: '静か（しずか）是な形容词，修饰名词时要加な，如「静かな部屋」。大きい、小さい、面白い都是い形容词，直接加名词。'
          },
          {
            question: '「おいしい」的过去式是？',
            options: ['おいしいでした', 'おいしかったです', 'おいしくないです', 'おいしくありません'],
            correctAnswer: 'おいしかったです',
            explanation: 'い形容词的过去式是把词尾的い变成かった，再加です。おいしい→おいしかったです（过去好吃）。'
          },
          {
            question: '「きれいな花」中为什么加な？',
            options: ['因为きれい是い形容词', '因为きれい是な形容词', '因为花是な形容词', '随便加的'],
            correctAnswer: '因为きれい是な形容词',
            explanation: 'きれい虽然以い结尾，但它是な形容词（汉字是「綺麗」，い不是词尾），所以修饰名词时要加な。这是一个重要的例外，需要特别记住。'
          }
        ]
      },
      {
        id: 12,
        title: '日常对话练习',
        description: '综合运用进行日常对话',
        duration: 40,
        completed: false,
        keyPoints: ['自我介绍的表达', '购物的基本对话', '问路的基本表达', '感谢和道歉的表达'],
        vocabulary: ['はじめまして, どうぞよろしく (自我介绍)', 'これはいくらですか (购物)', '〜はどこですか (问路)'],
        content: `祝贺你学完了日语入门的基础知识！现在让我们通过实际场景来综合运用所学的内容。

【场景一：自我介绍】
基本表达：
• はじめまして。（初次见面。）
• わたしは〜です。（我是…）
• どうぞよろしくお願いします。（请多关照。）
• こちらこそ。（彼此彼此。）
• お国はどこですか。（您是哪国人？）
• 中国から来ました。（我从中国来。）

【场景二：购物】
基本表达：
• これはいくらですか。（这个多少钱？）
• 〜円です。（…日元。）
• これをください。（请给我这个。）
• あれは何ですか。（那是什么？）
• もっと安いのはありますか。（有更便宜的吗？）
• かしこまりました。（明白了。）

【场景三：问路】
基本表达：
• すみません。（不好意思/劳驾。）
• 〜はどこですか。（…在哪里？）
• 駅はどこですか。（车站在哪里？）
• まっすぐ行ってください。（请直走。）
• 右に曲がります。（向右拐。）
• 左に曲がります。（向左拐。）
• 歩いて何分ですか。（走路要几分钟？）

【场景四：在餐厅】
基本表达：
• メニューをください。（请给我菜单。）
• おすすめは何ですか。（推荐菜是什么？）
• 〜をお願いします。（请给我…）
• お会計お願いします。（请结账。）
• ごちそうさまでした。（多谢款待。）

【学习建议】
1. 多听多模仿，注意语音语调
2. 每天开口说，不要怕犯错
3. 结合实际场景学习，印象更深
4. 继续学习助词和句型，打好基础
5. 保持学习热情，加油！`,
        lessonWords: [
          { word: 'はじめまして', pronunciation: 'hajimemashite', translation: '初次见面', example: 'はじめまして、よろしく。' },
          { word: 'どうぞ', pronunciation: 'douzo', translation: '请', example: 'どうぞよろしく。' },
          { word: 'お願いします', pronunciation: 'onegaishimasu', translation: '拜托了', example: 'よろしくお願いします。' },
          { word: 'いくら', pronunciation: 'ikura', translation: '多少钱', example: 'これはいくらですか。' },
          { word: 'ください', pronunciation: 'kudasai', translation: '请给我', example: 'コーヒーをください。' },
          { word: 'どこ', pronunciation: 'doko', translation: '哪里', example: '駅はどこですか。' },
          { word: 'まっすぐ', pronunciation: 'massugu', translation: '直地', example: 'まっすぐ行きます。' },
          { word: 'おすすめ', pronunciation: 'osusume', translation: '推荐', example: 'おすすめは何ですか。' }
        ],
        lessonGrammar: [
          {
            title: 'てください的用法',
            explanation: '「动词て形 + ください」表示"请…"，是比较礼貌的请求表达方式。て形是动词的重要变化形式，后续课程会详细学习。',
            examples: ['待ってください。（请等一下。）', '見てください。（请看。）', '読んでください。（请读。）']
          }
        ],
        lessonDialogue: {
          title: '综合场景：问路后去餐厅',
          transcript: `A：すみません、レストランはどこですか。
B：あそこです。まっすぐ行って右です。
A：ありがとうございます。
（レストランで）
C：いらっしゃいませ。
A：すみません、メニューをください。
C：はい、かしこまりました。
A：おすすめは何ですか。
C：ラーメンがおすすめです。
A：じゃあ、ラーメンをお願いします。
C：かしこまりました。`,
          translation: `A：不好意思，餐厅在哪里？
B：在那里。直走然后右边就是。
A：谢谢。
（在餐厅）
C：欢迎光临。
A：不好意思，请给我菜单。
C：好的，明白了。
A：推荐的是什么？
C：推荐拉面。
A：那请来份拉面。
C：好的。`
        },
        exercises: [
          {
            question: '问价钱时应该说什么？',
            options: ['これは何ですか。', 'これはいくらですか。', 'これはどこですか。', 'これは誰ですか。'],
            correctAnswer: 'これはいくらですか。',
            explanation: '「いくら」是询问价格的疑问词，"これはいくらですか"意思是"这个多少钱？"。何是什么，どこ是哪里，誰是谁。'
          },
          {
            question: '「どうぞよろしくお願いします」的意思是？',
            options: ['谢谢', '对不起', '请多关照', '再见'],
            correctAnswer: '请多关照',
            explanation: '「どうぞよろしくお願いします」是日语中非常重要的寒暄语，意思是"请多关照"，用于初次见面或者请求对方关照时。'
          },
          {
            question: '在餐厅想要结账时说什么？',
            options: ['メニューをください', 'おすすめは何ですか', 'お会計お願いします', 'いらっしゃいませ'],
            correctAnswer: 'お会計お願いします',
            explanation: '「お会計お願いします」是"请结账"的意思。メニューをください是"请给我菜单"，おすすめは何ですか是"推荐菜是什么"，いらっしゃいませ是"欢迎光临"。'
          }
        ]
      }
    ],
  },
  {
    id: 5,
    title: '日语中级进阶',
    language: 'ja',
    level: 'intermediate',
    description: '日语会话与语法',
    totalChapters: 12,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
    overview: '本课程在初级基础上深化学习，重点掌握动词て形、可能态、比较句、条件表达等中级语法。通过实际场景对话练习，提升学员的日语实际运用能力。',
    learningObjectives: [
      '掌握动词て形和た形的变形规则',
      '学会使用可能态表达',
      '掌握各种比较句型',
      '能够进行餐厅点餐、购物等日常会话',
      '提升日语听力和口语能力'
    ],
    courseFeatures: [
      '动词变形系统训练',
      '场景会话实战',
      '中级语法图表化'
    ],
    suitableFor: [
      '已完成日语初级课程的学习者',
      '具备基础日语能力的学习者',
      '需要提升日语会话能力的学习者',
      '准备参加JLPT N3考试的学习者'
    ],
    chapters: [
      { id: 1, title: '动词て形变形规则', description: '学习动词て形的变形方法', duration: 35, completed: false, keyPoints: ['一类动词て形变形', '二类动词て形变形', '三类动词て形变形', '动词分类的判断方法'], vocabulary: ['去买う→買って, 読む→読んで', '食べる→食べて, 見る→見て', 'する→して, 来る→来て'], exercises: ['动词て形变形练习', '动词分类练习', 'て形接续练习'] },
      { id: 2, title: 'て形的各种用法', description: '掌握て形的多种用法', duration: 40, completed: false, keyPoints: ['て形表示动作的先后', 'て形表示伴随状态', 'て形表示原因理由', 'て形连接多个动作'], vocabulary: ['〜てから (之后)', '〜ている (正在进行)', '〜てください (请求)'], exercises: ['て形用法辨别', 'て形句子改写', 'て形综合练习'] },
      { id: 3, title: '动词た形与过去表达', description: '学习动词过去式的表达', duration: 30, completed: false, keyPoints: ['た形与て形的关系', 'た形表示过去', 'た形表示完了', 'た形和て形的对比'], vocabulary: ['食べた, 読んだ, 行った (过去)', '食べたことがある (经验)', '〜たばかり (刚刚)'], exercises: ['た形变形练习', '过去表达造句', 'た形和て形选择练习'] },
      { id: 4, title: '可能态表达', description: '学习可能动词的用法', duration: 35, completed: false, keyPoints: ['动词可能态的变形', '可能动词的含义', 'ことができる的用法', '可能态的句子结构'], vocabulary: ['読める, 食べられる (可能态)', 'ことができます (能力)', '〜ようになる (能力变化)'], exercises: ['可能态变形练习', '可能态句子改写', '能力表达综合练习'] },
      { id: 5, title: '比较句型', description: '掌握比较的各种表达方式', duration: 25, completed: false, keyPoints: ['AはBより〜 (A比B...)', 'AよりBの方が〜 (与A相比B更...)', 'AとBとではどちら〜 (A和B哪个...)', '一番/最上 (最高级)'], vocabulary: ['より, 方が (比较)', '一番, 最も (最高级)', '比起来, 相比较而言 (比较表达)'], exercises: ['比较句型练习', '比较句转换', '综合比较练习'] },
      { id: 6, title: '想要表达愿望', description: '学习表达愿望的句型', duration: 30, completed: false, keyPoints: ['〜たい (第一人称想...)', '〜ほしい (想要...)', '〜たがる (第三人称想...)', 'たい和ほしい的区别'], vocabulary: ['食べたい, 行きたい (たい形)', 'ほしい, わかってほしい (ほしい形)', 'たがっている (第三人称)'], exercises: ['愿望表达练习', 'たい形变形', '愿望句型转换'] },
      { id: 7, title: '成为/变化表达', description: '学习变化和成为的表达', duration: 35, completed: false, keyPoints: ['〜になる (自然变化)', '〜にする (决定变化)', '〜ようになる (能力变化)', '〜ようにする (努力做到)'], vocabulary: ['大人になる, 先生になる (になる)', '気持ち好不好にする (にする)', '日本語が話せるようになる (ようになる)'], exercises: ['变化表达练习', 'になる和にする选择', '变化句型综合练习'] },
      { id: 8, title: '接续助词详解', description: '深入学习接续助词的用法', duration: 40, completed: false, keyPoints: ['から (原因理由)', 'ので (原因理由)', 'けれど/でも (转折)', 'のに (逆接)'], vocabulary: [' потому что (から)', 'ため, によって (原因)', '可是, しかし (转折)'], exercises: ['接续助词练习', 'から和ので选择', '原因转折句型练习'] },
      { id: 9, title: '原因理由表达', description: '学习表达原因和理由的句型', duration: 35, completed: false, keyPoints: ['から表示主观理由', 'ので表示客观因果', 'ために表示原因', 'し表示并列原因'], vocabulary: ['忙しいから逃げます (から)', '雨が降ったので (ので)', 'のために (为了)'], exercises: ['原因理由表达练习', 'から和ので区别练习', '综合原因表达'] },
      { id: 10, title: '条件表达（と/ば/たら/なら）', description: '掌握各种条件表达方式', duration: 45, completed: false, keyPoints: ['と的自然条件', 'ば的假设条件', 'たら的具体条件', 'なら的前提条件'], vocabulary: ['春になると (一到...就)', '時間があれば (如果有...)', '乗換えたら (如果...的话)'], exercises: ['と/ば/たら/なら选择练习', '条件句改写', '条件表达综合练习'] },
      { id: 11, title: '餐厅购物场景对话', description: '学习餐厅和购物场景会话', duration: 40, completed: false, keyPoints: ['餐厅点餐用语', '购物议价表达', '买单结账用语', '售后服务表达'], vocabulary: ['メニュー, 注文, お会計 (餐厅)', 'いくら, 打折, 安い (购物)', 'おすすめ, 定食, コース (菜品)'], exercises: ['餐厅对话模拟', '购物对话练习', '场景角色扮演'] },
      { id: 12, title: '旅行场景对话', description: '掌握旅行相关的日语会话', duration: 50, completed: false, keyPoints: ['机场车站用语', '酒店入住表达', '观光询问用语', '紧急情况表达'], vocabulary: ['切符, 予約, 改札口 (交通)', 'チェックイン, 部屋, 朝食 (酒店)', '観光, 写真, 道 (观光)'], exercises: ['旅行对话模拟', '机场酒店场景练习', '问路指路练习'] },
    ],
  },
  {
    id: 6,
    title: '日语高级精通',
    language: 'ja',
    level: 'advanced',
    description: '日语商务与文化',
    totalChapters: 12,
    image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400&h=300&fit=crop',
    overview: '本课程深入学习被动句、使役句、敬语系统等高级语法，同时涵盖商务日语、学术日语等专业领域，帮助学员达到商务日语水平。',
    learningObjectives: [
      '掌握被动句和使役句的结构',
      '精通日语敬语系统（尊敬语/谦让语）',
      '能够进行正式的商务会话',
      '掌握学术日语的表达方式',
      '具备日汉互译的基础能力'
    ],
    courseFeatures: [
      '高级语法深度解析',
      '商务日语实战训练',
      '敬语系统全面掌握'
    ],
    suitableFor: [
      '具备中级日语水平的学习者',
      '需要在日本企业工作的学习者',
      '准备参加JLPT N1/N2考试的学习者',
      '对日本商务文化感兴趣的学习者'
    ],
    chapters: [
      { id: 1, title: '被动句详解', description: '深入学习日语被动句', duration: 40, completed: false, keyPoints: ['直接被动句的结构', '间接被动句的结构', '被动句中的施事表达', '被动的情感表达用法'], vocabulary: ['花が摘まれた (花被摘了)', '私は友達に笑われた (被朋友笑)', '〜によって (被...)'], exercises: ['被动句变形练习', '主动转被动练习', '被动句综合应用'] },
      { id: 2, title: '使役句用法', description: '掌握使役动词的用法', duration: 45, completed: false, keyPoints: ['使役态的变形规则', '使役句的结构', '使役句中的人和事', '使役和被动的区别'], vocabulary: ['先生 学生 本を読ませる (使役)', '母 私 野菜を食べさせる (让...)', '〜に〜させる (让...做...)'], exercises: ['使役态变形练习', '使役句造句练习', '使役和使役被动的转换'] },
      { id: 3, title: '被动使役句', description: '学习被动使役句的结构', duration: 50, completed: false, keyPoints: ['被动使役句的变形', '被动使役句的结构', '间接被动使役句', '被动使役句的使用场景'], vocabulary: ['先生 に 本 を 読ませられた (被迫读)', '親に強制された (被强制)', '〜させられてしまった (不得不)'], exercises: ['被动使役变形练习', '被动使役句改写', '综合练习'] },
      { id: 4, title: '敬语基础：尊敬语', description: '学习尊敬语的表达方式', duration: 45, completed: false, keyPoints: ['尊敬语动词的形式', 'お/ご+动词连用形', '尊敬语的特殊形式', '尊敬语的使用场合'], vocabulary: ['おっしゃる, 見える, なさる (尊敬动词)', 'お〜になる, ご〜になる (尊敬句型)', '社長, お客様, 先生 (尊敬对象)'], exercises: ['尊敬语变形练习', '普通句转尊敬语', '尊敬语使用场合辨别'] },
      { id: 5, title: '敬语进阶：谦让语', description: '掌握谦让语的用法', duration: 50, completed: false, keyPoints: ['谦让语动词的形式', 'お/ご+动词连用形+する', '谦让语的特殊形式', '谦让语与尊敬语的对用'], vocabulary: ['申す, いただく, 参る (谦让动词)', 'お〜する, ご〜する (谦让句型)', '弊Customer, 社内 (谦让对象)'], exercises: ['谦让语变形练习', '谦让语造句', '谦让语和尊敬语转换'] },
      { id: 6, title: '敬语综合：郑重语', description: '学习郑重语的使用', duration: 45, completed: false, keyPoints: ['郑重语的定义', 'です/ます体的使用', '美化语的用法', '敬语综合运用'], vocabulary: ['です, ます, ございます (郑重语)', 'お食事, おابس (美化语)', 'いただル, お可观ル (郑重表达)'], exercises: ['敬语综合练习', '敬语改错练习', '商务敬语文书写作'] },
      { id: 7, title: '复合动词', description: '掌握复合动词的构成和用法', duration: 55, completed: false, keyPoints: ['复合动词的构成方式', '动作复合动词', '状态复合动词', '常见复合动词的意思'], vocabulary: ['飛び出す, 食べ過ぎる, 見に行く (复合)', '〜始める, 〜終わる (动作)', '〜続ける, 〜抜く (状态)'], exercises: ['复合动词语意识别', '复合动词填空', '复合动词语运用'] },
      { id: 8, title: '商务日语表达', description: '学习商务场合的日语表达', duration: 60, completed: false, keyPoints: ['商务会议用语', '商务邮件写作', '商务谈判表达', '职场人际用语'], vocabulary: ['稟議, 承認, 契約 (商务)', 'お世話になります, ありがというございます (寒暄)', '折角可惜, Due, 督促 (商务)'], exercises: ['商务邮件写作', '商务对话模拟', '商务场景角色扮演'] },
      { id: 9, title: '日本企业文化', description: '了解日本企业文化和礼仪', duration: 55, completed: false, keyPoints: ['日本企业的组织结构', '日本企业的工作方式', '日本企业的会议文化', '日本企业的终身雇佣制'], vocabulary: ['終身雇用, 年功序列, 恩恵 (制度)', '飲み会, おibold会, 社内Language (文化)', '名刺交换, 挨opicbow (礼仪)'], exercises: ['企业文化分析', '商务礼仪练习', '日本职场文化调研'] },
      { id: 10, title: '正式场合演讲', description: '学习正式演讲的日语表达', duration: 60, completed: false, keyPoints: ['演讲的开头结尾', '正式场合的表达', '演讲的逻辑构建', '演讲中的敬语使用'], vocabulary: [' Award, 结束语 (演讲)', '顶戴, 了承, 供参考 (正式表达)', ' presentation, 概要, 总结 (结构)'], exercises: ['演讲稿写作', '演讲模拟练习', '正式场合表达练习'] },
      { id: 11, title: '学术日语表达', description: '掌握学术日语的写作和表达', duration: 65, completed: false, keyPoints: ['学术论文的结构', '学术日语的特点', '研究方法的表达', '学术发表用语'], vocabulary: ['先行研究, 理 logr, 仮説 (学术)', 'である調, 考察, 結論 (论文)', '発表, 質疑応答, 指点 (发表)'], exercises: ['学术论文结构分析', '学术表达练习', '研究计划书写作'] },
      { id: 12, title: '高级翻译技巧', description: '提升日语翻译能力', duration: 70, completed: false, keyPoints: ['中日语言的差异', '中日互译的技巧', '文化负载词的翻译', '翻译中的意译和直译'], vocabulary: ['信達雅 (翻译标准)', '四字格, 多文化负载词 (汉语特色)', '翻译腔, 异化, 归化 (翻译策略)'], exercises: ['日译汉练习', '汉译日练习', '翻译作品评析'] },
    ],
  },
  {
    id: 7,
    title: '韩语零基础入门',
    language: 'ko',
    level: 'beginner',
    description: '从韩语字母开始学习',
    totalChapters: 12,
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=300&fit=crop',
    overview: '本课程从韩语字母（子音和母音）开始，系统教学辅音、元音、收音等发音规则，循序渐进地帮助零基础学员掌握韩语基础知识。',
    learningObjectives: [
      '熟练掌握韩语40个字母的发音',
      '理解收音的发音规则',
      '学习100+基础韩语词汇',
      '掌握基础助词的使用方法',
      '能够进行简单的日常问候和对话'
    ],
    courseFeatures: [
      '韩语字母趣味记忆',
      '发音规则系统训练',
      '情景式会话入门'
    ],
    suitableFor: [
      '韩语零基础学习者',
      '对韩国文化感兴趣的学习者',
      '准备赴韩旅游或留学的学习者',
      'K-pop和韩国综艺爱好者'
    ],
    chapters: [
      { id: 1, title: '韩语概览与字母结构', description: '了解韩语特点和字母结构', duration: 30, completed: false, keyPoints: ['韩语文字的特点', '子音和母音的分类', '韩语字母的构成', '学习韩语的方法'], vocabulary: ['자음, 모음 (辅音, 元音)', '한글 (韩文)', '받침 (收音)'], exercises: ['字母辨认练习', '字母书写练习', '韩文结构分析'] },
      { id: 2, title: '基本元音学习', description: '学习韩语基本元音', duration: 25, completed: false, keyPoints: ['单元音ㅏ,ㅓ,ㅗ,ㅜ', '单元音ㅐ,ㅔ,ㅣ', '元音的发音口型', '元音组合发音'], vocabulary: ['ㅏ (a), ㅓ (eo), ㅗ (o), ㅜ (u)', 'ㅐ (ae), ㅔ (e), ㅣ (i)', '와,저,고,구 (元音字母)'], exercises: ['元音发音跟读', '元音辨认练习', '元音书写练习'] },
      { id: 3, title: '基本辅音学习（ㄱ〜ㅁ）', description: '学习ㄱ到ㅁ的辅音', duration: 30, completed: false, keyPoints: ['ㄱ, ㄴ, ㄷ, ㄹ的发音', 'ㅁ, ㅂ, ㅅ, ㅇ的发音', '辅音在字中的位置', '辅音和元音的组合'], vocabulary: ['ㄱ(g/k), ㄴ(n), ㄷ(d/t), ㄹ(r/l)', 'ㅁ(m), ㅂ(b/p), ㅅ(s), ㅇ(无声/ng)', '가, 나, 다, 라, 마, 바 (组合)'], exercises: ['辅音发音练习', '辅音辨认练习', '音节拼读练习'] },
      { id: 4, title: '基本辅音学习（ㅂ〜ㅎ）', description: '学习ㅂ到ㅎ的辅音', duration: 25, completed: false, keyPoints: ['ㅈ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ的发音', '紧音的概念和发音', '辅音的发音规则', '送气音的形成'], vocabulary: ['ㅈ(j), ㅊ(ch), ㅋ(k), ㅌ(t), ㅍ(p), ㅎ(h)', 'ㄲ, ㄸ, ㅃ, ㅆ, ㅉ (紧音)', '카, 타, 파, 하 (送气音)'], exercises: ['辅音发音对比练习', '紧音辨认练习', '送气音练习'] },
      { id: 5, title: '收音规则', description: '掌握韩语收音的发音规则', duration: 35, completed: false, keyPoints: ['单收音的发音', '双收音的发音', '收音的书写规则', '收音在单词中的发音'], vocabulary: ['ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ (单收音)', 'ㄳ, ㄵ, ㄶ, ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㅀ, ㅄ (双收音)', '밥, 값, 앉, 읽 (收音例词)'], exercises: ['收音发音练习', '收音辨认练习', '收音词尾发音练习'] },
      { id: 6, title: '基础词汇：日常问候', description: '学习常用问候语', duration: 20, completed: false, keyPoints: ['基本问候语', '告别寒暄语', '感谢和道歉用语', '应答方式'], vocabulary: ['안녕하세요, 안녕히 가세요 (问候)', '감사합니다, 미안합니다 (感谢道歉)', '네, 아니요 (应答)'], exercises: ['问候语配对练习', '场景对话练习', '问候语听力练习'] },
      { id: 7, title: '数字与时间表达', description: '掌握韩语数字和时间表达', duration: 25, completed: false, keyPoints: ['固有数词1-10', '汉字数词的使用', '时间日期表达', '量词的用法'], vocabulary: ['하나, 둘, 셋, 넷, 다섯 (固有数)', '일, 이, 삼, 사, 오 (汉字数)', '한, 두, 세, 네, 다섯 (量词)'], exercises: ['数字听力练习', '数词转换练习', '时间日期表达练习'] },
      { id: 8, title: '基础助词：은/는/이/가', description: '学习基础主题和主格助词', duration: 30, completed: false, keyPoints: ['은/는的主题提示功能', '이/가的主语强调功能', '은/는和이/가的区别', '助词的使用规则'], vocabulary: ['topic + 은/는 (主题)', 'subject + 이/가 (主语)', '김치는 매워요 (은/는)', '有人在 (이/가)'], exercises: ['助词填空练习', '은/는和이/가选择练习', '句子结构分析'] },
      { id: 9, title: '基础助词：을/를/에', description: '学习宾格和地点助词', duration: 25, completed: false, keyPoints: ['을/를的宾语标记', '에的存在地点', '에的方向目的地', '에서的活动场所'], vocabulary: ['object + 을/를 (宾语)', '場所に 있어요 (에存在)', '目的地에 가요 (에方向)', '学校에서 공부해요 (에서)'], exercises: ['助词综合练习', '场所表达练习', '助词辨析练习'] },
      { id: 10, title: '基础句型结构', description: '掌握韩语基本句型', duration: 35, completed: false, keyPoints: ['主语+은/는+宾语+을/를+动词', '名词谓语句', '이다的用法', '아니다的用法'], vocabulary: ['저는 한국어를 배워요 (主宾谓)', '저는 학생이에요 (名词谓语句)', '이것은 책이에요/아니에요 (判断句)'], exercises: ['句型转换练习', '造句练习', '句子成分分析'] },
      { id: 11, title: '形容词与动词基础', description: '学习形容词和动词的基本用法', duration: 30, completed: false, keyPoints: ['动词原形和词干', '形容词的使用', '动词的现在时态', '고 싶다表示想要'], vocabulary: ['하다, 가다, 오다, 먹다 (动词)', '크다, 작다, 좋다, 맛있다 (形容词)', '가고 싶어요, 먹고 싶어요 (想要)'], exercises: ['动词形容词识别练习', '现在时态练习', '고 싶다句型练习'] },
      { id: 12, title: '日常对话练习', description: '综合运用进行日常对话', duration: 40, completed: false, keyPoints: ['自我介绍的表达', '购物的基本对话', '问路的基本表达', '电话用语'], vocabulary: ['저는 ~이에요/예요 (自我介绍)', 'これはいくらですか (购物)', '〜はどこ예요? (问路)'], exercises: ['角色扮演练习', '情景对话测试', '综合口语表达'] },
    ],
  },
  {
    id: 8,
    title: '韩语中级进阶',
    language: 'ko',
    level: 'intermediate',
    description: '韩语日常会话',
    totalChapters: 12,
    image: 'https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?w=400&h=300&fit=crop',
    overview: '本课程在初级基础上深入学习时态、连接词尾、条件表达等中级语法，通过丰富的情景对话练习，帮助学员提升韩语实际交流能力。',
    learningObjectives: [
      '掌握韩语过去时和未来时的表达',
      '学会使用各种连接词尾',
      '掌握条件句的表达方式',
      '能够进行餐厅、购物、旅行等场景会话',
      '提升韩语阅读理解能力'
    ],
    courseFeatures: [
      '时态系统全面掌握',
      '连接词尾分类训练',
      '场景会话实战'
    ],
    suitableFor: [
      '已完成韩语初级课程的学习者',
      '具备基础韩语能力的学习者',
      '需要提升韩语会话能力的学习者',
      '准备参加TOPIK考试的学习者'
    ],
    chapters: [
      { id: 1, title: '过去时态表达', description: '学习韩语过去时的表达', duration: 30, completed: false, keyPoints: [' 았/었/였的用法', '过去时态的构成', '过去时间状语', '过去时态的否定'], vocabulary: ['했어요, 갔어요, 먹었어요 (过去)', '어제,지난주,몇개월전 (过去时间)', '하지 않았어요 (过去否定)'], exercises: ['过去时变形练习', '过去时句子改写', '过去时阅读练习'] },
      { id: 2, title: '未来时态表达', description: '掌握未来时态的表达方式', duration: 25, completed: false, keyPoints: ['겠다的用法', '을/ㄹ 거예요的用法', '未来时间表达', '意图和计划的表现'], vocabulary: ['하겠습니다, 가겠습니다 (将来)', '할 거예요, 갈 거예요 (意志)', '내일, 다음주, 앞으로 (将来时间)'], exercises: ['将来时表达练习', '겠和을 거예요选择', '将来时造句'] },
      { id: 3, title: '进行时态运用', description: '学习进行时的使用方法', duration: 35, completed: false, keyPoints: ['고 있는的用法', '进行时态的构成', '进行时态的使用场景', '进行时与一般时的区别'], vocabulary: ['하고 있어요, 먹고 있어요 (进行)', '지금, 현재, 하고 있는 중 (进行时间)', '읽고 있는 책 (定语形式)'], exercises: ['进行时变形练习', '进行时句型转换', '进行时情景练习'] },
      { id: 4, title: '比较句型', description: '掌握比较的表达方式', duration: 30, completed: false, keyPoints: ['보다更...的表达', '가장/제일最...的表达', '差不多的表达', '对比句型的使用'], vocabulary: ['A보다 B가 더 많아요 (A比B...)', '가장 큰, 제일 좋은 (最高级)', '差不多的, 大同小异的 (相似)'], exercises: ['比较句型练习', '比较句转换', '综合比较练习'] },
      { id: 5, title: '能力表达', description: '学习表达能力的句型', duration: 35, completed: false, keyPoints: ['수 있다/못하다的可能形', '할 수 있다/할 줄 모르다', '能力的表现方式', '可能性和能力的区别'], vocabulary: ['할 수 있어요, 못해요 (能力)', '한국어를 할 줄 알아요 (会...)', '할 수 있는, 불가능한 (定语形式)'], exercises: ['能力表达练习', '可能形变形', '能力句型转换'] },
      { id: 6, title: '想要表达愿望', description: '学习表达愿望的句型', duration: 30, completed: false, keyPoints: ['고 싶다表示想要', '고 싶어하다的第三人称用法', '았/었/였으면 좋겠다的假设愿望', '附加疑问的表达'], vocabulary: ['가고 싶어요, 먹고 싶어요 (想要)', '동생은 놀고 싶어해요 (第三人称)', '갔으면 좋겠다 (希望)'], exercises: ['愿望表达练习', '고 싶다变形', '愿望句型转换'] },
      { id: 7, title: '成为/变化表达', description: '掌握变化和成为的表达', duration: 35, completed: false, keyPoints: ['이/가 되다成为...', '아/어/여지다渐渐变得...', '变化的表现方式', '状态变化的表达'], vocabulary: ['선생님이 됐어요 (成为...)', '날씨가 추워졌어요 (变得...)', '좋아지는,大き어진 (变化)'], exercises: ['变化表达练习', '되다和어지다选择', '变化句型综合练习'] },
      { id: 8, title: '连接词尾详解', description: '深入学习连接词尾的用法', duration: 40, completed: false, keyPoints: ['고的并列用法', '아/어/여서的原因', '지만的转折', '으면/면的条件'], vocabulary: ['먹고 마시고 (并列)', '바빠서 못 갔어요 (原因)', '시험을 봤지만 못했어요 (转折)', '하면, 않으면 (条件)'], exercises: ['连接词尾练习', '고和어서选择', '连接词尾综合练习'] },
      { id: 9, title: '原因理由表达', description: '学习表达原因和理由的句型', duration: 35, completed: false, keyPoints: ['아/어/여서表示原因', '니까/니까表示理由', '때문에的名词原因', '挂钩서的名词原因'], vocabulary: ['바빠서, 좋아서,悲引いて (原因)', '시험이니까 (理由强调)', ' 때문에,玩意儿 (名词原因)'], exercises: ['原因理由表达练习', 'から和ので区别', '综合原因表达'] },
      { id: 10, title: '条件表达', description: '掌握条件句的表达方式', duration: 45, completed: false, keyPoints: ['면/으면的假设条件', '라면的假设条件', '면/으면的实际条件', '면/으면的非现实条件'], vocabulary: ['시간이 있으면, 가면 (假设)', '온다면, 한다면 (名词+的话)', '되면, 되면 (实际条件)'], exercises: ['条件句练习', '면/으면选择', '条件表达综合'] },
      { id: 11, title: '餐厅购物场景对话', description: '学习餐厅和购物场景会话', duration: 40, completed: false, keyPoints: ['点餐用语', '购物还价表达', '买单结账用语', '退货换货表达'], vocabulary: ['메뉴, 주문, 계산 (餐厅)', '얼마, 깎아주세요, 할인 (购物)', '포장, 배달, 예약 (服务)'], exercises: ['餐厅对话模拟', '购物对话练习', '场景角色扮演'] },
      { id: 12, title: '旅行场景对话', description: '掌握旅行相关的韩语会话', duration: 50, completed: false, keyPoints: ['机场车站用语', '酒店入住表达', '观光询问用语', '交通出行表达'], vocabulary: ['공항, 기차역, 플랫폼 (交通)', '체크인, 룸서비스, 카운터 (酒店)', ' السياحية,metro, 길 (观光)'], exercises: ['旅行对话模拟', '机场酒店场景', '问路指路练习'] },
    ],
  },
  {
    id: 9,
    title: '韩语高级精通',
    language: 'ko',
    level: 'advanced',
    description: '韩语高级表达',
    totalChapters: 12,
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&h=300&fit=crop',
    overview: '本课程深入学习被动句、使役句、高级敬语等高级语法，同时涵盖商务韩语、正式场合表达等专业知识，帮助学员达到高级韩语水平。',
    learningObjectives: [
      '掌握被动句和使役句的用法',
      '精通韩语高级敬语系统',
      '能够进行正式的商务会话',
      '掌握学术韩语的表达方式',
      '具备韩汉互译的基础能力'
    ],
    courseFeatures: [
      '高级语法深度解析',
      '商务韩语实战',
      '高级敬语全面掌握'
    ],
    suitableFor: [
      '具备中级韩语水平的学习者',
      '需要在韩国企业工作的学习者',
      '准备参加TOPIK考试的学习者',
      '对韩国商务文化感兴趣的学习者'
    ],
    chapters: [
      { id: 1, title: '被动句详解', description: '深入学习韩语被动句', duration: 40, completed: false, keyPoints: ['直接被动句的结构', '间接被动句的结构', '被动句中施事表达', '被动句的特殊用法'], vocabulary: ['摘まれました (花被摘)', '笑われた, 让oked (被...)', '에ness, 주니 (施事)'], exercises: ['被动句变形练习', '主动转被动练习', '被动句综合应用'] },
      { id: 2, title: '使役句用法', description: '掌握使役动词的用法', duration: 45, completed: false, keyPoints: ['使役态的变形规则', '使役句的结构', '使役句中的人和事', '使役和被动的区别'], vocabulary: ['시키다, 맛난다, 아프다 (使役)', '게하다, 록�다 (使役形式)', '〜에게/한테 〜하게하다 (让...)'], exercises: ['使役态变形练习', '使役句造句练习', '使役和使役被动的转换'] },
      { id: 3, title: '被动使役句', description: '学习被动使役句的结构', duration: 50, completed: false, keyPoints: ['被动使役句的变形', '被动使役句的结构', '间接被动使役句', '被动使役句的使用场景'], vocabulary: ['vdade (被迫...)', '당황, 사정 (被动使役)', '〜당하다, 〜되다 (被动形式)'], exercises: ['被动使役变形练习', '被动使役句改写', '综合练习'] },
      { id: 4, title: '高级敬语详解', description: '深入理解韩语敬语系统', duration: 55, completed: false, keyPoints: ['尊敬阶的完整系统', '谦逊阶的用法', '准敬语的表现', '敬语的自发尊敬'], vocabulary: ['社长님,部长님,先生습니다 (尊敬)', '参谋,好东西, forall (谦逊)', '오shed (准敬语)'], exercises: ['敬语变形练习', '普通句转敬语', '敬语使用场合辨别'] },
      { id: 5, title: '正式场合用语', description: '学习正式场合的表达方式', duration: 50, completed: false, keyPoints: ['正式文书用语', '正式场合开场结尾', '演讲敬语表达', '正式邀请和拒绝'], vocabulary: ['존경하는, 추천..., 허락... (正式)', '감사의 말씀,شرف...,多谢 (礼仪)', '초대합니다,_orientation (正式)'], exercises: ['正式文书写作', '正式场合对话', '演讲稿练习'] },
      { id: 6, title: '复合表达', description: '掌握复合语法结构', duration: 55, completed: false, keyPoints: ['기../../..的强调', '다는/다는데的说明', '라면/이라면的假设强调', '는다고 해도的让步'], vocabulary: ['하기는 하지만, 한다는게 (强调转折)', '이라면, peradventure (假设强调)', '어떻다고 해도 (让步)'], exercises: ['复合表达练习', '复杂句型转换', '综合语法练习'] },
      { id: 7, title: '商务韩语表达', description: '学习商务场合的韩语表达', duration: 60, completed: false, keyPoints: ['商务会议用语', '商务邮件写作', '商务谈判表达', '职场人际用语'], vocabulary: ['회의, 안건, .议录 (会议)', '덕분에, 감사いつきます, 항상 (商务)', 'opropos,纯属提醒, 了解 (商务)'], exercises: ['商务邮件写作', '商务对话模拟', '商务场景角色扮演'] },
      { id: 8, title: '韩国企业文化', description: '了解韩国企业文化和礼仪', duration: 55, completed: false, keyPoints: ['韩国企业的组织结构', '韩国的企业精神', '韩国企业的会议文化', '韩国的职场礼仪'], vocabulary: ['회장,社长,局长 (组织)', '勤奋, 努力, 以及(belief)', '흐름, 내부 사규 (文化)'], exercises: ['企业文化分析', '商务礼仪练习', '韩国职场文化调研'] },
      { id: 9, title: '正式场合演讲', description: '学习正式演讲的韩语表达', duration: 60, completed: false, keyPoints: ['演讲的开头结尾', '正式场合的表达', '演讲的逻辑构建', '演讲中的敬语使用'], vocabulary: ['존경하는各位,开幕,结束语 (演讲)', '赐教, 承蒙, 光临 (礼仪)', '提出, 呼吁, 要求 (演讲)'], exercises: ['演讲稿写作', '演讲模拟练习', '正式场合表达练习'] },
      { id: 10, title: '学术韩语表达', description: '掌握学术韩语的写作和表达', duration: 65, completed: false, keyPoints: ['学术论文的结构', '学术韩语的特点', '研究方法的表达', '学术发表用语'], vocabulary: ['연구, 분석, 결과 (学术)', '발생, 확인, 조사 (研究方法)', '발표, 질문, 응답 (发表)'], exercises: ['学术论文结构分析', '学术表达练习', '研究计划书写作'] },
      { id: 11, title: '韩国文化礼仪', description: '深入了解韩国文化和礼仪', duration: 55, completed: false, keyPoints: ['韩国餐桌礼仪', '韩国社交礼仪', '韩国节日文化', '韩国的宗教信仰'], vocabulary: ['존경,孝顺, 以及 (传统)', 'wed,葬式, 法要 (礼仪)', '新年, 秋夕, 端午 (节日)'], exercises: ['文化礼仪分析', '韩国文化调研', '礼仪实践练习'] },
      { id: 12, title: '高级翻译技巧', description: '提升韩语翻译能力', duration: 70, completed: false, keyPoints: ['韩中语言的差异', '韩中互译的技巧', '文化负载词的翻译', '翻译中的意译和直译'], vocabulary: ['信、达、雅 (翻译标准)', '四字格, 韩字文化负载词 (特色)', '翻译腔, 异化, 归化 (策略)'], exercises: ['韩译中练习', '中译韩练习', '翻译作品评析'] },
    ],
  },
];

const mockVocabulary: Record<string, any[]> = {
  en_beginner: [
    { id: 1, word: 'apple', translation: '苹果', pronunciation: '/ˈæpl/', example: 'I eat an apple every day.' },
    { id: 2, word: 'book', translation: '书', pronunciation: '/bʊk/', example: 'This is a good book.' },
    { id: 3, word: 'cat', translation: '猫', pronunciation: '/kæt/', example: 'The cat is sleeping on the sofa.' },
    { id: 4, word: 'dog', translation: '狗', pronunciation: '/dɔːɡ/', example: 'I have a dog named Max.' },
    { id: 5, word: 'egg', translation: '鸡蛋', pronunciation: '/eɡ/', example: 'I had two eggs for breakfast.' },
    { id: 6, word: 'friend', translation: '朋友', pronunciation: '/frend/', example: 'She is my best friend.' },
    { id: 7, word: 'good', translation: '好的', pronunciation: '/ɡʊd/', example: 'Good morning, everyone!' },
    { id: 8, word: 'happy', translation: '开心的', pronunciation: '/ˈhæpi/', example: 'I am very happy today.' },
    { id: 9, word: 'water', translation: '水', pronunciation: '/ˈwɔːtər/', example: 'Can I have some water?' },
    { id: 10, word: 'food', translation: '食物', pronunciation: '/fuːd/', example: 'The food is delicious.' },
    { id: 11, word: 'mother', translation: '母亲', pronunciation: '/ˈmʌðər/', example: 'My mother is a teacher.' },
    { id: 12, word: 'father', translation: '父亲', pronunciation: '/ˈfɑːðər/', example: 'My father works in a bank.' },
    { id: 13, word: 'brother', translation: '兄弟', pronunciation: '/ˈbrʌðər/', example: 'I have one brother.' },
    { id: 14, word: 'sister', translation: '姐妹', pronunciation: '/ˈsɪstər/', example: 'My sister is younger than me.' },
    { id: 15, word: 'red', translation: '红色', pronunciation: '/red/', example: 'I like the red car.' },
    { id: 16, word: 'blue', translation: '蓝色', pronunciation: '/bluː/', example: 'The sky is blue.' },
    { id: 17, word: 'green', translation: '绿色', pronunciation: '/ɡriːn/', example: 'The grass is green.' },
    { id: 18, word: 'yellow', translation: '黄色', pronunciation: '/ˈjeloʊ/', example: 'The banana is yellow.' },
    { id: 19, word: 'black', translation: '黑色', pronunciation: '/blæk/', example: 'He wears a black jacket.' },
    { id: 20, word: 'white', translation: '白色', pronunciation: '/waɪt/', example: 'The snow is white.' },
    { id: 21, word: 'one', translation: '一', pronunciation: '/wʌn/', example: 'I have one pen.' },
    { id: 22, word: 'two', translation: '二', pronunciation: '/tuː/', example: 'There are two cats.' },
    { id: 23, word: 'three', translation: '三', pronunciation: '/θriː/', example: 'I have three apples.' },
    { id: 24, word: 'four', translation: '四', pronunciation: '/fɔːr/', example: 'We need four chairs.' },
    { id: 25, word: 'five', translation: '五', pronunciation: '/faɪv/', example: 'I have five fingers.' },
    { id: 26, word: 'school', translation: '学校', pronunciation: '/skuːl/', example: 'I go to school every day.' },
    { id: 27, word: 'teacher', translation: '老师', pronunciation: '/ˈtiːtʃər/', example: 'The teacher is kind.' },
    { id: 28, word: 'student', translation: '学生', pronunciation: '/ˈstuːdnt/', example: 'I am a student.' },
    { id: 29, word: 'desk', translation: '书桌', pronunciation: '/desk/', example: 'There is a book on the desk.' },
    { id: 30, word: 'chair', translation: '椅子', pronunciation: '/tʃer/', example: 'Please sit on the chair.' },
    { id: 31, word: 'morning', translation: '早晨', pronunciation: '/ˈmɔːrnɪŋ/', example: 'Good morning, Mom!' },
    { id: 32, word: 'afternoon', translation: '下午', pronunciation: '/ˌæftərˈnuːn/', example: 'Good afternoon, everyone.' },
    { id: 33, word: 'evening', translation: '傍晚', pronunciation: '/ˈiːvnɪŋ/', example: 'I watch TV in the evening.' },
    { id: 34, word: 'night', translation: '夜晚', pronunciation: '/naɪt/', example: 'Good night, sleep well.' },
    { id: 35, word: 'hello', translation: '你好', pronunciation: '/həˈloʊ/', example: 'Hello, how are you?' },
    { id: 36, word: 'goodbye', translation: '再见', pronunciation: '/ɡʊdˈbaɪ/', example: 'Goodbye, see you tomorrow.' },
    { id: 37, word: 'thank', translation: '感谢', pronunciation: '/θæŋk/', example: 'Thank you for your help.' },
    { id: 38, word: 'please', translation: '请', pronunciation: '/pliːz/', example: 'Please open the door.' },
    { id: 39, word: 'sorry', translation: '对不起', pronunciation: '/ˈsɑːri/', example: 'Sorry, I am late.' },
    { id: 40, word: 'big', translation: '大的', pronunciation: '/bɪɡ/', example: 'This is a big house.' },
    { id: 41, word: 'small', translation: '小的', pronunciation: '/smɔːl/', example: 'I have a small dog.' },
    { id: 42, word: 'hot', translation: '热的', pronunciation: '/hɑːt/', example: 'The coffee is hot.' },
    { id: 43, word: 'cold', translation: '冷的', pronunciation: '/koʊld/', example: 'It is cold in winter.' },
    { id: 44, word: 'eat', translation: '吃', pronunciation: '/iːt/', example: 'I eat breakfast at 7 am.' },
    { id: 45, word: 'drink', translation: '喝', pronunciation: '/drɪŋk/', example: 'I drink water every day.' },
    { id: 46, word: 'run', translation: '跑', pronunciation: '/rʌn/', example: 'I run every morning.' },
    { id: 47, word: 'walk', translation: '走', pronunciation: '/wɔːk/', example: 'I walk to school.' },
    { id: 48, word: 'read', translation: '读', pronunciation: '/riːd/', example: 'I read books every night.' },
    { id: 49, word: 'write', translation: '写', pronunciation: '/raɪt/', example: 'Please write your name.' },
    { id: 50, word: 'play', translation: '玩', pronunciation: '/pleɪ/', example: 'Children play in the park.' },
  ],
  en_intermediate: [
    { id: 1, word: 'accept', translation: '接受', pronunciation: '/əkˈsept/', example: 'I accept your invitation.' },
    { id: 2, word: 'achieve', translation: '达成', pronunciation: '/əˈtʃiːv/', example: 'She achieved her goal.' },
    { id: 3, word: 'avoid', translation: '避免', pronunciation: '/əˈvɔɪd/', example: 'You should avoid eating too much sugar.' },
    { id: 4, word: 'brief', translation: '简短的', pronunciation: '/briːf/', example: 'Please give me a brief introduction.' },
    { id: 5, word: 'cancel', translation: '取消', pronunciation: '/ˈkænsl/', example: 'They had to cancel the meeting.' },
    { id: 6, word: 'career', translation: '职业', pronunciation: '/kəˈrɪr/', example: 'She has a successful career in medicine.' },
    { id: 7, word: 'challenge', translation: '挑战', pronunciation: '/ˈtʃælɪndʒ/', example: 'Learning a new language is a challenge.' },
    { id: 8, word: 'communicate', translation: '交流', pronunciation: '/kəˈmjuːnɪkeɪt/', example: 'We need to communicate more effectively.' },
    { id: 9, word: 'confident', translation: '自信的', pronunciation: '/ˈkɑːnfɪdənt/', example: 'She is confident about the exam.' },
    { id: 10, word: 'consider', translation: '考虑', pronunciation: '/kənˈsɪdər/', example: 'Please consider my suggestion.' },
    { id: 11, word: 'creative', translation: '有创造力的', pronunciation: '/kriˈeɪtɪv/', example: 'He has a creative mind.' },
    { id: 12, word: 'decision', translation: '决定', pronunciation: '/dɪˈsɪʒn/', example: 'Making a decision takes time.' },
    { id: 13, word: 'delicious', translation: '美味的', pronunciation: '/dɪˈlɪʃəs/', example: 'This cake is delicious!' },
    { id: 14, word: 'disappointed', translation: '失望的', pronunciation: '/ˌdɪsəˈpɔɪntɪd/', example: 'I was disappointed with the result.' },
    { id: 15, word: 'emotion', translation: '情感', pronunciation: '/ɪˈmoʊʃn/', example: 'Music can express many emotions.' },
    { id: 16, word: 'encourage', translation: '鼓励', pronunciation: '/ɪnˈkɜːrɪdʒ/', example: 'My teacher encourages me to study hard.' },
    { id: 17, word: 'environment', translation: '环境', pronunciation: '/ɪnˈvaɪrənmənt/', example: 'We should protect the environment.' },
    { id: 18, word: 'essential', translation: '必要的', pronunciation: '/ɪˈsenʃl/', example: 'Sleep is essential for health.' },
    { id: 19, word: 'excellent', translation: '优秀的', pronunciation: '/ˈeksələnt/', example: 'She did an excellent job.' },
    { id: 20, word: 'experience', translation: '经历/经验', pronunciation: '/ɪkˈspɪəriəns/', example: 'I had a great experience traveling.' },
    { id: 21, word: 'explain', translation: '解释', pronunciation: '/ɪkˈspleɪn/', example: 'Can you explain this to me?' },
    { id: 22, word: 'focus', translation: '专注', pronunciation: '/ˈfoʊkəs/', example: 'Please focus on your work.' },
    { id: 23, word: 'frustrated', translation: '沮丧的', pronunciation: '/ˈfrʌstreɪtɪd/', example: 'I feel frustrated when I cannot solve the problem.' },
    { id: 24, word: 'graduate', translation: '毕业', pronunciation: '/ˈɡrædʒuət/', example: 'She will graduate next year.' },
    { id: 25, word: 'improve', translation: '改进', pronunciation: '/ɪmˈpruːv/', example: 'I want to improve my English.' },
    { id: 26, word: 'inspire', translation: '激励', pronunciation: '/ɪnˈspaɪər/', example: 'Her story inspired many people.' },
    { id: 27, word: 'interview', translation: '面试', pronunciation: '/ˈɪntərvjuː/', example: 'I have a job interview tomorrow.' },
    { id: 28, word: 'journey', translation: '旅程', pronunciation: '/ˈdʒɜːrni/', example: 'Life is a long journey.' },
    { id: 29, word: 'manage', translation: '管理', pronunciation: '/ˈmænɪdʒ/', example: 'She manages a team of 10 people.' },
    { id: 30, word: 'necessary', translation: '必要的', pronunciation: '/ˈnesəseri/', example: 'It is necessary to study every day.' },
    { id: 31, word: 'opportunity', translation: '机会', pronunciation: '/ˌɑːpərˈtuːnəti/', example: 'This is a great opportunity.' },
    { id: 32, word: 'patient', translation: '耐心的', pronunciation: '/ˈpeɪʃnt/', example: 'Please be patient with children.' },
    { id: 33, word: 'performance', translation: '表现', pronunciation: '/pərˈfɔːrməns/', example: 'His performance was amazing.' },
    { id: 34, word: 'popular', translation: '受欢迎的', pronunciation: '/ˈpɑːpjələr/', example: 'This song is very popular.' },
    { id: 35, word: 'prefer', translation: '更喜欢', pronunciation: '/prɪˈfɜːr/', example: 'I prefer tea over coffee.' },
    { id: 36, word: 'prepare', translation: '准备', pronunciation: '/prɪˈper/', example: 'I need to prepare for the exam.' },
    { id: 37, word: 'project', translation: '项目', pronunciation: '/ˈprɑːdʒekt/', example: 'We are working on a new project.' },
    { id: 38, word: 'recommend', translation: '推荐', pronunciation: '/ˌrekəˈmend/', example: 'I recommend this book to everyone.' },
    { id: 39, word: 'relax', translation: '放松', pronunciation: '/rɪˈlæks/', example: 'I like to relax on weekends.' },
    { id: 40, word: 'remember', translation: '记住', pronunciation: '/rɪˈmembər/', example: 'Please remember to call me.' },
    { id: 41, word: 'responsibility', translation: '责任', pronunciation: '/rɪˌspɑːnsəˈbɪləti/', example: 'Taking care of a pet is a big responsibility.' },
    { id: 42, word: 'succeed', translation: '成功', pronunciation: '/səkˈsiːd/', example: 'I believe you will succeed.' },
    { id: 43, word: 'suggest', translation: '建议', pronunciation: '/səˈdʒest/', example: 'I suggest taking a break.' },
    { id: 44, word: 'surprised', translation: '惊讶的', pronunciation: '/sərˈpraɪzd/', example: 'I was surprised by the news.' },
    { id: 45, word: 'target', translation: '目标', pronunciation: '/ˈtɑːrɡɪt/', example: 'We reached our sales target.' },
    { id: 46, word: 'traditional', translation: '传统的', pronunciation: '/trəˈdɪʃənl/', example: 'This is a traditional Chinese dish.' },
    { id: 47, word: 'vacation', translation: '假期', pronunciation: '/veɪˈkeɪʃn/', example: 'I am planning a vacation to Japan.' },
    { id: 48, word: 'variety', translation: '多样性', pronunciation: '/vəˈraɪəti/', example: 'There is a variety of food options.' },
    { id: 49, word: 'wonderful', translation: '精彩的', pronunciation: '/ˈwʌndərfl/', example: 'What a wonderful day!' },
    { id: 50, word: 'worth', translation: '值得', pronunciation: '/wɜːrθ/', example: 'This book is worth reading.' },
  ],
  en_advanced: [
    { id: 1, word: 'abstract', translation: '抽象的', pronunciation: '/ˈæbstrækt/', example: 'The concept is too abstract to understand.' },
    { id: 2, word: 'acquire', translation: '获得', pronunciation: '/əˈkwaɪər/', example: 'The company acquired a smaller firm.' },
    { id: 3, word: 'adequate', translation: '充足的', pronunciation: '/ˈædɪkwət/', example: 'We have adequate resources for the project.' },
    { id: 4, word: 'advocate', translation: '提倡', pronunciation: '/ˈædvəkeɪt/', example: 'He advocates for environmental protection.' },
    { id: 5, word: 'aesthetic', translation: '美学的', pronunciation: '/esˈθetɪk/', example: 'The aesthetic value of the painting is remarkable.' },
    { id: 6, word: 'ambiguous', translation: '模棱两可的', pronunciation: '/æmˈbɪɡjuəs/', example: 'His answer was ambiguous and confusing.' },
    { id: 7, word: 'analyse', translation: '分析', pronunciation: '/ˈænəlaɪz/', example: 'We need to analyse the data carefully.' },
    { id: 8, word: 'anthropology', translation: '人类学', pronunciation: '/ˌænθrəˈpɑːlədʒi/', example: 'Anthropology studies human societies.' },
    { id: 9, word: 'appreciate', translation: '欣赏；感激', pronunciation: '/əˈpriːʃieɪt/', example: 'I appreciate your help.' },
    { id: 10, word: 'arbitrary', translation: '任意的', pronunciation: '/ˈɑːrbɪtreri/', example: 'The decision seemed arbitrary and unfair.' },
    { id: 11, word: 'autonomous', translation: '自治的', pronunciation: '/ɔːˈtɑːnəməs/', example: 'The region is now autonomous.' },
    { id: 12, word: 'benevolent', translation: '仁慈的', pronunciation: '/bəˈnevələnt/', example: 'She is a benevolent leader.' },
    { id: 13, word: 'bourgeois', translation: '资产阶级的', pronunciation: '/ˈbʊrʒwɑː/', example: 'The novel critiques bourgeois values.' },
    { id: 14, word: 'capitalism', translation: '资本主义', pronunciation: '/ˈkæpɪtəlɪzəm/', example: 'Capitalism has shaped modern economies.' },
    { id: 15, word: 'cognition', translation: '认知', pronunciation: '/kɑːɡˈnɪʃn/', example: 'Cognition involves perception and reasoning.' },
    { id: 16, word: 'coherent', translation: '连贯的', pronunciation: '/koʊˈhɪrənt/', example: 'The essay needs a coherent argument.' },
    { id: 17, word: 'collaborate', translation: '合作', pronunciation: '/kəˈlæbəreɪt/', example: 'We collaborate with researchers worldwide.' },
    { id: 18, word: 'comprehensive', translation: '全面的', pronunciation: '/ˌkɑːmprɪˈhensɪv/', example: 'We need a comprehensive plan.' },
    { id: 19, word: 'compromise', translation: '妥协', pronunciation: '/ˈkɑːmprəmaɪz/', example: 'Sometimes we must compromise.' },
    { id: 20, word: 'contemporary', translation: '当代的', pronunciation: '/kənˈtempəreri/', example: 'Contemporary art is fascinating.' },
    { id: 21, word: 'contradict', translation: '反驳', pronunciation: '/ˌkɑːntrəˈdɪkt/', example: 'The evidence contradicts his statement.' },
    { id: 22, word: 'convention', translation: '惯例；大会', pronunciation: '/kənˈvenʃn/', example: 'It is a social convention to shake hands.' },
    { id: 23, word: 'deteriorate', translation: '恶化', pronunciation: '/dɪˈtɪəriəreɪt/', example: 'His health began to deteriorate.' },
    { id: 24, word: 'diligent', translation: '勤奋的', pronunciation: '/ˈdɪlɪdʒənt/', example: 'She is a diligent student.' },
    { id: 25, word: 'dilemma', translation: '困境', pronunciation: '/dɪˈlemə/', example: 'I faced a moral dilemma.' },
    { id: 26, word: 'disseminate', translation: '传播', pronunciation: '/dɪˈsemɪneɪt/', example: 'The internet helps disseminate information.' },
    { id: 27, word: 'elaborate', translation: '详尽阐述', pronunciation: '/ɪˈlæbərət/', example: 'Could you elaborate on your point?' },
    { id: 28, word: 'empirical', translation: '实证的', pronunciation: '/ɪmˈpɪrɪkl/', example: 'We need empirical evidence to support the theory.' },
    { id: 29, word: 'enlighten', translation: '启发', pronunciation: '/ɪnˈlaɪtn/', example: 'The lecture enlightened the students.' },
    { id: 30, word: 'entrepreneur', translation: '企业家', pronunciation: '/ˌɑːntrəprəˈnɜːr/', example: 'He is a successful entrepreneur.' },
    { id: 31, word: 'epistemology', translation: '认识论', pronunciation: '/ɪˌpɪstɪˈmɑːlədʒi/', example: 'Epistemology examines the nature of knowledge.' },
    { id: 32, word: 'ethical', translation: '伦理的', pronunciation: '/ˈeθɪkl/', example: 'We must consider the ethical implications.' },
    { id: 33, word: 'exemplify', translation: '例证', pronunciation: '/ɪɡˈzemplɪfaɪ/', example: 'This case exemplifies the problem.' },
    { id: 34, word: 'explicit', translation: '明确的', pronunciation: '/ɪkˈsplɪsɪt/', example: 'The instructions were explicit.' },
    { id: 35, word: 'hierarchy', translation: '层级', pronunciation: '/ˈhaɪərɑːrki/', example: 'The company has a strict hierarchy.' },
    { id: 36, word: 'hypothetical', translation: '假设的', pronunciation: '/ˌhaɪpəˈθetɪkl/', example: 'This is a hypothetical situation.' },
    { id: 37, word: 'ideology', translation: '意识形态', pronunciation: '/ˌaɪdiˈɑːlədʒi/', example: 'Political ideology shapes our views.' },
    { id: 38, word: 'implicit', translation: '隐含的', pronunciation: '/ɪmˈplɪsɪt/', example: 'There was an implicit threat in his words.' },
    { id: 39, word: 'infrastructure', translation: '基础设施', pronunciation: '/ˈɪnfrəstrʌktʃər/', example: 'The country needs better infrastructure.' },
    { id: 40, word: 'innovation', translation: '创新', pronunciation: '/ˌɪnəˈveɪʃn/', example: 'Innovation drives economic growth.' },
    { id: 41, word: 'intellectual', translation: '知识的；知识分子', pronunciation: '/ˌɪntəˈlektʃuəl/', example: 'She is an intellectual person.' },
    { id: 42, word: 'methodology', translation: '方法论', pronunciation: '/ˌmeθəˈdɑːlədʒi/', example: 'We need to improve our methodology.' },
    { id: 43, word: 'paradigm', translation: '范式', pronunciation: '/ˈpærədaɪm/', example: 'This represents a paradigm shift.' },
    { id: 44, word: 'philosophical', translation: '哲学的', pronunciation: '/ˌfɪləˈsɑːfɪkl/', example: 'The question is philosophical in nature.' },
    { id: 45, word: 'pragmatic', translation: '务实的', pronunciation: '/præɡˈmætɪk/', example: 'We need a pragmatic approach.' },
    { id: 46, word: 'preliminary', translation: '初步的', pronunciation: '/prɪˈlɪmɪneri/', example: 'The preliminary results are promising.' },
    { id: 47, word: 'profound', translation: '深刻的', pronunciation: '/prəˈfaʊnd/', example: 'The book had a profound impact on me.' },
    { id: 48, word: 'speculate', translation: '推测', pronunciation: '/ˈspekjəleɪt/', example: 'We can only speculate about the outcome.' },
    { id: 49, word: 'sustainability', translation: '可持续性', pronunciation: '/səˌsteɪnəˈbɪləti/', example: 'Sustainability is crucial for our future.' },
    { id: 50, word: 'theoretical', translation: '理论的', pronunciation: '/ˌθiːəˈretɪkl/', example: 'The theoretical framework is sound.' },
  ],
  ja_beginner: [
    // 日常问候
    { id: 1, word: 'こんにちは', translation: '你好', pronunciation: 'konnichiwa', example: 'こんにちは、元気ですか？' },
    { id: 2, word: 'ありがとう', translation: '谢谢', pronunciation: 'arigatou', example: 'ありがとうございます！' },
    { id: 3, word: 'さようなら', translation: '再见', pronunciation: 'sayounara', example: 'さようなら、また明日。' },
    { id: 4, word: 'はい', translation: '是的', pronunciation: 'hai', example: 'はい、そうです。' },
    { id: 5, word: 'いいえ', translation: '不是', pronunciation: 'iie', example: 'いいえ、違います。' },
    { id: 6, word: 'すみません', translation: '对不起/劳驾', pronunciation: 'sumimasen', example: 'すみません、駅はどこですか？' },
    { id: 7, word: 'おはよう', translation: '早上好', pronunciation: 'ohayou', example: 'おはようございます！' },
    { id: 8, word: 'こんばんは', translation: '晚上好', pronunciation: 'konbanwa', example: 'こんばんは、お疲れ様です。' },
    { id: 9, word: 'おやすみ', translation: '晚安', pronunciation: 'oyasumi', example: 'おやすみなさい。' },
    { id: 10, word: 'いただきます', translation: '我开动了', pronunciation: 'itadakimasu', example: 'いただきます！' },
    // 数字
    { id: 11, word: '一', translation: '一', pronunciation: 'ichi', example: 'りんごが一つあります。' },
    { id: 12, word: '二', translation: '二', pronunciation: 'ni', example: '猫が二匹います。' },
    { id: 13, word: '三', translation: '三', pronunciation: 'san', example: '本を三冊買いました。' },
    { id: 14, word: '四', translation: '四', pronunciation: 'yon', example: '四月は春です。' },
    { id: 15, word: '五', translation: '五', pronunciation: 'go', example: '五時です。' },
    { id: 16, word: '十', translation: '十', pronunciation: 'juu', example: '十人来ました。' },
    { id: 17, word: '百', translation: '百', pronunciation: 'hyaku', example: '百円です。' },
    { id: 18, word: '千', translation: '千', pronunciation: 'sen', example: '千人以上います。' },
    { id: 19, word: '万', translation: '万', pronunciation: 'man', example: '一万円札です。' },
    { id: 20, word: '零', translation: '零', pronunciation: 'zero', example: '零から始めます。' },
    // 家庭成员
    { id: 21, word: '父', translation: '父亲', pronunciation: 'chichi', example: '父は会社員です。' },
    { id: 22, word: '母', translation: '母亲', pronunciation: 'haha', example: '母は料理が好きです。' },
    { id: 23, word: '兄', translation: '哥哥', pronunciation: 'ani', example: '兄は大学生です。' },
    { id: 24, word: '姉', translation: '姐姐', pronunciation: 'ane', example: '姉は東京に住んでいます。' },
    { id: 25, word: '弟', translation: '弟弟', pronunciation: 'otouto', example: '弟は学生です。' },
    { id: 26, word: '妹', translation: '妹妹', pronunciation: 'imouto', example: '妹は小学生です。' },
    { id: 27, word: '祖父', translation: '祖父', pronunciation: 'sofu', example: '祖父は元気です。' },
    { id: 28, word: '祖母', translation: '祖母', pronunciation: 'sobo', example: '祖母の家に行きます。' },
    { id: 29, word: '家族', translation: '家人', pronunciation: 'kazoku', example: '家族が大切です。' },
    { id: 30, word: '子供', translation: '孩子', pronunciation: 'kodomo', example: '子供が公園で遊んでいます。' },
    // 食物
    { id: 31, word: '水', translation: '水', pronunciation: 'mizu', example: '水を飲みます。' },
    { id: 32, word: 'お茶', translation: '茶', pronunciation: 'ocha', example: 'お茶をどうぞ。' },
    { id: 33, word: 'ご飯', translation: '米饭/饭', pronunciation: 'gohan', example: 'ご飯を食べます。' },
    { id: 34, word: 'パン', translation: '面包', pronunciation: 'pan', example: '朝ご飯はパンです。' },
    { id: 35, word: '肉', translation: '肉', pronunciation: 'niku', example: '肉を焼きます。' },
    { id: 36, word: '魚', translation: '鱼', pronunciation: 'sakana', example: '魚が好きです。' },
    { id: 37, word: '野菜', translation: '蔬菜', pronunciation: 'yasai', example: '野菜を食べます。' },
    { id: 38, word: '果物', translation: '水果', pronunciation: 'kudamono', example: '果物を買います。' },
    { id: 39, word: '牛乳', translation: '牛奶', pronunciation: 'gyuunyuu', example: '牛乳を飲みます。' },
    { id: 40, word: '卵', translation: '鸡蛋', pronunciation: 'tamago', example: '卵を料理します。' },
    // 动物
    { id: 41, word: '猫', translation: '猫', pronunciation: 'neko', example: '猫が可愛いです。' },
    { id: 42, word: '犬', translation: '狗', pronunciation: 'inu', example: '犬がいます。' },
    { id: 43, word: '鳥', translation: '鸟', pronunciation: 'tori', example: '鳥が飛んでいます。' },
    { id: 44, word: '馬', translation: '马', pronunciation: 'uma', example: '馬が走ります。' },
    { id: 45, word: '牛', translation: '牛', pronunciation: 'ushi', example: '牛がいます。' },
    // 基本动词
    { id: 46, word: '食べる', translation: '吃', pronunciation: 'taberu', example: '毎日野菜を食べます。' },
    { id: 47, word: '飲む', translation: '喝', pronunciation: 'nomu', example: '水を飲みます。' },
    { id: 48, word: '行く', translation: '去', pronunciation: 'iku', example: '学校に行きます。' },
    { id: 49, word: '来る', translation: '来', pronunciation: 'kuru', example: '友達が来ます。' },
    { id: 50, word: '見る', translation: '看', pronunciation: 'miru', example: 'テレビを見ます。' },
  ],
  ja_intermediate: [
    // 工作词汇
    { id: 1, word: '仕事', translation: '工作', pronunciation: 'shigoto', example: '仕事に行きます。' },
    { id: 2, word: '会社', translation: '公司', pronunciation: 'kaisha', example: '父は会社員です。' },
    { id: 3, word: '会議', translation: '会议', pronunciation: 'kaigi', example: '会議があります。' },
    { id: 4, word: '電話', translation: '电话', pronunciation: 'denwa', example: '電話をかけます。' },
    { id: 5, word: 'メール', translation: '邮件', pronunciation: 'meeru', example: 'メールを送ります。' },
    { id: 6, word: '給料', translation: '工资', pronunciation: 'kyuuryou', example: '給料が上がりました。' },
    { id: 7, word: '残業', translation: '加班', pronunciation: 'zangyou', example: '残業が多いです。' },
    { id: 8, word: '休暇', translation: '休假', pronunciation: 'kyuuka', example: '休暇を取ります。' },
    { id: 9, word: '上司', translation: '上司', pronunciation: 'joushi', example: '上司に報告します。' },
    { id: 10, word: '部下', translation: '下属', pronunciation: 'buka', example: '部下を指導します。' },
    // 学校用语
    { id: 11, word: '学校', translation: '学校', pronunciation: 'gakkou', example: '学校に行きます。' },
    { id: 12, word: '教室', translation: '教室', pronunciation: 'kyoushitsu', example: '教室で勉強します。' },
    { id: 13, word: '先生', translation: '老师', pronunciation: 'sensei', example: '先生に質問します。' },
    { id: 14, word: '学生', translation: '学生', pronunciation: 'gakusei', example: '学生時代が懐かしいです。' },
    { id: 15, word: '授業', translation: '课程', pronunciation: 'jugyou', example: '授業が始まります。' },
    { id: 16, word: '宿題', translation: '作业', pronunciation: 'shukudai', example: '宿題をします。' },
    { id: 17, word: '試験', translation: '考试', pronunciation: 'shiken', example: '試験があります。' },
    { id: 18, word: '勉強', translation: '学习', pronunciation: 'benkyou', example: '日本語を勉強します。' },
    { id: 19, word: '図書館', translation: '图书馆', pronunciation: 'toshokan', example: '図書館で本を読みます。' },
    { id: 20, word: '卒業', translation: '毕业', pronunciation: 'sotsugyou', example: '大学を卒業しました。' },
    // 旅行
    { id: 21, word: '旅行', translation: '旅行', pronunciation: 'ryokou', example: '旅行に行きます。' },
    { id: 22, word: '飛行機', translation: '飞机', pronunciation: 'hikouki', example: '飛行機に乗ります。' },
    { id: 23, word: '電車', translation: '电车', pronunciation: 'densha', example: '電車で行きます。' },
    { id: 24, word: '駅', translation: '车站', pronunciation: 'eki', example: '駅まで歩きます。' },
    { id: 25, word: '空港', translation: '机场', pronunciation: 'kuukou', example: '空港に着きました。' },
    { id: 26, word: 'ホテル', translation: '酒店', pronunciation: 'hoteru', example: 'ホテルを予約しました。' },
    { id: 27, word: '観光', translation: '观光', pronunciation: 'kankou', example: '観光します。' },
    { id: 28, word: '写真', translation: '照片', pronunciation: 'shashin', example: '写真を撮ります。' },
    { id: 29, word: '地図', translation: '地图', pronunciation: 'chizu', example: '地図を見ます。' },
    { id: 30, word: '切符', translation: '票', pronunciation: 'kippu', example: '切符を買います。' },
    // 情感表达
    { id: 31, word: '嬉しい', translation: '高兴的', pronunciation: 'ureshii', example: '嬉しいです！' },
    { id: 32, word: '悲しい', translation: '悲伤的', pronunciation: 'kanashii', example: '悲しいです。' },
    { id: 33, word: '怒る', translation: '生气', pronunciation: 'okoru', example: '怒らないでください。' },
    { id: 34, word: '寂しい', translation: '寂寞的', pronunciation: 'sabishii', example: '寂しいです。' },
    { id: 35, word: '楽しい', translation: '愉快的', pronunciation: 'tanoshii', example: '楽しいです！' },
    { id: 36, word: '恥ずかしい', translation: '害羞的', pronunciation: 'hazukashii', example: '恥ずかしいです。' },
    { id: 37, word: '心配', translation: '担心', pronunciation: 'shinpai', example: '心配しないで。' },
    { id: 38, word: '緊張', translation: '紧张', pronunciation: 'kinchou', example: '緊張します。' },
    { id: 39, word: '安心', translation: '安心', pronunciation: 'anshin', example: '安心しました。' },
    { id: 40, word: '驚く', translation: '惊讶', pronunciation: 'odoroku', example: '驚きました！' },
    // 描述性词汇
    { id: 41, word: '大きい', translation: '大的', pronunciation: 'ookii', example: '大きい家です。' },
    { id: 42, word: '小さい', translation: '小的', pronunciation: 'chiisai', example: '小さい猫です。' },
    { id: 43, word: '高い', translation: '高的/贵的', pronunciation: 'takai', example: '値段が高いです。' },
    { id: 44, word: '安い', translation: '便宜的', pronunciation: 'yasui', example: '安いですね。' },
    { id: 45, word: '新しい', translation: '新的', pronunciation: 'atarashii', example: '新しい車です。' },
    { id: 46, word: '古い', translation: '旧的', pronunciation: 'furui', example: '古い建物です。' },
    { id: 47, word: '難しい', translation: '难的', pronunciation: 'muzukashii', example: '難しい問題です。' },
    { id: 48, word: '易しい', translation: '容易的', pronunciation: 'yasashii', example: '易しいですね。' },
    { id: 49, word: '忙しい', translation: '忙的', pronunciation: 'isogashii', example: '忙しいです。' },
    { id: 50, word: '静か', translation: '安静的', pronunciation: 'shizuka', example: '静かな場所です。' },
  ],
  ja_advanced: [
    // 商务日语
    { id: 1, word: '取引先', translation: '客户/交易方', pronunciation: 'torihikisaki', example: '取引先と会議があります。' },
    { id: 2, word: '契約', translation: '合同', pronunciation: 'keiyaku', example: '契約を結びます。' },
    { id: 3, word: '交渉', translation: '谈判', pronunciation: 'koushou', example: '交渉が進んでいます。' },
    { id: 4, word: '提案', translation: '提案', pronunciation: 'teian', example: '提案をします。' },
    { id: 5, word: '承認', translation: '批准', pronunciation: 'shounin', example: '承認を待ちます。' },
    { id: 6, word: '予算', translation: '预算', pronunciation: 'yosan', example: '予算を超えました。' },
    { id: 7, word: '利益', translation: '利润', pronunciation: 'rieki', example: '利益が増えました。' },
    { id: 8, word: '責任', translation: '责任', pronunciation: 'sekinin', example: '責任を持ちます。' },
    { id: 9, word: '報告書', translation: '报告书', pronunciation: 'houkokusho', example: '報告書を作成します。' },
    { id: 10, word: '経営', translation: '经营', pronunciation: 'keiei', example: '経営戦略です。' },
    // 学术词汇
    { id: 11, word: '研究', translation: '研究', pronunciation: 'kenkyuu', example: '研究を進めます。' },
    { id: 12, word: '理論', translation: '理论', pronunciation: 'riron', example: '理論的に説明します。' },
    { id: 13, word: '実験', translation: '实验', pronunciation: 'jikken', example: '実験を行います。' },
    { id: 14, word: '分析', translation: '分析', pronunciation: 'bunseki', example: 'データを分析します。' },
    { id: 15, word: '結果', translation: '结果', pronunciation: 'kekka', example: '結果が出ました。' },
    { id: 16, word: '仮説', translation: '假设', pronunciation: 'kasetsu', example: '仮説を立てます。' },
    { id: 17, word: '証明', translation: '证明', pronunciation: 'shoumei', example: '証明できます。' },
    { id: 18, word: '現象', translation: '现象', pronunciation: 'genshou', example: '興味深い現象です。' },
    { id: 19, word: '知識', translation: '知识', pronunciation: 'chishiki', example: '知識を深めます。' },
    { id: 20, word: '技術', translation: '技术', pronunciation: 'gijutsu', example: '技術が進歩しています。' },
    // 抽象概念
    { id: 21, word: '自由', translation: '自由', pronunciation: 'jiyuu', example: '自由が大切です。' },
    { id: 22, word: '平等', translation: '平等', pronunciation: 'byoudou', example: '平等な社会を目指します。' },
    { id: 23, word: '平和', translation: '和平', pronunciation: 'heiwa', example: '世界平和を願います。' },
    { id: 24, word: '幸福', translation: '幸福', pronunciation: 'koufuku', example: '幸福を感じます。' },
    { id: 25, word: '文化', translation: '文化', pronunciation: 'bunka', example: '文化の違いを理解します。' },
    { id: 26, word: '伝統', translation: '传统', pronunciation: 'dentou', example: '伝統を守ります。' },
    { id: 27, word: '歴史', translation: '历史', pronunciation: 'rekishi', example: '歴史を学びます。' },
    { id: 28, word: '社会', translation: '社会', pronunciation: 'shakai', example: '社会問題です。' },
    { id: 29, word: '経済', translation: '经济', pronunciation: 'keizai', example: '経済が成長しています。' },
    { id: 30, word: '政治', translation: '政治', pronunciation: 'seiji', example: '政治に興味があります。' },
    // 文学表达
    { id: 31, word: '感情', translation: '感情', pronunciation: 'kanjou', example: '感情を表現します。' },
    { id: 32, word: '情景', translation: '情景', pronunciation: 'joukei', example: '美しい情景です。' },
    { id: 33, word: '表現', translation: '表现', pronunciation: 'hyougen', example: '表現が難しいです。' },
    { id: 34, word: '描写', translation: '描写', pronunciation: 'byousha', example: '詳細な描写です。' },
    { id: 35, word: '比喩', translation: '比喻', pronunciation: 'hiyu', example: '比喩を使います。' },
    { id: 36, word: '象徴', translation: '象征', pronunciation: 'shouchou', example: '象徴的な意味です。' },
    { id: 37, word: '雰囲気', translation: '气氛', pronunciation: 'fun\'iki', example: '良い雰囲気です。' },
    { id: 38, word: '感動', translation: '感动', pronunciation: 'kandou', example: '感動しました。' },
    { id: 39, word: '共感', translation: '共鸣', pronunciation: 'kyoukan', example: '共感できます。' },
    { id: 40, word: '印象', translation: '印象', pronunciation: 'inshou', example: '印象に残りました。' },
    // 高级动词
    { id: 41, word: '追求する', translation: '追求', pronunciation: 'tsuikyuu suru', example: '夢を追求します。' },
    { id: 42, word: '達成する', translation: '达成', pronunciation: 'tassei suru', example: '目標を達成しました。' },
    { id: 43, word: '貢献する', translation: '贡献', pronunciation: 'kouken suru', example: '社会に貢献します。' },
    { id: 44, word: '維持する', translation: '维持', pronunciation: 'iji suru', example: '関係を維持します。' },
    { id: 45, word: '発展する', translation: '发展', pronunciation: 'hatten suru', example: '産業が発展しています。' },
    { id: 46, word: '影響する', translation: '影响', pronunciation: 'eikyou suru', example: '環境に影響します。' },
    { id: 47, word: '創造する', translation: '创造', pronunciation: 'souzou suru', example: '新しい価値を創造します。' },
    { id: 48, word: '提案する', translation: '提议', pronunciation: 'teian suru', example: '解決策を提案します。' },
    { id: 49, word: '実現する', translation: '实现', pronunciation: 'jitsugen suru', example: '夢が実現しました。' },
    { id: 50, word: '理解する', translation: '理解', pronunciation: 'rikai suru', example: '深く理解します。' },
  ],
  ko_beginner: [
    // 日常问候
    { id: 1, word: '안녕하세요', translation: '你好', pronunciation: 'annyeonghaseyo', example: '안녕하세요, 만나서 반갑습니다.' },
    { id: 2, word: '감사합니다', translation: '谢谢', pronunciation: 'gamsahamnida', example: '도와주셔서 감사합니다.' },
    { id: 3, word: '안녕히 가세요', translation: '再见（主人留）', pronunciation: 'annyeonghi gaseyo', example: '안녕히 가세요, 내일 봐요.' },
    { id: 4, word: '안녕히 계세요', translation: '再见（客人说）', pronunciation: 'annyeonghi gyeseyo', example: '안녕히 계세요, 또 올게요.' },
    { id: 5, word: '네', translation: '是的', pronunciation: 'ne', example: '네, 맞습니다.' },
    { id: 6, word: '아니요', translation: '不是', pronunciation: 'aniyo', example: '아니요, 그렇지 않아요.' },
    { id: 7, word: '죄송합니다', translation: '对不起', pronunciation: 'joesonghamnida', example: '늦어서 죄송합니다.' },
    { id: 8, word: '좋은 아침', translation: '早上好', pronunciation: 'joeun achim', example: '좋은 아침입니다!' },
    { id: 9, word: '안녕', translation: '你好/再见（非正式）', pronunciation: 'annyeong', example: '안녕! 잘 지내?' },
    { id: 10, word: '잘 지내세요', translation: '过得好吗', pronunciation: 'jal jinaeseyo', example: '요즘 잘 지내세요?' },
    // 数字
    { id: 11, word: '하나/한', translation: '一', pronunciation: 'hana/han', example: '사과 한 개 주세요.' },
    { id: 12, word: '둘/두', translation: '二', pronunciation: 'dul/du', example: '두 사람이 왔어요.' },
    { id: 13, word: '셋/세', translation: '三', pronunciation: 'set/se', example: '세 시에 만나요.' },
    { id: 14, word: '넷/네', translation: '四', pronunciation: 'net/ne', example: '네 형제가 있어요.' },
    { id: 15, word: '다섯', translation: '五', pronunciation: 'daseot', example: '다섯 개 주세요.' },
    // 家庭成员
    { id: 16, word: '아버지', translation: '父亲', pronunciation: 'abeoji', example: '아버지는 회사에 가셨어요.' },
    { id: 17, word: '어머니', translation: '母亲', pronunciation: 'eomeoni', example: '어머니가 요리를 하세요.' },
    { id: 18, word: '형제', translation: '兄弟', pronunciation: 'hyeongje', example: '형제가 몇 명이에요?' },
    { id: 19, word: '언니', translation: '姐姐（女称）', pronunciation: 'eonni', example: '언니는 대학생이에요.' },
    { id: 20, word: '오빠', translation: '哥哥（女称）', pronunciation: 'oppa', example: '오빠가 학교에 갔어요.' },
    { id: 21, word: '동생', translation: '弟弟/妹妹', pronunciation: 'dongsaeng', example: '동생이 아파요.' },
    // 食物
    { id: 22, word: '밥', translation: '饭/米饭', pronunciation: 'bap', example: '밥을 먹었어요?' },
    { id: 23, word: '물', translation: '水', pronunciation: 'mul', example: '물 한 잔 주세요.' },
    { id: 24, word: '사과', translation: '苹果', pronunciation: 'sagwa', example: '사과가 맛있어요.' },
    { id: 25, word: '빵', translation: '面包', pronunciation: 'ppang', example: '빵을 샀어요.' },
    { id: 26, word: '우유', translation: '牛奶', pronunciation: 'uyu', example: '우유를 마셔요.' },
    { id: 27, word: '커피', translation: '咖啡', pronunciation: 'keopi', example: '커피 좋아하세요?' },
    // 动物
    { id: 28, word: '고양이', translation: '猫', pronunciation: 'goyangi', example: '고양이가 귀여워요.' },
    { id: 29, word: '개', translation: '狗', pronunciation: 'gae', example: '개를 키워요.' },
    { id: 30, word: '새', translation: '鸟', pronunciation: 'sae', example: '새가 날아가요.' },
    // 基本动词
    { id: 31, word: '가다', translation: '去', pronunciation: 'gada', example: '학교에 가요.' },
    { id: 32, word: '오다', translation: '来', pronunciation: 'oda', example: '언제 왔어요?' },
    { id: 33, word: '먹다', translation: '吃', pronunciation: 'meokda', example: '점심을 먹어요.' },
    { id: 34, word: '마시다', translation: '喝', pronunciation: 'masida', example: '차를 마셔요.' },
    { id: 35, word: '보다', translation: '看', pronunciation: 'boda', example: '영화를 봐요.' },
    { id: 36, word: '듣다', translation: '听', pronunciation: 'deutda', example: '음악을 들어요.' },
    { id: 37, word: '읽다', translation: '读', pronunciation: 'ikda', example: '책을 읽어요.' },
    { id: 38, word: '쓰다', translation: '写/使用', pronunciation: 'sseuda', example: '편지를 써요.' },
    { id: 39, word: '자다', translation: '睡觉', pronunciation: 'jada', example: '일찍 자요.' },
    { id: 40, word: '일어나다', translation: '起床', pronunciation: 'ireonada', example: '아침 7시에 일어나요.' },
    // 基本形容词
    { id: 41, word: '좋다', translation: '好', pronunciation: 'jota', example: '날씨가 좋아요.' },
    { id: 42, word: '나쁘다', translation: '坏', pronunciation: 'nappeuda', example: '나쁜 습관이에요.' },
    { id: 43, word: '크다', translation: '大', pronunciation: 'keuda', example: '집이 커요.' },
    { id: 44, word: '작다', translation: '小', pronunciation: 'jakda', example: '방이 작아요.' },
    { id: 45, word: '많다', translation: '多', pronunciation: 'manta', example: '사람이 많아요.' },
    // 其他基础词汇
    { id: 46, word: '이름', translation: '名字', pronunciation: 'ireum', example: '이름이 뭐예요?' },
    { id: 47, word: '한국', translation: '韩国', pronunciation: 'hanguk', example: '저는 한국에 살아요.' },
    { id: 48, word: '친구', translation: '朋友', pronunciation: 'chingu', example: '그는 제 친구예요.' },
    { id: 49, word: '학교', translation: '学校', pronunciation: 'hakgyo', example: '학교에 가요.' },
    { id: 50, word: '집', translation: '家', pronunciation: 'jip', example: '집에 가요.' },
  ],
  ko_intermediate: [
    // 工作相关
    { id: 1, word: '회사', translation: '公司', pronunciation: 'hoesa', example: '회사에 다녀요.' },
    { id: 2, word: '직장', translation: '职场', pronunciation: 'jikjang', example: '직장 동료예요.' },
    { id: 3, word: '회의', translation: '会议', pronunciation: 'hoeui', example: '회의가 있어요.' },
    { id: 4, word: '보고서', translation: '报告书', pronunciation: 'bogoseo', example: '보고서를 썼어요.' },
    { id: 5, word: '출근', translation: '上班', pronunciation: 'chulgeun', example: '9시에 출근해요.' },
    { id: 6, word: '퇴근', translation: '下班', pronunciation: 'toegeun', example: '6시에 퇴근해요.' },
    // 学校用语
    { id: 7, word: '수업', translation: '课程', pronunciation: 'sueop', example: '수업이 끝났어요.' },
    { id: 8, word: '숙제', translation: '作业', pronunciation: 'sukje', example: '숙제를 다 했어요.' },
    { id: 9, word: '시험', translation: '考试', pronunciation: 'siheom', example: '시험을 봤어요.' },
    { id: 10, word: '성적', translation: '成绩', pronunciation: 'seongjeok', example: '성적이 좋아요.' },
    { id: 11, word: '졸업', translation: '毕业', pronunciation: 'joleop', example: '대학을 졸업했어요.' },
    // 旅行相关
    { id: 12, word: '공항', translation: '机场', pronunciation: 'gonghang', example: '공항에 일찍 가요.' },
    { id: 13, word: '비행기', translation: '飞机', pronunciation: 'bihaenggi', example: '비행기를 타요.' },
    { id: 14, word: '여행', translation: '旅行', pronunciation: 'yeohaeng', example: '여행을 가요.' },
    { id: 15, word: '호텔', translation: '酒店', pronunciation: 'hotel', example: '호텔을 예약했어요.' },
    { id: 16, word: '관광', translation: '观光', pronunciation: 'gwanwang', example: '관광을 했어요.' },
    { id: 17, word: '예약', translation: '预约', pronunciation: 'yeyak', example: '예약할게요.' },
    // 情感表达
    { id: 18, word: '기쁘다', translation: '高兴', pronunciation: 'gippeuda', example: '기뻐요.' },
    { id: 19, word: '슬프다', translation: '悲伤', pronunciation: 'seulpeuda', example: '슬픈 소식이에요.' },
    { id: 20, word: '화나다', translation: '生气', pronunciation: 'hwanada', example: '화났어요.' },
    { id: 21, word: '걱정', translation: '担心', pronunciation: 'geokjeong', example: '걱정하지 마세요.' },
    { id: 22, word: '놀라다', translation: '惊讶', pronunciation: 'nollada', example: '놀랐어요!' },
    { id: 23, word: '부럽다', translation: '羡慕', pronunciation: 'bureopda', example: '정말 부러워요.' },
    // 描述性词汇
    { id: 24, word: '편리하다', translation: '方便', pronunciation: 'pyeollihada', example: '교통이 편리해요.' },
    { id: 25, word: '복잡하다', translation: '复杂', pronunciation: 'bokjaphada', example: '길이 복잡해요.' },
    { id: 26, word: '조용하다', translation: '安静', pronunciation: 'joyonghada', example: '이 카페는 조용해요.' },
    { id: 27, word: '시끄럽다', translation: '吵闹', pronunciation: 'sikkeureopda', example: '너무 시끄러워요.' },
    { id: 28, word: '깨끗하다', translation: '干净', pronunciation: 'kkaekkeuthada', example: '방이 깨끗해요.' },
    { id: 29, word: '더럽다', translation: '脏', pronunciation: 'deoreopda', example: '손이 더러워요.' },
    // 时间表达
    { id: 30, word: '아침', translation: '早晨', pronunciation: 'achim', example: '아침에 운동해요.' },
    { id: 31, word: '점심', translation: '中午/午饭', pronunciation: 'jeomsim', example: '점심을 먹어요.' },
    { id: 32, word: '저녁', translation: '傍晚/晚饭', pronunciation: 'jeonyeok', example: '저녁에 만나요.' },
    { id: 33, word: '오늘', translation: '今天', pronunciation: 'oneul', example: '오늘 날씨가 좋아요.' },
    { id: 34, word: '내일', translation: '明天', pronunciation: 'naeil', example: '내일 봐요.' },
    { id: 35, word: '어제', translation: '昨天', pronunciation: 'eoje', example: '어제 뭐 했어요?' },
    // 日常活动
    { id: 36, word: '운동하다', translation: '运动', pronunciation: 'undonghada', example: '매일 운동해요.' },
    { id: 37, word: '쇼핑하다', translation: '购物', pronunciation: 'syoinghada', example: '백화점에서 쇼핑해요.' },
    { id: 38, word: '요리하다', translation: '做饭', pronunciation: 'yorihada', example: '김치를 요리해요.' },
    { id: 39, word: '청소하다', translation: '打扫', pronunciation: 'cheongsohada', example: '방을 청소해요.' },
    { id: 40, word: '데이트', translation: '约会', pronunciation: 'deiteu', example: '데이트했어요.' },
    // 交通相关
    { id: 41, word: '지하철', translation: '地铁', pronunciation: 'jihacheol', example: '지하철을 타요.' },
    { id: 42, word: '버스', translation: '公交', pronunciation: 'beoseu', example: '버스가 왔어요.' },
    { id: 43, word: '택시', translation: '出租车', pronunciation: 'taeksi', example: '택시를 탔어요.' },
    { id: 44, word: '역', translation: '站', pronunciation: 'yeok', example: '서울역에서 내려요.' },
    // 购物相关
    { id: 45, word: '가격', translation: '价格', pronunciation: 'gagyeok', example: '가격이 비싸요.' },
    { id: 46, word: '할인', translation: '折扣', pronunciation: 'harin', example: '할인 중이에요.' },
    { id: 47, word: '계산', translation: '结账', pronunciation: 'gyesan', example: '계산할게요.' },
    { id: 48, word: '영수증', translation: '收据', pronunciation: 'yeongsujeung', example: '영수증 주세요.' },
    // 其他常用
    { id: 49, word: '약속', translation: '约定', pronunciation: 'yaksok', example: '약속이 있어요.' },
    { id: 50, word: '취미', translation: '爱好', pronunciation: 'chwimi', example: '취미가 뭐예요?' },
  ],
  ko_advanced: [
    // 商务韩语
    { id: 1, word: '협상', translation: '协商', pronunciation: 'heopsang', example: '협상이 진행 중이에요.' },
    { id: 2, word: '계약', translation: '合同', pronunciation: 'gyeyak', example: '계약을 체결했어요.' },
    { id: 3, word: '제안', translation: '提案', pronunciation: 'jean', example: '제안을 받아들였어요.' },
    { id: 4, word: '수익', translation: '收益', pronunciation: 'suik', example: '수익이 증가했어요.' },
    { id: 5, word: '투자', translation: '投资', pronunciation: 'tuja', example: '투자를 검토 중이에요.' },
    { id: 6, word: '경영', translation: '经营', pronunciation: 'gyeongyeong', example: '경영 전략이에요.' },
    { id: 7, word: '시장', translation: '市场', pronunciation: 'sijang', example: '시장 점유율이에요.' },
    { id: 8, word: '경쟁', translation: '竞争', pronunciation: 'gyeongjaeng', example: '경쟁이 치열해요.' },
    { id: 9, word: '혁신', translation: '革新', pronunciation: 'hyeoksin', example: '혁신 기술이에요.' },
    { id: 10, word: '파트너', translation: '合作伙伴', pronunciation: 'pateuneo', example: '파트너와 협력해요.' },
    // 学术词汇
    { id: 11, word: '연구', translation: '研究', pronunciation: 'yeongu', example: '연구를 진행해요.' },
    { id: 12, word: '분석', translation: '分析', pronunciation: 'bunseok', example: '데이터를 분석해요.' },
    { id: 13, word: '이론', translation: '理论', pronunciation: 'iron', example: '이론적 근거예요.' },
    { id: 14, word: '실험', translation: '实验', pronunciation: 'silheom', example: '실험 결과가 나왔어요.' },
    { id: 15, word: '논문', translation: '论文', pronunciation: 'nonmun', example: '논문을 발표했어요.' },
    { id: 16, word: '졸업논문', translation: '毕业论文', pronunciation: 'joleopnonmun', example: '졸업논문을 쓰고 있어요.' },
    { id: 17, word: '학위', translation: '学位', pronunciation: 'hagwi', example: '학위를 받았어요.' },
    { id: 18, word: '전공', translation: '专业', pronunciation: 'jeongong', example: '전공은 경제학이에요.' },
    // 抽象概念
    { id: 19, word: '자유', translation: '自由', pronunciation: 'jayu', example: '자유를 추구해요.' },
    { id: 20, word: '평등', translation: '平等', pronunciation: 'pyeongdeung', example: '평등한 기회예요.' },
    { id: 21, word: '정의', translation: '正义', pronunciation: 'jeongui', example: '정의를 실현해요.' },
    { id: 22, word: '행복', translation: '幸福', pronunciation: 'haengbok', example: '행복을 찾아요.' },
    { id: 23, word: '가치', translation: '价值', pronunciation: 'gachi', example: '가치관이 달라요.' },
    { id: 24, word: '문화', translation: '文化', pronunciation: 'munhwa', example: '문화 차이가 있어요.' },
    { id: 25, word: '전통', translation: '传统', pronunciation: 'jeontong', example: '전통을 지켜요.' },
    { id: 26, word: '사회', translation: '社会', pronunciation: 'sahoe', example: '사회 문제예요.' },
    // 文学表达
    { id: 27, word: '문학', translation: '文学', pronunciation: 'munhak', example: '한국 문학을 좋아해요.' },
    { id: 28, word: '시', translation: '诗歌', pronunciation: 'si', example: '시를 썼어요.' },
    { id: 29, word: '소설', translation: '小说', pronunciation: 'soseol', example: '소설을 읽었어요.' },
    { id: 30, word: '작가', translation: '作家', pronunciation: 'jakka', example: '작가가 되고 싶어요.' },
    { id: 31, word: '표현', translation: '表达', pronunciation: 'pyohyeon', example: '표현이 아름다워요.' },
    { id: 32, word: '비유', translation: '比喻', pronunciation: 'biyu', example: '비유를 사용했어요.' },
    { id: 33, word: '상징', translation: '象征', pronunciation: 'sangjing', example: '상징적인 의미예요.' },
    // 高级形容词
    { id: 34, word: '정교하다', translation: '精巧', pronunciation: 'jeonggyohada', example: '정교한 디자인이에요.' },
    { id: 35, word: '섬세하다', translation: '细腻', pronunciation: 'seomsehada', example: '섬세한 표현이에요.' },
    { id: 36, word: '독창적이다', translation: '独创', pronunciation: 'dokchangjeokida', example: '독창적인 생각이에요.' },
    { id: 37, word: '체계적이다', translation: '系统', pronunciation: 'chegyejeokida', example: '체계적인 접근이에요.' },
    { id: 38, word: '종합적이다', translation: '综合', pronunciation: 'jonghapjeokida', example: '종합적인 분석이에요.' },
    // 高级动词
    { id: 39, word: '논의하다', translation: '讨论', pronunciation: 'nonuihada', example: '안건을 논의해요.' },
    { id: 40, word: '검토하다', translation: '审查', pronunciation: 'geomtohada', example: '계획을 검토해요.' },
    { id: 41, word: '평가하다', translation: '评价', pronunciation: 'pyeonggahada', example: '성과를 평가해요.' },
    { id: 42, word: '비판하다', translation: '批判', pronunciation: 'bipanhada', example: '내용을 비판했어요.' },
    { id: 43, word: '주장하다', translation: '主张', pronunciation: 'jujanghada', example: '그는 무죄를 주장했어요.' },
    { id: 44, word: '증명하다', translation: '证明', pronunciation: 'jeungmyeonghada', example: '가설을 증명했어요.' },
    // 其他高级词汇
    { id: 45, word: '현상', translation: '现象', pronunciation: 'hyeonsang', example: '이런 현상이 일어나요.' },
    { id: 46, word: '과정', translation: '过程', pronunciation: 'gwajeong', example: '학습 과정이에요.' },
    { id: 47, word: '결과', translation: '结果', pronunciation: 'gyeolgwa', example: '결과가 나왔어요.' },
    { id: 48, word: '영향', translation: '影响', pronunciation: 'yeonghyang', example: '큰 영향을 미쳐요.' },
    { id: 49, word: '관점', translation: '观点', pronunciation: 'gwanjeom', example: '다른 관점이에요.' },
    { id: 50, word: '해결책', translation: '解决方案', pronunciation: 'haegyeolchaek', example: '해결책을 제시했어요.' },
  ],
};

const mockGrammar: Record<string, any[]> = {
  en_beginner: [
    { id: 1, question: '选择正确的句子：', options: '["She go to school.", "She goes to school.", "She going to school.", "She is go to school."]', correct_answer: 1, explanation: '第三人称单数现在时，动词要加 s/es。"She"是第三人称单数，所以"go"变成"goes"。' },
    { id: 2, question: '"I have ____ apple." 空格处填什么？', options: '["a", "an", "the", "不填"]', correct_answer: 1, explanation: '不定冠词"a/an"用于泛指单数名词。apple以元音音素开头，所以用"an"。' },
    { id: 3, question: '问句 "____ you happy?" 空格处填什么？', options: '["Do", "Are", "Is", "Have"]', correct_answer: 1, explanation: '形容词happy前用be动词。"you"对应的be动词是"are"。' },
    { id: 4, question: '"This is ____ book." 空格处填什么？', options: '["my", "mine", "I", "me"]', correct_answer: 0, explanation: '形容词性物主代词"my"修饰名词book。"mine"是名词性物主代词，不能直接修饰名词。' },
    { id: 5, question: '选择正确的复数形式：', options: '["childs", "children", "childes", "child"]', correct_answer: 1, explanation: '"child"的复数是不规则变化"children"，不是规则的加"s"或"es"。' },
    { id: 6, question: '"He ____ a student." 空格处填什么？', options: '["is", "are", "am", "be"]', correct_answer: 0, explanation: '第三人称单数"He"对应的be动词是"is"。' },
    { id: 7, question: '"There ____ a cat under the table." 空格处填什么？', options: '["is", "are", "has", "have"]', correct_answer: 0, explanation: 'There be句型中，"a cat"是单数，所以用"is"。' },
    { id: 8, question: '"I ____ get up early every day." 空格处填什么？', options: '["don\'t", "doesn\'t", "am not", "not"]', correct_answer: 0, explanation: '第一人称"I"的否定句用"don\'t"加动词原形。注意"doesn\'t"用于第三人称单数。' },
    { id: 9, question: '"What ____ this?" 空格处填什么？', options: '["is", "are", "does", "do"]', correct_answer: 0, explanation: '特殊疑问句中，"this"是单数，be动词用"is"。' },
    { id: 10, question: '"She can ____ English." 空格处填什么？', options: '["speaks", "speaking", "speak", "to speak"]', correct_answer: 2, explanation: '情态动词"can"后面接动词原形，不加"s"或"ing"。' },
    { id: 11, question: '"How ____ apples do you have?" 空格处填什么？', options: '["many", "much", "any", "some"]', correct_answer: 0, explanation: '"apples"是可数名词复数，用"how many"询问数量。不可数名词用"how much"。' },
    { id: 12, question: '"I like ____ basketball." 空格处填什么？', options: '["play", "plays", "playing", "to playing"]', correct_answer: 2, explanation: '"like"后面可以接动名词"playing"表示习惯性的喜欢。也可以接不定式"to play"。' },
    { id: 13, question: '"____ is your father? He is a doctor." 空格处填什么？', options: '["What", "Who", "How", "Where"]', correct_answer: 0, explanation: '询问职业用"What"。回答"He is a doctor"说明是职业。' },
    { id: 14, question: '"The book is ____ the desk." 空格处填什么？', options: '["in", "on", "at", "under"]', correct_answer: 1, explanation: '书通常放在桌子表面，用介词"on"。表示在上面。' },
    { id: 15, question: '"It\'s time ____ lunch." 空格处填什么？', options: '["for", "to", "at", "in"]', correct_answer: 0, explanation: '"It\'s time for + 名词"表示"是...的时间了"。如果接动词，用"It\'s time to + 动词原形"。' },
  ],
  en_intermediate: [
    { id: 1, question: '"She ____ to the cinema yesterday." 空格处填什么？', options: '["go", "goes", "went", "going"]', correct_answer: 2, explanation: '"yesterday"表示过去时间，用一般过去时，"go"的过去式是"went"。' },
    { id: 2, question: '"I have ____ this movie three times." 空格处填什么？', options: '["see", "saw", "seen", "seeing"]', correct_answer: 2, explanation: '现在完成时"have/has + 过去分词"，"see"的过去分词是"seen"。' },
    { id: 3, question: '"This book is ____ than that one." 空格处填什么？', options: '["interesting", "more interesting", "most interesting", "interestinger"]', correct_answer: 1, explanation: '比较级用"more + 多音节形容词"。interesting是多音节词，不能加"er"。' },
    { id: 4, question: '"The letter ____ by her yesterday." 空格处填什么？', options: '["writes", "wrote", "was written", "is written"]', correct_answer: 2, explanation: '被动语态结构是"be + 过去分词"。过去时被动语态用"was/were + 过去分词"。' },
    { id: 5, question: '"I will ____ you tomorrow." 空格处填什么？', options: '["call", "calls", "called", "calling"]', correct_answer: 0, explanation: '一般将来时"will + 动词原形"，不加"s"或其他变化。' },
    { id: 6, question: '"If it rains, we ____ stay at home." 空格处填什么？', options: '["will", "would", "shall", "should"]', correct_answer: 0, explanation: '真实条件句（可能发生的事）用"if + 一般现在时，主句 + will + 动词原形"。' },
    { id: 7, question: '"She asked me ____ I liked the movie." 空格处填什么？', options: '["that", "if", "what", "which"]', correct_answer: 1, explanation: '间接引语中，直接引语是疑问句时，用"if/whether"（是否）引导宾语从句。' },
    { id: 8, question: '"The ____ you practice, the better you become." 空格处填什么？', options: '["much", "more", "most", "many"]', correct_answer: 1, explanation: '"the more..., the more..."结构表示"越...，就越..."。' },
    { id: 9, question: '"I have been studying English ____ three years." 空格处填什么？', options: '["since", "for", "from", "in"]', correct_answer: 1, explanation: '"for + 时间段"表示持续了多久。表示时间的长度用"for"，具体时间点用"since"。' },
    { id: 10, question: '"Neither Tom ____ Jack likes football." 空格处填什么？', options: '["or", "and", "nor", "but"]', correct_answer: 2, explanation: '"neither...nor..."是固定搭配，表示"既不...也不..."。' },
    { id: 11, question: '"I wish I ____ speak French." 空格处填什么？', options: '["can", "could", "will", "would"]', correct_answer: 1, explanation: '"wish"后的虚拟语气，表示与现实相反的愿望，用过去式"could"。' },
    { id: 12, question: '"The movie was ____ interesting ____ I watched it twice." 空格处填什么？', options: '["so...that", "such...that", "too...to", "very...that"]', correct_answer: 0, explanation: '"so + 形容词/副词 + that..."表示"如此...以至于..."。"such"修饰名词。' },
    { id: 13, question: '"____ did you arrive? I arrived at 5 o\'clock." 空格处填什么？', options: '["What", "When", "Where", "Why"]', correct_answer: 1, explanation: '回答"at 5 o\'clock"表示时间，所以问句用"When"询问时间。' },
    { id: 14, question: '"I prefer reading ____ watching TV." 空格处填什么？', options: '["than", "to", "over", "instead"]', correct_answer: 1, explanation: '"prefer A to B"是固定搭配，表示"更喜欢A而不是B"，注意用"to"而不是"than"。' },
    { id: 15, question: '"She ____ be at home, but I\'m not sure." 空格处填什么？', options: '["must", "can", "might", "will"]', correct_answer: 2, explanation: '"might"表示可能性较小的推测，意为"可能、也许"。"must"表示肯定推测。' },
  ],
  en_advanced: [
    { id: 1, question: '"If I had known the truth, I ____ you." 空格处填什么？', options: '["would tell", "would have told", "will tell", "had told"]', correct_answer: 1, explanation: '过去虚拟语气：与过去事实相反，主句用"would have + 过去分词"。从句用"If + had + 过去分词"。' },
    { id: 2, question: '"It is important that everyone ____ present at the meeting." 空格处填什么？', options: '["is", "be", "are", "was"]', correct_answer: 1, explanation: '虚拟语气在"It is + 形容词 + that从句"结构中，从句谓语用"(should) + 动词原形"，should可省略。' },
    { id: 3, question: '"Had he studied harder, he ____ the exam." 空格处填什么？', options: '["would pass", "would have passed", "will pass", "had passed"]', correct_answer: 1, explanation: '过去虚拟语气的倒装形式：省略if，将had提前。主句用"would have + 过去分词"。' },
    { id: 4, question: '"The project ____ by the time we arrived." 空格处填什么？', options: '["was completed", "has been completed", "had been completed", "is completed"]', correct_answer: 2, explanation: '"by the time + 过去时"主句用过去完成时，表示在某个过去时间点之前已经完成的动作。' },
    { id: 5, question: '"Not only ____ she speak English, but also French." 空格处填什么？', options: '["does", "is", "she does", "does she"]', correct_answer: 3, explanation: '"not only...but also..."放在句首时，前半部分需要倒装。助动词"does"放在主语"she"之前。' },
    { id: 6, question: '"I suggest that he ____ more carefully." 空格处填什么？', options: '["drives", "drive", "driven", "to drive"]', correct_answer: 1, explanation: 'suggest, recommend, advise等动词后的宾语从句用虚拟语气，谓语用"(should) + 动词原形"。' },
    { id: 7, question: '"____ the weather were fine, we would go hiking." 空格处填什么？', options: '["If", "Were", "Had", "Should"]', correct_answer: 1, explanation: '虚拟条件句的倒装形式：省略if，将were/had/should提前。"Were the weather fine" = "If the weather were fine"。' },
    { id: 8, question: '"The book ____ next month is about climate change." 空格处填什么？', options: '["publishing", "published", "to be published", "being published"]', correct_answer: 2, explanation: '"to be published"表示将来被动，意为"即将被出版的"。不定式作定语表示将来。' },
    { id: 9, question: '"He denied ____ the document." 空格处填什么？', options: '["to steal", "stealing", "having stolen", "to have stolen"]', correct_answer: 2, explanation: 'deny后接动名词，表示否认做过的事。用"having + 过去分词"强调动作已完成。' },
    { id: 10, question: '"Whatever ____ , I will support you." 空格处填什么？', options: '["happens", "happen", "will happen", "happened"]', correct_answer: 0, explanation: '"whatever"引导让步状语从句，从句用一般现在时表示将来可能发生的事。' },
    { id: 11, question: '"____ seems that there has been a mistake." 空格处填什么？', options: '["It", "That", "What", "There"]', correct_answer: 0, explanation: '"It seems that..."是固定句型，it是形式主语，真正的主语是后面的that从句。' },
    { id: 12, question: '"Having finished the work, ____ ." 选择正确的句子补全：', options: '["he went home", "home he went", "he home went", "went he home"]', correct_answer: 0, explanation: '分词短语作状语，主句主语必须与分词逻辑主语一致，用正常语序。' },
    { id: 13, question: '"I regret ____ you that your application was rejected." 空格处填什么？', options: '["to tell", "telling", "having told", "to have told"]', correct_answer: 0, explanation: 'regret to do表示"遗憾地要做..."（对将要做的事表示遗憾）。regret doing表示"后悔做过..."。' },
    { id: 14, question: '"Little ____ that the problem was so complex." 空格处填什么？', options: '["he knew", "did he know", "he did know", "does he know"]', correct_answer: 1, explanation: '"little"放在句首表示否定意义，句子需要部分倒装，助动词"did"放在主语前。' },
    { id: 15, question: '"Were it not for your help, we ____ failed." 空格处填什么？', options: '["would have", "would", "will have", "had"]', correct_answer: 0, explanation: '"Were it not for..."是虚拟语气的倒装形式，等于"If it were not for..."。与现在事实相反用"would + 动词原形"。' },
  ],
  ja_beginner: [
    // 助词用法
    { id: 1, question: '"私は学生___です。" 空格处填什么？', options: '["を", "が", "は", "に"]', correct_answer: 2, explanation: 'は是提示主题的助词，用于强调主语。' },
    { id: 2, question: '"りんご___食べます。" 空格处填什么？', options: '["を", "が", "は", "で"]', correct_answer: 0, explanation: 'を是宾格助词，接在他动词的宾语后面。' },
    { id: 3, question: '"学校___行きます。" 空格处填什么？', options: '["を", "が", "に", "で"]', correct_answer: 2, explanation: 'に表示动作的目的地，"去学校"。' },
    { id: 4, question: '"猫___います。" 空格处填什么？', options: '["を", "が", "は", "に"]', correct_answer: 1, explanation: '存在句中，存在的主体用が提示。' },
    { id: 5, question: '"日本語___勉強します。" 空格处填什么？', options: '["を", "が", "は", "で"]', correct_answer: 0, explanation: 'を是宾格助词，表示学习的对象。' },
    { id: 6, question: '"家___帰ります。" 空格处填什么？', options: '["を", "が", "に", "で"]', correct_answer: 2, explanation: 'に表示回归的目的地。' },
    { id: 7, question: '"何___食べますか？" 空格处填什么？', options: '["を", "が", "は", "に"]', correct_answer: 0, explanation: '疑问句中的宾语也用を提示。' },
    { id: 8, question: '"銀行___あります。" 空格处填什么？', options: '["を", "が", "は", "に"]', correct_answer: 1, explanation: '存在句中表示存在的主体用が。' },
    { id: 9, question: '"図書館___本を読みます。" 空格处填什么？', options: '["を", "が", "は", "で"]', correct_answer: 3, explanation: 'で表示动作发生的场所。' },
    { id: 10, question: '"バス___行きます。" 空格处填什么？', options: '["を", "が", "に", "で"]', correct_answer: 3, explanation: 'で表示交通工具，"坐公交车去"。' },
    // 基本句型
    { id: 11, question: '"これは___本です。" 空格处填什么？', options: '["新しい", "新しく", "新しさ", "新しくて"]', correct_answer: 0, explanation: '形容词修饰名词时直接连接，用原形。' },
    { id: 12, question: '"この本は___。" 空格处填什么？', options: '["おもしろいです", "おもしろい", "おもしろく", "おもしろさ"]', correct_answer: 0, explanation: '句尾需要接です构成礼貌句型。' },
    { id: 13, question: '"彼は___人です。" 空格处填什么？', options: '["親切な", "親切", "親切に", "親切さ"]', correct_answer: 0, explanation: 'な形容词修饰名词时加な。' },
    { id: 14, question: '"今日は___。" 空格处填什么？', options: '["暑いです", "暑い", "暑く", "暑さ"]', correct_answer: 0, explanation: 'い形容词句尾需要接です。' },
    { id: 15, question: '"昨日、映画を___。" 空格处填什么？', options: '["見ます", "見ました", "見て", "見ろ"]', correct_answer: 1, explanation: '昨日是过去的时间，动词用过去式ました。' },
  ],
  ja_intermediate: [
    // 动词て形
    { id: 1, question: '"食___、飲___" 正确的变形是？', options: '["食べて、飲んで", "食べて、飲みて", "食べて、飲んで", "食べで、飲んで"]', correct_answer: 0, explanation: '食べる→食べて（い段→え段+て），飲む→飲んで（む→んで）' },
    { id: 2, question: '"行___" 正确的て形是？', options: '["行って", "行いて", "行んで", "行て"]', correct_answer: 0, explanation: '行く→行って，特例变形。' },
    { id: 3, question: '"買___、待___" 正确的变形是？', options: '["買って、待って", "買いて、待いて", "買んで、待んで", "買いて、待って"]', correct_answer: 0, explanation: '買う→買って（う→って），待つ→待って（つ→って）' },
    { id: 4, question: '"毎朝、新聞を___、コーヒーを飲みます。" 空格处填什么？', options: '["読み", "読んで", "読む", "読みて"]', correct_answer: 1, explanation: 'て形表示动作的先后顺序。' },
    { id: 5, question: '"家に___、すぐ寝ます。" 空格处填什么？', options: '["帰り", "帰って", "帰る", "帰りて"]', correct_answer: 1, explanation: 'て形连接两个先后发生的动作。' },
    // 动词た形
    { id: 6, question: '"昨日、友達に___。" 正确的た形是？', options: '["会いました", "会て", "会った", "会いました"]', correct_answer: 0, explanation: '会う→会いました（过去礼貌体）。' },
    { id: 7, question: '"去年、日本___旅行しました。" 空格处填什么？', options: '["に", "で", "を", "が"]', correct_answer: 0, explanation: 'に表示时间点或目的地。' },
    { id: 8, question: '"本を___、勉強しました。" 空格处填什么？', options: '["買って", "買いた", "買い", "買う"]', correct_answer: 0, explanation: 'て形表示先后动作，买书后学习。' },
    // 比较句
    { id: 9, question: '"日本語は英語___難しいです。" 空格处填什么？', options: '["より", "が", "は", "を"]', correct_answer: 0, explanation: 'より表示比较，"日语比英语难"。' },
    { id: 10, question: '"中国___日本___大きいです。" 正确的填空是？', options: '["より、が", "は、より", "が、より", "は、が"]', correct_answer: 1, explanation: '中国は日本より大きいです（中国比日本大）。' },
    { id: 11, question: '"一番好きな食べ物___何ですか？" 空格处填什么？', options: '["は", "が", "を", "に"]', correct_answer: 0, explanation: '一番表示最高级，主题用は提示。' },
    // 可能态
    { id: 12, question: '"日本語が___。" 正确的可能态是？', options: '["話せます", "話します", "話れる", "話される"]', correct_answer: 0, explanation: '話す→話せる（可能态：能说）。' },
    { id: 13, question: '"ここで写真___撮れますか？" 空格处填什么？', options: '["を", "が", "は", "に"]', correct_answer: 1, explanation: '可能态中，能力的对象用が提示。' },
    { id: 14, question: '"泳げますか？" 的意思是？', options: '["游泳吗？", "能游泳吗？", "游了泳吗？", "想游泳吗？"]', correct_answer: 1, explanation: '泳げる是泳ぐ的可能态，表示"能游泳"。' },
    { id: 15, question: '"この店で日本料理が___。" 空格处填什么？', options: '["食べられます", "食べます", "食べれる", "食べさせる"]', correct_answer: 0, explanation: '食べる→食べられる（可能态）。' },
  ],
  ja_advanced: [
    // 被动句
    { id: 1, question: '"先生に___。" 正确的被动句是？', options: '["褒められた", "褒めた", "褒めさせる", "褒めれる"]', correct_answer: 0, explanation: '褒める→褒められる（被动：被表扬）。' },
    { id: 2, question: '"友達に秘密___。" 正确的表达是？', options: '["を話された", "が話された", "を話させた", "が話させた"]', correct_answer: 0, explanation: '被动句中动作的对象用を，表示"秘密被朋友说了"。' },
    { id: 3, question: '"雨___降られて、困りました。" 空格处填什么？', options: '["に", "を", "が", "で"]', correct_answer: 0, explanation: '被动句中表示被动主体（遭受者）用に。' },
    // 使役句
    { id: 4, question: '"子供___勉強させます。" 空格处填什么？', options: '["に", "を", "が", "で"]', correct_answer: 0, explanation: '使役句中被使役者用に提示。' },
    { id: 5, question: '"部下___報告書を書かせました。" 空格处填什么？', options: '["に", "を", "が", "で"]', correct_answer: 0, explanation: '让下属写报告，使役对象用に。' },
    { id: 6, question: '"学生___発表させます。" 正确的表达是？', options: '["に", "を", "が", "で"]', correct_answer: 0, explanation: '让学生发表，使役对象用に。' },
    // 被动使役
    { id: 7, question: '"子供の時、母___部屋を掃除させられた。" 空格处填什么？', options: '["に", "を", "が", "で"]', correct_answer: 0, explanation: '被动使役句中，强制者用に提示。' },
    { id: 8, question: '"先生___長く待たせられた。" 的意思是？', options: '["让老师久等", "被老师让久等了", "老师久等了", "被老师久等"]', correct_answer: 1, explanation: '被动使役：被迫做某事，"被老师让久等了"。' },
    // 敬语
    { id: 9, question: '"田中先生は___。" 正确的尊敬语是？', options: '["いらっしゃいます", "います", "おります", "あります"]', correct_answer: 0, explanation: 'いる→いらっしゃる（尊敬语）。' },
    { id: 10, question: '"先生、何を___か？" 正确的敬语是？', options: '["召し上がります", "食べます", "お食べになります", "食べられる"]', correct_answer: 0, explanation: '食べる→召し上がる（尊敬语）。' },
    { id: 11, question: '"私は___。" 正确的谦逊语是？', options: '["参ります", "行きます", "お行きします", "行かれます"]', correct_answer: 0, explanation: '行く→参る（谦逊语）。' },
    { id: 12, question: '"先生に___。" 正确的谦逊语是？', options: '["お目にかかりました", "会いました", "お会いしました", "会われました"]', correct_answer: 0, explanation: '会う→お目にかかる（谦逊语）。' },
    // 复杂句型
    { id: 13, question: '"雨が降っている___、外出しました。" 空格处填什么？', options: '["のに", "ので", "から", "ため"]', correct_answer: 0, explanation: 'のに表示逆接，"虽然下雨但还是出去了"。' },
    { id: 14, question: '"勉強した___、試験に合格しました。" 空格处填什么？', options: '["ので", "のに", "から", "ため"]', correct_answer: 0, explanation: 'ので表示因果关系，"因为学习了所以通过了考试"。' },
    { id: 15, question: '"日本___行くなら、東京___行きたいです。" 正确的填空是？', options: '["に、に", "に、を", "を、に", "で、に"]', correct_answer: 0, explanation: 'に行く表示目的地，表示假设条件下的愿望。' },
  ],
  ko_beginner: [
    // 主题助词 은/는
    { id: 1, question: '"저는 학생___입니다." 空格处填什么？', options: '["을", "이", "은", "가"]', correct_answer: 2, explanation: '은/는是主题助词，학생有收音（尾音），用은。' },
    { id: 2, question: '"이것은 책___입니다." 空格处填什么？', options: '["이", "가", "은", "를"]', correct_answer: 0, explanation: '이/가是主格助词，책没有收音，用이。这里表示"这是书"的强调。' },
    { id: 3, question: '"그분은 선생님___입니다." 空格处填什么？', options: '["이", "은", "를", "가"]', correct_answer: 1, explanation: '은/는是主题助词，선생님有收音，用은。' },
    // 主格助词 이/가
    { id: 4, question: '"고양이___있어요." 空格处填什么？', options: '["을", "이", "은", "에"]', correct_answer: 1, explanation: '있다/없다前面表示存在的主语用이/가，고양이有收音，用이。' },
    { id: 5, question: '"누___왔어요?" 空格处填什么？', options: '["가", "는", "을", "에게"]', correct_answer: 0, explanation: '疑问词누구、언제、어디等做主语时用가。' },
    // 宾格助词 을/를
    { id: 6, question: '"사과___먹어요." 空格处填什么？', options: '["을", "이", "은", "에서"]', correct_answer: 0, explanation: '을/를是宾格助词，사과有收音，用을。' },
    { id: 7, question: '"물___마셔요." 空格处填什么？', options: '["을", "는", "를", "가"]', correct_answer: 2, explanation: '을/를是宾格助词，물没有收音，用를。' },
    { id: 8, question: '"책을___." 选择正确的动词形式？', options: '["읽어요", "읽이요", "읽으요", "읽아요"]', correct_answer: 0, explanation: '읽다的基本阶是읽어요，表示"读书"。' },
    // 助词 에/에서
    { id: 9, question: '"학교___가요." 空格处填什么？', options: '["에", "이", "은", "을"]', correct_answer: 0, explanation: '에表示方向/目的地，"去学校"。' },
    { id: 10, question: '"집___있어요." 空格处填什么？', options: '["에서", "에", "은", "이"]', correct_answer: 1, explanation: '에表示存在的地点，"在家"。' },
    { id: 11, question: '"도서관___공부해요." 空格处填什么？', options: '["에", "에서", "을", "는"]', correct_answer: 1, explanation: '에서表示动作发生的地点，"在图书馆学习"。' },
    // 时态
    { id: 12, question: '"어제 영화를___." 空格处填什么？', options: '["봐요", "봤어요", "보고", "보자"]', correct_answer: 1, explanation: '어제是昨天，表示过去，用过去式 봤어요。' },
    { id: 13, question: '"내일 친구를___." 空格处填什么？', options: '["만났어요", "만나요", "만났어", "만날 거예요"]', correct_answer: 3, explanation: '내일是明天，表示将来，用将来时 만날 거예요。' },
    // 基本句型
    { id: 14, question: '"이것은 무엇___?" 空格处填什么？', options: '["입니다", "이에요", "예요", "이에요/예요"]', correct_answer: 1, explanation: '무엇이에요?是"这是什么？"的标准问法。이에요用于有收音的名词后。' },
    { id: 15, question: '"저는 한국사람___." 空格处填什么？', options: '["입니다", "예요", "이에요", "이야"]', correct_answer: 0, explanation: '입니다是正式敬语形式，사람有收音，用입니다。' },
  ],
  ko_intermediate: [
    // 时态表达
    { id: 1, question: '"방금 밥을___." 空格处填什么？', options: '["먹었어요", "먹어요", "먹을 거예요", "먹고 있어요"]', correct_answer: 0, explanation: '방금表示"刚刚"，用过去时먹었어요。' },
    { id: 2, question: '"지금 뭐___?" 空格处填什么？', options: '["하고 있어요", "했어요", "할 거예요", "해요"]', correct_answer: 0, explanation: '지금表示"现在"，进行时用-고 있어요形式。' },
    { id: 3, question: '"다음 주에 제주도에___." 空格处填什么？', options: '["갔어요", "가요", "갈 거예요", "가고 있어요"]', correct_answer: 2, explanation: '다음 주에表示"下周"，将来时用-ㄹ/을 거예요。' },
    // 比较句
    { id: 4, question: '"사과___배가 더 비싸요." 空格处填什么？', options: '["보다", "부터", "까지", "처럼"]', correct_answer: 0, explanation: '보다表示比较，"梨比苹果更贵"。' },
    { id: 5, question: '"서울___부산이 커요." 空格处填什么？', options: '["보다", "만큼", "처럼", "부터"]', correct_answer: 0, explanation: '부산이 서울보다 커요是正确语序，釜山比首尔大。' },
    // 敬语基础
    { id: 6, question: '"선생님, 어디___?" 对长辈问去哪里，填什么？', options: '["가세요?", "가요?", "가?", "가니?"]', correct_answer: 0, explanation: '对长辈用敬语-시-形式，가시다的疑问形가세요?。' },
    { id: 7, question: '"아버지가 회사에___." 表示父亲去公司，填什么？', options: '["가셨어요", "갔어요", "가요", "가"]', correct_answer: 0, explanation: '对长辈的动作要用敬语-시-，가시다的过去式가셨어요。' },
    { id: 8, question: '"이것은 할아버지___책이에요." 空格处填什么？', options: '["의", "에", "에서", "에게"]', correct_answer: 0, explanation: '의表示所属关系，"爷爷的书"。' },
    // 连接词尾
    { id: 9, question: '"밥을 먹___학교에 가요." 空格处填什么？', options: '["고", "어서", "으면", "지만"]', correct_answer: 0, explanation: '-고表示动作的先后顺序，"吃完饭去学校"。' },
    { id: 10, question: '"피곤___쉬지 마세요." 空格处填什么？', options: '["해도", "해서", "해서는", "하니까"]', correct_answer: 0, explanation: '-아도/어도表示让步，"即使累也不要休息"。' },
    // 能力/可能表达
    { id: 11, question: '"한국어를___." 表示会说韩语，填什么？', options: '["할 수 있어요", "해요", "할 거예요", "하고 있어요"]', correct_answer: 0, explanation: '-을/를 할 수 있다表示"能够做某事"。' },
    { id: 12, question: '"여기서 사진을___." 表示不能拍照，填什么？', options: '["찍을 수 있어요", "찍을 수 없어요", "찍어요", "찍었어요"]', correct_answer: 1, explanation: '-을/를 할 수 없다表示"不能做某事"。' },
    // 原因表达
    { id: 13, question: '"비가 와서___." 表示因为下雨，填什么？', options: '["안 갔어요", "갔어요", "가요", "갈 거예요"]', correct_answer: 0, explanation: '-아서/어서表示原因，"因为下雨所以没去"。' },
    { id: 14, question: '"배가 아파서 병원에___." 空格处填什么？', options: '["갔어요", "가요", "갈 거예요", "가"]', correct_answer: 0, explanation: '-아서/어서表示原因，"因为肚子疼去了医院"，用过去时。' },
    // 提议/建议
    { id: 15, question: '"같이___." 表示一起做什么吧，填什么？', options: '["가요", "가", "갈까요?", "갑시다"]', correct_answer: 3, explanation: '-ㅂ시다表示提议，"一起去吧"。' },
  ],
  ko_advanced: [
    // 复杂句型
    { id: 1, question: '"아무리 바빠도___." 空格处填什么？', options: '["운동해야 해요", "운동할 거예요", "운동했어요", "운동하고 있어요"]', correct_answer: 0, explanation: '아무리 -아도/어도 -아야/어야 한다表示"无论...也必须..."。' },
    { id: 2, question: '"늦었다고 생각___." 空格处填什么？', options: '["했어요", "했네요", "하네요", "한다고요"]', correct_answer: 0, explanation: '-다고 생각하다表示"认为..."，过去时是했다고 생각했어요。' },
    { id: 3, question: '"그분이 오신 것___." 空格处填什么？', options: '["같아요", "같네요", "같습니다", "같구요"]', correct_answer: 0, explanation: '-ㄴ/은 것 같다表示推测，"好像那位来了"。' },
    // 高级敬语
    { id: 4, question: '"선생님, 식사___?" 对长辈问用餐，填什么？', options: '["하셨어요?", "했어요?", "하세요?", "하셨나요?"]', correct_answer: 0, explanation: '对长辈的敬语-시-形式，过去疑问用-셨어요?。' },
    { id: 5, question: '"사장님께서___." 表示社长说，填什么？', options: '["말씀하셨어요", "말했어요", "말씀해요", "말해요"]', correct_answer: 0, explanation: '말씀하시다是말하다的敬语形式，社长要用敬语。' },
    { id: 6, question: '"어머니께서 저를___." 表示母亲叫我，填什么？', options: '["부르셨어요", "불렀어요", "부르세요", "불러요"]', correct_answer: 0, explanation: '对长辈动作用-시-，부르다的过去敬语是부르셨어요。' },
    // 被动句
    { id: 7, question: '"문이___." 表示门被打开，填什么？', options: '["열렸어요", "열었어요", "열어요", "열 거예요"]', correct_answer: 0, explanation: '열리다是열다的被动形式，"门被打开了"。' },
    { id: 8, question: '"음식이___." 表示食物被吃，填什么？', options: '["먹혔어요", "먹었어요", "먹어요", "먹혀요"]', correct_answer: 0, explanation: '먹히다是먹다的被动形式，"食物被吃了"。' },
    // 使役句
    { id: 9, question: '"학생들에게 책을___." 让学生读书，填什么？', options: '["읽혔어요", "읽었어요", "읽게 했어요", "읽어요"]', correct_answer: 2, explanation: '-게 하다表示使役，"让学生们读书"。' },
    { id: 10, question: '"아이를___." 让孩子睡觉，填什么？', options: '["재웠어요", "잤어요", "자요", "자게 했어요"]', correct_answer: 3, explanation: '자게 하다表示让某人睡觉，재우다是使役动词"哄睡"。' },
    // 间接引语
    { id: 11, question: '"그분이 간다고___." 表示他说要去，填什么？', options: '["했어요", "하셨어요", "말했어요", "하네요"]', correct_answer: 0, explanation: '-다고 하다表示间接引语，陈述句引用用-다고。' },
    { id: 12, question: '"그분이 오신다고___." 表示说他要来，填什么？', options: '["하셨어요", "했어요", "말씀하셨어요", "하네요"]', correct_answer: 2, explanation: '말씀하시다是말하다的敬语形式，对长辈用敬语。' },
    // 条件表达
    { id: 13, question: '"시간이 있으면___." 如果有时间的话，填什么？', options: '["가요", "갈 거예요", "갔어요", "가고 있어요"]', correct_answer: 1, explanation: '-으면表示条件，"如果有时间的话会去"。' },
    { id: 14, question: '"돈을 모으면___." 如果存钱的话，填什么？', options: '["집을 살 수 있어요", "집을 샀어요", "집을 사요", "집을 살 거예요"]', correct_answer: 0, explanation: '-으면表示条件，-(으)ㄹ 수 있다表示可能性。' },
    // 礼貌表达
    { id: 15, question: '"좀___." 请求对方帮忙，填什么？', options: '["도와주세요", "도와요", "도울게요", "도왔어요"]', correct_answer: 0, explanation: '-아/어 주세요表示请求，"请帮帮忙"。' },
  ],
};

const mockSpeaking: Record<string, any[]> = {
  en_beginner: [
    { id: 1, sentence: 'Hello, nice to meet you!', translation: '你好，很高兴认识你！', difficulty: 1 },
    { id: 2, sentence: 'How are you today?', translation: '你今天怎么样？', difficulty: 1 },
    { id: 3, sentence: 'I am fine, thank you.', translation: '我很好，谢谢。', difficulty: 1 },
    { id: 4, sentence: 'What is your name?', translation: '你叫什么名字？', difficulty: 1 },
    { id: 5, sentence: 'My name is Tom.', translation: '我叫汤姆。', difficulty: 1 },
    { id: 6, sentence: 'Where are you from?', translation: '你来自哪里？', difficulty: 1 },
    { id: 7, sentence: 'I am from China.', translation: '我来自中国。', difficulty: 1 },
    { id: 8, sentence: 'Good morning!', translation: '早上好！', difficulty: 1 },
    { id: 9, sentence: 'Good afternoon!', translation: '下午好！', difficulty: 1 },
    { id: 10, sentence: 'Good evening!', translation: '晚上好！', difficulty: 1 },
    { id: 11, sentence: 'Goodbye, see you tomorrow.', translation: '再见，明天见。', difficulty: 1 },
    { id: 12, sentence: 'Thank you very much.', translation: '非常感谢。', difficulty: 1 },
    { id: 13, sentence: 'Excuse me, can you help me?', translation: '打扰一下，你能帮我吗？', difficulty: 1 },
    { id: 14, sentence: 'I am sorry.', translation: '对不起。', difficulty: 1 },
    { id: 15, sentence: 'What time is it?', translation: '现在几点了？', difficulty: 1 },
    { id: 16, sentence: 'I love this food.', translation: '我喜欢这个食物。', difficulty: 1 },
    { id: 17, sentence: 'How old are you?', translation: '你几岁了？', difficulty: 1 },
    { id: 18, sentence: 'I am ten years old.', translation: '我十岁了。', difficulty: 1 },
    { id: 19, sentence: 'Do you like animals?', translation: '你喜欢动物吗？', difficulty: 1 },
    { id: 20, sentence: 'Yes, I like dogs.', translation: '是的，我喜欢狗。', difficulty: 1 },
  ],
  en_intermediate: [
    { id: 1, sentence: 'Could you please show me the way to the station?', translation: '请问能告诉我去车站的路吗？', difficulty: 2 },
    { id: 2, sentence: 'I would like to book a room for two nights.', translation: '我想预订一个房间住两晚。', difficulty: 2 },
    { id: 3, sentence: 'What do you recommend for dinner?', translation: '晚餐你推荐什么？', difficulty: 2 },
    { id: 4, sentence: 'I am looking for a gift for my friend.', translation: '我在找送给朋友的礼物。', difficulty: 2 },
    { id: 5, sentence: 'Can I pay by credit card?', translation: '可以用信用卡支付吗？', difficulty: 2 },
    { id: 6, sentence: 'I have an appointment at 3 o\'clock.', translation: '我三点钟有个约会。', difficulty: 2 },
    { id: 7, sentence: 'What is your opinion on this matter?', translation: '你对这件事有什么看法？', difficulty: 2 },
    { id: 8, sentence: 'I think we should discuss this further.', translation: '我认为我们应该进一步讨论这件事。', difficulty: 2 },
    { id: 9, sentence: 'How long have you been working here?', translation: '你在这里工作多久了？', difficulty: 2 },
    { id: 10, sentence: 'I am interested in learning more about your culture.', translation: '我对了解更多关于你们的文化很感兴趣。', difficulty: 2 },
    { id: 11, sentence: 'Would you mind opening the window?', translation: '介意把窗户打开吗？', difficulty: 2 },
    { id: 12, sentence: 'I am feeling a bit tired today.', translation: '我今天感觉有点累。', difficulty: 2 },
    { id: 13, sentence: 'What are your plans for the weekend?', translation: '你周末有什么计划？', difficulty: 2 },
    { id: 14, sentence: 'I am planning to visit my parents.', translation: '我计划去看望我的父母。', difficulty: 2 },
    { id: 15, sentence: 'Can you speak a little slower?', translation: '能说慢一点吗？', difficulty: 2 },
    { id: 16, sentence: 'I apologize for the delay.', translation: '我为延误道歉。', difficulty: 2 },
    { id: 17, sentence: 'The weather has been great lately.', translation: '最近天气很好。', difficulty: 2 },
    { id: 18, sentence: 'I have been studying English for three years.', translation: '我学习英语已经三年了。', difficulty: 2 },
    { id: 19, sentence: 'What kind of music do you enjoy?', translation: '你喜欢什么类型的音乐？', difficulty: 2 },
    { id: 20, sentence: 'I enjoy listening to classical music.', translation: '我喜欢听古典音乐。', difficulty: 2 },
  ],
  en_advanced: [
    { id: 1, sentence: 'I would like to propose a strategic partnership between our companies.', translation: '我想提议我们公司之间建立战略合作伙伴关系。', difficulty: 3 },
    { id: 2, sentence: 'The current market conditions present both challenges and opportunities.', translation: '当前的市场状况既带来了挑战，也提供了机遇。', difficulty: 3 },
    { id: 3, sentence: 'We need to carefully evaluate the potential risks before making a decision.', translation: '在做决定之前，我们需要仔细评估潜在的风险。', difficulty: 3 },
    { id: 4, sentence: 'From a philosophical perspective, this raises interesting ethical questions.', translation: '从哲学角度来看，这引发了一些有趣的伦理问题。', difficulty: 3 },
    { id: 5, sentence: 'The implications of this research could be far-reaching.', translation: '这项研究的影响可能是深远的。', difficulty: 3 },
    { id: 6, sentence: 'I would argue that sustainable development requires a comprehensive approach.', translation: '我会论证可持续发展需要一个综合的方法。', difficulty: 3 },
    { id: 7, sentence: 'Let me elaborate on the key points of our proposal.', translation: '让我详细阐述我们提案的关键要点。', difficulty: 3 },
    { id: 8, sentence: 'The data suggests a significant correlation between these variables.', translation: '数据表明这些变量之间存在显著的相关性。', difficulty: 3 },
    { id: 9, sentence: 'We must consider the long-term consequences of our actions.', translation: '我们必须考虑我们行为的长期后果。', difficulty: 3 },
    { id: 10, sentence: 'I believe innovation is the driving force behind economic growth.', translation: '我相信创新是经济增长的推动力。', difficulty: 3 },
    { id: 11, sentence: 'The theoretical framework provides a solid foundation for our analysis.', translation: '这个理论框架为我们的分析提供了坚实的基础。', difficulty: 3 },
    { id: 12, sentence: 'I respectfully disagree with your interpretation of the evidence.', translation: '我恭敬地不同意你对证据的解读。', difficulty: 3 },
    { id: 13, sentence: 'This represents a paradigm shift in how we approach the problem.', translation: '这代表了我们解决问题方式的一种范式转变。', difficulty: 3 },
    { id: 14, sentence: 'The empirical evidence supports our hypothesis.', translation: '实证证据支持我们的假设。', difficulty: 3 },
    { id: 15, sentence: 'We should collaborate with stakeholders to achieve our objectives.', translation: '我们应该与利益相关者合作以实现我们的目标。', difficulty: 3 },
    { id: 16, sentence: 'It is imperative that we address this issue promptly.', translation: '我们必须立即解决这个问题。', difficulty: 3 },
    { id: 17, sentence: 'The conference will provide a platform for intellectual exchange.', translation: '会议将为学术交流提供一个平台。', difficulty: 3 },
    { id: 18, sentence: 'I would advocate for a more pragmatic approach to policy-making.', translation: '我会提倡一种更务实的政策制定方式。', difficulty: 3 },
    { id: 19, sentence: 'The controversy highlights the complexity of modern governance.', translation: '这场争议凸显了现代治理的复杂性。', difficulty: 3 },
    { id: 20, sentence: 'Let us examine the historical context of this phenomenon.', translation: '让我们来审视这一现象的历史背景。', difficulty: 3 },
  ],
  ja_beginner: [
    // 日常问候
    { id: 1, sentence: 'こんにちは、はじめまして！', translation: '你好，初次见面！', difficulty: 1 },
    { id: 2, sentence: 'お元気ですか？', translation: '你好吗？', difficulty: 1 },
    { id: 3, sentence: 'はい、元気です。ありがとう。', translation: '是的，我很好。谢谢。', difficulty: 1 },
    { id: 4, sentence: 'お名前は何ですか？', translation: '你叫什么名字？', difficulty: 1 },
    { id: 5, sentence: '私は田中です。', translation: '我是田中。', difficulty: 1 },
    { id: 6, sentence: 'どこから来ましたか？', translation: '你从哪里来？', difficulty: 1 },
    { id: 7, sentence: '中国から来ました。', translation: '我从中国来。', difficulty: 1 },
    { id: 8, sentence: 'おはようございます！', translation: '早上好！', difficulty: 1 },
    { id: 9, sentence: 'こんばんは、お疲れ様です。', translation: '晚上好，辛苦了。', difficulty: 1 },
    { id: 10, sentence: 'さようなら、また明日。', translation: '再见，明天见。', difficulty: 1 },
    // 自我介绍
    { id: 11, sentence: '私は学生です。', translation: '我是学生。', difficulty: 1 },
    { id: 12, sentence: '何歳ですか？', translation: '你几岁了？', difficulty: 1 },
    { id: 13, sentence: '二十歳です。', translation: '我二十岁。', difficulty: 1 },
    { id: 14, sentence: '仕事は何ですか？', translation: '你的工作是什么？', difficulty: 1 },
    { id: 15, sentence: '会社員です。', translation: '我是公司职员。', difficulty: 1 },
    // 购物场景
    { id: 16, sentence: 'これは何ですか？', translation: '这是什么？', difficulty: 1 },
    { id: 17, sentence: 'これはいくらですか？', translation: '这个多少钱？', difficulty: 1 },
    { id: 18, sentence: '千円です。', translation: '一千日元。', difficulty: 1 },
    { id: 19, sentence: 'これをください。', translation: '请给我这个。', difficulty: 1 },
    { id: 20, sentence: 'ありがとうございます。', translation: '谢谢。', difficulty: 1 },
  ],
  ja_intermediate: [
    // 餐厅点餐
    { id: 1, sentence: 'メニューをお願いします。', translation: '请给我菜单。', difficulty: 2 },
    { id: 2, sentence: 'おすすめは何ですか？', translation: '有什么推荐的吗？', difficulty: 2 },
    { id: 3, sentence: 'この料理を注文したいです。', translation: '我想点这道菜。', difficulty: 2 },
    { id: 4, sentence: '水をください。', translation: '请给我水。', difficulty: 2 },
    { id: 5, sentence: 'お会計をお願いします。', translation: '请结账。', difficulty: 2 },
    { id: 6, sentence: 'カードで払えますか？', translation: '可以刷卡吗？', difficulty: 2 },
    { id: 7, sentence: 'とても美味しかったです。', translation: '非常好吃。', difficulty: 2 },
    { id: 8, sentence: 'ごちそうさまでした。', translation: '谢谢款待。', difficulty: 2 },
    // 问路场景
    { id: 9, sentence: '駅はどこですか？', translation: '车站在哪里？', difficulty: 2 },
    { id: 10, sentence: 'この道を直進してください。', translation: '请沿着这条路直走。', difficulty: 2 },
    { id: 11, sentence: '右に曲がってください。', translation: '请向右转。', difficulty: 2 },
    { id: 12, sentence: '徒歩でどのくらいかかりますか？', translation: '步行需要多长时间？', difficulty: 2 },
    { id: 13, sentence: '十分くらいです。', translation: '大约十分钟。', difficulty: 2 },
    { id: 14, sentence: 'ありがとうございました。', translation: '非常感谢。', difficulty: 2 },
    // 旅行场景
    { id: 15, sentence: 'ホテルを予約したいです。', translation: '我想预订酒店。', difficulty: 2 },
    { id: 16, sentence: 'チェックインは何時からですか？', translation: '几点开始办理入住？', difficulty: 2 },
    { id: 17, sentence: '部屋はありますか？', translation: '有房间吗？', difficulty: 2 },
    { id: 18, sentence: '一人部屋を予約しました。', translation: '我预订了单人间。', difficulty: 2 },
    { id: 19, sentence: '観光地に行きたいです。', translation: '我想去观光景点。', difficulty: 2 },
    { id: 20, sentence: '写真を撮ってもいいですか？', translation: '可以拍照吗？', difficulty: 2 },
  ],
  ja_advanced: [
    // 商务会议
    { id: 1, sentence: '本日の会議を始めさせていただきます。', translation: '请允许我开始今天的会议。', difficulty: 3 },
    { id: 2, sentence: 'まず、議題について説明いたします。', translation: '首先，我将说明议题。', difficulty: 3 },
    { id: 3, sentence: 'ご質問がございましたら、お申し付けください。', translation: '如有疑问，请提出。', difficulty: 3 },
    { id: 4, sentence: 'この件について、ご意見をお聞かせください。', translation: '关于这件事，请发表您的意见。', difficulty: 3 },
    { id: 5, sentence: '提案をご検討いただければ幸いです。', translation: '希望您能考虑这个提案。', difficulty: 3 },
    { id: 6, sentence: '次の会議の日程を決めさせていただきます。', translation: '请允许我确定下次会议的日程。', difficulty: 3 },
    { id: 7, sentence: '本日はご参加いただき、誠にありがとうございました。', translation: '今天非常感谢您的参与。', difficulty: 3 },
    { id: 8, sentence: '会議の議事録を送付いたします。', translation: '我会发送会议记录。', difficulty: 3 },
    // 正式场合
    { id: 9, sentence: 'お忙しい中、お時間をいただきありがとうございます。', translation: '感谢您在百忙之中抽出时间。', difficulty: 3 },
    { id: 10, sentence: 'ご紹介いただき、光栄です。', translation: '很高兴能得到介绍。', difficulty: 3 },
    { id: 11, sentence: '本日はお越しいいただき、ありがとうございます。', translation: '感谢您今天的到来。', difficulty: 3 },
    { id: 12, sentence: 'ご協力いただき、深く感謝申し上げます。', translation: '衷心感谢您的合作。', difficulty: 3 },
    { id: 13, sentence: '今後とも、ご指導ご鞭撨をお願い申し上げます。', translation: '今后也请您多多指教。', difficulty: 3 },
    { id: 14, sentence: '何かご不明な点がございましたら、お問い合わせください。', translation: '如有不明之处，请联系我们。', difficulty: 3 },
    { id: 15, sentence: 'ご期待に添えるよう、努めて参ります。', translation: '我会努力满足您的期望。', difficulty: 3 },
    { id: 16, sentence: '改めて、ご連絡させていただきます。', translation: '我会再联系您。', difficulty: 3 },
    { id: 17, sentence: 'ご検討の結果をお知らせください。', translation: '请告知考虑的结果。', difficulty: 3 },
    { id: 18, sentence: '契約の詳細について、ご相談させていただきます。', translation: '请允许我就合同细节与您协商。', difficulty: 3 },
    { id: 19, sentence: 'ご多忙の折、恐縮ですが、ご対応をお願いいたします。', translation: '在您忙碌之际，抱歉打扰，请予以应对。', difficulty: 3 },
    { id: 20, sentence: '本日はお礼を申し上げに伺いました。', translation: '今天我是来致谢的。', difficulty: 3 },
  ],
  ko_beginner: [
    // 问候
    { id: 1, sentence: '안녕하세요, 처음 뵙겠습니다!', translation: '你好，初次见面！', difficulty: 1 },
    { id: 2, sentence: '잘 지내세요?', translation: '你好吗？', difficulty: 1 },
    { id: 3, sentence: '네, 잘 지냅니다. 감사합니다.', translation: '是的，我很好。谢谢。', difficulty: 1 },
    { id: 4, sentence: '좋은 아침입니다!', translation: '早上好！', difficulty: 1 },
    { id: 5, sentence: '안녕히 가세요.', translation: '再见。', difficulty: 1 },
    { id: 6, sentence: '감사합니다.', translation: '谢谢。', difficulty: 1 },
    { id: 7, sentence: '죄송합니다.', translation: '对不起。', difficulty: 1 },
    // 自我介绍
    { id: 8, sentence: '이름이 뭐예요?', translation: '你叫什么名字？', difficulty: 1 },
    { id: 9, sentence: '저는 김민수예요.', translation: '我叫金民秀。', difficulty: 1 },
    { id: 10, sentence: '어디에서 오셨어요?', translation: '你从哪里来？', difficulty: 1 },
    { id: 11, sentence: '중국에서 왔어요.', translation: '我从中国来。', difficulty: 1 },
    // 购物
    { id: 12, sentence: '이거 얼마예요?', translation: '这个多少钱？', difficulty: 1 },
    { id: 13, sentence: '너무 비싸요.', translation: '太贵了。', difficulty: 1 },
    { id: 14, sentence: '이거 주세요.', translation: '请给我这个。', difficulty: 1 },
    { id: 15, sentence: '계산해 주세요.', translation: '请结账。', difficulty: 1 },
    // 日常
    { id: 16, sentence: '오늘 날씨가 좋아요.', translation: '今天天气很好。', difficulty: 1 },
    { id: 17, sentence: '밥 먹었어요?', translation: '吃饭了吗？', difficulty: 1 },
    { id: 18, sentence: '학교에 가요.', translation: '我去学校。', difficulty: 1 },
    { id: 19, sentence: '집에 가요.', translation: '我回家。', difficulty: 1 },
    { id: 20, sentence: '맛있어요!', translation: '很好吃！', difficulty: 1 },
  ],
  ko_intermediate: [
    // 餐厅点餐
    { id: 1, sentence: '메뉴판 보여 주세요.', translation: '请给我看看菜单。', difficulty: 2 },
    { id: 2, sentence: '이것을 주문하겠습니다.', translation: '我要点这个。', difficulty: 2 },
    { id: 3, sentence: '물 한 잔 더 주세요.', translation: '请再给我一杯水。', difficulty: 2 },
    { id: 4, sentence: '잠시만 기다려 주세요.', translation: '请稍等一下。', difficulty: 2 },
    { id: 5, sentence: '계산은 카드로 하겠습니다.', translation: '用信用卡结账。', difficulty: 2 },
    // 问路
    { id: 6, sentence: '지하철역이 어디에 있어요?', translation: '地铁站在哪里？', difficulty: 2 },
    { id: 7, sentence: '이쪽으로 가면 돼요?', translation: '往这边走就可以吗？', difficulty: 2 },
    { id: 8, sentence: '걸어서 얼마나 걸려요?', translation: '走路要多久？', difficulty: 2 },
    { id: 9, sentence: '버스로 갈 수 있어요?', translation: '可以坐公交去吗？', difficulty: 2 },
    { id: 10, sentence: '감사합니다, 잘 찾아가겠습니다.', translation: '谢谢，我会好好找过去的。', difficulty: 2 },
    // 旅行
    { id: 11, sentence: '호텔을 예약하려고 합니다.', translation: '我想预订酒店。', difficulty: 2 },
    { id: 12, sentence: '2박 3일로 예약하고 싶어요.', translation: '我想预订三天两晚。', difficulty: 2 },
    { id: 13, sentence: '체크인은 언제 할 수 있어요?', translation: '什么时候可以入住？', difficulty: 2 },
    { id: 14, sentence: '관광지를 추천해 주세요.', translation: '请推荐一些旅游景点。', difficulty: 2 },
    { id: 15, sentence: '이곳에서 사진을 찍을 수 있어요?', translation: '这里可以拍照吗？', difficulty: 2 },
    // 其他
    { id: 16, sentence: '약속 시간을 변경하고 싶어요.', translation: '我想更改约定的时间。', difficulty: 2 },
    { id: 17, sentence: '조금 더 늦게 만나도 될까요?', translation: '可以晚一点见面吗？', difficulty: 2 },
    { id: 18, sentence: '건강을 위해 운동을 시작했어요.', translation: '为了健康我开始运动了。', difficulty: 2 },
    { id: 19, sentence: '한국어를 1년 정도 배웠어요.', translation: '我学了大约一年的韩语。', difficulty: 2 },
    { id: 20, sentence: '다음에 또 만나요!', translation: '下次再见！', difficulty: 2 },
  ],
  ko_advanced: [
    // 商务会议
    { id: 1, sentence: '이번 프로젝트의 진행 상황을 보고하겠습니다.', translation: '我将汇报这个项目的进展情况。', difficulty: 3 },
    { id: 2, sentence: '협력 관계를 강화하는 방안을 제안합니다.', translation: '我提议加强合作关系的方案。', difficulty: 3 },
    { id: 3, sentence: '시장 분석 결과를 공유하고 싶습니다.', translation: '我想分享市场分析结果。', difficulty: 3 },
    { id: 4, sentence: '이 문제에 대해 다양한 의견을 수렴했습니다.', translation: '就这个问题我们收集了各种意见。', difficulty: 3 },
    { id: 5, sentence: '결정을 내리기 전에 검토가 필요합니다.', translation: '在做出决定之前需要审查。', difficulty: 3 },
    { id: 6, sentence: '이 계약의 조건을 상세히 논의하겠습니다.', translation: '我们将详细讨论这份合同的条款。', difficulty: 3 },
    // 正式场合
    { id: 7, sentence: '귀사의 성공적인 비즈니스를 기원합니다.', translation: '祝愿贵公司的商业成功。', difficulty: 3 },
    { id: 8, sentence: '이번 협력을 통해 양측 모두 이익을 얻을 수 있기를 바랍니다.', translation: '希望这次合作双方都能获益。', difficulty: 3 },
    { id: 9, sentence: '우리의 경쟁력을 높이기 위한 전략을 제시하겠습니다.', translation: '我将提出提高竞争力的策略。', difficulty: 3 },
    { id: 10, sentence: '품질 향상과 비용 절감을 동시에 실현하고 있습니다.', translation: '我们正在同时实现质量提升和成本节约。', difficulty: 3 },
    // 学术讨论
    { id: 11, sentence: '이 연구의 결과는 기대했던 것보다 더 의미 있습니다.', translation: '这项研究的结果比预期的更有意义。', difficulty: 3 },
    { id: 12, sentence: '학술적 가치를 인정받은 논문입니다.', translation: '这是一篇得到学术价值认可的论文。', difficulty: 3 },
    { id: 13, sentence: '이 이론은 다양한 분야에 적용될 수 있습니다.', translation: '这个理论可以应用于多个领域。', difficulty: 3 },
    { id: 14, sentence: '실험 결과를 통해 가설을 증명했습니다.', translation: '通过实验结果证明了假设。', difficulty: 3 },
    { id: 15, sentence: '분석 결과에 따르면 이 방법이 더 효율적입니다.', translation: '根据分析结果，这种方法更高效。', difficulty: 3 },
    // 其他高级表达
    { id: 16, sentence: '이 현상의 사회적 의미를 고찰하고 있습니다.', translation: '我们正在考察这种现象的社会意义。', difficulty: 3 },
    { id: 17, sentence: '전통과 현대의 조화를 추구하는 것이 중요합니다.', translation: '追求传统与现代的和谐很重要。', difficulty: 3 },
    { id: 18, sentence: '참여자들의 다양한 관점을 종합하여 결론을 도출했습니다.', translation: '综合参与者的各种观点得出结论。', difficulty: 3 },
    { id: 19, sentence: '우리는 사회적 책임을 다하는 기업으로 성장하고 있습니다.', translation: '我们正在成长为履行社会责任的企业。', difficulty: 3 },
    { id: 20, sentence: '지속 가능한 발전을 위한 해결책을 모색해야 합니다.', translation: '我们必须寻求可持续发展的解决方案。', difficulty: 3 },
  ],
};

const mockListening: Record<string, any[]> = {
  en_beginner: [
    { id: 1, title: 'Greetings', transcript: 'A: Good morning! B: Good morning! How are you? A: I am fine, thank you. And you? B: I am great! Today is a beautiful day. A: Yes, the weather is nice. B: Let\'s go to the park together. A: That sounds good!', translation: 'A：早上好！B：早上好！你好吗？A：我很好，谢谢。你呢？B：我很棒！今天是个美好的日子。A：是的，天气很好。B：我们一起去公园吧。A：听起来不错！', questions: '[{"q":"How is A feeling?","options":["Tired","Fine","Sad","Angry"],"answer":1},{"q":"What do they plan to do?","options":["Go to school","Go to the park","Go shopping","Go home"],"answer":1}]' },
    { id: 2, title: 'Introductions', transcript: 'A: Hi, my name is Tom. B: Nice to meet you, Tom. I am Lisa. A: Nice to meet you too, Lisa. Where are you from? B: I am from Canada. A: Canada is a beautiful country. B: Yes, I love Canada. How old are you, Tom? A: I am twelve years old. B: I am eleven.', translation: 'A：嗨，我叫汤姆。B：很高兴认识你，汤姆。我是丽萨。A：我也很高兴认识你，丽萨。你来自哪里？B：我来自加拿大。A：加拿大是个美丽的国家。B：是的，我爱加拿大。你几岁了，汤姆？A：我十二岁了。B：我十一岁。', questions: '[{"q":"Where is Lisa from?","options":["China","Canada","Japan","Korea"],"answer":1},{"q":"How old is Tom?","options":["Ten","Eleven","Twelve","Thirteen"],"answer":2}]' },
    { id: 3, title: 'Shopping', transcript: 'Customer: Excuse me, how much is this apple? Shopkeeper: It is two dollars. Customer: And how much are the bananas? Shopkeeper: They are one dollar for three. Customer: I would like to buy five apples and six bananas. Shopkeeper: That will be eight dollars. Customer: Thank you. Here is the money.', translation: '顾客：请问，这个苹果多少钱？店主：两美元。顾客：香蕉多少钱呢？店主：三根一美元。顾客：我想买五个苹果和六根香蕉。店主：一共八美元。顾客：谢谢。这是钱。', questions: '[{"q":"How much is one apple?","options":["One dollar","Two dollars","Three dollars","Four dollars"],"answer":1},{"q":"How many apples does the customer buy?","options":["Three","Four","Five","Six"],"answer":2}]' },
    { id: 4, title: 'At the Restaurant', transcript: 'Waiter: Welcome! What would you like to eat? Customer: I would like some soup and bread. Waiter: We have tomato soup and chicken soup. Which one do you prefer? Customer: Tomato soup, please. Waiter: And for the main course? Customer: I would like some pasta. Waiter: OK, your order will be ready soon.', translation: '服务员：欢迎！您想吃什么？顾客：我想要一些汤和面包。服务员：我们有番茄汤和鸡肉汤。您更喜欢哪种？顾客：番茄汤，谢谢。服务员：主菜呢？顾客：我想要一些意大利面。服务员：好的，您的订单很快就好了。', questions: '[{"q":"What soup does the customer choose?","options":["Chicken soup","Tomato soup","Vegetable soup","Fish soup"],"answer":1},{"q":"What is the main course?","options":["Pizza","Pasta","Salad","Rice"],"answer":1}]' },
    { id: 5, title: 'Asking Directions', transcript: 'A: Excuse me, where is the library? B: Go straight and turn left at the second street. A: Is it far from here? B: No, it is about ten minutes walk. A: Thank you very much. B: You are welcome. A: Goodbye. B: Bye!', translation: 'A：打扰一下，图书馆在哪里？B：直走，在第二条街左转。A：离这里远吗？B：不远，大约步行十分钟。A：非常感谢。B：不客气。A：再见。B：再见！', questions: '[{"q":"Where does A want to go?","options":["School","Park","Library","Hospital"],"answer":2},{"q":"How long does it take to walk there?","options":["Five minutes","Ten minutes","Fifteen minutes","Twenty minutes"],"answer":1}]' },
    { id: 6, title: 'Family Talk', transcript: 'Mom: What did you do at school today? Child: We learned about animals. Mom: That sounds interesting. What animals did you learn about? Child: We learned about dogs, cats, and birds. Mom: Which animal do you like best? Child: I like dogs because they are friendly. Mom: I like dogs too. We can get a dog one day.', translation: '妈妈：你今天在学校做了什么？孩子：我们学习了关于动物的知识。妈妈：听起来很有趣。你学习了什么动物？孩子：我们学习了狗、猫和鸟。妈妈：你最喜欢哪种动物？孩子：我喜欢狗，因为它们很友好。妈妈：我也喜欢狗。我们有一天可以养一只狗。', questions: '[{"q":"What did the child learn at school?","options":["Colors","Numbers","Animals","Sports"],"answer":2},{"q":"Why does the child like dogs?","options":["They are cute","They are friendly","They are big","They are fast"],"answer":1}]' },
    { id: 7, title: 'Weather', transcript: 'A: What is the weather like today? B: It is sunny and warm. A: That is good. I want to go swimming. B: Swimming is fun! Where do you want to go? A: I want to go to the beach. B: The beach is beautiful. Can I come with you? A: Of course! Let\'s go together.', translation: 'A：今天天气怎么样？B：阳光明媚，很温暖。A：太好了。我想去游泳。B：游泳很有趣！你想去哪里？A：我想去海滩。B：海滩很美丽。我可以和你一起去吗？A：当然！我们一起去吧。', questions: '[{"q":"What is the weather like?","options":["Rainy and cold","Sunny and warm","Cloudy and cool","Snowy and cold"],"answer":1},{"q":"Where does A want to go?","options":["Park","Pool","Beach","River"],"answer":2}]' },
    { id: 8, title: 'At the Doctor', transcript: 'Doctor: What is wrong with you? Patient: I have a headache and feel tired. Doctor: Let me check. You have a cold. Patient: What should I do? Doctor: You should rest and drink lots of water. Patient: Should I take any medicine? Doctor: Yes, take this medicine three times a day. Patient: Thank you, doctor.', translation: '医生：你哪里不舒服？病人：我头疼，感觉很累。医生：让我检查一下。你感冒了。病人：我应该怎么办？医生：你应该休息，多喝水。病人：我需要吃药吗？医生：是的，每天吃三次这种药。病人：谢谢医生。', questions: '[{"q":"What is wrong with the patient?","options":["Stomachache","Headache","Fever","Cough"],"answer":1},{"q":"What should the patient do?","options":["Exercise more","Eat more food","Rest and drink water","Go to school"],"answer":2}]' },
  ],
  en_intermediate: [
    { id: 1, title: 'Travel Booking', transcript: 'Agent: Good afternoon, how can I help you? Customer: I would like to book a flight to London. Agent: When would you like to travel? Customer: I want to travel on June 15th. Agent: We have several flights available. The earliest one departs at 8 am and arrives at 2 pm. Customer: That sounds perfect. How much is the ticket? Agent: It is 500 dollars for a round trip. Customer: Great, I will book that flight. Agent: May I have your name and passport number? Customer: My name is John Smith and my passport number is AB123456.', translation: '代理：下午好，我能为您做什么？顾客：我想预订一张去伦敦的机票。代理：您想什么时候出行？顾客：我想6月15日出行。代理：我们有几个航班可选。最早的航班上午8点出发，下午2点到达。顾客：听起来完美。机票多少钱？代理：往返票500美元。顾客：很好，我就预订那个航班。代理：能告诉我您的姓名和护照号码吗？顾客：我叫约翰·史密斯，护照号码是AB123456。', questions: '[{"q":"Where does the customer want to travel?","options":["Paris","London","New York","Tokyo"],"answer":1},{"q":"How much is the round trip ticket?","options":["400 dollars","500 dollars","600 dollars","700 dollars"],"answer":1}]' },
    { id: 2, title: 'Job Interview', transcript: 'Interviewer: Welcome. Please tell me about yourself. Candidate: I am a software engineer with five years of experience. Interviewer: What are your strengths? Candidate: I am good at problem-solving and I work well in a team. Interviewer: Why do you want to work for our company? Candidate: I admire your company\'s innovation and I believe I can contribute to your projects. Interviewer: Do you have any questions for us? Candidate: Yes, what opportunities for professional development are available?', translation: '面试官：欢迎。请介绍一下你自己。候选人：我是一名软件工程师，有五年的工作经验。面试官：你的优势是什么？候选人：我擅长解决问题，团队合作能力也很好。面试官：你为什么想在我们公司工作？候选人：我钦佩你们公司的创新精神，我相信我能为你们的项目做出贡献。面试官：你有什么问题要问我们吗？候选人：是的，有什么职业发展的机会？', questions: '[{"q":"What is the candidate\'s profession?","options":["Teacher","Doctor","Software engineer","Lawyer"],"answer":2},{"q":"How many years of experience does the candidate have?","options":["Three years","Four years","Five years","Six years"],"answer":2}]' },
    { id: 3, title: 'At the Hospital', transcript: 'Doctor: Good morning. What brings you here today? Patient: I have been having stomach pain for the past week. Doctor: Have you noticed any other symptoms? Patient: Yes, I have also been feeling nauseous sometimes. Doctor: Let me examine you. After the examination, I think you might have gastritis. Patient: Is it serious? Doctor: No, it\'s not serious, but you need to take medication and avoid spicy food. Patient: Thank you, doctor. I will follow your advice.', translation: '医生：早上好。今天你来看病的原因是什么？病人：我这周胃一直疼。医生：你有注意到其他症状吗？病人：是的，我有时候还感到恶心。医生：让我给你检查一下。检查后，我认为你可能得了胃炎。病人：严重吗？医生：不严重，但你需要吃药，避免辛辣食物。病人：谢谢医生。我会听从您的建议。', questions: '[{"q":"What problem does the patient have?","options":["Headache","Stomach pain","Back pain","Leg pain"],"answer":1},{"q":"What does the doctor advise the patient to avoid?","options":["Cold food","Spicy food","Sweet food","Fried food"],"answer":1}]' },
    { id: 4, title: 'Hotel Reservation', transcript: 'Receptionist: Welcome to our hotel. Do you have a reservation? Guest: Yes, I booked a room for three nights under the name Mary Johnson. Receptionist: Let me check. Yes, I found your reservation. It\'s a double room with a sea view. Guest: That\'s correct. Can I check in now? Receptionist: Certainly. Your room number is 305. Here is your key card. Guest: What time is breakfast served? Receptionist: Breakfast is served from 7 am to 10 am in the dining hall.', translation: '前台：欢迎来到我们酒店。您有预订吗？客人：是的，我用Mary Johnson的名字预订了三晚的房间。前台：让我查一下。是的，我找到了您的预订。是一个海景双人房。客人：没错。我现在可以入住吗？前台：当然。您的房间号是305。这是您的钥匙卡。客人：早餐几点供应？前台：早餐从早上7点到10点在餐厅供应。', questions: '[{"q":"How many nights did the guest book?","options":["Two nights","Three nights","Four nights","Five nights"],"answer":1},{"q":"What type of room did the guest book?","options":["Single room","Double room with sea view","Double room with mountain view","Suite"],"answer":1}]' },
    { id: 5, title: 'Shopping for Clothes', transcript: 'Shop assistant: Can I help you find something? Customer: I am looking for a jacket for winter. Shop assistant: We have many styles. What color do you prefer? Customer: I prefer black or dark blue. Shop assistant: This black jacket is very popular. It\'s made of wool and very warm. Customer: May I try it on? Shop assistant: Of course. The fitting room is over there. Customer: It fits perfectly. How much is it? Shop assistant: It\'s 150 dollars. Customer: I will take it.', translation: '店员：我能帮您找什么吗？顾客：我想找一件冬天穿的夹克。店员：我们有很多款式。您更喜欢什么颜色？顾客：我更喜欢黑色或深蓝色。店员：这件黑色夹克很受欢迎。它是羊毛做的，很暖和。顾客：我可以试穿吗？店员：当然。试衣间在那边。顾客：非常合适。多少钱？店员：150美元。顾客：我要买它。', questions: '[{"q":"What is the customer looking for?","options":["A dress","A jacket","A shirt","A coat"],"answer":1},{"q":"How much is the jacket?","options":["100 dollars","120 dollars","150 dollars","200 dollars"],"answer":2}]' },
    { id: 6, title: 'Discussing a Project', transcript: 'Manager: Let\'s discuss the new marketing project. Team member: I have prepared the presentation. Manager: What are the main points of our strategy? Team member: We plan to focus on social media marketing and influencer partnerships. Manager: How long will it take to implement? Team member: We estimate about three months for the initial phase. Manager: What budget do we need? Team member: We need about 50,000 dollars for the first quarter. Manager: That sounds reasonable. Let\'s proceed with the plan.', translation: '经理：我们来讨论一下新的营销项目。团队成员：我已经准备好了演示。经理：我们的策略主要要点是什么？团队成员：我们计划专注于社交媒体营销和网红合作。经理：实施需要多长时间？团队成员：我们估计初始阶段大约三个月。经理：我们需要什么预算？团队成员：第一季度大约需要5万美元。经理：听起来合理。让我们按计划进行。', questions: '[{"q":"What is the focus of the marketing strategy?","options":["TV advertising","Social media marketing","Print media","Radio advertising"],"answer":1},{"q":"What budget is needed for the first quarter?","options":["30,000 dollars","40,000 dollars","50,000 dollars","60,000 dollars"],"answer":2}]' },
  ],
  en_advanced: [
    { id: 1, title: 'Business Negotiation', transcript: 'Executive A: Thank you for meeting with us today. We are interested in establishing a partnership with your company. Executive B: We appreciate your interest. Could you elaborate on what kind of partnership you are proposing? Executive A: We propose a strategic alliance where we would collaborate on research and development projects. Executive B: That sounds promising. What would be the terms of such an agreement? Executive A: We suggest a 50-50 investment split and shared intellectual property rights. Executive B: We would need to discuss this with our legal team. What timeline do you envision? Executive A: We hope to finalize the agreement within three months.', translation: '执行官A：感谢您今天与我们会面。我们对与贵公司建立合作伙伴关系感兴趣。执行官B：我们感谢您的兴趣。您能详细说明您提议的是什么样的合作伙伴关系吗？执行官A：我们提议建立战略联盟，在研究和开发项目上进行合作。执行官B：听起来很有前景。这样一份协议的条款会是什么？执行官A：我们建议投资按50-50分担，共享知识产权。执行官B：我们需要与我们的法律团队讨论这个问题。您设想的时间表是什么？执行官A：我们希望在三个月内敲定协议。', questions: '[{"q":"What type of partnership is being proposed?","options":["Supplier relationship","Strategic alliance","Joint venture","Merger"],"answer":1},{"q":"What investment split is suggested?","options":["60-40","70-30","50-50","40-60"],"answer":2}]' },
    { id: 2, title: 'Academic Discussion', transcript: 'Professor: Today we will discuss the implications of climate change on global food security. Student: Professor, could you explain the connection between rising temperatures and crop yields? Professor: Rising temperatures can lead to drought conditions, which significantly reduce agricultural productivity. Student: What solutions are researchers proposing? Professor: Many researchers are advocating for sustainable farming practices and the development of drought-resistant crops. Student: Are there any economic considerations? Professor: Yes, the economic impact includes increased food prices and potential trade imbalances in agricultural products. Student: Thank you for the comprehensive explanation.', translation: '教授：今天我们将讨论气候变化对全球粮食安全的影响。学生：教授，您能解释气温上升与作物产量之间的联系吗？教授：气温上升可能导致干旱状况，这会显著降低农业生产力。学生：研究人员提出了什么解决方案？教授：许多研究人员提倡可持续农业实践和开发抗旱作物。学生：有什么经济方面的考量吗？教授：是的，经济影响包括食品价格上涨和农产品潜在的贸易失衡。学生：感谢您的全面解释。', questions: '[{"q":"What is the main topic of discussion?","options":["Economic growth","Climate change and food security","Political instability","Technological advancement"],"answer":1},{"q":"What solutions do researchers propose?","options":["More chemical fertilizers","Sustainable farming practices","Larger farms","More imports"],"answer":1}]' },
    { id: 3, title: 'Policy Debate', transcript: 'Speaker A: I believe that government regulations on businesses are necessary to protect consumers. Speaker B: However, excessive regulations can stifle innovation and economic growth. Speaker A: Without regulations, corporations may prioritize profit over public safety. Speaker B: Market competition can serve as a natural regulator. Consumers will choose safer products. Speaker A: But history has shown that without oversight, some companies engage in unethical practices. Speaker B: A balanced approach might be the solution. We need regulations but they should not be overly restrictive. Speaker A: I agree. The key is finding the right balance between protection and economic freedom.', translation: '发言人A：我认为政府对企业的监管对于保护消费者是必要的。发言人B：然而，过度的监管会扼杀创新和经济增长。发言人A：没有监管，公司可能会将利润置于公共安全之上。发言人B：市场竞争可以作为天然的调节器。消费者会选择更安全的产品。发言人A：但历史表明，没有监督，一些公司会从事不道德的实践。发言人B：平衡的方法可能是解决方案。我们需要监管，但不应该过度限制。发言人A：我同意。关键是在保护和经济自由之间找到正确的平衡。', questions: '[{"q":"What does Speaker A support?","options":["No regulations","Excessive regulations","Government regulations","Self-regulation"],"answer":2},{"q":"What does Speaker B suggest as a solution?","options":["No regulations at all","Maximum regulations","A balanced approach","Complete deregulation"],"answer":2}]' },
    { id: 4, title: 'Scientific Research Presentation', transcript: 'Researcher: Our team has been investigating the effects of artificial intelligence on employment patterns. Colleague: What methodology did you employ for this study? Researcher: We used quantitative analysis of employment data from 2015 to 2025 across multiple industries. Colleague: What were your key findings? Researcher: We observed that automation has displaced certain job categories but has also created new opportunities in tech-related fields. Colleague: What are the implications for policy makers? Researcher: Policy makers should focus on education and retraining programs to prepare workers for the changing job market. Colleague: Thank you for sharing these insights. This research could have significant societal impact.', translation: '研究员：我们的团队一直在调查人工智能对就业模式的影响。同事：这项研究您采用了什么方法？研究员：我们使用了2015年至2025年多个行业就业数据的定量分析。同事：您的主要发现是什么？研究员：我们观察到自动化取代了某些工作类别，但也在技术相关领域创造了新的机会。同事：这对政策制定者有什么影响？研究员：政策制定者应专注于教育和再培训计划，为工人准备应对变化的就业市场做准备。同事：感谢您分享这些见解。这项研究可能会产生重大的社会影响。', questions: '[{"q":"What is the topic of the research?","options":["Education reform","AI and employment patterns","Economic growth","Healthcare improvement"],"answer":1},{"q":"What does the researcher recommend for policy makers?","options":["Reduce taxes","Focus on education and retraining","Limit automation","Create more factories"],"answer":1}]' },
  ],
  ja_beginner: [
    { id: 1, title: 'あいさつ', transcript: 'A: おはようございます！B: おはようございます！お元気ですか？A: はい、元気です。ありがとうございます。B: それはよかったです。', translation: 'A：早上好！B：早上好！你好吗？A：是的，我很好。谢谢。B：那太好了。', questions: '[{"q":"Aは元気ですか？","options":["いいえ、元気ではありません","はい、元気です","わかりません","疲れています"],"answer":1}]' },
    { id: 2, title: '自己紹介', transcript: 'A: はじめまして、田中です。B: はじめまして、鈴木です。どこから来ましたか？A: 東京から来ました。B: そうですか。', translation: 'A：初次见面，我是田中。B：初次见面，我是铃木。你从哪里来？A：我从东京来。B：这样啊。', questions: '[{"q":"田中さんはどこから来ましたか？","options":["大阪","京都","東京","北海道"],"answer":2}]' },
    { id: 3, title: 'コンビニで', transcript: 'A: いらっしゃいませ。B: おにぎりを二つください。A: おにぎり二つですね。他に何か？B: いいえ、これだけでいいです。A: 全部で三百円です。', translation: 'A：欢迎光临。B：请给我两个饭团。A：两个饭团。还需要别的吗？B：不，这就够了。A：总共三百日元。', questions: '[{"q":"客は何を買いましたか？","options":["パン","おにぎり","牛乳","水"],"answer":1},{"q":"全部でいくらですか？","options":["二百円","三百円","四百円","五百円"],"answer":1}]' },
    { id: 4, title: '道を尋ねる', transcript: 'A: すみません、駅はどこですか？B: この道を直進してください。A: ありがとうございます。遠いですか？B: いいえ、近いです。五分くらいです。', translation: 'A：请问，车站在哪里？B：请沿着这条路直走。A：谢谢。远吗？B：不，很近。大约五分钟。', questions: '[{"q":"駅までどのくらいかかりますか？","options":["五分","十分","十五分","二十分"],"answer":0}]' },
    { id: 5, title: 'カフェで', transcript: 'A: 何を飲みますか？B: コーヒーを飲みたいです。A: ホットですか、アイスですか？B: アイスでいいです。A: 了解しました。', translation: 'A：喝什么？B：我想喝咖啡。A：热的还是冷的？B：冷的就好。A：知道了。', questions: '[{"q":"Bは何を飲みますか？","options":["お茶","コーヒー","水","牛乳"],"answer":1},{"q":"ホットですか、アイスですか？","options":["ホット","アイス","両方","どちらでもない"],"answer":1}]' },
    { id: 6, title: '家族について', transcript: 'A: 家族は何人ですか？B: 四人です。父、母、妹と私です。A: 妹さんは何歳ですか？B: 十五歳です。高校生です。', translation: 'A：家里有几口人？B：四口人。父亲、母亲、妹妹和我。A：妹妹几岁了？B：十五岁。是高中生。', questions: '[{"q":"家族は何人ですか？","options":["三人","四人","五人","六人"],"answer":1},{"q":"妹は何歳ですか？","options":["十二歳","十三歳","十五歳","十八歳"],"answer":2}]' },
    { id: 7, title: '買い物', transcript: 'A: この靴はいくらですか？B: 五千円です。A: 少し高いですね。B: でも、品質がいいですよ。A: 分かりました。買います。', translation: 'A：这双鞋多少钱？B：五千日元。A：有点贵啊。B：但是质量很好哦。A：知道了。我买。', questions: '[{"q":"靴はいくらですか？","options":["三千円","四千円","五千円","六千円"],"answer":2},{"q":"客は靴を買いましたか？","options":["いいえ","はい","分かりません","迷っている"],"answer":1}]' },
    { id: 8, title: '週末の計画', transcript: 'A: 明日は何をしますか？B: 映画を見に行きたいです。A: 何を見ますか？B: 日本の映画です。友達と一緒に行きます。', translation: 'A：明天做什么？B：我想去看电影。A：看什么？B：日本电影。和朋友一起去。', questions: '[{"q":"Bは明日何をしますか？","options":["買い物","映画を見る","旅行","勉強"],"answer":1},{"q":"誰と行きますか？","options":["家族一人","友達","一人","先生"],"answer":1}]' },
  ],
  ja_intermediate: [
    { id: 1, title: 'レストランで', transcript: 'A: いらっしゃいませ。何名ですか？B: 二名です。A: こちらの席へどうぞ。メニューです。B: おすすめは何ですか？A: 今日の特別メニューは魚料理です。とても人気があります。B: それを注文します。', translation: 'A：欢迎光临。几位？B：两位。A：请坐这边。这是菜单。B：有什么推荐的？A：今天的特色菜是鱼料理。很受欢迎。B：我点那个。', questions: '[{"q":"客は何名ですか？","options":["一人","二人","三人","四人"],"answer":1},{"q":"客は何を注文しましたか？","options":["肉料理","魚料理","野菜料理","パスタ"],"answer":1}]' },
    { id: 2, title: '旅行の予約', transcript: 'A: 東京へ旅行したいです。B: いつ行きますか？A: 十月十五日からです。三日間です。B: ホテルを予約しましょうか？A: はい、東京駅の近くがいいです。', translation: 'A：我想去东京旅行。B：什么时候去？A：从十月十五日开始。三天。B：要预订酒店吗？A：是的，东京站附近的比较好。', questions: '[{"q":"旅行は何日間ですか？","options":["二日","三日","四日","五日"],"answer":1},{"q":"ホテルはどこがいいですか？","options":["空港の近く","駅の近く","市内中心","郊外"],"answer":1}]' },
    { id: 3, title: '病院で', transcript: 'A: 今日から頭が痛いです。B: いつからですか？A: 昨日の夜からです。B: 热はありますか？A: 少しあります。B: 休んでください。薬を出します。', translation: 'A：今天开始头痛。B：从什么时候开始的？A：从昨天晚上开始。B：有发烧吗？A：有一点。B：请休息。我会给你开药。', questions: '[{"q":"患者は何が痛いですか？","options":["頭","胸","足","手"],"answer":0},{"q":"熱がありますか？","options":["いいえ","少し","たくさん","分かりません"],"answer":1}]' },
    { id: 4, title: '仕事の相談', transcript: 'A: 仕事が忙しいです。B: 何時間働いていますか？A: 毎日十時間以上です。B: 残業が多いですね。A: そうですね。少し休みを取ろうと思います。', translation: 'A：工作很忙。B：工作多少小时？A：每天十小时以上。B：加班很多啊。A：是啊。我想稍微休息一下。', questions: '[{"q":"毎日何時間働いていますか？","options":["八時間","九時間","十時間以上","七時間"],"answer":2},{"q":"Aは何をしようと思いますか？","options":["仕事を辞める","休みを取る","転職する","何もしない"],"answer":1}]' },
    { id: 5, title: '学校の説明', transcript: 'A: この学校はいつ創立しましたか？B: 一九五〇年に創立しました。A: 学生は何人いますか？B: 約一千人です。A: 有名な学科は何ですか？B: 計算機科学が人気です。', translation: 'A：这所学校什么时候创立的？B：一九五〇年创立。A：有多少学生？B：大约一千人。A：有名的学科是什么？B：计算机科学很受欢迎。', questions: '[{"q":"学校はいつ創立しましたか？","options":["一九四〇年","一九五〇年","一九六〇年","一九七〇年"],"answer":1},{"q":"学生は何人ですか？","options":["五百人","八百人","一千人","一千二百人"],"answer":2}]' },
    { id: 6, title: '日本の文化', transcript: 'A: 日本の文化について教えてください。B: 日本にはお茶の文化があります。A: お茶はいつから始まりましたか？B: 千年以上の歴史があります。A: どこで学べますか？B: 京都でお茶の教室があります。', translation: 'A：请告诉我日本的文化。B：日本有茶道文化。A：茶道从什么时候开始的？B：有千年以上的历史。A：在哪里可以学习？B：京都有很多茶道教室。', questions: '[{"q":"お茶の歴史はどのくらいですか？","options":["五百年","八百年","千年以上","二千年"],"answer":2},{"q":"どこで学べますか？","options":["東京","京都","大阪","北海道"],"answer":1}]' },
  ],
  ja_advanced: [
    { id: 1, title: 'ビジネス交渉', transcript: 'A: 今回の契約についてご相談したいと思います。B: どのような条件をご希望ですか？A: 価格を少し下げていただければ幸いです。B: 五％の値引きは可能です。A: それで合意できます。ありがとうございます。B: 契約書を準備いたします。', translation: 'A：我想就这次的合同与您协商。B：您希望什么条件？A：希望能稍微降低价格。B：可以降价5%。A：这样可以达成一致。谢谢。B：我会准备合同书。', questions: '[{"q":"値引きはどのくらいですか？","options":["三％","五％","七％","十％"],"answer":1},{"q":"合意できましたか？","options":["いいえ","はい","まだ交渉中","分かりません"],"answer":1}]' },
    { id: 2, title: '学会発表', transcript: 'A: 本研究の目的は何ですか？B: 新しい治療法の効果を調べることです。A: 方法はどのようなものですか？B: 五十人の患者を対象に実験を行いました。A: 結果はどうでしたか？B: 期待以上の効果が見られました。', translation: 'A：这项研究的目的是什么？B：调查新治疗方法的效果。A：采用什么方法？B：以五十名患者为对象进行了实验。A：结果如何？B：看到了超出预期的效果。', questions: '[{"q":"研究の目的は何ですか？","options":["病気の予防","治療法の効果","副作用の調査","患者数の調査"],"answer":1},{"q":"実験の対象は何人ですか？","options":["三十人","四十人","五十人","六十人"],"answer":2}]' },
    { id: 3, title: '国際会議', transcript: 'A: 今日の議題は環境問題です。B: 各国の現状を報告してください。A: 日本では再生可能エネルギーを増加しています。B: 具体的には何ですか？A: 太陽光発電と風力発電です。B: それは重要な進展ですね。', translation: 'A：今天的议题是环境问题。B：请报告各国现状。A：日本正在增加可再生能源。B：具体是什么？A：太阳能发电和风力发电。B：那是重要的进展。', questions: '[{"q":"議題は何ですか？","options":["教育問題","経済問題","環境問題","政治問題"],"answer":2},{"q":"日本は何を増加していますか？","options":["石油","天然ガス","再生可能エネルギー","原子力"],"answer":2}]' },
    { id: 4, title: '企業戦略', transcript: 'A: 来年の事業計画を説明します。B: 市場の見通しはどうですか？A: 成長市場として中国市場を重点的に展開します。B: 具体的な戦略は？A: 新製品の開発と販売網の拡大です。B: 投資額はどのくらいですか？A: 約一億円を計画しています。', translation: 'A：说明明年的事业计划。B：市场前景如何？A：作为成长市场，将重点开发中国市场。B：具体战略是什么？A：新产品开发和销售网扩大。B：投资额是多少？A：计划约一亿日元。', questions: '[{"q":"重点市場はどこですか？","options":["日本","アメリカ","中国","ヨーロッパ"],"answer":2},{"q":"投資額はどのくらいですか？","options":["五千万円","七千万円","一億円","二億円"],"answer":2}]' },
  ],
  ko_beginner: [
    // 日常问候
    { id: 1, title: '인사', transcript: 'A: 안녕하세요! B: 안녕하세요! 잘 지내세요? A: 네, 잘 지냅니다. 감사합니다. B: 다행이네요.', translation: 'A：你好！B：你好！过得好吗？A：是的，过得很好。谢谢。B：太好了。', questions: '[{"q":"A는 잘 지내나요?","options":["아니요, 안 좋아요","네, 잘 지내요","모르겠어요","피곤해요"],"answer":1}]' },
    { id: 2, title: '자기소개', transcript: 'A: 처음 뵙겠습니다, 김민수입니다. B: 처음 뵙겠습니다, 박지영입니다. 어디에서 오셨어요? A: 서울에서 왔어요. B: 그렇군요.', translation: 'A：初次见面，我是金民秀。B：初次见面，我是朴智英。你从哪里来？A：我从首尔来。B：原来如此。', questions: '[{"q":"김민수 씨는 어디에서 왔어요?","options":["부산","서울","대구","인천"],"answer":1}]' },
    // 便利店购物
    { id: 3, title: '편의점', transcript: 'A: 이거 얼마예요? B: 1,500원이요. A: 두 개 주세요. B: 여기 있습니다. 3,000원입니다.', translation: 'A：这个多少钱？B：1,500韩元。A：请给我两个。B：给您，一共3,000韩元。', questions: '[{"q":"두 개는 얼마예요?","options":["1,500원","2,000원","3,000원","4,000원"],"answer":2}]' },
    { id: 4, title: '카페', transcript: 'A: 커피 한 잔 주세요. B: 어떤 커피를 원하세요? A: 아메리카노요. B: 여기 아메리카노 있습니다.', translation: 'A：请给我一杯咖啡。B：您想要什么咖啡？A：美式咖啡。B：这是您的美式咖啡。', questions: '[{"q":"A는 무엇을 주문했어요?","options":["라떼","아메리카노","녹차","주스"],"answer":1}]' },
    // 问路
    { id: 5, title: '지하철역', transcript: 'A: 지하철역이 어디에 있어요? B: 이쪽으로 5분 걸어요. A: 감사합니다! B: 천만에요.', translation: 'A：地铁站在哪里？B：往这边走5分钟。A：谢谢！B：不客气。', questions: '[{"q":"지하철역까지 얼마나 걸려요?","options":["3분","5분","10분","15분"],"answer":1}]' },
    { id: 6, title: '버스', transcript: 'A: 버스 정류장이 어디예요? B: 건물 앞에 있어요. A: 감사합니다. B: 안녕히 가세요.', translation: 'A：公交站在哪里？B：在建筑物前面。A：谢谢。B：再见。', questions: '[{"q":"버스 정류장은 어디예요?","options":["건물 뒤","건물 앞","지하철역","마트"],"answer":1}]' },
    // 日常生活
    { id: 7, title: '학교', transcript: 'A: 학교에 가요? B: 네, 오늘 수업이 있어요. A: 몇 시에 시작해요? B: 9시에 시작해요.', translation: 'A：你去学校吗？B：是的，今天有课。A：几点开始？B：9点开始。', questions: '[{"q":"수업은 몇 시에 시작해요?","options":["8시","9시","10시","11시"],"answer":1}]' },
    { id: 8, title: '밥', transcript: 'A: 밥 먹었어요? B: 아니요, 아직 안 먹었어요. A: 같이 먹을래요? B: 네, 좋아요!', translation: 'A：吃饭了吗？B：没有，还没吃。A：一起吃好吗？B：好的，好的！', questions: '[{"q":"B는 밥을 먹었어요?","options":["네, 먹었어요","아니요, 안 먹었어요","먹고 있어요","모르겠어요"],"answer":1}]' },
  ],
  ko_intermediate: [
    // 餐厅点餐
    { id: 1, title: '식당', transcript: 'A: 메뉴판 보여 주세요. B: 여기 있습니다. A: 비빔밥 하나랑 김치찌개 하나 주세요. B: 네, 알겠습니다.', translation: 'A：请给我看菜单。B：给您。A：请给我一份拌饭和一份泡菜汤。B：好的，知道了。', questions: '[{"q":"A는 무엇을 주문했어요?","options":["비빔밥만","김치찌개만","비빔밥과 김치찌개","불고기"],"answer":2}]' },
    { id: 2, title: '계산', transcript: 'A: 계산해 주세요. B: 카드로 하시겠어요? A: 네, 카드로요. B: 영수증 필요하세요? A: 네, 주세요.', translation: 'A：请结账。B：您用卡吗？A：是的，用卡。B：需要收据吗？A：是的，请给我。', questions: '[{"q":"A는 어떻게 계산했어요?","options":["현금","카드","수표","모르겠어요"],"answer":1}]' },
    // 旅行预订
    { id: 3, title: '호텔', transcript: 'A: 호텔 예약하고 싶어요. B: 얼마 동안 계시겠어요? A: 2박 3일요. B: 네, 예약 완료되었습니다.', translation: 'A：我想预订酒店。B：您要住多久？A：三天两晚。B：好的，预订完成了。', questions: '[{"q":"A는 얼마 동안 예약했어요?","options":["1박 2일","2박 3일","3박 4일","4박 5일"],"answer":1}]' },
    { id: 4, title: '여행', transcript: 'A: 제주도에 가려고 해요. B: 언제 가요? A: 다음 주에요. B: 좋은 여행 되세요!', translation: 'A：我打算去济州岛。B：什么时候去？A：下周。B：祝您旅行愉快！', questions: '[{"q":"A는 어디에 가려고 해요?","options":["서울","부산","제주도","대전"],"answer":2}]' },
    // 看病
    { id: 5, title: '병원', transcript: 'A: 배가 아파서 왔어요. B: 언제부터 아파요? A: 오늘 아침부터요. B: 검사해 보겠습니다.', translation: 'A：我肚子疼所以来了。B：什么时候开始疼的？A：从今天早上开始。B：我来检查一下。', questions: '[{"q":"A는 어디가 아파요?","options":["머리","배","목","다리"],"answer":1}]' },
    { id: 6, title: '약국', transcript: 'A: 감기약을 사려고 해요. B: 어떤 감기약을 원하세요? A: 기침이 많아요. B: 이 약이 좋아요.', translation: 'A：我想买感冒药。B：您想要什么感冒药？A：咳嗽很厉害。B：这个药很好。', questions: '[{"q":"A는 어떤 증상이 있어요?","options":["발열","기침","두통","복통"],"answer":1}]' },
  ],
  ko_advanced: [
    // 商务谈判
    { id: 1, title: '협상', transcript: 'A: 이번 계약 조건에 대해 논의하겠습니다. B: 네, 주요 조건을 설명해 주세요. A: 우선 가격과 납기입니다. B: 조건이 좋은 것 같습니다.', translation: 'A：我们来讨论这份合同的条款。B：好的，请说明主要条款。A：首先是价格和交货期。B：条件看起来不错。', questions: '[{"q":"주요 논의 내용은 무엇이에요?","options":["마케팅","가격과 납기","인력","품질"],"answer":1}]' },
    { id: 2, title: '비즈니스', transcript: 'A: 우리 회사와 협력 관계를 제안합니다. B: 어떤 분야에서 협력하시겠어요? A: 기술 개발입니다. B: 흥미있는 제안이네요.', translation: 'A：我提议与贵公司建立合作关系。B：在什么领域合作？A：技术开发。B：这是个有趣的提议。', questions: '[{"q":"협력 분야는 무엇이에요?","options":["마케팅","영업","기술 개발","인사"],"answer":2}]' },
    // 学术讨论
    { id: 3, title: '연구', transcript: 'A: 이 연구 결과를 공유하고 싶습니다. B: 어떤 새로운 발견이 있었나요? A: 데이터 분석 결과입니다. B: 학술적 가치가 높네요.', translation: 'A：我想分享这项研究结果。B：有什么新发现吗？A：这是数据分析结果。B：学术价值很高。', questions: '[{"q":"연구 결과의 특징은 무엇이에요?","options":["경제적 가치","학술적 가치","실용적 가치","문화적 가치"],"answer":1}]' },
    { id: 4, title: '논문', transcript: 'A: 이 논문의 주요 논점을 설명하겠습니다. B: 어떤 이론적 근거가 있나요? A: 실험 결과를 기반으로 합니다. B: 논리가 탄탄해요.', translation: 'A：我来解释这篇论文的主要论点。B：有什么理论依据？A：基于实验结果。B：逻辑很扎实。', questions: '[{"q":"논문의 근거는 무엇이에요?","options":["이론","실험 결과","관찰","조사"],"answer":1}]' },
  ],
};

const mockAchievements = [
  { id: 1, name: '初心学者', description: '完成第一次学习', icon: '🌟', requirement: '完成任意一次学习' },
  { id: 2, name: '单词达人', description: '累计学习100个单词', icon: '📚', requirement: '累计学习100个单词' },
  { id: 3, name: '坚持不懈', description: '连续学习7天', icon: '🔥', requirement: '连续打卡7天' },
  { id: 4, name: '多语能手', description: '学习2种以上语言', icon: '🌍', requirement: '学习2种以上语言' },
  { id: 5, name: '语法大师', description: '完成50道语法题', icon: '✏️', requirement: '完成50道语法题' },
  { id: 6, name: '口语新星', description: '完成20次口语练习', icon: '🎤', requirement: '完成20次口语练习' },
  { id: 7, name: '听力高手', description: '完成20次听力训练', icon: '🎧', requirement: '完成20次听力训练' },
  { id: 8, name: '课程先锋', description: '报名任意一门课程', icon: '🎓', requirement: '报名任意一门课程' },
  { id: 9, name: '社交达人', description: '发布第一条动态', icon: '💬', requirement: '发布第一条社区动态' },
  { id: 10, name: '学习狂热者', description: '累计学习10小时', icon: '⏰', requirement: '累计学习10小时' },
];

const initialPosts = [
  { id: 1, user_id: 2, username: 'sakura', content: '今天开始学习日语啦！大家一起加油吧～ 🎌', likes: 12, created_at: new Date(Date.now() - 86400000).toISOString(), liked: false },
  { id: 2, user_id: 3, username: 'minjun', content: '韩语发音真的好有趣，已经学会了基本的字母！🇰🇷', likes: 8, created_at: new Date(Date.now() - 172800000).toISOString(), liked: false },
  { id: 3, user_id: 1, username: 'demo', content: '打卡第30天！英语进步很大，继续坚持！💪', likes: 25, created_at: new Date(Date.now() - 259200000).toISOString(), liked: false },
];

function getUsers(): any[] {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    const defaultUsers = [
      { id: 1, username: 'demo', email: 'demo@linguaverse.com', password: 'password123', learning_language: 'en', level: 'intermediate', avatar: null, created_at: new Date().toISOString() },
      { id: 2, username: 'sakura', email: 'sakura@linguaverse.com', password: 'password123', learning_language: 'ja', level: 'beginner', avatar: null, created_at: new Date().toISOString() },
      { id: 3, username: 'minjun', email: 'minjun@linguaverse.com', password: 'password123', learning_language: 'ko', level: 'beginner', avatar: null, created_at: new Date().toISOString() },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
}

function saveUsers(users: any[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser(): any | null {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user: any | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

function getPosts(): any[] {
  const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
  if (!posts) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialPosts));
    return initialPosts;
  }
  return JSON.parse(posts);
}

function savePosts(posts: any[]) {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

function getProgress(): any {
  const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (!progress) return { wordsLearned: 0, grammarDone: 0, speakingDone: 0, listeningDone: 0, totalMinutes: 0, streak: 0, lastStudyDate: null };
  return JSON.parse(progress);
}

function saveProgress(progress: any) {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

function getEnrollments(): number[] {
  const enrolls = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
  return enrolls ? JSON.parse(enrolls) : [];
}

function saveEnrollments(enrolls: number[]) {
  localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrolls));
}

function getUserAchievements(): number[] {
  const ach = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
  return ach ? JSON.parse(ach) : [];
}

function saveUserAchievements(ach: number[]) {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(ach));
}

export const api = {
  auth: {
    register: async (data: { username: string; email: string; password: string }) => {
      await new Promise(r => setTimeout(r, 300));
      const users = getUsers();
      if (users.find(u => u.username === data.username)) {
        throw new Error('用户名已存在');
      }
      const newUser = { id: users.length + 1, ...data, learning_language: 'en', level: 'beginner', avatar: null, created_at: new Date().toISOString() };
      users.push(newUser);
      saveUsers(users);
      const { password: _, ...userWithoutPassword } = newUser;
      return { user: userWithoutPassword, token: 'mock-token-' + newUser.id };
    },
    login: async (data: { username: string; password: string }) => {
      await new Promise(r => setTimeout(r, 300));
      const users = getUsers();
      const user = users.find(u => u.username === data.username && u.password === data.password);
      if (!user) throw new Error('用户名或密码错误');
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return { user: userWithoutPassword, token: 'mock-token-' + user.id };
    },
    getProfile: async () => {
      await new Promise(r => setTimeout(r, 200));
      return getCurrentUser();
    },
    updateProfile: async (data: any) => {
      await new Promise(r => setTimeout(r, 300));
      const currentUser = getCurrentUser();
      if (!currentUser) throw new Error('未登录');
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);
      const users = getUsers();
      const idx = users.findIndex(u => u.id === currentUser.id);
      if (idx >= 0) { users[idx] = { ...users[idx], ...data }; saveUsers(users); }
      return updated;
    },
  },
  courses: {
    getAll: async (params?: { language?: string; level?: string }) => {
      await new Promise(r => setTimeout(r, 200));
      let result = [...mockCourses];
      if (params?.language && params.language !== 'all') result = result.filter(c => c.language === params.language);
      if (params?.level && params.level !== 'all') result = result.filter(c => c.level === params.level);
      return result;
    },
    getById: async (id: number) => {
      await new Promise(r => setTimeout(r, 200));
      return mockCourses.find(c => c.id === id);
    },
    enroll: async (id: number) => {
      await new Promise(r => setTimeout(r, 200));
      const enrolls = getEnrollments();
      if (!enrolls.includes(id)) { enrolls.push(id); saveEnrollments(enrolls); }
      return { success: true, message: '报名成功！' };
    },
    getMyCourses: async () => {
      await new Promise(r => setTimeout(r, 200));
      const enrolls = getEnrollments();
      return mockCourses.filter(c => enrolls.includes(c.id));
    },
  },
  learning: {
    getVocabulary: async (params?: { language?: string; level?: string; limit?: number }) => {
      await new Promise(r => setTimeout(r, 200));
      const lang = params?.language && params.language !== 'all' ? params.language : 'en';
      const lvl = params?.level && params.level !== 'all' ? params.level : 'beginner';
      const key = `${lang}_${lvl}`;
      const words = mockVocabulary[key] || mockVocabulary.en_beginner;
      return params?.limit ? words.slice(0, params.limit) : words;
    },
    getGrammar: async (params?: { language?: string; level?: string; limit?: number }) => {
      await new Promise(r => setTimeout(r, 200));
      const lang = params?.language && params.language !== 'all' ? params.language : 'en';
      const lvl = params?.level && params.level !== 'all' ? params.level : 'beginner';
      const key = `${lang}_${lvl}`;
      const questions = mockGrammar[key] || mockGrammar.en_beginner;
      return params?.limit ? questions.slice(0, params.limit) : questions;
    },
    getSpeaking: async (params?: { language?: string; level?: string }) => {
      await new Promise(r => setTimeout(r, 200));
      const lang = params?.language && params.language !== 'all' ? params.language : 'en';
      const lvl = params?.level && params.level !== 'all' ? params.level : 'beginner';
      const key = `${lang}_${lvl}`;
      return mockSpeaking[key] || mockSpeaking.en_beginner;
    },
    getListening: async (params?: { language?: string; level?: string }) => {
      await new Promise(r => setTimeout(r, 200));
      const lang = params?.language && params.language !== 'all' ? params.language : 'en';
      const lvl = params?.level && params.level !== 'all' ? params.level : 'beginner';
      const key = `${lang}_${lvl}`;
      return mockListening[key] || mockListening.en_beginner;
    },
    recordProgress: async (type: string, count: number = 1) => {
      await new Promise(r => setTimeout(r, 200));
      const progress = getProgress();
      if (type === 'vocabulary') progress.wordsLearned += count;
      if (type === 'grammar') progress.grammarDone += count;
      if (type === 'speaking') progress.speakingDone += count;
      if (type === 'listening') progress.listeningDone += count;
      progress.totalMinutes += 5;
      const today = new Date().toDateString();
      if (progress.lastStudyDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (progress.lastStudyDate === yesterday) progress.streak++;
        else progress.streak = 1;
        progress.lastStudyDate = today;
      }
      saveProgress(progress);
      const achievements = getUserAchievements();
      const newAchievements: number[] = [];
      if (progress.wordsLearned >= 100 && !achievements.includes(2)) newAchievements.push(2);
      if (progress.streak >= 7 && !achievements.includes(3)) newAchievements.push(3);
      if (progress.grammarDone >= 50 && !achievements.includes(5)) newAchievements.push(5);
      if (progress.speakingDone >= 20 && !achievements.includes(6)) newAchievements.push(6);
      if (progress.listeningDone >= 20 && !achievements.includes(7)) newAchievements.push(7);
      if (progress.totalMinutes >= 600 && !achievements.includes(10)) newAchievements.push(10);
      if ((progress.wordsLearned > 0 || progress.grammarDone > 0) && !achievements.includes(1)) newAchievements.push(1);
      if (newAchievements.length > 0) {
        saveUserAchievements([...achievements, ...newAchievements]);
      }
      return { success: true, newAchievements };
    },
  },
  progress: {
    getStats: async () => {
      await new Promise(r => setTimeout(r, 200));
      return getProgress();
    },
    getAchievements: async () => {
      await new Promise(r => setTimeout(r, 200));
      const userAch = getUserAchievements();
      return mockAchievements.map(a => ({ ...a, unlocked: userAch.includes(a.id) }));
    },
    getLeaderboard: async () => {
      await new Promise(r => setTimeout(r, 200));
      return [
        { rank: 1, username: 'demo', totalMinutes: 480, streak: 30 },
        { rank: 2, username: 'sakura', totalMinutes: 320, streak: 22 },
        { rank: 3, username: 'minjun', totalMinutes: 280, streak: 18 },
        { rank: 4, username: 'tom_english', totalMinutes: 200, streak: 12 },
        { rank: 5, username: 'korean_lover', totalMinutes: 150, streak: 8 },
      ];
    },
    getRecommendations: async () => {
      await new Promise(r => setTimeout(r, 200));
      const user = getCurrentUser();
      const lang = user?.learning_language || 'en';
      const level = user?.level || 'beginner';
      const recs = mockCourses.filter(c => c.language === lang && c.level === level);
      return recs.length > 0 ? recs : mockCourses.slice(0, 3);
    },
  },
  community: {
    getPosts: async () => {
      await new Promise(r => setTimeout(r, 200));
      return getPosts().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    createPost: async (content: string) => {
      await new Promise(r => setTimeout(r, 300));
      const user = getCurrentUser();
      if (!user) throw new Error('未登录');
      const posts = getPosts();
      const newPost = { id: posts.length + 1, user_id: user.id, username: user.username, content, likes: 0, created_at: new Date().toISOString(), liked: false };
      posts.unshift(newPost);
      savePosts(posts);
      return newPost;
    },
    likePost: async (id: number) => {
      await new Promise(r => setTimeout(r, 200));
      const posts = getPosts();
      const post = posts.find(p => p.id === id);
      if (post) {
        if (post.liked) { post.likes--; post.liked = false; }
        else { post.likes++; post.liked = true; }
        savePosts(posts);
      }
      return { success: true };
    },
  },
};

export default api;
