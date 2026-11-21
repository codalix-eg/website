/* Codalix assistant: answers common questions about ONTAP Share Manager and The Clinic.
   Runs entirely in the page. No server, no cookies, no storage, nothing is sent anywhere. */
(function () {
  'use strict';
  if (window.__codalixChat) return;
  window.__codalixChat = true;

  var EMAIL = 'support@codalix.org';
  var PHONE = '201558005889';
  var TELEGRAM = 'codalix_eg';
  var STORE_URL = 'https://apps.microsoft.com/detail/9PDRHZ0FFZ3Q';

  /* ---------- text ---------- */
  var T = {
    ar: {
      open: 'اسأل Codalix', close: 'إغلاق', title: 'مساعد Codalix', sub: 'إجابات سريعة عن البرنامجين',
      ph: 'اكتب سؤالك…', send: 'إرسال',
      hello: 'أهلاً! أنا مساعد Codalix. اسألني عن ONTAP Share Manager أو The Clinic، أو اختار من هنا:',
      none: 'مش متأكد إني فهمت سؤالك. ممكن تختار من الأسئلة دي، أو تتواصل مع الفريق مباشرة:',
      thanks: 'العفو! لو عندك سؤال تاني أنا موجود.',
      contactLabel: 'تواصل مع الفريق', email: 'راسلنا', call: 'اتصل', tg: 'تيليجرام',
      priv: 'سياسة الخصوصية', store: 'افتح في Microsoft Store', page: 'افتح الصفحة',
      dir: 'rtl'
    },
    en: {
      open: 'Ask Codalix', close: 'Close', title: 'Codalix assistant', sub: 'Quick answers about both products',
      ph: 'Type your question…', send: 'Send',
      hello: "Hi! I'm the Codalix assistant. Ask me about ONTAP Share Manager or The Clinic, or pick one here:",
      none: "I'm not sure I understood. Pick one of these, or contact the team directly:",
      thanks: "You're welcome! Ask me anything else.",
      contactLabel: 'Contact the team', email: 'Email us', call: 'Call', tg: 'Telegram',
      priv: 'Privacy policy', store: 'Open in Microsoft Store', page: 'Open the page',
      dir: 'ltr'
    }
  };

  /* ---------- knowledge ----------
     k: keywords (normalised, matched as substrings); p: product hint; a: answer; f: follow-up chip ids */
  var KB = [
    { id: 'osm', chip: { ar: 'إيه هو ONTAP Share Manager؟', en: 'What is ONTAP Share Manager?' },
      k: ['ontap share manager', 'share manager', 'ontap', 'نت اب', 'netapp', 'اونتاب', 'اون تاب', 'ايه هو ontap', 'what is ontap'], p: 'osm',
      a: { ar: 'تطبيق Windows واحد لمسؤولي NetApp ONTAP. بيعمل المجلدات والـ Shares، ويحدد الصلاحيات من Active Directory، وينقل ملفات من سيرفر Windows قديم، ويوريك مين غيّر أو مسح إيه.',
           en: 'One Windows app for NetApp ONTAP admins. It creates folders and shares, sets permissions from Active Directory, migrates Windows file servers and shows who changed or deleted what.' },
      f: ['osm-get', 'osm-req', 'osm-ad'], link: { ar: ['/ar/ontap-share-manager/', 'صفحة ONTAP Share Manager'], en: ['/ontap-share-manager/', 'ONTAP Share Manager page'] } },

    { id: 'osm-get', chip: { ar: 'إزاي أنزّله؟', en: 'How do I get it?' },
      k: ['نزل', 'تنزيل', 'حمل', 'تحميل', 'اثبت', 'تثبيت', 'نسخه', 'متجر', 'ستور', 'store', 'download', 'install', 'get it', 'microsoft'], p: 'osm',
      a: { ar: 'ONTAP Share Manager متاح على Microsoft Store. بتنزله وتثبته على جهاز الأدمن، وبعدها بتسجل دخول لـ NetApp وللدومين.',
           en: 'ONTAP Share Manager is available on the Microsoft Store. Install it on the admin PC, then sign in to your NetApp and your domain.' },
      f: ['osm-req', 'osm-inst', 'demo'], store: true },

    { id: 'osm-req', chip: { ar: 'المتطلبات والإصدارات', en: 'Requirements and versions' },
      k: ['متطلبات', 'اصدار', 'نسخه ontap', 'يدعم', 'version', 'support', 'requirement', 'windows 10', 'windows 11', '9.11', 'compatible', 'يشتغل علي'], p: 'osm',
      a: { ar: 'محتاج ONTAP 9.11.1 أو أحدث مع SMB وvolumes بـ NTFS وSVM منضم لـ Active Directory. والبرنامج بيشتغل على Windows 10 أو 11.',
           en: 'You need ONTAP 9.11.1 or later with SMB, NTFS volumes and an SVM joined to Active Directory. The app runs on Windows 10 or 11.' },
      f: ['osm-inst', 'osm-get'] },

    { id: 'osm-inst', chip: { ar: 'هل بيتثبت حاجة على NetApp؟', en: 'Does it install anything on NetApp?' },
      k: ['بيتثبت علي', 'يتثبت علي', 'علي netapp', 'علي الدومين', 'domain controller', 'agent', 'nothing to install', 'on our netapp', 'on the netapp', 'علي السيرفر'], p: 'osm',
      a: { ar: 'لا. البرنامج بيشتغل على جهاز الأدمن، وبيتكلم مع ONTAP من خلال الـ REST API ومع AD بحساب قراءة فقط. مفيش حاجة بتتثبت على الـ NetApp ولا على الدومين كنترولر.',
           en: "No. It runs on the admin's PC and talks to ONTAP over its REST API and to AD with a read-only account. Nothing is installed on the NetApp or the domain controllers." },
      f: ['data', 'osm-perm'] },

    { id: 'osm-ad', chip: { ar: 'الصلاحيات من Active Directory', en: 'Permissions from Active Directory' },
      k: ['صلاحيه', 'صلاحيات', 'active directory', 'ad ', 'جروب', 'مجموعه', 'يوزر', 'مستخدم', 'permission', 'group', 'user', 'ntfs', 'share', 'شير', 'مجلد', 'folder', 'فولدر'], p: 'osm',
      a: { ar: 'بتختار المستخدم أو الجروب من Active Directory وتديله Read أو Modify أو Full، من غير كتابة أسماء ولا CLI. المجلد وصلاحيات NTFS والـ Share بيتعملوا مع بعض.',
           en: 'Pick users or security groups from Active Directory and give each Read, Modify or Full. No typing names, no CLI. The folder, the NTFS permissions and the Share are created together.' },
      f: ['osm-mig', 'osm-audit'] },

    { id: 'osm-perm', chip: { ar: 'مين يتحكم في صلاحيات الأدمنز؟', en: 'Who controls what admins can do?' },
      k: ['ادمن', 'ادمنز', 'admins', 'roles', 'role', 'مين يتحكم', 'who controls', 'يتحكم'], p: 'osm',
      a: { ar: 'أدوار ONTAP عندك. البرنامج بيعمل بس اللي حساب NetApp المسجّل بيه مسموح له بيه، وكل تغيير بيتسجل في الـ audit log.',
           en: 'Your ONTAP roles. The app only does what the signed-in NetApp account is allowed to do, and every change is logged.' },
      f: ['osm-audit', 'data'] },

    { id: 'osm-mig', chip: { ar: 'نقل ملفات من سيرفر Windows', en: 'Migrating a Windows file server' },
      k: ['نقل', 'ترحيل', 'هجره', 'migrat', 'file server', 'windows server', 'سيرفر قديم', 'move data', 'copy'], p: 'osm',
      a: { ar: 'بتعمل Scan للسيرفر القديم وتراجع الخطة الأول. بعدها Start migration بينقل البيانات مع صلاحيات NTFS والـ owner والـ quotas، ويراجع كل مجلد ملف ملف، وبعدين يعمل الـ Share.',
           en: 'You scan the old server and check the plan first. Then Start migration copies data with NTFS permissions, owner and quotas, checks every folder file by file, and creates the Share.' },
      f: ['osm-audit', 'osm-quota'] },

    { id: 'osm-audit', chip: { ar: 'مين مسح ملف؟', en: 'Who deleted a file?' },
      k: ['مسح', 'حذف', 'مين غير', 'audit', 'delete', 'deleted', 'who changed', 'who deleted', 'تدقيق', 'مراقبه', 'سجل', 'log', 'rename'], p: 'osm',
      a: { ar: 'Share Auditing بيستخدم الـ audit log بتاع ONTAP نفسه، وبيوريك المسح والتغيير والنقل ومحاولات المسح المرفوضة، مع اسم المستخدم والوقت والملف والجهاز. ولو عايز ترجّع نسخة قديمة، Restore بيحطها جنب الأصلية من غير ما يكتب فوقها.',
           en: "Share Auditing uses ONTAP's own audit log and shows deletes, renames, moves, changes and refused delete attempts with the user, time, file and PC. Restore brings an older version next to the original without overwriting it." },
      f: ['osm-quota', 'osm-ad'] },

    { id: 'osm-quota', chip: { ar: 'الـ Quotas والـ Snapshots', en: 'Quotas and snapshots' },
      k: ['quota', 'كوتا', 'حجم المجلد', 'snapshot', 'سناب', 'restore', 'استرجاع', 'نسخه قديمه', 'size limit', 'block file', 'امتداد'], p: 'osm',
      a: { ar: 'تقدر تحدد حد لحجم المجلد، وتمنع أنواع ملفات معينة، وترجّع نسخة أقدم من ملف من غير ما تلمس الأصل.',
           en: 'You can set a size limit on a folder, block certain file types, and bring back an older version of a file without touching the original.' },
      f: ['osm-audit', 'osm-mig'] },

    { id: 'clinic', chip: { ar: 'إيه هو The Clinic؟', en: 'What is The Clinic?' },
      k: ['the clinic', 'clinic', 'كلينك', 'عياده', 'عيادات', 'عيون', 'دكتور', 'طبيب', 'ophthalm', 'eye', 'doctor', 'مرضي', 'مريض', 'patient', 'emr'], p: 'clinic',
      a: { ar: 'The Clinic برنامج للعيادات، لسه قيد التطوير، وأول تخصص بنبدأ بيه هو عيادات العيون. اتصمم بإيد دكتور، وكل شاشة فيه اتراجعت جوه عيادة شغالة عشان تمشي ورا الكشف بالترتيب.',
           en: 'The Clinic is clinic software, currently in development, starting with eye clinics. It was shaped by a doctor, and every screen was reviewed inside a working clinic so it follows the exam in order.' },
      f: ['clinic-data', 'clinic-custom', 'clinic-status'], link: { ar: ['/ar/the-clinic/', 'صفحة The Clinic'], en: ['/the-clinic/', 'The Clinic page'] } },

    { id: 'clinic-status', chip: { ar: 'هو متاح دلوقتي؟', en: 'Is it available now?' },
      k: ['متاح', 'اتاح', 'available', 'release', 'launch', 'امتي', 'when', 'نزل ولا', 'قيد التطوير', 'in development', 'store the clinic'], p: 'clinic',
      a: { ar: 'The Clinic لسه قيد التطوير. تقدر تتواصل معانا نعرفك أول بأول، ونوريك البرنامج في مكالمة.',
           en: "The Clinic is still in development. Contact us and we'll keep you posted, and we can show it to you on a call." },
      f: ['demo', 'clinic-custom'] },

    { id: 'clinic-data', chip: { ar: 'فين بيانات المرضى؟', en: 'Where is patient data kept?' },
      k: ['بيانات المرضي', 'ملفات المرضي', 'بيانات', 'فين', 'تخزين', 'نسخ احتياطي', 'باك اب', 'backup', 'patient data', 'where', 'stored', 'cloud', 'سحاب', 'اوفلاين', 'offline', 'خصوصيه'], p: 'clinic',
      a: { ar: 'على كمبيوترات عيادتك أنت، مش على سيرفر خارجي، مع نسخة احتياطية. وCodalix مش بتستلم بيانات المرضى. تنبيه مهم: خد نسخة احتياطية دايمًا قبل ما تشيل البرنامج أو تغيّر الجهاز.',
           en: "On your own clinic's computers, not on an outside server, with a backup. Codalix does not receive patient data. Always back up before you remove the app or replace a computer." },
      f: ['clinic-computers', 'privacy'] },

    { id: 'clinic-custom', chip: { ar: 'ينفع يتظبط على عيادتي؟', en: 'Can it be tailored to my clinic?' },
      k: ['تخصيص', 'يتظبط', 'اظبط', 'يتعدل', 'عدل', 'custom', 'tailor', 'adapt', 'fit', 'طباعه', 'ترتيب الكشف', 'روشته', 'prescription', 'تقرير', 'report'], p: 'clinic',
      a: { ar: 'أيوه، دي جزء من الفكرة. بنتعرف على طريقة شغلك ونظبط البرنامج حواليها: ترتيب الكشف، الأدوية اللي بتكتبها، شكل المطبوعات باسمك ولوجو عيادتك، ومواعيدك.',
           en: 'Yes, that is part of the idea. We learn how you work and set the program up around it: exam order, the medications you write, printouts with your name and logo, and your hours.' },
      f: ['clinic-import', 'demo'] },

    { id: 'clinic-import', chip: { ar: 'أنقل بياناتي من برنامجي القديم؟', en: 'Bring data from my old program?' },
      k: ['برنامج قديم', 'بياناتي القديمه', 'استيراد', 'import', 'old program', 'old data', 'switch', 'انقل', 'القديم'], p: 'clinic',
      a: { ar: 'أيوه، بننقل المرضى والزيارات. في المكالمة بنبص على برنامجك الحالي ونقولك بالظبط إيه اللي هيتنقل، وإنت بتراجع كل اسم قبل ما يتحفظ.',
           en: 'Yes, we move patients and visits. On the call we look at your current program and tell you exactly what will come across, and you check every name before it is saved.' },
      f: ['clinic-computers', 'demo'] },

    { id: 'clinic-computers', chip: { ar: 'محتاج أجهزة معينة؟', en: 'Do I need special computers?' },
      k: ['جهاز', 'اجهزه', 'كمبيوتر', 'computer', 'pc', 'hardware', 'متطلبات', 'استقبال', 'reception', 'شبكه'], p: 'clinic',
      a: { ar: 'أي كمبيوتر Windows عادي للدكتور، وكمبيوتر تاني للاستقبال لو حابب، على شبكة العيادة.',
           en: 'Any ordinary Windows computer for the doctor, and a second one for reception if you like, on the clinic network.' },
      f: ['clinic-lang', 'demo'] },

    { id: 'clinic-lang', chip: { ar: 'عربي ولا إنجليزي؟', en: 'Arabic or English?' },
      k: ['عربي', 'انجليزي', 'لغه', 'arabic', 'english', 'language'], p: 'clinic',
      a: { ar: 'الاتنين. كل جهاز يختار لغته، وورقة الكشف بتفضل بالإنجليزي زي ما الدكاترة بيكتبوا.',
           en: 'Both. Each computer picks its language, and the exam sheet stays in English the way doctors write.' },
      f: ['clinic-custom', 'demo'] },

    { id: 'data', chip: { ar: 'هل بياناتنا بتروح لـ Codalix؟', en: 'Does our data go to Codalix?' },
      k: ['بياناتنا', 'بتستلم', 'بتبعت', 'ببعت', 'بيبعت', 'send data', 'send my data', 'send any data', 'send us', 'receive', 'data to you', 'collect', 'امان', 'امن', 'privacy', 'security', 'secure', 'safe', 'data go', 'tracking', 'تتبع', 'تحليلات', 'passwords', 'باسورد', 'كلمه سر', 'تسجل'],
      a: { ar: 'لا. البرنامجين بيشتغلوا على جهازك، وCodalix مش بتستلم بياناتك. مفيش تتبع ولا تحليلات ولا إعلانات. وفي ONTAP Share Manager كلمات سر NetApp وActive Directory مش بتتحفظ.',
           en: 'No. Both products run on your computer and Codalix does not receive your data. There is no tracking, analytics or advertising. In ONTAP Share Manager, NetApp and Active Directory passwords are not saved.' },
      f: ['privacy', 'osm-inst'] },

    { id: 'privacy', chip: { ar: 'سياسة الخصوصية', en: 'Privacy policy' },
      k: ['سياسه الخصوصيه', 'privacy policy', 'policy', 'سياسه'],
      a: { ar: 'عندنا سياسة خصوصية لكل برنامج. اختار اللي يهمك:', en: 'Each product has its own privacy policy. Pick the one you need:' },
      links: { ar: [['/ar/privacy/', 'ONTAP Share Manager'], ['/ar/the-clinic/privacy/', 'The Clinic']], en: [['/privacy/', 'ONTAP Share Manager'], ['/the-clinic/privacy/', 'The Clinic']] },
      f: ['data'] },

    { id: 'demo', chip: { ar: 'عايز Demo', en: 'I want a demo' },
      k: ['demo', 'ديمو', 'تجربه', 'جرب', 'trial', 'عرض', 'اطلب', 'احجز', 'book', 'call me', 'كلموني', 'مكالمه', 'see it'],
      a: { ar: 'تمام! ابعتلنا اسمك ومكان شغلك وميعاد مناسب، ونتصل بيك ونوريك البرنامج.',
           en: "Great! Send us your name, your workplace and a good time, and we'll call to show you the product." },
      contact: true, demo: true },

    { id: 'price', chip: { ar: 'الأسعار', en: 'Pricing' },
      k: ['سعر', 'اسعار', 'بكام', 'تكلفه', 'كام', 'price', 'pricing', 'cost', 'how much', 'ترخيص', 'license', 'licence', 'اشتراك', 'subscription', 'free', 'مجاني'],
      a: { ar: 'التفاصيل بنتكلم فيها مباشرة حسب احتياجك. تواصل مع الفريق:',
           en: 'We discuss the details directly based on what you need. Contact the team:' },
      contact: true },

    { id: 'about', chip: { ar: 'مين هي Codalix؟', en: 'Who is Codalix?' },
      k: ['codalix', 'كودالكس', 'مين انتم', 'من انتم', 'who are you', 'who is', 'about', 'شركه', 'company', 'عنكم'],
      a: { ar: 'Codalix شركة modern software، بنعمل برامج بتحل مشاكل شغل حقيقية. حاليًا عندنا ONTAP Share Manager لمسؤولي NetApp، وThe Clinic للعيادات وهو قيد التطوير.',
           en: 'Codalix is a modern software company. We build software that solves real work problems. Right now we have ONTAP Share Manager for NetApp admins, and The Clinic for clinics, which is in development.' },
      f: ['osm', 'clinic'] },

    { id: 'contact', chip: { ar: 'تواصل معنا', en: 'Contact us' },
      k: ['تواصل', 'اتصل', 'رقم', 'ايميل', 'مساعده', 'دعم', 'contact', 'phone', 'email', 'support', 'help', 'whatsapp', 'واتساب', 'call', 'telegram', 'تيليجرام'],
      a: { ar: 'يسعدنا نسمعك:', en: "We'd love to hear from you:" },
      contact: true }
  ];

  var START = ['osm', 'clinic', 'demo', 'contact'];

  /* ---------- helpers ---------- */
  function norm(s) {
    return ' ' + String(s).toLowerCase()
      .replace(/[ً-ٰٟـ]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
      .replace(/[^a-z0-9؀-ۿ.\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
  }
  function byId(id) { for (var i = 0; i < KB.length; i++) if (KB[i].id === id) return KB[i]; return null; }
  function lang() { return document.documentElement.lang === 'ar' ? 'ar' : 'en'; }
  function pageProduct() {
    var p = location.pathname;
    if (p.indexOf('ontap-share-manager') > -1) return 'osm';
    if (p.indexOf('the-clinic') > -1) return 'clinic';
    return '';
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  var GREET = norm('اهلا مرحبا السلام عليكم هاي هلو صباح مساء hello hi hey');
  var THANKS = norm('شكرا شكرا ليك تسلم متشكر thanks thank you thx');

  function match(q) {
    var n = norm(q);
    if (n.trim().length < 2) return null;
    var words = n.trim().split(' ');
    var hint = pageProduct();
    var best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var it = KB[i], s = 0;
      for (var j = 0; j < it.k.length; j++) {
        var kw = norm(it.k[j]);
        if (n.indexOf(kw) > -1) s += 2 + kw.trim().length / 10;
      }
      if (s > 0 && it.p && it.p === hint) s += 0.6;
      if (s > bestScore) { bestScore = s; best = it; }
    }
    if (best) return best;
    var allThanks = words.every(function (w) { return !w || THANKS.indexOf(' ' + w + ' ') > -1; });
    if (allThanks && words.length) return { thanks: true };
    var allGreet = words.every(function (w) { return !w || GREET.indexOf(' ' + w + ' ') > -1; });
    if (allGreet && words.length) return { greet: true };
    return null;
  }

  /* ---------- UI ---------- */
  var css = [
    '.cdx-btn,.cdx-panel{font-family:"Readex Pro","Segoe UI",system-ui,sans-serif;letter-spacing:0}',
    '.cdx-btn{position:fixed;z-index:60;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);inset-inline-start:max(18px,env(safe-area-inset-left,0px));display:inline-flex;align-items:center;gap:9px;padding:12px 18px;border:1px solid rgba(234,243,251,.22);border-radius:999px;background:#0E2546;color:#EAF3FB;font-size:15px;font-weight:500;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.35)}',
    '.cdx-btn:hover{border-color:#38D3DC}',
    '.cdx-btn:focus-visible,.cdx-panel button:focus-visible,.cdx-panel input:focus-visible,.cdx-panel a:focus-visible{outline:2px solid #38D3DC;outline-offset:2px}',
    '.cdx-btn svg{width:20px;height:20px;flex:none}',
    '.cdx-panel{position:fixed;z-index:61;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);inset-inline-start:max(18px,env(safe-area-inset-left,0px));width:min(380px,calc(100vw - 36px));height:min(560px,calc(100dvh - 36px));display:none;flex-direction:column;background:#081A33;color:#EAF3FB;border:1px solid rgba(234,243,251,.16);border-radius:18px;box-shadow:0 18px 60px rgba(0,0,0,.5);overflow:hidden;font-size:15px;line-height:1.6}',
    '.cdx-panel.on{display:flex}',
    '.cdx-hd{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;background:#0E2546;border-bottom:1px solid rgba(234,243,251,.12)}',
    '.cdx-hd b{display:block;font-size:16px;font-weight:600}',
    '.cdx-hd small{display:block;color:#9DB2C8;font-size:12.5px}',
    '.cdx-x{flex:none;width:34px;height:34px;border:0;border-radius:50%;background:transparent;color:#EAF3FB;font-size:22px;line-height:1;cursor:pointer}',
    '.cdx-x:hover{background:rgba(234,243,251,.1)}',
    '.cdx-log{flex:1;overflow-y:auto;padding:14px 14px 6px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}',
    '.cdx-m{max-width:88%;padding:10px 13px;border-radius:14px;word-wrap:break-word;white-space:pre-line}',
    '.cdx-bot{align-self:flex-start;background:#0E2546;border:1px solid rgba(234,243,251,.1);border-end-start-radius:4px}',
    '.cdx-me{align-self:flex-end;background:linear-gradient(110deg,#1C63B7,#2a8fc9);color:#fff;border-end-end-radius:4px}',
    '.cdx-chips{display:flex;flex-wrap:wrap;gap:7px;align-self:flex-start;max-width:100%}',
    '.cdx-chip,.cdx-link{font:inherit;font-size:13.5px;padding:7px 12px;border-radius:999px;border:1px solid rgba(56,211,220,.5);background:transparent;color:#38D3DC;cursor:pointer;text-decoration:none;display:inline-block}',
    '.cdx-chip:hover,.cdx-link:hover{background:rgba(56,211,220,.12)}',
    '.cdx-link.fill{background:linear-gradient(110deg,#1C63B7,#38D3DC);border-color:transparent;color:#04101f;font-weight:600}',
    '.cdx-form{display:flex;gap:8px;padding:10px 12px 12px;border-top:1px solid rgba(234,243,251,.12);background:#081A33}',
    '.cdx-form input{flex:1;min-width:0;padding:10px 14px;border-radius:999px;border:1px solid rgba(234,243,251,.2);background:#0E2546;color:#EAF3FB;font:inherit;font-size:15px}',
    '.cdx-form input::placeholder{color:#9DB2C8}',
    '.cdx-form button{flex:none;padding:0 16px;border:0;border-radius:999px;background:linear-gradient(110deg,#1C63B7,#38D3DC);color:#04101f;font:inherit;font-size:14px;font-weight:600;cursor:pointer}',
    '@media (max-width:520px){.cdx-btn span{display:none}.cdx-btn{padding:13px}.cdx-panel{inset-inline-start:9px;bottom:9px;width:calc(100vw - 18px);height:min(78dvh,620px)}}',
    '@media (prefers-reduced-motion:no-preference){.cdx-panel.on{animation:cdxIn .18s ease-out}@keyframes cdxIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}}'
  ].join('\n');

  var btn, panel, log, input, titleEl, subEl, sendBtn, xBtn, label;
  var started = false;

  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    btn = el('button', 'cdx-btn'); btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/></svg>';
    label = el('span'); btn.appendChild(label);

    panel = el('section', 'cdx-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false');
    var hd = el('div', 'cdx-hd'), tw = el('div');
    titleEl = el('b'); subEl = el('small'); tw.appendChild(titleEl); tw.appendChild(subEl);
    xBtn = el('button', 'cdx-x', '×'); xBtn.type = 'button';
    hd.appendChild(tw); hd.appendChild(xBtn);
    log = el('div', 'cdx-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite');
    var form = el('form', 'cdx-form'); form.setAttribute('autocomplete', 'off');
    input = el('input'); input.type = 'text'; input.maxLength = 300; input.setAttribute('enterkeyhint', 'send');
    sendBtn = el('button'); sendBtn.type = 'submit';
    form.appendChild(input); form.appendChild(sendBtn);
    panel.appendChild(hd); panel.appendChild(log); panel.appendChild(form);
    document.body.appendChild(btn); document.body.appendChild(panel);

    btn.addEventListener('click', function () { toggle(true); });
    xBtn.addEventListener('click', function () { toggle(false); btn.focus(); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { toggle(false); btn.focus(); } });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim(); if (!v) return;
      input.value = ''; ask(v);
    });
    label_();
    new MutationObserver(function () { label_(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  function label_() {
    var t = T[lang()];
    label.textContent = t.open; btn.setAttribute('aria-label', t.open);
    titleEl.textContent = t.title; subEl.textContent = t.sub;
    input.placeholder = t.ph; input.setAttribute('aria-label', t.ph);
    sendBtn.textContent = t.send; xBtn.setAttribute('aria-label', t.close);
    panel.setAttribute('aria-label', t.title);
    panel.setAttribute('dir', t.dir);
  }

  function toggle(on) {
    panel.classList.toggle('on', on); btn.style.display = on ? 'none' : '';
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) {
      if (!started) { started = true; botSay(T[lang()].hello, START); }
      setTimeout(function () { input.focus(); }, 30);
    }
  }

  function scroll() { log.scrollTop = log.scrollHeight; }
  function say(text, cls) { var m = el('div', 'cdx-m ' + cls, text); log.appendChild(m); scroll(); return m; }

  function chipsRow(ids) {
    var l = lang(), row = el('div', 'cdx-chips');
    ids.forEach(function (id) {
      var it = byId(id); if (!it) return;
      var c = el('button', 'cdx-chip', it.chip[l]); c.type = 'button';
      c.addEventListener('click', function () { ask(it.chip[l], it); });
      row.appendChild(c);
    });
    return row;
  }

  function linkEl(href, text, fill, ext) {
    var a = el('a', 'cdx-link' + (fill ? ' fill' : ''), text); a.href = href;
    if (ext) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }

  function contactRow(withDemo) {
    var l = lang(), t = T[l], row = el('div', 'cdx-chips');
    var subj = l === 'ar' ? 'طلب Demo' : 'Demo request';
    var body = l === 'ar' ? 'أهلاً،\n\nعايز Demo.\n\nالاسم:\nجهة العمل:\nالبرنامج: ONTAP Share Manager / The Clinic\nالميعاد المناسب للمكالمة:\n'
                          : "Hello,\n\nI'd like a demo.\n\nName:\nWorkplace:\nProduct: ONTAP Share Manager / The Clinic\nA good time for a call:\n";
    var mail = 'mailto:' + EMAIL + (withDemo ? '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body) : '');
    row.appendChild(linkEl(mail, t.email + ' · ' + EMAIL, true));
    row.appendChild(linkEl('tel:+' + PHONE, t.call + ' · ' + PHONE.replace(/^20/, '0').replace(/^(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3')));
    row.appendChild(linkEl('https://t.me/' + TELEGRAM, t.tg, false, true));
    return row;
  }

  function botSay(text, chipIds, it) {
    var l = lang();
    say(text, 'cdx-bot');
    if (it && it.link) { var r = el('div', 'cdx-chips'); r.appendChild(linkEl(it.link[l][0], it.link[l][1])); log.appendChild(r); }
    if (it && it.store) { var r2 = el('div', 'cdx-chips'); r2.appendChild(linkEl(STORE_URL, T[l].store, true, true)); log.appendChild(r2); }
    if (it && it.links) { var r3 = el('div', 'cdx-chips'); it.links[l].forEach(function (x) { r3.appendChild(linkEl(x[0], x[1])); }); log.appendChild(r3); }
    if (it && it.contact) log.appendChild(contactRow(!!it.demo));
    if (chipIds && chipIds.length) log.appendChild(chipsRow(chipIds));
    scroll();
  }

  function ask(q, forced) {
    var l = lang(), t = T[l];
    say(q, 'cdx-me');
    var it = forced || match(q);
    setTimeout(function () {
      if (!it) { botSay(t.none, ['osm', 'clinic', 'price', 'demo']); log.appendChild(contactRow(false)); scroll(); return; }
      if (it.thanks) { botSay(t.thanks, START); return; }
      if (it.greet) { botSay(t.hello, START); return; }
      botSay(it.a[l], it.f || [], it);
    }, 220);
  }

  function init() { if (document.body) build(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
