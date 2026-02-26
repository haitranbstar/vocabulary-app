export interface GrammarExample {
  en: string;
  vi: string;
}

export interface GrammarTense {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  structure: string;
  usage: string[];
  signalWords: string[];
  examples: GrammarExample[];
  icon: string;
  color: string;
}

export const grammarTenses: GrammarTense[] = [
  {
    id: "present-simple",
    name: "Present Simple",
    nameVi: "Hiện tại đơn",
    description:
      "Đây là thì được sử dụng nhiều nhất. Bạn dùng nó để nói về sự thật hiển nhiên, thói quen lặp đi lặp lại hàng ngày, hoặc lịch trình cố định.",
    structure: "S + V(s/es) | S + do/does + not + V | Do/Does + S + V?",
    usage: [
      "Diễn tả thói quen lặp đi lặp lại",
      "Sự thật hiển nhiên",
      "Lịch trình cố định",
      "Giới thiệu bản thân",
      "Nói về công việc",
    ],
    signalWords: [
      "always",
      "usually",
      "often",
      "sometimes",
      "every day",
      "every week",
    ],
    examples: [
      {
        en: "I drink coffee every morning.",
        vi: "Tôi uống cà phê mỗi sáng - Thói quen",
      },
      {
        en: "She doesn't work on weekends.",
        vi: "Cô ấy không làm việc vào cuối tuần",
      },
      {
        en: "Do you live near here?",
        vi: "Bạn có sống gần đây không?",
      },
    ],
    icon: "☀️",
    color: "primary",
  },
  {
    id: "past-simple",
    name: "Past Simple",
    nameVi: "Quá khứ đơn",
    description:
      "Dùng để kể lại một sự việc đã xảy ra và kết thúc hoàn toàn trong quá khứ. Trong giao tiếp, thì này đặc biệt quan trọng khi bạn muốn kể chuyện hoặc báo cáo công việc.",
    structure: "S + V(ed/V2) | S + did + not + V | Did + S + V?",
    usage: [
      "Kể lại sự việc đã xảy ra và kết thúc trong quá khứ",
      "Kể chuyện",
      "Báo cáo công việc",
    ],
    signalWords: [
      "yesterday",
      "last night",
      "last week",
      "ago",
      "in 2020",
    ],
    examples: [
      {
        en: "I went to the supermarket last night.",
        vi: "Tối qua tôi đã đi siêu thị",
      },
      {
        en: "We didn't have time for lunch.",
        vi: "Chúng tôi đã không có thời gian ăn trưa",
      },
      {
        en: "Did you send that email?",
        vi: "Bạn đã gửi email đó chưa?",
      },
    ],
    icon: "⏪",
    color: "accent",
  },
  {
    id: "present-continuous",
    name: "Present Continuous",
    nameVi: "Hiện tại tiếp diễn",
    description:
      "Thì này dùng để diễn tả những việc đang diễn ra ngay tại thời điểm nói, hoặc một kế hoạch đã chốt chắc chắn sẽ xảy ra trong tương lai gần.",
    structure: "S + am/is/are + V-ing | S + am/is/are + not + V-ing | Am/Is/Are + S + V-ing?",
    usage: [
      "Diễn tả việc đang diễn ra ngay lúc nói",
      "Kế hoạch chắc chắn trong tương lai gần",
    ],
    signalWords: [
      "now",
      "right now",
      "at the moment",
      "tomorrow (cho kế hoạch)",
    ],
    examples: [
      {
        en: "I can't talk right now, I am driving.",
        vi: "Bây giờ tôi không nói chuyện được, tôi đang lái xe",
      },
      {
        en: "He isn't listening to you.",
        vi: "Anh ta đang không nghe bạn nói đâu",
      },
      {
        en: "We are having dinner with them tonight.",
        vi: "Tối nay chúng tôi sẽ ăn tối cùng họ - Kế hoạch chắc chắn",
      },
    ],
    icon: "🔄",
    color: "success",
  },
  {
    id: "future-simple",
    name: "Future Simple & Be Going To",
    nameVi: "Tương lai đơn & Tương lai gần",
    description:
      "Để nói về tương lai, tiếng Anh giao tiếp phân biệt rõ giữa quyết định nhất thời (will) và kế hoạch đã tính trước (be going to).",
    structure: "S + will + V | S + am/is/are + going to + V",
    usage: [
      "Will: Quyết định bộc phát ngay lúc nói",
      "Will: Lời hứa",
      "Will: Dự đoán không có căn cứ",
      "Be going to: Dự định, kế hoạch đã có từ trước",
      "Be going to: Dự đoán có dấu hiệu rõ ràng",
    ],
    signalWords: [
      "tomorrow",
      "next week",
      "soon",
      "in the future",
      "I think",
      "I promise",
    ],
    examples: [
      {
        en: "I will call you back later.",
        vi: "Tôi sẽ gọi lại cho bạn sau - Lời hứa",
      },
      {
        en: "It's raining! I will take a taxi.",
        vi: "Trời mưa rồi! Tôi sẽ bắt taxi - Quyết định tức thì",
      },
      {
        en: "I am going to buy a new laptop next month.",
        vi: "Tôi dự định mua laptop mới vào tháng sau",
      },
      {
        en: "Look at those dark clouds! It is going to rain.",
        vi: "Nhìn đám mây đen kìa! Trời sắp mưa rồi",
      },
    ],
    icon: "🚀",
    color: "error",
  },
  {
    id: "present-perfect",
    name: "Present Perfect",
    nameVi: "Hiện tại hoàn thành",
    description:
      "Nhiều người học hay sợ thì này, nhưng nó lại cực kỳ hữu dụng. Bạn dùng nó để nói về trải nghiệm (không cần nói rõ thời gian), hoặc một việc bắt đầu trong quá khứ và vẫn còn kéo dài đến hiện tại.",
    structure: "S + have/has + V3/ed | S + have/has + not + V3/ed | Have/Has + S + V3/ed?",
    usage: [
      "Nói về trải nghiệm (không cần nói rõ thời gian)",
      "Việc bắt đầu trong quá khứ và vẫn kéo dài đến hiện tại",
      "Việc vừa mới xảy ra",
    ],
    signalWords: [
      "for",
      "since",
      "just",
      "already",
      "yet",
      "ever",
      "never",
    ],
    examples: [
      {
        en: "I have worked here for 3 years.",
        vi: "Tôi đã làm việc ở đây được 3 năm rồi - Bắt đầu từ 3 năm trước và giờ vẫn làm",
      },
      {
        en: "Have you ever been to Japan?",
        vi: "Bạn đã từng đến Nhật bao giờ chưa? - Hỏi về trải nghiệm",
      },
      {
        en: "I haven't finished the report yet.",
        vi: "Tôi vẫn chưa làm xong báo cáo",
      },
    ],
    icon: "✅",
    color: "primary",
  },
];

export const getTenseById = (id: string): GrammarTense | undefined => {
  return grammarTenses.find((tense) => tense.id === id);
};
